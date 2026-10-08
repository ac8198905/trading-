import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR, formatPercent, formatChange, formatNumber } from "../utils/formatters";

const TIMEFRAMES = ["1D", "1W", "1M", "3M", "1Y"];

export default function StockChart() {
  const { selectedStock, historyCache, openOrderWindow } = useTrading();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");



  const stockHistory = historyCache[selectedStock.symbol] || {};
  const data = stockHistory[selectedTimeframe] || [];

  const isPositive = selectedStock.change >= 0;
  const strokeColor = isPositive ? "#22C55E" : "#EF4444";
  const gradientId = `chartGrad_${selectedStock.symbol}`;

  // Calculate dynamic min/max for YAxis domain with breathing room
  const prices = data.map((d) => d.price);
  const minPrice = prices.length ? Math.min(...prices) : selectedStock.dayLow;
  const maxPrice = prices.length ? Math.max(...prices) : selectedStock.dayHigh;
  const padding = (maxPrice - minPrice) * 0.1 || selectedStock.price * 0.01;
  const domainMin = Math.max(0, +(minPrice - padding).toFixed(2));
  const domainMax = +(maxPrice + padding).toFixed(2);

  return (
    <div className="bg-[#151A21] border border-[#242D38] rounded-xl p-4 flex flex-col h-full shadow-sm">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#242D38]">
        {/* Stock details */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {selectedStock.symbol}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-[#1B222C] text-gray-400 border border-[#242D38]">
              {selectedStock.sector}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{selectedStock.name}</p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              {formatINR(selectedStock.price)}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums px-2 py-0.5 rounded ${
                isPositive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {formatChange(selectedStock.change)} ({formatPercent(selectedStock.changePercent)})
            </span>

            {/* Kite Style Instant Buy / Sell Header Buttons */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#242D38]">
              <button
                type="button"
                onClick={() => openOrderWindow(selectedStock, "BUY")}
                className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-xs"
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => openOrderWindow(selectedStock, "SELL")}
                className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-xs"
              >
                Sell
              </button>
            </div>
          </div>
        </div>

        {/* Timeframe Selectors & Quick Stats */}
        <div className="flex flex-col sm:items-end gap-2">
          {/* Timeframe pill buttons */}
          <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-[#242D38] self-start sm:self-auto">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedTimeframe === tf
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-400 hover:text-white hover:bg-[#1B222C]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Key Day Statistics */}
          <div className="grid grid-cols-4 gap-2 text-right text-[11px] bg-[#111827]/60 px-3 py-1.5 rounded-lg border border-[#242D38]/60">
            <div>
              <span className="text-gray-500 block">Open</span>
              <span className="font-semibold text-gray-200 tabular-nums">
                {formatINR(selectedStock.open, false)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">High</span>
              <span className="font-semibold text-emerald-400 tabular-nums">
                {formatINR(selectedStock.dayHigh, false)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Low</span>
              <span className="font-semibold text-rose-400 tabular-nums">
                {formatINR(selectedStock.dayLow, false)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Volume</span>
              <span className="font-semibold text-gray-200 tabular-nums">
                {formatNumber(selectedStock.volume)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80 md:h-[340px] pt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#242D38" strokeDasharray="3 3" vertical={false} opacity={0.6} />

            <XAxis
              dataKey="time"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#242D38" }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[domainMin, domainMax]}
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
              orientation="right"
              width={70}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  const vol = payload[0].payload.volume;
                  return (
                    <div className="bg-[#111827] border border-[#242D38] p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <div className="text-gray-400 font-medium">{label}</div>
                      <div className="text-sm font-bold text-white tabular-nums">
                        {formatINR(val)}
                      </div>
                      {vol && (
                        <div className="text-[10px] text-gray-400">
                          Vol: <span className="text-gray-200">{formatNumber(vol)}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
