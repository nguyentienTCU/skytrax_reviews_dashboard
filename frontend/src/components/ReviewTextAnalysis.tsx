"use client";

import React from "react";
import useSWR from "swr";
import PieGraph from "@/components/custom-ui/PieChart";
import { getReviewTextAnalysis } from "@/lib/reviewsApi";
import type { ReviewTextAnalysis } from "@/types/reviews";

type Props = {
  airlineSlug: string;
};

const ReviewTextAnalysis: React.FC<Props> = ({ airlineSlug }) => {
  const { data, error, isLoading, mutate } = useSWR<ReviewTextAnalysis>(
    airlineSlug ? ["review_text_analysis", airlineSlug] : null,
    () => getReviewTextAnalysis(airlineSlug)
  );

  // Fallbacks so UI won’t crash while loading
  const sample = data?.sampleReviews ?? {
    bad:    { reviewText: "", originCity: "", destinationCity: "", aircraftModel: "", seatType: "", averageRating: 0 },
    medium: { reviewText: "", originCity: "", destinationCity: "", aircraftModel: "", seatType: "", averageRating: 0 },
    good:   { reviewText: "", originCity: "", destinationCity: "", aircraftModel: "", seatType: "", averageRating: 0 },
  };

  // ratingBandsTypeCount order (from your backend logic): [bad%, medium%, good%]
  const bands = data?.ratingBandsTypeCount ?? [0, 0, 0];
  const roundedBands = bands.map((v) => Number(Number(v ?? 0).toFixed(2)));

  // Small helpers
  const Stars: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
    const r = Math.max(0, Math.min(5, Math.round(rating)));
    return (
      <>
        <span className="text-yellow-500">{"★".repeat(r)}</span>
        <span className="text-gray-300">{"★".repeat(5 - r)}</span>
      </>
    );
  };

  // States
  if (isLoading) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4 animate-pulse">
        <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded my-4" />
        <div className="space-y-4">
          <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4">
        <h2 className="text-xl font-bold mb-4">Review Text Analysis</h2>
        <p className="text-red-500 mb-3">Failed to load data.</p>
        <button
          onClick={() => mutate()}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Review Text Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Example “keywords” block (static placeholders — replace if you later compute keywords) */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Common Keywords</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="mb-2">
              <span className="badge badge-primary text-lg px-2 py-1 mr-1">comfort</span>
              <span className="badge badge-success text-lg px-2 py-1 mr-1">service</span>
              <span className="badge badge-warning text-lg px-2 py-1 mr-1">delay</span>
              <span className="badge badge-primary text-lg px-2 py-1 mr-1">food</span>
            </div>
            <div className="mb-2">
              <span className="badge badge-success text-lg px-2 py-1 mr-1">staff</span>
              <span className="badge badge-warning text-lg px-2 py-1 mr-1">legroom</span>
              <span className="badge badge-danger text-lg px-2 py-1 mr-1">baggage</span>
              <span className="badge badge-primary text-lg px-2 py-1 mr-1">clean</span>
            </div>
            <div>
              <span className="badge badge-success text-lg px-2 py-1 mr-1">entertainment</span>
              <span className="badge badge-danger text-lg px-2 py-1 mr-1">cancellation</span>
              <span className="badge badge-warning text-lg px-2 py-1 mr-1">price</span>
              <span className="badge badge-primary text-lg px-2 py-1 mr-1">wifi</span>
            </div>
          </div>
        </div>

        {/* Sentiment pie: bad/medium/good */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Sentiment Analysis Composition</h3>
          <div className="chart-container h-64">
            <PieGraph
              values={roundedBands /* [bad, medium, good] */}
              valueLabels={["Bad", "Medium", "Good"]}
              title="Review Sentiment Analysis (%)"
              backgroundColor={[
                "rgba(255, 99, 132, 0.7)",  // Bad
                "rgba(255, 159, 64, 0.7)",  // Medium
                "rgba(75, 192, 192, 0.7)",  // Good
              ]}
              borderColor={[
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(75, 192, 192)",
              ]}
              borderWidth={1}
              height="100%"
              legendPosition="right"
            />
          </div>
        </div>
      </div>

      {/* Sample reviews */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Sample Reviews</h3>
        <div className="space-y-4">
          {/* Good */}
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between">
              <span className="font-semibold text-black dark:text-white">Good Review</span>
              <div><Stars rating={sample.good.averageRating} /></div>
            </div>
            <p className="text-gray-700 dark:text-gray-100 mt-2">{sample.good.reviewText || "—"}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-300">
              <span>{sample.good.aircraftModel || "—"} • {sample.good.seatType || "—"}</span>
              <span>{sample.good.originCity || "—"} → {sample.good.destinationCity || "—"}</span>
            </div>
          </div>

          {/* Medium */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-yellow-500">
            <div className="flex justify-between">
              <span className="font-semibold text-black dark:text-white">Medium Review</span>
              <div><Stars rating={sample.medium.averageRating} /></div>
            </div>
            <p className="text-gray-700 dark:text-gray-100 mt-2">{sample.medium.reviewText || "—"}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-300">
              <span>{sample.medium.aircraftModel || "—"} • {sample.medium.seatType || "—"}</span>
              <span>{sample.medium.originCity || "—"} → {sample.medium.destinationCity || "—"}</span>
            </div>
          </div>

          {/* Bad */}
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500">
            <div className="flex justify-between">
              <span className="font-semibold text-black dark:text-white">Bad Review</span>
              <div><Stars rating={sample.bad.averageRating} /></div>
            </div>
            <p className="text-gray-700 dark:text-gray-100 mt-2">{sample.bad.reviewText || "—"}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-300">
              <span>{sample.bad.aircraftModel || "—"} • {sample.bad.seatType || "—"}</span>
              <span>{sample.bad.originCity || "—"} → {sample.bad.destinationCity || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTextAnalysis;
