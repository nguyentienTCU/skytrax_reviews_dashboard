// src/components/__tests__/CustomerAnalysis.test.tsx
import { render, screen } from '@/test-utils';
import CustomerAnalysis from '../CustomerAnalysis';
import useSWR from 'swr';
import PieGraph from '@/components/custom-ui/PieChart';
import BarGraph from '@/components/custom-ui/BarChart';

// ---- Mocks ----
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/custom-ui/PieChart', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('@/components/custom-ui/BarChart', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const baseData = {
  reviewsByCountry: [
    { country: 'USA',     count: 150 },
    { country: 'UK',      count: 100 },
    { country: 'Germany', count: 50  },
  ],
  verifiedAndUnverifiedReviews: {
    verified: 200,
    unverified: 50,
  },
  // NOTE: percentages are FRACTIONS here (0.75 = 75%).
  aircraftSeatTypePercentage: [
    { seatType: 'Economy',     percentage: 0.75 },
    { seatType: 'Business',    percentage: 0.2  },
    { seatType: 'First Class', percentage: 0.009 }, // filtered out (<1% because 0.009*100 = 0.9)
  ],
  travellerTypePercentage: [
    { travellerType: 'Business', percentage: 0.6 },
    { travellerType: 'Leisure',  percentage: 0.4 },
  ],
};

describe('CustomerAnalysis', () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReset();
    (PieGraph as jest.Mock).mockClear();
    (BarGraph as jest.Mock).mockClear();
  });

  it('renders section titles and passes correct props to all charts', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: baseData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<CustomerAnalysis airlineSlug="test-airline" />);

    // Section titles
    expect(screen.getByRole('heading', { level: 2, name: 'Customer Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Reviews by Country' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Verified vs. Unverified Reviews Composition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Seat Type Composition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Traveller Type Composition' })).toBeInTheDocument();

    // Reviews by Country -> BarGraph
    expect(BarGraph).toHaveBeenCalledTimes(1);
    const countryBarProps = (BarGraph as jest.Mock).mock.calls[0][0];
    expect(countryBarProps.valueLabels).toEqual(['USA', 'UK', 'Germany']);
    expect(countryBarProps.values).toEqual([150, 100, 50]);
    expect(countryBarProps.axis).toBe('y'); // sanity check a config prop you set

    // We render three PieGraphs: verified vs unverified, seat type, traveller type
    expect(PieGraph).toHaveBeenCalledTimes(3);

    // Pie 1: Verified vs Unverified (counts, rounded to 2dp—no change)
    const verifiedPieProps = (PieGraph as jest.Mock).mock.calls[0][0];
    expect(verifiedPieProps.valueLabels).toEqual(['Verified', 'Unverified']);
    expect(verifiedPieProps.values).toEqual([200, 50]);

    // Pie 2: Seat Type (filters out < 1%)
    const seatTypePieProps = (PieGraph as jest.Mock).mock.calls[1][0];
    expect(seatTypePieProps.valueLabels).toEqual(['Economy', 'Business']); // 'First Class' filtered
    expect(seatTypePieProps.values).toEqual([0.75, 0.2]); // values are FRACTIONS after rounding

    // Pie 3: Traveller Type
    const travellerPieProps = (PieGraph as jest.Mock).mock.calls[2][0];
    expect(travellerPieProps.valueLabels).toEqual(['Business', 'Leisure']);
    expect(travellerPieProps.values).toEqual([0.6, 0.4]);
  });

  it('applies the <1% filter for seat and traveller types correctly', () => {
    const data = {
      ...baseData,
      aircraftSeatTypePercentage: [
        { seatType: 'Economy',  percentage: 0.009 }, // 0.9% -> filtered
        { seatType: 'Premium',  percentage: 0.0101 }, // 1.01% -> kept (rounded to 0.01)
      ],
      travellerTypePercentage: [
        { travellerType: 'Crew', percentage: 0.0005 }, // 0.05% -> filtered
        { travellerType: 'Other', percentage: 0.015 }, // 1.5% -> kept
      ],
    };

    (useSWR as jest.Mock).mockReturnValue({
      data,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<CustomerAnalysis airlineSlug="test-airline" />);

    // Calls: [BarGraph (country)], [Pie verified], [Pie seat], [Pie traveller]  -> still 1 + 3
    expect(PieGraph).toHaveBeenCalledTimes(3);

    const seatPie = (PieGraph as jest.Mock).mock.calls[1][0];
    expect(seatPie.valueLabels).toEqual(['Premium']);
    // 0.0101 rounded to two decimals -> 0.01
    expect(seatPie.values).toEqual([0.01]);

    const travellerPie = (PieGraph as jest.Mock).mock.calls[2][0];
    expect(travellerPie.valueLabels).toEqual(['Other']);
    expect(travellerPie.values).toEqual([0.01]); // 0.015 -> 0.01
  });

  it('handles empty datasets without crashing (charts get empty arrays)', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: {
        reviewsByCountry: [],
        verifiedAndUnverifiedReviews: { verified: 0, unverified: 0 },
        aircraftSeatTypePercentage: [],
        travellerTypePercentage: [],
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<CustomerAnalysis airlineSlug="test-airline" />);

    // Still renders headings
    expect(screen.getByRole('heading', { level: 2, name: 'Customer Analysis' })).toBeInTheDocument();

    // BarGraph should have empty props
    const barProps = (BarGraph as jest.Mock).mock.calls[0][0];
    expect(barProps.valueLabels).toEqual([]);
    expect(barProps.values).toEqual([]);

    // Three pies still get rendered with empty arrays
    const pie1 = (PieGraph as jest.Mock).mock.calls[0][0];
    const pie2 = (PieGraph as jest.Mock).mock.calls[1][0];
    const pie3 = (PieGraph as jest.Mock).mock.calls[2][0];

    expect(pie1.values).toEqual([0, 0]); // verified/unverified
    expect(pie2.values).toEqual([]);     // seat types
    expect(pie3.values).toEqual([]);     // traveller types
  });
});
