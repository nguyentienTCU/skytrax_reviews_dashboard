export const query = `
SELECT DISTINCT airline AS "airline"
FROM skytrax_reviews_db.marts.fct_review_enriched
WHERE date_submitted_id IS NOT NULL
  AND airline IS NOT NULL
  AND TRIM(airline) <> ''         -- prevent empty/whitespace names
ORDER BY airline;
`;