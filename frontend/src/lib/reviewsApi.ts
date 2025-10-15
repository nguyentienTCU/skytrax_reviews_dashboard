// src/lib/reviewsApi.ts
import api from "./api";
import {
  DataSummary, MonthlyMetrics, AircraftAnalysis,
  RouteAnalysis, CustomerAnalysis, ReviewTextAnalysis, TimebasedAnalysis
} from "@/types/reviews";

export const getSummary = (airlineSlug: string) =>
  api.request<DataSummary>(`/api/${airlineSlug}/dataSummary`);

export const getMonthlyMetrics = (airlineSlug: string, mode: "previous-month" | "previous-year") =>
  api.request<MonthlyMetrics>(`/api/${airlineSlug}/monthlyMetrics/${mode}`);

export const getTimeBasedAllServices = (airlineSlug: string) =>
  api.request< TimebasedAnalysis >(
    `/api/${airlineSlug}/timeBasedAnalysis`
  );

export const getAircraftAnalysis = (airlineSlug: string) =>
  api.request<AircraftAnalysis>(`/api/${airlineSlug}/aircraftAnalysis`);

export const getRouteAnalysis = (airlineSlug: string) =>
  api.request<RouteAnalysis>(`/api/${airlineSlug}/routeAnalysis`);

export const getCustomerAnalysis = (airlineSlug: string) =>
  api.request<CustomerAnalysis>(`/api/${airlineSlug}/customerAnalysis`);

export const getReviewTextAnalysis = (airlineSlug: string) =>
  api.request<ReviewTextAnalysis>(`/api/${airlineSlug}/reviewTextAnalysis`);

export const getLastRefreshDate = (airlineSlug: string) =>
  api.request<{ lastRefreshUtc: string | null }>(`/api/${airlineSlug}/lastRefreshDate`);

export const getAllAirlines = () =>
  api.request<{ airline: string }[]>(`/api/allAirlines`);