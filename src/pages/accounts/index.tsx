import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import CopyTradeModal from "../../components/CopyTradeModal";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import MainLayout from "../../layouts/MainLayout";
import BackButton from "../../components/BackButton";
import Navbar from "../../layouts/Navbar";
import Skeleton from "../../components/Skeleton";
import StatsHoldingsSection from "./components/StatsHoldingsSection";
import DefiTradesSection from "./components/DefiTradesSection";
import TokenPnLSection from "./components/TokenPnLSection";
import CopyTradeOrdersSection from "./components/CopyTradeOrdersSection";
import { useKOLData } from "../../hooks/useKOLData";
import { useWebSocket } from "../../hooks/useWebSocket";
import { KOLService } from "../../api/kolService";
import { WebSocketMessage } from "../../types/websocket";
import { DefiTrade } from "../../types/api";
import { useAuth } from "../../components/AuthProvider";

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

interface FetchState {
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const AccountsPage: React.FC = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const { isAuthenticated } = useAuth();
  const {
    kolData,
    loading: kolLoading,
    error: kolError,
  } = useKOLData(walletAddress);

  const [tradesState, setTradesState] = useState<FetchState>({
    loading: false,
    error: null,
    lastFetch: null,
  });
  const [tokenPnLState, setTokenPnLState] = useState<FetchState>({
    loading: false,
    error: null,
    lastFetch: null,
  });

  const [pnlFilter, setPnlFilter] = useState("mostRecent");
  const [currentPage, setCurrentPage] = useState(1);
  const [copyTradeOpen, setCopyTradeOpen] = useState(false);

  const tradesRef = useRef<DefiTrade[]>([]);
  const [trades, setTrades] = useState<DefiTrade[]>([]);
  const tokenPnLRef = useRef<TokenPnLData[]>([]);
  const [tokenPnL, setTokenPnL] = useState<TokenPnLData[]>([]);
  const [userMetrics, setUserMetrics] = useState<any>(null);

  const [tokenPnLMeta, setTokenPnLMeta] = useState({
    totalTokens: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // Add DeFi trades pagination metadata
  const [tradesMeta, setTradesMeta] = useState({
    totalTrades: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const [tokenPnLRefreshing, setTokenPnLRefreshing] = useState(false);

  const tradesPerPage = 4;
  const tokensPerPage = 5;

  const transformTradeData = useCallback((trade: any): DefiTrade | null => {
    try {
      if (!trade || !trade.transactionHash) {
        console.warn("Invalid trade data:", trade);
        return null;
      }

      let timestamp = trade.timestamp;
      if (typeof timestamp === "number" && timestamp > Date.now() * 1000) {
        timestamp = Math.floor(timestamp / 1000);
      }

      return {
        tradeId: trade.transactionHash,
        tradeType: trade.tradeType || "unknown",
        amount:
          typeof trade.amount === "string"
            ? parseFloat(trade.amount) || 0
            : Number(trade.amount) || 0,
        price:
          typeof trade.price === "string"
            ? parseFloat(trade.price) || 0
            : Number(trade.price) || 0,
        tokenAddress: trade.tokenAddress || "",
        timestamp:
          typeof timestamp === "number"
            ? new Date(timestamp).toISOString()
            : timestamp || new Date().toISOString(),
        transactionHash: trade.transactionHash,
        walletAddress: trade.walletAddress || "",
        username: trade.username || "Unknown",
        tokenName: trade.tokenName || "Unknown Token",
        tokenSymbol: trade.tokenSymbol || "UNKNOWN",
        tokenImage: trade.tokenImage || "",
        profileImage: trade.profileImage || "",
        solSpent: (() => {
          if (trade.solSpent === null || trade.solSpent === undefined) return 0;
          if (typeof trade.solSpent === "string")
            return parseFloat(trade.solSpent) || 0;
          return Number(trade.solSpent) || 0;
        })(),
      };
    } catch (error) {
      console.error("Error transforming trade data:", error, trade);
      return null;
    }
  }, []);

  const fetchTokenPnL = useCallback(
    async (page: number = 1, isRefresh = false, filter: string = pnlFilter) => {
      if (!walletAddress) return;
      const safePageNumber = Math.max(1, page);

      try {
        if (isRefresh) {
          setTokenPnLRefreshing(true);
        } else {
          setTokenPnLState((prev) => ({ ...prev, loading: true, error: null }));
        }

        let response;
        switch (filter) {
          case "highestPnl":
            response = await KOLService.getHighestPnLTokens(
              walletAddress,
              safePageNumber,
              tokensPerPage
            );
            break;
          case "lowestPnl":
            response = await KOLService.getLowestPnLTokens(
              walletAddress,
              safePageNumber,
              tokensPerPage
            );
            break;
          case "mostRecent":
          default:
            response = await KOLService.getTokenPnL(
              walletAddress,
              safePageNumber,
              tokensPerPage
            );
            break;
        }

        if (response?.success && response?.data) {
          const { tokenPnL, userMetrics } = response.data;
          const meta = response.meta || response.data.meta || {};

          console.log("Token PnL API Response:", response);

          setTokenPnL(tokenPnL || []);
          tokenPnLRef.current = tokenPnL || [];

          if (userMetrics) {
            setUserMetrics(userMetrics);
            console.log("User Metrics:", userMetrics);
          }

          setTokenPnLMeta({
            totalTokens: meta.total || 0,
            totalPages: meta.totalPages || 0,
            currentPage: Math.max(1, meta.page || safePageNumber),
          });

          setTokenPnLState((prev) => ({
            ...prev,
            loading: false,
            error: null,
            lastFetch: Date.now(),
          }));
        } else {
          throw new Error(response?.error || "Failed to fetch token PnL data");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error fetching token PnL:", err);

        setTokenPnLState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      } finally {
        if (isRefresh) {
          setTokenPnLRefreshing(false);
        }
      }
    },
    [walletAddress, tokensPerPage, pnlFilter]
  );

  const fetchTrades = useCallback(
    async (page: number = 1) => {
      if (!walletAddress) return;

      try {
        setTradesState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await KOLService.getWalletTrades(
          walletAddress,
          page,
          tradesPerPage
        );

        if (response?.success && response?.data) {
          const transformedTrades: DefiTrade[] = response.data
            .map((trade: any) => transformTradeData(trade))
            .filter(
              (trade: DefiTrade | null): trade is DefiTrade => trade !== null
            );

          const uniqueTrades = transformedTrades.filter(
            (trade: DefiTrade, index: number, array: DefiTrade[]) =>
              array.findIndex(
                (t: DefiTrade) => t.transactionHash === trade.transactionHash
              ) === index
          );

          tradesRef.current = uniqueTrades;
          setTrades(uniqueTrades);

          // Update pagination metadata
          const meta = response.meta || {
            total: 0,
            totalPages: 0,
            page: page,
          };
          setTradesMeta({
            totalTrades: meta.total || 0,
            totalPages: meta.totalPages || 0,
            currentPage: Math.max(1, meta.page || page),
          });

          setCurrentPage(Math.max(1, meta.page || page));

          setTradesState((prev) => ({
            ...prev,
            loading: false,
            error: null,
            lastFetch: Date.now(),
          }));
        } else {
          throw new Error(response?.error || "Failed to fetch trades data");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error fetching trades:", err);

        setTradesState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    },
    [walletAddress, transformTradeData, tradesPerPage]
  );

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      try {
        if (!message || !walletAddress) return;

        if (
          message.event === "subscribe_copytrades" &&
          message.data?.trades &&
          Array.isArray(message.data.trades)
        ) {
          const matchingTrades = message.data.trades.filter(
            (trade) => trade?.walletAddress === walletAddress
          );

          if (matchingTrades.length > 0) {
            const newTrades = matchingTrades
              .map(transformTradeData)
              .filter((trade): trade is DefiTrade => trade !== null);

            if (newTrades.length > 0) {
              const currentTrades = tradesRef.current;
              const existingTradeIds = new Set(
                currentTrades.map((t) => t.transactionHash)
              );
              const uniqueNewTrades = newTrades.filter(
                (trade) => !existingTradeIds.has(trade.transactionHash)
              );

              if (uniqueNewTrades.length > 0) {
                const updatedTrades = [...uniqueNewTrades, ...currentTrades];
                tradesRef.current = updatedTrades;
                setTrades(updatedTrades);
                setCurrentPage(1);

                fetchTokenPnL(tokenPnLMeta.currentPage, true);
              }
            }
          }
        } else if (
          message.event === "new_trade" &&
          message.tradeData?.tradeDataToBroadcast &&
          message.tradeData.tradeDataToBroadcast.walletAddress === walletAddress
        ) {
          const trade = message.tradeData.tradeDataToBroadcast;
          const newTrade = transformTradeData(trade);

          if (newTrade) {
            const currentTrades = tradesRef.current;
            const existingTradeIds = new Set(
              currentTrades.map((t) => t.transactionHash)
            );

            if (!existingTradeIds.has(newTrade.transactionHash)) {
              const updatedTrades = [newTrade, ...currentTrades];
              tradesRef.current = updatedTrades;
              setTrades(updatedTrades);
              setCurrentPage(1);

              // Refresh token PnL data when new trade arrives
              fetchTokenPnL(tokenPnLMeta.currentPage, true);
            }
          }
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error, message);
      }
    },
    [walletAddress, transformTradeData, fetchTokenPnL]
  );

  const { isConnected } = useWebSocket<WebSocketMessage>(
    handleWebSocketMessage
  );

  useEffect(() => {
    if (kolData && !kolError && walletAddress) {
      fetchTokenPnL(1);

      const tradesTimer = setTimeout(() => {
        fetchTrades();
      }, 100);

      return () => clearTimeout(tradesTimer);
    }
  }, [kolData, kolError, walletAddress, fetchTokenPnL, fetchTrades]);

  const stats = useMemo(() => {
    try {
      if (!tokenPnL || tokenPnL.length === 0) {
        return {
          wins: 0,
          losses: 0,
          totalPnlSol: "+0.00 SOL",
          totalPnlUsd: "$0.00",
        };
      }

      const wins = tokenPnL.filter(
        (token) => (token?.realizedPnLSOL || 0) > 0
      ).length;
      const losses = tokenPnL.filter(
        (token) => (token?.realizedPnLSOL || 0) <= 0
      ).length;
      const totalPnlSol = tokenPnL.reduce(
        (sum, token) => sum + (token?.realizedPnLSOL || 0),
        0
      );
      const totalPnlUsd = tokenPnL.reduce(
        (sum, token) => sum + (token?.realizedPnL || 0),
        0
      );

      return {
        wins,
        losses,
        totalPnlSol: `${totalPnlSol >= 0 ? "+" : ""}${totalPnlSol.toFixed(
          2
        )} SOL`,
        totalPnlUsd: `${totalPnlUsd >= 0 ? "+" : ""}$${totalPnlUsd.toFixed(2)}`,
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        wins: 0,
        losses: 0,
        totalPnlSol: "+0.00 SOL",
        totalPnlUsd: "$0.00",
      };
    }
  }, [tokenPnL]);

  const tradesData = useMemo(() => {
    try {
      return {
        totalTrades: tradesMeta.totalTrades,
        totalPages: tradesMeta.totalPages,
        currentTrades: trades || [],
        startIndex: 0,
        endIndex: (trades || []).length,
      };
    } catch (error) {
      console.error("Error calculating trades pagination:", error);
      return {
        totalTrades: 0,
        totalPages: 0,
        currentTrades: [],
        startIndex: 0,
        endIndex: 0,
      };
    }
  }, [trades, tradesMeta]);

  const tokenPnLData = useMemo(() => {
    try {
      return {
        totalTokens: tokenPnLMeta.totalTokens,
        totalPnLPages: tokenPnLMeta.totalPages,
        currentTokens: tokenPnL || [],
        pnlStartIndex: 0,
        pnlEndIndex: (tokenPnL || []).length,
      };
    } catch (error) {
      console.error("Error calculating token PnL pagination:", error);
      return {
        totalTokens: 0,
        totalPnLPages: 0,
        currentTokens: [],
        pnlStartIndex: 0,
        pnlEndIndex: 0,
      };
    }
  }, [tokenPnL, tokenPnLMeta]);

  const handlePrevPage = useCallback(() => {
    const currentPageNum = tradesMeta.currentPage || 1;
    const newPage = Math.max(1, currentPageNum - 1);
    if (newPage < currentPageNum && newPage >= 1) {
      fetchTrades(newPage);
    }
  }, [tradesMeta.currentPage, fetchTrades]);

  const handleNextPage = useCallback(() => {
    const currentPageNum = tradesMeta.currentPage || 1;
    const maxPages = Math.max(1, tradesMeta.totalPages || 1);
    const newPage = currentPageNum + 1;
    if (newPage <= maxPages && newPage > currentPageNum) {
      fetchTrades(newPage);
    }
  }, [tradesMeta.currentPage, tradesMeta.totalPages, fetchTrades]);

  const handlePnlPrevPage = useCallback(() => {
    const currentPageNum = tokenPnLMeta.currentPage || 1;
    const newPage = Math.max(1, currentPageNum - 1);
    if (newPage < currentPageNum && newPage >= 1) {
      fetchTokenPnL(newPage);
    }
  }, [tokenPnLMeta.currentPage, fetchTokenPnL]);

  const handlePnlNextPage = useCallback(() => {
    const currentPageNum = tokenPnLMeta.currentPage || 1;
    const maxPages = Math.max(1, tokenPnLMeta.totalPages || 1);
    const newPage = currentPageNum + 1;
    if (newPage <= maxPages && newPage > currentPageNum) {
      fetchTokenPnL(newPage);
    }
  }, [tokenPnLMeta.currentPage, tokenPnLMeta.totalPages, fetchTokenPnL]);

  const showSkeleton = kolLoading || (!kolData && !kolError);

  if (showSkeleton) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-main-bg relative overflow-hidden">
          <Navbar />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-main-light-text) 0.5px, transparent 0.5px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Back Button Skeleton */}
              <div className="mb-6">
                <Skeleton width={120} height={40} className="rounded-lg" />
              </div>

              {/* Header Skeleton */}
              <div className="mb-8">
                <div className="flex md:items-center items-start gap-4 flex-col md:flex-row justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Skeleton width={64} height={64} className="rounded-full" />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Skeleton
                          width={200}
                          height={36}
                          className="rounded-md"
                        />
                        <Skeleton
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <Skeleton
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      <Skeleton
                        width={160}
                        height={24}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <Skeleton width={160} height={48} className="rounded-2xl" />
                </div>
              </div>

              {/* Main Content Grid Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Stats/Holdings Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Stats/Holdings/Overall Combined Skeleton */}
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    {/* Tab Headers Skeleton */}
                    <div className="flex mb-6 border-b border-white/[0.08]">
                      <Skeleton width={60} height={30} className="mr-6" />
                      <Skeleton width={60} height={30} className="mr-6" />
                      <Skeleton width={60} height={30} />
                    </div>

                    {/* Tab Content Skeleton */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton width={80} height={20} />
                        <Skeleton width={100} height={20} />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton width={80} height={20} />
                        <Skeleton width={100} height={20} />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton width={80} height={20} />
                        <Skeleton width={100} height={20} />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton width={80} height={20} />
                        <Skeleton width={100} height={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Defi Trades Skeleton */}
                <div className="lg:col-span-3">
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <Skeleton width={140} height={28} />
                      <div className="flex items-center gap-3">
                        <Skeleton
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <Skeleton
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-main-bg/20 rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <Skeleton
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <Skeleton
                                width={120}
                                height={20}
                                className="mb-2"
                              />
                              <Skeleton width={80} height={16} />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton
                              width={100}
                              height={20}
                              className="mb-2"
                            />
                            <Skeleton width={80} height={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full Width - Token PnL Skeleton */}
                <div className="lg:col-span-4">
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <Skeleton width={120} height={28} />
                      <div className="flex items-center gap-4">
                        <Skeleton
                          width={120}
                          height={36}
                          className="rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <Skeleton
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <Skeleton
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <Skeleton
                          width={60}
                          height={20}
                          className="mb-2 mx-auto"
                        />
                        <Skeleton width={40} height={32} className="mx-auto" />
                      </div>
                      <div className="text-center">
                        <Skeleton
                          width={60}
                          height={20}
                          className="mb-2 mx-auto"
                        />
                        <Skeleton width={40} height={32} className="mx-auto" />
                      </div>
                      <div className="text-center">
                        <Skeleton
                          width={80}
                          height={20}
                          className="mb-2 mx-auto"
                        />
                        <Skeleton width={80} height={32} className="mx-auto" />
                      </div>
                      <div className="text-center">
                        <Skeleton
                          width={80}
                          height={20}
                          className="mb-2 mx-auto"
                        />
                        <Skeleton width={80} height={32} className="mx-auto" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-main-bg/20 rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <Skeleton
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <Skeleton
                                width={100}
                                height={20}
                                className="mb-2"
                              />
                              <Skeleton width={80} height={16} />
                            </div>
                          </div>
                          <div className="hidden md:block text-center">
                            <Skeleton width={80} height={20} className="mb-2" />
                            <Skeleton width={60} height={16} />
                          </div>
                          <div className="hidden md:block text-center">
                            <Skeleton width={80} height={20} className="mb-2" />
                            <Skeleton width={60} height={16} />
                          </div>
                          <div className="text-right">
                            <Skeleton width={80} height={20} className="mb-2" />
                            <Skeleton width={60} height={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (kolError || !kolData) {
    return (
      <MainLayout>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-main-bg">
          <div className="text-center">
            <Icon
              icon="material-symbols:error"
              className="w-12 h-12 text-red-500 mx-auto mb-4"
            />
            <p className="text-main-light-text font-tiktok">
              {kolError || "KOL not found"}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-main-bg relative overflow-hidden">
        {/* Texture Overlay */}
        <Navbar />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-main-light-text) 0.5px, transparent 0.5px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="relative z-10 pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <BackButton />
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex md:items-center items-start gap-4 flex-col md:flex-row justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center text-4xl ring-2 ring-white/10">
                    {kolData.profileImage ? (
                      <img
                        src={kolData.profileImage}
                        alt={kolData.username || "Profile"}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Icon
                        icon="mdi:account-circle"
                        className="w-full h-full text-main-light-text/60"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-algance text-4xl text-main-text">
                        {kolData.socialLinks?.twitter ? (
                          <a
                            href={kolData.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-main-accent transition-colors duration-300 cursor-pointer"
                          >
                            {kolData.username || "Unknown User"}
                          </a>
                        ) : (
                          kolData.username || "Unknown User"
                        )}
                      </h1>
                      {kolData.isVerified && (
                        <Icon
                          icon="material-symbols:verified"
                          className="w-6 h-6 text-main-accent"
                        />
                      )}
                      {kolData.socialLinks?.twitter && (
                        <Icon
                          onClick={() => {
                            try {
                              window.open(
                                `${kolData.socialLinks.twitter}`,
                                "_blank"
                              );
                            } catch (error) {
                              console.error(
                                "Failed to open Twitter link:",
                                error
                              );
                            }
                          }}
                          icon="streamline-logos:x-twitter-logo-block"
                          className="w-6 cursor-pointer h-6 text-main-light-text/60 hover:text-main-accent transition-colors"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-main-light-text/80">
                      <span className="font-tiktok text-lg">
                        {kolData.socialLinks?.twitter
                          ? `@${kolData.socialLinks.twitter.split("/").pop()}`
                          : kolData.walletAddress
                          ? kolData.walletAddress.slice(0, 8) + "..."
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Copy Trade CTA */}
                {/* Copy Trade CTA */}
                <div
                  className="relative overflow-hidden px-4 py-3 ml-4 z-50 transition-all flex gap-2 items-center ease-in shadow-2xl shadow-main-accent border border-main-accent/50 text-main-accent text-sm rounded-xl duration-300 hover:shadow-2xl hover:shadow-main-accent/30 transform cursor-pointer group"
                  onClick={() => setCopyTradeOpen(true)}
                >
                  <span className="absolute inset-0 left-0 w-0 group-hover:w-full bg-main-accent transition-all duration-300 ease-in-out z-0"></span>
                  <span className="relative flex gap-2 items-center group-hover:text-black transition-colors duration-300">
                    <Icon
                      icon="mingcute:aiming-2-line"
                      width={20}
                      height={20}
                    />
                    Copy Trade
                  </span>
                </div>
                {/* CopyTradeModal */}
                <CopyTradeModal
                  open={copyTradeOpen}
                  onClose={() => setCopyTradeOpen(false)}
                  walletData={{
                    walletAddress: walletAddress || "",
                    username: kolData.username,
                    profileImage: kolData.profileImage,
                    portfolio: kolData.portfolio,
                  }}
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Stats/Holdings */}
              <div className="lg:col-span-1 space-y-6">
                {kolData?.holdings && kolData?.portfolio ? (
                  <StatsHoldingsSection
                    holdings={[
                      {
                        solanaBalance: kolData.holdings.solanaBalance || 0,
                        otherBalances:
                          kolData.holdings.otherBalances ||
                          (Array.isArray(kolData.holdings.OtherBalances)
                            ? kolData.holdings.OtherBalances
                            : []),
                      },
                    ]}
                    winRate={kolData.portfolio.winRate || 0}
                    avgDuration={kolData.portfolio.avgDuration || "0h"}
                    topWin={`${kolData.portfolio.topWinSol || 0} Sol`}
                    volume={`${kolData.portfolio.totalVolumeSOL || 0} Sol`}
                    userMetrics={userMetrics}
                    loading={tokenPnLState.loading}
                  />
                ) : (
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="text-center text-red-400">
                      <Icon
                        icon="material-symbols:error"
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm">Failed to load portfolio data</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Defi Trades */}
              <div className="lg:col-span-3">
                {tradesState.error ? (
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="text-center text-red-400">
                      <Icon
                        icon="material-symbols:error"
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm mb-2">Failed to load trades</p>
                      <p className="text-xs text-gray-500">
                        {tradesState.error}
                      </p>
                      <button
                        onClick={() => fetchTrades()}
                        className="mt-3 px-4 py-2 bg-main-accent/20 text-main-accent rounded-lg text-sm hover:bg-main-accent/30 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : tradesState.loading ? (
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton width={140} height={28} />
                        <div className="flex items-center gap-3">
                          <Skeleton
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <Skeleton
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-main-bg/20 rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <Skeleton
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <Skeleton
                                width={120}
                                height={20}
                                className="mb-2"
                              />
                              <Skeleton width={80} height={16} />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton
                              width={100}
                              height={20}
                              className="mb-2"
                            />
                            <Skeleton width={80} height={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <DefiTradesSection
                    trades={tradesData.currentTrades}
                    currentPage={currentPage}
                    totalPages={tradesData.totalPages}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                    isWebSocketConnected={isConnected}
                  />
                )}
              </div>

              {/* Full Width - Token PnL */}
              <div className="lg:col-span-4">
                {tokenPnLState.error ? (
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="text-center text-red-400">
                      <Icon
                        icon="material-symbols:error"
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm mb-2">
                        Failed to load token PnL data
                      </p>
                      <p className="text-xs text-gray-500">
                        {tokenPnLState.error}
                      </p>
                      <button
                        onClick={() => fetchTokenPnL(1, false)}
                        className="mt-3 px-4 py-2 bg-main-accent/20 text-main-accent rounded-lg text-sm hover:bg-main-accent/30 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : tokenPnLState.loading ? (
                  <div className="bg-light-bg/5   rounded-2xl p-6 ring-1 ring-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton width={120} height={28} />
                        <div className="flex items-center gap-4">
                          <Skeleton
                            width={120}
                            height={36}
                            className="rounded-lg"
                          />
                          <div className="flex items-center gap-2">
                            <Skeleton
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <Skeleton
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="text-center">
                            <Skeleton
                              width={60}
                              height={20}
                              className="mb-2 mx-auto"
                            />
                            <Skeleton
                              width={40}
                              height={32}
                              className="mx-auto"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-main-bg/20 rounded-xl"
                          >
                            <div className="flex items-center gap-4">
                              <Skeleton
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div>
                                <Skeleton
                                  width={100}
                                  height={20}
                                  className="mb-2"
                                />
                                <Skeleton width={80} height={16} />
                              </div>
                            </div>
                            <div className="text-right">
                              <Skeleton
                                width={80}
                                height={20}
                                className="mb-2"
                              />
                              <Skeleton width={60} height={16} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <TokenPnLSection
                    tokens={tokenPnLData.currentTokens}
                    stats={stats}
                    currentPage={tokenPnLMeta.currentPage}
                    totalPages={tokenPnLMeta.totalPages}
                    filter={pnlFilter}
                    onFilterChange={(newFilter) => {
                      setPnlFilter(newFilter);
                      // Reset to first page when filter changes and fetch with new filter
                      if (newFilter !== pnlFilter) {
                        fetchTokenPnL(1, false, newFilter);
                      }
                    }}
                    onPrevPage={handlePnlPrevPage}
                    onNextPage={handlePnlNextPage}
                    isRefreshing={tokenPnLRefreshing}
                  />
                )}
              </div>

              {/* Copy Trade Orders Section */}
              {isAuthenticated && (
                <div className="lg:col-span-4 mt-6">
                  <CopyTradeOrdersSection />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountsPage;
