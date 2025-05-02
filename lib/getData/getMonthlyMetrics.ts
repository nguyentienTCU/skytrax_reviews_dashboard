"use server";

import { Review } from "../../type/Review";
import { getChartData } from "../csv-parser";

export async function getMonthlyMetrics(
	compareWith: "previous month" | "previous year"
) {
	try {
		const reviews = (await getChartData("reviews.csv")) as Review[];
		const currentMonthReviews = getCurrentMonthReviews(reviews);
		const compareWithReviews =
			compareWith === "previous month"
				? getLastMonthReviews(reviews)
				: getLastYearReviews(reviews);

		return {
			recommendationPercentage: getRecommendationPercentage(
				currentMonthReviews,
				compareWithReviews
			),
			vfmScore: getVfmScore(currentMonthReviews, compareWithReviews),
			averageRating: getAverageRating(currentMonthReviews, compareWithReviews),
			totalNumberOfReviews: getTotalNumberOfReviews(
				currentMonthReviews,
				compareWithReviews
			),
			month: getCurrentMonth(),
		};
	} catch (error) {
		console.error("Error fetching monthly metrics:", error);
		throw error;
	}
}

function getRecommendationPercentage(
	currentMonthReviews: Review[],
	compareWithReviews: Review[]
) {
	const recommendedReviews = currentMonthReviews.filter(
		(review) => review.RECOMMENDED === true
	).length;
	const currentPercentage =
		(recommendedReviews / currentMonthReviews.length) * 100;
	const recommendedReviewsCompareWith = compareWithReviews.filter(
		(review) => review.RECOMMENDED === true
	).length;
	const compareWithPercentage =
		(recommendedReviewsCompareWith / compareWithReviews.length) * 100;
	const percentageChange = currentPercentage - compareWithPercentage;
	return {
		currentPercentage: currentPercentage.toFixed(2),
		percentageChange: percentageChange.toFixed(2),
	};
}

function getVfmScore(
	currentMonthReviews: Review[],
	compareWithReviews: Review[]
) {
	const currentVfmScore =
		currentMonthReviews.reduce(
			(sum, review) => sum + (review.VALUE_FOR_MONEY || 0),
			0
		) / currentMonthReviews.length;
	const compareWithVfmScore =
		compareWithReviews.reduce(
			(sum, review) => sum + (review.VALUE_FOR_MONEY || 0),
			0
		) / compareWithReviews.length;
	const scoreChange = currentVfmScore - compareWithVfmScore;
	return {
		currentScore: currentVfmScore.toFixed(2),
		scoreChange: scoreChange.toFixed(2),
	};
}

function getAverageRating(
	currentMonthReviews: Review[],
	compareWithReviews: Review[]
) {
	const currentRating =
		currentMonthReviews.reduce(
			(sum, review) => sum + (review.AVERAGE_RATING || 0),
			0
		) / currentMonthReviews.length;
	const compareWithRating =
		compareWithReviews.reduce(
			(sum, review) => sum + (review.AVERAGE_RATING || 0),
			0
		) / compareWithReviews.length;
	const ratingChange = currentRating - compareWithRating;
	return {
		currentRating: currentRating.toFixed(2),
		ratingChange: ratingChange.toFixed(2),
	};
}

function getTotalNumberOfReviews(
	currentMonthReviews: Review[],
	compareWithReviews: Review[]
) {
	const currentTotal = currentMonthReviews.length;
	const compareWithTotal = compareWithReviews.length;
	const totalChange = currentTotal - compareWithTotal;
	return {
		currentTotal,
		totalChange,
	};
}

function getCurrentMonth() {
	const currentDate = new Date();
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currentMonth = monthNames[currentDate.getMonth()];
	const currentYear = currentDate.getFullYear();
	return `${currentMonth} - ${currentYear}`;
}

function getCurrentMonthReviews(reviews: Review[]) {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const currentMonthReviews = reviews.filter(
		(review) =>
			review.REVIEW_CAL_MONTH === currentMonth &&
			review.REVIEW_CAL_YEAR === currentDate.getFullYear()
	);
	console.log("current month reviews: ", currentMonthReviews);
	return currentMonthReviews;
}

function getLastMonthReviews(reviews: Review[]) {
	const currentDate = new Date();
	const lastMonth = currentDate.getMonth();
	const lastMonthReviews = reviews.filter(
		(review) => review.REVIEW_CAL_MONTH === lastMonth && review.REVIEW_CAL_YEAR === currentDate.getFullYear()
	);
	return lastMonthReviews;
}

function getLastYearReviews(reviews: Review[]) {
	const currentDate = new Date();
	const lastYear = currentDate.getFullYear() - 1;
	const lastYearReviews = reviews.filter(
		(review) => review.REVIEW_CAL_YEAR === lastYear && review.REVIEW_CAL_MONTH === currentDate.getMonth()
	);
	return lastYearReviews;
}
