
export type RecommendationPercentage = {
  currentPercentage: string;
  percentageChange: string;
};

export type VfmScore = {
  currentScore: string;
  scoreChange: string;
};

export type AverageRating = {
  currentRating: string;
  ratingChange: string;
};

export type TotalNumberOfReviews = {
  currentTotal: number;
  totalChange: number;
};

export type MonthlyMetricsData = {
  recommendationPercentage: RecommendationPercentage;
  vfmScore: VfmScore;
  averageRating: AverageRating;
  totalNumberOfReviews: TotalNumberOfReviews;
  month: string;
};
