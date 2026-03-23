"use client";

interface ConfidenceBadgeProps {
  confidence: number;
  signal: "BUY" | "SELL" | "HOLD";
}

export default function ConfidenceBadge({ confidence, signal }: ConfidenceBadgeProps) {
  const getColor = () => {
    if (signal === "HOLD") return "bg-amber-500";
    if (signal === "BUY") return "bg-emerald-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(confidence, 100)}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right font-mono">
        {confidence}%
      </span>
    </div>
  );
}
