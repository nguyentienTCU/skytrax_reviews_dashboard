WITH
params AS (
  SELECT
    LOWER(:1)                                                   AS airline,   -- pass airline name; switch to airline_slug if needed
    REGEXP_REPLACE(LOWER(:2), '[-_]+', ' ')                     AS mode       -- 'previous-month' -> 'previous month'
),

base AS (
  SELECT
    f.recommended,                     -- BOOLEAN or Y/N/1/0; adjust IFF below if needed
    f.value_for_money,                 -- numeric-ish
    f.average_rating,                  -- numeric-ish
    ds.cal_year,
    ds.cal_month
  FROM skytrax_reviews_db.marts.fct_review_enriched AS f
  JOIN skytrax_reviews_db.marts.dim_date AS ds
    ON f.date_submitted_id = ds.date_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = (SELECT airline FROM params)
),

-- Current calendar month based on CURRENT_DATE()
now_parts AS (
  SELECT
    YEAR(CURRENT_DATE())  AS cur_y,
    MONTH(CURRENT_DATE()) AS cur_m
),

-- Previous month with year rollover
prev_m_parts AS (
  SELECT
    YEAR(DATEADD(month, -1, CURRENT_DATE()))   AS prevm_y,
    MONTH(DATEADD(month, -1, CURRENT_DATE()))  AS prevm_m
),

-- Previous year (same calendar month as current)
prev_y_parts AS (
  SELECT
    YEAR(DATEADD(year, -1, CURRENT_DATE())) AS prevy_y,
    MONTH(CURRENT_DATE())                   AS prevy_m
),

cur AS (
  SELECT b.*
  FROM base b, now_parts n
  WHERE b.cal_year = n.cur_y AND b.cal_month = n.cur_m
),

prev_month AS (
  SELECT b.*
  FROM base b, prev_m_parts p
  WHERE b.cal_year = p.prevm_y AND b.cal_month = p.prevm_m
),

prev_year AS (
  SELECT b.*
  FROM base b, prev_y_parts p
  WHERE b.cal_year = p.prevy_y AND b.cal_month = p.prevy_m
),

-- Pick the comparison set from :2
prev AS (
  SELECT * FROM prev_month WHERE (SELECT mode FROM params) = 'previous month'
  UNION ALL
  SELECT * FROM prev_year  WHERE (SELECT mode FROM params) = 'previous year'
),

agg AS (
  SELECT
    /* Recommendation % (treat NULL as false) */
    ROUND(COALESCE(100.0 * AVG(IFF(NVL(recommended, FALSE), 1, 0)), 0), 2)                         AS currentPercentage,
    ROUND(
      COALESCE(100.0 * AVG(IFF(NVL(recommended, FALSE), 1, 0)), 0)
      - COALESCE((SELECT 100.0 * AVG(IFF(NVL(recommended, FALSE), 1, 0)) FROM prev), 0)
    , 2)                                                                                           AS percentageChange,

    /* Value for Money (mean) */
    ROUND(COALESCE(AVG(TRY_TO_NUMBER(value_for_money::VARCHAR)), 0), 2)                            AS currentScore,
    ROUND(
      COALESCE(AVG(TRY_TO_NUMBER(value_for_money::VARCHAR)), 0)
      - COALESCE((SELECT AVG(TRY_TO_NUMBER(value_for_money::VARCHAR)) FROM prev), 0)
    , 2)                                                                                           AS scoreChange,

    /* Average Rating (mean) */
    ROUND(COALESCE(AVG(TRY_TO_NUMBER(average_rating::VARCHAR)), 0), 2)                             AS currentRating,
    ROUND(
      COALESCE(AVG(TRY_TO_NUMBER(average_rating::VARCHAR)), 0)
      - COALESCE((SELECT AVG(TRY_TO_NUMBER(average_rating::VARCHAR)) FROM prev), 0)
    , 2)                                                                                           AS ratingChange,

    /* Counts */
    COUNT(*)                                                                                       AS currentTotal,
    (COUNT(*) - COALESCE((SELECT COUNT(*) FROM prev), 0))                                          AS totalChange
  FROM cur
)

SELECT
  a.currentPercentage  AS "currentPercentage",
  a.percentageChange   AS "percentageChange",
  a.currentScore       AS "currentScore",
  a.scoreChange        AS "scoreChange",
  a.currentRating      AS "currentRating",
  a.ratingChange       AS "ratingChange",
  a.currentTotal       AS "currentTotal",
  a.totalChange        AS "totalChange",
  -- Month label based on CURRENT_DATE() (to mirror your JS)
  TO_CHAR(CURRENT_DATE(), 'MMMM') || ' - ' || TO_CHAR(CURRENT_DATE(), 'YYYY') AS "month"
FROM agg a;
