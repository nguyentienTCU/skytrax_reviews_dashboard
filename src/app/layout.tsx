import type { Metadata } from "next";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarWrapper from "@/components/custom-ui/Sidebar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "British Airways Reviews Dashboard",
	description:
		"Comprehensive analytics dashboard for British Airways customer reviews, featuring real-time insights, sentiment analysis, and performance metrics across different aircraft models and routes.",
	icons: {
		icon: "/web_logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SidebarWrapper>
					{children}
				</SidebarWrapper>
			</body>
		</html>
	);
}
