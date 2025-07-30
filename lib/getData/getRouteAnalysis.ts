import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";
import { RouteAnalysisData } from "../../type/RouteAnalysisData";

export async function getRouteAnalysis(): Promise<RouteAnalysisData> {
	try {
		const reviews = (await getChartData("reviews.csv")) as Review[];
		return {
			topOriginCities: getTopOriginCities(reviews),
			topDestinationCities: getTopDestinationCities(reviews),
			topRoutes: getTopRoutes(reviews),
		};
	} catch (error) {
		console.error("Error fetching route analysis:", error);
		throw error;
	}
}

function getTopOriginCities(reviews: Review[]) {
	const cityCounts: { [key: string]: number } = {};

	// Count reviews for each origin city
	reviews.forEach((review) => {
		const city = review.ORIGIN_CITY;
		cityCounts[city] = (cityCounts[city] || 0) + 1;
	});

	// Convert to array, sort by count, and take top 6
	return Object.entries(cityCounts)
		.map(([city, count]) => ({
			city,
			count,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 6);
}

function getTopDestinationCities(reviews: Review[]) {
	const cityCounts: { [key: string]: number } = {};

	// Count reviews for each destination city
	reviews.forEach((review) => {
		const city = review.DESTINATION_CITY;
		cityCounts[city] = (cityCounts[city] || 0) + 1;
	});

	// Convert to array, sort by count, and take top 6
	return Object.entries(cityCounts)
		.map(([city, count]) => ({
			city,
			count,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 6);
}

function getTopRoutes(reviews: Review[]) {
	const routeCounts: {
		[key: string]: {
			origin: string;
			destination: string;
			count: number;
			averageRating: number;
		};
	} = {};

	reviews.forEach((review) => {
		if (
			review.ORIGIN_CITY &&
			review.DESTINATION_CITY &&
			review.ORIGIN_CITY !== "Unknown" &&
			review.DESTINATION_CITY !== "Unknown" &&
			review.AVERAGE_RATING
		) {
			const routeKey = `${review.ORIGIN_CITY}-${review.DESTINATION_CITY}`;

			if (!routeCounts[routeKey]) {
				routeCounts[routeKey] = {
					origin: review.ORIGIN_CITY,
					destination: review.DESTINATION_CITY,
					count: 0,
					averageRating: 0,
				};
			}

			routeCounts[routeKey].count++;
			routeCounts[routeKey].averageRating =
				(routeCounts[routeKey].averageRating *
					(routeCounts[routeKey].count - 1) +
					review.AVERAGE_RATING) /
				routeCounts[routeKey].count;
		}
	});

	return Object.values(routeCounts)
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
}
