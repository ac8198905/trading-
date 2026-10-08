import MarketOverview from "../components/MarketOverview";

import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";
import StockChart from "../components/StockChart";
import Positions from "../components/Positions";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      {/* 1. Market Overview (Nifty 50, Bank Nifty, Sensex, Nifty IT) */}
      <MarketOverview />

      {/* 2. Middle Section: Watchlist & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Watchlist on Left */}
        <div className="lg:col-span-7 xl:col-span-7">
          <Watchlist />
        </div>

        {/* Portfolio on Right */}
        <div className="lg:col-span-5 xl:col-span-5">
          <Portfolio />
        </div>
      </div>

      {/* 3. Bottom Section: Selected Stock Detailed Interactive Chart */}
      <div className="w-full">
        <StockChart />
      </div>

      {/* 4. Active Positions Snapshot */}
      <div className="w-full">
        <Positions />
      </div>
    </div>
  );
}
