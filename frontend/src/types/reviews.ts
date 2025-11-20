export type Review = {
  REVIEW_ID: number;
  AIRLINE: string;
  CUSTOMER_NAME: string;
  NATIONALITY: string | null;
  NUMBER_OF_FLIGHTS: number | null;
  DATE_SUBMITTED_ID: string;
  REVIEW_DAY_OF_WEEK_NAME: string;
  REVIEW_CAL_MONTH: number;
  REVIEW_CAL_MON_NAME: string;
  REVIEW_CAL_YEAR: number;
  DATE_FLOWN_ID: string | null;
  ORIGIN_LOCATION_ID: number;
  ORIGIN_CITY: string;
  ORIGIN_AIRPORT: string;
  DESTINATION_LOCATION_ID: number;
  DESTINATION_CITY: string;
  DESTINATION_AIRPORT: string;
  TRANSIT_LOCATION_ID: number;
  TRANSIT_CITY: string;
  TRANSIT_AIRPORT: string;
  AIRCRAFT_ID: number;
  AIRCRAFT_MODEL: string;
  AIRCRAFT_MANUFACTURER: string | null;
  SEAT_CAPACITY: number | null;
  VERIFIED: boolean | null;
  SEAT_TYPE: string | null;
  TYPE_OF_TRAVELLER: string | null;
  SEAT_COMFORT: number | null;
  CABIN_STAFF_SERVICE: number | null;
  FOOD_AND_BEVERAGES: number | null;
  INFLIGHT_ENTERTAINMENT: number | null;
  GROUND_SERVICE: number | null;
  WIFI_AND_CONNECTIVITY: number | null;
  VALUE_FOR_MONEY: number | null;
  AVERAGE_RATING: number | null;
  RATING_BAND: string;
  RECOMMENDED: boolean | null;
  REVIEW_TEXT: string | null;
  EL_UPDATED_AT: string;
  T_UPDATED_AT: string;
};


export type AircraftManufacturer = {
  manufacturer: string;
  count: number;
  percentage: number;
};

export type AircraftModel = {
  model: string;
  count: number;
};

export type AircraftAnalysis = {
  aircraftManufacturersPercentage: AircraftManufacturer[];
  aircraftModels: AircraftModel[];
};

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

export type CustomerAnalysis = {
  reviewsByCountry: ReviewsByCountry[];
  verifiedAndUnverifiedReviews: VerifiedAndUnverifiedReviews;
  aircraftSeatTypePercentage: AircraftSeatTypePercentage[];
  travellerTypePercentage: TravellerTypePercentage[];
};


export type DataSummary = {
  totalReviews: number;
  totalVerifiedReviews: number;
  totalAircraftModels: number;
  totalCountries: number;
};

export type LineChartDataset = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  yAxisID?: string;
  fill?: boolean;
  tension?: number;
  borderWidth?: number;
};

export type LineChartYAxis = {
  id: string;
  position: "left" | "right";
  title: string;
  min?: number;
  max?: number;
  stepSize?: number;
  display?: boolean;
};


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

export type MonthlyMetrics = {
  recommendationPercentage: RecommendationPercentage;
  vfmScore: VfmScore;
  averageRating: AverageRating;
  totalNumberOfReviews: TotalNumberOfReviews;
  month: string;
};

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

export type ReviewTextAnalysis = {
  sampleReviews: SampleReviews;
  ratingBandsTypeCount: number[];
};


export type TopCity = {
  city: string;
  count: number;
};

export type TopRoute = {
  origin: string;
  destination: string;
  count: number;
  averageRating: number;
};

export type RouteAnalysis = {
  topOriginCities: TopCity[];
  topDestinationCities: TopCity[];
  topRoutes: TopRoute[];
};

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

export type TimebasedAnalysis = {
  reviewsOverTime: ReviewsOverTime[];
  avgRecommendation: AvgRecommendation[];
  avgScore: AvgScore[];
  avgMoneyValue: AvgMoneyValue[];
  allServices: AllServices;
};
