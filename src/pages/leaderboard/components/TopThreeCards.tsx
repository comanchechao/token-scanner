import { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LeaderboardItem } from "../../../types/api";

interface Props {
  topThree: LeaderboardItem[];
}

const TopThreeCards: FC<Props> = ({ topThree }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: "mdi:trophy", color: "text-yellow-500" };
      case 2:
        return { icon: "mdi:medal", color: "text-gray-400" };
      case 3:
        return { icon: "mdi:medal-outline", color: "text-amber-600" };
      default:
        return { icon: "mdi:trophy-outline", color: "text-gray-400" };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {topThree.map((trader) => {
        const rankIcon = getRankIcon(trader.rank);
        return (
          <div
            key={trader.rank}
            className={`relative bg-surface border border-subtle rounded-sm p-6 transition-all duration-300 hover:bg-main-accent/5 hover:border-main-accent/20 hover:shadow-lg hover:shadow-main-accent/5`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center">
                  {trader.avatar ? (
                    <img
                      src={trader.avatar}
                      alt={trader.traderName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <Icon
                      icon="mdi:account"
                      width="28"
                      height="28"
                      className="text-main-accent"
                    />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-main-accent rounded-full p-1">
                  <Icon
                    icon={rankIcon.icon}
                    width="16"
                    height="16"
                    className="text-main-bg"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-main-text font-bold text-xl mb-1">
                  {trader.traderName}
                </h3>
                <p className="text-main-light-text text-sm mb-1">
                  @{trader.handle}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-main-accent/10 hover:bg-main-accent/20 rounded-full flex items-center justify-center transition-colors">
                  <Icon
                    icon="simple-icons:x"
                    width="16"
                    height="16"
                    className="text-main-text"
                  />
                </button>
                <button className="w-auto h-auto rounded-full flex items-center justify-center transition-colors">
                  <Icon
                    icon="simple-icons:telegram"
                    width="28"
                    height="28"
                    className="text-main-accent"
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-main-light-text text-xs font-medium uppercase tracking-wide">
                  PNL
                </p>
                <p className="text-main-text font-bold text-lg">
                  +{trader.pnl.toLocaleString()} SOL
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-main-light-text text-xs font-medium uppercase tracking-wide">
                  FOLLOWERS
                </p>
                <p className="text-main-text font-bold text-lg">
                  {trader.followers}K
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-main-light-text text-xs font-medium uppercase tracking-wide">
                  WIN RATE
                </p>
                <p className="text-green-400 font-bold text-lg">
                  {trader.winRate.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-main-light-text text-xs font-medium uppercase tracking-wide">
                  PROFIT
                </p>
                <p className="text-main-text font-bold text-lg">
                  ${trader.profit.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-surface rounded-lg px-3 py-2">
              <span className="text-main-light-text text-sm font-mono">
                {trader.wallet.slice(0, 6)}...{trader.wallet.slice(-6)}
              </span>
              <button className="flex items-center gap-2 text-main-light-text hover:text-main-text transition-colors bg-main-accent/10 hover:bg-main-accent/20 rounded-md px-3 py-1">
                <Icon icon="mdi:content-copy" width="14" height="14" />
                <span className="text-sm font-medium">Copy</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopThreeCards;
