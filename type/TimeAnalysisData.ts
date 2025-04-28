type RatingCount = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

type YearlyRatings = {
  [year: number]: RatingCount;
};

export type ServiceRatings = {
  [service: string] : YearlyRatings;
};

export type TimeAnalysisData = {
  reviewsOverTime: { year: number; count: number }[];
  avgRecommendation: { year: number; percentage: number }[];
  avgScore: { year: number; averageScore: number }[];
  avgMoneyValue: { year: number; averageMoneyValue: number }[];
  allServices: ServiceRatings;
};
