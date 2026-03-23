"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_TICKERS } from "@/lib/constants";

const STORAGE_KEY = "tradepulse-watchlist";

export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>(DEFAULT_TICKERS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTickers(parsed);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const updateTickers = useCallback((newTickers: string[]) => {
    setTickers(newTickers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTickers));
  }, []);

  const addTicker = useCallback(
    (ticker: string) => {
      if (tickers.includes(ticker) || tickers.length >= 20) return;
      updateTickers([...tickers, ticker]);
    },
    [tickers, updateTickers]
  );

  const removeTicker = useCallback(
    (ticker: string) => {
      updateTickers(tickers.filter((t) => t !== ticker));
    },
    [tickers, updateTickers]
  );

  const resetToDefaults = useCallback(() => {
    updateTickers(DEFAULT_TICKERS);
  }, [updateTickers]);

  return { tickers, addTicker, removeTicker, resetToDefaults, updateTickers };
}
