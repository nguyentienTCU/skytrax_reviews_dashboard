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
