import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import TradesCard, { TraderAccount } from "./components/TradesCard";
import BackButton from "../../components/BackButton";
import KOLService from "../../api/kolService";
import { LatestTrade } from "../../types/api";
import Skeleton from "../../components/Skeleton";
import SearchComponent from "../../components/SearchComponent";
import { createTraderSearchConfig } from "../../utils/searchConfigs";
import { useWebSocket } from "../../hooks/useWebSocket";
import { WebSocketMessage } from "../../types/websocket";

const FADE_IN_DURATION = 300;

const TradesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [traderAccounts, setTraderAccounts] = useState<TraderAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<TraderAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTradesNotification] = useState<boolean>(false);
  const [newWallets] = useState<Set<string>>(new Set());

  const traderSearchConfig = createTraderSearchConfig(
    traderAccounts,
    (result) => {
      window.location.href = `/accounts/${result.item.walletAddress}`;
    }
  );

  traderSearchConfig.onSearch = (query, results) => {
    setSearchQuery(query);
    setFilteredAccounts(results.map((r) => r.item));
  };

  traderSearchConfig.onClear = () => {
    setSearchQuery("");
    setFilteredAccounts(traderAccounts);
  };

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    try {
      if (!message) return;

      if (
        message.event === "subscribe_copytrades" &&
        message.data?.trades &&
        Array.isArray(message.data.trades)
      ) {
        const newWalletAddresses: string[] = [];
        const newTrades = message.data.trades.map((trade) => {
          let timestamp = trade.timestamp;
          if (typeof timestamp === "number" && timestamp > Date.now() * 1000) {
            timestamp = Math.floor(timestamp / 1000);
          }

          const walletAddress = trade.walletAddress;
          if (walletAddress && !newWalletAddresses.includes(walletAddress)) {
            newWalletAddresses.push(walletAddress);
          }

          const amount =
            typeof trade.amount === "string"
              ? parseFloat(trade.amount)
              : trade.amount;
          const price =
            typeof trade.price === "string"
              ? parseFloat(trade.price)
              : trade.price;
          const solSpent =
            typeof trade.solSpent === "string"
              ? parseFloat(trade.solSpent)
              : trade.solSpent ?? 0;

          return {
            ...trade,
            timestamp,
            tradeId: trade.transactionHash,
            amount: amount || 0,
            price: price || 0,
            solSpent: solSpent || 0,
          } as LatestTrade;
        });

        setTraderAccounts((prevAccounts) => {
          const accountMap = new Map<string, TraderAccount>();
          prevAccounts.forEach((account) => {
            accountMap.set(account.walletAddress, account);
          });

          newTrades.forEach((trade) => {
            const walletAddress = trade.walletAddress;
            const existingAccount = accountMap.get(walletAddress);

            if (existingAccount) {
              existingAccount.trades = [trade, ...existingAccount.trades];
            } else {
              accountMap.set(walletAddress, {
                walletAddress,
                username: trade.username || "Unknown",
                profileImage: trade.profileImage || "",
                verified: true,
                avatar: "👤",
                trades: [trade],
              });
            }
          });

          const updatedAccounts = Array.from(accountMap.values());
          return updatedAccounts;
        });

        // Fetch additional data for new wallet addresses
        if (newWalletAddresses.length > 0) {
          newWalletAddresses.forEach(() => {
            // Fetch additional data as needed
          });
        }
      } else if (
        message.event === "new_trade" &&
        message.tradeData?.tradeDataToBroadcast
      ) {
        const trade = message.tradeData.tradeDataToBroadcast;
        const newWalletAddresses: string[] = [];

        // Handle timestamp conversion
        let timestamp = trade.timestamp;
        if (typeof timestamp === "number" && timestamp > Date.now() * 1000) {
          timestamp = Math.floor(timestamp / 1000);
        }

        const latestTrade: LatestTrade = {
          tradeId: trade.transactionHash,
          tradeType: trade.tradeType,
          amount:
            typeof trade.amount === "string"
              ? parseFloat(trade.amount) || 0
              : Number(trade.amount) || 0,
          price:
            typeof trade.price === "string"
              ? parseFloat(trade.price) || 0
              : Number(trade.price) || 0,
          tokenAddress: trade.tokenAddress,
          timestamp:
            typeof timestamp === "number"
              ? new Date(timestamp).toISOString()
              : timestamp,
          transactionHash: trade.transactionHash,
          walletAddress: trade.walletAddress,
          username: trade.username,
          tokenName: trade.tokenName,
          tokenSymbol: trade.tokenSymbol,
          tokenImage: trade.tokenImage,
          profileImage: trade.profileImage,
          solSpent:
            typeof trade.solSpent === "string"
              ? parseFloat(trade.solSpent) || 0
              : Number(trade.solSpent) || 0,
        };

        setTraderAccounts((prevAccounts) => {
          const accountMap = new Map<string, TraderAccount>();
          prevAccounts.forEach((account) => {
            accountMap.set(account.walletAddress, account);
          });
          const walletAddress = trade.walletAddress;
          const existingAccount = accountMap.get(walletAddress);

          if (existingAccount) {
            existingAccount.trades = [latestTrade, ...existingAccount.trades];
          } else {
            accountMap.set(walletAddress, {
              walletAddress,
              username: trade.username || "Unknown",
              profileImage: trade.profileImage || "",
              verified: true,
              avatar: "👤",
              trades: [latestTrade],
            });
            if (walletAddress && !newWalletAddresses.includes(walletAddress)) {
              newWalletAddresses.push(walletAddress);
            }
          }

          const updatedAccounts = Array.from(accountMap.values());
          return updatedAccounts;
        });

        // Fetch additional data for new wallet addresses
        if (newWalletAddresses.length > 0) {
          newWalletAddresses.forEach(() => {
            // Fetch additional data as needed
          });
        }
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }, []);

  // Connect to WebSocket
  const { isConnected } = useWebSocket<WebSocketMessage>(
    handleWebSocketMessage
  );

  useEffect(() => {
    const fetchLatestTrades = async () => {
      try {
        setLoading(true);
        const response = await KOLService.getLatestTrades();

        if (!response.success || !response.data) {
          throw new Error("Failed to fetch trades data");
        }

        const trades = Array.isArray(response.data)
          ? response.data
          : response.data.trades || [];

        const tradesByWallet: Record<string, LatestTrade[]> = {};

        interface ApiTradeData {
          walletAddress: string;
          RecenTrades?: LatestTrade[];
          tradeId?: string;
          tradeType: "buy" | "sell";
          amount: number | string;
          price: number | string;
          tokenAddress: string;
          timestamp: string | number;
          transactionHash: string;
          username: string;
          tokenName: string;
          tokenSymbol: string;
          tokenImage: string;
          profileImage: string;
        }

        trades.forEach((trade: ApiTradeData) => {
          if (trade.RecenTrades && Array.isArray(trade.RecenTrades)) {
            const walletAddress = trade.walletAddress;
            if (!tradesByWallet[walletAddress]) {
              tradesByWallet[walletAddress] = [];
            }
            tradesByWallet[walletAddress].push(...trade.RecenTrades);
          } else {
            const walletAddress = trade.walletAddress;
            if (!tradesByWallet[walletAddress]) {
              tradesByWallet[walletAddress] = [];
            }

            const latestTrade: LatestTrade = {
              tradeId: trade.tradeId || trade.transactionHash,
              tradeType: trade.tradeType,
              amount:
                typeof trade.amount === "string"
                  ? parseFloat(trade.amount)
                  : trade.amount,
              price:
                typeof trade.price === "string"
                  ? parseFloat(trade.price)
                  : trade.price,
              tokenAddress: trade.tokenAddress,
              timestamp:
                typeof trade.timestamp === "number"
                  ? new Date(trade.timestamp).toISOString()
                  : trade.timestamp,
              transactionHash: trade.transactionHash,
              walletAddress: trade.walletAddress,
              username: trade.username,
              tokenName: trade.tokenName,
              tokenSymbol: trade.tokenSymbol,
              tokenImage: trade.tokenImage,
              profileImage: trade.profileImage,
              solSpent: (trade as any).solSpent ?? 0,
            };

            tradesByWallet[walletAddress].push(latestTrade);
          }
        });

        const accounts: TraderAccount[] = Object.entries(tradesByWallet).map(
          ([walletAddress, trades]) => {
            const latestTrade = trades[0];

            return {
              username: latestTrade.username,
              walletAddress: walletAddress,
              profileImage: latestTrade.profileImage,
              verified: true,
              avatar: "👤",
              trades: trades,
            };
          }
        );

        setTraderAccounts(accounts);
        setFilteredAccounts(accounts);
      } catch (err) {
        console.error("Error fetching latest trades:", err);
        setError("Failed to load trades data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTrades();
  }, []);

  return (
    <div className="min-h-screen bg-main-bg relative overflow-hidden">
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-main-light-text) 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <Navbar />

      <main className="relative z-10 pt-28 pb-20">
        <div className="max-w-7xl xl:max-w-[99rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <h1 className="font-algance text-4xl md:text-5xl text-main-text">
                Realtime <span className="text-main-accent">Trades</span>
              </h1>
              <p className="font-tiktok text-lg text-main-light-text mt-2">
                Monitor live trading activity from top traders
              </p>
            </div>

            {/* Search Trader Wallet Section */}
            <div className="w-full lg:w-auto">
              <SearchComponent
                {...traderSearchConfig}
                size="medium"
                variant="default"
                containerClassName="w-full lg:w-96"
                placeholder="Search wallet address..."
              />

              {/* Search Results Counter */}
              {searchQuery && (
                <div className="mt-2 text-center lg:text-right">
                  <span className="font-tiktok text-sm text-main-light-text/70">
                    {filteredAccounts.length} trader
                    {filteredAccounts.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              )}

              {/* WebSocket Connection Status */}
              <div className="mt-2 text-center lg:text-right">
                <span className="font-tiktok text-xs text-main-light-text/70 flex items-center justify-end gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></span>
                  {isConnected
                    ? "Live updates connected"
                    : "Connecting to live updates..."}
                </span>
              </div>
            </div>
          </div>

          {/* New Trades Notification */}
          <div
            className={`fixed top-24 right-4 bg-main-accent/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-500 transform ${
              newTradesNotification
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon icon="material-symbols:update" className="w-5 h-5" />
              <span className="font-tiktok text-sm">New trades received!</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 mb-8">
              <p className="text-red-400 font-tiktok">{error}</p>
            </div>
          )}

          {/* Trades Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-[300px] rounded-sm">
                  <Skeleton className="h-full w-full rounded-sm" />
                </div>
              ))}
            </div>
          ) : filteredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((account, index) => (
                <div
                  key={`${account.walletAddress}-${index}`}
                  className={
                    newWallets.has(account.walletAddress)
                      ? "transition-opacity duration-700 opacity-0 animate-fade-in"
                      : "transition-opacity duration-700 opacity-100"
                  }
                  style={{
                    animation: newWallets.has(account.walletAddress)
                      ? `fadeIn ${FADE_IN_DURATION}ms`
                      : undefined,
                  }}
                >
                  <TradesCard account={account} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icon
                icon="material-symbols:search-off-outline"
                className="w-16 h-16 text-main-light-text/30 mx-auto mb-4"
              />
              <h3 className="font-algance text-xl text-main-text mb-2">
                No results found
              </h3>
              <p className="font-tiktok text-main-light-text/60 max-w-md mx-auto">
                We couldn't find any traders matching your search. Try a
                different keyword or check back later.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TradesPage;
