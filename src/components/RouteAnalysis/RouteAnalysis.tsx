import React from "react";
import BarGraph from "@/components/custom-ui/BarChart";
import { getRouteAnalysis } from "@/lib/getData/getRouteAnalysis";

const RouteAnalysis = async () => {
	const { topOriginCities, topDestinationCities, topRoutes } =
		await getRouteAnalysis();
	return (
		<div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
			<h2 className="text-xl font-bold mb-4 ">Route Analysis</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 className="text-lg font-semibold mb-2">
						Top Origin Cities
					</h3>
					<div className="chart-container h-80">
						<BarGraph
							valueLabels={topOriginCities.map((city) => city.city)}
							values={topOriginCities.map((city) => city.count)}
							xTitle="Number of Reviews"
							backgroundColor={["rgba(153, 102, 255, 0.7)"]}
							borderColor={["rgb(153, 102, 255)"]}
							borderWidth={1}
							axis="y"
							showDataLabels={true}
						/>
					</div>
				</div>
				<div>
					<h3 className="text-lg font-semibold  mb-2">
						Top Destination Cities
					</h3>
					<div className="chart-container h-80">
						<BarGraph
							valueLabels={topDestinationCities.map((city) => city.city)}
							values={topDestinationCities.map((city) => city.count)}
							xTitle="Number of Reviews"
							backgroundColor={["rgba(255, 206, 86, 0.7)"]}
							borderColor={["rgb(255, 206, 86)"]}
							borderWidth={1}
							axis="y"
							showDataLabels={true}
						/>
					</div>
				</div>
			</div>
			<div className="mt-6">
				<h3 className="text-lg font-semibold mb-2">
					Popular Routes
				</h3>
				<div className="overflow-auto">
					<table className="min-w-full">
						<thead>
							<tr>
								<th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
									Origin
								</th>
								<th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
									Destination
								</th>
								<th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
									Count
								</th>
								<th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
									Avg. Rating
								</th>
							</tr>
						</thead>
						<tbody>
							{topRoutes.map((route, index) => (
								<tr key={index}>
									<td className="py-2 px-4 border-b border-gray-200 ">
										{route.origin}
									</td>
									<td className="py-2 px-4 border-b border-gray-200 ">
										{route.destination}
									</td>
									<td className="py-2 px-4 border-b border-gray-200 ">
										{route.count}
									</td>
									<td className="py-2 px-4 border-b border-gray-200 ">
										<div className="flex items-center">
											<span className="text-yellow-500">
												{"★".repeat(Math.floor(route.averageRating))}
											</span>
											<span className="text-gray-200">
												{"★".repeat(5 - Math.floor(route.averageRating))}
											</span>
											<span className="ml-1">
												{route.averageRating.toFixed(1)}
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default RouteAnalysis;
