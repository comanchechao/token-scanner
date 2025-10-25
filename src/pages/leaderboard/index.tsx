"use client";
import { FC, useCallback, useState } from "react";
import LeaderBoardTable from "./components/LeaderBoardTable.tsx";
import TopThreeCards from "./components/TopThreeCards.tsx";
import CopyTradeModal from "./components/CopyTradeModal.tsx";
import Navbar from "../../layouts/Navbar.tsx";
import Footer from "../../layouts/Footer.tsx";
import { LeaderboardItem } from "../../types/api";

const seedData: LeaderboardItem[] = [
  {
    rank: 1,
    traderName: "Cupsey",
    handle: "suqh5s",
    wallet: "suqh5s",
    pnl: 650,
    followers: 0,
    winRate: 95.2,
    profit: 1374642.9,
    totalPoints: 5910,
    weeklyPoints: 4013,
    avatar: "/cupsey.jpg",
  },
  {
    rank: 2,
    traderName: "Cented",
    handle: "CyaE1V",
    wallet: "CyaE1V",
    pnl: 457,
    followers: 0,
    winRate: 87.5,
    profit: 673278.1,
    totalPoints: 2647,
    weeklyPoints: 2534,
    avatar: "/cented.jpg",
  },
  {
    rank: 3,
    traderName: "Jijo",
    handle: "4BdKax",
    wallet: "4BdKax",
    pnl: 369,
    followers: 0,
    winRate: 92.3,
    profit: 231059.6,
    totalPoints: 617,
    weeklyPoints: 349,
    avatar: "/jijo.jpg",
  },
  {
    rank: 4,
    traderName: "Brox",
    handle: "7VBTpi",
    wallet: "7VBTpi",
    pnl: 158,
    followers: 0,
    winRate: 78.9,
    profit: 227352.0,
    totalPoints: 96,
    weeklyPoints: 70,
    avatar: "/brox.jpg",
  },
  {
    rank: 5,
    traderName: "clukz",
    handle: "G6fUXj",
    wallet: "G6fUXj",
    pnl: 105,
    followers: 0,
    winRate: 85.2,
    profit: 223766.7,
    totalPoints: 381,
    weeklyPoints: 447,
    avatar: "/clokz.jpg",
  },
  {
    rank: 6,
    traderName: "Gake",
    handle: "DNfuF1",
    wallet: "DNfuF1",
    pnl: 1046.06,
    followers: 0,
    winRate: 73.4,
    profit: 215948.7,
    totalPoints: 18,
    weeklyPoints: 0,
    avatar: "",
  },
  {
    rank: 7,
    traderName: "rayan",
    handle: "BNahnx",
    wallet: "BNahnx",
    pnl: 966.22,
    followers: 0,
    winRate: 68.7,
    profit: 199467.0,
    totalPoints: 363,
    weeklyPoints: 531,
    avatar: "",
  },
  {
    rank: 8,
    traderName: "TIL",
    handle: "EHg5Yk",
    wallet: "EHg5Yk",
    pnl: 945.83,
    followers: 0,
    winRate: 81.2,
    profit: 195258.1,
    totalPoints: 754,
    weeklyPoints: 1000,
    avatar: "",
  },
  {
    rank: 9,
    traderName: "Mitch",
    handle: "4Be9Cv",
    wallet: "4Be9Cv",
    pnl: 852.45,
    followers: 0,
    winRate: 76.5,
    profit: 175980.6,
    totalPoints: 90,
    weeklyPoints: 7,
    avatar: "",
  },
  {
    rank: 10,
    traderName: "^1s1mple",
    handle: "AeLaMj",
    wallet: "AeLaMj",
    pnl: 810.76,
    followers: 0,
    winRate: 89.1,
    profit: 167373.9,
    totalPoints: 1970,
    weeklyPoints: 1614,
    avatar: "",
  },
  {
    rank: 11,
    traderName: "tech",
    handle: "5d3jQc",
    wallet: "5d3jQc",
    pnl: 810.01,
    followers: 0,
    winRate: 71.8,
    profit: 167219.1,
    totalPoints: 200,
    weeklyPoints: 222,
    avatar: "",
  },
];

const leaderboardData: LeaderboardItem[] = seedData;

const LeaderboardPage: FC = () => {
  const [isCopyTradeModalOpen, setIsCopyTradeModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<LeaderboardItem | null>(
    null
  );

  const handleCopyTrade = useCallback((trader: LeaderboardItem) => {
    setSelectedTrader(trader);
    setIsCopyTradeModalOpen(true);
  }, []);

  const handleCloseCopyTradeModal = useCallback(() => {
    setIsCopyTradeModalOpen(false);
    setSelectedTrader(null);
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const tableData = leaderboardData;

  return (
    <div className="min-h-screen bg-main-bg !overflow-x-hidden bg-grid flex flex-col">
      <Navbar />
      <div className="relative w-full mx-auto px-4 lg:px-20 xl:px-20 2xl:px-44 py-8">
        <div className="flex flex-col gap-4">
          <div className="space-y-8">
            <TopThreeCards topThree={topThree} />
            <LeaderBoardTable
              content={tableData}
              onCopyTrade={handleCopyTrade}
            />
          </div>
        </div>
      </div>

      {selectedTrader && (
        <CopyTradeModal
          open={isCopyTradeModalOpen}
          onClose={handleCloseCopyTradeModal}
          walletData={{
            walletAddress: selectedTrader.wallet,
            username: selectedTrader.traderName,
            profileImage: selectedTrader.avatar || "/fallback-image.webp",
            portfolio: {
              winRate: selectedTrader.winRate,
              avgDuration: "2.3h",
              topWinSol: selectedTrader.pnl,
              totalVolumeSOL: selectedTrader.profit,
            },
            holdings: {
              solanaBalance: selectedTrader.pnl,
              OtherBalances: [
                { symbol: "USDC", balance: 1000 },
                { symbol: "BONK", balance: 5000000 },
              ],
            },
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
