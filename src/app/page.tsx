import Image from "next/image";
import React from "react";
import Header from "@/components/custom-ui/Header";
import DashboardInfoHeader from "@/components/DashboardInfoHeader/DashboardInfoHeader";
import MonthlyMetrics from "@/components/MonthlyMetrics/MonthlyMetrics";
import DataSummary from "@/components/DataSummary/DataSummary";
import TimeAnalysis from "@/components/Time-basedAnalysis/TimeAnalysis";
import AircraftAnalysis from "@/components/AircraftAnalysis/AircraftAnalysis";
import RouteAnalysis from "@/components/RouteAnalysis/RouteAnalysis";
import CustomerAnalysis from "@/components/CustomerAnalysis/CustomerAnalysis";
import ReviewTextAnalysis from "@/components/ReviewTextAnalysis/ReviewTextAnalysis";
import Footer from "@/components/custom-ui/Footer";

export default function Home() {
  return (
    <div className="dashboard-container">
      <Header />
      <DashboardInfoHeader />
      <MonthlyMetrics />
      <DataSummary />
      <TimeAnalysis />
      <AircraftAnalysis />
      <RouteAnalysis />
      <CustomerAnalysis />
      <ReviewTextAnalysis />
      <Footer />
    </div>
  );
}
