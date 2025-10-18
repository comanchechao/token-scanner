import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface TelegramChannel {
  name: string;
  members: string;
  mentions: number;
  sentiment: string;
}

interface TelegramData {
  count: number;
  totalMembers: string;
  top: TelegramChannel[];
}

interface TelegramCallsProps {
  telegramData: TelegramData;
  custom?: number;
  variants?: any;
  sectionRef?: (el: HTMLElement | null) => void;
}

const TelegramCalls: React.FC<TelegramCallsProps> = ({
  telegramData,
  custom = 2,
  variants,
  sectionRef,
}) => {
  return (
    <motion.div
      id="telegram"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-[#161616] border border-white/[0.08] hover:border-main-accent/20 hover:bg-white/[0.02] rounded-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xl text-main-text">Telegram Calls</h3>
        <div className="text-right">
          <div className="font-display text-sm text-main-accent">
            {telegramData.count} channels
          </div>
          <div className="font-display text-xs text-main-light-text/60">
            {telegramData.totalMembers} total reach
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {telegramData.top.map((ch: TelegramChannel) => (
          <div
            key={ch.name}
            className="bg-[#0a0a0a] hover:bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] rounded-lg p-3 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Icon
                  icon="ic:baseline-telegram"
                  className="w-6 h-6 text-blue-400"
                />
                <div>
                  <div className="font-display text-main-light-text font-medium">
                    {ch.name}
                  </div>
                  <div className="font-display text-xs text-main-light-text/60">
                    {ch.mentions} mentions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-main-text">{ch.members}</div>
                <div
                  className={`font-display text-xs px-2 py-1 rounded-full ${
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
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TelegramCalls;
