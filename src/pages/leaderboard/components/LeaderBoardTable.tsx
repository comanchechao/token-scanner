import Pagination from "../../../components/ui/Pagination";
import { FC, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LeaderboardItem } from "../../../types/api";

interface Props {
  content: LeaderboardItem[];
  itemsPerPage?: number;
  onCopyTrade: (trader: LeaderboardItem) => void;
}

const LeaderBoardTable: FC<Props> = ({
  content,
  itemsPerPage = 10,
  onCopyTrade,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(content.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = content.slice(start, start + itemsPerPage);

  // Mobile Card Component
  const MobileCard = ({ item }: { item: LeaderboardItem }) => (
    <div className="bg-surface border border-subtle rounded-sm p-4 mb-3 hover:bg-main-accent/5 hover:border-main-accent/20 transition-all duration-300">
      {/* Header with Rank and Avatar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-main-accent/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-main-accent">
              #{item.rank}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt={item.traderName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Icon
                icon="mdi:account"
                width="16"
                height="16"
                className="text-main-accent"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-main-text">
              {item.traderName}
            </p>
            <p className="text-xs text-main-light-text">@{item.handle}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-main-accent/10 rounded transition-colors">
            <Icon
              icon="simple-icons:x"
              width="14"
              height="14"
              className="text-main-light-text"
            />
          </button>
          <button className="p-1 hover:bg-main-accent/10 rounded transition-colors">
            <Icon
              icon="simple-icons:telegram"
              width="14"
              height="14"
              className="text-main-accent"
            />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-surface border border-subtle rounded-sm p-2">
          <div className="text-xs text-main-light-text mb-1">PNL</div>
          <div className="text-sm font-medium text-main-accent">
            +{item.pnl.toLocaleString()} SOL
          </div>
          <div className="text-xs text-main-light-text">
            ${item.profit.toLocaleString()}
          </div>
        </div>
        <div className="bg-surface border border-subtle rounded-sm p-2">
          <div className="text-xs text-main-light-text mb-1">WIN RATE</div>
          <div className="text-sm font-medium text-green-400">
            {item.winRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-surface border border-subtle rounded-sm p-2">
          <div className="text-xs text-main-light-text mb-1">TOTAL POINTS</div>
          <div className="text-sm font-medium text-main-accent">
            {item.totalPoints.toLocaleString()}
          </div>
        </div>
        <div className="bg-surface border border-subtle rounded-sm p-2">
          <div className="text-xs text-main-light-text mb-1">WEEKLY</div>
          <div className="text-sm font-medium text-red-400">
            {item.weeklyPoints.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Copy Trade Button */}
      <button
        onClick={() => onCopyTrade(item)}
        className="w-full px-4 py-2 rounded-sm text-xs font-medium cursor-pointer transition-all duration-300 bg-main-accent/10 hover:bg-main-accent/20 text-main-accent hover:text-main-highlight flex items-center justify-center gap-2"
      >
        <Icon icon="mingcute:aiming-2-line" width={12} height={12} />
        Copy Trade
      </button>
    </div>
  );

  return (
    <div className="relative bg-surface border border-subtle rounded-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-subtle bg-surface">
              {[
                { label: "RANK", icon: "mdi:trophy-outline" },
                { label: "TRADER", icon: "mdi:account-outline" },
                { label: "POINTS", icon: "mdi:star-outline" },
                { label: "PNL", icon: "mdi:trending-up" },
                { label: "PROFIT", icon: "mdi:currency-usd" },
                { label: "WIN RATE", icon: "mdi:target" },
                { label: "ACTIONS", icon: "mdi:cog" },
              ].map((h) => (
                <th
                  key={h.label}
                  className="py-4 px-6 text-sm font-medium text-main-light-text text-left"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={h.icon}
                      width="16"
                      height="16"
                      className="text-main-accent"
                    />
                    {h.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item) => (
              <tr
                key={item.rank}
                className="border-b border-subtle hover:bg-main-accent/5 transition-all duration-300"
              >
                <td className="py-4 px-6 text-left">
                  <span className="text-sm font-medium text-main-text">
                    #{item.rank}
                  </span>
                </td>
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.traderName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Icon
                          icon="mdi:account"
                          width="16"
                          height="16"
                          className="text-main-accent"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-main-text">
                        {item.traderName}
                      </p>
                      <p className="text-xs text-main-light-text">
                        @{item.handle}
                      </p>
                    </div>
                    <div className="flex ml-2">
                      <button className="p-1 hover:bg-main-accent/10 rounded transition-colors">
                        <Icon
                          icon="simple-icons:x"
                          width="15"
                          height="15"
                          className="text-main-light-text"
                        />
                      </button>
                      <button className="p-1 hover:bg-main-accent/10 rounded transition-colors">
                        <Icon
                          icon="simple-icons:telegram"
                          width="15"
                          height="15"
                          className="text-main-accent"
                        />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-main-accent font-medium">
                      {item.totalPoints.toLocaleString()}
                    </span>
                    <span className="text-sm text-main-light-text">/</span>
                    <span className="text-sm text-red-400 font-medium">
                      {item.weeklyPoints.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-left">
                  <div className="flex flex-col">
                    <span className="text-sm text-main-accent font-medium">
                      +{item.pnl.toLocaleString()} Sol
                    </span>
                    <span className="text-sm text-main-accent font-medium">
                      (${item.profit.toLocaleString()})
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-left">
                  <span className="text-sm text-main-text font-medium">
                    ${item.profit.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6 text-left">
                  <span className="text-sm text-green-400 font-medium">
                    {item.winRate.toFixed(1)}%
                  </span>
                </td>
                <td className="py-4 px-6 text-left">
                  <button
                    onClick={() => onCopyTrade(item)}
                    className="px-4 py-3 rounded-lg text-xs font-medium cursor-pointer transition-all duration-300 bg-main-accent/10 hover:bg-main-accent/20 text-main-accent hover:text-main-highlight flex items-center gap-1.5 group"
                  >
                    <Icon
                      icon="mingcute:aiming-2-line"
                      width={12}
                      height={12}
                    />
                    Copy Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4">
        {pageItems.map((item) => (
          <MobileCard key={item.rank} item={item} />
        ))}
      </div>

      <div className="border-t border-subtle bg-surface p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default LeaderBoardTable;
