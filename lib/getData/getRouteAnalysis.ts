import { getJsonData } from "../file-parser";
import { RouteAnalysisData } from "../../type/RouteAnalysisData";

export async function getRouteAnalysis(): Promise<RouteAnalysisData> {
	try {
		return await getJsonData("route_analysis.json");
	} catch (error) {
		console.error("Error fetching route analysis:", error);
		throw error;
	}
}
