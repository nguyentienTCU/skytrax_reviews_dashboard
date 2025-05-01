import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";

export async function getLastRefreshDate() {
	try {
		const reviews = (await getChartData("reviews.csv")) as Review[];
		const lastRefreshDate = reviews[reviews.length - 1].EL_UPDATED_AT;
		const processedDate = lastRefreshDate.slice(4, 25);
		return processedDate;
	} catch (error) {
		console.error("Error fetching last refresh date:", error);
		throw error;
	}
}
