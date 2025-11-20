import React from "react";

interface MetricCardProps {
	label: string;
	value: string;
	description: string;
	change: string;
	changeLabel: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
	label,
	value,
	description,
	change,
	changeLabel,
}) => (
	<div>
		<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
			<div className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm lg:text-xs">
				{label}
			</div>
			<div className="text-2xl font-normal text-gray-900 dark:text-white">
				{value}
			</div>
			<div className="flex items-center mb-2">
				<span
					className={`mr-1 ${
						change.startsWith("-") ? "text-red-500" : "text-green-500"
					}`}
				>
					{change.startsWith("-") ? "↓" : "↑"}
				</span>
				<span
					className={`font-semibold ${
						change.startsWith("-") ? "text-red-500" : "text-green-500"
					}`}
				>
					{change}
				</span>
				<span className="ml-1 text-sm lg:text-xs text-gray-500 dark:text-gray-400">
					{changeLabel}
				</span>
			</div>
		</div>
		<div className="text-gray-500 dark:text-gray-400 text-sm lg:text-xs px-4 pt-2">
			{description}
		</div>
	</div>
);

export default MetricCard;
