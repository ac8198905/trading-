import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR, formatPercent, formatChange } from "../utils/formatters";
import OrderForm from "./OrderForm";

export default function TradingPanel({ initialAction = "BUY" }) {
  const { selectedStock } = useTrading();


  const isPositive = selectedStock.change >= 0;

  // Realistic mock market depth (bid / ask book)
  const bids = [
    { price: +(selectedStock.price - 0.15).toFixed(2), orders: 12, qty: 1540 },
    { price: +(selectedStock.price - 0.30).toFixed(2), orders: 8, qty: 2410 },
    { price: +(selectedStock.price - 0.45).toFixed(2), orders: 19, qty: 4120 },
  ];
  const asks = [
    { price: +(selectedStock.price + 0.15).toFixed(2), orders: 14, qty: 1820 },
    { price: +(selectedStock.price + 0.30).toFixed(2), orders: 21, qty: 3200 },
    { price: +(selectedStock.price + 0.45).toFixed(2), orders: 9, qty: 1450 },
  ];

  return (
    <div className="bg-[#151A21] border border-[#242D38] rounded-xl p-4 flex flex-col h-full shadow-sm">
      {/* Stock Mini Header */}
      <div className="pb-3 border-b border-[#242D38]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                {selectedStock.symbol}
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                NSE Cash
              </span>
            </div>
            <div className="text-xs text-gray-400 truncate max-w-[190px]">
              {selectedStock.name}
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-white tabular-nums tracking-tight">
              {formatINR(selectedStock.price)}
            </div>
            <div
              className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>
                {formatChange(selectedStock.change)} ({formatPercent(selectedStock.changePercent)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Order Form */}
      <div className="py-3">
        <OrderForm initialAction={initialAction} />
      </div>

      {/* Mini Level 2 Market Depth / Order Book */}
      <div className="mt-auto pt-3 border-t border-[#242D38] text-[11px]">
        <div className="flex items-center justify-between text-gray-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-400" />
            Market Depth (Top 3)
          </span>
          <span className="text-[10px] text-gray-500">Live L2 Book</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Bid Side */}
          <div className="bg-[#111827] rounded-lg p-2 border border-emerald-500/10 space-y-1">
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold border-b border-[#242D38]/50 pb-0.5">
              <span>Bid Price</span>
              <span>Qty</span>
            </div>
            {bids.map((b, i) => (
              <div key={i} className="flex justify-between tabular-nums text-emerald-400 text-[10px]">
                <span>{b.price.toFixed(2)}</span>
                <span className="text-gray-300">{b.qty}</span>
              </div>
            ))}
          </div>

          {/* Ask Side */}
          <div className="bg-[#111827] rounded-lg p-2 border border-rose-500/10 space-y-1">
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold border-b border-[#242D38]/50 pb-0.5">
              <span>Ask Price</span>
              <span>Qty</span>
            </div>
            {asks.map((a, i) => (
              <div key={i} className="flex justify-between tabular-nums text-rose-400 text-[10px]">
                <span>{a.price.toFixed(2)}</span>
                <span className="text-gray-300">{a.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
