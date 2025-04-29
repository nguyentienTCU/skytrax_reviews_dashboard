import React from "react";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: string;
	bgColor: string;
	textColor: string;
	iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	icon,
	bgColor,
	textColor,
	iconBgColor,
}) => {
	return (
		<div className={`stat-card ${bgColor} dark:bg-gray-800 p-4 rounded-lg`}>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-700 dark:text-gray-300">{title}</p>
					<h3 className={`text-2xl font-bold ${textColor} dark:text-white`}>
						{value}
					</h3>
				</div>
				<div className={`${iconBgColor} dark:bg-gray-700 p-3 rounded-full`}>
					<i className={`${icon} ${textColor} dark:text-white`}></i>
				</div>
			</div>
		</div>
	);
};

export default StatCard;
