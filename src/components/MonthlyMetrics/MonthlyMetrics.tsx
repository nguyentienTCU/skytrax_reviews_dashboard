import React from "react";
import { getMonthlyMetrics } from "@/lib/getData/getMonthlyMetrics";
import MetricCard from "./MetricCard";

type Metric = {
	label: string;
	value: string;
	description: string;
	change: string;
	changeLabel: string;
};

const MonthlyMetrics = async () => {
	const {
		recommendationPercentage,
		vfmScore,
		averageRating,
		totalNumberOfReviews,
		month,
	} = await getMonthlyMetrics();

	const recommendationDescription = () => {
		if (Number(recommendationPercentage) >= 80) {
			return "Excellent customer satisfaction and strong likelihood to recommend.";
		} else if (Number(recommendationPercentage) >= 50) {
			return "Good customer satisfaction and moderate likelihood to recommend.";
		} else {
			return "Low customer satisfaction and low likelihood to recommend.";
		}
	};

	const vfmDescription = () => {
		if (vfmScore >= 4) {
			return "Exceptional value for money with high customer satisfaction.";
		} else if (vfmScore >= 3) {
			return "Good value for money with satisfactory customer experience.";
		} else {
			return "Room for improvement in delivering value for customer investment.";
		}
	};

	const averageRatingDescription = () => {
		if (averageRating >= 4) {
			return "Outstanding overall performance across all service aspects.";
		} else if (averageRating >= 3) {
			return "Satisfactory overall performance with some areas for improvement.";
		} else {
			return "Significant improvements needed across service areas.";
		}
	};

	const reviewCountDescription = () => {
		if (totalNumberOfReviews >= 1000) {
			return "Large sample size providing highly reliable insights.";
		} else if (totalNumberOfReviews >= 500) {
			return "Good sample size for meaningful analysis.";
		} else {
			return "Limited sample size - interpret trends with caution.";
		}
	};

	const metrics: Metric[] = [
		{
			label: "Recommendation Percentage",
			value: `${recommendationPercentage}%`,
			description: recommendationDescription(),
			change: "0.00%",
			changeLabel: "previous month",
		},
		{
			label: "VFM Score",
			value: `${vfmScore.toFixed(2)} / 5`,
			description: vfmDescription(),
			change: "0.000%",
			changeLabel: "from previous month",
		},
		{
			label: "Average Rating",
			value: `${averageRating.toFixed(2)} / 5`,
			description: averageRatingDescription(),
			change: "0.000%",
			changeLabel: "from previous month",
		},
		{
			label: "Total number of reviews",
			value: totalNumberOfReviews.toString(),
			description: reviewCountDescription(),
			change: "0",
			changeLabel: "reviews from previous month",
		},
	];

	return (
		<div className="card bg-gray-50 dark:bg-gray-900 p-8 rounded-lg mb-8">
			<h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
				This Month Metrics ({month})
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics.map((metric, idx) => (
					<MetricCard key={idx} {...metric} />
				))}
			</div>
		</div>
	);
};

export default MonthlyMetrics;
