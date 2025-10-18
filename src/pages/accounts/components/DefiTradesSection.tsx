import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { DefiTrade } from "../../../types/api";
import { useSettings } from "../../../contexts/SettingsContext";
import { useAuth } from "../../../components/AuthProvider";
import { useToastContext } from "../../../contexts/ToastContext";
import TradingService from "../../../api/tradingService";

interface DefiTradesSectionProps {
  trades: DefiTrade[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  isWebSocketConnected?: boolean;
}

const DefiTradesSection: React.FC<DefiTradesSectionProps> = ({
  trades,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  isWebSocketConnected = false,
}) => {
  const [filteredTrades, setFilteredTrades] = useState<DefiTrade[]>(trades);
  const { quickBuyAmount, quickSellPercentage } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [buyLoading, setBuyLoading] = useState<{ [key: string]: boolean }>({});
  const [sellLoading, setSellLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  React.useEffect(() => {
    setFilteredTrades(trades);
  }, [trades]);

  const handleBuyToken = async (tokenAddress: string, tokenSymbol: string) => {
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

  const handleSellToken = async (tokenAddress: string, tokenSymbol: string) => {
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

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0";
    }

    if (value < 0.001) {
      return value.toExponential(2);
    }

    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }

    if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }

    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: value < 1 ? 6 : 2,
    });
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  const formatTxHash = (txHash: string): string => {
    return `${txHash.slice(0, 8)}...${txHash.slice(-4)}`;
  };

  const openTransaction = (txHash: string): void => {
    window.open(`https://solscan.io/tx/${txHash}`, "_blank");
  };

  const openDexScreenerWithWallet = (
    tokenAddress: string,
    walletAddress: string
  ): void => {
    const dexscreenerUrl = `https://dexscreener.com/solana/${tokenAddress}?wallet=${walletAddress}`;
    window.open(dexscreenerUrl, "_blank");
  };

  return (
    <div className="  min-h-[410px] max-h-[410px] overflow-y-auto scrollbar-hide bg-[#161616]  hover:bg-white/[0.06] border border-white/[0.08] hover:border-main-accent/30 rounded-sm p-4 lg:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-main-accent/5 mb-6">
      {/* Header with search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-2 gap-4 lg:gap-0">
        <div className="flex items-center gap-3">
          <h2 className="font-algance text-xl text-main-text">Defi Trades</h2>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isWebSocketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-main-light-text/60 font-tiktok">
              {isWebSocketConnected ? "Live" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="space-y-2">
          {filteredTrades.map((trade, index) => (
            <div
              key={
                trade.tradeId ||
                trade.transactionHash ||
                `${trade.timestamp}-${index}`
              }
              className="flex items-center justify-between py-1 px-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-main-accent/20 rounded-lg transition-all duration-300"
            >
              {/* Trade Type */}
              <div className="w-12">
                <span
                  className={`font-tiktok text-sm font-medium px-2 py-1 rounded-md ${
                    trade.tradeType === "buy"
                      ? "text-green-400 bg-green-400/15"
                      : "text-red-400 bg-red-400/15"
                  }`}
                >
                  {trade.tradeType === "buy" ? "Buy" : "Sell"}
                </span>
              </div>

              {/* Token Info & Amount */}
              <div className="flex-1 text-left ml-4">
                <div className="flex items-center gap-2">
                  {trade.tokenImage && (
                    <img
                      src={trade.tokenImage}
                      alt={trade.tokenName}
                      className="w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() =>
                        openDexScreenerWithWallet(
                          trade.tokenAddress,
                          trade.walletAddress
                        )
                      }
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      title={`Click to view ${trade.tokenSymbol} on DexScreener with wallet filter`}
                    />
                  )}
                  <div>
                    <span className="font-tiktok text-sm text-main-text font-medium">
                      {formatNumber(trade.amount)}
                    </span>
                    {trade.tokenName && (
                      <div className="font-tiktok text-xs text-main-light-text/60">
                        ${trade.tokenSymbol || "Unknown"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {trade.solSpent && trade.solSpent !== 0 && (
                <div className="flex-1 text-center">
                  <button className="font-tiktok text-sm text-main-accent hover:text-main-highlight transition-colors duration-300 cursor-pointer flex items-center gap-1 mx-auto">
                    <Icon icon="token-branded:solana" className="w-4 h-4" />
                    {Number(trade.solSpent).toFixed(2)} SOL
                  </button>
                </div>
              )}
              {/* Transaction Hash */}
              <div className="flex-1 text-center">
                <button
                  onClick={() => openTransaction(trade.transactionHash)}
                  className="font-tiktok text-xs text-main-accent hover:text-main-highlight transition-colors duration-300 cursor-pointer flex items-center gap-1 mx-auto"
                >
                  <Icon icon="material-symbols:link" className="w-4 h-4" />
                  TX: {formatTxHash(trade.transactionHash)}
                </button>
              </div>

              {/* Time */}
              <div className="w-44 text-center">
                <span className="font-tiktok text-sm text-main-light-text/60">
                  {formatTimeAgo(trade.timestamp)}
                </span>
              </div>

              {/* Buy/Sell Buttons */}
              <div className="w-52 text-right">
                <div className="flex gap-2">
                  {/* Buy Button */}
                  <button
                    onClick={() =>
                      handleBuyToken(trade.tokenAddress, trade.tokenSymbol)
                    }
                    disabled={buyLoading[trade.tokenAddress]}
                    className="relative w-full cursor-pointer overflow-hidden   bg-green-400/[0.08] hover:bg-green-400/[0.12] border border-green-400/[0.15] hover:border-green-400/50 rounded-lg px-4 py-2 flex items-center justify-center gap-1 transition-all duration-300 group/buy hover:shadow-lg hover:shadow-green-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-400/0 before:via-green-400/10 before:to-green-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
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
                        <Icon
                          icon="token-branded:solana"
                          className="w-3 h-3 text-green-400 group-hover/buy:text-green-300 transition-all duration-300 relative z-10"
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
                    className="relative w-full cursor-pointer overflow-hidden   bg-red-400/[0.08] hover:bg-red-400/[0.12] border border-red-400/[0.15] hover:border-red-400/50 rounded-lg px-4 py-2 flex items-center justify-center gap-1 transition-all duration-300 group/sell hover:shadow-lg hover:shadow-red-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/10 before:to-red-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
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
      </div>

      {/* Mobile Trades List */}
      <div className="lg:hidden space-y-3">
        {filteredTrades.map((trade, index) => (
          <div
            key={
              trade.tradeId ||
              trade.transactionHash ||
              `${trade.timestamp}-${index}`
            }
            className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-main-accent/20 rounded-lg p-3 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              {/* Trade Type */}
              <span
                className={`font-tiktok text-xs font-medium px-2 py-1 rounded-md ${
                  trade.tradeType === "buy"
                    ? "text-green-400 bg-green-400/15"
                    : "text-red-400 bg-red-400/15"
                }`}
              >
                {trade.tradeType === "buy" ? "Buy" : "Sell"}
              </span>

              {/* Time */}
              <span className="font-tiktok text-xs text-main-light-text/60">
                {formatTimeAgo(trade.timestamp)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              {/* Token */}
              <div className="flex items-center gap-2">
                {trade.tokenImage && (
                  <img
                    src={trade.tokenImage}
                    alt={trade.tokenName}
                    className="w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    onClick={() =>
                      openDexScreenerWithWallet(
                        trade.tokenAddress,
                        trade.walletAddress
                      )
                    }
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    title={`Click to view ${trade.tokenSymbol} on DexScreener with wallet filter`}
                  />
                )}
                <div>
                  <span className="font-tiktok text-sm text-main-text font-medium">
                    {trade.tokenSymbol || "Unknown"}
                  </span>
                  {trade.tokenName && (
                    <div className="font-tiktok text-xs text-main-light-text/60">
                      {trade.tokenName}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-end">
                <span className="font-tiktok text-xs text-main-light-text/80">
                  Amount
                </span>
                <span className="font-tiktok text-sm text-main-text">
                  {formatNumber(trade.amount)}
                </span>
              </div>
            </div>

            {trade.solSpent && trade.solSpent !== 0 && (
              <div className="flex flex-col items-end">
                <span className="font-tiktok text-sm text-main-text">
                  {Number(trade.solSpent).toFixed(2)} SOL
                </span>
              </div>
            )}
            {/* Transaction Hash */}
            <div className="flex justify-end mt-2 mb-3">
              <button
                onClick={() => openTransaction(trade.transactionHash)}
                className="font-tiktok text-xs text-main-accent hover:text-main-highlight transition-colors duration-300 cursor-pointer flex items-center gap-1"
              >
                <Icon icon="material-symbols:link" className="w-4 h-4" />
                TX: {formatTxHash(trade.transactionHash)}
              </button>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="flex gap-2 mt-2">
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
                    className="w-3 h-3 text-green-400 animate-spin relative z-10"
                  />
                ) : (
                  <>
                    <span className="font-tiktok text-xs text-green-400 group-hover/buy:text-green-300 transition-colors duration-300 relative z-10">
                      Buy {quickBuyAmount} SOL
                    </span>
                    <Icon
                      icon="material-symbols:trending-up"
                      className="w-3 h-3 text-green-400 group-hover/buy:text-green-300 transition-all duration-300 relative z-10"
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
                    className="w-3 h-3 text-red-400 animate-spin relative z-10"
                  />
                ) : (
                  <>
                    <span className="font-tiktok text-xs text-red-400 group-hover/sell:text-red-300 transition-colors duration-300 relative z-10">
                      Sell {quickSellPercentage}%
                    </span>
                    <Icon
                      icon="material-symbols:trending-down"
                      className="w-3 h-3 text-red-400 group-hover/sell:text-red-300 transition-all duration-300 relative z-10"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-5">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="w-7 h-7 cursor-pointer rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-main-accent/30 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.05] disabled:hover:border-white/[0.1]"
        >
          <Icon
            icon="mdi:chevron-left"
            className="w-4 h-4 text-main-light-text/60 hover:text-main-accent transition-colors duration-200"
          />
        </button>

        <div className="px-3 py-1 bg-[#161616]  border border-white/[0.08] rounded-lg">
          <span className="font-tiktok text-xs text-main-light-text/80">
            {currentPage} / {totalPages}
          </span>
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="w-7 h-7 cursor-pointer rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-main-accent/30 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.05] disabled:hover:border-white/[0.1]"
        >
          <Icon
            icon="mdi:chevron-right"
            className="w-4 h-4 text-main-light-text/60 hover:text-main-accent transition-colors duration-200"
          />
        </button>
      </div>
    </div>
  );
};

export default DefiTradesSection;
