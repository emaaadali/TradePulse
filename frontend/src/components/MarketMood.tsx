"use client";

import type { MarketMood as MarketMoodType, MoodFilter } from "@/lib/types";

interface MarketMoodProps {
  mood: MarketMoodType;
  activeFilter: MoodFilter;
  onFilterChange: (filter: MoodFilter) => void;
}

interface MoodCard {
  key: MoodFilter;
  title: string;
  tickers: string[];
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function MarketMood({ mood, activeFilter, onFilterChange }: MarketMoodProps) {
  const cards: MoodCard[] = [
    {
      key: "bullish",
      title: "Bullish Setups",
      tickers: mood.strongest_bullish,
      icon: "\u2191",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      key: "reversal",
      title: "Reversal Candidates",
      tickers: mood.reversal_candidates,
      icon: "\u21BB",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      key: "weakest",
      title: "Weakest Stocks",
      tickers: mood.weakest_stocks,
      icon: "\u2193",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      key: "volume",
      title: "High Volume",
      tickers: mood.high_volume_movers,
      icon: "\u26A1",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <button
          key={card.key}
          onClick={() => onFilterChange(activeFilter === card.key ? "all" : card.key)}
          className={`p-4 rounded-xl border transition-all duration-200 text-left ${
            activeFilter === card.key
              ? `${card.bgColor} ${card.borderColor} ring-1 ring-${card.borderColor}`
              : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-lg ${card.color}`}>{card.icon}</span>
            <span className={`text-2xl font-bold ${card.color}`}>
              {card.tickers.length}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400">{card.title}</p>
          {card.tickers.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tickers.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${card.bgColor} ${card.color} font-mono`}
                >
                  {t}
                </span>
              ))}
              {card.tickers.length > 5 && (
                <span className="text-[10px] text-gray-500">
                  +{card.tickers.length - 5}
                </span>
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
