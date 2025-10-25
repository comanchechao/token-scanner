"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface SecurityData {
  dexPaid: boolean;
  mintAuthority: "Enabled" | "Disabled";
  freezeAuthority: "Enabled" | "Disabled";
  tax: string;
  lpBurned: string;
  ath: string;
  pooledGALX: { amount: string; value: string };
  pooledUSDC: { amount: string; value: string };
  virtualPooledUSDC: { amount: string; value: string };
  top10Hold: string;
  globalFees: string;
  caDeployer: string;
  lpCreator: string;
  issuesCount: number;
  openTrading: any;
  platform: any;
}

interface TooltipInfo {
  [key: string]: string;
}

const tooltipData: TooltipInfo = {
  "Dex Paid": "Dexscreener paid indicator and banner preview if available",
  "Mint Authority": "Ability to mint new tokens",
  "Freeze Authority": "Ability to freeze token accounts",
  Tax: "Tax charged by contract dev for all buy/sell/transfer transactions",
  "LP Burned":
    "% of LP that is burned. Highlighted in red if LP burned is below 50%",
  ATH: "All Time High",
  "Pooled GALX": "Amount of base tokens in pool",
  "Pooled USDC": "Amount of quote tokens in pool",
  "Virtual Pooled USDC": "Amount of virtual quote tokens in pool",
  "Top 10 Hold":
    "% owned by top 10 holders. Highlighted in red if ownership is above 15%",
  "Global Fees":
    "Fees includes platform fee + priority + bribery (if charged in the same tx) for this token",
  "CA Deployer": "Address of the deployer",
  "LP Creator": "Address of the liquidity provider",
  "Open Trading": "Time when trading is opened",
  Platform: "DBC Platform.",
};

export default function DataSecurityCard() {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockData: SecurityData = {
        dexPaid: false,
        mintAuthority: "Disabled",
        freezeAuthority: "Disabled",
        tax: "0.5%",
        lpBurned: "100%",
        ath: "$5.04K",
        pooledGALX: { amount: "995M", value: "$5.02K" },
        pooledUSDC: { amount: "0.12SOL", value: "$27.0" },
        virtualPooledUSDC: { amount: "24.14SOL", value: "$5.03K" },
        top10Hold: "0.54%",
        globalFees: "0.001",
        caDeployer: "7rt..y1q",
        lpCreator: "7rt..",
        issuesCount: 1,
        platform: "Moonshot",
        openTrading: "-",
      };

      setData(mockData);
      setLoading(false);
    };

    fetchSecurityData();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-fit bg-[#0e0f13] border-b   border-subtle text-white">
        <div className="animate-pulse p-4">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex justify-between items-center mb-4">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const DataRow = ({
    label,
    value,
    valueColor = "text-white",
    hasIcon = false,
  }: {
    label: string;
    value: string;
    valueColor?: string;
    hasIcon?: boolean;
  }) => (
    <div className="flex justify-between items-center py-3 border-b border-subtle last:border-b-0 transition-opacity duration-200 ease-in-out">
      <div className="flex items-center gap-2 relative">
        <div
          className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center cursor-help"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
            setActiveTooltip(label);
          }}
          onMouseLeave={() => {
            setActiveTooltip(null);
            setTooltipPos(null);
          }}
        >
          <span className="text-xs text-white/50">i</span>
          <Tooltip
            text={tooltipData[label] || "No information available"}
            label={label}
            pos={tooltipPos}
          />
        </div>
        <span className="text-white/50 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${valueColor}`}>{value}</span>
        {hasIcon && (
          <Icon
            icon="lucide:external-link"
            width={14}
            height={14}
            className="text-white/50 cursor-pointer hover:text-white transition-colors"
          />
        )}
      </div>
    </div>
  );

  const Tooltip = ({
    text,
    label,
    pos,
  }: {
    text: string;
    label: string;
    pos: { x: number; y: number } | null;
  }) => {
    if (!pos) return null;

    return (
      <div
        className={`
          fixed px-3 py-2 bg-gray-900 text-white text-xs rounded-sm shadow-lg z-50
          whitespace-nowrap transition-opacity duration-200
        `}
        style={{
          top: pos.y - 8,
          left: pos.x,
          transform: "translate(-50%, -100%)",
          opacity: activeTooltip === label ? 1 : 0,
          pointerEvents: activeTooltip === label ? "auto" : "none",
        }}
      >
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13] border-x border-subtle text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white">Data & Security</h2>
          {data && data.issuesCount > 0 && (
            <div className="flex items-center gap-1 text-pink-400">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-xs">{data.issuesCount} Issues</span>
            </div>
          )}
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
      {!isCollapsed && data && (
        <div className="p-4 space-y-1">
          <DataRow
            label="Dex Paid"
            value={data.dexPaid ? "Yes" : "No"}
            valueColor={data.dexPaid ? "text-green-400" : "text-white"}
          />
          <DataRow
            label="Mint Authority"
            value={data.mintAuthority}
            valueColor={
              data.mintAuthority === "Disabled"
                ? "text-cyan-400"
                : "text-red-400"
            }
          />
          <DataRow
            label="Freeze Authority"
            value={data.freezeAuthority}
            valueColor={
              data.freezeAuthority === "Disabled"
                ? "text-cyan-400"
                : "text-red-400"
            }
          />
          <DataRow label="Tax" value={data.tax} valueColor="text-pink-400" />
          <DataRow
            label="LP Burned"
            value={data.lpBurned}
            valueColor="text-cyan-400"
          />
          <DataRow label="ATH" value={data.ath} />
          <DataRow
            label="Pooled GALX"
            value={`${data.pooledGALX.amount} ${data.pooledGALX.value}`}
          />
          <DataRow
            label="Pooled USDC"
            value={`${data.pooledUSDC.amount} ${data.pooledUSDC.value}`}
          />
          <DataRow
            label="Virtual Pooled USDC"
            value={`${data.virtualPooledUSDC.amount} ${data.virtualPooledUSDC.value}`}
          />
          <DataRow
            label="Top 10 Hold"
            value={data.top10Hold}
            valueColor="text-cyan-400"
          />
          <DataRow label="Global Fees" value={data.globalFees} />
          <DataRow
            label="CA Deployer"
            value={data.caDeployer}
            valueColor="text-blue-400"
            hasIcon={true}
          />
          <DataRow
            label="LP Creator"
            value={data.lpCreator}
            valueColor="text-blue-400"
            hasIcon={true}
          />
          <DataRow
            label="Open Trading"
            value={data.openTrading}
            valueColor="text-white"
            hasIcon={true}
          />
          <DataRow
            label="Platform"
            value={data.platform}
            valueColor="text-white"
            hasIcon={true}
          />
        </div>
      )}
    </div>
  );
}
