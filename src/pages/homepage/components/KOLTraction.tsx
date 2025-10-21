import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import DetailModal from "./DetailModal";

interface KolBuyer {
  name: string;
  avatar?: string;
  amount: string;
  invested: string;
  followers: string;
}

interface KOLData {
  count: number;
  totalInvested: string;
  top: KolBuyer[];
}

interface KOLTractionProps {
  kolData: KOLData;
  custom?: number;
  variants?: any;
  sectionRef?: (el: HTMLElement | null) => void;
}

const KOLTraction: React.FC<KOLTractionProps> = ({
  kolData,
  custom = 1,
  variants,
  sectionRef,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <motion.div
      id="kols"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-subtle hover:border-main-accent/20 hover:bg-main-accent/5 rounded-sm p-6 xl:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex items-center justify-between mb-4 xl:mb-6">
        <h3 className="font-mono text-xl xl:text-2xl text-main-text">
          KOL Traction
        </h3>
        <div className="text-right">
          <div className="font-display text-sm xl:text-base text-main-accent">
            {kolData.count} KOLs
          </div>
          <div className="font-display text-xs xl:text-sm text-main-light-text/60">
            {kolData.totalInvested} invested
          </div>
        </div>
      </div>
      <div className="space-y-3 xl:space-y-4">
        {kolData.top.map((kol: KolBuyer) => (
          <div
            key={kol.name}
            className="bg-surface hover:bg-main-accent/5 border border-subtle rounded-lg p-3 xl:p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
                  {kol.avatar ? (
                    <img
                      src={kol.avatar}
                      alt={kol.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon
                        icon="material-symbols:person"
                        className="w-4 h-4 xl:w-5 xl:h-5 text-main-accent"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-display text-main-light-text font-medium xl:text-base">
                    {kol.name}
                  </div>
                  <div className="font-display text-xs xl:text-sm text-main-light-text/60">
                    {kol.followers} followers
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-main-text xl:text-lg">
                  {kol.amount}
                </div>
                <div className="font-display text-xs xl:text-sm text-main-accent">
                  {kol.invested}
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
          <Icon
            icon="material-symbols:group"
            className="w-4 h-4 xl:w-5 xl:h-5"
          />
          See All KOLs
        </button>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="KOL Analysis"
      >
        <div className="space-y-3">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-surface rounded border border-subtle">
              <div className="font-mono text-lg text-main-accent mb-1">
                {kolData.count}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                KOLs
              </div>
            </div>
            <div className="text-center p-3 bg-surface rounded border border-subtle">
              <div className="font-mono text-lg text-green-400 mb-1">
                {kolData.totalInvested}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Invested
              </div>
            </div>
            <div className="text-center p-3 bg-surface rounded border border-subtle">
              <div className="font-mono text-lg text-blue-400 mb-1">
                {kolData.top
                  .reduce(
                    (sum, kol) =>
                      sum +
                      parseInt(
                        kol.followers.replace("K", "000").replace("M", "000000")
                      ),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="font-display text-xs text-main-light-text/60">
                Reach
              </div>
            </div>
          </div>

          {/* Top KOLs */}
          <div className="bg-surface p-3 rounded border border-subtle">
            <div className="font-display text-xs text-main-light-text/60 mb-2">
              Top KOL Investors
            </div>
            <div className="space-y-2">
              {kolData.top.slice(0, 4).map((kol) => (
                <div
                  key={kol.name}
                  className="flex items-center justify-between p-2 bg-surface rounded border border-subtle"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
                      {kol.avatar ? (
                        <img
                          src={kol.avatar}
                          alt={kol.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon
                            icon="material-symbols:person"
                            className="w-3 h-3 text-main-accent"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-display text-sm text-main-text">
                        {kol.name}
                      </div>
                      <div className="font-display text-xs text-main-light-text/60">
                        {kol.followers}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-main-accent">
                      {kol.amount}
                    </div>
                    <div className="font-display text-xs text-main-light-text/60">
                      {kol.invested}
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

export default KOLTraction;
