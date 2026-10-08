import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Search,
  Bell,
  Wallet,
  Menu,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

import { useTrading } from "../context/TradingContext";
import { formatINR } from "../utils/formatters";

export default function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const { balance, user, stocks, selectStock, searchQuery, setSearchQuery } = useTrading();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredStocks = searchQuery.trim()
    ? stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (symbol) => {
    selectStock(symbol);
    setSearchQuery("");
    setShowSearchDropdown(false);
    navigate("/trading");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111827]/95 backdrop-blur-md border-b border-[#242D38] px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1B222C] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Trade<span className="text-blue-500">X</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PRO
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Stock Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks (e.g. RELIANCE, TCS, INFY)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 250)}
              className="w-full pl-10 pr-4 py-1.5 text-sm bg-[#151A21] border border-[#242D38] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Search dropdown results */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#151A21] border border-[#242D38] rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-[#242D38]/50 max-h-72 overflow-y-auto">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    type="button"
                    onMouseDown={() => handleSelectSearchResult(stock.symbol)}
                    className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#1B222C] transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-2">
                        {stock.symbol}
                        <span className="text-xs text-gray-400 font-normal">{stock.sector}</span>
                      </div>
                      <div className="text-xs text-gray-400">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">
                        {formatINR(stock.price)}
                      </div>
                      <div
                        className={`text-xs font-medium tabular-nums ${
                          stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent}%
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  No stocks found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Status, Wallet, Notification, User */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Market Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#151A21] border border-[#242D38] text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400">Market Open</span>
          </div>

          {/* Account Balance */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151A21] border border-[#242D38]">
            <Wallet className="w-4 h-4 text-blue-400 hidden xs:inline" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400 font-medium leading-none hidden sm:block">
                Available Funds
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tabular-nums">
                {formatINR(balance)}
              </span>
            </div>
          </div>

          {/* Notifications Dropdown toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1B222C] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#151A21] border border-[#242D38] rounded-xl shadow-2xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#242D38]">
                  <span className="font-semibold text-white">System Alerts</span>
                  <span className="text-blue-400 cursor-pointer hover:underline text-[11px]">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-[#1B222C]/70 border border-[#242D38]">
                    <div className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Market Session Active
                    </div>
                    <div className="text-gray-300 mt-0.5">
                      NSE/BSE live feeds active. Orders simulated with zero latency.
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#1B222C]/70 border border-[#242D38]">
                    <div className="text-blue-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Intraday Cutoff
                    </div>
                    <div className="text-gray-300 mt-0.5">
                      Square-off time configured for 3:20 PM IST.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#242D38]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs ring-2 ring-blue-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">Retail Trader</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
