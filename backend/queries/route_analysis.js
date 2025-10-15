export const query = `
-- :1 = airline (compare to name; switch to airline_slug if needed)

WITH base AS (
  SELECT
    -- normalize city names; map NULL/blank to 'Unknown'
    COALESCE(NULLIF(TRIM(ol.city), ''), 'Unknown') AS origin_city,
    COALESCE(NULLIF(TRIM(dl.city), ''), 'Unknown') AS destination_city,
    f.average_rating
  FROM skytrax_reviews_db.marts.fct_review_enriched f
  LEFT JOIN skytrax_reviews_db.marts.dim_location  ol ON f.origin_location_id      = ol.location_id
  LEFT JOIN skytrax_reviews_db.marts.dim_location  dl ON f.destination_location_id = dl.location_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = LOWER(:1)
),

-- ---------- Top origin cities (top 6 by count) ----------
origin_counts AS (
  SELECT origin_city AS city, COUNT(*) AS cnt
  FROM base
  GROUP BY origin_city
  QUALIFY ROW_NUMBER() OVER (ORDER BY cnt DESC, city) <= 6
),

-- ---------- Top destination cities (top 6 by count) ----------
dest_counts AS (
  SELECT destination_city AS city, COUNT(*) AS cnt
  FROM base
  GROUP BY destination_city
  QUALIFY ROW_NUMBER() OVER (ORDER BY cnt DESC, city) <= 6
),

-- ---------- Top routes (top 5 by count) ----------
-- JS logic: require origin & destination present/not 'Unknown', and rating present
routes_agg AS (
  SELECT
    origin_city      AS origin,
    destination_city AS destination,
    COUNT(*)         AS cnt,
    AVG(average_rating) AS avg_rating
  FROM base
  WHERE origin_city <> 'Unknown'
    AND destination_city <> 'Unknown'
    AND average_rating IS NOT NULL
  GROUP BY origin_city, destination_city
  QUALIFY ROW_NUMBER() OVER (ORDER BY cnt DESC, avg_rating DESC, origin, destination) <= 5
),

-- Build JSON arrays
origin_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'city',  city,
        'count', cnt
      )
    ) WITHIN GROUP (ORDER BY cnt DESC, city) AS arr
  FROM origin_counts
),
dest_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'city',  city,
        'count', cnt
      )
    ) WITHIN GROUP (ORDER BY cnt DESC, city) AS arr
  FROM dest_counts
),
routes_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'origin',         origin,
        'destination',    destination,
        'count',          cnt,
        'averageRating',  ROUND(avg_rating, 2)
      )
    ) WITHIN GROUP (ORDER BY cnt DESC, avg_rating DESC, origin, destination) AS arr
  FROM routes_agg
)

SELECT
  o.arr AS "topOriginCities",
  d.arr AS "topDestinationCities",
  r.arr AS "topRoutes"
FROM origin_json o
CROSS JOIN dest_json d
CROSS JOIN routes_json r;
`