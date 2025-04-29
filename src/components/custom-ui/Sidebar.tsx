"use client";

import React, { useState, useRef, useEffect } from "react";

function Sidebar({
	open,
	onClose,
	children,
	width,
	setWidth,
}: {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	width: number;
	setWidth: (width: number) => void;
}) {
	const [isResizing, setIsResizing] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	// Handle mouse down on the resize handle
	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	};

	// Handle mouse move for resizing
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing) return;

			const newWidth = e.clientX;
			if (newWidth >= 250 && newWidth <= 600) {
				// Min and max width constraints
				setWidth(newWidth);
			}
		};

		const handleMouseUp = () => {
			setIsResizing(false);
		};

		if (isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizing, setWidth]);

	return (
		<>
			<aside
				ref={sidebarRef}
				style={{ width: `${width}px` }}
				className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white z-50 shadow-lg transform ${
					isResizing ? "" : "transition-transform duration-300"
				} ${
					open ? "translate-x-0" : "-translate-x-full"
				} scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500`}
			>
				{/* Resize handle */}
				<div
					className={`absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${
						isResizing ? "bg-gray-300 dark:bg-gray-600" : ""
					}`}
					onMouseDown={handleMouseDown}
				/>
				<div className="p-6">
					<div className="mb-6">
						<div className="flex flex-col items-start gap-4 mb-2">
							<span className="text-sm font-bold bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-gray-800 dark:text-white">
								dashboard
							</span>
							<span className="text-gray-500 dark:text-gray-400 text-sm px-3 py-1 rounded-lg">
								chatbot
							</span>
						</div>
					</div>
					<hr className="border-gray-200 dark:border-gray-700 mb-6" />
					<div>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
							General filters
						</h2>
						{[
							"Verified",
							"Recommended",
							"Country",
							"Origin",
							"Destination",
							"Transit",
							"Aircraft 1",
						].map((label) => (
							<div className="mb-6" key={label}>
								<label className="block text-gray-700 dark:text-white mb-1">
									{label}
								</label>
								<select className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
									<option>Choose an option</option>
								</select>
							</div>
						))}
					</div>
				</div>
			</aside>
			{/* Main Content Wrapper */}
			<div
				style={{ marginLeft: open ? `${width}px` : "0" }}
				className={`${
					isResizing ? "" : "transition-all duration-300"
				} bg-white dark:bg-gray-900`}
			>
				{children}
			</div>
		</>
	);
}

export default function SidebarWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [width, setWidth] = useState(320);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<>
			{/* Sidebar Toggle Button*/}
			<button
				style={{ left: sidebarOpen ? `${width + 10}px` : "15px" }}
				className={`fixed top-4 z-50 text-gray-700 dark:text-white px-4 py-2 rounded-lg shadow bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300`}
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{sidebarOpen ? "<" : ">"}
			</button>
			{/* Sidebar */}
			<Sidebar
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				width={width}
				setWidth={setWidth}
			>
				{children}
			</Sidebar>
		</>
	);
}
