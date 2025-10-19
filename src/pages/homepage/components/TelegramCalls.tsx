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
      className="bg-surface border border-subtle hover:border-main-accent/20 hover:bg-main-accent/5 rounded-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
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
            className="bg-surface hover:bg-main-accent/5 border border-subtle rounded-lg p-3 transition-all duration-200"
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

      {/* See More Button */}
      <div className="mt-4 pt-4 border-t border-subtle">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 hover:border-main-accent/50 rounded-lg text-main-accent hover:text-main-highlight font-display text-sm transition-all duration-200 w-full justify-center"
        >
          <Icon icon="ic:baseline-telegram" className="w-4 h-4" />
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
