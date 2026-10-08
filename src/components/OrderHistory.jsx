import { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  XCircle,
  CheckCircle,
  Clock,
  Ban,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR } from "../utils/formatters";

export default function OrderHistory() {
  const { orders, cancelOrder } = useTrading();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sideFilter, setSideFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      if (sideFilter !== "ALL" && o.type !== sideFilter) return false;
      if (
        search.trim() &&
        !o.symbol.toLowerCase().includes(search.toLowerCase()) &&
        !o.id.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [orders, statusFilter, sideFilter, search]);


  return (
    <div className="bg-[#151A21] border border-[#242D38] rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Top Controls Header */}
      <div className="p-4 border-b border-[#242D38] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Order Book & History
          </h2>
          <span className="text-xs bg-[#1B222C] text-gray-400 px-2 py-0.5 rounded-full border border-[#242D38]">
            {filteredOrders.length}
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-[#111827] p-1 rounded-lg border border-[#242D38]">
            {["ALL", "Executed", "Pending", "Cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Buy/Sell Filter */}
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="bg-[#111827] border border-[#242D38] text-gray-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Sides</option>
            <option value="BUY">BUY Only</option>
            <option value="SELL">SELL Only</option>
          </select>

          {/* Order Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search symbol/ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-[#111827] border border-[#242D38] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#111827] text-gray-400 font-semibold uppercase tracking-wider border-b border-[#242D38]">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-3">Side</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3 text-right">Quantity</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Value</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242D38]/60 text-gray-300">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-8 text-center text-gray-500">
                  No orders found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isBuy = order.type === "BUY";
                const totalValue = +(order.quantity * order.price).toFixed(2);

                return (
                  <tr key={order.id} className="hover:bg-[#1B222C]/70 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">
                      {order.id}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-3 text-gray-400 text-[11px]">
                      {order.timestamp}
                    </td>

                    {/* Symbol */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-sm tracking-tight">
                        {order.symbol}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-1.5 uppercase">
                        {order.product || "CNC"}
                      </span>
                    </td>

                    {/* Side (Buy / Sell) */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded ${
                          isBuy
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {isBuy ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        {order.type}
                      </span>
                    </td>

                    {/* Order Type */}
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#111827] text-gray-400 border border-[#242D38] text-[10px] font-medium">
                        {order.orderType}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 text-right font-semibold text-white tabular-nums">
                      {order.quantity}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-medium text-white tabular-nums">
                      {formatINR(order.price)}
                    </td>

                    {/* Value */}
                    <td className="py-3 px-4 text-right font-bold text-gray-200 tabular-nums">
                      {formatINR(totalValue)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {order.status === "Executed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          Executed
                        </span>
                      )}
                      {order.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {order.status === "Cancelled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 bg-[#111827] px-2 py-0.5 rounded-full border border-[#242D38]">
                          <Ban className="w-3 h-3 text-rose-400" />
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* Action (Cancel Pending) */}
                    <td className="py-3 px-4 text-center">
                      {order.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => cancelOrder(order.id)}
                          className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                        >
                          <XCircle className="w-3 h-3" />
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-600 text-[11px]">-</span>
                      )}
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
