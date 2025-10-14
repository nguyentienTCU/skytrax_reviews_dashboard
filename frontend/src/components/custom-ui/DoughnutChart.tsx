"use client";

import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";

interface DoughnutChartProps {
  title?: string;
  valueLabels: string[];
  values: number[];
  height?: string;
  width?: string;
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  title,
  valueLabels,
  values,
  height,
  width,
  backgroundColor,
  borderColor,
  borderWidth,
}) => {
  // Track which segments are visible
  const [visibleSegments, setVisibleSegments] = useState<boolean[]>(
    new Array(values.length).fill(true)
  );

  const chartData: ChartData<"doughnut"> = {
    labels: valueLabels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColor || [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: borderColor || [
          "rgb(75, 192, 192)",
          "rgb(255, 206, 86)",
          "rgb(255, 99, 132)",
        ],
        borderWidth: borderWidth || 1,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "right",
        onClick: (event, legendItem, legend) => {
          const chart = legend.chart;
          const index = legendItem.index ?? 0;

          chart.toggleDataVisibility(index); // ✅ hides or shows the segment
          chart.update();

          setVisibleSegments((prev) => {
            const newVisible = [...prev];
            newVisible[index] = !newVisible[index];
            return newVisible;
          });
        },
      },
      title: {
        display: true,
        text: title || " ",
      },
      datalabels: {
        formatter: (value: number, context) => {
          const chart = context.chart;
          const index = context.dataIndex;

          // 👇 Check if that data index is currently visible
          if (!chart.getDataVisibility(index)) return "";

          // Calculate total of only visible segments
          const visibleIndices = values.map((v, i) =>
            chart.getDataVisibility(i) ? v : 0
          );

          const totalVisible = visibleIndices.reduce((a, b) => a + b, 0);
          const percentage = (value / totalVisible) * 100;

          return percentage >= 5 ? percentage.toFixed(2) + "%" : "";
        },
        color: "#e5e7eb",
        font: {
          weight: "bold",
        },
      },
    },
  };

  return (
    <BaseChart
      type="doughnut"
      data={chartData}
      options={options}
      height={height}
      width={width}
      plugins={[ChartDataLabels]}
    />
  );
};

export default DoughnutChart;
