/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useMarketData } from "../hooks/useMarketData";
import {
  INITIAL_POSITIONS,
  INITIAL_ORDERS,
  INITIAL_WATCHLIST_SYMBOLS,
  INITIAL_USER,
} from "../data/mockStocks";

const TradingContext = createContext(null);

export function TradingProvider({ children }) {
  const marketData = useMarketData();
  const { stocks } = marketData;


  const [balance, setBalance] = useState(INITIAL_USER.balance);
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST_SYMBOLS);
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal dialog state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // "success" | "confirm" | "warning" | "error"
    details: null,
    onConfirm: null,
    confirmText: "Confirm",
    cancelText: "Close",
  });

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openModal = useCallback((modalConfig) => {
    setModal({
      isOpen: true,
      title: modalConfig.title || "Notice",
      message: modalConfig.message || "",
      type: modalConfig.type || "info",
      details: modalConfig.details || null,
      onConfirm: modalConfig.onConfirm || null,
      confirmText: modalConfig.confirmText || "OK",
      cancelText: modalConfig.cancelText || "Close",
    });
  }, []);

  // Kite-style order window state
  const [orderWindow, setOrderWindow] = useState({
    isOpen: false,
    stock: null,
    action: "BUY",
  });

  const openOrderWindow = useCallback((stockOrSymbol, action = "BUY") => {
    const target =
      typeof stockOrSymbol === "string"
        ? stocks.find((s) => s.symbol === stockOrSymbol) || stocks[0]
        : stockOrSymbol || stocks[0];

    setOrderWindow({
      isOpen: true,
      stock: target,
      action: action.toUpperCase(),
    });
  }, [stocks]);

  const closeOrderWindow = useCallback(() => {
    setOrderWindow((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Toggle stock in watchlist
  const toggleWatchlist = useCallback((symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  }, []);

  // Helper to execute an order in state
  const executeOrderInPortfolio = useCallback((orderToExecute) => {
    const { symbol, type, quantity, price, product } = orderToExecute;
    const orderCost = +(quantity * price).toFixed(2);
    const stockObj = stocks.find((s) => s.symbol === symbol);
    const companyName = stockObj ? stockObj.name : symbol;

    if (type === "BUY") {
      // Deduct balance
      setBalance((prev) => Math.max(0, +(prev - orderCost).toFixed(2)));

      // Add or merge into positions
      setPositions((prev) => {
        const existingIdx = prev.findIndex((p) => p.symbol === symbol && p.product === product);
        if (existingIdx >= 0) {
          const existing = prev[existingIdx];
          const newQty = existing.qty + quantity;
          const totalInvested = existing.qty * existing.avgPrice + orderCost;
          const newAvgPrice = +(totalInvested / newQty).toFixed(2);
          const updated = [...prev];
          updated[existingIdx] = {
            ...existing,
            qty: newQty,
            avgPrice: newAvgPrice,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: `POS-${Date.now().toString().slice(-4)}`,
              symbol,
              companyName,
              qty: quantity,
              avgPrice: price,
              product,
            },
          ];
        }
      });
    } else if (type === "SELL") {
      // Add balance
      setBalance((prev) => +(prev + orderCost).toFixed(2));

      // Reduce from positions
      setPositions((prev) => {
        const existingIdx = prev.findIndex((p) => p.symbol === symbol && p.product === product);
        if (existingIdx >= 0) {
          const existing = prev[existingIdx];
          if (existing.qty <= quantity) {
            // Closed completely
            return prev.filter((_, idx) => idx !== existingIdx);
          } else {
            const updated = [...prev];
            updated[existingIdx] = {
              ...existing,
              qty: existing.qty - quantity,
            };
            return updated;
          }
        }
        return prev;
      });
    }
  }, [stocks]);

  // Place a new order
  const placeOrder = useCallback(
    ({ symbol, type, orderType, product, quantity, price }) => {
      const targetStock = stocks.find((s) => s.symbol === symbol);
      if (!targetStock) {
        return { success: false, error: "Stock not found." };
      }

      const executionPrice = orderType === "Market" ? targetStock.price : Number(price);
      const totalAmount = +(quantity * executionPrice).toFixed(2);

      // Validation for BUY: balance check
      if (type === "BUY" && totalAmount > balance) {
        return {
          success: false,
          error: `Insufficient balance. Required: ₹${totalAmount.toLocaleString("en-IN")}, Available: ₹${balance.toLocaleString("en-IN")}`,
        };
      }

      // Validation for SELL: check if user holds sufficient shares
      if (type === "SELL") {
        const heldShares = positions
          .filter((p) => p.symbol === symbol)
          .reduce((sum, p) => sum + p.qty, 0);
        if (heldShares < quantity) {
          return {
            success: false,
            error: `Cannot sell ${quantity} shares of ${symbol}. You currently hold ${heldShares} shares.`,
          };
        }
      }

      const now = new Date();
      const timeStr = `Today, ${now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;

      // Check if Limit order should be pending or executed immediately
      let shouldExecuteNow = false;
      if (orderType === "Market") {
        shouldExecuteNow = true;
      } else {
        // Limit order logic:
        if (type === "BUY" && executionPrice >= targetStock.price) {
          shouldExecuteNow = true;
        } else if (type === "SELL" && executionPrice <= targetStock.price) {
          shouldExecuteNow = true;
        }
      }

      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder = {
        id: orderId,
        symbol,
        type,
        orderType,
        product,
        quantity,
        price: executionPrice,
        status: shouldExecuteNow ? "Executed" : "Pending",
        timestamp: timeStr,
      };

      setOrders((prev) => [newOrder, ...prev]);

      if (shouldExecuteNow) {
        executeOrderInPortfolio(newOrder);
      }

      // Show confirmation modal
      openModal({
        title: shouldExecuteNow ? "Order Executed Successfully" : "Limit Order Placed",
        message: `${type} ${quantity} ${symbol} @ ₹${executionPrice.toFixed(2)} (${orderType})`,
        type: "success",
        details: {
          id: orderId,
          symbol,
          type,
          orderType,
          quantity,
          price: executionPrice,
          total: totalAmount,
          status: shouldExecuteNow ? "Executed" : "Pending",
        },
        confirmText: "Done",
      });

      return { success: true, order: newOrder };
    },
    [stocks, balance, positions, executeOrderInPortfolio, openModal]
  );

  // Cancel a pending order
  const cancelOrder = useCallback(
    (orderId) => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId && ord.status === "Pending") {
            return { ...ord, status: "Cancelled" };
          }
          return ord;
        })
      );
      openModal({
        title: "Order Cancelled",
        message: `Order #${orderId} has been successfully cancelled.`,
        type: "info",
        confirmText: "OK",
      });
    },
    [openModal]
  );

  // Check pending orders when live prices update
  useEffect(() => {
    orders.forEach((order) => {
      if (order.status !== "Pending") return;
      const stock = stocks.find((s) => s.symbol === order.symbol);
      if (!stock) return;

      let triggered = false;
      if (order.type === "BUY" && stock.price <= order.price) {
        triggered = true;
      } else if (order.type === "SELL" && stock.price >= order.price) {
        triggered = true;
      }

      if (triggered) {
        // Execute pending order
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: "Executed" } : o))
        );
        executeOrderInPortfolio(order);
      }
    });
  }, [stocks, orders, executeOrderInPortfolio]);

  // Dynamic calculations for positions and portfolio
  const dynamicPositions = useMemo(() => {
    return positions.map((pos) => {
      const stock = stocks.find((s) => s.symbol === pos.symbol);
      const currentPrice = stock ? stock.price : pos.avgPrice;
      const dayChange = stock ? stock.change : 0;
      const invested = +(pos.qty * pos.avgPrice).toFixed(2);
      const currentValue = +(pos.qty * currentPrice).toFixed(2);
      const pnl = +(currentValue - invested).toFixed(2);
      const pnlPercent = invested > 0 ? +((pnl / invested) * 100).toFixed(2) : 0;
      const dayPnl = +(pos.qty * dayChange).toFixed(2);

      return {
        ...pos,
        currentPrice,
        invested,
        currentValue,
        pnl,
        pnlPercent,
        dayPnl,
      };
    });
  }, [positions, stocks]);

  const portfolioSummary = useMemo(() => {
    const totalInvested = dynamicPositions.reduce((acc, p) => acc + p.invested, 0);
    const totalCurrentValue = dynamicPositions.reduce((acc, p) => acc + p.currentValue, 0);
    const totalPnl = +(totalCurrentValue - totalInvested).toFixed(2);
    const totalPnlPercent = totalInvested > 0 ? +((totalPnl / totalInvested) * 100).toFixed(2) : 0;
    const todayPnl = +dynamicPositions.reduce((acc, p) => acc + p.dayPnl, 0).toFixed(2);
    const netWorth = +(balance + totalCurrentValue).toFixed(2);

    return {
      totalInvested,
      totalCurrentValue,
      totalPnl,
      totalPnlPercent,
      todayPnl,
      balance,
      netWorth,
    };
  }, [dynamicPositions, balance]);

  const value = {
    ...marketData,
    balance,
    watchlist,
    toggleWatchlist,
    positions: dynamicPositions,
    orders,
    placeOrder,
    cancelOrder,
    portfolioSummary,
    modal,
    openModal,
    closeModal,
    orderWindow,
    openOrderWindow,
    closeOrderWindow,
    searchQuery,
    setSearchQuery,
    user: INITIAL_USER,
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within a TradingProvider");
  }
  return context;
}
