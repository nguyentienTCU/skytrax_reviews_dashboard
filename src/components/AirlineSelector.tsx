// components/AirlineSelectorClient.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AirlineIndex } from "@/lib/data";

export default function AirlineSelector({
  airlines,
  currentSlug,
}: {
  airlines: AirlineIndex[];
  currentSlug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const fmt = useMemo(() => new Intl.NumberFormat(), []);
  const sorted = useMemo(() => [...airlines].sort((a, b) => b.count - a.count), [airlines]);
  const top = useMemo(() => sorted.slice(0, 6), [sorted]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return sorted;
    return sorted.filter(
      (a) => a.airline.toLowerCase().includes(s) || a.slug.toLowerCase().includes(s)
    );
  }, [q, sorted]);

  const pushSlug = (slug: string) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("airline", slug);
    router.push(`/?${sp.toString()}`, { scroll: false });
  };

  const onPick = (slug: string, fromPill = false) => {
    if (fromPill) setQ("");
    pushSlug(slug);
    setOpen(false);
  };

  useEffect(() => setOpen(false), [currentSlug]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!listRef.current) return;
      const target = e.target as Node;
      if (!listRef.current.parentElement?.contains(target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const copyLink = async () => {
    const sp = new URLSearchParams(searchParams?.toString());
    if (currentSlug) sp.set("airline", currentSlug);
    try {
      await navigator.clipboard.writeText(`${location.origin}/?${sp.toString()}`);
    } catch {}
  };

  return (
    <div className="card bg-white dark:bg-gray-800 p-6 rounded-2xl mb-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Choose Airline</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fmt.format(airlines.length)} available
          </p>
        </div>
        <button
          onClick={copyLink}
          type="button"
          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          title="Copy link to this airline"
        >
          Copy link
        </button>
      </div>

      {/* Top airlines as quick-select pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {top.map((a) => {
          const selected = currentSlug === a.slug;
          return (
            <button
              key={a.slug}
              onClick={() => onPick(a.slug, true)}
              type="button"
              className={[
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition border",
                selected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
              ].join(" ")}
              aria-pressed={selected}
            >
              <span className="truncate max-w-[12rem]">{a.airline}</span>
              <span
                className={[
                  "text-[10px] px-2 py-0.5 rounded-full",
                  selected
                    ? "bg-indigo-500/40 text-white"
                    : "bg-white dark:bg-black/20 text-gray-700 dark:text-gray-200",
                ].join(" ")}
              >
                {fmt.format(a.count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search input + styled results (acts like a custom select with better colors) */}
      <div className="relative">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search airline (name or slug)…"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          aria-controls="airline-results"
          aria-expanded={open}
          aria-haspopup="listbox"
        />
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        {open && (
          <ul
            id="airline-results"
            ref={listRef}
            role="listbox"
            className="absolute z-10 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
          >
            {filtered.length ? (
              filtered.slice(0, 80).map((a) => {
                const selected = currentSlug === a.slug;
                return (
                  <li key={a.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => onPick(a.slug)}
                      className={[
                        "w-full text-left px-3 py-2.5 flex items-center justify-between transition",
                        // Normal state
                        "text-gray-800 dark:text-gray-100",
                        // Hover state — more obvious with brand tint
                        "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
                        // Selected state — solid brand with white text
                        selected
                          ? "bg-indigo-600 text-white"
                          : "bg-white dark:bg-gray-900",
                        // Focus ring for keyboard users
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
                      ].join(" ")}
                    >
                      <span className="truncate">{a.airline}</span>
                      <span
                        className={[
                          "text-xs px-2 py-0.5 rounded",
                          selected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                        ].join(" ")}
                      >
                        {fmt.format(a.count)}
                      </span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No results</li>
            )}
          </ul>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-300">
        Showing data for{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {currentSlug?.replace(/-/g, " ")}
        </span>
        . Search or use quick-select pills to change all charts.
      </div>
    </div>
  );
}
