import React from "react";

const TimeAnalysis = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Time-based Analysis
      </h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Reviews Over Time
        </h3>
        <div className="chart-container">
          <canvas id="reviewsTimeChart"></canvas>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Reviews by Day of Week
          </h3>
          <div className="chart-container h-64">
            <canvas id="dayOfWeekChart"></canvas>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Reviews by Month
          </h3>
          <div className="chart-container h-64">
            <canvas id="monthChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
