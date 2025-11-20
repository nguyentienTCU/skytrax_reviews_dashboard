export const query = `
SELECT
    COUNT(*) AS "totalReviews",
    100.0 * COUNT_IF(f.verified) / NULLIF(COUNT(*), 0) AS "totalVerifiedReviews",
    COUNT(DISTINCT a.aircraft_model) AS "totalAircraftModels",
    COUNT(DISTINCT c.nationality) AS "totalCountries",
FROM skytrax_reviews_db.marts.fct_review_enriched AS f
LEFT JOIN skytrax_reviews_db.marts.dim_customer  AS c  ON f.customer_id = c.customer_id
LEFT JOIN skytrax_reviews_db.marts.dim_aircraft  AS a  ON f.aircraft_id = a.aircraft_id
WHERE f.date_submitted_id IS NOT NULL
  AND LOWER(f.airline) = LOWER(:1);
`