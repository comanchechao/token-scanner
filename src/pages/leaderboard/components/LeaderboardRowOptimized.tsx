import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { LeaderboardKOL } from "../../../types/api";

// Lazy load the modal to reduce initial bundle size
const CopyTradeModal = lazy(() => import("../../../components/CopyTradeModal"));

interface LeaderboardRowProps {
  kol: LeaderboardKOL;
  rank: number;
  isTopRank?: boolean;
}

const formatNumber = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getRankDisplay = (rank: number) => {
  switch (rank) {
    case 1:
      return { emoji: "🏆", color: "text-yellow-400" };
    case 2:
      return { emoji: "🥈", color: "text-gray-300" };
    case 3:
      return { emoji: "🥉", color: "text-yellow-600" };
    default:
      return { emoji: null, color: "text-main-text" };
  }
};

const LeaderboardRow: React.FC<LeaderboardRowProps> = React.memo(
  ({ kol, rank, isTopRank = false }) => {
    const [isCopyTradeModalOpen, setIsCopyTradeModalOpen] = useState(false);

    const rankDisplay = useMemo(() => getRankDisplay(rank), [rank]);

    const twitterHandle = useMemo(
      () =>
        kol.socialLinks?.twitter
          ? kol.socialLinks.twitter.split("/").pop() || ""
          : "",
      [kol.socialLinks?.twitter]
    );

    const displayAddress = useMemo(
      () =>
        twitterHandle
          ? `@${twitterHandle}`
          : `${kol.walletAddress.slice(0, 6)}...${kol.walletAddress.slice(-4)}`,
      [twitterHandle, kol.walletAddress]
    );

    const formattedWinRate = useMemo(
      () => formatNumber(kol.winRate),
      [kol.winRate]
    );
    const formattedPnLSOL = useMemo(
      () => (kol.totalPnLSOL ? formatNumber(kol.totalPnLSOL) : "0"),
      [kol.totalPnLSOL]
    );
    const formattedPnL = useMemo(
      () => (kol.totalPnL ? formatNumber(kol.totalPnL) : "0"),
      [kol.totalPnL]
    );

    const handleCopyTradeClick = useCallback(() => {
      setIsCopyTradeModalOpen(true);
    }, []);

    const walletData = useMemo(
      () => ({
        walletAddress: kol.walletAddress,
        username: kol.username,
        profileImage: kol.profileImage,
        portfolio: {
          winRate: kol.winRate,
          avgDuration: "N/A",
          topWinSol: kol.topWinSol || 0,
          totalVolumeSOL: kol.totalVolumeSOL || 0,
        },
        holdings: {
          solanaBalance: 0,
          OtherBalances: [],
        },
      }),
      [kol]
    );

    return (
      <>
        <div
          className={`bg-white/5 border border-white/10 rounded-sm p-4 transition-colors hover:bg-white/8 hover:border-white/20 ${
            isTopRank ? "bg-yellow-500/10 border-yellow-500/30" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-sm font-bold">
              {rankDisplay.emoji ? (
                <span className="text-lg">{rankDisplay.emoji}</span>
              ) : (
                <span className={rankDisplay.color}>{rank}</span>
              )}
            </div>

            {/* Avatar & User Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                {kol.profileImage ? (
                  <img
                    src={kol.profileImage}
                    alt={kol.username}
                    className="w-full h-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-lg">🚀</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/accounts/${kol.walletAddress}`}
                    className="font-semibold text-white hover:text-blue-400 truncate"
                  >
                    {kol.username}
                  </Link>
                  {kol.isVerified && (
                    <Icon
                      icon="material-symbols:verified"
                      className="w-4 h-4 text-blue-400 flex-shrink-0"
                    />
                  )}
                  {kol.socialLinks?.twitter && (
                    <a
                      href={kol.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon
                        icon="hugeicons:new-twitter-rectangle"
                        className="w-4 h-4"
                      />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {displayAddress}
                </p>
              </div>
            </div>

            {/* Stats - Hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-300">
                  <span className="text-green-500">{kol.winningTrades}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-red-400">{kol.losingTrades}</span>
                </div>
                <div className="text-xs text-green-600">
                  {formattedWinRate}% win
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-green-500">
                  {kol.totalPnLSOL && kol.totalPnLSOL > 0 ? "+" : ""}
                  {formattedPnLSOL} SOL
                </div>
                <div className="text-xs text-gray-400">${formattedPnL}</div>
              </div>
            </div>

            {/* Copy Trade Button */}
            <button
              onClick={handleCopyTradeClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            >
              <span className="hidden sm:inline">Copy Trade</span>
              <span className="sm:hidden">Copy</span>
            </button>
          </div>

          {/* Mobile Stats - Only shown on mobile */}
          <div className="sm:hidden mt-3 pt-3 border-t border-white/10 flex justify-between">
            <div className="text-sm text-gray-300">
              <span className="text-green-500">{kol.winningTrades}</span>
              <span className="text-gray-500">/</span>
              <span className="text-red-400">{kol.losingTrades}</span>
              <span className="text-gray-500 ml-2">({formattedWinRate}%)</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-500">
                {kol.totalPnLSOL && kol.totalPnLSOL > 0 ? "+" : ""}
                {formattedPnLSOL} SOL
              </div>
              <div className="text-xs text-gray-400">${formattedPnL}</div>
            </div>
          </div>
        </div>

        {/* Lazy-loaded Modal */}
        {isCopyTradeModalOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <CopyTradeModal
              open={isCopyTradeModalOpen}
              onClose={() => setIsCopyTradeModalOpen(false)}
              walletData={walletData}
            />
          </Suspense>
        )}
      </>
    );
  }
);

LeaderboardRow.displayName = "LeaderboardRowOptimized";

export default LeaderboardRow;
