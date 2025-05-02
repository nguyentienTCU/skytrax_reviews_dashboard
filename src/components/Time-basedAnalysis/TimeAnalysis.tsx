"use client";
import React, { useEffect, useState } from "react";
import LineChart from "@/components/custom-ui/LineChart";
import BarGraph from "@/components/custom-ui/BarChart";
import FilterSection from "@/components/custom-ui/FilterSection";
import { LineChartDataset, LineChartYAxis } from "@/type/LineChart";
import { TimeAnalysisData, ServiceRatings } from "@/type/TimeAnalysisData";

const TimeAnalysis = () => {
  const [data, setData] = useState<TimeAnalysisData>({
    reviewsOverTime: [],
    avgRecommendation: [],
    avgScore: [],
    avgMoneyValue: [],
    allServices: {
      seat_comfort: {},
      cabin_staff_service: {},
      food_and_beverages: {},
      ground_service: {},
      inflight_entertainment: {},
      value_for_money: {},
      wifi_and_connectivity: {},
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/fetchData/fetchTimeAnalysisData");
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  const {
    reviewsOverTime,
    avgRecommendation,
    avgScore,
    avgMoneyValue,
    allServices,
  } = data;

  const roundedAvgRecommendation = avgRecommendation.map((item) => ({
    ...item,
    percentage: Number(item.percentage.toFixed(2)),
  }));

  const roundedAvgMoneyValue = avgMoneyValue.map((item) => ({
    ...item,
    averageMoneyValue: Number(item.averageMoneyValue.toFixed(2)),
  }));

  const roundedAvgScore = avgScore.map((item) => ({
    ...item,
    averageScore: Number(item.averageScore.toFixed(2)),
  }));

  const [selectedService, setSelectedService] =
    useState<string>("seat_comfort");

  // aLL years for charts
  const allServiceYears = Object.keys(allServices[selectedService]);

  // Filter options
  const serviceFilterOptions = [
    { label: "Seat Comfort", value: "seat_comfort" },
    { label: "Cabin Staff Service", value: "cabin_staff_service" },
    { label: "Food & Beverages", value: "food_and_beverages" },
    { label: "Ground Service", value: "ground_service" },
    { label: "Inflight Entertainment", value: "inflight_entertainment" },
    { label: "Value for Money", value: "value_for_money" },
    { label: "Wifi & Connectivity", value: "wifi_and_connectivity" },
  ];

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
          data: roundedAvgRecommendation.map((item) => item.percentage),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y1",
        },
      ],
      yAxes: [
        {
          id: "y",
          position: "left",
          title: "Number of Reviews",
          min: 0,
        },
        {
          id: "y1",
          position: "right",
          title: "Percentage",
          min: 0,
          max: 100,
        },
      ],
    };

  const lineChart2: { datasets: LineChartDataset[]; yAxes: LineChartYAxis[] } =
    {
      datasets: [
        {
          label: "Avg Money Value",
          data: roundedAvgMoneyValue.map((item) => item.averageMoneyValue),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          yAxisID: "y",
        },
        {
          label: "Avg Score",
          data: roundedAvgScore.map((item) => item.averageScore),
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

      {/* Reviews and Recommendation Trends */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Reviews and Recommendation Trends
        </h3>
        <div className="chart-container">
          <LineChart
            valueLabels={reviewsOverTime.map((item) => item.year.toString())}
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
            valueLabels={avgMoneyValue.map((item) => item.year.toString())}
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
                    allServices[selectedService]?.[parseInt(year)]?.[1] || 0
                ),
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderColor: "rgba(255, 99, 132, 0.7)",
              },
              {
                label: "2",
                data: allServiceYears.map(
                  (year) =>
                    allServices[selectedService]?.[parseInt(year)]?.[2] || 0
                ),
                backgroundColor: "rgba(255, 206, 86, 0.7)",
                borderColor: "rgba(255, 206, 86, 0.7)",
              },
              {
                label: "3",
                data: allServiceYears.map(
                  (year) =>
                    allServices[selectedService]?.[parseInt(year)]?.[3] || 0
                ),
                backgroundColor: "rgba(135, 206, 250, 0.7)",
                borderColor: "rgba(135, 206, 250, 0.7)",
              },
              {
                label: "4",
                data: allServiceYears.map(
                  (year) =>
                    allServices[selectedService]?.[parseInt(year)]?.[4] || 0
                ),
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 0.7)",
              },
              {
                label: "5",
                data: allServiceYears.map(
                  (year) =>
                    allServices[selectedService]?.[parseInt(year)]?.[5] || 0
                ),
                backgroundColor: "#16a085",
                borderColor: "#16a085",
              },
            ]}
            xTitle="Year"
            yTitle="Count of Ratings"
            title={`Yearly Distribution of ${selectedService
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())} Ratings`}
            stacked={true}
            height="300px"
            datasetsTitle="Rating"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
