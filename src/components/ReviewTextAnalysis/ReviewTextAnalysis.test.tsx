import { render, screen } from '@/test-utils';
import ReviewTextAnalysis from './ReviewTextAnalysis';
import PieGraph from '@/components/custom-ui/PieChart';
import { getReviewTextAnalysis } from '@/lib/getData/getReviewTextAnalysis';
import { ReviewTextAnalysisData } from 'type/ReviewTextAnalysisData';

jest.mock("@/components/custom-ui/PieChart", () => ({
    __esModule: true,
    default: jest.fn(() => null),
}))

jest.mock('@/lib/getData/getReviewTextAnalysis', () => ({
  getReviewTextAnalysis: jest.fn(),
}));

const mock_data: ReviewTextAnalysisData = {
  sampleReviews: {
    good: {
      reviewText: "The flight was fantastic. Great service and comfortable seating.",
      originCity: "London",
      destinationCity: "New York",
      aircraftModel: "Boeing 777",
      seatType: "Business Class",
      averageRating: 5,
    },
    medium: {
      reviewText: "The flight was okay, but the food could have been better.",
      originCity: "Paris",
      destinationCity: "Dubai",
      aircraftModel: "Airbus A380",
      seatType: "Economy Class",
      averageRating: 3,
    },
    bad: {
      reviewText: "A very disappointing experience. The flight was delayed and the staff were unhelpful.",
      originCity: "Tokyo",
      destinationCity: "Sydney",
      aircraftModel: "Boeing 787",
      seatType: "Economy Class",
      averageRating: 1,
    },
  },
  ratingBandsTypeCount: [0.6, 0.3, 0.1],
};

describe('ReviewTextAnalysis', () => {
  beforeEach(() => {
    (getReviewTextAnalysis as jest.Mock).mockClear();
    (PieGraph as jest.Mock).mockClear();
  });

  it('should render titles and pass correct data to charts', async () => {
    (getReviewTextAnalysis as jest.Mock).mockResolvedValue(mock_data);

    const Component = await ReviewTextAnalysis();
    render(Component);

    // Assert titles are rendered
    expect(screen.getByRole('heading', { level: 2, name: 'Review Text Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Common Keywords' })).toBeInTheDocument();

    // Assert that PieGraph was called with the correct props
    expect(PieGraph).toHaveBeenCalledTimes(1);
    const pieChartProps = (PieGraph as jest.Mock).mock.calls[0][0];
    expect(pieChartProps.values).toEqual([0.6, 0.3, 0.1]);
  });
});