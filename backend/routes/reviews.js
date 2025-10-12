import express from "express";
import snowflakeConnection from "../utils/snowflakeClient.js";
import { deslugifyAirline } from "../utils/slugConverter.js";
import { loadSQL } from "../utils/loadSQL.js";

const router = express.Router();

const baseSQL = `
      SELECT
        f.review_id,
        f.airline,                              -- <-- crucial for grouping
        c.customer_name,
        c.nationality,
        c.number_of_flights,
        f.date_submitted_id,
        ds.day_of_week_name       AS review_day_of_week_name,
        ds.cal_month              AS review_cal_month,
        ds.cal_mon_name           AS review_cal_mon_name,
        ds.cal_year               AS review_cal_year,
        f.date_flown_id,
        ol.city                   AS origin_city,
        ol.airport                AS origin_airport,
        f.destination_location_id,
        dl.city                   AS destination_city,
        dl.airport                AS destination_airport,
        f.transit_location_id,
        tl.city                   AS transit_city,
        tl.airport                AS transit_airport,
        f.aircraft_id,
        a.aircraft_model,
        a.aircraft_manufacturer,
        a.seat_capacity,
        f.verified,
        f.seat_type,
        f.type_of_traveller,
        f.seat_comfort,
        f.cabin_staff_service,
        f.food_and_beverages,
        f.inflight_entertainment,
        f.ground_service,
        f.wifi_and_connectivity,
        f.value_for_money,
        f.average_rating,
        f.rating_band,
        f.recommended,
        f.review_text,
        f.el_updated_at,
        f.t_updated_at
      FROM skytrax_reviews_db.marts.fct_review_enriched AS f
      LEFT JOIN skytrax_reviews_db.marts.dim_date      AS ds ON f.date_submitted_id     = ds.date_id
      LEFT JOIN skytrax_reviews_db.marts.dim_date      AS df ON f.date_flown_id         = df.date_id
      LEFT JOIN skytrax_reviews_db.marts.dim_customer  AS c  ON f.customer_id           = c.customer_id
      LEFT JOIN skytrax_reviews_db.marts.dim_location  AS ol ON f.origin_location_id    = ol.location_id
      LEFT JOIN skytrax_reviews_db.marts.dim_location  AS dl ON f.destination_location_id = dl.location_id
      LEFT JOIN skytrax_reviews_db.marts.dim_location  AS tl ON f.transit_location_id   = tl.location_id
      LEFT JOIN skytrax_reviews_db.marts.dim_aircraft  AS a  ON f.aircraft_id           = a.aircraft_id
      WHERE f.date_submitted_id IS NOT NULL
      ORDER BY f.review_id DESC
    `

async function querySnowflake(sqlFile, binds = []) {
  return new Promise((resolve, reject) => {
    const sqlText = loadSQL(sqlFile);

    snowflakeConnection.execute({
      sqlText,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    });
  });
}

router.get("/:airlineSlug/summary", async (req, res) => {
  const { airlineSlug } = req.params;
  const airline = deslugifyAirline(airlineSlug);

  const response = await querySnowflake("./queries/summary.sql", [airline]) 
  res.json(response[0] || {});
})

router.get("/:airlineSlug/monthlyMetrics/:mode", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const response = await querySnowflake("./queries/monthly_metrics.sql", [airline, "mode"]);
    res.json(response[0] || {});
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:airlineSlug/timeBasedAnalysis", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    
    const [
      reviewsOverTime,
      avgRecommendation,
      avgScore,
      avgMoneyValue,
      allServices
    ] = await Promise.all([
      querySnowflake("./queries/reviews_over_time.sql", [airline]),
      querySnowflake("./queries/avg_recommendation.sql", [airline]),
      querySnowflake("./queries/avg_score.sql", [airline]),
      querySnowflake("./queries/avg_money_value.sql", [airline]),
      querySnowflake("./queries/all_services.sql", [airline])
    ]);

    let allServicesJson = allServices[0]?.allServices || {};

    res.json({
      reviewsOverTime,
      avgRecommendation,
      avgScore,
      avgMoneyValue,
      allServices: allServicesJson
    });

  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;