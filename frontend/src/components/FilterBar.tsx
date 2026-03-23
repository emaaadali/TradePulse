"use client";

import { SECTORS } from "@/lib/constants";
import type { SortOption } from "@/lib/types";

interface FilterBarProps {
  sector: string;
  sortBy: SortOption;
  onSectorChange: (sector: string) => void;
  onSortChange: (sort: SortOption) => void;
  onEditWatchlist: () => void;
  stockCount: number;
}

export default function FilterBar({
  sector,
  sortBy,
  onSectorChange,
  onSortChange,
  onEditWatchlist,
  stockCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <select
          value={sector}
          onChange={(e) => onSectorChange(e.target.value)}
          className="px-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-md text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Sectors" : s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-md text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        >
          <option value="confidence">Sort: Confidence</option>
          <option value="change">Sort: % Change</option>
          <option value="signal">Sort: Signal</option>
          <option value="ticker">Sort: Ticker</option>
        </select>

        <span className="text-xs text-gray-500">
          {stockCount} stocks
        </span>
      </div>

      <button
        onClick={onEditWatchlist}
        className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Watchlist
      </button>
    </div>
  );
}
