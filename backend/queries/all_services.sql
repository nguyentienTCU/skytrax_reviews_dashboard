-- :1 = airline

WITH base AS (
  SELECT
    ds.cal_year AS yr,
    TRY_TO_NUMBER(f.seat_comfort::VARCHAR)            AS seat_comfort,
    TRY_TO_NUMBER(f.cabin_staff_service::VARCHAR)     AS cabin_staff_service,
    TRY_TO_NUMBER(f.food_and_beverages::VARCHAR)      AS food_and_beverages,
    TRY_TO_NUMBER(f.ground_service::VARCHAR)          AS ground_service,
    TRY_TO_NUMBER(f.inflight_entertainment::VARCHAR)  AS inflight_entertainment,
    TRY_TO_NUMBER(f.value_for_money::VARCHAR)         AS value_for_money,
    TRY_TO_NUMBER(f.wifi_and_connectivity::VARCHAR)   AS wifi_and_connectivity
  FROM skytrax_reviews_db.marts.fct_review_enriched f
  JOIN skytrax_reviews_db.marts.dim_date ds
    ON f.date_submitted_id = ds.date_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = LOWER(:1)
),

svc_raw AS (
  SELECT yr, 'seat_comfort'            AS service, seat_comfort            AS rating FROM base
  UNION ALL SELECT yr, 'cabin_staff_service'     , cabin_staff_service     FROM base
  UNION ALL SELECT yr, 'food_and_beverages'      , food_and_beverages      FROM base
  UNION ALL SELECT yr, 'ground_service'          , ground_service          FROM base
  UNION ALL SELECT yr, 'inflight_entertainment'  , inflight_entertainment  FROM base
  UNION ALL SELECT yr, 'value_for_money'         , value_for_money         FROM base
  UNION ALL SELECT yr, 'wifi_and_connectivity'   , wifi_and_connectivity   FROM base
),

present_pairs AS (         -- only service/year pairs that exist (matches your JS)
  SELECT DISTINCT yr, service
  FROM svc_raw
  WHERE rating IS NOT NULL
),

counts AS (
  SELECT
    yr,
    service,
    rating::INT AS rating,
    COUNT(*)    AS cnt
  FROM svc_raw
  WHERE rating IS NOT NULL AND rating BETWEEN 1 AND 5
  GROUP BY yr, service, rating
),

ratings AS (
  SELECT SEQ4() + 1 AS rating
  FROM TABLE(GENERATOR(ROWCOUNT => 5))
),

filled AS (
  SELECT
    p.yr,
    p.service,
    r.rating,
    COALESCE(c.cnt, 0) AS cnt
  FROM present_pairs p
  CROSS JOIN ratings r
  LEFT JOIN counts c
    ON c.yr = p.yr AND c.service = p.service AND c.rating = r.rating
),

per_year AS (              -- for each (service,year): {"1": n1, ..., "5": n5}
  SELECT
    service,
    yr,
    OBJECT_AGG(TO_VARCHAR(rating), cnt) AS rating_map
  FROM filled
  GROUP BY service, yr
),

per_service_kv AS (        -- key/value rows to avoid identifier ambiguity
  SELECT
    service                  AS k,
    OBJECT_AGG(TO_VARCHAR(yr), rating_map) AS v
  FROM per_year
  GROUP BY service
)

SELECT
  OBJECT_AGG(k, v) AS "allServices"
FROM per_service_kv;
