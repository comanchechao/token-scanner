import React, { useState } from "react";
import { Icon } from "@iconify/react";

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
}

const DeveloperEcosystem: React.FC<DeveloperEcosystemProps> = ({
  devTokens,
}) => {
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
          <h2 className="text-sm font-medium text-white">
            Developer Ecosystem
          </h2>
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
          <div className="text-sm text-white">{devTokens.length} tokens</div>
          <div className="text-xs text-white/50">Related projects</div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {devTokens.slice(0, 3).map((t: DevToken) => (
            <a
              key={t.address + t.name}
              href={t.link}
              target="_blank"
              rel="noreferrer"
              className="group bg-white/5 rounded-sm p-3 transition-all duration-200 block hover:bg-white/10"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex-shrink-0">
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
                        className="w-4 h-4 text-main-accent"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {t.name}
                  </div>
                  <div className="text-xs text-white/50 mb-1">{t.symbol}</div>
                  <div className="text-xs text-white/40 truncate">
                    {t.address.slice(0, 6)}...{t.address.slice(-4)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <div className="text-xs text-white/50">Market Cap</div>
                  <div className="text-sm text-white">{t.marketCap}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50">Performance</div>
                  <div
                    className={`text-sm ${
                      t.performance.startsWith("+")
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {t.performance}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperEcosystem;
