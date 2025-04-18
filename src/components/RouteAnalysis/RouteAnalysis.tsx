import React from "react";

const RouteAnalysis = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Route Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Top Origin Cities
          </h3>
          <div className="chart-container h-80">
            <canvas id="originCityChart"></canvas>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Top Destination Cities
          </h3>
          <div className="chart-container h-80">
            <canvas id="destinationCityChart"></canvas>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Popular Routes
        </h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Origin
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Destination
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Count
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Avg. Rating
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200">London</td>
                <td className="py-2 px-4 border-b border-gray-200">New York</td>
                <td className="py-2 px-4 border-b border-gray-200">142</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★</span>
                    <span className="text-gray-300">★</span>
                    <span className="ml-1">4.1</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200">Dubai</td>
                <td className="py-2 px-4 border-b border-gray-200">London</td>
                <td className="py-2 px-4 border-b border-gray-200">118</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★</span>
                    <span className="text-gray-300">★</span>
                    <span className="ml-1">4.3</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200">
                  Singapore
                </td>
                <td className="py-2 px-4 border-b border-gray-200">Sydney</td>
                <td className="py-2 px-4 border-b border-gray-200">98</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-1">4.7</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200">
                  Hong Kong
                </td>
                <td className="py-2 px-4 border-b border-gray-200">Tokyo</td>
                <td className="py-2 px-4 border-b border-gray-200">87</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★</span>
                    <span className="text-gray-300">★</span>
                    <span className="ml-1">3.9</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200">Paris</td>
                <td className="py-2 px-4 border-b border-gray-200">Rome</td>
                <td className="py-2 px-4 border-b border-gray-200">79</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★</span>
                    <span className="text-gray-300">★★</span>
                    <span className="ml-1">3.5</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteAnalysis;
