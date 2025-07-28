// import { getCSVFromGCS } from "./gcs-utils";
import { getFileContentFroms3Bucket } from "./s3-utils";
import Papa from "papaparse";

export async function getChartData(fileName: string) {
  try {
    // const csvContent = await getCSVFromGCS(fileName);
    const csvContent = await getFileContentFroms3Bucket("data", fileName);

    const { data } = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      newline: "\n",
      skipEmptyLines: true,
      quoteChar: '"',
      escapeChar: '"',
    });

    return data;
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    throw error;
  }
}