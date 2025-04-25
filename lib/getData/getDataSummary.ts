import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";
export async function getDataSummary() {
  try {
    const data: Review[] = (await getChartData("reviews.csv")) as Review[];
    return {
      totalReviews: getTotalReviews(data),
      totalVerifiedReviews: getTotalVerifiedReviews(data),
      totalAircraftModels: getTotalAircraftModels(data),
      totalCountries: getTotalCountries(data),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function getTotalReviews(data: Review[]) {
  return data.length;
}

function getTotalVerifiedReviews(data: Review[]) {
  const verifiedCount = data.filter((review) => review.REVIEW_VERIFIED).length;
  return Math.round((verifiedCount / data.length) * 100);
}

function getTotalAircraftModels(data: Review[]) {
  return new Set(data.map((review) => review.AIRCRAFT_MODEL)).size;
}

function getTotalCountries(data: Review[]) {
  return new Set(data.map((review) => review.CUSTOMER_COUNTRY)).size;
}
