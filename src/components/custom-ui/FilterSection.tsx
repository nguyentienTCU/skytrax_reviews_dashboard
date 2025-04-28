"use client";
import React, { useState, useEffect } from "react";
interface FilterOption {
  label: string;
  value: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
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
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
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
