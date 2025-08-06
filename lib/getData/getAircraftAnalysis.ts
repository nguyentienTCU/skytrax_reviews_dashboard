import { getJsonData } from "../file-parser";
import { AircraftAnalysisData } from "../../type/AircraftAnalysisData";

export async function getAircraftAnalysis(): Promise<AircraftAnalysisData> {
	try {
		return await getJsonData("aircraft_analysis.json");
	} catch (error) {
		console.error("Error in aircraft analysis:", error);
		throw error;
	}
}
