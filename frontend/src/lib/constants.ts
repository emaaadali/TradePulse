export const DEFAULT_TICKERS = [
  "AAPL", "MSFT", "NVDA", "GOOGL", "META",
  "JPM", "GS", "V",
  "JNJ", "UNH", "PFE",
  "AMZN", "TSLA", "NKE", "MCD",
  "XOM", "CVX",
  "CAT", "BA",
  "DIS",
];

export const SECTORS = [
  "All",
  "Technology",
  "Finance",
  "Healthcare",
  "Consumer",
  "Energy",
  "Industrial",
  "Communication",
];

export const SECTOR_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/20 text-blue-400",
  Finance: "bg-emerald-500/20 text-emerald-400",
  Healthcare: "bg-pink-500/20 text-pink-400",
  Consumer: "bg-amber-500/20 text-amber-400",
  Energy: "bg-orange-500/20 text-orange-400",
  Industrial: "bg-slate-500/20 text-slate-400",
  Communication: "bg-purple-500/20 text-purple-400",
  Other: "bg-gray-500/20 text-gray-400",
};

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const SOURCES = [
  {
    name: "Yahoo Finance",
    getUrl: (ticker: string) => `https://finance.yahoo.com/quote/${ticker}/`,
    description: "Price data, fundamentals, historical charts",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
  },
  {
    name: "TradingView",
    getUrl: (ticker: string) => `https://www.tradingview.com/symbols/${ticker}/`,
    description: "Technical analysis, interactive charting",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  },
  {
    name: "Finviz",
    getUrl: (ticker: string) => `https://finviz.com/quote.ashx?t=${ticker}`,
    description: "Screener, technical snapshot, news",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  {
    name: "MarketWatch",
    getUrl: (ticker: string) => `https://www.marketwatch.com/investing/stock/${ticker.toLowerCase()}`,
    description: "News, analyst ratings, financials",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
  },
];
