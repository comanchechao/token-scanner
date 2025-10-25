import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import tradingService from "../../../../api/tradingService";
import { useToastContext } from "../../../../contexts/ToastContext";

interface BuySellPanelLiteProps {
  address: string;
  initialTab?: "buy" | "sell";
}

const BuySellPanelLite: React.FC<BuySellPanelLiteProps> = ({
  address,
  initialTab = "buy",
}) => {
  const [mode, setMode] = useState<"buy" | "sell">(initialTab);
  const [amount, setAmount] = useState<string>("0.1");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const submit = useCallback(async () => {
    try {
      setLoading(true);
      const amt = Number(amount) > 0 ? amount : "0.1";
      const res =
        mode === "buy"
          ? await tradingService.buyToken("0", address, amt)
          : await tradingService.sellToken("0", address, amt);

      if (res.success) {
        showSuccess(
          mode === "buy" ? "Buy Order Placed" : "Sell Order Placed",
          `${mode === "buy" ? "Bought" : "Sold"} ${amt} SOL for ${address}`
        );
      } else {
        showError("Order Failed", res.message || "Unknown error");
      }
    } catch (e: any) {
      showError("Order Failed", e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [mode, amount, address, showSuccess, showError]);

  return (
    <div className="bg-[#0e0f13] border border-subtle rounded-t-sm p-4">
      <div className="bg-gray-800/30 rounded-sm p-1 flex mb-3">
        <button
          className={`flex-1 cursor-pointer py-2 px-2 rounded-l-sm text-sm font-medium transition-all duration-200 ${
            mode === "buy"
              ? " bg-emerald-500 text-black"
              : "text-gray-400 hover:text-gray-200 bg-white/5"
          }`}
          onClick={() => setMode("buy")}
        >
          Buy
        </button>
        <button
          className={`flex-1 cursor-pointer py-2 px-2 rounded-r-sm text-sm font-medium transition-all duration-200 ${
            mode === "sell"
              ? " bg-rose-400 text-black"
              : "text-gray-400 hover:text-gray-200 bg-white/5"
          }`}
          onClick={() => setMode("sell")}
        >
          Sell
        </button>
      </div>

      <div className="bg-white/5 rounded-sm mb-3">
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Amount (SOL)
          </div>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-white w-24 text-sm font-mono bg-transparent border-none outline-none text-right"
          />
        </div>
        <div className="flex">
          {["0.1", "0.5", "1", "5"].map((a, i) => (
            <button
              key={a}
              className={`flex-1 py-1 cursor-pointer text-sm font-medium transition-colors ${
                amount === a
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              } ${i === 0 ? "rounded-bl-sm" : ""} ${
                i === 3 ? "rounded-br-sm" : ""
              }`}
              onClick={() => setAmount(a)}
            >
              {a}
            </button>
          ))}
          <button
            className="flex-1 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors rounded-br-sm"
            onClick={() =>
              (
                document.getElementById("amount-input") as HTMLInputElement
              )?.focus()
            }
          >
            <Icon
              icon="material-symbols:edit"
              width={16}
              height={16}
              className="mx-auto"
            />
          </button>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className={`w-full text-sm py-3 rounded-sm cursor-pointer text-black font-medium transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : mode === "buy"
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-rose-400 hover:bg-rose-500"
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Icon icon="tabler:bolt" width={20} height={20} />
              {mode === "buy" ? "Quick Buy" : "Quick Sell"}
            </>
          )}
        </span>
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Once you click on {mode === "buy" ? "Quick Buy" : "Quick Sell"}, your
        transaction is sent immediately.
      </p>
    </div>
  );
};

export default BuySellPanelLite;
