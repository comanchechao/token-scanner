import React from "react";
import { Icon } from "@iconify/react";

interface FeedToggleProps {
  activeView: "activity" | "leaderboard";
  onToggle: (view: "activity" | "leaderboard") => void;
}

const FeedToggle: React.FC<FeedToggleProps> = ({ activeView, onToggle }) => {
  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center bg-surface border border-subtle rounded-lg p-1">
        <button
          onClick={() => onToggle("activity")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-display transition-all duration-200 ${
            activeView === "activity"
              ? "bg-main-accent text-main-bg"
              : "text-main-light-text hover:text-main-accent hover:bg-main-accent/10"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              activeView === "activity"
                ? "bg-main-bg animate-pulse"
                : "bg-green-500 animate-pulse"
            }`}
          ></div>
          <span>Live Activity</span>
        </button>

        <button
          onClick={() => onToggle("leaderboard")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-display transition-all duration-200 ${
            activeView === "leaderboard"
              ? "bg-main-accent text-main-bg"
              : "text-main-light-text hover:text-main-accent hover:bg-main-accent/10"
          }`}
        >
          <Icon icon="material-symbols:leaderboard" className="w-4 h-4" />
          <span>Leaderboard</span>
        </button>
      </div>
    </div>
  );
};

export default FeedToggle;
