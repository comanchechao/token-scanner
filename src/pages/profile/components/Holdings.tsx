import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import TradingService from "../../../api/tradingService";
import { UpdateBalanceResponse } from "../../../types/trading";
import { useAuth } from "../../../components/AuthProvider";
import { useSettings } from "../../../contexts/SettingsContext";
import { useToastContext } from "../../../contexts/ToastContext";
import { useLoginModalContext } from "../../../contexts/LoginModalContext";
import Skeleton from "../../../components/Skeleton";

// interface Token {
//   name: string;
//   title: string;
//   symbol: string;
//   contractAddress: string;
//   unitDecimals: number;
//   decimalsToShow: number;
// }

// interface Position {
//   token: Token;
//   marketCap: number;
//   priceNative: string;
//   priceUsd: string;
//   buyValueInSol: string;
//   sellValueInSol: string;
//   buyValueInUsd: string;
//   sellValueInUsd: string;
//   currentValueInSol: string;
//   currentValueInUsd: string;
//   avgPriceEntryInSol: string;
//   avgPriceEntryInUsd: string;
//   remainedTokens: string;
//   profitLossInSol: string;
//   profitLossInUsd: string;
//   profitLossPercentInSol: string;
//   profitLossPercentInUsd: string;
// }

// interface PositionsResponse {
//   success: boolean;
//   result: {
//     user: {
//       id: string;
//       username: string;
//       firstName: string;
//       lastName: string | null;
//       defaultWalletId: string;
//       referralId: string;
//       status: string;
//       createdAt: string;
//       updatedAt: string;
//     };
//     solWallet: {
//       confirmedBalance: string;
//       key: {
//         label: string;
//       };
//     };
//     positions: Position[];
//   };
// }

const formatTokenAmount = (amount: string | number, token: any): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `0 ${token.symbol}`;

  const decimals = token.decimalsToShow || 2;

  if (numAmount < 0.001) {
    return `${numAmount.toFixed(6)} ${token.symbol}`;
  } else if (numAmount < 1) {
    return `${numAmount.toFixed(4)} ${token.symbol}`;
  }
  return `${numAmount.toFixed(decimals)} ${token.symbol}`;
};

const normalizeTokenSymbol = (symbol: string): string => {
  if (!symbol) return "Wallet";
  if (
    symbol.toLowerCase().includes("wrapped") ||
    symbol.toLowerCase().includes("wsol")
  ) {
    return "SOL";
  }
  return symbol;
};

const normalizeTokenDisplayName = (text: string): string => {
  if (!text) return "Wallet";
  if (
    text.toLowerCase().includes("wrapped") ||
    text.toLowerCase().includes("wsol")
  ) {
    return "SOL";
  }
  return text;
};

// const formatSolAmount = (amount: string | number): string => {
//   const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
//   if (isNaN(numAmount)) return "0 SOL";

//   if (numAmount < 0.001) {
//     return `${numAmount.toFixed(6)} SOL`;
//   } else if (numAmount < 1) {
//     return `${numAmount.toFixed(4)} SOL`;
//   }
//   return `${numAmount.toFixed(3)} SOL`;
// };

const Holdings: React.FC = () => {
  const [userData, setUserData] = useState<UpdateBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [tokenImages, setTokenImages] = useState<Record<string, string>>({});
  const [buyLoadingStates, setBuyLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const [sellLoadingStates, setSellLoadingStates] = useState<
    Record<string, boolean>
  >({});

  const { user } = useAuth();
  const { quickBuyAmount, quickSellPercentage } = useSettings();
  const { showSuccess, showError } = useToastContext();
  const loginModalContext = useLoginModalContext();

  // const fetchTokenImages = async (positions: Position[]) => {
  //   const newTokenImages: Record<string, string> = {};

  //   for (const position of positions) {
  //     try {
  //       const tokenInfo = await KOLService.getTokenInfo(
  //         position.token.contractAddress
  //       );
  //       if (tokenInfo.success && tokenInfo.data?.image) {
  //         newTokenImages[position.token.contractAddress] = tokenInfo.data.image;
  //       }
  //     } catch (error) {
  //       console.warn(
  //         `Failed to fetch image for token ${position.token.symbol}:`,
  //         error
  //       );
  //     }
  //   }

  //   setTokenImages((prev) => ({ ...prev, ...newTokenImages }));
  // };

  const handleBuyToken = useCallback(
    async (tokenAddress: string, tokenSymbol: string) => {
      loginModalContext.withAuth(async () => {
        setBuyLoadingStates((prev) => ({ ...prev, [tokenAddress]: true }));
        try {
          console.log("Attempting to buy token:", {
            userId: user!.id,
            tokenAddress,
            amount: quickBuyAmount,
          });

          const result = await TradingService.buyToken(
            "0",
            tokenAddress,
            quickBuyAmount
          );

          if (result.success) {
            console.log("Buy order successful:", result);
            const txSignature =
              (result as any).signature || (result as any).result?.signature;
            showSuccess(
              "Buy Order Placed",
              `Successfully placed buy order for ${quickBuyAmount} SOL of ${tokenSymbol}`,
              undefined,
              txSignature
            );
            fetchUserData();

            setTimeout(() => {
              fetchUserData();
            }, 5000);
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
              `You don't have enough balance to buy ${quickBuyAmount} SOL of ${tokenSymbol}.`
            );
          } else {
            showError(
              "Buy Order Failed",
              error.message || "Failed to place buy order"
            );
          }
        } finally {
          setBuyLoadingStates((prev) => ({ ...prev, [tokenAddress]: false }));
        }
      });
    },
    [loginModalContext, user, quickBuyAmount, showSuccess, showError]
  );

  const handleSellToken = useCallback(
    async (tokenAddress: string, tokenSymbol: string) => {
      loginModalContext.withAuth(async () => {
        setSellLoadingStates((prev) => ({ ...prev, [tokenAddress]: true }));
        try {
          console.log("Attempting to sell token:", {
            userId: user!.id,
            tokenAddress,
            percentage: quickSellPercentage,
          });

          const result = await TradingService.sellToken(
            "0",
            tokenAddress,
            quickSellPercentage
          );

          if (result.success) {
            console.log("Sell order successful:", result);
            const txSignature =
              (result as any).signature || (result as any).result?.signature;
            showSuccess(
              "Sell Order Placed",
              `Successfully placed sell order for ${quickSellPercentage}% of ${tokenSymbol}`,
              undefined,
              txSignature
            );
            fetchUserData();

            setTimeout(() => {
              fetchUserData();
            }, 5000);
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
              `You don't have enough ${tokenSymbol} to sell ${quickSellPercentage}%.`
            );
          } else {
            showError(
              "Sell Order Failed",
              error.message || "Failed to place sell order"
            );
          }
        } finally {
          setSellLoadingStates((prev) => ({ ...prev, [tokenAddress]: false }));
        }
      });
    },
    [loginModalContext, user, quickSellPercentage, showSuccess, showError]
  );

  const fetchUserData = async () => {
    console.log("🔍 [Holdings] Checking user data:", {
      user,
      userId: user?.id,
      isAuthenticated: !!user,
    });

    if (!user?.id) {
      console.warn("❌ [Holdings] No user ID available");
      setError("Please connect your wallet to view your profile");
      setLoading(false);
      return;
    }

    console.log("📊 [Holdings] Fetching user data for wallet:", {
      userId: user.id,
    });

    try {
      setLoading(true);
      setError(null);
      const response = await TradingService.updateBalance();
      console.log("✅ [Holdings] Balance data received:", response);
      console.log(
        "🔍 [Holdings] Full response object:",
        JSON.stringify(response, null, 2)
      );
      setUserData(response);

      // Note: updateBalance doesn't return positions data
      // Token positions functionality will need to be handled separately if needed
    } catch (err: any) {
      console.error("❌ [Holdings] Failed to fetch positions data:", err);
      setError(err.message || "Failed to load positions data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              width="100%"
              height={120}
              className="rounded-sm"
            />
          ))}
        </div>
        <Skeleton width="100%" height={100} className="rounded-sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-sm flex items-center justify-center mx-auto mb-4">
          <Icon
            icon="material-symbols:error"
            className="w-8 h-8 text-red-400"
          />
        </div>
        <p className="text-red-400 font-tiktok mb-4">{error}</p>
        <button
          onClick={fetchUserData}
          className="px-6 py-3 bg-main-accent hover:bg-main-highlight text-main-bg font-tiktok rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/20"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userData?.result) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-main-accent/20 rounded-sm flex items-center justify-center mx-auto mb-4">
          <Icon
            icon="material-symbols:account-balance-wallet"
            className="w-8 h-8 text-main-accent"
          />
        </div>
        <p className="text-main-light-text font-tiktok">
          No user data available
        </p>
      </div>
    );
  }

  // const userInfo = userData.userPoint;
  // const walletBalance = userData.result[0];

  // Find the SNIPER address (SOL token)
  const sniperAddress = userData.result.find(
    (balance: any) => normalizeTokenSymbol(balance.token.symbol) === "SOL"
  );

  return (
    <div className="space-y-8">
      {/* User Info Section */}
      <div className="  bg-[#161616]  border border-white/[0.1] rounded-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-algance text-xl text-main-text">User Profile</h3>
          <button
            onClick={fetchUserData}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#161616]  hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 rounded-sm transition-all duration-300"
          >
            <Icon
              icon="material-symbols:refresh"
              className="w-4 h-4 text-main-light-text"
            />
            <span className="font-tiktok text-sm text-main-light-text">
              Refresh
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SNIPER Wallet Address */}
          {sniperAddress && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-sm flex items-center justify-center">
                <Icon
                  icon="material-symbols:account-balance-wallet"
                  className="w-6 h-6 text-yellow-400"
                />
              </div>
              <div>
                <p className="font-tiktok text-sm text-main-light-text">
                  SNIPER Wallet Address
                </p>
                <p className="font-tiktok text-base text-yellow-400 font-mono">
                  {sniperAddress.address.substring(0, 6)}...
                  {sniperAddress.address.substring(
                    sniperAddress.address.length - 4
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Balances Section */}
      {userData.result && userData.result.length > 0 && (
        <div className="  bg-[#161616]  border border-white/[0.1] rounded-sm p-6">
          <h3 className="font-algance text-xl text-main-text mb-4">
            Wallet Balances ({userData.result.length})
          </h3>

          <div className=" grid grid-cols-2 gap-3">
            {userData.result.map((balance, index) => (
              <div
                key={index}
                className="flex flex-col justify-around   p-4 bg-[#161616]  rounded-sm border border-white/[0.1] space-y-3"
              >
                {/* Balance Info Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-sm flex items-center justify-center overflow-hidden">
                      <span className="font-bold text-white text-sm">
                        {normalizeTokenSymbol(balance.token?.symbol)
                          ?.slice(0, 2)
                          .toUpperCase() || "WL"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-tiktok text-base text-main-text font-medium">
                        {normalizeTokenDisplayName(balance.token?.title) ||
                          normalizeTokenDisplayName(balance.token?.name) ||
                          "Wallet"}
                      </h4>
                      <p className="font-tiktok text-sm text-main-light-text">
                        {normalizeTokenSymbol(balance.token?.symbol) ||
                          "Wallet"}{" "}
                        • {balance.key?.label || "Wallet Address"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-algance text-lg text-main-text">
                      {formatTokenAmount(
                        balance.confirmedBalance || "0",
                        balance.token
                      )}
                    </p>
                    {balance.confirmedBalanceUSD && (
                      <p className="font-tiktok text-sm text-main-light-text">
                        ${balance.confirmedBalanceUSD} USD
                      </p>
                    )}
                  </div>
                </div>

                {/* Buy/Sell Buttons Row - Only show for non-SOL tokens */}
                {balance.token.symbol !== "SOL" && (
                  <div className="flex w-full gap-2">
                    <button
                      onClick={() =>
                        handleBuyToken(
                          balance.token.contractAddress,
                          balance.token.symbol
                        )
                      }
                      disabled={buyLoadingStates[balance.token.contractAddress]}
                      className="flex-1 relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-green-400/50 rounded-lg py-2 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-400/0 before:via-green-400/10 before:to-green-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center gap-1 relative z-10">
                        {buyLoadingStates[balance.token.contractAddress] ? (
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
                          {buyLoadingStates[balance.token.contractAddress]
                            ? "Buying..."
                            : `Buy ${quickBuyAmount} SOL`}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSellToken(
                          balance.token.contractAddress,
                          balance.token.symbol
                        )
                      }
                      disabled={
                        sellLoadingStates[balance.token.contractAddress]
                      }
                      className="flex-1 relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/50 rounded-lg py-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-400/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/10 before:to-red-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center gap-1 relative z-10">
                        {sellLoadingStates[balance.token.contractAddress] ? (
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
                          {sellLoadingStates[balance.token.contractAddress]
                            ? "Selling..."
                            : `Sell ${quickSellPercentage}%`}
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Holdings;
