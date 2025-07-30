import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";
import { CustomerAnalysisData } from "../../type/CustomerAnalysisData";

export async function getCustomerAnalysis(): Promise<CustomerAnalysisData> {
	try {
		const reviews = (await getChartData("reviews.csv")) as Review[];
		return {
			reviewsByCountry: getReviewsByCountry(reviews),
			verifiedAndUnverifiedReviews: getVerifiedAndUnverifiedReviews(reviews),
			aircraftSeatTypePercentage: getAircraftSeatTypePercentage(reviews),
			travellerTypePercentage: getTravellerTypePercentage(reviews),
		};
	} catch (error) {
		console.error("Error fetching customer analysis:", error);
		throw error;
	}
}

function getReviewsByCountry(reviews: Review[]) {
	const countryCounts: { [key: string]: number } = {};

	// Count reviews for each country
	reviews.forEach((review) => {
		const country = review.NATIONALITY;
		if (country) {
			countryCounts[country] = (countryCounts[country] || 0) + 1;
		}
	});

	// Convert to array, sort by count, and take top 7
	return Object.entries(countryCounts)
		.map(([country, count]) => ({
			country,
			count,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 7);
}

function getVerifiedAndUnverifiedReviews(reviews: Review[]) {
	const totalReviews = reviews.length;
	const verifiedCount = reviews.filter((review) => review.VERIFIED).length;
	const verifiedPercentage = (verifiedCount / totalReviews) * 100;

	return {
		verified: verifiedPercentage,
		unverified: 100 - verifiedPercentage,
	};
}

function getAircraftSeatTypePercentage(reviews: Review[]) {
	const seatTypeCounts: { [key: string]: number } = {};
	const totalReviews = reviews.length;
	const targetSeatTypes = [
		"Economy Class",
		"Business Class",
		"First Class",
		"Premium Economy",
		"Unknown",
	];

	// Initialize counts for target seat types
	targetSeatTypes.forEach((type) => {
		seatTypeCounts[type] = 0;
	});

	// Count reviews for each seat type
	reviews.forEach((review) => {
		const seatType = review.SEAT_TYPE;
		if (seatType) {
			seatTypeCounts[seatType] = seatTypeCounts[seatType] + 1;
		} else {
			seatTypeCounts["Unknown"] = seatTypeCounts["Unknown"] + 1;
		}
	});

	// Convert to array with percentages, filtering out Unknown if count is 0
	return targetSeatTypes
		.filter((type) => type !== "Unknown" || seatTypeCounts[type] > 0)
		.map((seatType) => ({
			seatType,
			percentage: (seatTypeCounts[seatType] / totalReviews) * 100,
		}));
}

function getTravellerTypePercentage(reviews: Review[]) {
	const travellerTypeCounts: { [key: string]: number } = {};
	const totalReviews = reviews.length;
	const targetTravellerTypes = [
		"Couple Leisure",
		"Solo Leisure",
		"Business",
		"Family Leisure",
		"Unknown",
	];

	// Initialize counts for target traveller types
	targetTravellerTypes.forEach((type) => {
		travellerTypeCounts[type] = 0;
	});

	// Count reviews for each traveller type
	reviews.forEach((review) => {
		const travellerType = review.TYPE_OF_TRAVELLER;
		if (travellerType) {
			travellerTypeCounts[travellerType] = travellerTypeCounts[travellerType] + 1;
		} else {
			travellerTypeCounts["Unknown"] = travellerTypeCounts["Unknown"] + 1;
		}
	});

	// Convert to array with percentages, filtering out Unknown if count is 0
	return targetTravellerTypes
		.filter((type) => type !== "Unknown" || travellerTypeCounts[type] > 0)
		.map((travellerType) => ({
			travellerType,
			percentage: (travellerTypeCounts[travellerType] / totalReviews) * 100,
		}));
}
	


	
