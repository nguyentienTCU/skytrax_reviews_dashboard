import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";

export async function getReviewTextAnalysis() {
	try {
		const reviews = (await getChartData("reviews.csv")) as Review[];
		return {
			sampleReviews: getSampleReviews(reviews),
			ratingBandsTypeCount: getRatingBandsTypeCount(reviews),
		};
	} catch (error) {
		console.error("Error fetching route analysis:", error);
		throw error;
	}
}

function getSampleReviews(reviews: Review[]) {
	const sampleReviews: {
		[key: string]: {
			reviewText: string;
			originCity: string;
			destinationCity: string;
			aircraftModel: string;
			seatType: string;
		};
	} = {};
	sampleReviews["bad"] = {
		reviewText: "",
		originCity: "",
		destinationCity: "",
		aircraftModel: "",
		seatType: "",
	};
	sampleReviews["medium"] = {
		reviewText: "",
		originCity: "",
		destinationCity: "",
		aircraftModel: "",
		seatType: "",
	};
	sampleReviews["good"] = {
		reviewText: "",
		originCity: "",
		destinationCity: "",
		aircraftModel: "",
		seatType: "",
	};

	for (const review of reviews) {
		const ratingBand = review.RATING_BAND.toLowerCase();
		if (
			sampleReviews[ratingBand].reviewText === "" &&
			review.REVIEW_TEXT &&
			review.ORIGIN_CITY &&
			review.DESTINATION_CITY &&
			review.AIRCRAFT_MODEL &&
			review.SEAT_TYPE
		) {
			sampleReviews[ratingBand] = {
				reviewText: review.REVIEW_TEXT,
				originCity: review.ORIGIN_CITY,
				destinationCity: review.DESTINATION_CITY,
				aircraftModel: review.AIRCRAFT_MODEL,
				seatType: review.SEAT_TYPE,
			};
		}

		// Break if all samples are collected
		if (
			sampleReviews.bad.reviewText !== "" &&
			sampleReviews.medium.reviewText !== "" &&
			sampleReviews.good.reviewText !== ""
		) {
			break;
		}
	}

	return sampleReviews;
}

function getRatingBandsTypeCount(reviews: Review[]) {
	// good, medium, bad
	const ratingBandsType: number[] = [
		reviews.filter((review) => review.RATING_BAND.toLowerCase() === "bad")
			.length,
		reviews.filter((review) => review.RATING_BAND.toLowerCase() === "medium")
			.length,
		reviews.filter((review) => review.RATING_BAND.toLowerCase() === "good")
			.length,
	];

	return ratingBandsType;
}
