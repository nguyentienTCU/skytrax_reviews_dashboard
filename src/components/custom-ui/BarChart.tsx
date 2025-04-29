import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";

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
					font: {
						size: 14,
						weight: "bold",
					},
					padding: {
						bottom: 0,
					},
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
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
				},
			},
			y: {
				stacked: stacked || false,
				beginAtZero: true,
				title: {
					display: true,
					text: yTitle || " ",
				},
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
				},
			},
		},
	};

	return (
		<div className="dark:invert dark:brightness-90">
			<BaseChart
				type="bar"
				data={chartData}
				options={options}
				height={height}
				width={width}
			/>
		</div>
	);
};

export default BarGraph;
