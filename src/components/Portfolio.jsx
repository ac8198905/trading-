import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Briefcase,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR, formatPercent, formatChange } from "../utils/formatters";

const ALLOCATION_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
];

export default function Portfolio() {

  const { portfolioSummary, positions } = useTrading();
  const {
    totalInvested,
    totalCurrentValue,
    totalPnl,
    totalPnlPercent,
    todayPnl,
    balance,
    netWorth,
  } = portfolioSummary;

  const isTotalProfitable = totalPnl >= 0;
  const isTodayProfitable = todayPnl >= 0;

  // Chart data for stock allocation
  const allocationData = positions.map((p) => ({
    name: p.symbol,
    value: p.currentValue,
  }));

  // If no positions, display cash balance as 100%
  const chartData =
    allocationData.length > 0
      ? allocationData
      : [{ name: "Available Cash", value: balance }];

  return (
    <div className="bg-[#151A21] border border-[#242D38] rounded-xl p-4 flex flex-col h-full shadow-sm">
      {/* Portfolio Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#242D38]">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Portfolio Summary
          </h2>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Net Worth: <span className="text-white font-bold">{formatINR(netWorth)}</span>
        </span>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        {/* Current Portfolio Value */}
        <div className="bg-[#111827] border border-[#242D38] rounded-xl p-3">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Current Value
          </span>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {formatINR(totalCurrentValue)}
          </div>
          <span className="text-[10px] text-gray-500">Holdings market price</span>
        </div>

        {/* Invested Capital */}
        <div className="bg-[#111827] border border-[#242D38] rounded-xl p-3">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Total Invested
          </span>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {formatINR(totalInvested)}
          </div>
          <span className="text-[10px] text-gray-500">Capital deployed</span>
        </div>

        {/* Total Overall P&L */}
        <div className="bg-[#111827] border border-[#242D38] rounded-xl p-3 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Total Profit / Loss
          </span>
          <div
            className={`text-lg sm:text-xl font-bold tabular-nums flex items-center gap-1 ${
              isTotalProfitable ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isTotalProfitable ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {formatINR(totalPnl)}
          </div>
          <span
            className={`text-[11px] font-semibold tabular-nums ${
              isTotalProfitable ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatPercent(totalPnlPercent)}
          </span>
        </div>

        {/* Today's Day P&L */}
        <div className="bg-[#111827] border border-[#242D38] rounded-xl p-3">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Today's P&L
          </span>
          <div
            className={`text-base sm:text-lg font-bold tabular-nums ${
              isTodayProfitable ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatChange(todayPnl)}
          </div>
          <span className="text-[10px] text-gray-500">Intraday gain/loss</span>
        </div>

        {/* Available Cash / Balance */}
        <div className="bg-[#111827] border border-[#242D38] rounded-xl p-3 col-span-1 sm:col-span-2">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Available Margin
          </span>
          <div className="text-base sm:text-lg font-bold text-white tabular-nums">
            {formatINR(balance)}
          </div>
          <span className="text-[10px] text-emerald-400">Ready for instant deployment</span>
        </div>
      </div>

      {/* Allocation Chart & Breakdown */}
      <div className="mt-auto pt-3 border-t border-[#242D38]">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-2">
          <span className="flex items-center gap-1.5">
            <PieIcon className="w-3.5 h-3.5 text-blue-400" />
            Portfolio Asset Allocation
          </span>
          <span className="text-[11px] text-gray-500">{positions.length} Positions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* Donut Chart */}
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]}
                      stroke="#151A21"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => formatINR(val)}
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#242D38",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400 uppercase font-medium">Assets</span>
              <span className="text-xs font-bold text-white">{positions.length || "Cash"}</span>
            </div>
          </div>

          {/* Allocation Legend List */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs pr-1">
            {chartData.map((item, idx) => {
              const totalVal = totalCurrentValue || balance;
              const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(1) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length],
                      }}
                    />
                    <span className="text-gray-300 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0 font-medium tabular-nums text-gray-400">
                    <span className="text-white mr-1.5">{pct}%</span>
                    <span>({formatINR(item.value, false)})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
