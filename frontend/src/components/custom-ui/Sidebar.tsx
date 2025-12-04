"use client";

import React, { useState, useRef, useEffect } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "data-summary", label: "Data summary" },
  { id: "monthly-metrics", label: "Monthly metrics" },
  { id: "time-analysis", label: "Time analysis" },
  { id: "aircraft-analysis", label: "Aircraft analysis" },
  { id: "route-analysis", label: "Route analysis" },
  { id: "customer-analysis", label: "Customer analysis" },
  { id: "review-text-analysis", label: "Review text" },
] as const;

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 250 && newWidth <= 600) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setWidth]);

  // scrollspy logic
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActiveId(entry.target.id));
      },
      { root: null, threshold: 0.45 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSectionClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width: `${width}px` }}
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white z-50 shadow-lg transform ${
          isResizing ? "" : "transition-transform duration-300"
        } ${open ? "translate-x-0" : "-translate-x-full"}
        scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
        scrollbar-track-gray-100 dark:scrollbar-track-gray-700
        hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500`}
      >
        {/* Resize handle */}
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${
            isResizing ? "bg-gray-300 dark:bg-gray-600" : ""
          }`}
          onMouseDown={handleMouseDown}
        />

        <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">

          {/* FLIGHTLY */}
          <div className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            FLIGHTLY
          </div>

          {/* Outline */}
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-1">
              Outline
            </div>

            <nav className="mt-3 flex flex-col gap-2 border-l border-gray-200 dark:border-gray-700 pl-3">
              {SECTIONS.map((section) => {
                const isActive = section.id === activeId;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleSectionClick(section.id)}
                    className={[
                      "group relative flex items-center gap-2 py-1 text-left transition-all",
                      isActive
                        ? "translate-x-0.5 text-gray-900 dark:text-gray-50 text-[17px] font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-[15px]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "block transition-all",
                        isActive
                          ? "h-5 w-[3px] rounded-full bg-blue-500"
                          : "h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-700 dark:group-hover:bg-gray-300",
                      ].join(" ")}
                    />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      <div
        style={{ marginLeft: open ? `${width}px` : "0" }}
        className={`${isResizing ? "" : "transition-all duration-300"} bg-white dark:bg-gray-900`}
      >
        {children}
      </div>
    </>
  );
}

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [width, setWidth] = useState(320);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <button
        style={{ left: sidebarOpen ? `${width + 10}px` : "15px" }}
        className={`fixed top-4 z-50 text-gray-700 dark:text-white px-4 py-2 rounded-lg shadow bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "<" : ">"}
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} width={width} setWidth={setWidth}>
        {children}
      </Sidebar>
    </>
  );
}
