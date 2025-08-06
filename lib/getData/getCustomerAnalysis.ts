import { getJsonData } from "../file-parser";
import { CustomerAnalysisData } from "../../type/CustomerAnalysisData";

export async function getCustomerAnalysis(): Promise<CustomerAnalysisData> {
	try {
		return await getJsonData("customer_analysis.json");
	} catch (error) {
		console.error("Error fetching customer analysis:", error);
		throw error;
	}
}