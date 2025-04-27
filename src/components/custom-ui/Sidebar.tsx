"use client";

import React, { useState } from "react";

function Sidebar({
	open,
	onClose,
	children,
}: {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Overlay */}
			{/* <div
				className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
					open
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			/> */}
			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-[#23232b] z-50 shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="p-6">
					<div className="mb-6">
						<div className="flex flex-col items-start gap-4 mb-2">
							<span className="text-white text-sm font-bold bg-[#44444f] px-3 py-1 rounded-lg">
								dashboard
							</span>
							<span className="text-gray-400 text-sm px-3 py-1 rounded-lg">
								chatbot
							</span>
						</div>
					</div>
					<hr className="border-gray-600 mb-6" />
					<div>
						<h2 className="text-2xl font-bold text-white mb-6">
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
								<label className="block text-white mb-1">{label}</label>
								<select className="w-full bg-[#18181c] text-gray-400 px-4 py-3 rounded-lg focus:outline-none">
									<option>Choose an option</option>
								</select>
							</div>
						))}
					</div>
				</div>
			</aside>
			{/* Main Content Wrapper */}
			<div className={`transition-all duration-300 ${open ? "ml-80" : "ml-0"}`}>
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

	return (
		<>
			{/* Sidebar Toggle Button*/}
			<button
				className={`fixed top-4 left-4 z-50 text-white px-4 py-2 rounded-lg shadow bg-[#23232b] hover:bg-[#44444f] transition-all duration-300 ${
					sidebarOpen ? "left-84" : "left-4"
				}`}
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{sidebarOpen ? "<" : ">"}
			</button>
			{/* Sidebar */}
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
				{children}
			</Sidebar>
		</>
	);
}
