import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TradingProvider, useTrading } from "./context/TradingContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import OrderWindow from "./components/OrderWindow";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";
import Positions from "./components/Positions";
import OrderHistory from "./components/OrderHistory";
import MarketOverview from "./components/MarketOverview";
import StockChart from "./components/StockChart";
import { Sliders, RefreshCw, User } from "lucide-react";
import { formatINR } from "./utils/formatters";


// Dedicated Watchlist Page View
function WatchlistView() {
  return (
    <div className="space-y-4">
      <MarketOverview />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <Watchlist />
        </div>
        <div className="lg:col-span-5">
          <StockChart />
        </div>
      </div>
    </div>
  );
}

// Dedicated Portfolio Page View
function PortfolioView() {
  return (
    <div className="space-y-4">
      <Portfolio />
      <Positions />
    </div>
  );
}

// Dedicated Positions Page View
function PositionsView() {
  return (
    <div className="space-y-4">
      <Positions />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <Portfolio />
        </div>
        <div className="lg:col-span-6">
          <StockChart />
        </div>
      </div>
    </div>
  );
}

// Dedicated Orders Page View
function OrdersView() {
  return (
    <div className="space-y-4">
      <OrderHistory />
      <Positions />
    </div>
  );
}

// Settings & Preferences View
function SettingsView() {
  const { user, balance, openModal } = useTrading();

  const handleResetDemoData = () => {
    openModal({
      title: "Reset Simulation Data",
      message: "Are you sure you want to refresh the trading session simulation?",
      type: "warning",
      confirmText: "Refresh Session",
      onConfirm: () => {
        window.location.reload();
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-[#151A21] border border-[#242D38] rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          Terminal Settings & Account
        </h2>
        <p className="text-xs text-gray-400">
          Manage your trading simulation preferences, broker credentials, and defaults.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-[#111827] border border-[#242D38] space-y-1">
            <span className="text-[11px] text-gray-400 font-medium">Trader Identity</span>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              {user.name}
            </div>
            <span className="text-xs text-gray-400">{user.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-[#242D38] space-y-1">
            <span className="text-[11px] text-gray-400 font-medium">Virtual Trading Balance</span>
            <div className="text-base font-bold text-emerald-400">{formatINR(balance)}</div>
            <span className="text-xs text-gray-400">Simulated capital for testing</span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#242D38] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">Reset Simulation Session</div>
            <div className="text-xs text-gray-400">
              Restores initial balance and seeds fresh orders/positions.
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-4 py-2 bg-[#1B222C] hover:bg-[#242D38] text-white border border-[#242D38] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            Reset Session
          </button>
        </div>
      </div>
    </div>
  );
}

// Inner Layout Shell
function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F5F7FA] flex flex-col antialiased">
      {/* Sticky Header */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex flex-1 w-full relative">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1720px] mx-auto overflow-x-hidden min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/watchlist" element={<WatchlistView />} />
            <Route path="/portfolio" element={<PortfolioView />} />
            <Route path="/positions" element={<PositionsView />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals & Kite Order Window */}
      <Modal />
      <OrderWindow />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <TradingProvider>
        <AppShell />
      </TradingProvider>
    </Router>
  );
}
