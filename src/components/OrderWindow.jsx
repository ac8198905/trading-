import { useState, useId } from "react";
import { X, AlertCircle } from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR } from "../utils/formatters";

export default function OrderWindow() {
  const { orderWindow, closeOrderWindow, balance, positions, placeOrder } = useTrading();

  const isWindowOpen = orderWindow.isOpen && !!orderWindow.stock;
  const stock = orderWindow.stock;
  const initialAction = orderWindow.action || "BUY";

  const [orderAction, setOrderAction] = useState(initialAction);
  const [productType, setProductType] = useState("Delivery"); // "Delivery" (CNC) | "Intraday" (MIS)
  const [orderType, setOrderType] = useState("Market"); // "Market" | "Limit"
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(stock ? stock.price : 100);
  const [errorMsg, setErrorMsg] = useState("");
  const [prevStockSymbol, setPrevStockSymbol] = useState(stock?.symbol);
  const [prevAction, setPrevAction] = useState(initialAction);


  const quantityInputId = useId();
  const limitPriceInputId = useId();

  // Keep state updated when stock or action changes
  if (stock && stock.symbol !== prevStockSymbol) {
    setPrevStockSymbol(stock.symbol);
    setLimitPrice(stock.price);
    setErrorMsg("");
  }
  if (initialAction && initialAction !== prevAction) {
    setPrevAction(initialAction);
    setOrderAction(initialAction);
  }

  if (!isWindowOpen || !stock) return null;

  const isBuy = orderAction === "BUY";
  const currentPrice = orderType === "Market" ? stock.price : Number(limitPrice);
  const estimatedTotal = +(quantity * currentPrice).toFixed(2);

  const heldShares = positions
    .filter((p) => p.symbol === stock.symbol)
    .reduce((sum, p) => sum + p.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");


    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setErrorMsg("Quantity must be greater than 0");
      return;
    }

    if (orderType === "Limit") {
      const parsedPrice = parseFloat(limitPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setErrorMsg("Limit price must be greater than 0");
        return;
      }
    }

    if (isBuy && estimatedTotal > balance) {
      setErrorMsg(`Insufficient margin. Required: ${formatINR(estimatedTotal)}, Available: ${formatINR(balance)}`);
      return;
    }

    if (!isBuy && heldShares < parsedQty) {
      setErrorMsg(`Insufficient holdings. You only hold ${heldShares} shares of ${stock.symbol}`);
      return;
    }

    const result = placeOrder({
      symbol: stock.symbol,
      type: orderAction,
      orderType,
      product: productType,
      quantity: parsedQty,
      price: currentPrice,
    });

    if (result && result.success) {
      closeOrderWindow();
    } else if (result && result.error) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeOrderWindow}
      />

      {/* Kite-style Order Window */}
      <div className="relative bg-[#151A21] border border-[#242D38] rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10 transition-all">
        {/* Kite Header (Blue for BUY, Orange/Red for SELL) */}
        <div
          className={`px-4 py-3 text-white flex items-center justify-between transition-colors ${
            isBuy ? "bg-blue-600" : "bg-rose-600"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">
                {orderAction} {stock.symbol}
              </span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-semibold">
                NSE
              </span>
            </div>
            <div className="text-xs text-white/90 tabular-nums">
              ₹{stock.price.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Buy / Sell switch right on top bar */}
            <div className="bg-black/25 rounded-lg p-0.5 flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderAction("BUY")}
                className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                  isBuy ? "bg-white text-blue-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setOrderAction("SELL")}
                className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                  !isBuy ? "bg-white text-rose-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                Sell
              </button>
            </div>

            <button
              type="button"
              onClick={closeOrderWindow}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kite Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Product Tabs: Intraday (MIS) vs Longterm (CNC) */}
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">
              Product
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProductType("Intraday")}
                className={`py-2 px-3 rounded-lg font-semibold text-xs border transition-all ${
                  productType === "Intraday"
                    ? "bg-[#1E2734] border-blue-500 text-blue-400"
                    : "bg-[#111827] border-[#242D38] text-gray-400 hover:text-gray-200"
                }`}
              >
                Intraday <span className="text-[10px] opacity-75 font-normal">MIS</span>
              </button>
              <button
                type="button"
                onClick={() => setProductType("Delivery")}
                className={`py-2 px-3 rounded-lg font-semibold text-xs border transition-all ${
                  productType === "Delivery"
                    ? "bg-[#1E2734] border-blue-500 text-blue-400"
                    : "bg-[#111827] border-[#242D38] text-gray-400 hover:text-gray-200"
                }`}
              >
                Longterm <span className="text-[10px] opacity-75 font-normal">CNC</span>
              </button>
            </div>
          </div>

          {/* Type Tabs: Market vs Limit */}
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType("Market")}
                className={`py-1.5 px-3 rounded-lg font-semibold text-xs border transition-all ${
                  orderType === "Market"
                    ? "bg-[#1E2734] border-blue-500 text-blue-400"
                    : "bg-[#111827] border-[#242D38] text-gray-400 hover:text-gray-200"
                }`}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setOrderType("Limit")}
                className={`py-1.5 px-3 rounded-lg font-semibold text-xs border transition-all ${
                  orderType === "Limit"
                    ? "bg-[#1E2734] border-blue-500 text-blue-400"
                    : "bg-[#111827] border-[#242D38] text-gray-400 hover:text-gray-200"
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Qty & Price Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor={quantityInputId} className="text-[11px] font-medium text-gray-400">
                  Quantity
                </label>
                {!isBuy && (
                  <span className="text-[10px] text-gray-500">Hold: {heldShares}</span>
                )}
              </div>
              <input
                id={quantityInputId}
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? "" : Math.max(1, parseInt(val, 10) || 1));
                }}
                className="w-full px-3 py-2 bg-[#111827] border border-[#242D38] rounded-lg text-sm font-bold text-white tabular-nums focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor={limitPriceInputId} className="text-[11px] font-medium text-gray-400 block mb-1">
                Price (₹)
              </label>
              <input
                id={limitPriceInputId}
                type="number"
                step="0.05"
                disabled={orderType === "Market"}
                value={orderType === "Market" ? stock.price : limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className={`w-full px-3 py-2 bg-[#111827] border border-[#242D38] rounded-lg text-sm font-bold text-white tabular-nums focus:outline-none ${
                  orderType === "Market"
                    ? "opacity-50 cursor-not-allowed bg-[#141820]"
                    : "focus:border-blue-500"
                }`}
                required
              />
            </div>
          </div>

          {/* Inline Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Margin & Funds Calculation Bar */}
          <div className="p-2.5 rounded-lg bg-[#111827] border border-[#242D38] flex items-center justify-between text-[11px]">
            <div>
              <span className="text-gray-400">Margin req: </span>
              <span className="font-bold text-white tabular-nums">
                {formatINR(estimatedTotal)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Available: </span>
              <span className="font-bold text-gray-200 tabular-nums">
                {formatINR(balance)}
              </span>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm tracking-wide text-white transition-all shadow-md ${
                isBuy
                  ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
              }`}
            >
              {orderAction} {quantity || 0} {stock.symbol}
            </button>
            <button
              type="button"
              onClick={closeOrderWindow}
              className="py-2.5 px-4 rounded-lg font-semibold text-xs bg-[#1B222C] hover:bg-[#242D38] text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
