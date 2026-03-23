export interface StockSignal {
  ticker: string;
  price: number;
  change_percent: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasons: string[];
  sector: string;
  rsi: number;
  ma_short: number;
  ma_long: number;
  volume_ratio: number;
  near_support: boolean;
  near_resistance: boolean;
}

export interface MarketMood {
  strongest_bullish: string[];
  reversal_candidates: string[];
  weakest_stocks: string[];
  high_volume_movers: string[];
}

export interface DashboardResponse {
  stocks: StockSignal[];
  mood: MarketMood;
  last_updated: string;
}

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartResponse {
  ticker: string;
  data: ChartDataPoint[];
  ma_short: { time: string; value: number }[];
  ma_long: { time: string; value: number }[];
}

export type SortOption = "confidence" | "change" | "ticker" | "signal";
export type MoodFilter = "all" | "bullish" | "reversal" | "weakest" | "volume";
