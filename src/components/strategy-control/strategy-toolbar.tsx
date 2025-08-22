"use client";

import PlayButtons from "@/components/play-buttons";
import { Separator } from "@/components/ui/separator";
import { useTrading } from "@/context/TradingContext";

export default function StrategyToolbar() {
  const { currentStrategy } = useTrading();
  const title =
    currentStrategy === "ema"
      ? "EMA Crossover Strategy"
      : currentStrategy === "supertrend"
      ? "Supertrend Strategy"
      : "SPX 0DTE Strategy";

  return (
    <div className="w-full border rounded-lg p-3 px-5 mb-4 bg-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-black font-bold">{title}</span>
          <Separator orientation="vertical" className="h-6" />
        </div>
        <PlayButtons />
      </div>
    </div>
  );
}



