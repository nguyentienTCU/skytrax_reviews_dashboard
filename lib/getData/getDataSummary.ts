import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";
import { DataSummary } from "../../type/DataSummary";

export async function getDataSummary(): Promise<DataSummary> {
	try {
		const data: Review[] = (await getChartData("reviews.csv")) as Review[];
		return {
			totalReviews: getTotalReviews(data),
			totalVerifiedReviews: getTotalVerifiedReviews(data),
			totalAircraftModels: getTotalAircraftModels(data),
			totalCountries: getTotalCountries(data),
		};
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error;
	}
}

function getTotalReviews(data: Review[]) {
	return data.length;
}

function getTotalVerifiedReviews(data: Review[]) {
	const verifiedCount = data.filter((review) => review.VERIFIED).length;
	return (verifiedCount / data.length) * 100;
}

function getTotalAircraftModels(data: Review[]) {
	return new Set(data.map((review) => review.AIRCRAFT_MODEL)).size;
}

function getTotalCountries(data: Review[]) {
	return new Set(data.map((review) => review.NATIONALITY)).size;
}
