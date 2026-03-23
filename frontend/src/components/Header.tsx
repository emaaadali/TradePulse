"use client";

interface HeaderProps {
  lastRefresh: Date | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function Header({ lastRefresh, loading, onRefresh }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700" />
              <div className="absolute inset-[1.5px] rounded-[6px] bg-gray-950 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M3 16h5l3-8 4 16 3-12 2 4h9"
                    stroke="url(#hdr-pulse)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="hdr-pulse" x1="3" y1="16" x2="29" y2="16">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Trade<span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Pulse</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[10px] sm:text-xs text-gray-400">
              {loading ? "Scanning..." : "Live"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {lastRefresh && (
            <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">
              Last scan: {formatTime(lastRefresh)}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <svg
              className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
