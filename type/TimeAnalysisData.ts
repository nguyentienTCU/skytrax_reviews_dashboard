export type TimeAnalysisData = {
  reviewsOverTime: { year: number; count: number }[];
  avgRecommendation: { year: number; percentage: number }[];
  avgScore: { year: number; averageScore: number }[];
  avgMoneyValue: { year: number; averageMoneyValue: number }[];
};

