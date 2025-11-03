"use client";

import React from "react";
import useSWR from "swr";
import BarGraph from "@/components/custom-ui/BarChart";
import { getRouteAnalysis } from "@/lib/reviewsApi";
import type { RouteAnalysis as RouteAnalysisType } from "@/types/reviews";

type Props = {
  airlineSlug: string;
};

const RouteAnalysis: React.FC<Props> = ({ airlineSlug }) => {
  const { data, error, isLoading, mutate } = useSWR<RouteAnalysisType>(
    airlineSlug ? ["route_analysis", airlineSlug] : null,
    () => getRouteAnalysis(airlineSlug)
  );

  // graceful fallbacks
  const topOriginCities = data?.topOriginCities ?? [];
  const topDestinationCities = data?.topDestinationCities ?? [];
  const topRoutes = data?.topRoutes ?? [];

  if (isLoading) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mt-6" />
        <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mt-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4">
        <h2 className="text-xl font-bold mb-4 ">Route Analysis</h2>
        <p className="text-red-500 mb-3">Failed to load route analysis.</p>
        <button
          onClick={() => mutate()}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4 ">Route Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Origin Cities */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Top Origin Cities</h3>
          <div className="chart-container h-80">
            <BarGraph
              valueLabels={topOriginCities.map((c) => c.city)}
              values={topOriginCities.map((c) => c.count)}
              xTitle="Number of Reviews"
              backgroundColor={["rgba(153, 102, 255, 0.7)"]}
              borderColor={["rgb(153, 102, 255)"]}
              borderWidth={1}
              axis="y"
              showDataLabels
            />
          </div>
        </div>

        {/* Top Destination Cities */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Top Destination Cities</h3>
          <div className="chart-container h-80">
            <BarGraph
              valueLabels={topDestinationCities.map((c) => c.city)}
              values={topDestinationCities.map((c) => c.count)}
              xTitle="Number of Reviews"
              backgroundColor={["rgba(255, 206, 86, 0.7)"]}
              borderColor={["rgb(255, 206, 86)"]}
              borderWidth={1}
              axis="y"
              showDataLabels
            />
          </div>
        </div>
      </div>

      {/* Popular Routes Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Popular Routes</h3>
        {topRoutes.length === 0 ? (
          <p className="text-sm opacity-80">No route data available.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Count
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Avg. Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.map((route, index) => {
                  const rounded = Math.floor(route.averageRating ?? 0);
                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-200 ">
                        {route.origin}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 ">
                        {route.destination}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 ">
                        {route.count}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 ">
                        <div className="flex items-center">
                          <span className="text-yellow-500">
                            {"★".repeat(rounded)}
                          </span>
                          <span className="text-gray-200">
                            {"★".repeat(5 - rounded)}
                          </span>
                          <span className="ml-1">
                            {Number(route.averageRating ?? 0).toFixed(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteAnalysis;
