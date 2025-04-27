import { Review } from "../../type/Review";
import { getChartData } from "../csv-parser";

export async function getTimebasedAnalysis() {
  try {
    const reviews = (await getChartData("reviews.csv")) as Review[];
    return {
      reviewsOverTime: getReviewsOverTime(reviews),
      avgRecommendation: getAvgRecommendation(reviews),
      avgScore: getAvgScore(reviews),
      avgMoneyValue: getAvgMoneyValue(reviews),
    };
  } catch (error) {
    console.error("Error in time-based analysis:", error);
    throw error;
  }
}

function getReviewsOverTime(reviews: Review[]) {
  const yearCounts: { [key: number]: number } = {};

  reviews.forEach((review) => {
    const year = review.REVIEW_CAL_YEAR;
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  return Object.entries(yearCounts)
    .map(([year, count]) => ({
      year: parseInt(year),
      count,
    }))
    .sort((a, b) => a.year - b.year);
}

function getAvgRecommendation(reviews: Review[]) {
  // Group reviews by year
  const yearGroups: { [key: number]: Review[] } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.RECOMMENDED !== null) {
      const year = review.REVIEW_CAL_YEAR;
      if (!yearGroups[year]) {
        yearGroups[year] = [];
      }
      yearGroups[year].push(review);
    }
  });

  // Calculate recommendation percentage for each year
  const recommendationData: { year: number; percentage: number }[] = [];
  const sortedYears = Object.keys(yearGroups)
    .map(Number)
    .sort((a, b) => a - b);

  sortedYears.forEach((year) => {
    const yearReviews = yearGroups[year];
    const recommendedCount = yearReviews.filter(
      (review) => review.RECOMMENDED === true
    ).length;
    const percentage = (recommendedCount / yearReviews.length) * 100;
    recommendationData.push({
      year,
      percentage,
    });
  });

  return recommendationData;
}

function getAvgScore(reviews: Review[]) {
  // Group reviews by year
  const yearGroups: { [key: number]: Review[] } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.AVERAGE_RATING !== null) {
      const year = review.REVIEW_CAL_YEAR;
      if (!yearGroups[year]) {
        yearGroups[year] = [];
      }
      yearGroups[year].push(review);
    }
  });

  // Calculate average score for each year
  const averageScores: { year: number; averageScore: number }[] = [];
  const sortedYears = Object.keys(yearGroups)
    .map(Number)
    .sort((a, b) => a - b);

  sortedYears.forEach((year) => {
    const yearReviews = yearGroups[year];
    const totalScore = yearReviews.reduce((sum, review) => {
      if (review.AVERAGE_RATING === null) return sum;
      return sum + review.AVERAGE_RATING;
    }, 0);

    const averageScore = totalScore / yearReviews.length;
    averageScores.push({
      year,
      averageScore,
    });
  });

  return averageScores;
}

function getAvgMoneyValue(reviews: Review[]) {
  // Group reviews by year
  const yearGroups: { [key: number]: Review[] } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.VALUE_FOR_MONEY !== null) {
      const year = review.REVIEW_CAL_YEAR;
      if (!yearGroups[year]) {
        yearGroups[year] = [];
      }
      yearGroups[year].push(review);
    }
  });

  // Calculate average value for money for each year
  const averageMoneyValues: { year: number; averageMoneyValue: number }[] = [];
  const sortedYears = Object.keys(yearGroups)
    .map(Number)
    .sort((a, b) => a - b);

  sortedYears.forEach((year) => {
    const yearReviews = yearGroups[year];
    const totalMoneyValue = yearReviews.reduce((sum, review) => {
      if (review.VALUE_FOR_MONEY === null) return sum;
      return sum + review.VALUE_FOR_MONEY;
    }, 0);

    const averageMoneyValue = totalMoneyValue / yearReviews.length;
    averageMoneyValues.push({
      year,
      averageMoneyValue,
    });
  });

  return averageMoneyValues;
}
