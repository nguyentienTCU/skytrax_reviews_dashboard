"use client";

import React from "react";
import useSWR from "swr";
import StatCard from "./StatCard";
import type { DataSummary } from "@/types/reviews";
import { getSummary } from "@/lib/reviewsApi";

type Props = {
  airlineSlug: string; // pass currentSlug from your page
};

const DataSummary: React.FC<Props> = ({ airlineSlug }) => {
  const { data, error, isLoading, mutate } = useSWR<DataSummary>(
    airlineSlug ? ["data_summary", airlineSlug] : null,
    () => getSummary(airlineSlug)
  );

  // skeleton
  if (isLoading) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // error
  if (error) {
    return (
      <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4">
        <h2 className="text-xl font-bold mb-4">Data Summary</h2>
        <p className="text-red-500 mb-3">Failed to load summary.</p>
        <button
          onClick={() => mutate()}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalReviews = Number(data?.totalReviews ?? 0);
  const totalVerifiedPct = Number(data?.totalVerifiedReviews ?? 0); // backend returns percentage (0-100)
  const totalAircraftModels = Number(data?.totalAircraftModels ?? 0);
  const totalCountries = Number(data?.totalCountries ?? 0);

  const stats = [
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: "fa-solid fa-comment",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconBgColor: "bg-blue-200",
    },
    {
      title: "Verified Reviews",
      value: `${totalVerifiedPct.toFixed(2)}%`,
      icon: "fa-solid fa-check-circle",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconBgColor: "bg-green-200",
    },
    {
      title: "Aircraft Models",
      value: totalAircraftModels,
      icon: "fa-solid fa-plane",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      iconBgColor: "bg-purple-200",
    },
    {
      title: "Countries",
      value: totalCountries,
      icon: "fa-solid fa-globe",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      iconBgColor: "bg-yellow-200",
    },
  ];

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Data Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default DataSummary;
