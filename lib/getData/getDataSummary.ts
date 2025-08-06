import { getJsonData } from "../file-parser";
import { DataSummary } from "../../type/DataSummary";

export async function getDataSummary(): Promise<DataSummary> {
	try {
		return await getJsonData("data_summary.json");
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error;
	}
}
