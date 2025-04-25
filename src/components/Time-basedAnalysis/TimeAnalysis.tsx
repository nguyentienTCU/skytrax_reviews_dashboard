import React from "react";
import LineGraph from "@/components/custom-ui/LineChart";
import BarGraph from "@/components/custom-ui/BarChart";
import { getTimebasedAnalysis } from "@/lib/getData/getTimebasedAnalysis";

const TimeAnalysis = async () => {
  const { reviewsOverTime, reviewsByDayOfWeek, reviewsByMonth } =
    await getTimebasedAnalysis();
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Time-based Analysis
      </h2>
      {/* Reviews Over Time Line Graph */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Reviews Over Time
        </h3>
        <div className="chart-container">
          <LineGraph
            valueLabels={reviewsOverTime.map((review) =>
              review.year.toString()
            )}
            values={reviewsOverTime.map((review) => review.count)}
            xTitle="Year"
            yTitle="Number of Reviews"
            title="Reviews Over Time"
            backgroundColor="rgba(59, 130, 246, 0.1)"
            borderColor="rgb(59, 130, 246)"
            borderWidth={2}
          />
        </div>
      </div>

      {/* Reviews By Day of Week Bar Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Reviews by Day of Week
          </h3>
          <div className="chart-container h-64">
            <BarGraph
              valueLabels={reviewsByDayOfWeek.map((review) => review.day)}
              values={reviewsByDayOfWeek.map((review) => review.count)}
              xTitle="Day of Week"
              yTitle="Number of Reviews"
              title="Reviews by Day of Week"
              backgroundColor={[
                "rgba(54, 162, 235, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 159, 64, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(201, 203, 207, 0.7)",
              ]}
              borderColor={[
                "rgb(54, 162, 235)",
                "rgb(75, 192, 192)",
                "rgb(255, 206, 86)",
                "rgb(153, 102, 255)",
                "rgb(255, 159, 64)",
                "rgb(255, 99, 132)",
                "rgb(201, 203, 207)",
              ]}
              borderWidth={1}
            />
          </div>
        </div>

        {/* Reviews by Month Bar Graph */}
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Reviews by Month
          </h3>
          <div className="chart-container h-64">
            <BarGraph
              valueLabels={[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ]}
              values={reviewsByMonth.map((review) => review.count)}
              title="Reviews by Month"
              backgroundColor={["rgba(75, 192, 192, 0.7)"]}
              borderColor={["rgb(75, 192, 192)"]}
              borderWidth={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
