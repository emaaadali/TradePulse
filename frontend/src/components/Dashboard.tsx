"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useStockData } from "@/hooks/useStockData";
import type { StockSignal, SortOption, MoodFilter } from "@/lib/types";
import IntroScreen from "./IntroScreen";
import Header from "./Header";
import MarketMood from "./MarketMood";
import FilterBar from "./FilterBar";
import WatchlistTable from "./WatchlistTable";
import MiniChart from "./MiniChart";
import WatchlistEditor from "./WatchlistEditor";

export default function Dashboard() {
  const [showIntro, setShowIntro] = useState(true);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    // Check if user has visited before (skip intro on return visits within same session)
    const hasVisited = sessionStorage.getItem("tradepulse-visited");
    if (hasVisited) {
      setShowIntro(false);
    }
    setIntroReady(true);
  }, []);

  const handleEnterDashboard = useCallback(() => {
    setShowIntro(false);
    sessionStorage.setItem("tradepulse-visited", "1");
  }, []);
  const { tickers, addTicker, removeTicker, resetToDefaults } = useWatchlist();
  const { data, loading, error, lastRefresh, refresh } = useStockData(tickers);

  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("confidence");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("all");
  const [selectedStock, setSelectedStock] = useState<StockSignal | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filteredStocks = useMemo(() => {
    if (!data) return [];

    let stocks = [...data.stocks];

    // Mood filter
    if (moodFilter !== "all" && data.mood) {
      const moodTickers = {
        bullish: data.mood.strongest_bullish,
        reversal: data.mood.reversal_candidates,
        weakest: data.mood.weakest_stocks,
        volume: data.mood.high_volume_movers,
      }[moodFilter];
      if (moodTickers) {
        stocks = stocks.filter((s) => moodTickers.includes(s.ticker));
      }
    }

    // Sector filter
    if (sector !== "All") {
      stocks = stocks.filter((s) => s.sector === sector);
    }

    // Sort
    stocks.sort((a, b) => {
      switch (sortBy) {
        case "confidence":
          return b.confidence - a.confidence;
        case "change":
          return b.change_percent - a.change_percent;
        case "signal": {
          const order = { BUY: 0, HOLD: 1, SELL: 2 };
          return order[a.signal] - order[b.signal];
        }
        case "ticker":
          return a.ticker.localeCompare(b.ticker);
        default:
          return 0;
      }
    });

    return stocks;
  }, [data, sector, sortBy, moodFilter]);

  const handleStockClick = useCallback(
    (ticker: string) => {
      const stock = data?.stocks.find((s) => s.ticker === ticker);
      if (stock) setSelectedStock(stock);
    },
    [data]
  );

  if (!introReady) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {showIntro && <IntroScreen onEnter={handleEnterDashboard} />}
      <Header lastRefresh={lastRefresh} loading={loading} onRefresh={refresh} />

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Error state */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <p className="font-medium">Failed to fetch data</p>
            <p className="text-xs mt-1 text-red-400/70">{error}</p>
            <button
              onClick={refresh}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-900/50 border border-gray-800 animate-pulse" />
              ))}
            </div>
            <div className="h-8 w-64 bg-gray-900/50 rounded-md animate-pulse" />
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-14 border-b border-gray-800/50 bg-gray-900/30 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Dashboard content */}
        {data && (
          <>
            <MarketMood
              mood={data.mood}
              activeFilter={moodFilter}
              onFilterChange={setMoodFilter}
            />

            <FilterBar
              sector={sector}
              sortBy={sortBy}
              onSectorChange={setSector}
              onSortChange={setSortBy}
              onEditWatchlist={() => setShowEditor(true)}
              stockCount={filteredStocks.length}
            />

            <WatchlistTable
              stocks={filteredStocks}
              onStockClick={handleStockClick}
            />
          </>
        )}
      </main>

      {/* Mini chart modal */}
      {selectedStock && (
        <MiniChart
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}

      {/* Watchlist editor modal */}
      {showEditor && (
        <WatchlistEditor
          tickers={tickers}
          onAdd={addTicker}
          onRemove={removeTicker}
          onReset={resetToDefaults}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
