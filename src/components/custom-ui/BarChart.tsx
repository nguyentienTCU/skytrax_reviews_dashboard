import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";

interface BarGraphProps {
	title?: string;
    xTitle?: string;
    yTitle?: string;
	valueLabels: string[];
	values: number[];
	height?: string;
	width?: string;
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
	axis?: "x" | "y";
}

const BarGraph: React.FC<BarGraphProps> = ({
	valueLabels,
	values,
	height,
	width,
	xTitle,
	yTitle,
	title,
	backgroundColor,
	borderColor,
	borderWidth,
	axis,
}) => {
	const chartData: ChartData<"bar"> = {
		labels: valueLabels || [],
		datasets: [
			{
				label: title || " ",
				data: values || [],
				backgroundColor: backgroundColor || [
					"rgba(54, 162, 235, 0.7)",
					"rgba(75, 192, 192, 0.7)",
					"rgba(255, 206, 86, 0.7)",
					"rgba(153, 102, 255, 0.7)", // default background color
					"rgba(255, 159, 64, 0.7)",
					"rgba(255, 99, 132, 0.7)",
					"rgba(201, 203, 207, 0.7)",
				], 
				borderColor: borderColor || [
					"rgb(54, 162, 235)",
					"rgb(75, 192, 192)",
					"rgb(255, 206, 86)",
					"rgb(153, 102, 255)", // default border color
					"rgb(255, 159, 64)",
					"rgb(255, 99, 132)",
					"rgb(201, 203, 207)",
				],
				borderWidth: borderWidth || 1, // default border width
			},
		],
	};

	const options: ChartOptions<"bar"> = {
		plugins: {
			legend: {
				display: false,
			},
		},
		indexAxis: axis || "x",
		scales: {
			y: {
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