import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";

interface ReviewsTimeChartProps {
	title?: string;
    xTitle?: string;
    yTitle?: string;
    valueLabels: string[];
	values: number[];
	height?: string;
	width?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
}

const ReviewsTimeChart: React.FC<ReviewsTimeChartProps> = ({
	title,
    valueLabels,
    values,
    xTitle,
    yTitle,
	height,
	width,
    backgroundColor,
    borderColor,
    borderWidth,

}) => {
	const chartData: ChartData<"line"> = {
		labels: valueLabels,
		datasets: [
			{
				label: title || " ",
				data: values,
				borderColor: borderColor || "rgb(59, 130, 246)",
				backgroundColor: backgroundColor || "rgba(59, 130, 246, 0.1)",
				tension: 0.3,
				fill: true,
			},
		],
	};

	const options: ChartOptions<"line"> = {
		plugins: {
			legend: {
				display: true,
				position: "top",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: yTitle || " ",
				},
			},
			x: {
				title: {
					display: true,
					text: xTitle || " ",
				},
			},
		},
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

export default ReviewsTimeChart;