import React, { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Token } from "./TokenCard";
import { useSettings } from "../../../contexts/SettingsContext";
import { useAuth } from "../../../components/AuthProvider";
import { useToastContext } from "../../../contexts/ToastContext";
import TradingService from "../../../api/tradingService";

interface MobileTokenCardProps {
  token: Token;
  onTokenClick: (token: Token) => void;
}

const MobileTokenCard: React.FC<MobileTokenCardProps> = ({
  token,
  onTokenClick,
}) => {
  const { quickBuyAmount, quickSellPercentage } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  const formatMarketCapGain = (gain: number) => {
    const percentage = (gain / 100) * 100;
    const isPositive = percentage >= 0;
    const color = isPositive ? "text-green-400" : "text-red-400";
    const sign = isPositive ? "+" : "";
    return { text: `${sign}${percentage.toFixed(1)}%`, color };
  };

  const handleBuyToken = useCallback(async () => {
    if (!isAuthenticated || !user) {
      showWarning("Authentication Required", "Please login to trade tokens");
      return;
    }

    setBuyLoading(true);
    try {
      const result = await TradingService.buyToken(
        "0",
        token.tokenAddress,
        quickBuyAmount
      );

      if (result.success) {
        const txSignature =
          (result as any).signature || (result as any).result?.signature;
        showSuccess(
          "Buy Order Placed",
          `Successfully placed buy order for ${quickBuyAmount} SOL of ${token.tokenSymbol}`,
          undefined,
          txSignature
        );
      } else {
        showError(
          "Buy Order Failed",
          result.message || "Unknown error occurred"
        );
      }
    } catch (error: any) {
      if (error.message === "Access token has expired") {
        showError(
          "Session Expired",
          "Your session has expired. Please log in again."
        );
      } else if (error.message === "Not enough balance") {
        showError(
          "Insufficient Balance",
          `You don't have enough balance to buy ${quickBuyAmount} SOL of ${token.tokenSymbol}.`
        );
      } else {
        showError(
          "Buy Order Failed",
          error.message || "Failed to place buy order"
        );
      }
    } finally {
      setBuyLoading(false);
    }
  }, [
    isAuthenticated,
    user,
    token.tokenAddress,
    token.tokenSymbol,
    quickBuyAmount,
    showSuccess,
    showError,
    showWarning,
  ]);

  const handleSellToken = useCallback(async () => {
    if (!isAuthenticated || !user) {
      showWarning("Authentication Required", "Please login to trade tokens");
      return;
    }

    setSellLoading(true);
    try {
      const result = await TradingService.sellToken(
        "0",
        token.tokenAddress,
        quickSellPercentage
      );

      if (result.success) {
        const txSignature =
          (result as any).signature || (result as any).result?.signature;
        showSuccess(
          "Sell Order Placed",
          `Successfully placed sell order for ${quickSellPercentage}% of ${token.tokenSymbol}`,
          undefined,
          txSignature
        );
      } else {
        showError(
          "Sell Order Failed",
          result.message || "Unknown error occurred"
        );
      }
    } catch (error: any) {
      if (error.message === "Access token has expired") {
        showError(
          "Session Expired",
          "Your session has expired. Please log in again."
        );
      } else if (error.message === "Not enough balance") {
        showError(
          "Insufficient Balance",
          `You don't have enough ${token.tokenSymbol} to sell ${quickSellPercentage}%.`
        );
      } else {
        showError(
          "Sell Order Failed",
          error.message || "Failed to place sell order"
        );
      }
    } finally {
      setSellLoading(false);
    }
  }, [
    isAuthenticated,
    user,
    token.tokenAddress,
    token.tokenSymbol,
    quickSellPercentage,
    showSuccess,
    showError,
    showWarning,
  ]);

  const gainInfo = formatMarketCapGain(token.marketCapGain);

  return (
    <div
      className="bg-[#161616]  border border-white/[0.1] rounded-sm p-4 mb-4 active:scale-95 transition-all duration-200"
      onClick={() => onTokenClick(token)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Token Icon */}
          <div className="relative">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center ring-2 ring-white/10 overflow-hidden">
              {token.tokenImage ? (
                <img
                  src={token.tokenImage}
                  alt={token.tokenName}
                  className="w-full h-full object-cover rounded-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <Icon
                icon="material-symbols:token"
                className={`w-5 h-5 text-main-accent ${
                  token.tokenImage ? "hidden" : ""
                }`}
              />
            </div>
          </div>

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-tiktok text-sm font-medium text-main-text">
                ${token.tokenSymbol}
              </span>
              <span
                className={`font-tiktok text-xs font-medium ${gainInfo.color}`}
              >
                {gainInfo.text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-tiktok text-xs text-main-light-text/50">
                {token.tokenAddress.slice(0, 6)}...
                {token.tokenAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        {/* Market Cap */}
        <div className="text-right">
          <div className="font-tiktok text-xs text-main-light-text/70 mb-1">
            MC
          </div>
          <div className="font-algance text-sm text-main-text">
            {formatMarketCap(token.marketCap)}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#161616]  rounded-lg p-2 border border-white/[0.05]">
          <div className="flex items-center gap-1 mb-1">
            <Icon
              icon="material-symbols:trending-up"
              className="w-3 h-3 text-green-400"
            />
            <span className="font-tiktok text-xs text-main-light-text/70">
              Buys
            </span>
          </div>
          <div className="font-tiktok text-sm text-green-400">
            {token.buyTrades}
          </div>
        </div>

        <div className="bg-[#161616]  rounded-lg p-2 border border-white/[0.05]">
          <div className="flex items-center gap-1 mb-1">
            <Icon
              icon="material-symbols:trending-down"
              className="w-3 h-3 text-red-400"
            />
            <span className="font-tiktok text-xs text-main-light-text/70">
              Sells
            </span>
          </div>
          <div className="font-tiktok text-sm text-red-400">
            {token.sellTrades}
          </div>
        </div>

        <div className="bg-[#161616]  rounded-lg p-2 border border-white/[0.05]">
          <div className="flex items-center gap-1 mb-1">
            <Icon
              icon="material-symbols:timeline"
              className="w-3 h-3 text-main-accent"
            />
            <span className="font-tiktok text-xs text-main-light-text/70">
              Total
            </span>
          </div>
          <div className="font-tiktok text-sm text-main-text">
            {token.totalTrades}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBuyToken();
          }}
          disabled={buyLoading}
          className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-green-400/50 rounded-sm px-3 py-2 transition-all duration-300 disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-1">
            {buyLoading ? (
              <Icon
                icon="eos-icons:loading"
                className="w-4 h-4 text-green-400 animate-spin"
              />
            ) : (
              <Icon
                icon="material-symbols:trending-up"
                className="w-4 h-4 text-green-400"
              />
            )}
            <span className="font-tiktok text-xs text-main-text">
              {buyLoading ? "..." : `${quickBuyAmount}`}
            </span>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSellToken();
          }}
          disabled={sellLoading}
          className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/50 rounded-sm px-3 py-2 transition-all duration-300 disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-1">
            {sellLoading ? (
              <Icon
                icon="eos-icons:loading"
                className="w-4 h-4 text-red-400 animate-spin"
              />
            ) : (
              <Icon
                icon="material-symbols:trending-down"
                className="w-4 h-4 text-red-400"
              />
            )}
            <span className="font-tiktok text-xs text-main-text">
              {sellLoading ? "..." : `${quickSellPercentage}%`}
            </span>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onTokenClick(token);
          }}
          className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/50 rounded-sm p-2 transition-all duration-300"
        >
          <Icon
            icon="material-symbols:open-in-new"
            className="w-4 h-4 text-main-accent"
          />
        </button>
      </div>
    </div>
  );
};

export default MobileTokenCard;
