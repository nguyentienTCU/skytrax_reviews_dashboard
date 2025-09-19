import { executeQuery, connectToSnowflake } from "./snowflake";
import { uploadFileToS3Bucket } from "./s3-utils";
import {
  preProcessDataSummary,
  preProcessMonthlyMetrics,
  preProcessTimebasedAnalysis,
  preProcessAircraftAnalysis,
  preProcessRouteAnalysis,
  preProcessCustomerAnalysis,
  preProcessReviewTextAnalysis,
} from "./preProcessData";
import { Review } from "@/type/Review";

const BUCKET = "skytrax-review-production"; // new bucket name

function slugifyAirline(name: string) {
  return (name || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function processAndUploadForAirline(airline: string, data: Review[]) {
  const slug = slugifyAirline(airline);
  const baseKey = `${slug}/data`;

  // ---- run your existing preprocessors on this airline's slice ----
  const dataSummary = preProcessDataSummary(data);
  const monthlyMetricsPrevMonth = preProcessMonthlyMetrics(data, "previous month");
  const monthlyMetricsPrevYear = preProcessMonthlyMetrics(data, "previous year");
  const timebasedAnalysis = preProcessTimebasedAnalysis(data);
  const aircraftAnalysis = preProcessAircraftAnalysis(data);
  const routeAnalysis = preProcessRouteAnalysis(data);
  const customerAnalysis = preProcessCustomerAnalysis(data);
  const reviewTextAnalysis = preProcessReviewTextAnalysis(data);

  // ---- upload all artifacts under airline-partitioned keys ----
  await Promise.all([
    uploadFileToS3Bucket(JSON.stringify(data),                      BUCKET, `${baseKey}/reviews.json`),
    uploadFileToS3Bucket(JSON.stringify(dataSummary),               BUCKET, `${baseKey}/data_summary.json`),
    uploadFileToS3Bucket(JSON.stringify(monthlyMetricsPrevMonth),   BUCKET, `${baseKey}/monthly_metrics_prev_month.json`),
    uploadFileToS3Bucket(JSON.stringify(monthlyMetricsPrevYear),    BUCKET, `${baseKey}/monthly_metrics_prev_year.json`),
    uploadFileToS3Bucket(JSON.stringify(timebasedAnalysis),         BUCKET, `${baseKey}/timebased_analysis.json`),
    uploadFileToS3Bucket(JSON.stringify(aircraftAnalysis),          BUCKET, `${baseKey}/aircraft_analysis.json`),
    uploadFileToS3Bucket(JSON.stringify(routeAnalysis),             BUCKET, `${baseKey}/route_analysis.json`),
    uploadFileToS3Bucket(JSON.stringify(customerAnalysis),          BUCKET, `${baseKey}/customer_analysis.json`),
    uploadFileToS3Bucket(JSON.stringify(reviewTextAnalysis),        BUCKET, `${baseKey}/review_text_analysis.json`),
  ]);

  return { airline, slug, count: data.length };
}

export async function fetchAndSaveData() {
  try {
    await connectToSnowflake();

    // 1) Fetch EVERYTHING once (include airline column!)
    const sql = `
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
    `;
    const rows = (await executeQuery(sql)) as Review[];

    // 2) Group in memory by airline
    const byAirline = new Map<string, Review[]>();
    for (const r of rows) {
      const key = r.AIRLINE || "Unknown";
      const arr = byAirline.get(key);
      if (arr) arr.push(r);
      else byAirline.set(key, [r]);
    }

    // 3) Process & upload per airline (in parallel, but you can chunk if needed)
    const results = await Promise.all(
      Array.from(byAirline.entries()).map(([airline, data]) => {
		console.log(`[DataFetcher] Processing airline: ${airline} with ${data.length} reviews…`) 
        return processAndUploadForAirline(airline, data) 
	}
      )
    );

    // 4) Upload a compact index to drive your UI
    const index = {
      lastRefreshed: new Date().toISOString(),
      airlines: results
        .sort((a, b) => b.count - a.count)
        .map(({ airline, slug, count }) => ({ airline, slug, count })) 
    };
    await uploadFileToS3Bucket(JSON.stringify(index), BUCKET, `airlines_index.json`);

    return { success: true };
  } catch (error) {
    console.error("Error fetching and saving data:", error);
    throw error;
  }
}
