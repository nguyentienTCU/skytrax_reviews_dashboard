import { getCSVFromGCS } from "./gcs-utils";
import Papa from "papaparse";

export async function getChartData(fileName: string) {
  try {
    const csvContent = await getCSVFromGCS(fileName);

    const { data } = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
    });

    return {
      // Example chart data transformations
      monthlyReviews: getMonthlyReviewCount(data),
      aircraftDistribution: getAircraftDistribution(data),
      routePopularity: getRoutePopularity(data),
      seatTypeDistribution: getSeatTypeDistribution(data),
      nationalityDistribution: getNationalityDistribution(data),
    };
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    throw error;
  }
}

function getMonthlyReviewCount(data: any[]) {
  const monthlyCounts: { [key: string]: number } = {};

  data.forEach((review) => {
    const monthYear = `${review.cal_mon_name}-${review.cal_year}`;
    monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
  });

  return Object.entries(monthlyCounts).map(([month, count]) => ({
    month,
    count,
  }));
}

function getAircraftDistribution(data: any[]) {
  const distribution: { [key: string]: number } = {};

  data.forEach((review) => {
    const aircraft = review.aircraft_model;
    distribution[aircraft] = (distribution[aircraft] || 0) + 1;
  });

  return Object.entries(distribution).map(([aircraft, count]) => ({
    aircraft,
    count,
  }));
}

function getRoutePopularity(data: any[]) {
  const routes: { [key: string]: number } = {};

  data.forEach((review) => {
    const route = `${review.origin_airport}-${review.destination_airport}`;
    routes[route] = (routes[route] || 0) + 1;
  });

  return Object.entries(routes)
    .map(([route, count]) => ({
      route,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 routes
}

function getSeatTypeDistribution(data: any[]) {
  const distribution: { [key: string]: number } = {};

  data.forEach((review) => {
    const seatType = review.seat_type;
    distribution[seatType] = (distribution[seatType] || 0) + 1;
  });

  return Object.entries(distribution).map(([seatType, count]) => ({
    seatType,
    count,
  }));
}

function getNationalityDistribution(data: any[]) {
  const distribution: { [key: string]: number } = {};

  data.forEach((review) => {
    const nationality = review.nationality;
    distribution[nationality] = (distribution[nationality] || 0) + 1;
  });

  return Object.entries(distribution)
    .map(([nationality, count]) => ({
      nationality,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 nationalities
}
