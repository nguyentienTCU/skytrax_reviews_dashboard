import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";

export async function getCustomerAnalysis() {
  try {
    const reviews = (await getChartData("reviews.csv")) as Review[];
    return {
      reviewsByCountry: getReviewsByCountry(reviews),
      verifiedAndUnverifiedReviews: getVerifiedAndUnverifiedReviews(reviews),
    };
  } catch (error) {
    console.error("Error fetching customer analysis:", error);
    throw error;
  }
}

function getReviewsByCountry(reviews: Review[]) {
  const countryCounts: { [key: string]: number } = {};

  // Count reviews for each country
  reviews.forEach((review) => {
    const country = review.CUSTOMER_COUNTRY;
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  // Convert to array, sort by count, and take top 7
  return Object.entries(countryCounts)
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
}

function getVerifiedAndUnverifiedReviews(reviews: Review[]) {
  const totalReviews = reviews.length;
  const verifiedCount = reviews.filter(
    (review) => review.REVIEW_VERIFIED
  ).length;
  const verifiedPercentage = Math.round((verifiedCount / totalReviews) * 100);

  return {
    verified: verifiedPercentage,
    unverified: 100 - verifiedPercentage,
  };
}
