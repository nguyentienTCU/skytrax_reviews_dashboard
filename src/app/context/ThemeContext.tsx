"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Check if user has a theme preference in localStorage
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setIsDarkMode(savedTheme === "dark");
		} else {
			// If no saved preference, check system preference
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			setIsDarkMode(prefersDark);
		}
	}, []);

	useEffect(() => {
		// Update localStorage and document class when theme changes
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");

		// Remove dark class first to ensure clean state
		document.documentElement.classList.remove("dark");

		// Add dark class if in dark mode
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
			// Update CSS variables for dark mode
			document.documentElement.style.setProperty("--background", "#0a0a0a");
			document.documentElement.style.setProperty("--foreground", "#ededed");
		} else {
			// Update CSS variables for light mode
			document.documentElement.style.setProperty("--background", "#ffffff");
			document.documentElement.style.setProperty("--foreground", "#171717");
		}

		console.log("Theme changed to:", isDarkMode ? "dark" : "light");
		console.log("HTML classes:", document.documentElement.classList.toString());
		console.log("HTML element:", document.documentElement);
		console.log("Body classes:", document.body.classList.toString());
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		console.log("Toggle dark mode clicked, current state:", isDarkMode);
		setIsDarkMode(!isDarkMode);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
