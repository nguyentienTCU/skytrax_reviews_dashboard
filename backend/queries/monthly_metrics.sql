WITH
params AS (
  SELECT
    LOWER(:1)                                                             AS airline,
    REPLACE(REPLACE(LOWER(:2), '_', ' '), '-', ' ')                       AS mode    -- normalize
),
base AS (
  SELECT
    f.recommended,
    f.value_for_money,
    f.average_rating,
    ds.cal_year,
    ds.cal_month
  FROM skytrax_reviews_db.marts.fct_review_enriched f
  JOIN skytrax_reviews_db.marts.dim_date ds
    ON f.date_submitted_id = ds.date_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = (SELECT airline FROM params)
),
bounds AS (
  SELECT
    YEAR(CURRENT_DATE())                                AS cur_y,
    MONTH(CURRENT_DATE())                               AS cur_m,
    YEAR(DATEADD(month, -1, CURRENT_DATE()))            AS prevm_y,
    MONTH(DATEADD(month, -1, CURRENT_DATE()))           AS prevm_m,
    YEAR(DATEADD(year, -1,  CURRENT_DATE()))            AS prevy_y,
    MONTH(CURRENT_DATE())                               AS prevy_m
),
cur AS (
  SELECT b.*
  FROM base b, bounds
  WHERE b.cal_year = bounds.cur_y AND b.cal_month = bounds.cur_m
),
prev_month AS (
  SELECT b.*
  FROM base b, bounds
  WHERE b.cal_year = bounds.prevm_y AND b.cal_month = bounds.prevm_m
),
prev_year AS (
  SELECT b.*
  FROM base b, bounds
  WHERE b.cal_year = bounds.prevy_y AND b.cal_month = bounds.prevy_m
),
prev AS (
  SELECT * FROM prev_month WHERE (SELECT mode FROM params) = 'previous month'
  UNION ALL
  SELECT * FROM prev_year  WHERE (SELECT mode FROM params) = 'previous year'
)
SELECT
  /* recommendationPercentage */
  ROUND(COALESCE(100.0 * AVG(IFF(recommended, 1, 0)), 0), 2)                                          AS "currentPercentage",
  ROUND(
    COALESCE(100.0 * AVG(IFF(recommended, 1, 0)), 0)
    - COALESCE((SELECT 100.0 * AVG(IFF(recommended, 1, 0)) FROM prev), 0)
  , 2)                                                                                                 AS "percentageChange",

  /* vfmScore */
  ROUND(COALESCE(AVG(value_for_money), 0), 2)                                                          AS "currentScore",
  ROUND(
    COALESCE(AVG(value_for_money), 0)
    - COALESCE((SELECT AVG(value_for_money) FROM prev), 0)
  , 2)                                                                                                 AS "scoreChange",

  /* averageRating */
  ROUND(COALESCE(AVG(average_rating), 0), 2)                                                           AS "currentRating",
  ROUND(
    COALESCE(AVG(average_rating), 0)
    - COALESCE((SELECT AVG(average_rating) FROM prev), 0)
  , 2)                                                                                                 AS "ratingChange",

  /* totalNumberOfReviews */
  COUNT(*)                                                                                              AS "currentTotal",
  (COUNT(*) - COALESCE((SELECT COUNT(*) FROM prev), 0))                                                 AS "totalChange",

  /* month */
  (TO_VARCHAR(CURRENT_DATE(), 'Month') || ' - ' || TO_CHAR(CURRENT_DATE(), 'YYYY'))                     AS "month"
FROM cur;
