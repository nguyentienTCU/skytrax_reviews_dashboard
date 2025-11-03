// src/components/__tests__/ReviewTextAnalysis.test.tsx
import { render, screen } from '@/test-utils';
import ReviewTextAnalysis from '../ReviewTextAnalysis';
import useSWR from 'swr';
import PieGraph from '@/components/custom-ui/PieChart';
import type { ReviewTextAnalysis as ReviewTextAnalysisType } from '@/types/reviews';

// ---- Mocks ----
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/custom-ui/PieChart', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockData: ReviewTextAnalysisType = {
  sampleReviews: {
    good: {
      reviewText: 'The flight was fantastic. Great service and comfortable seating.',
      originCity: 'London',
      destinationCity: 'New York',
      aircraftModel: 'Boeing 777',
      seatType: 'Business Class',
      averageRating: 5,
    },
    medium: {
      reviewText: 'The flight was okay, but the food could have been better.',
      originCity: 'Paris',
      destinationCity: 'Dubai',
      aircraftModel: 'Airbus A380',
      seatType: 'Economy Class',
      averageRating: 3,
    },
    bad: {
      reviewText: 'A very disappointing experience. The flight was delayed and the staff were unhelpful.',
      originCity: 'Tokyo',
      destinationCity: 'Sydney',
      aircraftModel: 'Boeing 787',
      seatType: 'Economy Class',
      averageRating: 1,
    },
  },
  // Order per component: [bad, medium, good]
  ratingBandsTypeCount: [0.6, 0.3, 0.1],
};

describe('ReviewTextAnalysis', () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReset();
    (PieGraph as jest.Mock).mockClear();
  });

  it('renders headings, sample reviews, and passes correct sentiment data to PieGraph', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<ReviewTextAnalysis airlineSlug="test-airline" />);

    // Main headings
    expect(screen.getByRole('heading', { level: 2, name: 'Review Text Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Common Keywords' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Sentiment Analysis Composition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Sample Reviews' })).toBeInTheDocument();

    // Sample review snippets exist
    expect(screen.getByText(/fantastic/i)).toBeInTheDocument();
    expect(screen.getByText(/okay, but the food/i)).toBeInTheDocument();
    expect(screen.getByText(/very disappointing/i)).toBeInTheDocument();

    // PieGraph called once for sentiment
    expect(PieGraph).toHaveBeenCalledTimes(1);
    const pieProps = (PieGraph as jest.Mock).mock.calls[0][0];

    // Values are rounded to 2 decimals in the component; these remain unchanged
    expect(pieProps.values).toEqual([0.6, 0.3, 0.1]); // [bad, medium, good]
    expect(pieProps.valueLabels).toEqual(['Bad', 'Medium', 'Good']);
    expect(pieProps.title).toBe('Review Sentiment Analysis (%)');
    expect(pieProps.legendPosition).toBe('right');
  });

  it('shows loading skeleton when isLoading', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    });

    render(<ReviewTextAnalysis airlineSlug="test-airline" />);

    // Skeleton blocks: we just assert generic elements exist (pulse placeholders)
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0);
  });

  it('shows error state and Retry button when error occurs', () => {
    const mutate = jest.fn();
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('boom'),
      isLoading: false,
      mutate,
    });

    render(<ReviewTextAnalysis airlineSlug="test-airline" />);

    expect(screen.getByText('Failed to load data.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
