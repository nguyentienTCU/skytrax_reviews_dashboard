import { render, screen } from "@/test-utils";
import useSWR from "swr";
import AircraftAnalysis from "../AircraftAnalysis";
import PieChart from "@/components/custom-ui/PieChart";
import BarGraph from "@/components/custom-ui/BarChart";

// ---- Mocks ---
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/components/custom-ui/PieChart", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock("@/components/custom-ui/BarChart", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockData = {
  aircraftManufacturersPercentage: [
    { manufacturer: "Boeing", percentage: 56 }, // keep (>= 1)
    { manufacturer: "Airbus", percentage: 12.5 }, // keep (>= 1)
    { manufacturer: "Embraer", percentage: 0.5 }, // filtered out (< 1)
  ],
  aircraftModels: [
    { model: "737", count: 120 },
    { model: "A320", count: 95 },
  ],
};

describe("AircraftAnalysis", () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReset();
    (PieChart as jest.Mock).mockClear();
    (BarGraph as jest.Mock).mockClear();
  });

  it("should render titles and pass correct data to charts", async () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<AircraftAnalysis airlineSlug="british-airlines" />);
    // Titles
    expect(
      screen.getByRole("heading", { level: 2, name: "Aircraft Analysis" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Top Aircraft Manufacturers Composition",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Top Aircraft Models" })
    ).toBeInTheDocument();

    expect(PieChart).toHaveBeenCalledTimes(1);
    const pieProps = (PieChart as jest.Mock).mock.calls[0][0];
    expect(pieProps.valueLabels).toEqual(["Boeing", "Airbus"]);
    expect(pieProps.values).toEqual([56, 12.5]); // two-decimal rounding keeps 12.5

    // BarGraph called with models
    expect(BarGraph).toHaveBeenCalledTimes(1);
    const barProps = (BarGraph as jest.Mock).mock.calls[0][0];
    expect(barProps.valueLabels).toEqual(["737", "A320"]);
    expect(barProps.values).toEqual([120, 95]);
  });

  it("shows loading skeleton when isLoading", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    });

    render(<AircraftAnalysis airlineSlug="british-airways" />);

    // Skeleton blocks exist
    expect(screen.getAllByRole("generic").length).toBeGreaterThan(0);
  });

  it("shows error state and a retry button on error", () => {
    const mutate = jest.fn();
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error("boom"),
      isLoading: false,
      mutate,
    });

    render(<AircraftAnalysis airlineSlug="british-airways" />);

    expect(
      screen.getByText("Failed to load aircraft analysis.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("shows empty state when both manufacturers and models are empty", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { aircraftManufacturersPercentage: [], aircraftModels: [] },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<AircraftAnalysis airlineSlug="british-airways" />);
    expect(screen.getByText("No aircraft data available.")).toBeInTheDocument();
  });
});
