import { getJsonData } from "../file-parser";
import { TimebasedAnalysisData } from "../../type/TimebasedAnalysisData";

export async function getTimebasedAnalysis(): Promise<TimebasedAnalysisData> {
  try {
    return await getJsonData("timebased_analysis.json");
  } catch (error) {
    console.error("Error in time-based analysis:", error);
    throw error;
  }
}
