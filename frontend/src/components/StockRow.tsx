"use client";

import type { StockSignal } from "@/lib/types";
import { SECTOR_COLORS } from "@/lib/constants";
import SignalBadge from "./SignalBadge";
import ConfidenceBadge from "./ConfidenceBadge";

interface StockRowProps {
  stock: StockSignal;
  onClick: (ticker: string) => void;
}

export default function StockRow({ stock, onClick }: StockRowProps) {
  const changeColor =
    stock.change_percent > 0
      ? "text-emerald-400"
      : stock.change_percent < 0
      ? "text-red-400"
      : "text-gray-400";

  const sectorColor = SECTOR_COLORS[stock.sector] || SECTOR_COLORS["Other"];

  return (
    <tr
      onClick={() => onClick(stock.ticker)}
      className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors group"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm font-mono group-hover:text-emerald-400 transition-colors">
            {stock.ticker}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sectorColor}`}>
            {stock.sector}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-gray-200 font-mono">
          ${stock.price.toFixed(2)}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-sm font-mono font-medium ${changeColor}`}>
          {stock.change_percent > 0 ? "+" : ""}
          {stock.change_percent.toFixed(2)}%
        </span>
      </td>
      <td className="py-3 px-4">
        <SignalBadge signal={stock.signal} confidence={stock.confidence} />
      </td>
      <td className="py-3 px-4">
        <ConfidenceBadge confidence={stock.confidence} signal={stock.signal} />
      </td>
      <td className="py-3 px-4 max-w-[300px]">
        <p className="text-xs text-gray-400 truncate" title={stock.reasons.join(" | ")}>
          {stock.reasons[0]}
        </p>
        {stock.reasons.length > 1 && (
          <p className="text-[10px] text-gray-600 mt-0.5">
            +{stock.reasons.length - 1} more signal{stock.reasons.length > 2 ? "s" : ""}
          </p>
        )}
      </td>
      <td className="py-3 px-2">
        <a
          href={`https://finance.yahoo.com/quote/${stock.ticker}/`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-md text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors opacity-0 group-hover:opacity-100"
          title={`View ${stock.ticker} on Yahoo Finance`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </td>
    </tr>
  );
}
