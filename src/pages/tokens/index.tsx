import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import TokenCard, { Token } from "./components/TokenCard";
import BackButton from "../../components/BackButton";
import SearchComponent from "../../components/SearchComponent";
import Skeleton from "../../components/Skeleton";
import MobileTokensView from "./components/MobileTokensView";
import { createTokenSearchConfig } from "../../utils/searchConfigs";
import { getTokensByBracket } from "../../api";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useIsMobile } from "../../hooks/useIsMobile";
import { WebSocketMessage } from "../../types/websocket";

interface TokensResponse {
  success: boolean;
  data: Token[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    filters: {
      tradeType: string | null;
      sortBy: string;
      sortOrder: string;
      bracket: string;
    };
    stats: {
      totalTokens: number;
      tokensWithTrades: number;
      totalTrades: number;
      totalBuyTrades: number;
      totalSellTrades: number;
    };
    fromCache: boolean;
    maxTokensPerBracket: number;
    maxTradesPerToken: number;
  };
}

const TokenCardSkeleton: React.FC = () => {
  return (
    <div className="  bg-white/[0.03] border border-white/[0.1] rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">
          {/* Token Icon Skeleton */}
          <Skeleton width={48} height={48} className="rounded-2xl" />

          {/* Token Info Skeleton */}
          <div>
            <Skeleton width={80} height={24} className="mb-2 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 gap-4 mb-3">
        <div className="  bg-white/[0.03] rounded-xl p-2 border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton width={16} height={16} className="rounded" />
            <Skeleton width={60} height={12} className="rounded" />
          </div>
          <Skeleton width={80} height={16} className="rounded" />
        </div>
      </div>

      {/* Recent Trades Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton width={16} height={16} className="rounded" />
          <Skeleton width={80} height={14} className="rounded" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton width={8} height={8} className="rounded-full" />
          <Skeleton width={24} height={12} className="rounded" />
        </div>
      </div>

      {/* Recent Trades Skeleton */}
      <div className="space-y-2 mb-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-xl   bg-white/[0.02] border border-white/[0.05]"
          >
            <div className="flex items-center gap-2">
              <Skeleton width={40} height={24} className="rounded-md" />
              <Skeleton width={60} height={16} className="rounded" />
            </div>
            <div className="text-right">
              <Skeleton width={50} height={12} className="rounded mb-1" />
              <Skeleton width={30} height={12} className="rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2">
        <Skeleton width="100%" height={40} className="rounded-xl" />
        <Skeleton width="100%" height={40} className="rounded-xl" />
        <Skeleton width={40} height={40} className="rounded-xl" />
      </div>
    </div>
  );
};

const TokensPage: React.FC = () => {
  const [lowCapTokens, setLowCapTokens] = useState<Token[]>([]);
  const [midCapTokens, setMidCapTokens] = useState<Token[]>([]);
  const [highCapTokens, setHighCapTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (
        message.event === "new_trade" &&
        message.tradeData?.tradeDataToBroadcast
      ) {
        const newTrade = message.tradeData.tradeDataToBroadcast;
        const tokenAddress = newTrade.tokenAddress;

        const tokenExists =
          lowCapTokens.some((token) => token.tokenAddress === tokenAddress) ||
          midCapTokens.some((token) => token.tokenAddress === tokenAddress) ||
          highCapTokens.some((token) => token.tokenAddress === tokenAddress);

        if (tokenExists) {
          const refetchTokenData = async () => {
            try {
              await Promise.all([
                fetchTokens("low", 1, false),
                fetchTokens("mid", 1, false),
                fetchTokens("high", 1, false),
              ]);
            } catch (error) {
              console.error("Error refetching token data:", error);
            }
          };

          refetchTokenData();
        }
      }

      if (message.event === "mc_update" && message.tradeData?.mcUpdateData) {
        const mcUpdate = message.tradeData.mcUpdateData;
        const tokenAddress = mcUpdate.tokenAddress;

        // Update market cap and gain for the specific token across all brackets
        setLowCapTokens((prev) =>
          prev.map((token) =>
            token.tokenAddress === tokenAddress
              ? {
                  ...token,
                  marketCap: mcUpdate.newMarketCap,
                  marketCapGain: mcUpdate.marketCapGain,
                  currentPrice: mcUpdate.currentPrice,
                }
              : token
          )
        );

        setMidCapTokens((prev) =>
          prev.map((token) =>
            token.tokenAddress === tokenAddress
              ? {
                  ...token,
                  marketCap: mcUpdate.newMarketCap,
                  marketCapGain: mcUpdate.marketCapGain,
                  currentPrice: mcUpdate.currentPrice,
                }
              : token
          )
        );

        setHighCapTokens((prev) =>
          prev.map((token) =>
            token.tokenAddress === tokenAddress
              ? {
                  ...token,
                  marketCap: mcUpdate.newMarketCap,
                  marketCapGain: mcUpdate.marketCapGain,
                  currentPrice: mcUpdate.currentPrice,
                }
              : token
          )
        );
      }
    },
    [lowCapTokens, midCapTokens, highCapTokens]
  );

  const {} = useWebSocket<WebSocketMessage>(handleWebSocketMessage, {
    subscribeCopyTrades: false,
    subscribeMarketCapUpdates: true,
  });

  const fetchTokens = async (
    bracket: "low" | "mid" | "high",
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      const response: TokensResponse = await getTokensByBracket(
        bracket,
        page,
        20
      );

      if (response.success) {
        const tokens = response.data;

        switch (bracket) {
          case "low":
            setLowCapTokens((prev) => (append ? [...prev, ...tokens] : tokens));
            break;
          case "mid":
            setMidCapTokens((prev) => (append ? [...prev, ...tokens] : tokens));
            break;
          case "high":
            setHighCapTokens((prev) =>
              append ? [...prev, ...tokens] : tokens
            );
            break;
        }
      }
    } catch (err) {
      console.error(`Error fetching ${bracket} tokens:`, err);
      setError(`Failed to fetch ${bracket} tokens`);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchTokens("low", 1),
          fetchTokens("mid", 1),
          fetchTokens("high", 1),
        ]);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load token data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const filterTokens = (tokenList: Token[]) => {
    if (!searchQuery.trim()) return tokenList;

    const query = searchQuery.toLowerCase();
    return tokenList.filter(
      (token) =>
        token.tokenName.toLowerCase().includes(query) ||
        token.tokenSymbol.toLowerCase().includes(query) ||
        token.tokenAddress.toLowerCase().includes(query)
    );
  };

  const allTokens = [...lowCapTokens, ...midCapTokens, ...highCapTokens];
  const tokenSearchConfig = createTokenSearchConfig(allTokens, (result) => {
    console.log("Selected token:", result.item);
    setSearchQuery("");

    const tokenAddress = result.item.tokenAddress;
    if (tokenAddress) {
      const dexScreenerUrl = `https://dexscreener.com/solana/${tokenAddress}`;
      window.open(dexScreenerUrl, "_blank");
    }
  });

  const handleTokenClick = (token: Token) => {
    const dexScreenerUrl = `https://dexscreener.com/solana/${token.tokenAddress}`;
    window.open(dexScreenerUrl, "_blank");
  };

  const renderTokenSection = (title: string, tokens: Token[]) => {
    const filteredTokens = filterTokens(tokens);

    if (filteredTokens.length === 0 && !loading) {
      return null;
    }

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-algance text-2xl text-main-text">{title}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {filteredTokens.map((token) => (
            <TokenCard key={token.tokenAddress} token={token} />
          ))}
        </div>
        {filteredTokens.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-main-light-text">
              No tokens found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-main-bg via-main-bg to-main-bg-dark">
          <div className="container mx-auto px-4 py-8">
            <BackButton />
            <div className="mb-8">
              <h1 className="font-algance text-4xl text-main-text mb-4">
                Token Discovery
              </h1>
              <p className="text-main-light-text">
                Discover trending tokens across different market caps
              </p>
            </div>

            <div className="mb-8">
              <SearchComponent
                {...tokenSearchConfig}
                size="medium"
                variant="default"
              />
            </div>

            {isMobile ? (
              <MobileTokensView
                lowCapTokens={lowCapTokens}
                midCapTokens={midCapTokens}
                highCapTokens={highCapTokens}
                loading={loading}
                searchQuery={searchQuery}
                onTokenClick={handleTokenClick}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <TokenCardSkeleton key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-main-bg via-main-bg to-main-bg-dark">
          <div className="container mx-auto px-4 py-8">
            <BackButton />
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-main-accent text-white rounded-lg hover:bg-main-accent/80 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-main-bg via-main-bg to-main-bg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="mb-8">
            <h1 className="font-algance text-4xl text-main-text mb-4">
              Token <span className="text-main-accent">Discovery</span>
            </h1>
            <p className="text-main-light-text">
              Discover trending tokens across different market caps
            </p>
          </div>

          <div className="mb-8">
            <SearchComponent
              {...tokenSearchConfig}
              size="medium"
              variant="default"
            />
          </div>

          {isMobile ? (
            <MobileTokensView
              lowCapTokens={lowCapTokens}
              midCapTokens={midCapTokens}
              highCapTokens={highCapTokens}
              loading={loading}
              searchQuery={searchQuery}
              onTokenClick={handleTokenClick}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {renderTokenSection("Low Cap Tokens (< $100K)", lowCapTokens)}

                {renderTokenSection(
                  "Mid Cap Tokens ($100K - $500K)",
                  midCapTokens
                )}

                {renderTokenSection("High Cap Tokens (> $500K)", highCapTokens)}
              </div>

              {!searchQuery.trim() &&
                lowCapTokens.length === 0 &&
                midCapTokens.length === 0 &&
                highCapTokens.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-main-light-text">
                      No tokens available at the moment.
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TokensPage;
