import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface SecurityItem {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

interface SecurityAnalysisProps {
  securityData: SecurityItem[];
  custom?: number;
  variants?: any;
  sectionRef?: (el: HTMLElement | null) => void;
}

const SecurityAnalysis: React.FC<SecurityAnalysisProps> = ({
  securityData,
  custom = 3,
  variants,
  sectionRef,
}) => {
  const passedChecks = securityData.filter(
    (item) => item.status === "pass"
  ).length;

  return (
    <motion.div
      id="security"
      ref={sectionRef}
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-[#161616] border border-white/[0.08] hover:border-main-accent/20 hover:bg-white/[0.02] rounded-sm p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/5"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-mono text-xl text-main-text">Security Analysis</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <span className="font-display text-sm text-main-light-text/70">
            {passedChecks}/{securityData.length} checks passed
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityData.map((item: SecurityItem) => {
          const color =
            item.status === "pass"
              ? "text-emerald-400"
              : item.status === "warn"
              ? "text-amber-400"
              : "text-red-400";
          const bgColor =
            item.status === "pass"
              ? "bg-emerald-500/10 border-emerald-500/20"
              : item.status === "warn"
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-red-500/10 border-red-500/20";
          const icon =
            item.status === "pass"
              ? "solar:check-circle-bold"
              : item.status === "warn"
              ? "solar:warning-circle-bold"
              : "solar:close-circle-bold";
          return (
            <div
              key={item.label}
              className={`bg-[#0a0a0a] border rounded-lg p-4 hover:border-opacity-40 transition-colors ${bgColor}`}
            >
              <div className="flex items-start gap-3">
                <Icon icon={icon} className={`w-5 h-5 ${color} mt-0.5`} />
                <div className="flex-1">
                  <div className="font-display text-main-light-text font-medium mb-1">
                    {item.label}
                  </div>
                  <div className="font-display text-xs text-main-light-text/60">
                    {item.detail}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SecurityAnalysis;
