import React from "react";
import { Icon } from "@iconify/react";

interface TokenPnLData {
  tokenSymbol: string;
  tokenName: string;
  tokenImage: string;
  tokenAddress: string;
  totalBought: number;
  totalSold: number;
  tokensHeld: number;
  totalInvestment: number;
  realizedPnL: number;
  realizedPnLSOL: number;
  realizedRoi: number;
  totalSalesValue: number;
  totalSolBought: number;
  totalSolSold: number;
  firstTrade: string;
  lastTrade: string;
  totalDuration: string;
  status: string;
  isActive: boolean;
  rank: number;
}

interface TokenPnLStats {
  wins: number;
  losses: number;
  totalPnlSol: string;
  totalPnlUsd: string;
}

interface TokenPnLSectionProps {
  tokens: TokenPnLData[];
  stats: TokenPnLStats;
  currentPage: number;
  totalPages: number;
  filter: string;
  onFilterChange: (filter: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  isRefreshing?: boolean;
}

const TokenPnLSection: React.FC<TokenPnLSectionProps> = ({
  tokens,
  stats,
  currentPage,
  totalPages,
  filter,
  onFilterChange,
  onPrevPage,
  onNextPage,
  isRefreshing = false,
}) => {
  const formatNumber = (value: number, decimals: number = 2): string => {
    if (value === 0) return "0";
    if (Math.abs(value) < 0.01) {
      return value.toExponential(2);
    }
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  // Format SOL values
  const formatSol = (value: number): string => {
    if (value === 0) return "0 SOL";
    if (Math.abs(value) < 0.001) {
      return `${value.toFixed(6)} SOL`;
    } else if (Math.abs(value) < 0.01) {
      return `${value.toFixed(4)} SOL`;
    }
    return `${formatNumber(value, 3)} SOL`;
  };

  // Format USD values
  const formatUsd = (value: number): string => {
    return `$${formatNumber(value, 2)}`;
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${formatNumber(value, 2)}%`;
  };

  // Format token amounts
  const formatTokenAmount = (value: number): string => {
    if (value >= 1000000) {
      return `${formatNumber(value / 1000000, 1)}M`;
    } else if (value >= 1000) {
      return `${formatNumber(value / 1000, 1)}K`;
    }
    return formatNumber(value, 0);
  };

  // Format time ago from timestamp
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

  return (
    <div
      className={`  bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-main-accent/30 rounded-2xl p-4 lg:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-main-accent/5 ${
        isRefreshing ? "opacity-80" : "opacity-100"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-0">
        <div className="flex items-center gap-3">
          <h2 className="font-algance text-xl text-main-text">Token PnL</h2>
          {/* Refresh indicator */}
          {isRefreshing && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-main-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-main-light-text/60 font-tiktok">
                Updating...
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center w-full lg:w-auto">
          <div className="flex gap-2 w-full lg:w-auto">
            {[
              { label: "Most Recent", value: "mostRecent" },
              { label: "Highest PnL", value: "highestPnl" },
              { label: "Lowest PnL", value: "lowestPnl" },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => onFilterChange(f.value)}
                className={`px-3 py-2 rounded-lg font-tiktok text-sm transition-all duration-200 border focus:outline-none 
                  ${
                    filter === f.value
                      ? "bg-main-accent/20 border-main-accent text-main-accent shadow"
                      : "bg-white/[0.05] border-white/[0.1] text-main-text hover:bg-main-accent/10 hover:border-main-accent/40"
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PnL Summary */}
      <div
        className={`flex items-center justify-between mb-4 lg:mb-6 p-3 lg:p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl transition-all duration-300 ${
          isRefreshing ? "opacity-70" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 lg:gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tiktok text-sm text-green-400">
                {stats.wins}
              </span>
              <span className="font-tiktok text-sm text-main-light-text/60">
                /
              </span>
              <span className="font-tiktok text-sm text-red-400">
                {stats.losses}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-algance text-lg lg:text-xl ${
              stats.totalPnlSol.startsWith("+") ||
              stats.totalPnlSol.startsWith("0")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {stats.totalPnlSol} ({stats.totalPnlUsd})
          </div>
        </div>
      </div>

      {/* Desktop Token PnL List */}
      <div
        className={`hidden lg:block space-y-3 transition-all duration-300 ${
          isRefreshing ? "opacity-70" : "opacity-100"
        }`}
      >
        {tokens.map((token) => (
          <div
            key={token.tokenAddress}
            className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-main-accent/20 rounded-xl transition-all duration-300"
          >
            {/* Token Info */}
            <div className="flex items-center gap-3 flex-1">
              <a
                href={`https://dexscreener.com/solana/${token.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center text-lg hover:ring-2 hover:ring-main-accent/50 transition-all duration-300"
              >
                <img
                  src={token.tokenImage}
                  alt={token.tokenName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </a>
              <div>
                <a
                  href={`https://dexscreener.com/solana/${token.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-tiktok text-main-text font-medium hover:text-main-accent transition-colors duration-300"
                >
                  {token.tokenSymbol}
                </a>
                <div className="font-tiktok text-xs text-main-light-text/60">
                  {formatTimeAgo(token.lastTrade)}
                </div>
              </div>
            </div>

            {/* PnL */}
            <div className="text-right mr-6">
              <div
                className={`font-tiktok text-sm font-medium ${
                  token.realizedPnLSOL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatSol(token.realizedPnLSOL)} (
                {formatUsd(token.realizedPnL)})
              </div>
            </div>

            {/* Trade Details */}
            <div className="flex items-center gap-6 text-xs">
              {/* Bought */}
              <div className="text-center">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Bought
                </div>
                <div className="font-tiktok text-main-text">
                  {formatSol(token.totalSolBought)}
                </div>
                <div className="font-tiktok text-main-light-text/60">
                  ({formatTokenAmount(token.totalBought)})
                </div>
              </div>

              {/* Sold */}
              <div className="text-center">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Sold
                </div>
                <div className="font-tiktok text-main-text">
                  {formatSol(token.totalSolSold)}
                </div>
                <div className="font-tiktok text-main-light-text/60">
                  ({formatTokenAmount(token.totalSold)})
                </div>
              </div>

              {/* Realized ROI */}
              <div className="text-center">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Realized ROI
                </div>
                <div
                  className={`font-tiktok ${
                    token.realizedRoi >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatPercentage(token.realizedRoi)}
                </div>
              </div>

              {/* Duration */}
              <div className="text-center">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Duration
                </div>
                <div className="font-tiktok text-main-text">
                  {token.totalDuration}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Token PnL List */}
      <div
        className={`lg:hidden space-y-3 transition-all duration-300 ${
          isRefreshing ? "opacity-70" : "opacity-100"
        }`}
      >
        {tokens.map((token) => (
          <div
            key={token.tokenAddress}
            className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-main-accent/20 rounded-xl p-3 transition-all duration-300"
          >
            {/* Token Info and PnL */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex-shrink-0">
                  <img
                    src={token.tokenImage}
                    alt={token.tokenName}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <div className="font-tiktok text-main-text font-medium">
                    {token.tokenSymbol}
                  </div>
                  <div className="font-tiktok text-xs text-main-light-text/60">
                    {formatTimeAgo(token.lastTrade)}
                  </div>
                </div>
              </div>

              <div>
                <div
                  className={`font-tiktok text-sm font-medium ${
                    token.realizedPnLSOL >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatSol(token.realizedPnLSOL)}
                </div>
                <div
                  className={`font-tiktok text-xs ${
                    token.realizedPnL >= 0
                      ? "text-green-400/70"
                      : "text-red-400/70"
                  }`}
                >
                  {formatUsd(token.realizedPnL)}
                </div>
              </div>
            </div>

            {/* Trade Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Bought */}
              <div className="bg-white/[0.01] p-2 rounded-lg">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Bought
                </div>
                <div className="font-tiktok text-main-text">
                  {formatSol(token.totalSolBought)}
                </div>
                <div className="font-tiktok text-main-light-text/60 text-xs">
                  ({formatTokenAmount(token.totalBought)})
                </div>
              </div>

              {/* Sold */}
              <div className="bg-white/[0.01] p-2 rounded-lg">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Sold
                </div>
                <div className="font-tiktok text-main-text">
                  {formatSol(token.totalSolSold)}
                </div>
                <div className="font-tiktok text-main-light-text/60 text-xs">
                  ({formatTokenAmount(token.totalSold)})
                </div>
              </div>

              {/* Realized ROI */}
              <div className="bg-white/[0.01] p-2 rounded-lg">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Realized ROI
                </div>
                <div
                  className={`font-tiktok ${
                    token.realizedRoi >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatPercentage(token.realizedRoi)}
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white/[0.01] p-2 rounded-lg">
                <div className="font-tiktok text-main-light-text/60 mb-1">
                  Duration
                </div>
                <div className="font-tiktok text-main-text">
                  {token.totalDuration}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className={`
            flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
            ${
              currentPage <= 1
                ? "border-white/[0.05] bg-white/[0.02] text-main-light-text/30 cursor-not-allowed"
                : "border-white/[0.1] bg-white/[0.05] text-main-light-text/70 hover:border-main-accent/40 hover:bg-main-accent/10 hover:text-main-accent cursor-pointer"
            }
          `}
        >
          <Icon icon="mdi:chevron-left" className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-3">
          <span className="font-tiktok text-sm text-main-text font-medium bg-main-accent/10 border border-main-accent/20 px-2 py-1 rounded">
            {currentPage}
          </span>
          <span className="font-tiktok text-sm text-main-light-text/40">/</span>
          <span className="font-tiktok text-sm text-main-light-text/70">
            {totalPages || 1}
          </span>
        </div>

        <button
          onClick={onNextPage}
          disabled={totalPages > 0 && currentPage >= totalPages}
          className={`
            flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
            ${
              totalPages > 0 && currentPage >= totalPages
                ? "border-white/[0.05] bg-white/[0.02] text-main-light-text/30 cursor-not-allowed"
                : "border-white/[0.1] bg-white/[0.05] text-main-light-text/70 hover:border-main-accent/40 hover:bg-main-accent/10 hover:text-main-accent cursor-pointer"
            }
          `}
        >
          <Icon icon="mdi:chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TokenPnLSection;
