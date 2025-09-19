import { render, screen } from "@/test-utils";
import DashboardInfo from "./DashboardInfo";

describe("DashboardInfo", () => {
    it("should render last refresh date and self-sampling bias information", async () => {
        const Component = await DashboardInfo();
        render(Component);

        // Assert last refresh date is displayed correctly
        expect(screen.getByText(`Last Refresh: N/A`)).toBeInTheDocument();

        // Assert self-sampling bias information is displayed
        expect(screen.getByRole("heading", { level: 3, name: "Self-Sampling Bias" })).toBeInTheDocument();
        expect(screen.getByText(/Our analysis of British Airways reviews is subject to self-selection sampling bias/)).toBeInTheDocument();
    })

})