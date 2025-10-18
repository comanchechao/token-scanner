import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      id="kols"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-[#161616] border border-white/[0.08] hover:border-main-accent/20 hover:bg-white/[0.02] rounded-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xl text-main-text">KOL Traction</h3>
        <div className="text-right">
          <div className="font-display text-sm text-main-accent">
            {kolData.count} KOLs
          </div>
          <div className="font-display text-xs text-main-light-text/60">
            {kolData.totalInvested} invested
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {kolData.top.map((kol: KolBuyer) => (
          <div
            key={kol.name}
            className="bg-[#0a0a0a] hover:bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] rounded-lg p-3 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
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
                        className="w-4 h-4 text-main-accent"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-display text-main-light-text font-medium">
                    {kol.name}
                  </div>
                  <div className="font-display text-xs text-main-light-text/60">
                    {kol.followers} followers
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-main-text">{kol.amount}</div>
                <div className="font-display text-xs text-main-accent">
                  {kol.invested}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default KOLTraction;
