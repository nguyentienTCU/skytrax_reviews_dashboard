import express from "express";
import snowflakeConnection from "../utils/snowflakeClient.js";
import { deslugifyAirline } from "../utils/slugConverter.js";
import { loadSQL } from "../utils/loadSQL.js";

const router = express.Router();

async function querySnowflake(sqlFile, binds = []) {
  return new Promise((resolve, reject) => {
    const sqlText = loadSQL(sqlFile);

    snowflakeConnection.execute({
      sqlText,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve(rows);
      },
    });
  });
}

router.get("/:airlineSlug/dataSummary", async (req, res) => {
  const { airlineSlug } = req.params;
  const airline = deslugifyAirline(airlineSlug);

  const response = await querySnowflake("./queries/summary.sql", [airline]);
  res.json(response[0] || {});
});

router.get("/:airlineSlug/monthlyMetrics/:mode", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake("./queries/monthly_metrics.sql", [
      airline,
      "mode",
    ]);
    const row = rows[0]
    res.json({
      recommendationPercentage: {
        currentPercentage: row.currentPercentage,
        percentageChange: row.percentageChange,
      },
      vfmScore: {
        currentScore: row.currentScore,
        scoreChange: row.scoreChange,
      },
      averageRating: {
        currentRating: row.currentRating,
        ratingChange: row.ratingChange,
      },
      totalNumberOfReviews: {
        currentTotal: row.currentTotal,
        totalChange: row.totalChange,
      },
      month: row.month
      
    } || {});
  } catch (err) {
    console.error("Query failed for get monthly metrics:", err);
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
      allServices,
    ] = await Promise.all([
      querySnowflake("./queries/reviews_over_time.sql", [airline]),
      querySnowflake("./queries/avg_recommendation.sql", [airline]),
      querySnowflake("./queries/avg_score.sql", [airline]),
      querySnowflake("./queries/avg_money_value.sql", [airline]),
      querySnowflake("./queries/all_services.sql", [airline]),
    ]);

    let allServicesJson = allServices[0]?.allServices || {};

    res.json({
      reviewsOverTime,
      avgRecommendation,
      avgScore,
      avgMoneyValue,
      allServices: allServicesJson,
    });
  } catch (err) {
    console.error("Query failed for get time based analysis:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:airlineSlug/aircraftAnalysis", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake("./queries/aircraft_analysis.sql", [
      airline,
    ]);
    const row = rows?.[0] || {};
    res.json(row);
  } catch (err) {
    console.error("Query failed for get aircraft analysis:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:airlineSlug/routeAnalysis", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake("./queries/route_analysis.sql", [airline]);
    const row = rows?.[0] || {};
    res.json(row);
  }
  catch (err) {
    console.error("Query failed for get route analysis:", err);
    res.status(500).json({ error: err.message });
  }
})

router.get("/:airlineSlug/customerAnalysis", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake("./queries/customer_analysis.sql", [airline]);
    const row = rows?.[0] || {};
    res.json(row);
  }
  catch (err) {
    console.error("Query failed for get customer analysis:", err);
    res.status(500).json({ error: err.message });
  }
})

router.get("/:airlineSlug/reviewTextAnalysis", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake("./queries/review_text_analysis.sql", [airline]);
    const row = rows?.[0] || {};
    res.json(row);
  }
  catch (err) {
    console.error("Query failed for get review test analysis:", err);
    res.status(500).json({ error: err.message });
  }
})

router.get("/:airlineSlug/lastRefreshDate", async (req, res) => {
  try {
    const { airlineSlug } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake("./queries/last_refresh_date.sql", [airline]);
    const row = rows?.[0] || {};
    res.json(row);
  }
  catch (err) {
    console.error("Query failed for get last refresh date:", err);
    res.status(500).json({ error: err.message });
  }
})

router.get("/allAirlines", async (req, res) => {
  try {
    const rows = await querySnowflake("./queries/all_airlines.sql");
    res.json(rows);
  } catch (err) {
    console.error("Query failed for get all airlines:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
