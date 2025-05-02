import React from "react";
import PieGraph from "@/components/custom-ui/PieChart";
import DoughnutChart from "@/components/custom-ui/DoughnutChart";
import BarGraph from "@/components/custom-ui/BarChart";
import { getAircraftAnalysis } from "@/lib/getData/getAircraftAnalysis";

const AircraftAnalysis = async () => {
  const {
    aircraftManufacturersPercentage,
    aircraftModels
  } = await getAircraftAnalysis();

  const roundedManufacturersPercentage = aircraftManufacturersPercentage
    .filter((manufacturer) => manufacturer.percentage * 100 >= 1)
    .map((manufacturer) => ({
      ...manufacturer,
      percentage: Number(manufacturer.percentage.toFixed(2)),
    }));

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Aircraft Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Top Aircraft Manufacturers Composition
          </h3>
          <div className="chart-container h-80">
            {/* Top Aircraft Manufacturers Pie Chart */}
            <PieGraph
              valueLabels={roundedManufacturersPercentage.map(
                (manufacturer) => manufacturer.manufacturer
              )}
              values={roundedManufacturersPercentage.map(
                (manufacturer) => manufacturer.percentage
              )}
              backgroundColor={[
                "rgba(255, 99, 132, 0.7)",
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(153, 102, 255, 0.7)",
              ]}
              borderColor={[
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 206, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
              ]}
              borderWidth={1}
              title="Distribution by Manufacturer (%)"
              legendPosition="right"
            />
          </div>
        </div>

        {/* Top Aircraft Models Bar Graph */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Top Aircraft Models</h3>
          <div className="chart-container h-80">
            <BarGraph
              valueLabels={aircraftModels.map((model) => model.model)}
              values={aircraftModels.map((model) => model.count)}
              xTitle="Number of Reviews"
              backgroundColor={["rgba(54, 162, 235, 0.7)"]}
              borderColor={["rgb(54, 162, 235)"]}
              borderWidth={1}
              axis="y"
              showDataLabels={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftAnalysis;
