export type ReviewsOverTime = {
  year: number;
  count: number;
};

export type AvgRecommendation = {
  year: number;
  percentage: number;
};

export type AvgScore = {
  year: number;
  averageScore: number;
};

export type AvgMoneyValue = {
  year: number;
  averageMoneyValue: number;
};

export type ServiceRating = {
    [rating: number]: number
}

export type AllServices = {
    [service: string]: {
        [year: number]: ServiceRating
    }
}

export type TimebasedAnalysisData = {
  reviewsOverTime: ReviewsOverTime[];
  avgRecommendation: AvgRecommendation[];
  avgScore: AvgScore[];
  avgMoneyValue: AvgMoneyValue[];
  allServices: AllServices;
};