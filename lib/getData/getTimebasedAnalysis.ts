import { Review } from "../../type/Review";
import { getChartData } from "../csv-parser";

export async function getTimebasedAnalysis() {
  try {
    const reviews = (await getChartData("reviews.csv")) as Review[];
    return {
      reviewsOverTime: getReviewsOverTime(reviews),
      reviewsByDayOfWeek: getReviewsByDayOfWeek(reviews),
      reviewsByMonth: getReviewsByMonth(reviews),
    };
  } catch (error) {
    console.error("Error in time-based analysis:", error);
    throw error;
  }
}

function getReviewsOverTime(reviews: Review[]) {
  const yearCounts: { [key: number]: number } = {};

  reviews.forEach((review) => {
    const year = review.REVIEW_YEAR;
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  return Object.entries(yearCounts)
    .map(([year, count]) => ({
      year: parseInt(year),
      count,
    }))
    .sort((a, b) => a.year - b.year);
}

function getReviewsByDayOfWeek(reviews: Review[]) {
  const dayCounts: { [key: string]: number } = {};
  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Initialize all days with 0
  daysOrder.forEach((day) => {
    dayCounts[day] = 0;
  });

  // Count reviews for each day
  reviews.forEach((review) => {
    const day = review.REVIEW_DAY_OF_WEEK;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  // Convert to array and maintain day order
  return daysOrder.map((day) => ({
    day,
    count: dayCounts[day],
  }));
}

function getReviewsByMonth(reviews: Review[]) {
  const monthCounts: { [key: string]: number } = {};
  const monthsOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize all months with 0
  monthsOrder.forEach((month) => {
    monthCounts[month] = 0;
  });

  // Count reviews for each month
  reviews.forEach((review) => {
    const month = review.REVIEW_MONTH_NAME;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  // Convert to array and maintain month order
  return monthsOrder.map((month) => ({
    month,
    count: monthCounts[month],
  }));
}
