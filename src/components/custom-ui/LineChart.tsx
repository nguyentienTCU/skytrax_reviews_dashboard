import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";
import { LineChartDataset, LineChartYAxis } from "@/type/LineChart";

interface LineChartProps {
  title?: string;
  xTitle?: string;
  valueLabels: string[];
  datasets: LineChartDataset[];
  yAxes: LineChartYAxis[];
  height?: string;
  width?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  xTitle,
  valueLabels,
  datasets,
  yAxes,
  height,
  width,
}) => {
  const chartData: ChartData<"line"> = {
    labels: valueLabels,
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.borderColor || "rgb(53, 162, 235)",
      backgroundColor: ds.backgroundColor || "rgba(53, 162, 235, 0.5)",
      yAxisID: ds.yAxisID || yAxes[0]?.id || "y",
      fill: ds.fill !== undefined ? ds.fill : true,
      tension: ds.tension !== undefined ? ds.tension : 0.3,
      borderWidth: ds.borderWidth || 2,
    })),
  };

  const scales: any = {
    x: {
      title: {
        display: true,
        text: xTitle || " ",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
        drawOnChartArea: true,
      },
    },
  };
  yAxes.forEach((axis) => {
    scales[axis.id] = {
      type: "linear",
      display: axis.display !== false,
      position: axis.position,
      title: {
        display: true,
        text: axis.title,
      },
      min: axis.min,
      max: axis.max,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
        drawOnChartArea: axis.position === "left",
      },
      ticks: axis.stepSize ? { stepSize: axis.stepSize } : undefined,
    };
  });

  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: title
        ? {
            display: true,
            text: title,
          }
        : undefined,
    },
    scales,
  };

  return (
    <BaseChart
      type="line"
      data={chartData}
      options={options}
      height={height}
      width={width}
    />
  );
};

export default LineChart;
