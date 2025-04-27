"use client";
import React, { useEffect, useState } from "react";
import LineChart from "@/components/custom-ui/LineChart";
import BarGraph from "@/components/custom-ui/BarChart";
import FilterSection from "@/components/custom-ui/FilterSection";
import { LineChartDataset, LineChartYAxis } from "@/type/LineChart";
import { TimeAnalysisData } from "@/type/TimeAnalysisData";
// Mock data for different services' ratings
const serviceRatingsData = {
  seat_comfort: {
    "1": [10, 15, 60, 120, 180, 160, 100, 80, 60, 40, 10],
    "2": [5, 10, 50, 100, 120, 110, 80, 60, 50, 30, 5],
    "3": [8, 12, 80, 140, 200, 180, 120, 100, 80, 60, 8],
    "4": [2, 8, 90, 180, 220, 200, 140, 120, 100, 80, 2],
    "5": [1, 5, 70, 160, 180, 170, 110, 90, 70, 50, 1],
  },
  cabin_staff_service: {
    "1": [8, 12, 50, 100, 150, 140, 90, 70, 50, 30, 8],
    "2": [4, 8, 40, 80, 100, 90, 60, 40, 30, 20, 4],
    "3": [10, 15, 70, 130, 180, 160, 110, 90, 70, 50, 10],
    "4": [3, 10, 80, 160, 200, 180, 130, 110, 90, 70, 3],
    "5": [2, 6, 60, 140, 160, 150, 100, 80, 60, 40, 2],
  },
  food_and_beverages: {
    "1": [12, 18, 70, 140, 190, 170, 120, 90, 70, 50, 12],
    "2": [6, 12, 60, 120, 140, 130, 90, 70, 60, 40, 6],
    "3": [9, 15, 90, 160, 220, 200, 140, 120, 100, 80, 9],
    "4": [4, 10, 100, 200, 240, 220, 160, 140, 120, 100, 4],
    "5": [3, 7, 80, 180, 200, 190, 130, 110, 90, 70, 3],
  },
  ground_service: {
    "1": [9, 14, 65, 130, 170, 150, 110, 85, 65, 45, 9],
    "2": [5, 9, 55, 110, 130, 120, 85, 65, 55, 35, 5],
    "3": [7, 13, 85, 150, 210, 190, 130, 110, 90, 70, 7],
    "4": [3, 9, 95, 190, 230, 210, 150, 130, 110, 90, 3],
    "5": [2, 6, 75, 170, 190, 180, 120, 100, 80, 60, 2],
  },
  inflight_entertainment: {
    "1": [11, 16, 68, 135, 185, 165, 115, 88, 68, 48, 11],
    "2": [6, 11, 58, 115, 135, 125, 88, 68, 58, 38, 6],
    "3": [8, 14, 88, 155, 215, 195, 135, 115, 95, 75, 8],
    "4": [4, 9, 98, 195, 235, 215, 155, 135, 115, 95, 4],
    "5": [3, 7, 78, 175, 195, 185, 125, 105, 85, 65, 3],
  },
  value_for_money: {
    "1": [13, 19, 72, 145, 195, 175, 125, 95, 75, 55, 13],
    "2": [7, 13, 62, 125, 145, 135, 95, 75, 65, 45, 7],
    "3": [10, 16, 92, 165, 225, 205, 145, 125, 105, 85, 10],
    "4": [5, 11, 102, 205, 245, 225, 165, 145, 125, 105, 5],
    "5": [4, 8, 82, 185, 205, 195, 135, 115, 95, 75, 4],
  },
  wifi_and_connectivity: {
    "1": [14, 20, 75, 150, 200, 180, 130, 100, 80, 60, 14],
    "2": [8, 14, 65, 130, 150, 140, 100, 80, 70, 50, 8],
    "3": [11, 17, 95, 170, 230, 210, 150, 130, 110, 90, 11],
    "4": [6, 12, 105, 210, 250, 230, 170, 150, 130, 110, 6],
    "5": [5, 9, 85, 190, 210, 200, 140, 120, 100, 80, 5],
  },
};

const TimeAnalysis = () => {
  const [data, setData] = useState<TimeAnalysisData>({
    reviewsOverTime: [],
    avgRecommendation: [],
    avgScore: [],
    avgMoneyValue: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/fetchData/fetchTimeAnalysisData");
      const data = await response.json();
      setData(data);
      console.log(data);
      console.log("recommendation data", data.avgRecommendation);
      console.log("score data", data.avgScore);
    };
    fetchData();
  }, []);

  const { reviewsOverTime, avgRecommendation, avgScore, avgMoneyValue } = data;

  const [selectedService, setSelectedService] = useState("seat_comfort");

  // Data for charts
  const years = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];

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
          data: avgRecommendation.map((item) => item.percentage),
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
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Time-based Analysis
      </h2>

      {/* Reviews and Recommendation Trends */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
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
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
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

      {/* Filter Section */}
      <div className="mt-8 mb-4">
        <FilterSection
          title="Service Type"
          options={serviceFilterOptions}
          initialValue={selectedService}
          onFilterChange={setSelectedService}
          placeholder="Select a service type"
        />
      </div>

      {/* Yearly Distribution of Ratings Stacked Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Yearly Distribution of{" "}
          {selectedService
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
          Ratings
        </h3>
        <div className="chart-container h-64">
          <BarGraph
            valueLabels={years}
            datasets={[
              {
                label: "1",
                data: serviceRatingsData[
                  selectedService as keyof typeof serviceRatingsData
                ]["1"],
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderColor: "rgba(255, 99, 132, 0.7)",
              },
              {
                label: "2",
                data: serviceRatingsData[
                  selectedService as keyof typeof serviceRatingsData
                ]["2"],
                backgroundColor: "rgba(255, 206, 86, 0.7)",
                borderColor: "rgba(255, 206, 86, 0.7)",
              },
              {
                label: "3",
                data: serviceRatingsData[
                  selectedService as keyof typeof serviceRatingsData
                ]["3"],
                backgroundColor: "rgba(201, 203, 207, 0.7)",
                borderColor: "rgba(201, 203, 207, 0.7)",
              },
              {
                label: "4",
                data: serviceRatingsData[
                  selectedService as keyof typeof serviceRatingsData
                ]["4"],
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 0.7)",
              },
              {
                label: "5",
                data: serviceRatingsData[
                  selectedService as keyof typeof serviceRatingsData
                ]["5"],
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
