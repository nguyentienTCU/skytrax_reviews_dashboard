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

import { getAirlinesIndex, getJsonData } from "@/lib/data";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ airline?: string | string[] }> ;
}) {
  const airlines = await getAirlinesIndex();
  if (!airlines.length) {
    return <div className="p-6">No airlines available.</div>;
  }

  const defaultSlug = "british-airways";
  const isBritishAirwaysAvailable = airlines.some(a => a.slug === defaultSlug);

  const currentSlug =
    searchParams?.airline && airlines.some(a => a.slug === searchParams.airline)
      ? searchParams.airline!
      : isBritishAirwaysAvailable
      ? defaultSlug
      : airlines[0].slug;

  // Fetch all datasets in parallel
  const [
    dataSummary,
    monthlyPrevMonth,
    monthlyPrevYear,
    timebased,
    aircraft,
    route,
    customer,
    reviewText,
  ] = await Promise.all([
    getJsonData(currentSlug, "data_summary.json"),
    getJsonData(currentSlug, "monthly_metrics_prev_month.json"),
    getJsonData(currentSlug, "monthly_metrics_prev_year.json"),
    getJsonData(currentSlug, "timebased_analysis.json"),
    getJsonData(currentSlug, "aircraft_analysis.json"),
    getJsonData(currentSlug, "route_analysis.json"),
    getJsonData(currentSlug, "customer_analysis.json"),
    getJsonData(currentSlug, "review_text_analysis.json"),
  ]);

  return (
    <div className="dashboard-container bg-white dark:bg-gray-900">
      <Header />
      <DashboardInfo />

      {/* Selector reads the list and current slug, and updates ?airline= */}
      <AirlineSelectorClient airlines={airlines} currentSlug={currentSlug} />

      {/* Pass server-fetched data into your components */}
      <DataSummary {...dataSummary}/>
      <MonthlyMetrics prevMonth={monthlyPrevMonth} prevYear={monthlyPrevYear} />
      <TimeAnalysis data={timebased} />
      <AircraftAnalysis data={aircraft} />
      <RouteAnalysis data={route} />
      <CustomerAnalysis data={customer} />
      <ReviewTextAnalysis data={reviewText} />

      <Footer />
    </div>
  );
}
