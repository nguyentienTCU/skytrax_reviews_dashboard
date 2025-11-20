"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import PieGraph from "@/components/custom-ui/PieChart";
import BarGraph from "@/components/custom-ui/BarChart";
import { getAircraftAnalysis } from "@/lib/reviewsApi";
import type { AircraftAnalysis as AircraftAnalysisType } from "@/types/reviews";

type Props = {
  airlineSlug: string;
};

const AircraftAnalysis: React.FC<Props> = ({ airlineSlug }) => {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<AircraftAnalysisType>(
    airlineSlug ? ["aircraft_analysis", airlineSlug] : null,
    () => getAircraftAnalysis(airlineSlug)
  );

  const manufacturers = data?.aircraftManufacturersPercentage ?? [];
  const models = data?.aircraftModels ?? [];


  const roundedManufacturersPercentage = useMemo(
    () =>
      manufacturers
        .filter((m) => (m?.percentage ?? 0) >= 1)
        .map((m) => ({
          ...m,
          percentage: Number((m.percentage ?? 0).toFixed(2)),
        })),
    [manufacturers]
  );

  // basic color sets (auto-trim to label count)
  const pieBg = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
  ].slice(0, roundedManufacturersPercentage.length);

  const pieBorder = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 206, 86)",
    "rgb(75, 192, 192)",
    "rgb(153, 102, 255)",
  ].slice(0, roundedManufacturersPercentage.length);

  // loading state
  if (isLoading) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4">
        <h2 className="text-xl font-bold mb-2">Aircraft Analysis</h2>
        <p className="text-red-500 mb-3">Failed to load aircraft analysis.</p>
        <button
          onClick={() => mutate()}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // empty state (no data)
  if (!manufacturers.length && !models.length) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4">
        <h2 className="text-xl font-bold mb-2">Aircraft Analysis</h2>
        <p className="text-sm opacity-80">No aircraft data available.</p>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4">
      <h2 className="text-xl font-bold mb-4">Aircraft Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Aircraft Manufacturers Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Top Aircraft Manufacturers Composition
          </h3>
          <div className="chart-container h-80">
            <PieGraph
              valueLabels={roundedManufacturersPercentage.map((m) => m.manufacturer)}
              values={roundedManufacturersPercentage.map((m) => m.percentage)}
              backgroundColor={pieBg}
              borderColor={pieBorder}
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
              valueLabels={models.map((m) => m.model)}
              values={models.map((m) => m.count)}
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
