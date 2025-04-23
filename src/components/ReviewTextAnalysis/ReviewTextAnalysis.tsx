import React from "react";
import PieGraph from "@/components/custom-ui/PieChart";

const ReviewTextAnalysis = () => {
	return (
		<div className="card">
			<h2 className="text-xl font-bold mb-4 text-gray-700">
				Review Text Analysis
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-600 mb-2">
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
					<h3 className="text-lg font-semibold text-gray-600 mb-2">
						Sentiment Analysis
					</h3>
					<div className="chart-container h-64">
						<PieGraph
							values={[58, 24, 18]}
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
				<h3 className="text-lg font-semibold text-gray-600 mb-2">
					Sample Reviews
				</h3>
				<div className="space-y-4">
					<div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
						<div className="flex justify-between">
							<span className="font-semibold">Excellent flight experience</span>
							<div>
								<span className="text-yellow-500">★★★★★</span>
							</div>
						</div>
						<p className="text-gray-700 mt-2">
							"The business class on the A380 was exceptional. Great service,
							comfortable seats that convert to full-flat beds, and the food was
							restaurant quality. Will definitely fly with them again."
						</p>
						<div className="flex justify-between mt-2 text-sm text-gray-500">
							<span>Boeing 777 • Business Class</span>
							<span>London → Singapore</span>
						</div>
					</div>
					<div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
						<div className="flex justify-between">
							<span className="font-semibold">
								Average experience with delays
							</span>
							<div>
								<span className="text-yellow-500">★★★</span>
								<span className="text-gray-300">★★</span>
							</div>
						</div>
						<p className="text-gray-700 mt-2">
							"Flight was delayed by 2 hours with minimal communication. Once on
							board, the service was decent and seats were comfortable enough
							for economy. Food was better than expected."
						</p>
						<div className="flex justify-between mt-2 text-sm text-gray-500">
							<span>Airbus A320 • Economy Class</span>
							<span>Paris → Rome</span>
						</div>
					</div>
					<div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
						<div className="flex justify-between">
							<span className="font-semibold">Disappointing service</span>
							<div>
								<span className="text-yellow-500">★</span>
								<span className="text-gray-300">★★★★</span>
							</div>
						</div>
						<p className="text-gray-700 mt-2">
							"Terrible experience from start to finish. Flight was overbooked,
							we were downgraded from premium economy to regular economy with no
							compensation. Staff were rude and unhelpful when we raised
							concerns."
						</p>
						<div className="flex justify-between mt-2 text-sm text-gray-500">
							<span>Boeing 787 • Economy Class</span>
							<span>New York → Chicago</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewTextAnalysis;
