import React from "react";
import PieGraph from "@/components/custom-ui/PieChart";
import DoughnutChart from "@/components/custom-ui/DoughnutChart";
import BarGraph from "@/components/custom-ui/BarChart";
import { getAircraftAnalysis } from "@/lib/getData/getAircraftAnalysis";

const AircraftAnalysis = async () => {
	const { aircraftManufacturersPercentage, aircraftModels, aircraftSeatTypePercentage } =
		await getAircraftAnalysis();
	return (
		<div className="card">
			<h2 className="text-xl font-bold mb-4 text-gray-700">
				Aircraft Analysis
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-600 mb-2">
						Top Aircraft Manufacturers
					</h3>
					<div className="chart-container h-80">
						{/* Top Aircraft Manufacturers Pie Chart */}
						<PieGraph
							valueLabels={aircraftManufacturersPercentage.map(
								(manufacturer) => manufacturer.manufacturer
							)}
							values={aircraftManufacturersPercentage.map(
								(manufacturer) => manufacturer.percentage
							)}
							backgroundColor={[
								"rgba(255, 99, 132, 0.7)",
								"rgba(54, 162, 235, 0.7)",
								"rgba(255, 206, 86, 0.7)",
								"rgba(75, 192, 192, 0.7)",
								"rgba(153, 102, 255, 0.7)",
							]}
							borderColor={[
								"rgb(255, 99, 132)",
								"rgb(54, 162, 235)",
								"rgb(255, 206, 86)",
								"rgb(75, 192, 192)",
								"rgb(153, 102, 255)",
							]}
							borderWidth={1}
							title="Distribution by Manufacturer (%)"
							legendPosition="right"
						/>
					</div>
				</div>

				{/* Top Aircraft Models Bar Graph */}
				<div>
					<h3 className="text-lg font-semibold text-gray-600 mb-2">
						Top Aircraft Models
					</h3>
					<div className="chart-container h-80">
						<BarGraph
							valueLabels={aircraftModels.map((model) => model.model)}
							values={aircraftModels.map((model) => model.count)}
							title="Reviews by Aircraft Model"
							backgroundColor={["rgba(54, 162, 235, 0.7)"]}
							borderColor={["rgb(54, 162, 235)"]}
							borderWidth={1}
							axis="y"
						/>
					</div>
				</div>
			</div>

			{/* Seat Type Distribution Doughnut Graph */}
			<div className="mt-6">
				<h3 className="text-lg font-semibold text-gray-600 mb-2">
					Seat Type Distribution
				</h3>
				<div className="chart-container h-64">
					<DoughnutChart
						valueLabels={aircraftSeatTypePercentage.map(
							(seatType) => seatType.seatType
						)}
						values={aircraftSeatTypePercentage.map(
							(seatType) => seatType.percentage
						)}
						backgroundColor={[
							"rgba(255, 159, 64, 0.7)",
							"rgba(75, 192, 192, 0.7)",
							"rgba(153, 102, 255, 0.7)",
							"rgba(255, 99, 132, 0.7)",
						]}
						borderColor={[
							"rgb(255, 159, 64)",
							"rgb(75, 192, 192)",
							"rgb(153, 102, 255)",
							"rgb(255, 99, 132)",
						]}
						borderWidth={1}
						title="Reviews by Seat Type (%)"
					/>
				</div>
			</div>
		</div>
	);
};

export default AircraftAnalysis;
