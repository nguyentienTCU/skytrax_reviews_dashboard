import React from "react";
import BarGraph from "@/components/custom-ui/BarChart";
import PieGraph from "@/components/custom-ui/PieChart";

import { CustomerAnalysisData } from "@/type/CustomerAnalysisData";

const CustomerAnalysis = async ({ data }: { data: CustomerAnalysisData }) => {
  const {
    reviewsByCountry,
    verifiedAndUnverifiedReviews,
    aircraftSeatTypePercentage,
    travellerTypePercentage,
  } = data;

  const roundedVerifiedAndUnverifiedReviews = {
    verified: Number(verifiedAndUnverifiedReviews.verified.toFixed(2)),
    unverified: Number(verifiedAndUnverifiedReviews.unverified.toFixed(2)),
  };

  const roundedSeatTypePercentage = aircraftSeatTypePercentage
    .filter((seatType) => seatType.percentage * 100 >= 1)
    .map((seatType) => ({
      ...seatType,
      percentage: Number(seatType.percentage.toFixed(2)),
    }));

  const roundedTravellerTypePercentage = travellerTypePercentage
    .filter((travellerType) => travellerType.percentage * 100 >= 1)
    .map((travellerType) => ({
      ...travellerType,
      percentage: Number(travellerType.percentage.toFixed(2)),
    }));

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Customer Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Reviews by Country</h3>
          <div className="chart-container h-full">
            <BarGraph
              values={reviewsByCountry.map((review) => review.count)}
              valueLabels={reviewsByCountry.map((review) => review.country)}
              xTitle="Number of Reviews"
              backgroundColor={["rgba(255, 99, 132, 0.7)"]}
              borderColor={["rgb(255, 99, 132)"]}
              borderWidth={1}
              height="300px"
              axis="y"
              showDataLabels={true}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Verified vs. Unverified Reviews Composition
          </h3>
          <div className="chart-container h-full">
            <PieGraph
              values={[
                roundedVerifiedAndUnverifiedReviews.verified,
                roundedVerifiedAndUnverifiedReviews.unverified,
              ]}
              valueLabels={["Verified", "Unverified"]}
              title="Verified vs Unverified Reviews (%)"
              backgroundColor={[
                "rgba(100, 200, 100, 0.7)",
                "rgba(255, 99, 132, 0.7)",
              ]}
              borderColor={["rgba(100, 200, 100, 0.7)", "rgba(255, 99, 132)"]}
              borderWidth={1}
              height="100%"
              legendPosition="right"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Seat Type Composition</h3>
          <div className="chart-container h-64">
            <PieGraph
              valueLabels={roundedSeatTypePercentage.map(
                (seatType) => seatType.seatType
              )}
              values={roundedSeatTypePercentage.map(
                (seatType) => seatType.percentage
              )}
              backgroundColor={[
                "rgba(255, 159, 64, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 99, 132, 0.7)",
              ]}
              borderColor={[
                "rgb(255, 159, 64)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
                "rgb(255, 99, 132)",
              ]}
              borderWidth={1}
              title="Reviews by Seat Type (%)"
            />
          </div>
        </div>
		<div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Traveller Type Composition
            </h3>
            <div className="chart-container h-64">
              <PieGraph
                valueLabels={roundedTravellerTypePercentage.map(
                  (travellerType) => travellerType.travellerType
                )}
                values={roundedTravellerTypePercentage.map(
                  (travellerType) => travellerType.percentage
                )}
                backgroundColor={[
                  "rgba(255, 159, 64, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(107, 114, 128, 0.7)",
                ]}
                borderColor={[
                  "rgb(255, 159, 64)",
                  "rgb(75, 192, 192)",
                  "rgb(153, 102, 255)",
                  "rgb(255, 99, 132)",
                  "rgb(107, 114, 128)",
                ]}
                borderWidth={1}
                title="Reviews by Traveller Type (%)"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalysis;
