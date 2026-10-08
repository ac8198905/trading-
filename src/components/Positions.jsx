import {

  Layers,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR, formatPercent } from "../utils/formatters";


export default function Positions() {
  const { positions, selectStock, stocks, openOrderWindow } = useTrading();

  const handleAction = (symbol, action) => {
    selectStock(symbol);
    const target = stocks.find((s) => s.symbol === symbol) || symbol;
    openOrderWindow(target, action);
  };


  return (
    <div className="bg-[#151A21] border border-[#242D38] rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#242D38] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Open Positions & Holdings
          </h2>
          <span className="text-xs bg-[#1B222C] text-gray-400 px-2 py-0.5 rounded-full border border-[#242D38]">
            {positions.length}
          </span>
        </div>
        <span className="text-xs text-gray-400">Live mark-to-market updates</span>
      </div>

      {/* Positions Table (Responsive) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#111827] text-gray-400 font-semibold uppercase tracking-wider border-b border-[#242D38]">
            <tr>
              <th className="py-3 px-4">Instrument</th>
              <th className="py-3 px-3 text-right">Product</th>
              <th className="py-3 px-3 text-right">Qty</th>
              <th className="py-3 px-3 text-right">Avg. Price</th>
              <th className="py-3 px-3 text-right">LTP</th>
              <th className="py-3 px-3 text-right">Invested</th>
              <th className="py-3 px-3 text-right">Current Value</th>
              <th className="py-3 px-4 text-right">P&L</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242D38]/60 text-gray-300">
            {positions.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  No open positions found. Go to Trading to place an order.
                </td>
              </tr>
            ) : (
              positions.map((pos) => {
                const isProfitable = pos.pnl >= 0;

                return (
                  <tr
                    key={pos.id || pos.symbol}
                    className="hover:bg-[#1B222C]/70 transition-colors cursor-pointer group"
                    onClick={() => handleAction(pos.symbol, "BUY")}
                  >
                    {/* Instrument */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                        {pos.symbol}
                        <span className="text-[10px] text-gray-500 font-normal">NSE</span>
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                        {pos.companyName || pos.symbol}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#111827] border border-[#242D38] text-gray-300 font-medium">
                        {pos.product || "Delivery"}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 text-right font-semibold text-white tabular-nums">
                      {pos.qty}
                    </td>

                    {/* Average Buy Price */}
                    <td className="py-3.5 px-3 text-right tabular-nums text-gray-300">
                      {formatINR(pos.avgPrice)}
                    </td>

                    {/* LTP (Last Traded Price) */}
                    <td className="py-3.5 px-3 text-right font-bold tabular-nums text-white">
                      {formatINR(pos.currentPrice)}
                    </td>

                    {/* Invested */}
                    <td className="py-3.5 px-3 text-right tabular-nums text-gray-400">
                      {formatINR(pos.invested)}
                    </td>

                    {/* Current Value */}
                    <td className="py-3.5 px-3 text-right font-semibold tabular-nums text-white">
                      {formatINR(pos.currentValue)}
                    </td>

                    {/* P&L */}
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className={`font-bold tabular-nums flex items-center justify-end gap-1 ${
                          isProfitable ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isProfitable ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>{formatINR(pos.pnl)}</span>
                      </div>
                      <div
                        className={`text-[11px] font-semibold tabular-nums ${
                          isProfitable ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {formatPercent(pos.pnlPercent)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleAction(pos.symbol, "BUY")}
                          className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-[11px] font-semibold transition-colors"
                          title="Add more shares"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(pos.symbol, "SELL")}
                          className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-[11px] font-semibold transition-colors"
                          title="Square off / Exit position"
                        >
                          Exit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
