import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import DetailModal from "./DetailModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      {/* See More Button */}
      <div className="mt-6 pt-4 border-t border-white/[0.05]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 hover:border-main-accent/50 rounded-lg text-main-accent hover:text-main-highlight font-display text-sm transition-all duration-200 w-full justify-center"
        >
          <Icon icon="material-symbols:security" className="w-4 h-4" />
          View Full Security Report
        </button>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Security Report"
      >
        <div className="space-y-3">
          {/* Security Score */}
          <div className="text-center bg-[#0a0a0a] p-4 rounded border border-white/[0.05]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-2">
              <span className="font-mono text-lg text-emerald-400">
                {Math.round((passedChecks / securityData.length) * 100)}%
              </span>
            </div>
            <div className="font-display text-sm text-main-text">
              Security Score
            </div>
            <div className="font-display text-xs text-main-light-text/60">
              {passedChecks}/{securityData.length} checks passed
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-emerald-500/10 rounded border border-emerald-500/20">
              <div className="font-mono text-lg text-emerald-400 mb-1">
                {securityData.filter((item) => item.status === "pass").length}
              </div>
              <div className="font-display text-xs text-emerald-400">
                Passed
              </div>
            </div>
            <div className="text-center p-3 bg-amber-500/10 rounded border border-amber-500/20">
              <div className="font-mono text-lg text-amber-400 mb-1">
                {securityData.filter((item) => item.status === "warn").length}
              </div>
              <div className="font-display text-xs text-amber-400">
                Warnings
              </div>
            </div>
            <div className="text-center p-3 bg-red-500/10 rounded border border-red-500/20">
              <div className="font-mono text-lg text-red-400 mb-1">
                {securityData.filter((item) => item.status === "fail").length}
              </div>
              <div className="font-display text-xs text-red-400">Failed</div>
            </div>
          </div>

          {/* Security Checks */}
          <div className="bg-[#0a0a0a] p-3 rounded border border-white/[0.05]">
            <div className="font-display text-xs text-main-light-text/60 mb-2">
              Security Checks
            </div>
            <div className="space-y-2">
              {securityData.slice(0, 4).map((item) => {
                const color =
                  item.status === "pass"
                    ? "text-emerald-400"
                    : item.status === "warn"
                    ? "text-amber-400"
                    : "text-red-400";
                const icon =
                  item.status === "pass"
                    ? "solar:check-circle-bold"
                    : item.status === "warn"
                    ? "solar:warning-circle-bold"
                    : "solar:close-circle-bold";
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-2 bg-[#161616] rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={icon} className={`w-4 h-4 ${color}`} />
                      <div className="font-display text-sm text-main-text">
                        {item.label}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-display ${color} bg-current/10`}
                    >
                      {item.status.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DetailModal>
    </motion.div>
  );
};

export default SecurityAnalysis;
