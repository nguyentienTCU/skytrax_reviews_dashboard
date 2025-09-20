import { getFileContentFroms3Bucket } from "./s3-utils";

const BUCKET = process.env.S3_BUCKET ?? "";

export type AirlineIndexFile = {
    lastRefreshed: string;
    airlines: { airline: string; slug: string; count: number }[];
}

export async function getLastRefreshDate(): Promise<string> {
    if (!BUCKET) {
        console.error("S3_BUCKET environment variable is not set");
        return "N/A";
    }
    try {
        const jsonText = await getFileContentFroms3Bucket(BUCKET, "airlines_index.json");
        const data: AirlineIndexFile = JSON.parse(jsonText);
        return data.lastRefreshed;
    } catch (error) {
        console.error("Could not fetch or parse airlines_index.json", error);
        return "N/A";
    }
}
