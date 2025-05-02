"use client";

import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import { getMonthlyMetrics } from "@/lib/getData/getMonthlyMetrics";

type Metric = {
	label: string;
	value: string;
	change: string;
	changeLabel: string;
	description: string;
};

const MonthlyMetrics = () => {
	const [compareWith, setCompareWith] = useState("previous month");
	const [metrics, setMetrics] = useState<Metric[]>([]);
	const [month, setMonth] = useState("");
	const [descriptions, setDescriptions] = useState<{ [key: string]: string }>(
		{}
	);

	useEffect(() => {
		const fetchData = async () => {
			const {
				recommendationPercentage,
				vfmScore,
				averageRating,
				totalNumberOfReviews,
				month: currentMonth,
			} = await getMonthlyMetrics(
				compareWith as "previous month" | "previous year"
			);

			const newMetrics: Metric[] = [
				{
					label: "Recommendation Percentage",
					value: `${recommendationPercentage.currentPercentage}%`,
					change: `${recommendationPercentage.percentageChange}%`,
					changeLabel: `${compareWith}`,
					description:
						"Percentage of customers who would recommend British Airways to others",
				},
				{
					label: "VFM Score",
					value: `${vfmScore.currentScore} / 5`,
					change: `${vfmScore.scoreChange}%`,
					changeLabel: `${compareWith}`,
					description:
						"Value for Money score based on customer feedback and ratings",
				},
				{
					label: "Average Rating",
					value: `${averageRating.currentRating} / 5`,
					change: `${averageRating.ratingChange}%`,
					changeLabel: `${compareWith}`,
					description:
						"Overall customer satisfaction rating across all review categories",
				},
				{
					label: "Total number of reviews",
					value: totalNumberOfReviews.currentTotal.toString(),
					change: `${totalNumberOfReviews.totalChange}`,
					changeLabel: `${compareWith}`,
					description:
						"Total number of customer reviews submitted during this period",
				},
			];

			setMetrics(newMetrics);
			setMonth(currentMonth);
		};

		fetchData();
	}, [compareWith]);

	return (
		<div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white">
					This Month Metrics ({month})
				</h2>
				<div className="flex items-center">
					<label className="mr-2 text-sm text-gray-700 dark:text-white">
						Compare with:
					</label>
					<select
						className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-700 rounded px-3 py-1"
						value={compareWith}
						onChange={(e) => setCompareWith(e.target.value)}
					>
						<option value="previous month">previous month</option>
						<option value="previous year">previous year</option>
					</select>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
				{metrics.map((metric, idx) => (
					<MetricCard key={idx} {...metric} />
				))}
			</div>
		</div>
	);
};

export default MonthlyMetrics;
