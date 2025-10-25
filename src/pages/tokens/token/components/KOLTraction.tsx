import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface KolBuyer {
  name: string;
  avatar?: string;
  amount: string;
  invested: string;
  followers: string;
}

interface KOLTractionProps {
  kolData: {
    count: number;
    totalInvested: string;
    top: KolBuyer[];
  };
}

const KOLTraction: React.FC<KOLTractionProps> = ({ kolData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          <h2 className="text-sm font-medium text-white">KOL Traction</h2>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="text-right">
          <div className="text-sm text-white">{kolData.count} KOLs</div>
          <div className="text-xs text-white/50">
            {kolData.totalInvested} invested
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {kolData.top.slice(0, 3).map((kol: KolBuyer) => (
            <div
              key={kol.name}
              className="bg-white/5 rounded-sm p-3 flex items-center justify-between"
            >
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
                  <div className="text-sm font-medium text-white">
                    {kol.name}
                  </div>
                  <div className="text-xs text-white/50">
                    {kol.followers} followers
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {kol.amount}
                </div>
                <div className="text-xs text-green-400">{kol.invested}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KOLTraction;
