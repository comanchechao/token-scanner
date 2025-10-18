import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface DevToken {
  avatar?: string;
  name: string;
  symbol: string;
  address: string;
  link: string;
  marketCap: string;
  performance: string;
}

interface DeveloperEcosystemProps {
  devTokens: DevToken[];
  custom?: number;
  variants?: any;
  sectionRef?: (el: HTMLElement | null) => void;
}

const DeveloperEcosystem: React.FC<DeveloperEcosystemProps> = ({
  devTokens,
  custom = 4,
  variants,
  sectionRef,
}) => {
  return (
    <motion.div
      id="devtokens"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-[#161616] border border-white/[0.1] hover:border-main-accent/30 rounded-sm p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-mono text-xl text-main-text">
          Developer Ecosystem
        </h3>
        <div className="text-right">
          <div className="font-display text-sm text-main-accent">
            {devTokens.length} tokens
          </div>
          <div className="font-display text-xs text-main-light-text/60">
            Related projects
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devTokens.map((t: DevToken) => (
          <a
            key={t.address + t.name}
            href={t.link}
            target="_blank"
            rel="noreferrer"
            className="group bg-[#0a0a0a] hover:bg-white/[0.05] border border-white/[0.08] hover:border-main-accent/30 rounded-lg p-4 transition-all duration-200"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex-shrink-0">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="material-symbols:token"
                      className="w-5 h-5 text-main-accent"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-main-text font-medium mb-1 truncate">
                  {t.name}
                </div>
                <div className="font-mono text-xs text-main-light-text/60 mb-2">
                  {t.symbol}
                </div>
                <div className="font-mono text-xs text-main-light-text/40 truncate">
                  {t.address.slice(0, 6)}...{t.address.slice(-4)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <div>
                <div className="font-display text-xs text-main-light-text/60">
                  Market Cap
                </div>
                <div className="font-mono text-sm text-main-text">
                  {t.marketCap}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-xs text-main-light-text/60">
                  Performance
                </div>
                <div
                  className={`font-mono text-sm ${
                    t.performance.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {t.performance}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="font-display text-xs text-main-accent group-hover:text-main-highlight transition-colors">
                View on DEX →
              </div>
              <Icon
                icon="solar:external-link-outline"
                className="w-4 h-4 text-main-light-text/40 group-hover:text-main-accent transition-colors"
              />
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default DeveloperEcosystem;
