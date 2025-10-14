-- :1 = airline (compare by name; switch to airline_slug if needed)

WITH base AS (
  SELECT
    COALESCE(NULLIF(TRIM(c.nationality), ''), NULL)               AS nationality,
    f.verified,
    /* normalize seat type into the target set (others -> 'Unknown') */
    CASE
      WHEN f.seat_type IN ('Economy Class','Business Class','First Class','Premium Economy')
        THEN f.seat_type
      WHEN f.seat_type IS NULL OR TRIM(f.seat_type) = '' THEN 'Unknown'
      ELSE 'Unknown'
    END                                                          AS seat_type_norm,
    /* normalize traveller type into the target set (others -> 'Unknown') */
    CASE
      WHEN f.type_of_traveller IN ('Couple Leisure','Solo Leisure','Business','Family Leisure')
        THEN f.type_of_traveller
      WHEN f.type_of_traveller IS NULL OR TRIM(f.type_of_traveller) = '' THEN 'Unknown'
      ELSE 'Unknown'
    END                                                          AS traveller_type_norm
  FROM skytrax_reviews_db.marts.fct_review_enriched f
  LEFT JOIN skytrax_reviews_db.marts.dim_customer c
    ON f.customer_id = c.customer_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = LOWER(:1)
),

tot AS (
  SELECT COUNT(*) AS total_reviews FROM base
),

/* --------- reviewsByCountry: Top 7 by count --------- */
country_counts AS (
  SELECT
    nationality AS country,
    COUNT(*)    AS cnt
  FROM base
  WHERE nationality IS NOT NULL
  GROUP BY nationality
  QUALIFY ROW_NUMBER() OVER (ORDER BY cnt DESC, country) <= 7
),
country_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT('country', country, 'count', cnt)
    ) WITHIN GROUP (ORDER BY cnt DESC, country) AS arr
  FROM country_counts
),

/* --------- verifiedAndUnverifiedReviews --------- */
verified_json AS (
  SELECT
    OBJECT_CONSTRUCT(
      'verified',   ROUND(100.0 * AVG(IFF(verified, 1, 0)), 2),
      'unverified', ROUND(100.0 * (1 - AVG(IFF(verified, 1, 0))), 2)
    ) AS obj
  FROM base
),

/* --------- seat types: percentages over total; include Unknown only if present --------- */
seat_counts AS (
  SELECT seat_type_norm AS seat_type, COUNT(*) AS cnt
  FROM base
  GROUP BY seat_type_norm
),
seat_has_unknown AS (
  SELECT IFF(SUM(IFF(seat_type = 'Unknown', cnt, 0)) > 0, 1, 0) AS has_unknown
  FROM seat_counts
),
seat_selected AS (
  /* Keep only the target set; add Unknown only if present in data */
  SELECT seat_type, cnt FROM seat_counts
  WHERE seat_type IN ('Economy Class','Business Class','First Class','Premium Economy')
  UNION ALL
  SELECT seat_type, cnt FROM seat_counts
  WHERE seat_type = 'Unknown' AND (SELECT has_unknown FROM seat_has_unknown) = 1
),
seat_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'seatType',   seat_type,
        'percentage', ROUND(100.0 * cnt / NULLIF((SELECT total_reviews FROM tot), 0), 2)
      )
    ) WITHIN GROUP (ORDER BY /* optional: by percentage desc then name */
                    (cnt / NULLIF((SELECT total_reviews FROM tot), 0)) DESC, seat_type) AS arr
  FROM seat_selected
),

/* --------- traveller types: percentages over total; include Unknown only if present --------- */
trav_counts AS (
  SELECT traveller_type_norm AS traveller_type, COUNT(*) AS cnt
  FROM base
  GROUP BY traveller_type_norm
),
trav_has_unknown AS (
  SELECT IFF(SUM(IFF(traveller_type = 'Unknown', cnt, 0)) > 0, 1, 0) AS has_unknown
  FROM trav_counts
),
trav_selected AS (
  SELECT traveller_type, cnt FROM trav_counts
  WHERE traveller_type IN ('Couple Leisure','Solo Leisure','Business','Family Leisure')
  UNION ALL
  SELECT traveller_type, cnt FROM trav_counts
  WHERE traveller_type = 'Unknown' AND (SELECT has_unknown FROM trav_has_unknown) = 1
),
trav_json AS (
  SELECT
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'travellerType', traveller_type,
        'percentage',    ROUND(100.0 * cnt / NULLIF((SELECT total_reviews FROM tot), 0), 2)
      )
    ) WITHIN GROUP (ORDER BY (cnt / NULLIF((SELECT total_reviews FROM tot), 0)) DESC, traveller_type) AS arr
  FROM trav_selected
)

SELECT
  c.arr AS "reviewsByCountry",
  v.obj AS "verifiedAndUnverifiedReviews",
  s.arr AS "aircraftSeatTypePercentage",
  t.arr AS "travellerTypePercentage"
FROM country_json c
CROSS JOIN verified_json v
CROSS JOIN seat_json s
CROSS JOIN trav_json t;
