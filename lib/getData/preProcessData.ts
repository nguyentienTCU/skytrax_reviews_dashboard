// This file will contain functions to pre-process the data from Snowflake.
// Each function will correspond to a specific part of the dashboard.
import { Review } from "../../type/Review";

export function preProcessDataSummary(data: Review[]) {
	// Logic from getDataSummary.ts
	const getTotalReviews = (data: Review[]) => data.length;
	const getTotalVerifiedReviews = (data: Review[]) => {
		const verifiedCount = data.filter((review) => review.VERIFIED).length;
		return (verifiedCount / data.length) * 100;
	};
	const getTotalAircraftModels = (data: Review[]) => new Set(data.map((review) => review.AIRCRAFT_MODEL)).size;
	const getTotalCountries = (data: Review[]) => new Set(data.map((review) => review.NATIONALITY)).size;

	return {
		totalReviews: getTotalReviews(data),
		totalVerifiedReviews: getTotalVerifiedReviews(data),
		totalAircraftModels: getTotalAircraftModels(data),
		totalCountries: getTotalCountries(data),
	};
}

export function preProcessMonthlyMetrics(reviews: Review[], compareWith: "previous month" | "previous year") {
	const getCurrentMonthReviews = (reviews: Review[]) => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;
		return reviews.filter(
			(review) =>
				review.REVIEW_CAL_MONTH === currentMonth &&
				review.REVIEW_CAL_YEAR === currentDate.getFullYear()
		);
	};

	const getLastMonthReviews = (reviews: Review[]) => {
		const currentDate = new Date();
		const lastMonth = currentDate.getMonth();
		return reviews.filter(
			(review) => review.REVIEW_CAL_MONTH === lastMonth && review.REVIEW_CAL_YEAR === currentDate.getFullYear()
		);
	};

	const getLastYearReviews = (reviews: Review[]) => {
		const currentDate = new Date();
		const lastYear = currentDate.getFullYear() - 1;
		return reviews.filter(
			(review) => review.REVIEW_CAL_YEAR === lastYear && review.REVIEW_CAL_MONTH === currentDate.getMonth()
		);
	};

	const currentMonthReviews = getCurrentMonthReviews(reviews);
	const compareWithReviews =
		compareWith === "previous month"
			? getLastMonthReviews(reviews)
			: getLastYearReviews(reviews);

	const getRecommendationPercentage = (
		currentMonthReviews: Review[],
		compareWithReviews: Review[]
	) => {
		const recommendedReviews = currentMonthReviews.filter(
			(review) => review.RECOMMENDED === true
		).length;
		const currentPercentage =
			(recommendedReviews / currentMonthReviews.length) * 100;
		const recommendedReviewsCompareWith = compareWithReviews.filter(
			(review) => review.RECOMMENDED === true
		).length;
		const compareWithPercentage =
			(recommendedReviewsCompareWith / compareWithReviews.length) * 100;
		const percentageChange = currentPercentage - compareWithPercentage;
		return {
			currentPercentage: currentPercentage.toFixed(2),
			percentageChange: percentageChange.toFixed(2),
		};
	};

	const getVfmScore = (
		currentMonthReviews: Review[],
		compareWithReviews: Review[]
	) => {
		const currentVfmScore =
			currentMonthReviews.reduce(
				(sum, review) => sum + (review.VALUE_FOR_MONEY || 0),
				0
			) / currentMonthReviews.length;
		const compareWithVfmScore =
			compareWithReviews.reduce(
				(sum, review) => sum + (review.VALUE_FOR_MONEY || 0),
				0
			) / compareWithReviews.length;
		const scoreChange = currentVfmScore - compareWithVfmScore;
		return {
			currentScore: currentVfmScore.toFixed(2),
			scoreChange: scoreChange.toFixed(2),
		};
	};

	const getAverageRating = (
		currentMonthReviews: Review[],
		compareWithReviews: Review[]
	) => {
		const currentRating =
			currentMonthReviews.reduce(
				(sum, review) => sum + (review.AVERAGE_RATING || 0),
				0
			) / currentMonthReviews.length;
		const compareWithRating =
			compareWithReviews.reduce(
				(sum, review) => sum + (review.AVERAGE_RATING || 0),
				0
			) / compareWithReviews.length;
		const ratingChange = currentRating - compareWithRating;
		return {
			currentRating: currentRating.toFixed(2),
			ratingChange: ratingChange.toFixed(2),
		};
	};

	const getTotalNumberOfReviews = (
		currentMonthReviews: Review[],
		compareWithReviews: Review[]
	) => {
		const currentTotal = currentMonthReviews.length;
		const compareWithTotal = compareWithReviews.length;
		const totalChange = currentTotal - compareWithTotal;
		return {
			currentTotal,
			totalChange,
		};
	};

	const getCurrentMonth = () => {
		const currentDate = new Date();
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const currentMonth = monthNames[currentDate.getMonth()];
		const currentYear = currentDate.getFullYear();
		return `${currentMonth} - ${currentYear}`;
	};

	return {
		recommendationPercentage: getRecommendationPercentage(
			currentMonthReviews,
			compareWithReviews
		),
		vfmScore: getVfmScore(currentMonthReviews, compareWithReviews),
		averageRating: getAverageRating(currentMonthReviews, compareWithReviews),
		totalNumberOfReviews: getTotalNumberOfReviews(
			currentMonthReviews,
			compareWithReviews
		),
		month: getCurrentMonth(),
	};
}

export function preProcessTimebasedAnalysis(reviews: Review[]) {
	const getReviewsOverTime = (reviews: Review[]) => {
		const yearCounts: { [key: number]: number } = {};

		reviews.forEach((review) => {
			const year = review.REVIEW_CAL_YEAR;
			yearCounts[year] = (yearCounts[year] || 0) + 1;
		});

		return Object.entries(yearCounts)
			.map(([year, count]) => ({
				year: parseInt(year),
				count,
			}))
			.sort((a, b) => a.year - b.year);
	};

	const getAvgRecommendation = (reviews: Review[]) => {
		const yearGroups: { [key: number]: Review[] } = {};

		reviews.forEach((review) => {
			if (review.REVIEW_CAL_YEAR && review.RECOMMENDED !== null) {
				const year = review.REVIEW_CAL_YEAR;
				if (!yearGroups[year]) {
					yearGroups[year] = [];
				}
				yearGroups[year].push(review);
			}
		});

		const recommendationData: { year: number; percentage: number }[] = [];
		const sortedYears = Object.keys(yearGroups)
			.map(Number)
			.sort((a, b) => a - b);

		sortedYears.forEach((year) => {
			const yearReviews = yearGroups[year];
			const recommendedCount = yearReviews.filter(
				(review) => review.RECOMMENDED === true
			).length;
			const percentage = (recommendedCount / yearReviews.length) * 100;
			recommendationData.push({
				year,
				percentage,
			});
		});

		return recommendationData;
	};

	const getAvgScore = (reviews: Review[]) => {
		const yearGroups: { [key: number]: Review[] } = {};

		reviews.forEach((review) => {
			if (review.REVIEW_CAL_YEAR && review.AVERAGE_RATING !== null) {
				const year = review.REVIEW_CAL_YEAR;
				if (!yearGroups[year]) {
					yearGroups[year] = [];
				}
				yearGroups[year].push(review);
			}
		});

		const averageScores: { year: number; averageScore: number }[] = [];
		const sortedYears = Object.keys(yearGroups)
			.map(Number)
			.sort((a, b) => a - b);

		sortedYears.forEach((year) => {
			const yearReviews = yearGroups[year];
			const totalScore = yearReviews.reduce((sum, review) => {
				if (review.AVERAGE_RATING === null) return sum;
				return sum + review.AVERAGE_RATING;
			}, 0);

			const averageScore = totalScore / yearReviews.length;
			averageScores.push({
				year,
				averageScore,
			});
		});

		return averageScores;
	};

	const getAvgMoneyValue = (reviews: Review[]) => {
		const yearGroups: { [key: number]: Review[] } = {};

		reviews.forEach((review) => {
			if (review.REVIEW_CAL_YEAR && review.VALUE_FOR_MONEY !== null) {
				const year = review.REVIEW_CAL_YEAR;
				if (!yearGroups[year]) {
					yearGroups[year] = [];
				}
				yearGroups[year].push(review);
			}
		});

		const averageMoneyValues: { year: number; averageMoneyValue: number }[] = [];
		const sortedYears = Object.keys(yearGroups)
			.map(Number)
			.sort((a, b) => a - b);

		sortedYears.forEach((year) => {
			const yearReviews = yearGroups[year];
			const totalMoneyValue = yearReviews.reduce((sum, review) => {
				if (review.VALUE_FOR_MONEY === null) return sum;
				return sum + review.VALUE_FOR_MONEY;
			}, 0);

			const averageMoneyValue = totalMoneyValue / yearReviews.length;
			averageMoneyValues.push({
				year,
				averageMoneyValue,
			});
		});

		return averageMoneyValues;
	};

	const getAllServices = (reviews: Review[]) => {
		const getSeatComfort = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.SEAT_COMFORT !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.SEAT_COMFORT;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		const getCabinStaffService = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.CABIN_STAFF_SERVICE !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.CABIN_STAFF_SERVICE;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		const getFoodAndBeverages = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.FOOD_AND_BEVERAGES !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.FOOD_AND_BEVERAGES;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		const getGroundService = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.GROUND_SERVICE !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.GROUND_SERVICE;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		const getInFlightEntertainment = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.INFLIGHT_ENTERTAINMENT !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.INFLIGHT_ENTERTAINMENT;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		const getMoneyValue = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.VALUE_FOR_MONEY !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.VALUE_FOR_MONEY;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		const getWifiAndConnectivity = (reviews: Review[]) => {
			const yearGroups: { [key: number]: { [key: number]: number } } = {};

			reviews.forEach((review) => {
				if (review.REVIEW_CAL_YEAR && review.WIFI_AND_CONNECTIVITY !== null) {
					const year = review.REVIEW_CAL_YEAR;
					const rating = review.WIFI_AND_CONNECTIVITY;

					if (!yearGroups[year]) {
						yearGroups[year] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
					}
					yearGroups[year][rating]++;
				}
			});

			return yearGroups;
		};

		return {
			"seat_comfort": getSeatComfort(reviews),
			"cabin_staff_service": getCabinStaffService(reviews),
			"food_and_beverages": getFoodAndBeverages(reviews),
			"ground_service": getGroundService(reviews),
			"inflight_entertainment": getInFlightEntertainment(reviews),
			"value_for_money": getMoneyValue(reviews),
			"wifi_and_connectivity": getWifiAndConnectivity(reviews),
		};
	};

	return {
		reviewsOverTime: getReviewsOverTime(reviews),
		avgRecommendation: getAvgRecommendation(reviews),
		avgScore: getAvgScore(reviews),
		avgMoneyValue: getAvgMoneyValue(reviews),
		allServices: getAllServices(reviews),
	};
}

export function preProcessAircraftAnalysis(reviews: Review[]) {
	const getAircraftManufacturersPercentage = (reviews: Review[]) => {
		const manufacturerCounts: { [key: string]: number } = {};
		const totalReviews = reviews.length;

		reviews.forEach((review) => {
			const manufacturer = review.AIRCRAFT_MANUFACTURER;
			if (manufacturer) {
				manufacturerCounts[manufacturer] =
					(manufacturerCounts[manufacturer] || 0) + 1;
			} else {
				manufacturerCounts["Unknown"] = (manufacturerCounts["Unknown"] || 0) + 1;
			}
		});

		const sortedManufacturers = Object.entries(manufacturerCounts)
			.map(([manufacturer, count]) => ({
				manufacturer,
				count,
				percentage: (count / totalReviews) * 100,
			}))
			.sort((a, b) => b.count - a.count);

		const topManufacturers = sortedManufacturers.slice(0, 5);

		const hasUnknown = topManufacturers.some((m) => m.manufacturer === "Unknown");

		if (hasUnknown) {
			return topManufacturers;
		} else {
			const unknownCount = manufacturerCounts["Unknown"] || 0;
			const unknownPercentage = (unknownCount / totalReviews) * 100;

			return [
				...topManufacturers.slice(0, 4),
				{
					manufacturer: "Unknown",
					count: unknownCount,
					percentage: unknownPercentage,
				},
			];
		}
	};

	const getAircraftModels = (reviews: Review[]) => {
		const modelCounts: { [key: string]: number } = {};

		reviews.forEach((review) => {
			const model = review.AIRCRAFT_MODEL;
			modelCounts[model] = (modelCounts[model] || 0) + 1;
		});

		return Object.entries(modelCounts)
			.map(([model, count]) => ({
				model,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 6);
	};

	return {
		aircraftManufacturersPercentage:
			getAircraftManufacturersPercentage(reviews),
		aircraftModels: getAircraftModels(reviews),
	};
}

export function preProcessRouteAnalysis(reviews: Review[]) {
	const getTopOriginCities = (reviews: Review[]) => {
		const cityCounts: { [key: string]: number } = {};

		reviews.forEach((review) => {
			const city = review.ORIGIN_CITY;
			cityCounts[city] = (cityCounts[city] || 0) + 1;
		});

		return Object.entries(cityCounts)
			.map(([city, count]) => ({
				city,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 6);
	};

	const getTopDestinationCities = (reviews: Review[]) => {
		const cityCounts: { [key: string]: number } = {};

		reviews.forEach((review) => {
			const city = review.DESTINATION_CITY;
			cityCounts[city] = (cityCounts[city] || 0) + 1;
		});

		return Object.entries(cityCounts)
			.map(([city, count]) => ({
				city,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 6);
	};

	const getTopRoutes = (reviews: Review[]) => {
		const routeCounts: {
			[key: string]: {
				origin: string;
				destination: string;
				count: number;
				averageRating: number;
			};
		} = {};

		reviews.forEach((review) => {
			if (
				review.ORIGIN_CITY &&
				review.DESTINATION_CITY &&
				review.ORIGIN_CITY !== "Unknown" &&
				review.DESTINATION_CITY !== "Unknown" &&
				review.AVERAGE_RATING
			) {
				const routeKey = `${review.ORIGIN_CITY}-${review.DESTINATION_CITY}`;

				if (!routeCounts[routeKey]) {
					routeCounts[routeKey] = {
						origin: review.ORIGIN_CITY,
						destination: review.DESTINATION_CITY,
						count: 0,
						averageRating: 0,
					};
				}

				routeCounts[routeKey].count++;
				routeCounts[routeKey].averageRating =
					(routeCounts[routeKey].averageRating *
						(routeCounts[routeKey].count - 1) +
						review.AVERAGE_RATING) /
					routeCounts[routeKey].count;
			}
		});

		return Object.values(routeCounts)
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);
	};

	return {
		topOriginCities: getTopOriginCities(reviews),
		topDestinationCities: getTopDestinationCities(reviews),
		topRoutes: getTopRoutes(reviews),
	};
}

export function preProcessCustomerAnalysis(reviews: Review[]) {
	const getReviewsByCountry = (reviews: Review[]) => {
		const countryCounts: { [key: string]: number } = {};

		reviews.forEach((review) => {
			const country = review.NATIONALITY;
			if (country) {
				countryCounts[country] = (countryCounts[country] || 0) + 1;
			}
		});

		return Object.entries(countryCounts)
			.map(([country, count]) => ({
				country,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 7);
	};

	const getVerifiedAndUnverifiedReviews = (reviews: Review[]) => {
		const totalReviews = reviews.length;
		const verifiedCount = reviews.filter((review) => review.VERIFIED).length;
		const verifiedPercentage = (verifiedCount / totalReviews) * 100;

		return {
			verified: verifiedPercentage,
			unverified: 100 - verifiedPercentage,
		};
	};

	const getAircraftSeatTypePercentage = (reviews: Review[]) => {
		const seatTypeCounts: { [key: string]: number } = {};
		const totalReviews = reviews.length;
		const targetSeatTypes = [
			"Economy Class",
			"Business Class",
			"First Class",
			"Premium Economy",
			"Unknown",
		];

		targetSeatTypes.forEach((type) => {
			seatTypeCounts[type] = 0;
		});

		reviews.forEach((review) => {
			const seatType = review.SEAT_TYPE;
			if (seatType) {
				seatTypeCounts[seatType] = seatTypeCounts[seatType] + 1;
			} else {
				seatTypeCounts["Unknown"] = seatTypeCounts["Unknown"] + 1;
			}
		});

		return targetSeatTypes
			.filter((type) => type !== "Unknown" || seatTypeCounts[type] > 0)
			.map((seatType) => ({
				seatType,
				percentage: (seatTypeCounts[seatType] / totalReviews) * 100,
			}));
	};

	const getTravellerTypePercentage = (reviews: Review[]) => {
		const travellerTypeCounts: { [key: string]: number } = {};
		const totalReviews = reviews.length;
		const targetTravellerTypes = [
			"Couple Leisure",
			"Solo Leisure",
			"Business",
			"Family Leisure",
			"Unknown",
		];

		targetTravellerTypes.forEach((type) => {
			travellerTypeCounts[type] = 0;
		});

		reviews.forEach((review) => {
			const travellerType = review.TYPE_OF_TRAVELLER;
			if (travellerType) {
				travellerTypeCounts[travellerType] = travellerTypeCounts[travellerType] + 1;
			} else {
				travellerTypeCounts["Unknown"] = travellerTypeCounts["Unknown"] + 1;
			}
		});

		return targetTravellerTypes
			.filter((type) => type !== "Unknown" || travellerTypeCounts[type] > 0)
			.map((travellerType) => ({
				travellerType,
				percentage: (travellerTypeCounts[travellerType] / totalReviews) * 100,
			}));
	};

	return {
		reviewsByCountry: getReviewsByCountry(reviews),
		verifiedAndUnverifiedReviews: getVerifiedAndUnverifiedReviews(reviews),
		aircraftSeatTypePercentage: getAircraftSeatTypePercentage(reviews),
		travellerTypePercentage: getTravellerTypePercentage(reviews),
	};
}

export function preProcessReviewTextAnalysis(reviews: Review[]) {
	const getSampleReviews = (reviews: Review[]) => {
		const sampleReviews = {
			bad: {
				reviewText: "",
				originCity: "",
				destinationCity: "",
				aircraftModel: "",
				seatType: "",
				averageRating: 0,
			},
			medium: {
				reviewText: "",
				originCity: "",
				destinationCity: "",
				aircraftModel: "",
				seatType: "",
				averageRating: 0,
			},
			good: {
				reviewText: "",
				originCity: "",
				destinationCity: "",
				aircraftModel: "",
				seatType: "",
				averageRating: 0,
			},
		};

		for (const review of reviews) {
			const ratingBand = review.RATING_BAND.toLowerCase() as "bad" | "medium" | "good";
			if (
				sampleReviews[ratingBand].reviewText === "" &&
				review.REVIEW_TEXT &&
				review.REVIEW_TEXT !== "Unknown" &&
				review.ORIGIN_CITY &&
				review.ORIGIN_CITY !== "Unknown" &&
				review.DESTINATION_CITY &&
				review.DESTINATION_CITY !== "Unknown" &&
				review.AIRCRAFT_MODEL &&
				review.AIRCRAFT_MODEL !== "Unknown" &&
				review.SEAT_TYPE &&
				review.SEAT_TYPE !== "Unknown" &&
				review.RATING_BAND &&
				review.RATING_BAND !== "Unknown" &&
				review.AVERAGE_RATING
			) {
				sampleReviews[ratingBand] = {
					reviewText: review.REVIEW_TEXT,
					originCity: review.ORIGIN_CITY,
					destinationCity: review.DESTINATION_CITY,
					aircraftModel: review.AIRCRAFT_MODEL,
					seatType: review.SEAT_TYPE,
					averageRating: review.AVERAGE_RATING,
				};
			}

			if (
				sampleReviews.bad.reviewText !== "" &&
				sampleReviews.medium.reviewText !== "" &&
				sampleReviews.good.reviewText !== ""
			) {
				break;
			}
		}

		return sampleReviews;
	};

	const getRatingBandsTypeCount = (reviews: Review[]) => {
		const totalReviews = reviews.length;
		const ratingBandsType: number[] = [
			(reviews.filter((review) => review.RATING_BAND.toLowerCase() === "bad")
				.length /
				totalReviews) *
				100,
			(reviews.filter((review) => review.RATING_BAND.toLowerCase() === "medium")
				.length /
				totalReviews) *
				100,
			(reviews.filter((review) => review.RATING_BAND.toLowerCase() === "good")
				.length /
				totalReviews) *
				100,
		];

		return ratingBandsType;
	};

	return {
		sampleReviews: getSampleReviews(reviews),
		ratingBandsTypeCount: getRatingBandsTypeCount(reviews),
	};
}
