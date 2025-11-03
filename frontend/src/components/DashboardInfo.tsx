"use client";

import React from "react";
import useSWR from "swr";
import { getLastRefreshDate } from "@/lib/reviewsApi";

type Props = {
  airlineSlug: string;
};

const DashboardInfo: React.FC<Props> = ({ airlineSlug }) => {
  const { data, error, isLoading, mutate } = useSWR<{ lastRefreshUtc: string | null }>(
    airlineSlug ? ["last_refresh_date", airlineSlug] : null,
    () => getLastRefreshDate(airlineSlug)
  );

  const lastRefreshUtc = data?.lastRefreshUtc ?? null;

  // Format in America/Chicago (Central Time)
  const display =
    lastRefreshUtc
      ? new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Chicago",
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(lastRefreshUtc)) + " CT"
      : "N/A";

  return (
    <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
      {/* Status line */}
      <div className="mb-3 text-sm text-gray-300 bg-gray-700 inline-flex items-center gap-2 px-3 py-1 rounded-full">
        {isLoading ? (
          <span className="inline-block w-40 h-4 bg-gray-600 rounded animate-pulse" />
        ) : error ? (
          <>
            <span>Last Refresh: failed</span>
            <button
              onClick={() => mutate()}
              className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </>
        ) : (
          <span>Last Refresh: {display}</span>
        )}
      </div>

      <h3 className="font-bold text-gray-700 dark:text-white mb-2">
        Self-Sampling Bias
      </h3>
      <p className="text-gray-700 dark:text-white">
        Our analysis is based on user-submitted reviews and can reflect self-selection
        bias. Rather than generalizing, we focus on actionable patterns that emerge
        from the available data.
      </p>
    </div>
  );
};

export default DashboardInfo;
