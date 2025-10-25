import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface TokenStatsProps {
  timeframes: {
    [key: string]: {
      percentage: number | "N/A";
      color?: string;
    };
  };
  transactions: {
    total: number;
    buys: number;
    sells: number;
    buyVolume: number;
    sellVolume: number;
    buyers: number;
    sellers: number;
  };
}

const TokenStats: React.FC<TokenStatsProps> = ({
  timeframes,
  transactions,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13]  border-x border-subtle text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white">Token Info</h2>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
        <Icon
          icon="lucide:refresh-cw"
          width={16}
          height={16}
          className="text-white/50 cursor-pointer hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Add refresh functionality here if needed
          }}
        />
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* Tax Percentage */}
          <div className="p-4 border-b border-subtle">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">1.50%</div>
              <div className="text-xs text-white/50 mt-1">Tax %</div>
            </div>
          </div>

          {/* First Grid - Top 10 H, Dev H, Snipers H, Insiders, Bundlers, LP Burned */}
          <div className="p-4 border-b border-subtle">
            <div className="grid grid-cols-3 gap-2">
              {/* Top 10 H */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:user-star"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">Top 10 H.</div>
                  <div className="text-sm font-medium text-green-400">0%</div>
                </div>
              </div>

              {/* Dev H */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:chef-hat"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Dev H.</div>
                  <div className="text-sm font-medium text-green-400">0%</div>
                </div>
              </div>

              {/* Snipers H */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:target"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Snipers H.</div>
                  <div className="text-sm font-medium text-green-400">0%</div>
                </div>
              </div>

              {/* Insiders */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:ghost"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Insiders</div>
                  <div className="text-sm font-medium text-green-400">0%</div>
                </div>
              </div>

              {/* Bundlers */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:layers"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Bundlers</div>
                  <div className="text-sm font-medium text-green-400">0%</div>
                </div>
              </div>

              {/* LP Burned */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:flame"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">LP Burned</div>
                  <div className="text-sm font-medium text-green-400">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Grid - Holders, Pro Traders, Dex Paid */}
          <div className="p-4 border-b border-subtle">
            <div className="grid grid-cols-3 gap-2">
              {/* Holders */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:users"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Holders</div>
                  <div className="text-sm font-medium text-white">0</div>
                </div>
              </div>

              {/* Pro Traders */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:trending-up"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Pro Traders</div>
                  <div className="text-sm font-medium text-white">0</div>
                </div>
              </div>

              {/* Dex Paid */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:check-circle"
                  width={16}
                  height={16}
                  className="text-gray-300"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400">Dex Paid</div>
                  <div className="text-sm font-medium text-red-400">Unpaid</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Addresses */}
          <div className="p-4 border-b border-subtle space-y-3">
            {/* CA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:file-text"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <span className="text-sm text-gray-300">
                  CA: 5j5XKBQN94xAJHo...WLLM
                </span>
              </div>
              <Icon
                icon="lucide:external-link"
                width={14}
                height={14}
                className="text-white/50 cursor-pointer hover:text-white transition-colors"
              />
            </div>

            {/* DA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:chef-hat"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <span className="text-sm text-gray-300">
                  DA: 8dHtbWvaE6RyXV...rzz3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:edit"
                  width={14}
                  height={14}
                  className="text-white/50 cursor-pointer hover:text-white transition-colors"
                />
                <Icon
                  icon="lucide:external-link"
                  width={14}
                  height={14}
                  className="text-gray-400 cursor-pointer hover:text-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Exchange Information */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span className="text-sm text-gray-300">Coinbase</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:bar-chart-3"
                    width={16}
                    height={16}
                    className="text-gray-300"
                  />
                  <span className="text-sm text-white">3.50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:clock"
                    width={16}
                    height={16}
                    className="text-gray-300"
                  />
                  <span className="text-sm text-gray-300">12h</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TokenStats;
