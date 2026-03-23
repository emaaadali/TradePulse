"use client";

import { useState, useEffect } from "react";

interface IntroScreenProps {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [phase, setPhase] = useState(0); // 0=logo, 1=tagline, 2=features, 3=button
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center transition-all duration-600 ${
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            {/* New pulse/heartbeat logo */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20" />
              <div className="absolute inset-[2px] rounded-2xl bg-gray-950 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  {/* Heartbeat/pulse line */}
                  <path
                    d="M3 16h5l3-8 4 16 3-12 2 4h9"
                    stroke="url(#pulse-gradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[draw_1.5s_ease-out_0.3s_both]"
                  />
                  <defs>
                    <linearGradient id="pulse-gradient" x1="3" y1="16" x2="29" y2="16">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 blur-sm -z-10" />
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Trade<span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Pulse</span>
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-lg text-gray-400 text-center max-w-md mb-10">
            Real-time signal scanner that reads the market so you don&apos;t have to.
          </p>
        </div>

        {/* Feature pills */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-lg">
            {[
              { label: "MA Crossovers", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { label: "RSI Analysis", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
              { label: "Volume Spikes", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { label: "Support & Resistance", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { label: "Confidence Scoring", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
              { label: "20-Stock Watchlist", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
            ].map((feat, i) => (
              <span
                key={feat.label}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${feat.color}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {feat.label}
              </span>
            ))}
          </div>
        </div>

        {/* Enter button */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <button
            onClick={handleEnter}
            className="group relative px-8 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Launch Dashboard
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <p className="text-center text-[11px] text-gray-600 mt-4">
            Scanning 20 stocks &middot; Refreshes every 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
