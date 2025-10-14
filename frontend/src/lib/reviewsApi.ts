// src/lib/reviewsApi.ts
import api from "./api";
import {
  DataSummary, MonthlyMetrics, AllServices, AircraftAnalysis,
  RouteAnalysis, CustomerAnalysis, ReviewTextAnalysis
} from "@/types/reviews";

export const getSummary = (airlineSlug: string) =>
  api.request<DataSummary>(`/${airlineSlug}/dataSummary`);

export const getMonthlyMetrics = (airlineSlug: string, mode: "previous-month" | "previous-year") =>
  api.request<MonthlyMetrics>(`/${airlineSlug}/monthlyMetrics/${mode}`);

export const getTimeBasedAllServices = (airlineSlug: string) =>
  api.request<{ reviewsOverTime: { year:number; count:number }[]; avgRecommendation: any; avgScore: any; avgMoneyValue: any; allServices: AllServices }>(
    `/${airlineSlug}/timeBasedAnalysis`
  );

export const getAircraftAnalysis = (airlineSlug: string) =>
  api.request<AircraftAnalysis>(`/${airlineSlug}/aircraftAnalysis`);

export const getRouteAnalysis = (airlineSlug: string) =>
  api.request<RouteAnalysis>(`/${airlineSlug}/routeAnalysis`);

export const getCustomerAnalysis = (airlineSlug: string) =>
  api.request<CustomerAnalysis>(`/${airlineSlug}/customerAnalysis`);

export const getReviewTextAnalysis = (airlineSlug: string) =>
  api.request<ReviewTextAnalysis>(`/${airlineSlug}/reviewTextAnalysis`);

export const getLastRefreshDate = (airlineSlug: string) =>
  api.request<{ lastRefreshUtc: string | null }>(`/${airlineSlug}/lastRefreshDate`);

export const getAllAirlines = () =>
  api.request<{ airline: string }[]>(`/allAirlines`);