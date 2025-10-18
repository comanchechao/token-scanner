import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { TrendingProject } from "../types/api";
import { useSettings } from "../contexts/SettingsContext";
import { useAuth } from "./AuthProvider";
import { useToastContext } from "../contexts/ToastContext";
import { useLoginModalContext } from "../contexts/LoginModalContext";
import TradingService from "../api/tradingService";

interface TrendingRibbonItemProps {
  project: TrendingProject;
}

const TrendingRibbonItem: React.FC<TrendingRibbonItemProps> = React.memo(
  ({ project }) => {
    const { quickBuyAmount, quickSellPercentage } = useSettings();
    const { user } = useAuth();
    const { showSuccess, showError } = useToastContext();
    const loginModalContext = useLoginModalContext();
    const [buyLoading, setBuyLoading] = useState(false);
    const [sellLoading, setSellLoading] = useState(false);

    const handleTokenClick = useCallback(() => {
      window.open(
        `https://dexscreener.com/solana/${project.tokenAddress}`,
        "_blank"
      );
    }, [project.tokenAddress]);

    const handleBuyToken = useCallback(async () => {
      loginModalContext.withAuth(async () => {
        setBuyLoading(true);
        try {
          const result = await TradingService.buyToken(
            "0",
            project.tokenAddress,
            quickBuyAmount
          );

          if (result.success) {
            const txSignature =
              (result as any).signature || (result as any).result?.signature;
            showSuccess(
              "Buy Order Placed",
              `Successfully placed buy order for ${quickBuyAmount} SOL of ${project.tokenSymbol}`,
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
              `You don't have enough balance to buy ${quickBuyAmount} SOL of ${project.tokenSymbol}.`
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
      });
    }, [
      loginModalContext,
      user,
      project.tokenAddress,
      project.tokenSymbol,
      quickBuyAmount,
      showSuccess,
      showError,
    ]);

    const handleSellToken = useCallback(async () => {
      loginModalContext.withAuth(async () => {
        setSellLoading(true);
        try {
          const result = await TradingService.sellToken(
            "0",
            project.tokenAddress,
            quickSellPercentage
          );

          if (result.success) {
            const txSignature =
              (result as any).signature || (result as any).result?.signature;
            showSuccess(
              "Sell Order Placed",
              `Successfully placed sell order for ${quickSellPercentage}% of ${project.tokenSymbol}`,
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
              `You don't have enough ${project.tokenSymbol} to sell ${quickSellPercentage}%.`
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
      });
    }, [
      loginModalContext,
      user,
      project.tokenAddress,
      project.tokenSymbol,
      quickSellPercentage,
      showSuccess,
      showError,
    ]);

    return (
      <div className="flex-shrink-0 bg-[#161616]  border border-white/[0.08] rounded-sm p-3 hover:bg-white/[0.06] hover:border-main-accent/30 transition-all duration-300 min-w-[400px] mx-2">
        <div className="flex items-center justify-between">
          {/* Token Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={project.tokenImage}
                  alt={project.tokenName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-main-accent to-main-highlight text-main-bg text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {project.bracket === "high"
                  ? "🔥"
                  : project.bracket === "mid"
                  ? "📈"
                  : "💎"}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="font-tiktok font-medium text-main-text cursor-pointer hover:text-main-accent transition-colors text-sm truncate"
                onClick={handleTokenClick}
              >
                {project.tokenSymbol}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Icon
                    icon="material-symbols:trending-up"
                    className="w-3 h-3 text-green-400"
                  />
                  <span className="font-tiktok text-green-400">
                    {project.buyTrades}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon
                    icon="material-symbols:trending-down"
                    className="w-3 h-3 text-red-400"
                  />
                  <span className="font-tiktok text-red-400">
                    {project.sellTrades}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon
                    icon="material-symbols:percent"
                    className="w-3 h-3 text-main-accent"
                  />
                  <span className="font-tiktok text-main-accent">
                    +{project.marketCapGain.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleBuyToken}
              disabled={buyLoading}
              className="bg-white/[0.05] cursor-pointer  hover:bg-white/[0.08] border border-white/[0.1] hover:border-green-400/50 rounded-lg px-2 py-1 transition-all duration-300"
            >
              <div className="flex items-center gap-1">
                {buyLoading ? (
                  <Icon
                    icon="eos-icons:loading"
                    className="w-3 h-3 text-green-400 animate-spin"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:trending-up"
                    className="w-3 h-3 text-green-400"
                  />
                )}
                <span className="font-tiktok text-xs text-main-text">
                  {buyLoading ? "..." : `${quickBuyAmount}`}
                </span>
              </div>
            </button>

            <button
              onClick={handleSellToken}
              disabled={sellLoading}
              className="bg-white/[0.05] cursor-pointer  hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/50 rounded-lg px-2 py-1 transition-all duration-300"
            >
              <div className="flex items-center gap-1">
                {sellLoading ? (
                  <Icon
                    icon="eos-icons:loading"
                    className="w-3 h-3 text-red-400 animate-spin"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:trending-down"
                    className="w-3 h-3 text-red-400"
                  />
                )}
                <span className="font-tiktok text-xs text-main-text">
                  {sellLoading ? "..." : `${quickSellPercentage}%`}
                </span>
              </div>
            </button>

            <button
              onClick={handleTokenClick}
              className="bg-white/[0.05] cursor-pointer  hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/50 rounded-lg p-1 transition-all duration-300"
            >
              <Icon
                icon="material-symbols:open-in-new"
                className="w-3 h-3 text-main-accent"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default TrendingRibbonItem;
