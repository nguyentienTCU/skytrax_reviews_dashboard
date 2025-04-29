"use client";
import React, { useState, useEffect } from "react";

interface FilterSectionProps {
	title: string;
	options: { label: string; value: string }[];
	initialValue?: string;
	onFilterChange: (value: string) => void;
	className?: string;
	disabled?: boolean;
	placeholder?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
	title,
	options,
	initialValue = options[0]?.value || "",
	onFilterChange,
	className = "",
	disabled = false,
	placeholder = "Select an option",
}) => {
	const [selectedValue, setSelectedValue] = useState(initialValue);

	// Update internal state when initialValue changes
	useEffect(() => {
		setSelectedValue(initialValue);
	}, [initialValue]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newValue = e.target.value;
		setSelectedValue(newValue);
		onFilterChange(newValue);
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{title}
			</h3>
			<select
				value={selectedValue}
				onChange={handleChange}
				disabled={disabled}
				className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					disabled ? "opacity-50 cursor-not-allowed" : ""
				} bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600`}
			>
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default FilterSection;
