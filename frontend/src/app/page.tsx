// app/page.tsx
import Header from "@/components/custom-ui/Header";
import DashboardInfo from "@/components/DashboardInfo";
import MonthlyMetrics from "@/components/MonthlyMetrics";
import DataSummary from "@/components/DataSummary";
import TimeAnalysis from "@/components/TimeAnalysis";
import AircraftAnalysis from "@/components/AircraftAnalysis";
import RouteAnalysis from "@/components/RouteAnalysis";
import CustomerAnalysis from "@/components/CustomerAnalysis";
import ReviewTextAnalysis from "@/components/ReviewTextAnalysis";
import Footer from "@/components/custom-ui/Footer";
import AirlineSelectorClient from "@/components/AirlineSelector";

type SearchParams = { airline?: string | string[] };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const defaultSlug = "british-airways";
  const { airline } = await searchParams;
  const currentSlug =
    (typeof airline === "string" && airline.trim()) || defaultSlug;

  return (
    <div className="dashboard-container bg-white dark:bg-gray-900">
      <Header />

      <section id="overview" className="scroll-mt-24">
        <DashboardInfo airlineSlug={currentSlug} />
      </section>

      <AirlineSelectorClient airlineSlug={currentSlug} />

      <section id="data-summary" className="scroll-mt-24">
        <DataSummary airlineSlug={currentSlug} />
      </section>

      <section id="monthly-metrics" className="scroll-mt-24">
        <MonthlyMetrics airlineSlug={currentSlug} />
      </section>

      <section id="time-analysis" className="scroll-mt-24">
        <TimeAnalysis airlineSlug={currentSlug} />
      </section>

      <section id="aircraft-analysis" className="scroll-mt-24">
        <AircraftAnalysis airlineSlug={currentSlug} />
      </section>

      <section id="route-analysis" className="scroll-mt-24">
        <RouteAnalysis airlineSlug={currentSlug} />
      </section>

      <section id="customer-analysis" className="scroll-mt-24">
        <CustomerAnalysis airlineSlug={currentSlug} />
      </section>

      <section id="review-text-analysis" className="scroll-mt-24">
        <ReviewTextAnalysis airlineSlug={currentSlug} />
      </section>

      <Footer />
    </div>
  );
}
