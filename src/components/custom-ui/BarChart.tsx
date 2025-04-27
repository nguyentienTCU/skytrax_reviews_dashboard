import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";

interface BarChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

interface BarGraphProps {
  title?: string;
  xTitle?: string;
  yTitle?: string;
  valueLabels: string[];
  values?: number[];
  datasets?: BarChartDataset[];
  datasetsTitle?: string;
  height?: string;
  width?: string;
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  axis?: "x" | "y";
  stacked?: boolean;
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
}) => {
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
        title: {
          display: true,
          text: datasetsTitle || " ",
          color: "black",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: {
            bottom: 0,
          }
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
        },
      },
      y: {
        stacked: stacked || false,
        beginAtZero: true,
        title: {
          display: true,
          text: yTitle || " ",
        },
      },
    },
  };

  return (
    <BaseChart
      type="bar"
      data={chartData}
      options={options}
      height={height}
      width={width}
    />
  );
};

export default BarGraph;
