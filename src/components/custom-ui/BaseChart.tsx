"use client";

import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

/**
 * Register all required Chart.js components
 * This is necessary before using any chart functionality
 */
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

// Define the supported chart types
type ChartType = "line" | "bar" | "pie" | "doughnut";

/**
 * Props interface for the BaseChart component
 * @property type - The type of chart to render
 * @property data - The data to display in the chart
 * @property options - Optional chart configuration options
 * @property height - Optional height of the chart container
 * @property width - Optional width of the chart container
 */
interface BaseChartProps {
	type: ChartType;
	data: ChartData<any>;
	options?: ChartOptions<any>;
	height?: string;
	width?: string;
}

/**
 * BaseChart Component
 *
 * A reusable chart component that serves as the foundation for all chart types.
 * It handles the common functionality and rendering logic for different chart types.
 *
 * @param type - The type of chart to render
 * @param data - The data to display in the chart
 * @param options - Optional chart configuration options
 * @param height - Optional height of the chart container (default: "300px")
 * @param width - Optional width of the chart container (default: "100%")
 */
const BaseChart: React.FC<BaseChartProps> = ({
	type,
	data,
	options,
	height = "300px",
	width = "100%",
}) => {
	// Default chart options that apply to all chart types
	const defaultOptions: ChartOptions = {
		responsive: true, // Make the chart responsive to container size
		maintainAspectRatio: false, // Allow custom height/width
		plugins: {
			legend: {
				position: "top" as const, // Position legend at the top
			},
		},
	};

	// Merge default options with any custom options provided
	const chartOptions = { ...defaultOptions, ...options };

	/**
	 * Render the appropriate chart component based on the type
	 * @returns The React component for the selected chart type
	 */
	const renderChart = () => {
		switch (type) {
			case "line":
				return <Line data={data} options={chartOptions} />;
			case "bar":
				return <Bar data={data} options={chartOptions} />;
			case "pie":
				return <Pie data={data} options={chartOptions} />;
			case "doughnut":
				return <Doughnut data={data} options={chartOptions} />;
			default:
				return null;
		}
	};

	// Return a container div with the chart inside
	return <div style={{ height, width }}>{renderChart()}</div>;
};

export default BaseChart;