
export type ReviewsByCountry = {
  country: string;
  count: number;
};

export type VerifiedAndUnverifiedReviews = {
  verified: number;
  unverified: number;
};

export type AircraftSeatTypePercentage = {
  seatType: string;
  percentage: number;
};

export type TravellerTypePercentage = {
  travellerType: string;
  percentage: number;
};

export type CustomerAnalysisData = {
  reviewsByCountry: ReviewsByCountry[];
  verifiedAndUnverifiedReviews: VerifiedAndUnverifiedReviews;
  aircraftSeatTypePercentage: AircraftSeatTypePercentage[];
  travellerTypePercentage: TravellerTypePercentage[];
};
