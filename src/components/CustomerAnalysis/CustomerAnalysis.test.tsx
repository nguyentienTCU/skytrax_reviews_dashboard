import { render, screen } from '@/test-utils';
import CustomerAnalysis from "./CustomerAnalysis";
import PieGraph from '@/components/custom-ui/PieChart';
import BarGraph from '@/components/custom-ui/BarChart';

jest.mock('@/components/custom-ui/PieChart', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('@/components/custom-ui/BarChart', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

const mockData = {
  reviewsByCountry: [
    { country: 'USA', count: 150 },
    { country: 'UK', count: 100 },
    { country: 'Germany', count: 50 },
  ],
  verifiedAndUnverifiedReviews: {
    verified: 200,
    unverified: 50,
  },
  aircraftSeatTypePercentage: [
    { seatType: 'Economy', percentage: 0.75 },
    { seatType: 'Business', percentage: 0.2 },
    { seatType: 'First Class', percentage: 0.009 }, // This will be filtered out
  ],
  travellerTypePercentage: [
    { travellerType: 'Business', percentage: 0.6 },
    { travellerType: 'Leisure', percentage: 0.4 },
  ],
};

describe('CustomerAnalysis', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (PieGraph as jest.Mock).mockClear();
    (BarGraph as jest.Mock).mockClear();
  });

  it('should render titles and pass correct data to charts', async () => {
    const Component = await CustomerAnalysis({ data: mockData });
    render(Component);

    // Assert titles are rendered
    expect(screen.getByRole('heading', { level: 2, name: 'Customer Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Reviews by Country' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Verified vs. Unverified Reviews Composition' })).toBeInTheDocument();

    // Assert that BarGraph was called with the correct props for reviews by country
    expect(BarGraph).toHaveBeenCalledTimes(1);
    const barGraphProps = (BarGraph as jest.Mock).mock.calls[0][0];
    expect(barGraphProps.valueLabels).toEqual(['USA', 'UK', 'Germany']);
    expect(barGraphProps.values).toEqual([150, 100, 50]);

    // Assert that PieGraphs were called with the correct data
    expect(PieGraph).toHaveBeenCalledTimes(3);

    const pieGraphProps1 = (PieGraph as jest.Mock).mock.calls[0][0];
    expect(pieGraphProps1.values).toEqual([200, 50]);

    const pieGraphProps2 = (PieGraph as jest.Mock).mock.calls[1][0];
    expect(pieGraphProps2.values).toEqual([0.75, 0.2]);

    const pieGraphProps3 = (PieGraph as jest.Mock).mock.calls[2][0];
    expect(pieGraphProps3.values).toEqual([0.6, 0.4]);
  });
});
