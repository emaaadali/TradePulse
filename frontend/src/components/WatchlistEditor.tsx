"use client";

import { useState } from "react";
import { searchTickers } from "@/lib/api";

interface WatchlistEditorProps {
  tickers: string[];
  onAdd: (ticker: string) => void;
  onRemove: (ticker: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function WatchlistEditor({
  tickers,
  onAdd,
  onRemove,
  onReset,
  onClose,
}: WatchlistEditorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ ticker: string; sector: string }[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 1) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await searchTickers(q);
      setResults(res.filter((r) => !tickers.includes(r.ticker)));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border-t sm:border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Watchlist</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {tickers.length}/20 stocks
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search tickers..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            autoFocus
          />
          {results.length > 0 && (
            <div className="mt-2 space-y-1">
              {results.map((r) => (
                <button
                  key={r.ticker}
                  onClick={() => {
                    onAdd(r.ticker);
                    setResults(results.filter((x) => x.ticker !== r.ticker));
                  }}
                  disabled={tickers.length >= 20}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-800/50 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{r.ticker}</span>
                    <span className="text-[10px] text-gray-500">{r.sector}</span>
                  </div>
                  <span className="text-emerald-400 text-xs">+ Add</span>
                </button>
              ))}
            </div>
          )}
          {searching && (
            <p className="text-xs text-gray-500 mt-2">Searching...</p>
          )}
        </div>

        {/* Current tickers */}
        <div className="p-4 max-h-[300px] overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {tickers.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-800 text-sm font-mono text-gray-300 group"
              >
                {t}
                <button
                  onClick={() => onRemove(t)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-0.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-between">
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
