"use client";

import { useMemo } from "react";
import type { StockSignal } from "@/lib/types";
import StockRow from "./StockRow";
import StockCard from "./StockCard";

interface WatchlistTableProps {
  stocks: StockSignal[];
  onStockClick: (ticker: string) => void;
}

interface StockGroup {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  stocks: StockSignal[];
}

export default function WatchlistTable({ stocks, onStockClick }: WatchlistTableProps) {
  const groups = useMemo((): StockGroup[] => {
    const buys = stocks.filter((s) => s.signal === "BUY");
    const holds = stocks.filter((s) => s.signal === "HOLD");
    const sells = stocks.filter((s) => s.signal === "SELL");

    const result: StockGroup[] = [];

    if (buys.length > 0) {
      result.push({
        label: `Buy Signals`,
        icon: "\u2191",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        stocks: buys.sort((a, b) => b.confidence - a.confidence),
      });
    }
    if (sells.length > 0) {
      result.push({
        label: `Sell Signals`,
        icon: "\u2193",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        stocks: sells.sort((a, b) => b.confidence - a.confidence),
      });
    }
    if (holds.length > 0) {
      result.push({
        label: `Hold`,
        icon: "\u2014",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        stocks: holds.sort((a, b) => b.confidence - a.confidence),
      });
    }

    return result;
  }, [stocks]);

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">No stocks match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          {/* Section header */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm ${group.color}`}>{group.icon}</span>
            <h3 className={`text-sm font-semibold ${group.color}`}>
              {group.label}
            </h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${group.bgColor} ${group.color}`}>
              {group.stocks.length}
            </span>
            <div className="flex-1 h-px bg-gray-800/60 ml-2" />
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {group.stocks.map((stock) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                onClick={onStockClick}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="py-2.5 px-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                  <th className="py-2.5 px-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="py-2.5 px-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="py-2.5 px-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Signal</th>
                  <th className="py-2.5 px-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="py-2.5 px-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="py-2.5 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {group.stocks.map((stock) => (
                  <StockRow
                    key={stock.ticker}
                    stock={stock}
                    onClick={onStockClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
