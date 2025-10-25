import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useSettings } from "../../../contexts/SettingsContext";
import { useAuth } from "../../../components/AuthProvider";
import { useToastContext } from "../../../contexts/ToastContext";
import { useLoginModalContext } from "../../../contexts/LoginModalContext";
import TradingService from "../../../api/tradingService";

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    avatar: string;
    action: string;
    amount: string;
    token: string;
    price: string;
    timestamp: string;
    type: "buy" | "sell";
    walletAddress: string;
    tokenAddress: string;
    transactionHash: string;
    solSpent: string;
  };
  isFirst: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = React.memo(
  ({ activity, isFirst }) => {
    const navigate = useNavigate();
    const { quickBuyAmount, quickSellPercentage } = useSettings();
    const { user } = useAuth();
    const { showSuccess, showError } = useToastContext();
    const loginModalContext = useLoginModalContext();
    const [buyLoading, setBuyLoading] = useState(false);
    const [sellLoading, setSellLoading] = useState(false);

    const handleTokenClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/tokens/${activity.tokenAddress}`);
      },
      [activity.tokenAddress, navigate]
    );

    const handleTransactionClick = useCallback(() => {
      window.open(
        `https://solscan.io/tx/${activity.transactionHash}`,
        "_blank"
      );
    }, [activity.transactionHash]);

    const handleBuyToken = useCallback(async () => {
      // Use the withAuth function to ensure the user is authenticated
      loginModalContext.withAuth(async () => {
        setBuyLoading(true);
        try {
          const result = await TradingService.buyToken(
            "0",
            activity.tokenAddress,
            quickBuyAmount
          );

          if (result.success) {
            console.log("Buy order successful:", result);
            const txSignature =
              (result as any).signature || (result as any).result?.signature;
            showSuccess(
              "Buy Order Placed",
              `Successfully placed buy order for ${quickBuyAmount} SOL of ${activity.token}`,
              undefined,
              txSignature
            );
          } else {
            console.log("Buy order failed:", result);
            showError(
              "Buy Order Failed",
              result.message || "Unknown error occurred"
            );
          }
        } catch (error: any) {
          console.error("Buy token error:", error);

          if (error.message === "Access token has expired") {
            showError(
              "Session Expired",
              "Your session has expired. Please log in again."
            );
          } else if (error.message === "Not enough balance") {
            showError(
              "Insufficient Balance",
              `You don't have enough balance to buy ${quickBuyAmount} SOL of ${activity.token}.`
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
      activity.tokenAddress,
      activity.token,
      quickBuyAmount,
      showSuccess,
      showError,
    ]);

    const handleSellToken = useCallback(async () => {
      loginModalContext.withAuth(async () => {
        setSellLoading(true);
        try {
          console.log("Attempting to sell token:", {
            tokenAddress: activity.tokenAddress,
            percentage: quickSellPercentage,
          });

          const result = await TradingService.sellToken(
            "0",
            activity.tokenAddress,
            quickSellPercentage
          );

          if (result.success) {
            console.log("Sell order successful:", result);
            const txSignature =
              (result as any).signature || (result as any).result?.signature;
            showSuccess(
              "Sell Order Placed",
              `Successfully placed sell order for ${quickSellPercentage}% of ${activity.token}`,
              undefined,
              txSignature
            );
          } else {
            console.log("Sell order failed:", result);
            showError(
              "Sell Order Failed",
              result.message || "Unknown error occurred"
            );
          }
        } catch (error: any) {
          console.error("Sell token error:", error);

          if (error.message === "Access token has expired") {
            showError(
              "Session Expired",
              "Your session has expired. Please log in again."
            );
          } else if (error.message === "Not enough balance") {
            showError(
              "Insufficient Balance",
              `You don't have enough ${activity.token} to sell ${quickSellPercentage}%.`
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
      activity.tokenAddress,
      activity.token,
      quickSellPercentage,
      showSuccess,
      showError,
    ]);

    return (
      <div
        key={activity.id}
        className={`relative bg-surface border-2 border-subtle rounded-sm p-2 transition-all duration-300 ${
          activity.timestamp === "now" ? "animate-slideInLeft" : ""
        } ${
          isFirst
            ? "!border-[var(--color-main-highlight)] border-opacity-10"
            : ""
        }`}
      >
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex-shrink-0">
                <img
                  src={activity.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <Link
                to={`/accounts/${activity.walletAddress}`}
                className="font-tiktok font-medium text-main-text whitespace-nowrap cursor-pointer"
              >
                {activity.name}
              </Link>
            </div>
            <div className="text-right">
              <span className="font-tiktok text-xs text-main-light-text whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="font-tiktok text-sm text-main-light-text">
                {activity.action}
              </span>
              <span
                className={`font-tiktok text-base cursor-pointer ${
                  activity.type === "buy" ? "text-green-600" : "text-red-600"
                }`}
                onClick={handleTransactionClick}
                title="View transaction on Solscan"
              >
                {activity.amount}
              </span>
              <span className="font-tiktok text-sm text-main-light-text">
                of
              </span>
              <span
                className="font-tiktok font-medium text-main-accent cursor-pointer"
                onClick={handleTokenClick}
              >
                ${activity.token}
              </span>
              <span className="font-tiktok text-sm text-main-light-text">
                at
              </span>
              <span className="font-tiktok font-medium text-main-highlight">
                {activity.price}
              </span>
              <span
                className={`font-tiktok text-sm ${
                  activity.type === "buy" ? "text-green-600" : "text-red-600"
                }`}
              >
                ({activity.solSpent})
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleBuyToken}
              disabled={buyLoading}
              className="flex-1 relative bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 hover:border-green-400/50 rounded-lg py-1.5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1 relative z-10">
                {buyLoading ? (
                  <Icon
                    icon="eos-icons:loading"
                    className="w-3.5 h-3.5 text-green-400 animate-spin"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:trending-up"
                    className="w-3.5 h-3.5 text-green-400 transition-colors duration-300"
                  />
                )}
                <span className="font-tiktok text-xs text-main-text transition-colors duration-300">
                  {buyLoading ? "Buying..." : `Buy ${quickBuyAmount} SOL`}
                </span>
              </div>
            </button>

            <button
              onClick={handleSellToken}
              disabled={sellLoading}
              className="flex-1 relative bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400/50 rounded-lg py-1.5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1 relative z-10">
                {sellLoading ? (
                  <Icon
                    icon="eos-icons:loading"
                    className="w-3.5 h-3.5 text-red-400 animate-spin"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:trending-down"
                    className="w-3.5 h-3.5 text-red-400 transition-colors duration-300"
                  />
                )}
                <span className="font-tiktok text-xs text-main-text transition-colors duration-300">
                  {sellLoading ? "Selling..." : `Sell ${quickSellPercentage}%`}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Layout (Original) */}
        <div className="hidden lg:flex items-center justify-between h-full relative z-10">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              <img
                src={activity.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                <Link
                  to={`/accounts/${activity.walletAddress}`}
                  className="font-tiktok text-sm font-medium text-main-text whitespace-nowrap cursor-pointer"
                >
                  {activity.name}
                </Link>
                <span className="font-tiktok text-sm text-main-light-text">
                  {activity.action}
                </span>
                <span
                  className={`font-tiktok text-sm cursor-pointer ${
                    activity.type === "buy" ? "text-green-600" : "text-red-600"
                  }`}
                  onClick={handleTransactionClick}
                  title="View transaction on Solscan"
                >
                  {activity.amount}
                </span>
                <span className="font-tiktok text-sm text-main-light-text">
                  of
                </span>
                <span
                  className="font-tiktok font-medium text-main-accent cursor-pointer"
                  onClick={handleTokenClick}
                >
                  ${activity.token}
                </span>
                <span className="font-tiktok text-sm text-main-light-text">
                  at
                </span>
                <span className="font-tiktok text-sm font-medium text-main-highlight">
                  {activity.price}
                </span>
                <span
                  className={`font-tiktok text-sm ${
                    activity.type === "buy" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ({activity.solSpent})
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <div className="text-right mr-3">
              <span className="font-tiktok text-sm text-main-light-text whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>

            {/* Buy and Sell Buttons */}
            <div className="flex   gap-2">
              <button
                onClick={handleBuyToken}
                disabled={buyLoading}
                className="relative bg-green-600/10 hover:bg-main-accent/20 border border-green-500/30 hover:border-green-600/50 rounded-lg px-3 py-2 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-1 relative z-10">
                  {buyLoading ? (
                    <Icon
                      icon="eos-icons:loading"
                      className="w-4 h-4 text-green-400 animate-spin"
                    />
                  ) : (
                    <Icon
                      icon="material-symbols:trending-up"
                      className="w-4 h-4 text-green-400 transition-colors duration-300"
                    />
                  )}
                  <span className="font-tiktok text-xs text-main-text transition-colors duration-300">
                    {buyLoading ? "Buying..." : `Buy ${quickBuyAmount} SOL`}
                  </span>
                </div>
              </button>

              <button
                onClick={handleSellToken}
                disabled={sellLoading}
                className="relative bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-600/50 rounded-lg px-3 py-2 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-1 relative z-10">
                  {sellLoading ? (
                    <Icon
                      icon="eos-icons:loading"
                      className="w-4 h-4 text-red-400 animate-spin"
                    />
                  ) : (
                    <Icon
                      icon="material-symbols:trending-down"
                      className="w-4 h-4 text-red-400 transition-colors duration-300"
                    />
                  )}
                  <span className="font-tiktok text-xs text-main-text transition-colors duration-300">
                    {sellLoading
                      ? "Selling..."
                      : `Sell ${quickSellPercentage}%`}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.activity === nextProps.activity &&
      prevProps.isFirst === nextProps.isFirst
    );
  }
);

export default ActivityCard;
