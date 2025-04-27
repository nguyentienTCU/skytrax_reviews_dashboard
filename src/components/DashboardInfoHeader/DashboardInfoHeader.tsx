"use client";

import React from "react";
import { useState } from "react";

const DashboardInfoHeader =  () => {
  const [compareWith, setCompareWith] = useState("previous month");
  return (
  <div className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-6">
    <div className="mb-2 text-xs text-gray-400">
      Last Refresh: 2025-04-26
    </div>
    <div className="mb-4">
      <span className="font-bold">Self-Sampling Bias: </span>
      <span>
        While analyzing reviews of British Airways, it's crucial to acknowledge the presence of self-selection sampling bias. Similar to social media platforms like Yelp, individuals who voluntarily submit reviews may have had extreme experiences, affiliations with the airline, or simply different motivations compared to those who do not provide feedback. Due to self-sampling bias, the KPI and review will be worse than the general population. However, it's important to clarify that our aim is not to generalize findings about the entire population. Instead, we focus on identifying specific areas for improvement that British Airways can address.
      </span>
    </div>
    <div className="mb-2">
      <label className="mr-2 text-sm text-gray-300">Compare with:</label>
      <select
        className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-1"
        value={compareWith}
        onChange={(e) => (e.target.value)}
      >
        <option value="previous month">previous month</option>
        <option value="previous year">previous year</option>
      </select>
    </div>
  </div>
)};

export default DashboardInfoHeader;