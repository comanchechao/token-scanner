import React from "react";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      id="overview"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="group bg-[#161616] border border-white/[0.08] hover:border-main-accent/20 hover:bg-white/[0.02] rounded-sm p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-2xl text-main-text">{token.name}</h2>
            <span className="px-3 py-1 font-bold bg-main-accent/20 text-main-accent font-display text-sm rounded-full">
              ${token.symbol}
            </span>
          </div>
          <p className="font-display text-main-light-text/90 mb-4 leading-relaxed">
            {token.narrative}
          </p>
          <div className="font-mono text-xs text-main-light-text/60 bg-[#0a0a0a] hover:bg-white/[0.02] p-3 rounded-lg border border-white/[0.05] hover:border-white/[0.1] transition-all duration-200">
            {token.address}
          </div>
        </div>
        <div className="lg:w-80">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] hover:bg-white/[0.02] p-4 rounded-lg border border-white/[0.05] hover:border-white/[0.1] transition-all duration-200">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                Price
              </div>
              <div className="font-mono text-lg text-main-text">
                {token.price}
              </div>
            </div>
            <div className="bg-[#0a0a0a] hover:bg-white/[0.02] p-4 rounded-lg border border-white/[0.05] hover:border-white/[0.1] transition-all duration-200">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                Market Cap
              </div>
              <div className="font-mono text-lg text-main-text">
                {token.marketCap}
              </div>
            </div>
            <div className="bg-[#0a0a0a] hover:bg-white/[0.02] p-4 rounded-lg border border-white/[0.05] hover:border-white/[0.1] transition-all duration-200">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                24h Volume
              </div>
              <div className="font-mono text-lg text-main-text">
                {token.volume24h}
              </div>
            </div>
            <div className="bg-[#0a0a0a] hover:bg-white/[0.02] p-4 rounded-lg border border-white/[0.05] hover:border-white/[0.1] transition-all duration-200">
              <div className="font-display text-xs text-main-light-text/60 mb-1">
                Holders
              </div>
              <div className="font-mono text-lg text-main-text">
                {token.holders}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenOverview;
