"use client";

interface SignalBadgeProps {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
}

const signalStyles = {
  BUY: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  SELL: "bg-red-500/15 text-red-400 ring-red-500/30",
  HOLD: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
};

export default function SignalBadge({ signal, confidence }: SignalBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ring-1 ${signalStyles[signal]}`}
    >
      {signal}
      <span className="text-[10px] font-normal opacity-75">
        {confidence}%
      </span>
    </span>
  );
}
