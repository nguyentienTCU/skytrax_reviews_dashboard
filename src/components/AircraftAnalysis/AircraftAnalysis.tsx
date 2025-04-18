import React from "react";

const AircraftAnalysis = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Aircraft Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Top Aircraft Manufacturers
          </h3>
          <div className="chart-container h-80">
            <canvas id="manufacturerChart"></canvas>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Top Aircraft Models
          </h3>
          <div className="chart-container h-80">
            <canvas id="modelChart"></canvas>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Seat Type Distribution
        </h3>
        <div className="chart-container h-64">
          <canvas id="seatTypeChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default AircraftAnalysis;
