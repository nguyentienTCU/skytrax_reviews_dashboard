import React from "react";

import StatCard from "./StatCard";
import { DataSummaryType } from "@/type/DataSummaryType";

const DataSummary = async (props: DataSummaryType) => {
	const {
		totalReviews,
		totalVerifiedReviews,
		totalAircraftModels,
		totalCountries,
	} = props;

	const stats = [
		{
			title: "Total Reviews",
			value: totalReviews,
			icon: "fa-solid fa-comment",
			bgColor: "bg-blue-100",
			textColor: "text-blue-600",
			iconBgColor: "bg-blue-200",
		},
		{
			title: "Verified Reviews",
			value: `${totalVerifiedReviews.toFixed(2)}%`,
			icon: "fa-solid fa-check-circle",
			bgColor: "bg-green-100",
			textColor: "text-green-600",
			iconBgColor: "bg-green-200",
		},
		{
			title: "Airlines",
			value: totalAircraftModels,
			icon: "fa-solid fa-plane",
			bgColor: "bg-purple-100",
			textColor: "text-purple-600",
			iconBgColor: "bg-purple-200",
		},
		{
			title: "Countries",
			value: totalCountries,
			icon: "fa-solid fa-globe",
			bgColor: "bg-yellow-100",
			textColor: "text-yellow-600",
			iconBgColor: "bg-yellow-200",
		},
	];

	return (
		<div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
			<h2 className="text-xl font-bold mb-4">Data Summary</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
				{stats.map((stat, index) => (
					<StatCard key={index} {...stat} />
				))}
			</div>
		</div>
	);
};

export default DataSummary;
