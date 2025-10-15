import express from "express";
import snowflakeConnection from "../utils/snowflakeClient.js";
import { deslugifyAirline } from "../utils/slugConverter.js";
import { query as summaryQuery } from "../queries/summary.js";
import { query as monthlyMetricsQuery } from "../queries/monthly_metrics.js";
import { query as reviewsOverTimeQuery } from "../queries/reviews_over_time.js";
import { query as avgRecommendationQuery } from "../queries/avg_recommendation.js";
import { query as avgScoreQuery } from "../queries/avg_score.js";
import { query as avgMoneyValueQuery } from "../queries/avg_money_value.js";
import { query as allServicesQuery } from "../queries/all_services.js";
import { query as aircraftAnalysisQuery } from "../queries/aircraft_analysis.js";
import { query as routeAnalysisQuery } from "../queries/route_analysis.js";
import { query as customerAnalysisQuery } from "../queries/customer_analysis.js";
import { query as reviewTextAnalysisQuery } from "../queries/review_text_analysis.js";
import { query as lastRefreshDateQuery } from "../queries/last_refresh_date.js";
import { query as allAirlinesQuery } from "../queries/all_airlines.js";


const router = express.Router();

async function querySnowflake(sqlText, binds = []) {
  return new Promise((resolve, reject) => {
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

router.get("/allAirlines", async (req, res) => {
  try {
    const rows = await querySnowflake(allAirlinesQuery);
    res.json(rows);
  } catch (err) {
    console.error("Query failed for get all airlines:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:airlineSlug/dataSummary", async (req, res) => {
  const { airlineSlug } = req.params;
  const airline = deslugifyAirline(airlineSlug);

  const response = await querySnowflake(summaryQuery, [airline]);
  res.json(response[0] || {});
});

router.get("/:airlineSlug/monthlyMetrics/:mode", async (req, res) => {
  try {
    const { airlineSlug, mode } = req.params;
    const airline = deslugifyAirline(airlineSlug);
    const rows = await querySnowflake(monthlyMetricsQuery, [
      airline,
      mode,
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
      querySnowflake(reviewsOverTimeQuery, [airline]),
      querySnowflake(avgRecommendationQuery, [airline]),
      querySnowflake(avgScoreQuery, [airline]),
      querySnowflake(avgMoneyValueQuery, [airline]),
      querySnowflake(allServicesQuery, [airline]),
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
    const rows = await querySnowflake(aircraftAnalysisQuery, [
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
    const rows = await querySnowflake(routeAnalysisQuery, [airline]);
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
    const rows = await querySnowflake(customerAnalysisQuery, [airline]);
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
    const rows = await querySnowflake(reviewTextAnalysisQuery, [airline]);
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
    const rows = await querySnowflake(lastRefreshDateQuery, [airline]);
    const row = rows?.[0] || {};
    res.json(row);
  }
  catch (err) {
    console.error("Query failed for get last refresh date:", err);
    res.status(500).json({ error: err.message });
  }
})

export default router;
