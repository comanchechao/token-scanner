import React, { useState, useEffect, useCallback } from "react";
import LeaderboardHeader from "./components/LeaderboardHeader";
import LeaderboardList from "./components/LeaderboardList";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import BackButton from "../../components/BackButton";
import { KOLService } from "../../api/kolService";
import { LeaderboardKOL } from "../../types/api";
import Skeleton from "../../components/Skeleton";

const LeaderboardPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [kols, setKols] = useState<LeaderboardKOL[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchKOLs = useCallback(
    async (pageNumber: number = 1, timeFilter: string = selectedFilter) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: pageNumber,
          limit: 20,
          timeFilter: timeFilter === "all" ? undefined : timeFilter,
        };

        const response = await KOLService.getLeaderboard(params);

        if (response && response.data) {
          setKols(response.data);

          if (response.meta) {
            setTotalPages(response.meta.totalPages || 1);
          } else {
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error("Error fetching KOLs:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    },
    [selectedFilter]
  );

  const handleTimeFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
    setKols([]);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchKOLs(currentPage, selectedFilter);
  }, [selectedFilter, currentPage, fetchKOLs]);

  return (
    <div className="min-h-screen bg-main-bg pb-8 px-4">
      <Navbar />
      <div className="max-w-6xl mx-auto mb-20">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <LeaderboardHeader
          selectedFilter={selectedFilter}
          onTimeFilterChange={handleTimeFilterChange}
        />

        {loading && currentPage === 1 ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400 font-tiktok text-lg">{error}</p>
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchKOLs(1, selectedFilter);
              }}
              className="mt-4 px-4 py-2 bg-main-accent/20 hover:bg-main-accent/30 text-main-accent rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <LeaderboardList
            data={kols}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
