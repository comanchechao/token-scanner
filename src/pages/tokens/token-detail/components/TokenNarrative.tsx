import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface TokenNarrativeProps {
  narrative: string;
}

const TokenNarrative: React.FC<TokenNarrativeProps> = ({ narrative }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13] border-x border-t border-subtle text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white">Token Narrative</h2>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 border-b border-subtle">
          <p className="text-sm text-white/80 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default TokenNarrative;
