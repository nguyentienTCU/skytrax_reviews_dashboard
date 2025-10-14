import { render, screen } from '@/test-utils';
import RouteAnalysis from "./RouteAnalysis";
import { RouteAnalysisData } from '../../type/RouteAnalysisData';
import BarGraph from '@/components/custom-ui/BarChart';

jest.mock('@/components/custom-ui/BarChart', () => {
    return {
        __esModule: true,
        default: jest.fn(() => null),
    }
})

const mockRouteAnalysisData: RouteAnalysisData = {
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
        (BarGraph as jest.Mock).mockClear();
    })
  it('renders the component with mock data', async () => {
    const Component = await RouteAnalysis({ data: mockRouteAnalysisData });
    render(Component);

    expect(screen.getByRole('heading', { level: 2, name: 'Route Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Top Origin Cities'})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Top Destination Cities'})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Popular Routes'})).toBeInTheDocument();
  });
});