import { getFileContentFroms3Bucket } from "./s3-utils";
import { AirlineIndexFile } from "./getLastRefreshDate";

const BUCKET = process.env.S3_BUCKET ?? ""; 

export type AirlineIndex = { airline: string; slug: string; count: number };

export async function getAirlinesIndex(): Promise<AirlineIndex[]> {
    const jsonText = await getFileContentFroms3Bucket(BUCKET, "airlines_index.json");
    const data: AirlineIndexFile = JSON.parse(jsonText);
    return data.airlines;    
}

export async function getJsonData(airline: string, fileName: string) {
  if (!BUCKET) throw new Error("S3_BUCKET environment variable is not set");

  const key = `${airline}/data/${fileName}`;

  const jsonText = await getFileContentFroms3Bucket(BUCKET, key);
  return JSON.parse(jsonText);
}
