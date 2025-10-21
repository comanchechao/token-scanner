import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import DetailModal from "./DetailModal";

interface TokenData {
  name: string;
  symbol: string;
  address: string;
  price: string;
  marketCap: string;
  volume24h: string;
  holders: string;
  narrative: string;
}

interface TokenOverviewProps {
  token: TokenData;
  custom?: number;
  variants?: any;
  sectionRef?: (el: HTMLElement | null) => void;
}

const TokenOverview: React.FC<TokenOverviewProps> = ({
  token,
  custom = 0,
  variants,
  sectionRef,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <motion.div
      id="overview"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="group bg-surface border border-subtle hover:border-main-accent/20 hover:bg-main-accent/5 rounded-sm p-6 md:p-8 xl:p-10 mb-8 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex flex-col lg:flex-row xl:gap-8 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 xl:mb-6">
            <h2 className="font-mono text-2xl xl:text-3xl text-main-text">
              {token.name}
            </h2>
            <span className="px-3 py-1 xl:px-4 xl:py-1.5 font-bold bg-main-accent/20 text-main-accent font-display text-sm xl:text-base rounded-full">
              ${token.symbol}
            </span>
          </div>
          <p className="font-display text-main-light-text/90 mb-4 xl:mb-6 leading-relaxed xl:text-lg">
            {token.narrative}
          </p>
          <div className="font-mono text-xs xl:text-sm text-main-light-text/60 bg-surface hover:bg-main-accent/5 p-3 xl:p-4 rounded-lg border border-subtle transition-all duration-200 mb-4 xl:mb-6">
            {token.address}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-3 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 hover:border-main-accent/50 rounded-lg text-main-accent hover:text-main-highlight font-display text-sm xl:text-base transition-all duration-200"
          >
            <Icon
              icon="material-symbols:info-outline"
              className="w-4 h-4 xl:w-5 xl:h-5"
            />
            See More Details
          </button>
        </div>
        <div className="lg:w-80 xl:w-96">
          <div className="grid grid-cols-2 gap-4 xl:gap-6">
            <div className="bg-surface hover:bg-main-accent/5 p-4 xl:p-5 rounded-lg border border-subtle transition-all duration-200">
              <div className="font-display text-xs xl:text-sm text-main-light-text/60 mb-1 xl:mb-2">
                Price
              </div>
              <div className="font-mono text-lg xl:text-xl text-main-text">
                {token.price}
              </div>
            </div>
            <div className="bg-surface hover:bg-main-accent/5 p-4 xl:p-5 rounded-lg border border-subtle transition-all duration-200">
              <div className="font-display text-xs xl:text-sm text-main-light-text/60 mb-1 xl:mb-2">
                Market Cap
              </div>
              <div className="font-mono text-lg xl:text-xl text-main-text">
                {token.marketCap}
              </div>
            </div>
            <div className="bg-surface hover:bg-main-accent/5 p-4 xl:p-5 rounded-lg border border-subtle transition-all duration-200">
              <div className="font-display text-xs xl:text-sm text-main-light-text/60 mb-1 xl:mb-2">
                24h Volume
              </div>
              <div className="font-mono text-lg xl:text-xl text-main-text">
                {token.volume24h}
              </div>
            </div>
            <div className="bg-surface hover:bg-main-accent/5 p-4 xl:p-5 rounded-lg border border-subtle transition-all duration-200">
              <div className="font-display text-xs xl:text-sm text-main-light-text/60 mb-1 xl:mb-2">
                Holders
              </div>
              <div className="font-mono text-lg xl:text-xl text-main-text">
                {token.holders}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${token.name} Details`}
      >
        <div className="space-y-3">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface p-3 rounded border border-subtle">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                Price
              </div>
              <div className="font-mono text-main-accent font-medium">
                {token.price}
              </div>
            </div>
            <div className="bg-surface p-3 rounded border border-subtle">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                Market Cap
              </div>
              <div className="font-mono text-main-text font-medium">
                {token.marketCap}
              </div>
            </div>
            <div className="bg-surface p-3 rounded border border-subtle">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                24h Volume
              </div>
              <div className="font-mono text-main-text font-medium">
                {token.volume24h}
              </div>
            </div>
            <div className="bg-surface p-3 rounded border border-subtle">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                Holders
              </div>
              <div className="font-mono text-main-text font-medium">
                {token.holders}
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="bg-surface p-3 rounded border border-subtle">
            <div className="font-display text-xs text-main-light-text/60 mb-2">
              Contract Address
            </div>
            <div className="font-mono text-xs text-main-light-text/80 break-all bg-surface p-2 rounded">
              {token.address}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#0a0a0a] p-3 rounded border border-white/[0.05]">
            <div className="font-display text-xs text-main-light-text/60 mb-2">
              Description
            </div>
            <p className="font-display text-sm text-main-light-text/90 leading-relaxed">
              {token.narrative}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 rounded text-main-accent font-display text-xs transition-colors">
              <Icon icon="material-symbols:content-copy" className="w-3 h-3" />
              Copy
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 font-display text-xs transition-colors">
              <Icon icon="material-symbols:open-in-new" className="w-3 h-3" />
              Explorer
            </button>
          </div>
        </div>
      </DetailModal>
    </motion.div>
  );
};

export default TokenOverview;
