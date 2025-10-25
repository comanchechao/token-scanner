import React from "react";
import { Icon } from "@iconify/react";

interface MobileBottomNavProps {
  activeTab: "info" | "chart+txns" | "chart" | "txns";
  onTabChange: (tab: "info" | "chart+txns" | "chart" | "txns") => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems = [
    {
      id: "info" as const,
      label: "Info",
      icon: "material-symbols:info",
    },
    {
      id: "chart+txns" as const,
      label: "Chart+Txns",
      icon: "lets-icons:chart-fill",
    },
    {
      id: "chart" as const,
      label: "Chart",
      icon: "lets-icons:chart-fill",
    },
    {
      id: "txns" as const,
      label: "Txns",
      icon: "material-symbols:list",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-subtle z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center  py-1 w-full transition-all duration-200 ${
              activeTab === item.id
                ? "bg-main-accent text-white"
                : "bg-transparent text-main-light-text hover:text-main-accent hover:bg-main-accent/5"
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 mb-1">
              <Icon
                icon={item.icon}
                className={`w-5 h-5 ${
                  activeTab === item.id ? "text-white" : "text-main-light-text"
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                activeTab === item.id ? "text-white" : "text-main-light-text"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
