'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import MetricCard from './MetricCard';
import type { MonthlyMetricsData } from '@/types/MonthlyMetricsData';
import { getMonthlyMetrics } from '@/lib/reviewsApi';

type CompareModeApi = 'previous-month' | 'previous-year';

type Metric = {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  description: string;
};

type Props = { airlineSlug: string };

const TINY_PCT = 0.01;
const TINY_ABS = 0.01;

const toNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const pct = (v: unknown) => `${toNum(v).toFixed(2)}%`;
const twoDp = (v: unknown) => toNum(v).toFixed(2);

const signedPct = (delta: unknown) => {
  const v = toNum(delta), a = Math.abs(v);
  if (a === 0) return '0.00%';
  if (a < TINY_PCT) return (v > 0 ? '+<0.01%' : '-<0.01%');
  return (v >= 0 ? '+' : '-') + a.toFixed(2) + '%';
};

const signedAbs = (delta: unknown) => {
  const v = toNum(delta), a = Math.abs(v);
  if (a === 0) return '0.00';
  if (a < TINY_ABS) return (v > 0 ? '+<0.01' : '-<0.01');
  return (v >= 0 ? '+' : '-') + a.toFixed(2);
};

const pretty = (m: CompareModeApi) =>
  m === 'previous-month' ? 'previous month' : 'previous year';

const MonthlyMetrics: React.FC<Props> = ({ airlineSlug }) => {
  const [compareWith, setCompareWith] = useState<CompareModeApi>('previous-month');

  const { data, error, isLoading, mutate, isValidating } = useSWR<MonthlyMetricsData>(
    airlineSlug ? ['monthly_metrics', airlineSlug, compareWith] : null,
    () => getMonthlyMetrics(airlineSlug, compareWith),
    {
      keepPreviousData: true,      // avoids flicker when switching month/year
      revalidateOnFocus: false,    // optional: don’t refetch on tab focus
    }
  );

  // If no prior data and still loading => skeleton
  const showSkeleton = !data && (isLoading || isValidating);

  // If we *do* have data, build metrics. No default zeros here.
  const metrics: Metric[] = useMemo(() => {
    if (!data) return [];

    console.log(data);

    const label = pretty(compareWith);
    const rp = data.recommendationPercentage;
    const vs = data.vfmScore;
    const ar = data.averageRating;
    const tn = data.totalNumberOfReviews;

    return [
      {
        label: 'Recommendation Percentage',
        value: pct(rp.currentPercentage),
        change: signedPct(rp.percentageChange),
        changeLabel: label,
        description: 'Percentage of customers who would recommend this airline.',
      },
      {
        label: 'VFM Score',
        value: `${twoDp(vs.currentScore)} / 5`,
        change: signedAbs(vs.scoreChange),  // absolute delta
        changeLabel: label,
        description: 'Value for Money score based on review ratings.',
      },
      {
        label: 'Average Rating',
        value: `${twoDp(ar.currentRating)} / 5`,
        change: signedAbs(ar.ratingChange), // absolute delta
        changeLabel: label,
        description: 'Overall average review rating.',
      },
      {
        label: 'Total Number of Reviews',
        value: String(tn.currentTotal),
        change: (tn.totalChange >= 0 ? '+' : '') + String(tn.totalChange),
        changeLabel: label,
        description: 'Total reviews submitted during this period.',
      },
    ];
  }, [data, compareWith]);

  return (
    <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          This Month Metrics {data?.month ? `(${data.month})` : ''}
        </h2>

        <div className="flex items-center">
          <label className="mr-2 text-sm text-gray-700 dark:text-white">
            Compare with:
          </label>
          <select
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-700 rounded px-3 py-1"
            value={compareWith}
            onChange={(e) => setCompareWith(e.target.value as CompareModeApi)}
          >
            <option value="previous-month">previous month</option>
            <option value="previous-year">previous year</option>
          </select>
        </div>
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 dark:bg-gray-700 rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-red-500">
          <span>Failed to load monthly metrics.</span>
          <button
            onClick={() => mutate()}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : !data ? (
        <div className="text-sm opacity-80">No monthly data available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {metrics.map((m, idx) => (
            <MetricCard key={idx} {...m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthlyMetrics;
