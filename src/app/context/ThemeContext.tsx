"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

type ThemeContextType = {
    mounted: boolean;
	isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
	const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    localStorage.setItem("theme", "system");
  }, []);

  useEffect(() => {
    console.log("resolvedTheme: " + resolvedTheme);
    console.log("theme: " + theme);
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

	return (
		<ThemeContext.Provider value={{ mounted ,isDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useColorTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}