import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import DetailModal from "./DetailModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      {/* See More Button */}
      <div className="mt-6 pt-4 border-t border-white/[0.05]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 hover:border-main-accent/50 rounded-lg text-main-accent hover:text-main-highlight font-display text-sm transition-all duration-200 w-full justify-center"
        >
          <Icon icon="material-symbols:token" className="w-4 h-4" />
          Explore All Dev Tokens
        </button>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Developer Ecosystem"
      >
        <div className="space-y-3">
          {/* Ecosystem Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-[#0a0a0a] rounded border border-white/[0.05]">
              <div className="font-mono text-lg text-main-accent mb-1">
                {devTokens.length}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Projects
              </div>
            </div>
            <div className="text-center p-3 bg-[#0a0a0a] rounded border border-white/[0.05]">
              <div className="font-mono text-lg text-green-400 mb-1">
                {devTokens.filter((t) => t.performance.startsWith("+")).length}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Positive
              </div>
            </div>
            <div className="text-center p-3 bg-[#0a0a0a] rounded border border-white/[0.05]">
              <div className="font-mono text-lg text-blue-400 mb-1">
                $
                {devTokens
                  .reduce(
                    (sum, t) =>
                      sum +
                      parseFloat(
                        t.marketCap
                          .replace("$", "")
                          .replace("M", "")
                          .replace("K", "")
                      ),
                    0
                  )
                  .toFixed(1)}
                M
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Market Cap
              </div>
            </div>
          </div>

          {/* Top Developer Tokens */}
          <div className="bg-[#0a0a0a] p-3 rounded border border-white/[0.05]">
            <div className="font-display text-xs text-main-light-text/60 mb-2">
              Top Developer Tokens
            </div>
            <div className="space-y-2">
              {devTokens.slice(0, 4).map((token, index) => (
                <div
                  key={token.address + token.name}
                  className="flex items-center justify-between p-2 bg-[#161616] rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
                      {token.avatar ? (
                        <img
                          src={token.avatar}
                          alt={token.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon
                            icon="material-symbols:token"
                            className="w-3 h-3 text-main-accent"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-display text-sm text-main-text">
                        {token.name}
                      </div>
                      <div className="font-display text-xs text-main-light-text/60">
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-main-text">
                      {token.marketCap}
                    </div>
                    <div
                      className={`font-mono text-xs ${
                        token.performance.startsWith("+")
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {token.performance}
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

export default DeveloperEcosystem;
