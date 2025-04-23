import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";

interface PieChartProps {
    title?: string;
    valueLabels: string[];
    values: number[];
	height?: string;
	width?: string;
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
    legendPosition?: "right" | "center" | "left" | "top" | "bottom" | "chartArea";
}

const PieChart: React.FC<PieChartProps> = ({
    title,
    valueLabels,
    values,
	height,
	width,
    backgroundColor,
    borderColor,
    borderWidth,
    legendPosition,
}) => {
	const chartData: ChartData<"pie"> = {
		labels: valueLabels,
		datasets: [
			{
				data: values,
				backgroundColor: backgroundColor || [
					"rgba(75, 192, 192, 0.7)",
					"rgba(255, 206, 86, 0.7)",
					"rgba(255, 99, 132, 0.7)",
				],
				borderColor: borderColor ||[
					"rgb(75, 192, 192)",
					"rgb(255, 206, 86)",
					"rgb(255, 99, 132)",
				],
				borderWidth: 1,
			},
		],
	};

	const options: ChartOptions<"pie"> = {
		plugins: {
			legend: {
				position: legendPosition || "right",
			},
			title: {
				display: true,
				text: title || " ",
			},
		},
	};

	return (
		<BaseChart
			type="pie"
			data={chartData}
			options={options}
			height={height}
			width={width}
		/>
	);
};

export default PieChart;