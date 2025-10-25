"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface BondingCurveData {
  progress: number;
  migrationThreshold: string;
}

export default function BondingCurveCard() {
  const [data, setData] = useState<BondingCurveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchBondingCurveData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: BondingCurveData = {
        progress: 0,
        migrationThreshold: "$1M",
      };

      setData(mockData);
      setLoading(false);
    };

    fetchBondingCurveData();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-fit bg-[#0e0f13]      border-border text-white">
        <div className="animate-pulse p-4">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-2 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13]   border-x  border-border text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-border cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white">Bonding Curve</h2>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
        <Icon
          icon="lucide:refresh-cw"
          width={16}
          height={16}
          className="text-white/50 cursor-pointer hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Add refresh functionality here if needed
          }}
        />
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Progress Section */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-blue-400">
              {data?.progress}%
            </div>
            <div className="text-xs text-white/50 mt-1">Progress</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-sm h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-sm transition-all duration-300"
              style={{ width: `${data?.progress}%` }}
            ></div>
          </div>

          {/* Migration Threshold */}
          <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
            <Icon
              icon="lucide:trending-up"
              width={16}
              height={16}
              className="text-white/50"
            />
            <div className="flex flex-col">
              <div className="text-xs text-white/50">Migration Threshold</div>
              <div className="text-sm font-medium text-white">
                {data?.migrationThreshold}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
