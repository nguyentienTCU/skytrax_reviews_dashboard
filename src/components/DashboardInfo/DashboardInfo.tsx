import { getLastRefreshDate } from "@/lib/getData/getLastRefreshDate";

export default async function DashboardInfo() {
	const lastRefreshDate = await getLastRefreshDate();
	return (
		<div className="card bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
			<div className="mb-3 text-sm text-gray-300 bg-gray-700 inline-block px-3 py-1 rounded-full">
				Last Refresh: {lastRefreshDate}
			</div>
			<h3 className="font-bold text-gray-700 dark:text-white mb-2">
				Self-Sampling Bias
			</h3>
			<p className="text-gray-700 dark:text-white">
				Our analysis of British Airways reviews is subject to self-selection
				sampling bias, as reviewers may have had extreme experiences or specific
				motivations for providing feedback. Rather than generalizing findings,
				we focus on identifying actionable areas for improvement based on the
				available reviews.
			</p>
		</div>
	);
}
