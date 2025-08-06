"use server";

import { getJsonData } from "../file-parser";
import { MonthlyMetricsData } from "../../type/MonthlyMetricsData";

export async function getMonthlyMetrics(
	compareWith: "previous month" | "previous year"
): Promise<MonthlyMetricsData> {
	try {
		const fileName =
			compareWith === "previous month"
				? "monthly_metrics_prev_month.json"
				: "monthly_metrics_prev_year.json";
		return await getJsonData(fileName);
	} catch (error) {
		console.error("Error fetching monthly metrics:", error);
		throw error;
	}
}
