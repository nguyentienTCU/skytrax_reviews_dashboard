SELECT
  TO_VARCHAR(MAX(f.el_updated_at), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS last_refresh_utc
FROM skytrax_reviews_db.marts.fct_review_enriched f
WHERE f.date_submitted_id IS NOT NULL
  AND LOWER(f.airline) = LOWER(:1);