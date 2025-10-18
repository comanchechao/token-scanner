import React, { useMemo } from "react";
import { LeaderboardKOL } from "../../../types/api";
import LeaderboardRow from "./LeaderboardRow";
import Pagination from "./Pagination";

interface LeaderboardListProps {
  data: LeaderboardKOL[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const LeaderboardList: React.FC<LeaderboardListProps> = React.memo(
  ({ data, loading, currentPage, totalPages, onPageChange }) => {
    const sortedData = useMemo(() => {
      return data.map((kol, index) => ({
        ...kol,
        actualRank: (currentPage - 1) * 20 + index + 1,
      }));
    }, [data, currentPage]);

    return (
      <div>
        <div className="space-y-2">
          {sortedData.map((kol) => (
            <LeaderboardRow
              key={kol.walletAddress}
              kol={kol}
              rank={kol.actualRank}
              isTopRank={kol.actualRank === 1}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
        />

        {loading && (
          <div className="text-center py-4">
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 bg-main-accent rounded-full animate-pulse"></div>
              <span className="font-tiktok text-sm text-main-light-text/60">
                Loading...
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

LeaderboardList.displayName = "LeaderboardList";

export default LeaderboardList;
