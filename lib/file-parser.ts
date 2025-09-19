import { useAirline } from "@/app/context/AirlineContext";
import { getFileContentFroms3Bucket } from "./s3-utils";

const BUCKET = process.env.S3_BUCKET ?? ""; 

export async function getJsonData(fileName: string, airline: string) {
  if (!BUCKET) throw new Error("S3_BUCKET environment variable is not set");

  const key = `${airline}data/${fileName}`;
  

  const jsonText = await getFileContentFroms3Bucket(BUCKET, key);
  return JSON.parse(jsonText);
}
