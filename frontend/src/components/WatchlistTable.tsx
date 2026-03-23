"use client";

import type { StockSignal } from "@/lib/types";
import StockRow from "./StockRow";

interface WatchlistTableProps {
  stocks: StockSignal[];
  onStockClick: (ticker: string) => void;
}

export default function WatchlistTable({ stocks, onStockClick }: WatchlistTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">No stocks match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 text-left">
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticker
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Change
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Signal
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confidence
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <StockRow
              key={stock.ticker}
              stock={stock}
              onClick={onStockClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
