import { useSearchParams } from "react-router-dom";

import Watchlist from "../components/Watchlist";
import StockChart from "../components/StockChart";
import TradingPanel from "../components/TradingPanel";
import Positions from "../components/Positions";

export default function Trading() {
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action")?.toUpperCase() || "BUY";

  return (
    <div className="space-y-4">
      {/* Main Trading Terminal Layout: 70% Chart/Market area, 30% Trading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left/Center Area (approx 70% on large screens) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Main Chart */}
          <div className="w-full">
            <StockChart />
          </div>

          {/* Quick Watchlist Selector for Terminal */}
          <div className="w-full">
            <Watchlist />
          </div>
        </div>

        {/* Right Area (approx 30% on large screens) */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <TradingPanel initialAction={actionParam} />
          </div>
        </div>
      </div>

      {/* Positions and Orders at the bottom of the trading terminal */}
      <div className="w-full">
        <Positions />
      </div>
    </div>
  );
}
