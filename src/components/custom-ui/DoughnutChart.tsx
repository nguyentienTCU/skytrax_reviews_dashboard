import { ChartData, ChartOptions } from "chart.js";
import BaseChart from "./BaseChart";

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
			},
			title: {
				display: true,
				text: title || " ",
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
		/>
	);
};

export default DoughnutChart;