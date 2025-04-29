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
}) => {
	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
			<div className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
				{label}
			</div>
			<div className="text-4xl font-normal mb-2 text-gray-900 dark:text-white">
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
				<span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
					{changeLabel}
				</span>
			</div>
			<div className="text-gray-500 dark:text-gray-400 text-sm">
				{description}
			</div>
		</div>
	);
};

export default MetricCard;
