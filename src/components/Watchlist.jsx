import { useState, useMemo } from "react";
import {
  Star,
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR, formatPercent, formatChange } from "../utils/formatters";

export default function Watchlist() {
  const {
    stocks,
    watchlist,
    toggleWatchlist,
    selectedStockSymbol,
    selectStock,
    priceFlashing,
    openOrderWindow,
  } = useTrading();

  const [filterType, setFilterType] = useState("all"); // "all", "watchlist", "gainers", "losers"
  const [sortBy, setSortBy] = useState("symbol"); // "symbol", "price", "change"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc", "desc"
  const [localSearch, setLocalSearch] = useState("");

  const handleStockClick = (symbol) => {
    selectStock(symbol);
  };

  const handleTradeAction = (e, stock, action) => {
    e.stopPropagation();
    selectStock(stock.symbol);
    openOrderWindow(stock, action);
  };


  const filteredAndSortedStocks = useMemo(() => {
    return stocks
      .filter((stock) => {
        // Search match
        const matchesSearch =
          stock.symbol.toLowerCase().includes(localSearch.toLowerCase()) ||
          stock.name.toLowerCase().includes(localSearch.toLowerCase());
        if (!matchesSearch) return false;

        // Filter type
        if (filterType === "watchlist") return watchlist.includes(stock.symbol);
        if (filterType === "gainers") return stock.change > 0;
        if (filterType === "losers") return stock.change < 0;
        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "symbol") comp = a.symbol.localeCompare(b.symbol);
        else if (sortBy === "price") comp = a.price - b.price;
        else if (sortBy === "change") comp = a.changePercent - b.changePercent;
        return sortOrder === "asc" ? comp : -comp;
      });
  }, [stocks, watchlist, localSearch, filterType, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="bg-[#151A21] border border-[#242D38] rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Top Header & Search Controls */}
      <div className="p-3.5 border-b border-[#242D38] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#151A21]">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Market Watch
          </h2>
          <span className="text-xs text-gray-400 bg-[#1B222C] px-2 py-0.5 rounded-full border border-[#242D38]">
            {filteredAndSortedStocks.length}
          </span>
        </div>

        {/* Local Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter stocks..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs bg-[#111827] border border-[#242D38] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#242D38]/70 bg-[#12161D] text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "watchlist", label: "Watchlist" },
            { id: "gainers", label: "Gainers" },
            { id: "losers", label: "Losers" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors text-[11px] whitespace-nowrap ${
                filterType === tab.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#1B222C]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Sort Dropdown/Toggle */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0">
          <button
            onClick={() => toggleSort("price")}
            className="flex items-center gap-0.5 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#1B222C]"
            title="Sort by Price"
          >
            Price
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => toggleSort("change")}
            className="flex items-center gap-0.5 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#1B222C]"
            title="Sort by Change"
          >
            %
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Stocks List / Table */}
      <div className="divide-y divide-[#242D38]/60 overflow-y-auto max-h-[580px] flex-1">
        {filteredAndSortedStocks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            No stocks found in this view.
          </div>
        ) : (
          filteredAndSortedStocks.map((stock) => {
            const isSelected = stock.symbol === selectedStockSymbol;
            const isStarred = watchlist.includes(stock.symbol);
            const isPositive = stock.change >= 0;
            const flash = priceFlashing[stock.symbol];

            return (
              <div
                key={stock.symbol}
                onClick={() => handleStockClick(stock.symbol)}
                className={`group flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? "bg-blue-950/20 border-l-2 border-l-blue-500"
                    : "hover:bg-[#1B222C]/70 border-l-2 border-l-transparent"
                } ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}
              >
                {/* Left: Star + Symbol + Name */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(stock.symbol);
                    }}
                    className="text-gray-500 hover:text-amber-400 p-0.5 transition-colors shrink-0"
                    title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isStarred
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-500 group-hover:text-gray-400"
                      }`}
                    />
                  </button>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white text-xs sm:text-sm tracking-tight truncate">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase px-1 rounded bg-[#111827] border border-[#242D38]">
                        NSE
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[140px] sm:max-w-[180px]">
                      {stock.name}
                    </div>
                  </div>
                </div>

                {/* Right: Price, Change %, and Quick Trade Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold text-white tabular-nums tracking-tight">
                      {formatINR(stock.price)}
                    </div>
                    <div
                      className={`text-[11px] font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                        isPositive ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-2.5 h-2.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5" />
                      )}
                      <span>
                        {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
                      </span>
                    </div>
                  </div>

                  {/* Buy / Sell Quick Buttons */}
                  <div className="hidden xs:flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleTradeAction(e, stock, "BUY")}
                      className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      title={`Buy ${stock.symbol}`}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleTradeAction(e, stock, "SELL")}
                      className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      title={`Sell ${stock.symbol}`}
                    >
                      S
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
