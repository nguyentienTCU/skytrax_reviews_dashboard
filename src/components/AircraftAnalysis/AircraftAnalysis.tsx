import React from "react";
import PieChart from "@/components/custom-ui/PieGraph";
import DoughnutChart from "@/components/custom-ui/DoughnutChart";
import BarGraph from "@/components/custom-ui/BarGraph";

const AircraftAnalysis = () => {
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
						<PieChart
							valueLabels={[
								"Boeing",
								"Airbus",
								"Embraer",
								"Bombardier",
								"Other",
							]}
							values={[42, 38, 10, 8, 2]}
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
							valueLabels={[
								"Boeing 777",
								"Airbus A380",
								"Boeing 787",
								"Airbus A320",
								"Airbus A350",
								"Boeing 737",
							]}
							values={[520, 480, 440, 400, 360, 320]}
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
						valueLabels={[
							"Economy Class",
							"Business Class",
							"First Class",
							"Premium Economy",
						]}
						values={[65, 20, 5, 10]}
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
