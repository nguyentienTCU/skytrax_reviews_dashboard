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
		<div className={`stat-card ${bgColor} p-4 rounded-lg`}>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-700">{title}</p>
					<h3 className={`text-2xl font-bold ${textColor} `}>
						{value}
					</h3>
				</div>
				<div className={`${iconBgColor} p-3 rounded-full`}>
					<i className={`${icon} ${textColor} `}></i>
				</div>
			</div>
		</div>
	);
};

export default StatCard;
