import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  handle: string;
  wins: number;
  losses: number;
  totalSol: number;
  totalUsd: number;
  isVerified?: boolean;
}

interface AllTimeLeaderboardProps {
  feedRef?: React.RefObject<HTMLDivElement>;
}

type TimePeriod = "daily" | "weekly" | "monthly";

// Mock leaderboard data based on the image
const MOCK_LEADERBOARD_DATA: Record<TimePeriod, LeaderboardEntry[]> = {
  daily: [
    {
      id: "1",
      rank: 1,
      name: "gr3g",
      avatar: "/dogLogo.webp",
      handle: "J23qr9",
      wins: 4,
      losses: 0,
      totalSol: 132.47,
      totalUsd: 24688.7,
      isVerified: true,
    },
    {
      id: "2",
      rank: 2,
      name: "Cented",
      avatar: "/goldenCoinLogo.webp",
      handle: "CyaE1V",
      wins: 63,
      losses: 62,
      totalSol: 87.37,
      totalUsd: 16283.6,
    },
    {
      id: "3",
      rank: 3,
      name: "AcoNeF",
      avatar: "/HosicoLogo.webp",
      handle: "AcoNeF",
      wins: 8,
      losses: 4,
      totalSol: 49.43,
      totalUsd: 9211.9,
    },
    {
      id: "4",
      rank: 4,
      name: "Tuults",
      avatar: "/uselessLogo.webp",
      handle: "5T229o",
      wins: 11,
      losses: 17,
      totalSol: 47.81,
      totalUsd: 8909.7,
      isVerified: true,
    },
    {
      id: "5",
      rank: 5,
      name: "Jijo",
      avatar: "/bonkKOLsLogo.webp",
      handle: "4BdKax",
      wins: 23,
      losses: 8,
      totalSol: 47.12,
      totalUsd: 8781.4,
      isVerified: true,
    },
    {
      id: "6",
      rank: 6,
      name: "Sheep",
      avatar: "/logoKOL.png",
      handle: "78N177",
      wins: 40,
      losses: 31,
      totalSol: 47.03,
      totalUsd: 8765.4,
    },
    {
      id: "7",
      rank: 7,
      name: "prettyover",
      avatar: "/cherryLogo.png",
      handle: "2e1w3X",
      wins: 3,
      losses: 8,
      totalSol: 41.63,
      totalUsd: 7759.0,
    },
    {
      id: "8",
      rank: 8,
      name: "JB",
      avatar: "/okxlogo.webp",
      handle: "7dP8Dm",
      wins: 1,
      losses: 1,
      totalSol: 40.95,
      totalUsd: 7632.4,
    },
  ],
  weekly: [
    {
      id: "1",
      rank: 1,
      name: "Cented",
      avatar: "/goldenCoinLogo.webp",
      handle: "CyaE1V",
      wins: 89,
      losses: 45,
      totalSol: 245.67,
      totalUsd: 45832.1,
    },
    {
      id: "2",
      rank: 2,
      name: "gr3g",
      avatar: "/dogLogo.webp",
      handle: "J23qr9",
      wins: 28,
      losses: 12,
      totalSol: 198.34,
      totalUsd: 37012.3,
      isVerified: true,
    },
    {
      id: "3",
      rank: 3,
      name: "Tuults",
      avatar: "/uselessLogo.webp",
      handle: "5T229o",
      wins: 67,
      losses: 89,
      totalSol: 156.78,
      totalUsd: 29264.5,
      isVerified: true,
    },
    {
      id: "4",
      rank: 4,
      name: "Jijo",
      avatar: "/bonkKOLsLogo.webp",
      handle: "4BdKax",
      wins: 145,
      losses: 67,
      totalSol: 134.22,
      totalUsd: 25056.8,
      isVerified: true,
    },
    {
      id: "5",
      rank: 5,
      name: "Sheep",
      avatar: "/logoKOL.png",
      handle: "78N177",
      wins: 234,
      losses: 178,
      totalSol: 123.45,
      totalUsd: 23048.9,
    },
  ],
  monthly: [
    {
      id: "1",
      rank: 1,
      name: "Tuults",
      avatar: "/uselessLogo.webp",
      handle: "5T229o",
      wins: 456,
      losses: 234,
      totalSol: 892.34,
      totalUsd: 166456.7,
      isVerified: true,
    },
    {
      id: "2",
      rank: 2,
      name: "Cented",
      avatar: "/goldenCoinLogo.webp",
      handle: "CyaE1V",
      wins: 567,
      losses: 345,
      totalSol: 734.56,
      totalUsd: 137089.2,
    },
    {
      id: "3",
      rank: 3,
      name: "gr3g",
      avatar: "/dogLogo.webp",
      handle: "J23qr9",
      wins: 234,
      losses: 123,
      totalSol: 623.78,
      totalUsd: 116423.8,
      isVerified: true,
    },
    {
      id: "4",
      rank: 4,
      name: "Jijo",
      avatar: "/bonkKOLsLogo.webp",
      handle: "4BdKax",
      wins: 789,
      losses: 456,
      totalSol: 567.89,
      totalUsd: 106012.4,
      isVerified: true,
    },
  ],
};

const AllTimeLeaderboard: React.FC<AllTimeLeaderboardProps> = ({ feedRef }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("daily");

  const currentData = MOCK_LEADERBOARD_DATA[selectedPeriod];

  const renderLeaderboardEntry = useCallback(
    (entry: LeaderboardEntry, index: number) => {
      const getRankIcon = (rank: number) => {
        switch (rank) {
          case 1:
            return "🏆";
          case 2:
            return "🥈";
          case 3:
            return "🥉";
          default:
            return rank.toString();
        }
      };

      const winRate =
        entry.wins + entry.losses > 0
          ? (entry.wins / (entry.wins + entry.losses)) * 100
          : 0;

      return (
        <div
          key={entry.id}
          className={`flex items-center justify-between p-3 xl:p-4 rounded-lg border transition-all duration-200 ${
            entry.rank <= 3
              ? "bg-gradient-to-r from-main-accent/10 to-main-highlight/10 border-main-accent/30"
              : "bg-surface hover:bg-main-accent/5 border-subtle hover:border-main-accent/20"
          }`}
        >
          {/* Rank and User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 xl:w-10 text-center">
              {entry.rank <= 3 ? (
                <span className="text-lg xl:text-xl">
                  {getRankIcon(entry.rank)}
                </span>
              ) : (
                <span className="font-mono text-main-light-text/60 text-sm xl:text-base font-medium">
                  {entry.rank}
                </span>
              )}
            </div>

            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex-shrink-0">
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    icon="material-symbols:person"
                    className="w-4 h-4 xl:w-5 xl:h-5 text-main-accent"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-main-text font-medium text-sm xl:text-base truncate">
                  {entry.name}
                </span>
                {entry.isVerified && (
                  <Icon
                    icon="material-symbols:verified"
                    className="w-4 h-4 text-blue-400 flex-shrink-0"
                  />
                )}
                <Icon
                  icon="mdi:twitter"
                  className="w-3 h-3 xl:w-4 xl:h-4 text-main-light-text/40 flex-shrink-0"
                />
                <span className="font-mono text-xs xl:text-sm text-main-light-text/60 truncate">
                  {entry.handle}
                </span>
              </div>

              {/* Win/Loss ratio - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 mt-1">
                <span className="font-display text-xs text-emerald-400">
                  {entry.wins}
                </span>
                <span className="font-display text-xs text-main-light-text/40">
                  /
                </span>
                <span className="font-display text-xs text-red-400">
                  {entry.losses}
                </span>
                <span className="font-display text-xs text-main-light-text/60 ml-2">
                  {winRate.toFixed(0)}% win rate
                </span>
              </div>
            </div>
          </div>

          {/* Performance Data */}
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-emerald-400 text-sm xl:text-base font-medium">
              +{entry.totalSol.toFixed(2)} Sol
            </div>
            <div className="font-mono text-main-light-text/60 text-xs xl:text-sm">
              (${entry.totalUsd.toLocaleString()})
            </div>
            {/* Win/Loss ratio - visible on mobile */}
            <div className="sm:hidden flex items-center justify-end gap-1 mt-1">
              <span className="font-display text-xs text-emerald-400">
                {entry.wins}
              </span>
              <span className="font-display text-xs text-main-light-text/40">
                /
              </span>
              <span className="font-display text-xs text-red-400">
                {entry.losses}
              </span>
            </div>
          </div>
        </div>
      );
    },
    []
  );

  return (
    <div className="relative bg-surface border border-subtle rounded-sm h-fit py-4 px-6 xl:py-6 xl:px-8 transition-all duration-500 shadow-elevated">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-4 xl:mb-6 relative z-10">
        <h2 className="font-algance text-xl xl:text-2xl text-main-text">
          All Time Leaderboard
        </h2>

        {/* Time period tabs */}
        <div className="flex items-center bg-surface border border-subtle rounded-lg p-1">
          {(["daily", "weekly", "monthly"] as TimePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 xl:px-4 xl:py-1.5 rounded-md text-xs xl:text-sm font-display transition-all duration-200 ${
                selectedPeriod === period
                  ? "bg-main-accent text-main-bg"
                  : "text-main-light-text hover:text-main-accent hover:bg-main-accent/10"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard entries */}
      <div ref={feedRef} className="space-y-3 xl:space-y-4 relative z-10">
        {currentData.map(renderLeaderboardEntry)}
      </div>

      {/* View Full Leaderboard button */}
      <div className="text-center flex justify-center mt-8 xl:mt-10 relative z-10">
        <Link
          to="/leaderboard"
          className="relative overflow-hidden w-fit px-4 py-3 xl:px-6 xl:py-4 ml-4 z-50 transition-all flex gap-2 items-center ease-in shadow-2xl shadow-main-accent border border-main-accent/50 text-main-accent text-sm xl:text-base rounded-sm duration-300 cursor-pointer"
        >
          <span className="flex gap-2 items-center">View Full Leaderboard</span>
          <Icon
            icon="material-symbols:arrow-right-alt"
            className="ml-2 w-5 h-5 xl:w-6 xl:h-6"
          />
        </Link>
      </div>
    </div>
  );
};

export default AllTimeLeaderboard;
