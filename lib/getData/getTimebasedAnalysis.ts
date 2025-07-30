import { Review } from "../../type/Review";
import { getChartData } from "../csv-parser";
import { TimebasedAnalysisData } from "../../type/TimebasedAnalysisData";

export async function getTimebasedAnalysis(): Promise<TimebasedAnalysisData> {
  try {
    const reviews = (await getChartData("reviews.csv")) as Review[];
    return {
      reviewsOverTime: getReviewsOverTime(reviews),
      avgRecommendation: getAvgRecommendation(reviews),
      avgScore: getAvgScore(reviews),
      avgMoneyValue: getAvgMoneyValue(reviews),
      allServices: getAllServices(reviews),
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

function getAllServices(reviews: Review[]) {
  return {
    "seat_comfort": getSeatComfort(reviews),
    "cabin_staff_service": getCabinStaffService(reviews),
    "food_and_beverages": getFoodAndBeverages(reviews),
    "ground_service": getGroundService(reviews),
    "inflight_entertainment": getInFlightEntertainment(reviews),
    "value_for_money": getMoneyValue(reviews),
    "wifi_and_connectivity": getWifiAndConnectivity(reviews),
  };
}

function getSeatComfort(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.SEAT_COMFORT !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.SEAT_COMFORT;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}

function getCabinStaffService(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.CABIN_STAFF_SERVICE !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.CABIN_STAFF_SERVICE;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}

function getFoodAndBeverages(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.FOOD_AND_BEVERAGES !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.FOOD_AND_BEVERAGES;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}

function getGroundService(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.GROUND_SERVICE !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.GROUND_SERVICE;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}

function getInFlightEntertainment(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.INFLIGHT_ENTERTAINMENT !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.INFLIGHT_ENTERTAINMENT;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}

function getMoneyValue(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

    reviews.forEach((review) => {
      if (review.REVIEW_CAL_YEAR && review.VALUE_FOR_MONEY !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.VALUE_FOR_MONEY;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}  

function getWifiAndConnectivity(reviews: Review[]) {
  const yearGroups: { [key: number]: { [key: number]: number } } = {};

  reviews.forEach((review) => {
    if (review.REVIEW_CAL_YEAR && review.WIFI_AND_CONNECTIVITY !== null) {
      const year = review.REVIEW_CAL_YEAR;
      const rating = review.WIFI_AND_CONNECTIVITY;

      if (!yearGroups[year]) {
        yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      yearGroups[year][rating]++;
    }
  });

  return yearGroups;
}
