import React, { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../contexts/SettingsContext";
import { useAuth } from "../../../components/AuthProvider";
import { useToastContext } from "../../../contexts/ToastContext";
import TradingService from "../../../api/tradingService";

export interface Trade {
  username: string;
  tradeType: "buy" | "sell";
  amount: string;
  price: string;
  timestamp: string;
  walletAddress: string;
  solSpent: string;
  tokenImage: string;
  profileImage: string;
}

export interface Token {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImage: string;
  lastTradeTimestamp: number;
  firstAddedTimestamp: number;
  totalTrades: number;
  marketCap: number;
  firstTradeMarketCap: number;
  marketCapGain: number;
  trades: Trade[];
  tradesCount: number;
  buyTrades: number;
  sellTrades: number;
}

interface TokenCardProps {
  token: Token;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 5;
  const { quickBuyAmount, quickSellPercentage } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const navigate = useNavigate();

  const handleTokenClick = useCallback(() => {
    window.open(
      `https://dexscreener.com/solana/${token.tokenAddress}`,
      "_blank"
    );
  }, [token.tokenAddress]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(token.tokenAddress);
      showSuccess(
        "Address Copied",
        "Token contract address copied to clipboard"
      );
    } catch (err) {
      console.error("Failed to copy address:", err);
      showError("Copy Failed", "Failed to copy address to clipboard");
    }
  }, [token.tokenAddress, showSuccess, showError]);

  const handleUsernameClick = useCallback(
    (walletAddress: string) => {
      navigate(`/accounts/${walletAddress}`);
    },
    [navigate]
  );

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

  const formatPrice = (price: string | number) => {
    const priceNum = typeof price === "string" ? parseFloat(price) : price;
    if (priceNum >= 1) {
      return `$${priceNum.toFixed(2)}`;
    } else {
      return `$${priceNum.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}K`;
    }
    return `$${marketCap}`;
  };

  const formatTimeAgo = (timestamp: string | number) => {
    const now = Date.now();
    const time =
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    const diff = now - time;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    if (days > 0) return `${days}d`;
    if (seconds <= 0) return "1s";
    return `${seconds}s`;
  };

  const formatMarketCapGain = (gain: number) => {
    const percentage = (gain / 100) * 100;
    const isPositive = percentage >= 0;
    const color = isPositive ? "text-green-400" : "text-red-400";
    const sign = isPositive ? "+" : "";
    return { text: `${sign}${percentage.toFixed(1)}%`, color };
  };

  return (
    <div className="group relative   bg-[#161616]  hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/50 rounded-sm p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-main-accent/10 before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-4">
          {/* Token Icon */}
          <div className="relative">
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-main-accent/30 transition-all duration-300 overflow-hidden">
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
                className={`w-6 h-6 text-main-accent ${
                  token.tokenImage ? "hidden" : ""
                }`}
              />
            </div>
          </div>

          {/* Token Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleTokenClick}
                className="font-tiktok text-sm text-main-light-text/70 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-main-accent/50 hover:text-main-accent transition-all duration-300 cursor-pointer"
              >
                ${token.tokenSymbol}
              </button>
              {(() => {
                const gainInfo = formatMarketCapGain(token.marketCapGain);
                return (
                  <span
                    className={`font-tiktok text-xs font-medium ${gainInfo.color}`}
                  >
                    {gainInfo.text}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-tiktok text-xs text-main-light-text/50">
                {token.tokenAddress.slice(0, 8)}...
                {token.tokenAddress.slice(-4)}
              </span>
              <button
                onClick={handleCopyAddress}
                className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/50 transition-all duration-300 cursor-pointer"
                title="Copy contract address"
              >
                <Icon
                  icon="material-symbols:content-copy"
                  className="w-3 h-3 text-main-light-text/60"
                />
              </button>
            </div>
          </div>
        </div>{" "}
        <div className="  w-full bg-[#161616]  rounded-sm p-2 border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-1">
            <Icon
              icon="material-symbols:history"
              className="w-4 h-4 text-main-highlight"
            />
            <span className="font-tiktok text-xs text-main-light-text/70">
              First MC
            </span>
          </div>
          <div className="font-algance text-sm text-main-text">
            {formatMarketCap(token.firstTradeMarketCap)}
          </div>
        </div>
      </div>

      {/* Stats - Both Market Caps Side by Side */}
      <div className="grid grid-cols-1   mb-3 relative z-10">
        <div className="  bg-[#161616]  rounded-sm w-full p-2 border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-1">
            <Icon
              icon="material-symbols:bar-chart"
              className="w-4 h-4 text-main-accent"
            />
            <span className="font-tiktok text-xs text-main-light-text/70">
              Current MC
            </span>
          </div>
          <div className="font-algance text-sm text-main-text">
            {formatMarketCap(token.marketCap)}
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-tiktok text-sm text-main-light-text flex items-center gap-2">
            <Icon icon="material-symbols:timeline" className="w-4 h-4" />
            Recent Trades
          </h4>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-tiktok text-xs text-main-light-text/60">
              {token.totalTrades} total
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {token.trades && token.trades.length > 0 ? (
            <>
              {token.trades
                .slice(
                  (currentPage - 1) * tradesPerPage,
                  currentPage * tradesPerPage
                )
                .map((trade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-sm   bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-tiktok   ${
                          trade.tradeType === "buy"
                            ? "text-green-400 bg-green-400/15 border border-green-400/30"
                            : "text-red-400 bg-red-400/15 border border-red-400/30"
                        }`}
                      >
                        {trade.tradeType.toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <div className="font-tiktok text-sm text-main-text">
                          {parseFloat(trade.solSpent).toFixed(2)} SOL
                        </div>
                        <button
                          onClick={() =>
                            handleUsernameClick(trade.walletAddress)
                          }
                          className="font-tiktok text-xs text-main-light-text/60 hover:text-main-accent transition-colors duration-200 cursor-pointer text-left"
                        >
                          @{trade.username}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-tiktok text-xs text-main-light-text/70">
                        {formatPrice(trade.price)}
                      </div>
                      <div className="font-tiktok text-xs text-main-light-text/50">
                        {formatTimeAgo(trade.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Pagination Controls */}
              {token.trades.length > tradesPerPage && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Icon
                      icon="material-symbols:chevron-left"
                      className="w-4 h-4 text-main-light-text"
                    />
                  </button>

                  <span className="font-tiktok text-xs text-main-light-text/70 px-2">
                    {currentPage} /{" "}
                    {Math.ceil(token.trades.length / tradesPerPage)}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          Math.ceil(token.trades.length / tradesPerPage),
                          currentPage + 1
                        )
                      )
                    }
                    disabled={
                      currentPage >=
                      Math.ceil(token.trades.length / tradesPerPage)
                    }
                    className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Icon
                      icon="material-symbols:chevron-right"
                      className="w-4 h-4 text-main-light-text"
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <span className="font-tiktok text-xs text-main-light-text/50">
                No recent trades
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6 relative z-10">
        <button
          onClick={handleBuyToken}
          disabled={buyLoading}
          className="flex-1 relative overflow-hidden   bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-green-400/50 rounded-sm px-4 py-2 transition-all duration-300 group/btn hover:shadow-lg hover:shadow-green-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-400/0 before:via-green-400/10 before:to-green-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            {buyLoading ? (
              <Icon
                icon="eos-icons:loading"
                className="text-green-400 animate-spin"
                width={20}
                height={20}
              />
            ) : (
              <Icon
                icon="fluent:eye-tracking-16-regular"
                className=" text-green-400 group-hover/btn:text-green-400 transition-colors duration-300"
                width={20}
                height={20}
              />
            )}
            <span className="font-tiktok text-sm text-main-text group-hover/btn:text-green-400 transition-colors duration-300">
              {buyLoading ? "Buying..." : `Buy ${quickBuyAmount} SOL`}
            </span>
          </div>
        </button>

        <button
          onClick={handleSellToken}
          disabled={sellLoading}
          className="flex-1 relative overflow-hidden   bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/50 rounded-sm px-4 py-3 transition-all duration-300 group/btn hover:shadow-lg hover:shadow-red-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/10 before:to-red-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            {sellLoading ? (
              <Icon
                icon="eos-icons:loading"
                className="text-red-400 animate-spin"
                width={20}
                height={20}
              />
            ) : (
              <Icon
                icon="material-symbols:sell"
                className="  text-red-400 group-hover/btn:text-red-400 transition-colors duration-300"
                width={20}
                height={20}
              />
            )}
            <span className="font-tiktok text-sm text-main-text group-hover/btn:text-red-400 transition-colors duration-300">
              {sellLoading ? "Selling..." : `Sell ${quickSellPercentage}%`}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TokenCard;
