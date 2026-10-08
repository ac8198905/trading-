import { useState, useId } from "react";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR } from "../utils/formatters";

export default function OrderForm({ initialAction = "BUY" }) {
  const { selectedStock, balance, positions, placeOrder } = useTrading();

  const [orderAction, setOrderAction] = useState(initialAction);
  const [prevAction, setPrevAction] = useState(initialAction);
  const [orderType, setOrderType] = useState("Market");
  const [productType, setProductType] = useState("Delivery");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(selectedStock ? selectedStock.price : 100);
  const [prevStockSymbol, setPrevStockSymbol] = useState(selectedStock?.symbol);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quantityInputId = useId();
  const limitPriceInputId = useId();


  // Sync state cleanly when props/selected stock change without cascading effect renders
  if (selectedStock && selectedStock.symbol !== prevStockSymbol) {
    setPrevStockSymbol(selectedStock.symbol);
    setLimitPrice(selectedStock.price);
    setErrorMsg("");
    setSuccessMsg("");
  }

  if (initialAction && initialAction !== prevAction) {
    setPrevAction(initialAction);
    setOrderAction(initialAction);
  }


  const currentExecutionPrice = orderType === "Market" ? selectedStock.price : Number(limitPrice);
  const estimatedTotal = +(quantity * currentExecutionPrice).toFixed(2);

  // Shares held for this stock
  const heldShares = positions
    .filter((p) => p.symbol === selectedStock.symbol)
    .reduce((sum, p) => sum + p.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setErrorMsg("Quantity must be a positive number greater than 0.");
      return;
    }

    if (orderType === "Limit") {
      const parsedPrice = parseFloat(limitPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setErrorMsg("Limit price must be greater than 0.");
        return;
      }
    }

    if (orderAction === "BUY" && estimatedTotal > balance) {
      setErrorMsg(
        `Insufficient balance. You need ${formatINR(estimatedTotal)}, but only have ${formatINR(balance)} available.`
      );
      return;
    }

    if (orderAction === "SELL" && heldShares < parsedQty) {
      setErrorMsg(
        `Insufficient holdings. You only own ${heldShares} share(s) of ${selectedStock.symbol}.`
      );
      return;
    }

    setIsSubmitting(true);

    const result = placeOrder({
      symbol: selectedStock.symbol,
      type: orderAction,
      orderType,
      product: productType,
      quantity: parsedQty,
      price: currentExecutionPrice,
    });

    setIsSubmitting(false);

    if (result && result.success) {
      setSuccessMsg(`Order placed successfully: ${orderAction} ${parsedQty} ${selectedStock.symbol}`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } else if (result && result.error) {
      setErrorMsg(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Buy / Sell Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#111827] rounded-xl border border-[#242D38]">
        <button
          type="button"
          onClick={() => {
            setOrderAction("BUY");
            setErrorMsg("");
          }}
          className={`py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
            orderAction === "BUY"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => {
            setOrderAction("SELL");
            setErrorMsg("");
          }}
          className={`py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
            orderAction === "SELL"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          SELL
        </button>
      </div>

      {/* Product Type (Delivery vs Intraday) */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 block mb-1">
          Product Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["Delivery", "Intraday"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProductType(p)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                productType === p
                  ? "bg-[#1B222C] text-white border-blue-500/50 text-blue-400"
                  : "bg-[#111827] text-gray-400 border-[#242D38] hover:text-gray-200"
              }`}
            >
              {p} {p === "Delivery" ? "(CNC)" : "(MIS)"}
            </button>
          ))}
        </div>
      </div>

      {/* Order Type (Market vs Limit) */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 block mb-1">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["Market", "Limit"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOrderType(t)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                orderType === t
                  ? "bg-[#1B222C] text-white border-blue-500/50 text-blue-400"
                  : "bg-[#111827] text-gray-400 border-[#242D38] hover:text-gray-200"
              }`}
            >
              {t} Order
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Price Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Quantity */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={quantityInputId} className="text-[11px] font-medium text-gray-400">
              Quantity
            </label>
            {orderAction === "SELL" && (
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
            className="w-full px-3 py-2 bg-[#111827] border border-[#242D38] rounded-lg text-sm text-white font-semibold tabular-nums focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor={limitPriceInputId} className="text-[11px] font-medium text-gray-400 block mb-1">
            {orderType === "Market" ? "Market Price" : "Limit Price (₹)"}
          </label>
          <input
            id={limitPriceInputId}
            type="number"
            step="0.05"
            disabled={orderType === "Market"}
            value={orderType === "Market" ? selectedStock.price : limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className={`w-full px-3 py-2 bg-[#111827] border border-[#242D38] rounded-lg text-sm text-white font-semibold tabular-nums focus:outline-none ${
              orderType === "Market"
                ? "opacity-60 cursor-not-allowed bg-[#131922]"
                : "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            }`}
            required
          />
        </div>
      </div>

      {/* Inline Validation / Error Message */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-400 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Order Summary & Cost Breakdown */}
      <div className="p-3 rounded-xl bg-[#111827] border border-[#242D38] space-y-2 text-xs">
        <div className="flex justify-between items-center text-gray-400">
          <span>Est. Order Value</span>
          <span className="font-semibold text-white tabular-nums">
            {formatINR(estimatedTotal)}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-400">
          <span>Available Margin</span>
          <span
            className={`font-semibold tabular-nums ${
              orderAction === "BUY" && balance < estimatedTotal
                ? "text-rose-400"
                : "text-gray-200"
            }`}
          >
            {formatINR(balance)}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-[#242D38]/60 text-[11px]">
          <span>Exchange & Brokerage</span>
          <span className="text-emerald-400 font-medium">₹0.00 (Zero Brokerage)</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          orderAction === "BUY"
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:translate-y-0.5"
            : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 active:translate-y-0.5"
        }`}
      >
        <span>
          {orderAction} {quantity || 0} {selectedStock.symbol}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
