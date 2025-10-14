WITH base AS (
  SELECT
    ds.cal_year                      AS year,
    f.recommended,
    f.average_rating,
    f.value_for_money,
    f.seat_comfort,
    f.cabin_staff_service,
    f.food_and_beverages,
    f.ground_service,
    f.inflight_entertainment,
    f.wifi_and_connectivity
  FROM skytrax_reviews_db.marts.fct_review_enriched AS f
  JOIN skytrax_reviews_db.marts.dim_date AS ds
    ON f.date_submitted_id = ds.date_id
  WHERE f.date_submitted_id IS NOT NULL
    AND LOWER(f.airline) = LOWER(:1)     -- or airline_slug = :1
)
SELECT
  year                              AS "year",
  COUNT(*)                          AS "count",
FROM base
GROUP BY year
ORDER BY year;