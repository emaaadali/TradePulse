"use client";

import type { StockSignal } from "@/lib/types";
import { SECTOR_COLORS } from "@/lib/constants";
import SignalBadge from "./SignalBadge";

interface StockCardProps {
  stock: StockSignal;
  onClick: (ticker: string) => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
  const changeColor =
    stock.change_percent > 0
      ? "text-emerald-400"
      : stock.change_percent < 0
      ? "text-red-400"
      : "text-gray-400";

  const sectorColor = SECTOR_COLORS[stock.sector] || SECTOR_COLORS["Other"];

  const confidenceColor =
    stock.signal === "BUY"
      ? "bg-emerald-500"
      : stock.signal === "SELL"
      ? "bg-red-500"
      : "bg-amber-500";

  return (
    <div
      onClick={() => onClick(stock.ticker)}
      className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/60 hover:border-gray-700 active:bg-gray-800/50 cursor-pointer transition-all"
    >
      {/* Top row: ticker + signal */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-base font-mono">
            {stock.ticker}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sectorColor}`}>
            {stock.sector}
          </span>
        </div>
        <SignalBadge signal={stock.signal} confidence={stock.confidence} />
      </div>

      {/* Middle row: price + change */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-lg font-mono text-gray-100 font-semibold">
          ${stock.price.toFixed(2)}
        </span>
        <span className={`text-sm font-mono font-medium ${changeColor}`}>
          {stock.change_percent > 0 ? "+" : ""}
          {stock.change_percent.toFixed(2)}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${confidenceColor}`}
            style={{ width: `${Math.min(stock.confidence, 100)}%` }}
          />
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
        {stock.reasons[0]}
      </p>
      {stock.reasons.length > 1 && (
        <p className="text-[10px] text-gray-600 mt-1">
          +{stock.reasons.length - 1} more
        </p>
      )}
    </div>
  );
}
