
export type AircraftManufacturer = {
  manufacturer: string;
  count: number;
  percentage: number;
};

export type AircraftModel = {
  model: string;
  count: number;
};

export type AircraftAnalysisData = {
  aircraftManufacturersPercentage: AircraftManufacturer[];
  aircraftModels: AircraftModel[];
};
