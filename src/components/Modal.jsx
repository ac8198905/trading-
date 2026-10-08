import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { formatINR } from "../utils/formatters";

export default function Modal() {
  const { modal, closeModal } = useTrading();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modal.isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  const { title, message, type, details, onConfirm, confirmText } = modal;


  const handleViewOrders = () => {
    closeModal();
    navigate("/orders");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeModal}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-[#151A21] border border-[#242D38] rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 overflow-hidden transform transition-all animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1B222C] transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          {type === "success" && (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          {type === "warning" && (
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}
          {type === "error" && (
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          )}
          {type === "info" && (
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
          )}

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{message}</p>
          </div>
        </div>

        {/* Order Details Card (if present) */}
        {details && (
          <div className="my-4 p-3.5 rounded-xl bg-[#111827] border border-[#242D38] space-y-2 text-xs">
            <div className="flex justify-between items-center text-gray-400">
              <span>Order Reference</span>
              <span className="font-mono text-gray-200">{details.id}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Instrument</span>
              <span className="font-bold text-white">{details.symbol}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Action & Type</span>
              <span className="font-semibold text-white">
                {details.type} • {details.orderType}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Execution Price</span>
              <span className="font-semibold text-white tabular-nums">
                {formatINR(details.price)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-400 pt-1.5 border-t border-[#242D38]/60 font-medium">
              <span>Total Value</span>
              <span className="font-bold text-emerald-400 tabular-nums text-sm">
                {formatINR(details.total)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-5">
          {details && (
            <button
              type="button"
              onClick={handleViewOrders}
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-[#1B222C] hover:bg-[#242D38] text-gray-200 border border-[#242D38] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Orders</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              closeModal();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-600/20"
          >
            {confirmText || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
