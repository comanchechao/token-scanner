import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { formatNumber, formatCurrency } from "../../../utils/formatNumber";

interface OtherBalance {
  balance: number;
  contractAddress?: string;
  mint?: string;
  decimals: number;
  amount?: number;
  account?: string;
  frozen?: boolean;
  symbol?: string;
  name?: string;
  lastUpdated?: string;
  tokenInfo?: {
    name?: string;
    symbol?: string;
    image?: string;
  };
}

interface AccountHolding {
  solanaBalance: number;
  otherBalances?: OtherBalance[];
  OtherBalances?: OtherBalance[];
}

interface UserMetrics {
  totalPnL: number;
  totalPnLSOL: number;
  totalTransactions: number;
  winningTransactions: number;
  losingTransactions: number;
  breakEvenTransactions: number;
  winRate: string;
  roiBuckets: {
    above500: number;
    range200to500: number;
    range50to200: number;
    range0to50: number;
    belowZero: number;
  };
}

interface StatsHoldingsSectionProps {
  holdings: AccountHolding[];
  winRate: number;
  avgDuration: string;
  topWin: string;
  volume: string;
  userMetrics?: UserMetrics;
  loading?: boolean;
}

const StatsHoldingsSection: React.FC<StatsHoldingsSectionProps> = ({
  holdings,
  winRate,
  avgDuration,
  topWin,
  volume,
  userMetrics,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState<"stats" | "holdings" | "overall">(
    "stats"
  );
  const [holdingsPage, setHoldingsPage] = useState(1);
  const holdingsPerPage = 3;

  const getTokenIcon = (tokenSymbol: string) => {
    switch (tokenSymbol.toLowerCase()) {
      case "sol":
        return "token-branded:solana";
      case "usdc":
        return "cryptocurrency:usdc";
      case "pump":
        return "material-symbols:token";
      case "gork":
        return "material-symbols:pets";
      case "wif":
        return "material-symbols:pets";
      case "pwecae":
        return "material-symbols:pets";
      case "pmup":
        return "material-symbols:token";
      default:
        return "material-symbols:token";
    }
  };

  const getTokenSymbol = (token: OtherBalance): string => {
    // Priority order: direct symbol, tokenInfo symbol, then fallback to address
    if (token.symbol) {
      return token.symbol;
    }
    if (token.tokenInfo?.symbol) {
      return token.tokenInfo.symbol;
    }
    const address = token.contractAddress || token.mint || "";
    return address.slice(0, 8);
  };

  const getOtherBalances = (holding: AccountHolding): OtherBalance[] => {
    const otherBalances = holding.otherBalances || holding.OtherBalances;

    if (otherBalances && Array.isArray(otherBalances)) {
      return otherBalances;
    }

    return [];
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const formatAmount = (amount: number | string): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
      return "0";
    }

    const isNegative = numAmount < 0;
    const absAmount = Math.abs(numAmount);

    let formattedValue: string;
    if (absAmount >= 1000000) {
      formattedValue = `${(absAmount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
      formattedValue = `${(absAmount / 1000).toFixed(1)}K`;
    } else {
      formattedValue = absAmount.toFixed(2);
    }

    return isNegative ? `-${formattedValue}` : formattedValue;
  };

  const formatBalance = (balance: number): string => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(1)}M`;
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(1)}K`;
    } else if (balance >= 1) {
      return balance.toFixed(2);
    } else {
      return balance.toFixed(6);
    }
  };

  // Calculate paginated holdings data
  const paginatedHoldings = useMemo(() => {
    if (!holdings || holdings.length === 0) return { items: [], totalPages: 0 };

    const allTokens: Array<{
      type: "sol" | "token";
      data: any;
      balance: number;
    }> = [];

    holdings.forEach((holding) => {
      // Add SOL if it has a balance
      if (holding.solanaBalance > 0) {
        allTokens.push({
          type: "sol",
          data: { solanaBalance: holding.solanaBalance },
          balance: holding.solanaBalance,
        });
      }

      // Add other tokens
      const otherBalances = getOtherBalances(holding);
      otherBalances.forEach((token) => {
        const tokenBalance = token.balance
          ? token.balance
          : token.balance / Math.pow(10, token.decimals || 0);

        if (tokenBalance >= 0.001) {
          allTokens.push({
            type: "token",
            data: token,
            balance: tokenBalance,
          });
        }
      });
    });

    // Sort by balance descending
    allTokens.sort((a, b) => b.balance - a.balance);

    const totalPages = Math.ceil(allTokens.length / holdingsPerPage);
    const startIndex = (holdingsPage - 1) * holdingsPerPage;
    const endIndex = startIndex + holdingsPerPage;
    const items = allTokens.slice(startIndex, endIndex);

    return { items, totalPages };
  }, [holdings, holdingsPage, holdingsPerPage]);

  return (
    <div className="backdrop-blur-lg min-h-auto overflow-y-auto bg-surface  hover:bg-main-accent/5 border border-subtle hover:border-main-accent/30 rounded-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-main-accent/5">
      {/* Tab Headers */}
      <div className="flex mb-6 border-b border-subtle">
        <button
          onClick={() => setActiveTab("stats")}
          className={`font-algance cursor-pointer text-lg pb-2 px-1 mr-6 transition-all duration-300 border-b-2 ${
            activeTab === "stats"
              ? "text-main-text border-main-accent"
              : "text-main-light-text/60 border-transparent hover:text-main-light-text/80"
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => {
            setActiveTab("holdings");
            setHoldingsPage(1);
          }}
          className={`font-algance cursor-pointer text-lg pb-2 px-1 mr-6 transition-all duration-300 border-b-2 ${
            activeTab === "holdings"
              ? "text-main-text border-main-accent"
              : "text-main-light-text/60 border-transparent hover:text-main-light-text/80"
          }`}
        >
          Holdings
        </button>
        <button
          onClick={() => setActiveTab("overall")}
          className={`font-algance cursor-pointer text-lg pb-2 px-1 transition-all duration-300 border-b-2 ${
            activeTab === "overall"
              ? "text-main-text border-main-accent"
              : "text-main-light-text/60 border-transparent hover:text-main-light-text/80"
          }`}
        >
          Overall
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-tiktok text-main-light-text/80">Solana</span>
            <div className="flex items-center gap-2">
              <span className="font-tiktok text-main-text">
                {formatCurrency(holdings[0]?.solanaBalance || 0, "SOL")}
              </span>
              <Icon
                icon="token-branded:solana"
                className="w-4 h-4 text-main-accent"
              />
            </div>
          </div>
          <div className="mt-16 border-t border-subtle"></div>
          <div className="flex justify-between items-center">
            <span className="font-tiktok text-main-light-text/80">
              Win Rate
            </span>
            <span className="font-tiktok text-main-text">
              {formatNumber(winRate)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-tiktok text-main-light-text/80">
              Avg Duration
            </span>
            <span className="font-tiktok text-main-text">
              {avgDuration.includes(".")
                ? avgDuration.split(".")[0]
                : avgDuration}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-tiktok text-main-light-text/80">Top Win</span>
            <span className="font-tiktok text-green-400">
              {formatCurrency(topWin, "SOL")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-tiktok text-main-light-text/80">Volume</span>
            <span className="font-tiktok text-main-text">
              {formatCurrency(volume, "SOL")}
            </span>
          </div>
        </div>
      )}

      {activeTab === "holdings" && (
        <div className="space-y-4">
          {/* Holdings List */}
          <div className="space-y-2">
            {paginatedHoldings.items.length === 0 ? (
              <div className="text-center py-8">
                <Icon
                  icon="material-symbols:account-balance-wallet-outline"
                  className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
                />
                <div className="font-tiktok text-sm text-main-light-text/60">
                  No holdings found
                </div>
              </div>
            ) : (
              paginatedHoldings.items.map((item, index) => {
                if (item.type === "sol") {
                  return (
                    <div
                      key={`sol-${index}`}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          icon={getTokenIcon("SOL")}
                          className="w-6 h-6 text-main-accent"
                        />
                        <div>
                          <div className="font-tiktok text-main-text text-sm">
                            SOL
                          </div>
                          <div className="font-tiktok text-main-light-text/60 text-xs">
                            Solana
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-tiktok text-main-text text-sm">
                          {formatBalance(item.data.solanaBalance)}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const token = item.data;
                  const tokenSymbol = getTokenSymbol(token);
                  const tokenName =
                    token.name || token.tokenInfo?.name || tokenSymbol;
                  const tokenKey =
                    token.contractAddress ||
                    token.mint ||
                    token.account ||
                    `token-${index}`;

                  return (
                    <div
                      key={tokenKey}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        {token.tokenInfo?.image ? (
                          <img
                            src={token.tokenInfo.image}
                            alt={tokenSymbol}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <Icon
                            icon={getTokenIcon(tokenSymbol)}
                            className="w-6 h-6 text-main-accent"
                          />
                        )}
                        <div>
                          <div className="font-tiktok text-main-text text-sm">
                            {tokenSymbol}
                          </div>
                          {tokenName !== tokenSymbol && (
                            <div className="font-tiktok text-main-light-text/60 text-xs">
                              {tokenName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-tiktok text-main-text text-sm">
                          {formatBalance(item.balance)}
                        </div>
                        {token.frozen && (
                          <div className="font-tiktok text-red-400 text-xs">
                            Frozen
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>

          {/* Pagination Controls */}
          {paginatedHoldings.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-subtle">
              <button
                onClick={() => setHoldingsPage((prev) => Math.max(1, prev - 1))}
                disabled={holdingsPage === 1}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                  holdingsPage === 1
                    ? "text-main-light-text/40 cursor-not-allowed"
                    : "text-main-light-text/80 hover:text-main-text hover:bg-main-accent/5"
                }`}
              >
                <Icon
                  icon="material-symbols:chevron-left"
                  className="w-4 h-4"
                />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-main-light-text/60 text-xs">
                  Page {holdingsPage} of {paginatedHoldings.totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  setHoldingsPage((prev) =>
                    Math.min(paginatedHoldings.totalPages, prev + 1)
                  )
                }
                disabled={holdingsPage === paginatedHoldings.totalPages}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                  holdingsPage === paginatedHoldings.totalPages
                    ? "text-main-light-text/40 cursor-not-allowed"
                    : "text-main-light-text/80 hover:text-main-text hover:bg-main-accent/5"
                }`}
              >
                <Icon
                  icon="material-symbols:chevron-right"
                  className="w-4 h-4"
                />
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "overall" && (
        <div className="space-y-6">
          {loading || !userMetrics ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-accent"></div>
            </div>
          ) : (
            <>
              {/* Total PNL */}
              <div className="flex items-center justify-between">
                <span className="text-main-light-text/70 text-sm mb-1">
                  Total PNL
                </span>
                <span
                  className={`text-lg font-bold ${
                    userMetrics.totalPnL >= 0
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  {userMetrics.totalPnL >= 0 ? "+" : ""}
                  {formatAmount(userMetrics.totalPnL)}
                </span>
              </div>

              {/* Total Transactions */}
              <div className="flex items-center justify-between">
                <span className="text-main-light-text/70 text-xs">
                  Total Trades
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    {userMetrics.totalTransactions}
                  </span>
                  <span className="text-xs text-green-500">
                    {userMetrics.winningTransactions}
                  </span>
                  <span className="text-xs text-main-light-text/70">/</span>
                  <span className="text-xs text-red-500">
                    {userMetrics.losingTransactions}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-main-light-text/70 text-xs">
                  Unrealized
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500">
                    {userMetrics.breakEvenTransactions}
                  </span>
                </div>
              </div>
              {/* ROI Buckets */}
              <div className="space-y-3">
                {/* >500% */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-main-light-text/80">
                      {">"} 500%
                    </span>
                  </div>
                  <span className="text-main-text text-xs">
                    {userMetrics.roiBuckets.above500}
                  </span>
                </div>

                {/* 200% ~ 500% */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-main-light-text/80">
                      200% ~ 500%
                    </span>
                  </div>
                  <span className="text-main-text text-xs">
                    {userMetrics.roiBuckets.range200to500}
                  </span>
                </div>

                {/* 50% ~ 200% */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-xs text-main-light-text/80">
                      50% ~ 200%
                    </span>
                  </div>
                  <span className="text-main-text text-xs">
                    {userMetrics.roiBuckets.range50to200}
                  </span>
                </div>

                {/* 0% ~ 50% */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-300"></div>
                    <span className="text-xs text-main-light-text/80">
                      0% ~ 50%
                    </span>
                  </div>
                  <span className="text-main-text text-xs">
                    {userMetrics.roiBuckets.range0to50}
                  </span>
                </div>

                {/* Below 0% */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-main-light-text/80">
                      Below 0%
                    </span>
                  </div>
                  <span className="text-main-text text-xs">
                    {userMetrics.roiBuckets.belowZero}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-800 rounded-full flex items-center justify-between overflow-hidden relative">
                <div
                  className="bg-green-500 h-full  "
                  style={{
                    width: `${calculatePercentage(
                      userMetrics.winningTransactions,
                      userMetrics.totalTransactions
                    )}%`,
                  }}
                ></div>
                <div
                  className="bg-red-500 h-full  "
                  style={{
                    left: `${calculatePercentage(
                      userMetrics.winningTransactions,
                      userMetrics.totalTransactions
                    )}%`,
                    width: `${calculatePercentage(
                      userMetrics.losingTransactions,
                      userMetrics.totalTransactions
                    )}%`,
                  }}
                ></div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsHoldingsSection;
