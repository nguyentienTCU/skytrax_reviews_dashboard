"use client";

import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useColorTheme } from "@/app/context/ThemeContext";

interface BarGraphProps {
  valueLabels?: string[];
  values?: number[];
  datasets?: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
  height?: string;
  width?: string;
  xTitle?: string;
  yTitle?: string;
  title?: string;
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  axis?: "x" | "y";
  stacked?: boolean;
  datasetsTitle?: string;
  showDataLabels?: boolean;
}

const BarGraph: React.FC<BarGraphProps> = ({
  valueLabels,
  values,
  datasets,
  height,
  width,
  xTitle,
  yTitle,
  title,
  backgroundColor,
  borderColor,
  borderWidth,
  axis,
  stacked,
  datasetsTitle,
  showDataLabels = false,
}) => {
  //   const { theme, resolvedTheme } = useTheme();
  //   const [mounted, setMounted] = useState(false);
  //   const [isDarkMode, setIsDarkMode] = useState(false);

  //   useEffect(() => {
  //     setMounted(true);
  //     localStorage.setItem("theme", "system");
  //   }, []);

  //   useEffect(() => {
  //     console.log("resolvedTheme: " + resolvedTheme);
  //     console.log("theme: " + theme);
  //     setIsDarkMode(resolvedTheme === "dark");
  //   }, [resolvedTheme]);

  const { isDarkMode, mounted } = useColorTheme();

  if (!mounted) return <p>Loading...</p>;

  const chartData: ChartData<"bar"> = {
    labels: valueLabels || [],
    datasets: datasets
      ? datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor,
          borderColor: ds.borderColor,
          borderWidth: borderWidth || 1,
        }))
      : [
          {
            label: title || " ",
            data: values || [],
            backgroundColor: backgroundColor || [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(201, 203, 207, 0.7)",
            ],
            borderColor: borderColor || [
              "rgb(54, 162, 235)",
              "rgb(75, 192, 192)",
              "rgb(255, 206, 86)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(255, 99, 132)",
              "rgb(201, 203, 207)",
            ],
            borderWidth: borderWidth || 1,
          },
        ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        display: datasets ? true : false,
        position: "top",
        align: "end",
        labels: {
          color: isDarkMode ? "#e5e7eb" : "black",
        },
        title: {
          display: true,
          text: datasetsTitle || " ",
          color: isDarkMode ? "#e5e7eb" : "black",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: {
            bottom: 0,
          },
        },
      },
      datalabels: {
        display: showDataLabels ? "auto" : false,
        anchor: axis === "y" ? "end" : "end",
        align: axis === "y" ? "right" : "top",
        offset: axis === "y" ? 4 : 0,
        formatter: (value) => value,
        color: isDarkMode ? "#e5e7eb" : "black",
        font: {
          weight: "bold",
        },
      },
    },
    indexAxis: axis || "x",
    scales: {
      x: {
        stacked: stacked || false,
        title: {
          display: true,
          text: xTitle || " ",
          color: isDarkMode ? "#e5e7eb" : "black",
        },
        grid: {
          color: isDarkMode ? "#404040" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#e5e7eb" : "black",
        },
      },
      y: {
        stacked: stacked || false,
        beginAtZero: true,
        title: {
          display: true,
          text: yTitle || " ",
          color: isDarkMode ? "#e5e7eb" : "black",
        },
        grid: {
          color: isDarkMode ? "#404040" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#e5e7eb" : "black",
        },
      },
    },
    layout: {
      padding: {
        right: axis === "y" ? 38 : 0, // Add padding when horizontal bars
      },
    },
  };

  return (
    <div className="dark:brightness-90">
      <BaseChart
        type="bar"
        data={chartData}
        options={options}
        height={height}
        width={width}
        plugins={showDataLabels ? [ChartDataLabels] : []}
      />
    </div>
  );
};

export default BarGraph;
