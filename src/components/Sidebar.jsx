import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CandlestickChart,
  BookmarkCheck,
  Briefcase,
  Layers,
  ClipboardList,
  History,
  Settings,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";


const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Trading", path: "/trading", icon: CandlestickChart },
  { name: "Watchlist", path: "/watchlist", icon: BookmarkCheck },
  { name: "Portfolio", path: "/portfolio", icon: Briefcase },
  { name: "Positions", path: "/positions", icon: Layers },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "History", path: "/orders?filter=Executed", icon: History },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-50 h-full lg:h-[calc(100vh-57px)] w-60 bg-[#111827] border-r border-[#242D38] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col py-4 px-3 space-y-6">
          {/* Mobile drawer header */}
          <div className="lg:hidden flex items-center justify-between px-3 pb-3 border-b border-[#242D38]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-white tracking-wide">TradeX Terminal</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="text-gray-400 hover:text-white p-1 rounded"
              aria-label="Close Sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-xs"
                        : "text-gray-400 hover:text-gray-200 hover:bg-[#1B222C]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-[#242D38] space-y-3">
          <div className="p-2.5 rounded-lg bg-[#151A21] border border-[#242D38]/80 text-[11px] text-gray-400 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct NSE/BSE Feed</span>
            </div>
            <div>Latency: &lt;12ms</div>
            <div className="text-[10px] text-gray-500">v2.4.0 Engine Active</div>
          </div>
        </div>
      </aside>
    </>
  );
}
