import React, { useState, useEffect } from "react";
import tradingService from "@/api/tradingService";

import { Icon } from "@iconify/react";
import SortIcon from "@/components/ui/Icons/Custom/Sort/SortIcon";
import { SolanaIcon } from "@/components/ui/Icons";
import { errorToast } from "@/utils/toast";

interface TokenData {
  id: string;
  name: string;
  invested: string;
  remaining: {
    value: string;
    secondary: string;
  };
  sold: {
    value: string;
    secondary: string;
  };
  change: {
    percentage: string;
    value: string;
    isPositive: boolean;
  };
  canSell: boolean;
}

export default function TokenHoldings() {
  const [isMobile, setIsMobile] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTokens, setHasTokens] = useState(false);

  // Check for mobile viewport on mount and resize
  useEffect(() => {
    fetchHoldings();

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const fetchHoldings = async () => {
    setIsLoading(true);
    try {
      const response = await tradingService.updateBalance();
      if (response.success && Array.isArray(response.result)) {
        const mappedData: TokenData[] = response.result.map((item: any) => ({
          id: item.id,
          name: item.token.symbol,
          invested: "0", // no invested field in response, set to 0 or derive later
          remaining: {
            value: parseFloat(item.confirmedBalance).toFixed(
              item.token.decimalsToShow || 6
            ),
            secondary: item.confirmedBalanceUSD
              ? `$${parseFloat(item.confirmedBalanceUSD).toFixed(2)}`
              : "$0.00",
          },
          sold: {
            value: "0", // no sold info in response
            secondary: "0",
          },
          change: {
            percentage: "0.00%", // no pnl info in response
            value: "0",
            isPositive: false,
          },
          canSell: parseFloat(item.confirmedBalance) > 0,
        }));
        setTokens(mappedData);
        setHasTokens(mappedData.length > 0);
      } else {
        errorToast("Failed to fetch holdings.");
        setTokens([]);
        setHasTokens(false);
      }
    } catch (err: any) {
      console.error("Error fetching holdings:", err);
      errorToast(err.message || "An error occurred while fetching holdings.");
      setTokens([]);
      setHasTokens(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile controls
  const renderMobileControls = () => (
    <div className="flex flex-col gap-3 p-2 rounded-lg">
      <div className="flex justify-between items-center">
        <button className="flex items-center gap-1.5 h-[34px] px-4 py-1 border border-gray-800 rounded-full hover:bg-gray-900 transition-colors">
          <SortIcon width={18} height={18} />
          <span className="text-sm text-gray-300">Filter</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Hidden</span>
          <div className="w-12 h-6 bg-[#7c49ff] rounded-full relative flex items-center px-0.5 cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 shadow-md transition-transform"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Search Token"
            className="w-full h-[34px] pl-9 pr-3 py-1 bg-transparent border border-gray-800 rounded-full text-gray-300 text-sm focus:outline-none focus:border-gray-700"
          />
          <div className="absolute left-3">
            <SolanaIcon width={16} height={16} />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <span className="text-xs text-gray-400">Expand</span>
          <div className="w-12 h-6 bg-gray-800 rounded-full relative flex items-center px-0.5 cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 shadow-md transition-transform"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile card view for tokens
  const renderMobileTokenCard = (token: TokenData) => (
    <div
      key={token.id}
      className="bg-[#1e1e1e] rounded-lg p-4 border border-gray-800 mb-4"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 font-medium">{token.name}</div>
        <div
          className={
            token.change.isPositive ? "text-green-500" : "text-gray-400"
          }
        >
          {token.change.percentage}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Invested</p>
          <div className="flex items-center text-white">
            {token.name === "SOL" && (
              <Icon
                icon="token-branded:solana"
                width="18"
                height="18"
                className="mr-1"
              />
            )}
            <span>{token.invested}</span>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-xs mb-1">Remaining</p>
          <div className="flex items-center text-white">
            {token.name === "SOL" && (
              <Icon
                icon="token-branded:solana"
                width="18"
                height="18"
                className="mr-1"
              />
            )}
            <span>{token.remaining.value}</span>
          </div>
          <div className="text-gray-500 text-xs">
            {token.remaining.secondary}
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-xs mb-1">Sold</p>
          <div className="flex items-center text-white">
            {token.name === "SOL" && (
              <Icon
                icon="token-branded:solana"
                width="18"
                height="18"
                className="mr-1"
              />
            )}
            <span>{token.sold.value}</span>
          </div>
          <div className="text-gray-500 text-xs">{token.sold.secondary}</div>
        </div>

        <div>
          <p className="text-gray-400 text-xs mb-1">P&L</p>
          <div
            className={
              token.change.isPositive ? "text-green-500" : "text-gray-400"
            }
          >
            {token.change.isPositive ? "+" : ""}
            {token.change.value}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="flex cursor-pointer items-center gap-2 text-gray-400 hover:text-white">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span className="text-sm">Share</span>
        </button>
        {token.canSell && (
          <button className="px-4 cursor-pointer py-1.5 text-sm text-gray-400 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white">
            Sell
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full  bg-[#0e0f13] border-t border-x border-border p-4 rounded-md">
      <div className="flex flex-col gap-4">
        {/* Responsive Controls */}
        {isMobile ? (
          renderMobileControls()
        ) : (
          <div className="flex justify-between items-center p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 h-[34px] px-4 py-1 border border-gray-800 rounded-full hover:bg-gray-900 transition-colors">
                <SortIcon width={18} height={18} />
                <span className="text-sm text-gray-300">Filter</span>
              </button>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search Token"
                  className="w-[200px] h-[34px] pl-9 pr-3 py-1 bg-transparent border border-gray-800 rounded-full text-gray-300 text-sm focus:outline-none focus:border-gray-700"
                />
                <div className="absolute left-3">
                  <SolanaIcon width={16} height={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Hidden</span>
                <div className="w-12 h-6 bg-[#7c49ff] rounded-full relative flex items-center px-0.5 cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 shadow-md transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Expand</span>
                <div className="w-12 h-6 bg-gray-800 rounded-full relative flex items-center px-0.5 cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 shadow-md transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Token Table or Cards */}
        {isMobile ? (
          isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : hasTokens ? (
            <div className="px-2 py-1">{tokens.map(renderMobileTokenCard)}</div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No tokens found.
            </div>
          )
        ) : isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : hasTokens ? (
          <div className="w-full overflow-hidden rounded-lg">
            {/* Table Header */}
            <div className="grid grid-cols-5 border-b border-gray-800 py-3 px-6 text-sm font-medium">
              <div className="flex items-center gap-1 text-white">
                Token <span className="ml-1 text-xs text-gray-500">↕</span>
              </div>
              <div className="cursor-pointer text-gray-500 transition-all duration-200 ease-in hover:text-white">
                Invested
              </div>
              <div className="cursor-pointer text-gray-500 transition-all duration-200 ease-in hover:text-white">
                Remaining
              </div>
              <div className="cursor-pointer text-gray-500 transition-all duration-200 ease-in hover:text-white">
                Sold
              </div>
              <div className="cursor-pointer text-gray-500 transition-all duration-200 ease-in hover:text-white">
                Chance in P&L
              </div>
            </div>

            {/* Table Body */}
            {tokens.map((token) => (
              <div key={token.id} className="border-b border-gray-800">
                <div className="grid grid-cols-5 items-center py-5 px-6 text-sm">
                  <div className="flex items-center gap-3">{token.name}</div>
                  <div className="flex items-center text-white">
                    {token.name === "SOL" && (
                      <Icon
                        icon="token-branded:solana"
                        width="24"
                        height="24"
                        className="mr-1"
                      />
                    )}
                    {token.invested}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center text-white">
                      {token.name === "SOL" && (
                        <Icon
                          icon="token-branded:solana"
                          width="24"
                          height="24"
                          className="mr-1"
                        />
                      )}
                      {token.remaining.value}
                    </div>
                    <div className="text-gray-500">
                      {token.remaining.secondary}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-white">
                      {token.name === "SOL" && (
                        <Icon
                          icon="token-branded:solana"
                          width="24"
                          height="24"
                          className="mr-1"
                        />
                      )}
                      {token.sold.value}
                    </div>
                    <div className="text-gray-500">{token.sold.secondary}</div>
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={
                        token.change.isPositive
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    >
                      {token.change.percentage}
                    </div>
                    <div
                      className={
                        token.change.isPositive
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    >
                      {token.change.isPositive ? "+" : ""}
                      {token.change.value}
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-end py-3 px-6">
                  <div className="flex items-center gap-4">
                    <button className="flex cursor-pointer items-center gap-2 text-gray-400 hover:text-white">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      Share
                    </button>
                    {token.canSell && (
                      <button className="cursor-pointer rounded-full border border-gray-800 px-6 py-1.5 text-gray-400 hover:bg-gray-800 hover:text-white">
                        Sell
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">No tokens found.</div>
        )}
      </div>
    </div>
  );
}
