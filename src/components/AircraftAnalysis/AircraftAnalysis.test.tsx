import { render, screen } from '@/test-utils';
import AircraftAnalysis from "./AircraftAnalysis";
import { getAircraftAnalysis } from '@/lib/getData/getAircraftAnalysis';
import PieChart from '@/components/custom-ui/PieChart';
import BarGraph from '@/components/custom-ui/BarChart';

// Mock the chart components
jest.mock('@/components/custom-ui/PieChart', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));
jest.mock('@/components/custom-ui/BarChart', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

const mockData = {
  aircraftManufacturersPercentage: [
        { manufacturer: 'Boeing',  percentage: 0.56 },
        { manufacturer: 'Airbus', percentage: 0.125 },
        { manufacturer: 'Embraer', percentage: 0.005 }, // This will be filtered out
  ],
  aircraftModels: [
    { model: '737', count: 120 },
    { model: 'A320', count: 95 },
  ],
};

jest.mock('@/lib/getData/getAircraftAnalysis', () => ({
  getAircraftAnalysis: jest.fn(),
}));

describe('AircraftAnalysis', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (getAircraftAnalysis as jest.Mock).mockClear();
    (PieChart as jest.Mock).mockClear();
    (BarGraph as jest.Mock).mockClear();
  });

  it('should render titles and pass correct data to charts', async () => {
    (getAircraftAnalysis as jest.Mock).mockResolvedValue(mockData);

    const Component = await AircraftAnalysis();
    render(Component);

    // Assert titles are rendered
    expect(screen.getByRole('heading', { level: 2, name: 'Aircraft Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Top Aircraft Manufacturers Composition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Top Aircraft Models' })).toBeInTheDocument();

    // Assert that PieChart was called with the correct props
    expect(PieChart).toHaveBeenCalledTimes(1);
    const pieChartProps = (PieChart as jest.Mock).mock.calls[0][0];
    expect(pieChartProps.valueLabels).toEqual(['Boeing', 'Airbus']);
    expect(pieChartProps.values).toEqual([0.56, 0.13]);


    // Assert that BarChart was called with correct data
    expect(BarGraph).toHaveBeenCalledTimes(1);
    const barGraphProps = (BarGraph as jest.Mock).mock.calls[0][0];
    expect(barGraphProps.valueLabels).toEqual(['737', 'A320']);
    expect(barGraphProps.values).toEqual([120, 95]);
  });
});