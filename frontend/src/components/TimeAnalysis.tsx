"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import LineChart from "@/components/custom-ui/LineChart";
import BarGraph from "@/components/custom-ui/BarChart";
import FilterSection from "@/components/custom-ui/FilterSection";
import { LineChartDataset, LineChartYAxis } from "@/types/LineChart";
import { getTimeBasedAllServices } from "@/lib/reviewsApi";
import type { AllServices } from "@/types/reviews";

type Props = {
  airlineSlug: string;
};

const serviceFilterOptions = [
  { label: "Seat Comfort", value: "seat_comfort" },
  { label: "Cabin Staff Service", value: "cabin_staff_service" },
  { label: "Food & Beverages", value: "food_and_beverages" },
  { label: "Ground Service", value: "ground_service" },
  { label: "Inflight Entertainment", value: "inflight_entertainment" },
  { label: "Value for Money", value: "value_for_money" },
  { label: "Wifi & Connectivity", value: "wifi_and_connectivity" },
];

const TimeAnalysis: React.FC<Props> = ({ airlineSlug }) => {
  const { data, error, isLoading, mutate } = useSWR<{
    reviewsOverTime: { year: number; count: number }[];
    avgRecommendation: { year: number; percentage: number }[];
    avgScore: { year: number; averageScore: number }[];
    avgMoneyValue: { year: number; averageMoneyValue: number }[];
    allServices: AllServices;
  }>(
    airlineSlug ? ["time_based_analysis", airlineSlug] : null,
    () => getTimeBasedAllServices(airlineSlug)
  );

  const [selectedService, setSelectedService] =
    useState<string>("seat_comfort");

  // Graceful fallbacks while data loads
  const reviewsOverTime = data?.reviewsOverTime ?? [];
  const avgRecommendation =
    data?.avgRecommendation?.map((i) => ({
      ...i,
      percentage: Number(Number(i.percentage ?? 0).toFixed(2)),
    })) ?? [];
  const avgMoneyValue =
    data?.avgMoneyValue?.map((i) => ({
      ...i,
      averageMoneyValue: Number(Number(i.averageMoneyValue ?? 0).toFixed(2)),
    })) ?? [];
  const avgScore =
    data?.avgScore?.map((i) => ({
      ...i,
      averageScore: Number(Number(i.averageScore ?? 0).toFixed(2)),
    })) ?? [];
  const allServices = data?.allServices ?? ({} as AllServices);

  const allServiceYears = useMemo(() => {
    const byService = allServices[selectedService] ?? {};
    // keys are strings (years); keep as strings to feed chart labels
    return Object.keys(byService).sort();
  }, [allServices, selectedService]);

  const lineChart1: { datasets: LineChartDataset[]; yAxes: LineChartYAxis[] } =
    {
      datasets: [
        {
          label: "Total Reviews",
          data: reviewsOverTime.map((item) => item.count),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y",
        },
        {
          label: "Avg Recommendation (%)",
          data: avgRecommendation.map((item) => item.percentage),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y1",
        },
      ],
      yAxes: [
        { id: "y", position: "left", title: "Number of Reviews", min: 0 },
        { id: "y1", position: "right", title: "Percentage", min: 0, max: 100 },
      ],
    };

  const lineChart2: { datasets: LineChartDataset[]; yAxes: LineChartYAxis[] } =
    {
      datasets: [
        {
          label: "Avg Money Value",
          data: avgMoneyValue.map((item) => item.averageMoneyValue),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          yAxisID: "y",
        },
        {
          label: "Avg Score",
          data: avgScore.map((item) => item.averageScore),
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          yAxisID: "y",
        },
      ],
      yAxes: [
        {
          id: "y",
          position: "left",
          title: "Range of Score",
          min: 0,
          max: 5,
          stepSize: 1,
        },
      ],
    };

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Time-based Analysis</h2>

      {/* states */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-red-500">
          <span>Failed to load time-based analysis.</span>
          <button
            onClick={() => mutate()}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Reviews and Recommendation Trends */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Reviews and Recommendation Trends
            </h3>
            <div className="chart-container">
              <LineChart
                valueLabels={reviewsOverTime.map((item) => String(item.year))}
                xTitle="Year"
                title="Reviews and Recommendation Trends"
                datasets={lineChart1.datasets}
                yAxes={lineChart1.yAxes}
              />
            </div>
          </div>

          {/* Money Value and Score Trends */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Money Value and Score Trends
            </h3>
            <div className="chart-container">
              <LineChart
                valueLabels={avgMoneyValue.map((item) => String(item.year))}
                xTitle="Year"
                title="Money Value and Score Trends"
                datasets={lineChart2.datasets}
                yAxes={lineChart2.yAxes}
              />
            </div>
          </div>

          {/* Yearly Distribution of Ratings Stacked Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Yearly Distribution of{" "}
              {selectedService
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
              Ratings
            </h3>

            {/* Filter Section */}
            <div className="mt-6 mb-8">
              <FilterSection
                title="Service Type"
                options={serviceFilterOptions}
                initialValue={selectedService}
                onFilterChange={setSelectedService}
                placeholder="Select a service type"
              />
            </div>

            <div className="chart-container h-64">
              <BarGraph
                valueLabels={allServiceYears}
                datasets={[
                  {
                    label: "1",
                    data: allServiceYears.map(
                      (year) =>
                        allServices[selectedService]?.[parseInt(year)]?.[1] ??
                        0
                    ),
                    backgroundColor: "rgba(255, 99, 132, 0.7)",
                    borderColor: "rgba(255, 99, 132, 0.7)",
                  },
                  {
                    label: "2",
                    data: allServiceYears.map(
                      (year) =>
                        allServices[selectedService]?.[parseInt(year)]?.[2] ??
                        0
                    ),
                    backgroundColor: "rgba(255, 159, 64, 0.7)",
                    borderColor: "rgba(255, 159, 64, 0.7)",
                  },
                  {
                    label: "3",
                    data: allServiceYears.map(
                      (year) =>
                        allServices[selectedService]?.[parseInt(year)]?.[3] ??
                        0
                    ),
                    backgroundColor: "rgba(255, 206, 86, 0.8)",
                    borderColor: "rgba(255, 206, 86, 0.8)",
                  },
                  {
                    label: "4",
                    data: allServiceYears.map(
                      (year) =>
                        allServices[selectedService]?.[parseInt(year)]?.[4] ??
                        0
                    ),
                    backgroundColor: "#99d594",
                    borderColor: "#99d594",
                  },
                  {
                    label: "5",
                    data: allServiceYears.map(
                      (year) =>
                        allServices[selectedService]?.[parseInt(year)]?.[5] ??
                        0
                    ),
                    backgroundColor: "rgba(34, 197, 94)",
                    borderColor: "rgba(34, 197, 94)",
                  },
                ]}
                xTitle="Year"
                yTitle="Count of Ratings"
                title={`Yearly Distribution of ${selectedService
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())} Ratings`}
                stacked
                height="300px"
                datasetsTitle="Rating"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeAnalysis;
