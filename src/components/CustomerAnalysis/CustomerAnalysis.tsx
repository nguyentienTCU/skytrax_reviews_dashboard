import React from "react";
import BarGraph from "../custom-ui/BarChart";
import PieGraph from "../custom-ui/PieChart";
import { getCustomerAnalysis } from "@/lib/getData/getCustomerAnalysis";

const CustomerAnalysis = async () => {
	const { reviewsByCountry, verifiedAndUnverifiedReviews } = await getCustomerAnalysis();
	return (
		<div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
			<h2 className="text-xl font-bold mb-4">
				Customer Analysis
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 className="text-lg font-semibold mb-2">
						Reviews by Country
					</h3>
					<div className="chart-container h-full">
						<BarGraph
							values={reviewsByCountry.map((review) => review.count)}
							valueLabels={reviewsByCountry.map((review) => review.country)}
							title="Reviews by Customer Country"
							backgroundColor={["rgba(255, 99, 132, 0.7)"]}
							borderColor={["rgb(255, 99, 132)"]}
							borderWidth={1}
							height="100%"
							axis="y"
						/>
					</div>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-2">
						Verified vs. Unverified Reviews
					</h3>
					<div className="chart-container h-full">
						<PieGraph
							values={[verifiedAndUnverifiedReviews.verified, verifiedAndUnverifiedReviews.unverified]}
							valueLabels={["Verified", "Unverified"]}
							title="Verified vs Unverified Reviews (%)"
							backgroundColor={[
								"rgba(75, 192, 192, 0.7)",
								"rgba(255, 159, 64, 0.7)",
							]}
							borderColor={["rgb(75, 192, 192)", "rgb(255, 159, 64)"]}
							borderWidth={1}
							height="100%"
							legendPosition="right"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerAnalysis;
