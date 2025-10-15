// app/page.tsx
import Header from "@/components/custom-ui/Header";
import DashboardInfo from "@/components/DashboardInfo/DashboardInfo";
import MonthlyMetrics from "@/components/MonthlyMetrics/MonthlyMetrics";
import DataSummary from "@/components/DataSummary/DataSummary";
import TimeAnalysis from "@/components/Time-basedAnalysis/TimeAnalysis";
import AircraftAnalysis from "@/components/AircraftAnalysis/AircraftAnalysis";
import RouteAnalysis from "@/components/RouteAnalysis/RouteAnalysis";
import CustomerAnalysis from "@/components/CustomerAnalysis/CustomerAnalysis";
import ReviewTextAnalysis from "@/components/ReviewTextAnalysis/ReviewTextAnalysis";
import Footer from "@/components/custom-ui/Footer";
import AirlineSelectorClient from "@/components/AirlineSelector";

type SearchParams = { airline?: string | string[] };


export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const defaultSlug = "british-airways";
  const { airline } = await searchParams;
  const currentSlug =
    (typeof airline === "string" && airline.trim()) || defaultSlug;

  return (
    <div className="dashboard-container bg-white dark:bg-gray-900">
      <Header />

      {/* Info pill (fetches last refresh via SWR) */}
      <DashboardInfo airlineSlug={currentSlug} />

      {/* Selector now fetches airlines via API internally; just needs currentSlug */}
      <AirlineSelectorClient airlineSlug={currentSlug} />

      {/* All sections fetch their own data via SWR using the slug */}
      <DataSummary airlineSlug={currentSlug} />
      <MonthlyMetrics airlineSlug={currentSlug} />
      <TimeAnalysis airlineSlug={currentSlug} />
      <AircraftAnalysis airlineSlug={currentSlug} />
      <RouteAnalysis airlineSlug={currentSlug} />
      <CustomerAnalysis airlineSlug={currentSlug} />
      <ReviewTextAnalysis airlineSlug={currentSlug} />

      <Footer />
    </div>
  );
}
