import { render, screen, within } from '@/test-utils';
import RouteAnalysis from '../RouteAnalysis';
import useSWR from 'swr';
import BarGraph from '@/components/custom-ui/BarChart';
import type { RouteAnalysis as RouteAnalysisType } from '@/types/reviews';

// ---- Mocks ----
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/custom-ui/BarChart', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockData: RouteAnalysisType = {
  topOriginCities: [
    { city: 'London', count: 100 },
    { city: 'New York', count: 80 },
    { city: 'Tokyo', count: 60 },
  ],
  topDestinationCities: [
    { city: 'Paris', count: 120 },
    { city: 'Singapore', count: 90 },
    { city: 'Hong Kong', count: 70 },
  ],
  topRoutes: [
    { origin: 'London', destination: 'Paris', count: 50, averageRating: 4.5 },
    { origin: 'New York', destination: 'London', count: 40, averageRating: 4.2 },
    { origin: 'Tokyo', destination: 'Singapore', count: 30, averageRating: 4.8 },
  ],
};

describe('RouteAnalysis', () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReset();
    (BarGraph as jest.Mock).mockClear();
  });

  it('renders headings, bar charts, and routes table with correct data', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<RouteAnalysis airlineSlug="british-airways" />);

    // Headings
    expect(screen.getByRole('heading', { level: 2, name: 'Route Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Top Origin Cities' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Top Destination Cities' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Popular Routes' })).toBeInTheDocument();

    // BarGraph called twice: origins first, destinations second
    expect(BarGraph).toHaveBeenCalledTimes(2);

    const originProps = (BarGraph as jest.Mock).mock.calls[0][0];
    expect(originProps.valueLabels).toEqual(['London', 'New York', 'Tokyo']);
    expect(originProps.values).toEqual([100, 80, 60]);
    expect(originProps.axis).toBe('y');

    const destProps = (BarGraph as jest.Mock).mock.calls[1][0];
    expect(destProps.valueLabels).toEqual(['Paris', 'Singapore', 'Hong Kong']);
    expect(destProps.values).toEqual([120, 90, 70]);
    expect(destProps.axis).toBe('y');

    // Routes table rows (just sanity-check a couple of cells)
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows.length).toBe(4);

    // Check first data row content
    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText('London')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('Paris')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('50')).toBeInTheDocument();
    // average rating rendered with one decimal
    expect(within(firstDataRow).getByText('4.5')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    });

    render(<RouteAnalysis airlineSlug="british-airways" />);
    // Skeleton blocks exist (generic roles)
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0);
  });

  it('shows error state with Retry when error', () => {
    const mutate = jest.fn();
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('boom'),
      isLoading: false,
      mutate,
    });

    render(<RouteAnalysis airlineSlug="british-airways" />);

    expect(screen.getByText('Failed to load route analysis.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('renders empty message when there are no routes', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { ...mockData, topRoutes: [] },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<RouteAnalysis airlineSlug="british-airways" />);
    expect(screen.getByText('No route data available.')).toBeInTheDocument();
  });
});
