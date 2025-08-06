import { getFileLastModified } from "../s3-utils";

export async function getLastRefreshDate(): Promise<string> {
	try {
		const lastRefreshDate = await getFileLastModified("british-airways--db-bucket", "data/reviews.json");
		if (lastRefreshDate) {
			return lastRefreshDate.toUTCString();
		}
		return "N/A";
	} catch (error) {
		console.error("Error fetching last refresh date:", error);
		throw error;
	}
}