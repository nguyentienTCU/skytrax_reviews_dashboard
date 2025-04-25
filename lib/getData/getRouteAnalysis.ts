import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";

export async function getRouteAnalysis() {
  try {
    const reviews = (await getChartData("reviews.csv")) as Review[];
    return {
      topOriginCities: getTopOriginCities(reviews),
      topDestinationCities: getTopDestinationCities(reviews),
    };
  } catch (error) {
    console.error("Error fetching route analysis:", error);
    throw error;
  }
}

function getTopOriginCities(reviews: Review[]) {
  const cityCounts: { [key: string]: number } = {};

  // Count reviews for each origin city
  reviews.forEach((review) => {
    const city = review.ORIGIN_CITY;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  // Convert to array, sort by count, and take top 6
  return Object.entries(cityCounts)
    .map(([city, count]) => ({
      city,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function getTopDestinationCities(reviews: Review[]) {
  const cityCounts: { [key: string]: number } = {};

  // Count reviews for each destination city
  reviews.forEach((review) => {
    const city = review.DESTINATION_CITY;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  // Convert to array, sort by count, and take top 6
  return Object.entries(cityCounts)
    .map(([city, count]) => ({
      city,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
