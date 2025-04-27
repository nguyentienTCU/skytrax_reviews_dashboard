import { getChartData } from "../csv-parser";
import { Review } from "../../type/Review";

export async function getMonthlyMetrics() {
    try {
        const reviews = (await getChartData("reviews.csv")) as Review[];
        return {
            recommendationPercentage: getRecommendationPercentage(reviews),
            vfmScore: getVfmScore(reviews),
            averageRating: getAverageRating(reviews),
            totalNumberOfReviews: getTotalNumberOfReviews(reviews),
            month: getMonth(),
        };
    } catch (error) {
        console.error("Error fetching monthly metrics:", error);
        throw error;
    }

    function getRecommendationPercentage(reviews: Review[]) {
        const totalReviews = reviews.length;
        const recommendedReviews = reviews.filter(review => review.RECOMMENDED === true).length;
        return ((recommendedReviews / totalReviews) * 100).toFixed(2);
    }

    function getVfmScore(reviews: Review[]) {
        const totalReviews = reviews.length;
        const totalVfmScore = reviews.reduce((sum, review) => sum + (review.VALUE_FOR_MONEY || 0), 0);
        return (totalVfmScore / totalReviews);
    }

    function getAverageRating(reviews: Review[]) {
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + (review.AVERAGE_RATING || 0), 0);
        return (totalRating / totalReviews);
    }

    function getTotalNumberOfReviews(reviews: Review[]) {
        return reviews.length;
    }

    function getMonth() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        return `${currentMonth} - ${currentYear}`;
    }
}


