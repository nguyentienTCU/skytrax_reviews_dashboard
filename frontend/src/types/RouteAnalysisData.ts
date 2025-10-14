
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

export type RouteAnalysisData = {
  topOriginCities: TopCity[];
  topDestinationCities: TopCity[];
  topRoutes: TopRoute[];
};
