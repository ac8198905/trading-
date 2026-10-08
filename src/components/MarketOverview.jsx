import { TrendingUp, TrendingDown, Activity } from "lucide-react";

import { useTrading } from "../context/TradingContext";
import { formatNumber, formatPercent, formatChange } from "../utils/formatters";

export default function MarketOverview() {
  const { marketIndices } = useTrading();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Market Overview
          </h2>
        </div>
        <span className="text-xs text-gray-400 font-medium">Real-time Spot Indices</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {marketIndices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div
              key={index.id}
              className="bg-[#151A21] hover:bg-[#1B222C] border border-[#242D38] rounded-xl p-3.5 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400 tracking-wide">
                  {index.name}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    isPositive
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {formatPercent(index.changePercent)}
                </span>
              </div>

              <div className="text-lg font-bold text-white tracking-tight tabular-nums">
                {formatNumber(index.value)}
              </div>

              <div
                className={`text-xs font-medium tabular-nums flex items-center gap-1 mt-0.5 ${
                  isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                <span>{formatChange(index.change)}</span>
                <span className="text-gray-500 text-[10px]">pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
