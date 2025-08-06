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
} from "./getData/preProcessData";
import { Review } from "@/type/Review";

export async function fetchAndSaveData() {
	try {
		// Fetch data from Snowflake
		await connectToSnowflake();
		const data = (await executeQuery(`
      SELECT
        f.review_id,
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
      FROM british_airways_db.marts.fct_review_enriched  AS f
      LEFT JOIN british_airways_db.marts.dim_date     AS ds ON f.date_submitted_id = ds.date_id
      LEFT JOIN british_airways_db.marts.dim_date     AS df ON f.date_flown_id     = df.date_id
      LEFT JOIN british_airways_db.marts.dim_customer AS c  ON f.customer_id = c.customer_id
      LEFT JOIN british_airways_db.marts.dim_location AS ol ON f.origin_location_id = ol.location_id
      LEFT JOIN british_airways_db.marts.dim_location AS dl ON f.destination_location_id = dl.location_id
      LEFT JOIN british_airways_db.marts.dim_location AS tl ON f.transit_location_id = tl.location_id
      LEFT JOIN british_airways_db.marts.dim_aircraft AS a  ON f.aircraft_id = a.aircraft_id
      WHERE f.date_submitted_id IS NOT NULL
      ORDER BY 1 DESC
    `)) as Review[];

		// Pre-process data
		const dataSummary = preProcessDataSummary(data);
		const monthlyMetricsPrevMonth = preProcessMonthlyMetrics(data, "previous month");
		const monthlyMetricsPrevYear = preProcessMonthlyMetrics(data, "previous year");
		const timebasedAnalysis = preProcessTimebasedAnalysis(data);
		const aircraftAnalysis = preProcessAircraftAnalysis(data);
		const routeAnalysis = preProcessRouteAnalysis(data);
		const customerAnalysis = preProcessCustomerAnalysis(data);
		const reviewTextAnalysis = preProcessReviewTextAnalysis(data);

		// Upload pre-processed data to S3
		await Promise.all([
			uploadFileToS3Bucket(
				JSON.stringify(data),
				"british-airways--db-bucket",
				"data/reviews.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(dataSummary),
				"british-airways--db-bucket",
				"data/data_summary.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(monthlyMetricsPrevMonth),
				"british-airways--db-bucket",
				"data/monthly_metrics_prev_month.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(monthlyMetricsPrevYear),
				"british-airways--db-bucket",
				"data/monthly_metrics_prev_year.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(timebasedAnalysis),
				"british-airways--db-bucket",
				"data/timebased_analysis.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(aircraftAnalysis),
				"british-airways--db-bucket",
				"data/aircraft_analysis.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(routeAnalysis),
				"british-airways--db-bucket",
				"data/route_analysis.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(customerAnalysis),
				"british-airways--db-bucket",
				"data/customer_analysis.json"
			),
			uploadFileToS3Bucket(
				JSON.stringify(reviewTextAnalysis),
				"british-airways--db-bucket",
				"data/review_text_analysis.json"
			),
		]);

		return {
			success: true,
			message: "Data saved successfully",
		};
	} catch (error) {
		console.error("Error fetching and saving data:", error);
		throw error;
	}
}
