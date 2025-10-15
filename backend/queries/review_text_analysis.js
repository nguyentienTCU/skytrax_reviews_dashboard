export const query = `
-- :1 = airline (compare by name; switch to airline_slug if you have it)

WITH base AS (
  SELECT
    f.review_id,
    f.review_text,
    f.seat_type,
    f.average_rating,
    f.rating_band,
    ol.city AS origin_city,
    dl.city AS destination_city,
    a.aircraft_model
  FROM skytrax_reviews_db.marts.fct_review_enriched f
  LEFT JOIN skytrax_reviews_db.marts.dim_location  ol ON f.origin_location_id      = ol.location_id
  LEFT JOIN skytrax_reviews_db.marts.dim_location  dl ON f.destination_location_id = dl.location_id
  LEFT JOIN skytrax_reviews_db.marts.dim_aircraft  a  ON f.aircraft_id             = a.aircraft_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = LOWER(:1)
),

/* Normalize rating band to {bad,medium,good}; others -> NULL (ignored) */
norm AS (
  SELECT
    review_id,
    review_text,
    seat_type,
    average_rating,
    origin_city,
    destination_city,
    aircraft_model,
    CASE LOWER(TRIM(rating_band))
      WHEN 'bad'    THEN 'bad'
      WHEN 'medium' THEN 'medium'
      WHEN 'good'   THEN 'good'
      ELSE NULL
    END AS band,
    /* known checks (NULL if "", NULL, or 'Unknown') */
    IFF(origin_city         IS NOT NULL AND TRIM(origin_city)         <> '' AND origin_city         <> 'Unknown', 1, 0) AS known_origin,
    IFF(destination_city    IS NOT NULL AND TRIM(destination_city)    <> '' AND destination_city    <> 'Unknown', 1, 0) AS known_dest,
    IFF(aircraft_model      IS NOT NULL AND TRIM(aircraft_model)      <> '' AND aircraft_model      <> 'Unknown', 1, 0) AS known_model,
    IFF(seat_type           IS NOT NULL AND TRIM(seat_type)           <> '' AND seat_type           <> 'Unknown', 1, 0) AS known_seat,
    IFF(review_text         IS NOT NULL AND TRIM(review_text)         <> '' AND review_text         <> 'Unknown', 1, 0) AS known_text
  FROM base
),

/* First qualifying sample per band (review_id order is arbitrary; use another column to prefer recency if you like) */
band_samples AS (
  SELECT
    band,
    review_text,
    origin_city,
    destination_city,
    aircraft_model,
    seat_type,
    average_rating,
    ROW_NUMBER() OVER (PARTITION BY band ORDER BY review_id) AS rn
  FROM norm
  WHERE band IS NOT NULL
    AND known_text = 1
    AND known_origin = 1
    AND known_dest = 1
    AND known_model = 1
    AND known_seat = 1
    AND average_rating IS NOT NULL
),
picked AS (
  SELECT *
  FROM band_samples
  WHERE rn = 1
),

/* Ensure we output all three bands, filling defaults when missing */
bands AS (
  SELECT column1 AS band FROM VALUES ('bad'), ('medium'), ('good')
),
samples_filled AS (
  SELECT
    b.band,
    COALESCE(p.review_text,     '')  AS review_text,
    COALESCE(p.origin_city,     '')  AS origin_city,
    COALESCE(p.destination_city,'')  AS destination_city,
    COALESCE(p.aircraft_model,  '')  AS aircraft_model,
    COALESCE(p.seat_type,       '')  AS seat_type,
    COALESCE(p.average_rating,   0)  AS average_rating
  FROM bands b
  LEFT JOIN picked p ON p.band = b.band
),

/* Build the object: { bad: {...}, medium: {...}, good: {...} } */
sample_reviews_json AS (
  SELECT
    OBJECT_AGG(
      band,
      OBJECT_CONSTRUCT(
        'reviewText',     review_text,
        'originCity',     origin_city,
        'destinationCity',destination_city,
        'aircraftModel',  aircraft_model,
        'seatType',       seat_type,
        'averageRating',  average_rating
      )
    ) AS obj
  FROM samples_filled
),

/* Percentages for bands (over known bands only) -> [badPct, mediumPct, goodPct] */
band_counts AS (
  SELECT band, COUNT(*) AS cnt
  FROM norm
  WHERE band IS NOT NULL
  GROUP BY band
),
tot AS (
  SELECT COALESCE(SUM(cnt), 0) AS total_cnt FROM band_counts
),
bad_cnt    AS (SELECT COALESCE(MAX(cnt), 0) AS c FROM band_counts WHERE band = 'bad'),
medium_cnt AS (SELECT COALESCE(MAX(cnt), 0) AS c FROM band_counts WHERE band = 'medium'),
good_cnt   AS (SELECT COALESCE(MAX(cnt), 0) AS c FROM band_counts WHERE band = 'good'),
band_pct_json AS (
  SELECT
    ARRAY_CONSTRUCT(
      /* bad, medium, good */
      IFF((SELECT total_cnt FROM tot) = 0, 0,
          ROUND(100.0 * (SELECT c FROM bad_cnt)    / NULLIF((SELECT total_cnt FROM tot), 0), 2)),
      IFF((SELECT total_cnt FROM tot) = 0, 0,
          ROUND(100.0 * (SELECT c FROM medium_cnt) / NULLIF((SELECT total_cnt FROM tot), 0), 2)),
      IFF((SELECT total_cnt FROM tot) = 0, 0,
          ROUND(100.0 * (SELECT c FROM good_cnt)   / NULLIF((SELECT total_cnt FROM tot), 0), 2))
    ) AS arr
)

SELECT
  s.obj AS "sampleReviews",
  p.arr AS "ratingBandsTypeCount"
FROM sample_reviews_json s
CROSS JOIN band_pct_json p;
`