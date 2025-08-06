import { getFileContentFroms3Bucket } from "./s3-utils";

export async function getJsonData(fileName: string) {
  try {
    const jsonContent = await getFileContentFroms3Bucket("british-airways--db-bucket", `data/${fileName}`);
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    throw error;
  }
}
