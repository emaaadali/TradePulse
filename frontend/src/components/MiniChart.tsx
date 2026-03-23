"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries, LineSeries } from "lightweight-charts";
import { fetchChart } from "@/lib/api";
import { SOURCES } from "@/lib/constants";
import type { ChartResponse, StockSignal } from "@/lib/types";

interface MiniChartProps {
  stock: StockSignal;
  onClose: () => void;
}

export default function MiniChart({ stock, onClose }: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChart(stock.ticker)
      .then(setChartData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [stock.ticker]);

  useEffect(() => {
    if (!chartContainerRef.current || !chartData || chartData.data.length === 0) return;

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: container.clientWidth,
      height: 300,
      crosshair: {
        vertLine: { color: "#4b5563", width: 1, style: 2 },
        horzLine: { color: "#4b5563", width: 1, style: 2 },
      },
      timeScale: {
        borderColor: "#374151",
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#10b981",
      wickDownColor: "#ef4444",
      wickUpColor: "#10b981",
    });

    candlestickSeries.setData(
      chartData.data.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    // 20DMA line
    if (chartData.ma_short.length > 0) {
      const ma20Series = chart.addSeries(LineSeries, {
        color: "#3b82f6",
        lineWidth: 1,
        title: "20DMA",
      });
      ma20Series.setData(chartData.ma_short);
    }

    // 50DMA line
    if (chartData.ma_long.length > 0) {
      const ma50Series = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
        title: "50DMA",
      });
      ma50Series.setData(chartData.ma_long);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartData]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const signalColor =
    stock.signal === "BUY"
      ? "text-emerald-400"
      : stock.signal === "SELL"
      ? "text-red-400"
      : "text-amber-400";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-mono">
                {stock.ticker}
              </h2>
              <span className={`text-sm font-bold ${signalColor}`}>
                {stock.signal} ({stock.confidence}%)
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              ${stock.price.toFixed(2)}{" "}
              <span
                className={
                  stock.change_percent >= 0 ? "text-emerald-400" : "text-red-400"
                }
              >
                ({stock.change_percent > 0 ? "+" : ""}
                {stock.change_percent.toFixed(2)}%)
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chart */}
        <div className="p-4">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div ref={chartContainerRef} />
          )}
        </div>

        {/* Indicator details */}
        <div className="p-4 border-t border-gray-800">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-1">RSI (14)</p>
              <p
                className={`text-sm font-mono font-bold ${
                  stock.rsi < 30
                    ? "text-emerald-400"
                    : stock.rsi > 70
                    ? "text-red-400"
                    : "text-gray-300"
                }`}
              >
                {stock.rsi.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-1">20DMA</p>
              <p className="text-sm font-mono text-blue-400">${stock.ma_short.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-1">50DMA</p>
              <p className="text-sm font-mono text-amber-400">${stock.ma_long.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-1">Vol Ratio</p>
              <p
                className={`text-sm font-mono font-bold ${
                  stock.volume_ratio > 1.5 ? "text-purple-400" : "text-gray-300"
                }`}
              >
                {stock.volume_ratio.toFixed(1)}x
              </p>
            </div>
          </div>

          {/* Reasons */}
          <div>
            <p className="text-[10px] uppercase text-gray-500 mb-2">Signal Analysis</p>
            <div className="space-y-1">
              {stock.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 ${signalColor}`}>&bull;</span>
                  <p className="text-xs text-gray-300">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="mt-4 pt-4 border-t border-gray-800/60">
            <p className="text-[10px] uppercase text-gray-500 mb-2">Verify with Sources</p>
            <div className="grid grid-cols-2 gap-2">
              {SOURCES.map((source) => (
                <a
                  key={source.name}
                  href={source.getUrl(stock.ticker)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${source.color}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <div>
                    <span className="block">{source.name}</span>
                    <span className="block text-[10px] opacity-60 font-normal">{source.description}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
