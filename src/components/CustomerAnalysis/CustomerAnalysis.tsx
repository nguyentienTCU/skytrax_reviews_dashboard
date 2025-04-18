import React from "react";

const CustomerAnalysis = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Customer Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Reviews by Country
          </h3>
          <div className="chart-container h-80">
            <canvas id="countryChart"></canvas>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Verified vs. Unverified Reviews
          </h3>
          <div className="chart-container h-80">
            <canvas id="verifiedChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalysis;
