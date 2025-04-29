import React from "react";
import PieGraph from "@/components/custom-ui/PieChart";

import { getReviewTextAnalysis } from "@/lib/getData/getReviewTextAnalysis";

const ReviewTextAnalysis = async () => {
	const { sampleReviews, ratingBandsTypeCount } = await getReviewTextAnalysis();
	return (
		<div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
			<h2 className="text-xl font-bold mb-4">
				Review Text Analysis
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 className="text-lg font-semibold mb-2">
						Common Keywords
					</h3>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="mb-2">
							<span className="badge badge-primary text-lg px-2 py-1 mr-1">
								comfort
							</span>
							<span className="badge badge-success text-lg px-2 py-1 mr-1">
								service
							</span>
							<span className="badge badge-warning text-lg px-2 py-1 mr-1">
								delay
							</span>
							<span className="badge badge-primary text-lg px-2 py-1 mr-1">
								food
							</span>
						</div>
						<div className="mb-2">
							<span className="badge badge-success text-lg px-2 py-1 mr-1">
								staff
							</span>
							<span className="badge badge-warning text-lg px-2 py-1 mr-1">
								legroom
							</span>
							<span className="badge badge-danger text-lg px-2 py-1 mr-1">
								baggage
							</span>
							<span className="badge badge-primary text-lg px-2 py-1 mr-1">
								clean
							</span>
						</div>
						<div>
							<span className="badge badge-success text-lg px-2 py-1 mr-1">
								entertainment
							</span>
							<span className="badge badge-danger text-lg px-2 py-1 mr-1">
								cancellation
							</span>
							<span className="badge badge-warning text-lg px-2 py-1 mr-1">
								price
							</span>
							<span className="badge badge-primary text-lg px-2 py-1 mr-1">
								wifi
							</span>
						</div>
					</div>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-2">
						Sentiment Analysis
					</h3>
					<div className="chart-container h-64">
						<PieGraph
							values={ratingBandsTypeCount}
							valueLabels={["Positive", "Neutral", "Negative"]}
							title="Review Sentiment Analysis (%)"
							backgroundColor={[
								"rgba(75, 192, 192, 0.7)",
								"rgba(255, 206, 86, 0.7)",
								"rgba(255, 99, 132, 0.7)",
							]}
							borderColor={[
								"rgb(75, 192, 192)",
								"rgb(255, 206, 86)",
								"rgb(255, 99, 132)",
							]}
							borderWidth={1}
							height="100%"
							legendPosition="right"
						/>
					</div>
				</div>
			</div>
			<div className="mt-6">
				<h3 className="text-lg font-semibold mb-2">
					Sample Reviews
				</h3>
				<div className="space-y-4">
					<div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
						<div className="flex justify-between">
							<span className="font-semibold text-black">Good Review</span>
							<div>
								<span className="text-yellow-500">{"★".repeat(Math.round(sampleReviews.good.averageRating))}</span>
								<span className="text-gray-300">{"★".repeat(5 - Math.round(sampleReviews.good.averageRating))}</span>
							</div>
						</div>
						<p className="text-gray-700 mt-2">
							{sampleReviews.good.reviewText}
						</p>
						<div className="flex justify-between mt-2 text-sm text-gray-500">
							<span>
								{sampleReviews.good.aircraftModel} •{" "}
								{sampleReviews.good.seatType}
							</span>
							<span>
								{sampleReviews.good.originCity} → {sampleReviews.good.destinationCity}
							</span>
						</div>
					</div>
					<div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
						<div className="flex justify-between">
							<span className="font-semibold text-black">
								Medium Review
							</span>
							<div>
								<span className="text-yellow-500">{"★".repeat(Math.round(sampleReviews.medium.averageRating))}</span>
								<span className="text-gray-300">{"★".repeat(5 - Math.round(sampleReviews.medium.averageRating))}</span>
							</div>
						</div>
						<p className="text-gray-700 mt-2">
							{sampleReviews.medium.reviewText}
						</p>
						<div className="flex justify-between mt-2 text-sm text-gray-500">
							<span>
								{sampleReviews.medium.aircraftModel} •{" "}
								{sampleReviews.medium.seatType}
							</span>
							<span>
								{sampleReviews.medium.originCity} → {sampleReviews.medium.destinationCity}
							</span>
						</div>
					</div>
					<div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
						<div className="flex justify-between">
							<span className="font-semibold text-black">Bad Review</span>
							<div>
								<span className="text-yellow-500">{"★".repeat(Math.round(sampleReviews.bad.averageRating))}</span>
								<span className="text-gray-300">{"★".repeat(5 - Math.round(sampleReviews.bad.averageRating))}</span>
							</div>
						</div>
						<p className="text-gray-700 mt-2">
							{sampleReviews.bad.reviewText}
						</p>
						<div className="flex justify-between mt-2 text-sm text-gray-500">
							<span>
								{sampleReviews.bad.aircraftModel} •{" "}
								{sampleReviews.bad.seatType}
							</span>
							<span>
								{sampleReviews.bad.originCity} → {sampleReviews.bad.destinationCity}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewTextAnalysis;
