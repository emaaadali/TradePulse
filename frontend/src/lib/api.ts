import { API_BASE } from "./constants";
import type { DashboardResponse, ChartResponse } from "./types";

export async function fetchDashboard(
  tickers: string[]
): Promise<DashboardResponse> {
  const params = tickers.length > 0 ? `?tickers=${tickers.join(",")}` : "";
  const res = await fetch(`${API_BASE}/api/dashboard${params}`);
  if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchChart(ticker: string): Promise<ChartResponse> {
  const res = await fetch(`${API_BASE}/api/chart/${ticker}`);
  if (!res.ok) throw new Error(`Chart fetch failed: ${res.status}`);
  return res.json();
}

export async function searchTickers(
  query: string
): Promise<{ ticker: string; sector: string }[]> {
  if (!query) return [];
  const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results;
}
