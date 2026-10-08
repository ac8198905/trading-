import { useState, useEffect, useCallback } from "react";
import {
  INITIAL_STOCKS,
  INITIAL_MARKET_INDICES,
  generateHistoryData,
} from "../data/mockStocks";

export function useMarketData() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [marketIndices, setMarketIndices] = useState(INITIAL_MARKET_INDICES);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState("RELIANCE");
  const [priceFlashing, setPriceFlashing] = useState({}); // symbol -> 'up' | 'down'
  
  // Cache of history data per stock symbol and timeframe
  const [historyCache, setHistoryCache] = useState(() => {
    const initial = {};
    INITIAL_STOCKS.forEach((stock) => {
      initial[stock.symbol] = {
        "1D": generateHistoryData(stock.price, "1D"),
        "1W": generateHistoryData(stock.price, "1W"),
        "1M": generateHistoryData(stock.price, "1M"),
        "3M": generateHistoryData(stock.price, "3M"),
        "1Y": generateHistoryData(stock.price, "1Y"),
      };
    });
    return initial;
  });

  const selectedStock = stocks.find((s) => s.symbol === selectedStockSymbol) || stocks[0];

  // Callback to select a stock
  const selectStock = useCallback((symbol) => {
    setSelectedStockSymbol(symbol);
  }, []);

  // Update history point for live chart updates
  const appendLiveHistoryPoint = useCallback((symbol, newPrice) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setHistoryCache((prev) => {
      const stockHist = prev[symbol] || {};
      const current1D = stockHist["1D"] || [];
      const updated1D = [
        ...current1D,
        {
          time: timeStr,
          price: newPrice,
          volume: Math.floor(1000 + Math.random() * 5000),
        },
      ];
      // Keep last 35 points for a clean real-time intraday view
      const trimmed1D = updated1D.length > 40 ? updated1D.slice(updated1D.length - 40) : updated1D;

      return {
        ...prev,
        [symbol]: {
          ...stockHist,
          "1D": trimmed1D,
        },
      };
    });
  }, []);

  // Real-time market simulation interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 3 to 5 stocks to update each tick
      setStocks((prevStocks) => {
        const flashes = {};
        const updated = prevStocks.map((stock) => {
          // 40% chance of price tick for this stock in this interval
          const shouldUpdate = Math.random() < 0.45;
          if (!shouldUpdate) return stock;

          // Tiny realistic fluctuation (between -0.35% and +0.35%)
          const varianceRatio = (Math.random() - 0.49) * 0.007;
          const rawDelta = stock.price * varianceRatio;
          // Clamp delta to minimum 0.05
          const delta = Math.abs(rawDelta) < 0.05 ? (rawDelta >= 0 ? 0.05 : -0.05) : rawDelta;
          
          const newPrice = Math.max(1, +(stock.price + delta).toFixed(2));
          const change = +(newPrice - stock.previousClose).toFixed(2);
          const changePercent = +((change / stock.previousClose) * 100).toFixed(2);
          const dayHigh = Math.max(stock.dayHigh, newPrice);
          const dayLow = Math.min(stock.dayLow, newPrice);
          const volume = stock.volume + Math.floor(Math.random() * 250) + 10;

          flashes[stock.symbol] = delta >= 0 ? "up" : "down";

          // If this is the currently selected stock, update live intraday history
          if (stock.symbol === selectedStockSymbol) {
            appendLiveHistoryPoint(stock.symbol, newPrice);
          }

          return {
            ...stock,
            price: newPrice,
            change,
            changePercent,
            dayHigh,
            dayLow,
            volume,
          };
        });

        if (Object.keys(flashes).length > 0) {
          setPriceFlashing(flashes);
          // Clear flash classes after 800ms
          setTimeout(() => {
            setPriceFlashing({});
          }, 800);
        }

        return updated;
      });

      // Also gently tick market indices
      setMarketIndices((prevIndices) =>
        prevIndices.map((idx) => {
          if (Math.random() < 0.5) return idx;
          const delta = (Math.random() - 0.49) * (idx.value * 0.001);
          const newValue = +(idx.value + delta).toFixed(2);
          const change = +(newValue - idx.previousClose).toFixed(2);
          const changePercent = +((change / idx.previousClose) * 100).toFixed(2);
          return {
            ...idx,
            value: newValue,
            change,
            changePercent,
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedStockSymbol, appendLiveHistoryPoint]);

  return {
    stocks,
    marketIndices,
    selectedStock,
    selectedStockSymbol,
    selectStock,
    priceFlashing,
    historyCache,
    setHistoryCache,
  };
}
