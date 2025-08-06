import { getJsonData } from "../file-parser";
import {
  ReviewTextAnalysisData,
} from "../../type/ReviewTextAnalysisData";

export async function getReviewTextAnalysis(): Promise<ReviewTextAnalysisData> {
  try {
    return await getJsonData("review_text_analysis.json");
  } catch (error) {
    console.error("Error fetching route analysis:", error);
    throw error;
  }
}
