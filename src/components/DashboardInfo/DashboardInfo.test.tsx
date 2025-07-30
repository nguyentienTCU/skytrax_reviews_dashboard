import { render, screen } from "@/test-utils";
import DashboardInfo from "./DashboardInfo";
import { getLastRefreshDate } from "@/lib/getData/getLastRefreshDate";

jest.mock("@/lib/getData/getLastRefreshDate", () => ({
  getLastRefreshDate: jest.fn(),
}));

describe("DashboardInfo", () => {
    it("should render last refresh date and self-sampling bias information", async () => {
        const mockDate = "2023-10-01T12:00:00Z";
        (getLastRefreshDate as jest.Mock).mockResolvedValue(mockDate);

        const Component = await DashboardInfo();
        render(Component);

        // Assert last refresh date is displayed correctly
        expect(screen.getByText(`Last Refresh: ${mockDate}`)).toBeInTheDocument();

        // Assert self-sampling bias information is displayed
        expect(screen.getByRole("heading", { level: 3, name: "Self-Sampling Bias" })).toBeInTheDocument();
        expect(screen.getByText(/Our analysis of British Airways reviews is subject to self-selection sampling bias/)).toBeInTheDocument();
    })

})