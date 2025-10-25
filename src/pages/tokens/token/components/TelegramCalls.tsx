import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface TelegramChannel {
  name: string;
  members: string;
  mentions: number;
  sentiment: string;
}

interface TelegramCallsProps {
  telegramData: {
    count: number;
    totalMembers: string;
    top: TelegramChannel[];
  };
}

const TelegramCalls: React.FC<TelegramCallsProps> = ({ telegramData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13] border-x border-subtle text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white">Telegram Calls</h2>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="text-right">
          <div className="text-sm text-white">
            {telegramData.count} channels
          </div>
          <div className="text-xs text-white/50">
            {telegramData.totalMembers} reach
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {telegramData.top.slice(0, 3).map((ch: TelegramChannel) => (
            <div
              key={ch.name}
              className="bg-white/5 rounded-sm p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon="ic:baseline-telegram"
                  className="w-6 h-6 text-blue-400"
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    {ch.name}
                  </div>
                  <div className="text-xs text-white/50">
                    {ch.mentions} mentions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {ch.members}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    ch.sentiment === "Bullish"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : ch.sentiment === "Bearish"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {ch.sentiment}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TelegramCalls;
