-- :1 = airline (compare by name; switch to airline_slug if needed)

WITH base AS (
  SELECT
    a.aircraft_manufacturer,
    a.aircraft_model
  FROM skytrax_reviews_db.marts.fct_review_enriched f
  LEFT JOIN skytrax_reviews_db.marts.dim_aircraft a
    ON f.aircraft_id = a.aircraft_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = LOWER(:1)
),

total AS (
  SELECT COUNT(*) AS total_cnt FROM base
),

manuf_counts AS (
  SELECT
    COALESCE(NULLIF(TRIM(aircraft_manufacturer), ''), 'Unknown') AS manufacturer,
    COUNT(*) AS cnt
  FROM base
  GROUP BY 1
),

manuf_ranked AS (
  SELECT
    mc.manufacturer,
    mc.cnt,
    t.total_cnt,
    ROW_NUMBER() OVER (ORDER BY mc.cnt DESC, mc.manufacturer) AS rnk
  FROM manuf_counts mc
  CROSS JOIN total t
),

top5 AS (
  SELECT manufacturer, cnt, total_cnt
  FROM manuf_ranked
  WHERE rnk <= 5
),

unknown_in_top5 AS (
  SELECT CASE WHEN COUNT_IF(manufacturer = 'Unknown') > 0 THEN 1 ELSE 0 END AS flag
  FROM top5
),

unknown_row AS (
  SELECT
    'Unknown' AS manufacturer,
    COALESCE((SELECT cnt FROM manuf_counts WHERE manufacturer = 'Unknown'), 0) AS cnt,
    (SELECT total_cnt FROM total) AS total_cnt
),

manuf_selected AS (
  -- If Unknown is in top5 -> take top5
  -- else -> top4 + Unknown
  SELECT manufacturer, cnt, total_cnt
  FROM top5
  WHERE (SELECT flag FROM unknown_in_top5) = 1

  UNION ALL

  SELECT manufacturer, cnt, total_cnt
  FROM manuf_ranked
  WHERE (SELECT flag FROM unknown_in_top5) = 0
    AND rnk <= 4

  UNION ALL

  SELECT manufacturer, cnt, total_cnt
  FROM unknown_row
  WHERE (SELECT flag FROM unknown_in_top5) = 0
),

-- Build the JSON array for manufacturers
manuf_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'manufacturer', manufacturer,
        'count',        cnt,
        'percentage',   ROUND(100.0 * cnt / NULLIF(total_cnt, 0), 2)
      )
    ) WITHIN GROUP (ORDER BY cnt DESC, manufacturer) AS arr
  FROM manuf_selected
),

-- Models: top 6 by count
model_counts AS (
  SELECT
    COALESCE(NULLIF(TRIM(aircraft_model), ''), 'Unknown') AS model,
    COUNT(*) AS cnt
  FROM base
  GROUP BY 1
  QUALIFY ROW_NUMBER() OVER (ORDER BY cnt DESC, model) <= 6
),

model_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'model', model,
        'count', cnt
      )
    ) WITHIN GROUP (ORDER BY cnt DESC, model) AS arr
  FROM model_counts
)

SELECT
  m.arr AS "aircraftManufacturersPercentage",
  d.arr AS "aircraftModels"
FROM manuf_json m
CROSS JOIN model_json d;
