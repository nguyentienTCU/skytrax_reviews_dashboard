
export type SampleReview = {
  reviewText: string;
  originCity: string;
  destinationCity: string;
  aircraftModel: string;
  seatType: string;
  averageRating: number;
};

export type SampleReviews = {
  bad: SampleReview;
  medium: SampleReview;
  good: SampleReview;
};

export type ReviewTextAnalysisData = {
  sampleReviews: SampleReviews;
  ratingBandsTypeCount: number[];
};
