import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";
import { LineChartDataset, LineChartYAxis } from "@/types/LineChart";
import { useColorTheme } from "@/app/context/ThemeContext";

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
  const { isDarkMode, mounted } = useColorTheme();

  if (!mounted) return <p>Loading...</p>;

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
		color: isDarkMode ? "#e5e7eb" : "black",
      },
      grid: {
        color: isDarkMode ? "#404040" : "rgba(0, 0, 0, 0.1)",
        drawOnChartArea: true,
      },
      ticks: {
        color: isDarkMode ? "#e5e7eb" : "black",
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
        color: isDarkMode ? "#e5e7eb" : "black",
      },
      min: axis.min,
      max: axis.max,
      grid: {
        color: isDarkMode ? "#404040" : "rgba(0, 0, 0, 0.1)",
        drawOnChartArea: axis.position === "left",
      },
      ticks: axis.stepSize ? { 
        stepSize: axis.stepSize,
        color: isDarkMode ? "#e5e7eb" : "black"
      } : {
		color: isDarkMode ? "#e5e7eb" : "black",
	  },
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
        labels: {
          color: isDarkMode ? "#e5e7eb" : "black",
        },
      },
      title: title
        ? {
            display: false,
            text: title,
          }
        : undefined,
    },
    scales,
  };

  return (
    <div className="dark:brightness-90">
    <BaseChart
      type="line"
      data={chartData}
      options={options}
      height={height}
      width={width}
    />
    </div>
  );
};

export default LineChart;
