import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface SecurityItem {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

interface SecurityAnalysisProps {
  securityData: SecurityItem[];
}

const SecurityAnalysis: React.FC<SecurityAnalysisProps> = ({
  securityData,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const passedChecks = securityData.filter(
    (item) => item.status === "pass"
  ).length;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13] border-x border-subtle text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white">Security Analysis</h2>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <span className="text-sm text-white">
            {passedChecks}/{securityData.length} passed
          </span>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {securityData.slice(0, 4).map((item: SecurityItem) => {
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
                className={`bg-white/5 rounded-sm p-3 flex items-start gap-3 ${bgColor}`}
              >
                <Icon icon={icon} className={`w-5 h-5 ${color} mt-0.5`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/50">{item.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SecurityAnalysis;
