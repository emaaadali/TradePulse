"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchDashboard } from "@/lib/api";
import { REFRESH_INTERVAL } from "@/lib/constants";
import type { DashboardResponse } from "@/lib/types";

export function useStockData(tickers: string[]) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchDashboard(tickers);
      setData(result);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [tickers]);

  useEffect(() => {
    setLoading(true);
    refresh();

    // Set up polling
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return { data, loading, error, lastRefresh, refresh };
}
