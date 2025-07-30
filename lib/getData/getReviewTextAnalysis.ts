import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";
import { ReviewTextAnalysisData } from "../../type/ReviewTextAnalysisData";

export async function getReviewTextAnalysis(): Promise<ReviewTextAnalysisData> {
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
			averageRating: number;
		};
	} = {};
	sampleReviews["bad"] = {
		reviewText: "",
		originCity: "",
		destinationCity: "",
		aircraftModel: "",
		seatType: "",
		averageRating: 0,
	};
	sampleReviews["medium"] = {
		reviewText: "",
		originCity: "",
		destinationCity: "",
		aircraftModel: "",
		seatType: "",
		averageRating: 0,
	};
	sampleReviews["good"] = {
		reviewText: "",
		originCity: "",
		destinationCity: "",
		aircraftModel: "",
		seatType: "",
		averageRating: 0,
	};

	for (const review of reviews) {
		const ratingBand = review.RATING_BAND.toLowerCase();
		if (
			sampleReviews[ratingBand].reviewText === "" &&
			review.REVIEW_TEXT &&
			review.REVIEW_TEXT !== "Unknown" &&
			review.ORIGIN_CITY &&
			review.ORIGIN_CITY !== "Unknown" &&
			review.DESTINATION_CITY &&
			review.DESTINATION_CITY !== "Unknown" &&
			review.AIRCRAFT_MODEL &&
			review.AIRCRAFT_MODEL !== "Unknown" &&
			review.SEAT_TYPE &&
			review.SEAT_TYPE !== "Unknown" &&
			review.RATING_BAND &&
			review.RATING_BAND !== "Unknown" &&
			review.AVERAGE_RATING
		) {
			sampleReviews[ratingBand] = {
				reviewText: review.REVIEW_TEXT,
				originCity: review.ORIGIN_CITY,
				destinationCity: review.DESTINATION_CITY,
				aircraftModel: review.AIRCRAFT_MODEL,
				seatType: review.SEAT_TYPE,
				averageRating: review.AVERAGE_RATING,
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
	const totalReviews = reviews.length;
	// good, medium, bad
	const ratingBandsType: number[] = [
		(reviews.filter((review) => review.RATING_BAND.toLowerCase() === "bad").length / totalReviews) * 100,
		(reviews.filter((review) => review.RATING_BAND.toLowerCase() === "medium").length / totalReviews) * 100,
		(reviews.filter((review) => review.RATING_BAND.toLowerCase() === "good").length / totalReviews) * 100,
	];

	return ratingBandsType;
}
