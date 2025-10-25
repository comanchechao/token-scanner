import Pagination from "../../../components/ui/Pagination";
import { FC, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

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

  return (
    <div className="relative bg-surface border border-subtle rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
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
                { label: "FOLLOWERS", icon: "mdi:account-group" },
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
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:account-group"
                      width="16"
                      height="16"
                      className="text-main-accent"
                    />
                    <span className="text-sm text-main-text font-medium">
                      {item.followers}K
                    </span>
                  </div>
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
