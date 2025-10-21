import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import DetailModal from "./DetailModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <motion.div
      id="telegram"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-subtle hover:border-main-accent/20 hover:bg-main-accent/5 rounded-sm p-6 xl:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex items-center justify-between mb-4 xl:mb-6">
        <h3 className="font-mono text-xl xl:text-2xl text-main-text">
          Telegram Calls
        </h3>
        <div className="text-right">
          <div className="font-display text-sm xl:text-base text-main-accent">
            {telegramData.count} channels
          </div>
          <div className="font-display text-xs xl:text-sm text-main-light-text/60">
            {telegramData.totalMembers} total reach
          </div>
        </div>
      </div>
      <div className="space-y-3 xl:space-y-4">
        {telegramData.top.map((ch: TelegramChannel) => (
          <div
            key={ch.name}
            className="bg-surface hover:bg-main-accent/5 border border-subtle rounded-lg p-3 xl:p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Icon
                  icon="ic:baseline-telegram"
                  className="w-6 h-6 xl:w-7 xl:h-7 text-blue-400"
                />
                <div>
                  <div className="font-display text-main-light-text font-medium xl:text-base">
                    {ch.name}
                  </div>
                  <div className="font-display text-xs xl:text-sm text-main-light-text/60">
                    {ch.mentions} mentions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-main-text xl:text-lg">
                  {ch.members}
                </div>
                <div
                  className={`font-display text-xs xl:text-sm px-2 py-1 rounded-full ${
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

      {/* See More Button */}
      <div className="mt-4 xl:mt-6 pt-4 xl:pt-6 border-t border-subtle">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-3 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 hover:border-main-accent/50 rounded-lg text-main-accent hover:text-main-highlight font-display text-sm xl:text-base transition-all duration-200 w-full justify-center"
        >
          <Icon icon="ic:baseline-telegram" className="w-4 h-4 xl:w-5 xl:h-5" />
          See All Channels
        </button>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Telegram Analysis"
      >
        <div className="space-y-3">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-surface rounded border border-subtle">
              <div className="font-mono text-lg text-blue-400 mb-1">
                {telegramData.count}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Channels
              </div>
            </div>
            <div className="text-center p-3 bg-surface rounded border border-subtle">
              <div className="font-mono text-lg text-main-accent mb-1">
                {telegramData.totalMembers}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Reach
              </div>
            </div>
            <div className="text-center p-3 bg-surface rounded border border-subtle">
              <div className="font-mono text-lg text-green-400 mb-1">
                {telegramData.top.reduce((sum, ch) => sum + ch.mentions, 0)}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Mentions
              </div>
            </div>
          </div>

          {/* Top Channels */}
          <div className="bg-surface p-3 rounded border border-subtle">
            <div className="font-display text-xs text-main-light-text/60 mb-2">
              Top Channels
            </div>
            <div className="space-y-2">
              {telegramData.top.slice(0, 4).map((channel) => (
                <div
                  key={channel.name}
                  className="flex items-center justify-between p-2 bg-surface rounded border border-subtle"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="ic:baseline-telegram"
                      className="w-4 h-4 text-blue-400"
                    />
                    <div>
                      <div className="font-display text-sm text-main-text">
                        {channel.name}
                      </div>
                      <div className="font-display text-xs text-main-light-text/60">
                        {channel.mentions} mentions
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div className="font-mono text-sm text-main-text">
                      {channel.members}
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs ${
                        channel.sentiment === "Bullish"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : channel.sentiment === "Bearish"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {channel.sentiment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DetailModal>
    </motion.div>
  );
};

export default TelegramCalls;
