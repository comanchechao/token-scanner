import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { LatestTrade } from "../../../types/api";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "../../../utils/formatNumber";
import { useSettings } from "../../../contexts/SettingsContext";
import { useAuth } from "../../../components/AuthProvider";
import { useToastContext } from "../../../contexts/ToastContext";
import TradingService from "../../../api/tradingService";

export interface TraderAccount {
  username: string;
  xHandle?: string;
  verified: boolean;
  avatar: string;
  walletAddress: string;
  profileImage: string;
  trades: LatestTrade[];
}

interface TradesCardProps {
  account: TraderAccount;
}

const TradesCard: React.FC<TradesCardProps> = React.memo(
  ({ account }) => {
    const [trades, setTrades] = useState<LatestTrade[]>(account.trades);
    const [animatingTradeIndices, setAnimatingTradeIndices] = useState<
      number[]
    >([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tradesPerPage = 3;
    const { quickBuyAmount, quickSellPercentage } = useSettings();
    const { user, isAuthenticated } = useAuth();
    const { showSuccess, showError, showWarning } = useToastContext();
    const [buyLoading, setBuyLoading] = useState<{ [key: string]: boolean }>(
      {}
    );
    const [sellLoading, setSellLoading] = useState<{ [key: string]: boolean }>(
      {}
    );

    const totalPages = Math.ceil(trades.length / tradesPerPage);
    const startIndex = (currentPage - 1) * tradesPerPage;
    const endIndex = startIndex + tradesPerPage;
    const currentTrades = trades.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      setAnimatingTradeIndices([]);
    };

    const handleBuyToken = async (
      tokenAddress: string,
      tokenSymbol: string
    ) => {
      if (!isAuthenticated || !user) {
        showWarning("Authentication Required", "Please login to trade tokens");
        return;
      }

      setBuyLoading((prev) => ({ ...prev, [tokenAddress]: true }));
      try {
        const result = await TradingService.buyToken(
          "0",
          tokenAddress,
          quickBuyAmount
        );

        if (result.success) {
          const txSignature =
            (result as any).signature || (result as any).result?.signature;
          showSuccess(
            "Buy Order Placed",
            `Successfully placed buy order for ${quickBuyAmount} SOL of ${tokenSymbol}`,
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
            `You don't have enough balance to buy ${quickBuyAmount} SOL of ${tokenSymbol}.`
          );
        } else {
          showError(
            "Buy Order Failed",
            error.message || "Failed to place buy order"
          );
        }
      } finally {
        setBuyLoading((prev) => ({ ...prev, [tokenAddress]: false }));
      }
    };

    const handleSellToken = async (
      tokenAddress: string,
      tokenSymbol: string
    ) => {
      if (!isAuthenticated || !user) {
        showWarning("Authentication Required", "Please login to trade tokens");
        return;
      }

      setSellLoading((prev) => ({ ...prev, [tokenAddress]: true }));
      try {
        const result = await TradingService.sellToken(
          "0",
          tokenAddress,
          quickSellPercentage
        );

        if (result.success) {
          const txSignature =
            (result as any).signature || (result as any).result?.signature;
          showSuccess(
            "Sell Order Placed",
            `Successfully placed sell order for ${quickSellPercentage}% of ${tokenSymbol}`,
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
            `You don't have enough ${tokenSymbol} to sell ${quickSellPercentage}%.`
          );
        } else {
          showError(
            "Sell Order Failed",
            error.message || "Failed to place sell order"
          );
        }
      } finally {
        setSellLoading((prev) => ({ ...prev, [tokenAddress]: false }));
      }
    };

    useEffect(() => {
      if (JSON.stringify(trades) !== JSON.stringify(account.trades)) {
        const newIndices: number[] = [];
        account.trades.forEach((trade, index) => {
          const existingTradeIndex = trades.findIndex(
            (t) => t.tradeId === trade.tradeId
          );
          if (existingTradeIndex === -1) {
            newIndices.push(index);
          }
        });

        if (newIndices.length > 0) {
          setAnimatingTradeIndices(newIndices);
          setCurrentPage(1); // Reset to first page when new trades arrive

          setTimeout(() => {
            setAnimatingTradeIndices([]);
          }, 1500);
        }

        setTrades(account.trades);
      }
    }, [account.trades]);

    const formatNumber = (value: number | string): string => {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (numValue >= 1000000) {
        return `${(numValue / 1000000).toFixed(1)}M`;
      } else if (numValue >= 1000) {
        return `${(numValue / 1000).toFixed(1)}k`;
      }
      return numValue.toFixed(1);
    };

    const formatTimeAgo = (timestamp: string | number): string => {
      try {
        const date =
          typeof timestamp === "number"
            ? new Date(timestamp)
            : new Date(timestamp);

        const timeAgo = formatDistanceToNow(date, { addSuffix: false });

        // Simplify the format
        if (timeAgo.includes("less than a minute")) return "now";
        if (timeAgo.includes("minute"))
          return timeAgo.replace(" minutes", "m").replace(" minute", "m");
        if (timeAgo.includes("hour"))
          return timeAgo.replace(" hours", "h").replace(" hour", "h");
        if (timeAgo.includes("day"))
          return timeAgo.replace(" days", "d").replace(" day", "d");

        return timeAgo;
      } catch (error) {
        console.error("Error formatting time:", error, timestamp);
        return "unknown";
      }
    };

    return (
      <div className="group  relative   bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/50 rounded-3xl p-4 lg:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-main-accent/10 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10">
        <div className="flex justify-between items-start mb-4 lg:mb-6">
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center text-xl lg:text-2xl ring-2 ring-white/10 group-hover:ring-main-accent/20 transition-all duration-300 overflow-hidden">
              {account.profileImage ? (
                <img
                  src={account.profileImage}
                  alt={account.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                account.avatar
              )}
            </div>

            {/* Account Info */}
            <div>
              <div className="flex items-center gap-1 lg:gap-2 mb-1">
                <Link
                  to={`/accounts/${account.walletAddress}`}
                  className="font-algance text-xl lg:text-2xl text-main-text hover:text-main-accent transition-colors duration-300 cursor-pointer drop-shadow-sm"
                >
                  {account.username}
                </Link>
                {account.verified && (
                  <Icon
                    icon="material-symbols:verified"
                    className="w-4 h-4 lg:w-5 lg:h-5 text-main-accent flex-shrink-0"
                  />
                )}
                {account.xHandle && (
                  <Icon
                    icon="streamline-logos:x-twitter-logo-block"
                    className="w-4 h-4 lg:w-5 lg:h-5 text-main-light-text/60 flex-shrink-0"
                  />
                )}
              </div>
              {account.xHandle && (
                <p className="font-tiktok text-xs lg:text-sm text-main-light-text/80">
                  {account.xHandle}
                </p>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0 flex items-center gap-1 lg:gap-2 ml-2 lg:ml-4">
            <p className="font-tiktok text-xs text-main-light-text/60 max-w-[80px] lg:max-w-[100px] truncate">
              {account.walletAddress}
            </p>
            <a
              href={`https://solscan.io/account/${account.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-main-accent hover:text-main-highlight transition-all duration-300 inline-block mt-1 hover:scale-110"
            >
              <Icon
                icon="material-symbols:open-in-new"
                className="w-4 h-4 lg:w-5 lg:h-5 drop-shadow-sm"
              />
            </a>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block divide-y divide-white/[0.08] -mt-2">
          {currentTrades.map((trade, index) => (
            <div
              key={`${trade.tradeId}-${index}`}
              className={`grid grid-cols-3 items-center font-tiktok text-sm gap-4 py-4 transition-all duration-500 rounded-lg -mx-2 px-2 ${
                animatingTradeIndices.includes(index)
                  ? "animate-highlight-fade"
                  : ""
              }`}
            >
              <div
                className={`flex items-center space-x-3 ${
                  animatingTradeIndices.includes(index)
                    ? "animate-slide-in"
                    : ""
                }`}
              >
                <span
                  className={`px-2 py-1 rounded-md text-xs   ${
                    trade.tradeType === "buy"
                      ? "text-green-400 bg-green-400/15 border border-green-400/30"
                      : "text-red-400 bg-red-400/15 border border-red-400/30"
                  }`}
                >
                  {trade.tradeType.toUpperCase()}
                </span>
                <span className="text-main-text text-[13px] font-medium">
                  {formatNumber(trade.amount)}{" "}
                  <span className="text-xs">${trade.tokenSymbol}</span>
                </span>
              </div>
              <div
                className={`text-center flex flex-col  text-main-light-text/80 text-[13px] ${
                  animatingTradeIndices.includes(index)
                    ? "animate-slide-in"
                    : ""
                }`}
              >
                <span>{formatCurrency(trade.solSpent ?? 0, "SOL")}</span>
                <span> {formatTimeAgo(trade.timestamp)}</span>
              </div>

              <div
                className={`flex justify-end ${
                  animatingTradeIndices.includes(index)
                    ? "animate-slide-in"
                    : ""
                }`}
              >
                <div className="flex gap-1.5">
                  {/* Buy Button */}
                  <button
                    onClick={() =>
                      handleBuyToken(trade.tokenAddress, trade.tokenSymbol)
                    }
                    disabled={buyLoading[trade.tokenAddress]}
                    className="relative cursor-pointer overflow-hidden   bg-green-400/[0.08] hover:bg-green-400/[0.12] border border-green-400/[0.15] hover:border-green-400/50 rounded-lg px-4 py-1.5 flex items-center justify-center gap-1 transition-all duration-300 group/buy hover:shadow-lg hover:shadow-green-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-400/0 before:via-green-400/10 before:to-green-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                    title="Buy Token"
                  >
                    {buyLoading[trade.tokenAddress] ? (
                      <Icon
                        icon="eos-icons:loading"
                        className="w-4 h-4 text-green-400 animate-spin relative z-10"
                      />
                    ) : (
                      <>
                        <span className="font-tiktok text-xs text-green-400 group-hover/buy:text-green-300 transition-colors duration-300 relative z-10">
                          Buy {quickBuyAmount}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Sell Button */}
                  <button
                    onClick={() =>
                      handleSellToken(trade.tokenAddress, trade.tokenSymbol)
                    }
                    disabled={sellLoading[trade.tokenAddress]}
                    className="relative cursor-pointer overflow-hidden   bg-red-400/[0.08] hover:bg-red-400/[0.12] border border-red-400/[0.15] hover:border-red-400/50 rounded-lg px-4 py-1.5 flex items-center justify-center gap-1 transition-all duration-300 group/sell hover:shadow-lg hover:shadow-red-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/10 before:to-red-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                    title="Sell Token"
                  >
                    {sellLoading[trade.tokenAddress] ? (
                      <Icon
                        icon="eos-icons:loading"
                        className="w-4 h-4 text-red-400 animate-spin relative z-10"
                      />
                    ) : (
                      <span className="font-tiktok text-xs text-red-400 group-hover/sell:text-red-300 transition-colors duration-300 relative z-10">
                        Sell {quickSellPercentage}%
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden divide-y divide-white/[0.08]">
          {currentTrades.map((trade, index) => (
            <div
              key={`${trade.tradeId}-${index}`}
              className={`py-3 transition-all duration-500 ${
                animatingTradeIndices.includes(index)
                  ? "animate-highlight-fade rounded-lg -mx-2 px-2"
                  : ""
              }`}
            >
              <div
                className={`flex justify-between items-center mb-2 ${
                  animatingTradeIndices.includes(index)
                    ? "animate-slide-in"
                    : ""
                }`}
              >
                <span
                  className={`px-2 py-1 rounded-md text-xs   ${
                    trade.tradeType === "buy"
                      ? "text-green-400 bg-green-400/15 border border-green-400/30"
                      : "text-red-400 bg-red-400/15 border border-red-400/30"
                  }`}
                >
                  {trade.tradeType.toUpperCase()}
                </span>
                <span className="font-tiktok text-xs text-main-light-text/80">
                  {formatTimeAgo(trade.timestamp)}
                </span>
              </div>

              <div
                className={`flex justify-between items-center mb-3 ${
                  animatingTradeIndices.includes(index)
                    ? "animate-slide-in"
                    : ""
                }`}
              >
                <span className="text-main-text text-sm font-medium">
                  {formatNumber(trade.amount)} ${trade.tokenSymbol}
                </span>
                <span className="text-main-light-text/80 text-xs">
                  {formatCurrency(trade.solSpent ?? 0, "SOL")}
                </span>
              </div>

              <div
                className={`flex gap-2 ${
                  animatingTradeIndices.includes(index)
                    ? "animate-slide-in"
                    : ""
                }`}
              >
                {/* Buy Button */}
                <button
                  onClick={() =>
                    handleBuyToken(trade.tokenAddress, trade.tokenSymbol)
                  }
                  disabled={buyLoading[trade.tokenAddress]}
                  className="flex-1 relative cursor-pointer overflow-hidden   bg-green-400/[0.08] hover:bg-green-400/[0.12] border border-green-400/[0.15] hover:border-green-400/50 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-all duration-300 group/buy hover:shadow-lg hover:shadow-green-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-400/0 before:via-green-400/10 before:to-green-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                  {buyLoading[trade.tokenAddress] ? (
                    <Icon
                      icon="eos-icons:loading"
                      className="w-3.5 h-3.5 text-green-400 animate-spin relative z-10"
                    />
                  ) : (
                    <>
                      <span className="font-tiktok text-xs text-green-400 group-hover/buy:text-green-300 transition-colors duration-300 relative z-10">
                        Buy {quickBuyAmount} SOL
                      </span>
                      <Icon
                        icon="material-symbols:trending-up"
                        className="w-3.5 h-3.5 text-green-400 group-hover/buy:text-green-300 transition-all duration-300 relative z-10"
                      />
                    </>
                  )}
                </button>

                {/* Sell Button */}
                <button
                  onClick={() =>
                    handleSellToken(trade.tokenAddress, trade.tokenSymbol)
                  }
                  disabled={sellLoading[trade.tokenAddress]}
                  className="flex-1 relative cursor-pointer overflow-hidden   bg-red-400/[0.08] hover:bg-red-400/[0.12] border border-red-400/[0.15] hover:border-red-400/50 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-all duration-300 group/sell hover:shadow-lg hover:shadow-red-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/10 before:to-red-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                  {sellLoading[trade.tokenAddress] ? (
                    <Icon
                      icon="eos-icons:loading"
                      className="w-3.5 h-3.5 text-red-400 animate-spin relative z-10"
                    />
                  ) : (
                    <>
                      <span className="font-tiktok text-xs text-red-400 group-hover/sell:text-red-300 transition-colors duration-300 relative z-10">
                        Sell {quickSellPercentage}%
                      </span>
                      <Icon
                        icon="material-symbols:trending-down"
                        className="w-3.5 h-3.5 text-red-400 group-hover/sell:text-red-300 transition-all duration-300 relative z-10"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 lg:mt-6 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative overflow-hidden   rounded-lg p-2 transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-white/[0.03] border border-white/[0.05] text-main-light-text/30 cursor-not-allowed"
                    : "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent"
                }`}
              >
                <Icon
                  icon="material-symbols:chevron-left"
                  className="w-4 h-4"
                />
              </button>

              {/* Page Numbers */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 3; // Show 3 pages at a time
                const halfVisible = Math.floor(maxVisiblePages / 2);

                let startPage = Math.max(1, currentPage - halfVisible);
                let endPage = Math.min(
                  totalPages,
                  startPage + maxVisiblePages - 1
                );

                // Adjust start page if we're near the end
                if (endPage === totalPages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(1);
                  if (startPage > 2) {
                    pages.push("...");
                  }
                }

                // Add visible pages
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push("...");
                  }
                  if (endPage !== totalPages) {
                    pages.push(totalPages);
                  }
                }

                return pages.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-2 font-tiktok text-xs text-main-light-text/60"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`relative overflow-hidden   rounded-lg px-3 py-2 font-tiktok text-xs transition-all duration-300 ${
                        page === currentPage
                          ? "bg-main-accent/20 border border-main-accent/50 text-main-accent"
                          : "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent"
                      }`}
                    >
                      {page}
                    </button>
                  )
                );
              })()}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative overflow-hidden   rounded-lg p-2 transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-white/[0.03] border border-white/[0.05] text-main-light-text/30 cursor-not-allowed"
                    : "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent"
                }`}
              >
                <Icon
                  icon="material-symbols:chevron-right"
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
  (prevProps: TradesCardProps, nextProps: TradesCardProps) => {
    // Only re-render if the account's trades have actually changed
    return (
      prevProps.account.walletAddress === nextProps.account.walletAddress &&
      JSON.stringify(
        prevProps.account.trades.map((t: LatestTrade) => t.tradeId)
      ) ===
        JSON.stringify(
          nextProps.account.trades.map((t: LatestTrade) => t.tradeId)
        )
    );
  }
);

export default TradesCard;
