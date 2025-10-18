import React from "react";
import { Icon } from "@iconify/react";

interface LeaderboardHeaderProps {
  selectedFilter: string;
  onTimeFilterChange: (filter: string) => void;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  selectedFilter,
  onTimeFilterChange,
}) => {
  const timeFilters = [
    { key: "all", label: "All Time", icon: "material-symbols:history" },
    { key: "1h", label: "1 Hour", icon: "material-symbols:schedule" },
    { key: "24h", label: "24 Hours", icon: "material-symbols:today" },
    { key: "7d", label: "7 Days", icon: "material-symbols:date-range" },
    { key: "30d", label: "30 Days", icon: "material-symbols:calendar-month" },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col mt-20 lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="font-algance text-4xl md:text-5xl text-main-text mb-2">
            KOL <span className="text-main-accent">Leaderboard</span>
          </h1>
          <p className="font-tiktok text-lg text-main-light-text">
            Top performing influencers ranked by trading success
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onTimeFilterChange(filter.key)}
              className={`group relative   border rounded-xl px-4 py-2.5 hover:shadow-lg cursor-pointer ${
                selectedFilter === filter.key
                  ? "bg-main-accent/15 border-main-accent/50 text-main-accent shadow-main-accent/20"
                  : "bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={filter.icon}
                  className={`w-4 h-4 ${
                    selectedFilter === filter.key
                      ? "text-main-accent"
                      : "text-main-light-text/70 group-hover:text-main-accent"
                  }`}
                />
                <span className="font-tiktok text-sm">{filter.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
