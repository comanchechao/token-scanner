import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Icon } from "@iconify/react";
import BonkTrendingCard from "./BonkTrendingCard";
import { KOLService } from "../../../api";
import { TrendingProject } from "../../../types/api";
import Skeleton from "../../../components/Skeleton";

interface BonkTrendingFeedProps {
  feedRef?: React.RefObject<HTMLDivElement>;
}

const BonkTrendingFeed: React.FC<BonkTrendingFeedProps> = React.memo(
  ({ feedRef }) => {
    const [trendingProjects, setTrendingProjects] = useState<TrendingProject[]>(
      []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState<
      "realtime" | "5minute" | "1hour"
    >("realtime");

    const itemsPerPage = 18;
    const totalPages = Math.ceil(trendingProjects.length / itemsPerPage);

    const localFeedRef = useRef<HTMLDivElement>(null);
    const prevProjectsRef = useRef<TrendingProject[]>([]);
    const newProjectIdsRef = useRef<Set<string>>(new Set());

    // Memoize the animation function
    const animateNewCards = useCallback((newProjectIds: string[]) => {
      newProjectIds.forEach((projectId) => {
        const newCardElement = document.getElementById(
          `trending-card-${projectId}`
        );
        if (newCardElement) {
          // Simple fade in animation with Tailwind
          setTimeout(() => {
            newCardElement.classList.remove("opacity-0", "translate-y-2");
            newCardElement.classList.add("opacity-100", "translate-y-0");
          }, 50);
        }
      });
    }, []);

    const fetchTrendingProjects = useCallback(
      async (
        isInitialLoad = false,
        timeframe?: "realtime" | "5minute" | "1hour"
      ) => {
        try {
          if (isInitialLoad) {
            setLoading(true);
          }
          setError(null);
          const response = await KOLService.getTrendingProjects({
            limit: 50,
            timeframe: timeframe || selectedTimeframe,
          });

          if (!response || !response.success || !response.data) {
            console.warn("Invalid trending projects data received:", response);
            setError("Invalid data received from server");
            if (isInitialLoad) {
              setTrendingProjects([]);
            }
            return;
          }

          const newProjects = response.data || [];
          setLastUpdated(new Date().toISOString());

          if (isInitialLoad) {
            setTrendingProjects(newProjects);
          } else {
            // Update - only add new projects that don't exist
            setTrendingProjects((prevProjects) => {
              const existingTokens = new Set(
                prevProjects.map((p) => p.tokenAddress)
              );
              const trulyNewProjects = newProjects.filter(
                (p: TrendingProject) => !existingTokens.has(p.tokenAddress)
              );

              if (trulyNewProjects.length > 0) {
                // Add new projects to the beginning of the array
                const updatedProjects = [...trulyNewProjects, ...prevProjects];
                console.log("New trending projects added:", trulyNewProjects);

                // Mark new projects for animation
                const newProjectIds = trulyNewProjects.map(
                  (p: TrendingProject) => p.tokenAddress
                );
                newProjectIdsRef.current = new Set(newProjectIds);
                setTimeout(() => animateNewCards(newProjectIds), 10);

                return updatedProjects;
              }

              return prevProjects;
            });
          }
        } catch (err) {
          console.error("Failed to fetch trending projects:", err);
          setError("Failed to load trending projects");
          if (isInitialLoad) {
            setTrendingProjects([]);
          }
        } finally {
          if (isInitialLoad) {
            setLoading(false);
          }
        }
      },
      [animateNewCards, selectedTimeframe]
    );

    const memoizedProjects = useMemo(
      () => trendingProjects,
      [trendingProjects]
    );

    const currentPageProjects = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return memoizedProjects.slice(startIndex, endIndex);
    }, [memoizedProjects, currentPage, itemsPerPage]);

    const handlePageChange = useCallback(
      (newPage: number) => {
        if (newPage === currentPage || isTransitioning) return;

        setIsTransitioning(true);
        setCurrentPage(newPage);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      },
      [currentPage, isTransitioning]
    );

    const handleTimeframeChange = useCallback(
      (timeframe: "realtime" | "5minute" | "1hour") => {
        if (timeframe === selectedTimeframe || loading) return;

        setSelectedTimeframe(timeframe);
        setCurrentPage(1); // Reset to first page
        setTrendingProjects([]); // Clear current projects
        fetchTrendingProjects(true, timeframe);
      },
      [selectedTimeframe, loading, fetchTrendingProjects]
    );

    useEffect(() => {
      if (trendingProjects.length === 0) {
        prevProjectsRef.current = [];
        newProjectIdsRef.current.clear();
        return;
      }

      if (prevProjectsRef.current.length > 0) {
        const prevIds = new Set(
          prevProjectsRef.current.map((p) => p.tokenAddress)
        );
        const newIds = trendingProjects
          .filter((project) => !prevIds.has(project.tokenAddress))
          .map((project) => project.tokenAddress);

        if (newIds.length > 0) {
          newProjectIdsRef.current = new Set(newIds);
          setTimeout(() => animateNewCards(newIds), 10);
        }
      }

      prevProjectsRef.current = [...trendingProjects];
    }, [trendingProjects, animateNewCards]);

    useEffect(() => {
      // Initial load
      fetchTrendingProjects(true);

      // Set up periodic updates (not initial loads)
      const interval = setInterval(() => {
        fetchTrendingProjects(false);
      }, 10000); // Check for new entries every 10 seconds

      return () => {
        clearInterval(interval);
      };
    }, [fetchTrendingProjects, selectedTimeframe]);

    const renderProject = useCallback(
      (project: TrendingProject, index: number) => {
        const isNewProject = newProjectIdsRef.current.has(project.tokenAddress);

        return (
          <div
            key={project.tokenAddress}
            id={`trending-card-${project.tokenAddress}`}
            className={`transition-all duration-300 ${
              isNewProject
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            <BonkTrendingCard project={project} isFirst={index === 0} />
          </div>
        );
      },
      []
    );

    const formatLastUpdated = useCallback((timestamp: string) => {
      const now = new Date();
      const updateTime = new Date(timestamp);

      if (isNaN(updateTime.getTime())) {
        return "Unknown";
      }

      const diffInSeconds = Math.floor(
        (now.getTime() - updateTime.getTime()) / 1000
      );

      if (diffInSeconds < 60) {
        return `${Math.max(diffInSeconds, 1)}s ago`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}m ago`;
      } else {
        return updateTime.toLocaleTimeString();
      }
    }, []);

    return (
      <div className="relative   bg-white/[0.03] border border-white/[0.1] rounded-3xl h-fit py-4 px-6 transition-all duration-500">
        <div className="flex flex-col gap-4 mb-4 relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="font-algance text-xl text-main-text">
              Trending Tokens
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-tiktok text-sm text-main-light-text">
                {lastUpdated ? formatLastUpdated(lastUpdated) : "Live"}
              </span>
            </div>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center gap-2">
            <span className="font-tiktok text-sm text-main-light-text mr-2">
              Timeframe:
            </span>
            <div className="flex items-center gap-1">
              {[
                {
                  key: "realtime" as const,
                  label: "Realtime",
                  icon: "material-symbols:bolt",
                },
                {
                  key: "5minute" as const,
                  label: "5 Min",
                  icon: "material-symbols:timer-5",
                },
                {
                  key: "1hour" as const,
                  label: "1 Hour",
                  icon: "material-symbols:schedule",
                },
              ].map((timeframe) => (
                <button
                  key={timeframe.key}
                  onClick={() => handleTimeframeChange(timeframe.key)}
                  disabled={loading}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    selectedTimeframe === timeframe.key
                      ? "bg-main-accent/15 border border-main-accent/50 text-main-accent shadow-main-accent/20"
                      : loading
                      ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
                  }`}
                >
                  <Icon icon={timeframe.icon} className="w-3 h-3" />
                  <span className="font-tiktok">{timeframe.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 relative z-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-main-dark p-4 rounded-lg shadow-lg flex items-center space-x-4 w-full"
              >
                <Skeleton
                  width="100%"
                  height={66}
                  className="rounded-full flex-shrink-0"
                />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 relative z-10">
            <p className="text-red-400 font-tiktok mb-4">{error}</p>
            <button
              onClick={() => fetchTrendingProjects(true, selectedTimeframe)}
              className="px-6 py-2 bg-main-accent hover:bg-main-highlight text-main-bg font-tiktok rounded-xl transition-all duration-300"
            >
              Retry
            </button>
          </div>
        ) : memoizedProjects.length === 0 ? (
          <div className="text-center py-8 relative z-10">
            <Icon
              icon="material-symbols:trending-up"
              className="w-12 h-12 text-main-light-text mx-auto mb-4 opacity-50"
            />
            <p className="text-main-light-text font-tiktok">
              No trending projects found
            </p>
          </div>
        ) : (
          <>
            <div
              ref={feedRef || localFeedRef}
              className={`space-y-4 relative z-10 transition-all duration-300 ${
                isTransitioning
                  ? "opacity-50 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {currentPageProjects.map(renderProject)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isTransitioning}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    currentPage === 1 || isTransitioning
                      ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
                  }`}
                >
                  <Icon icon="mingcute:left-line" className="w-4 h-4" />
                  <span className="font-tiktok hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isTransitioning}
                        className={`px-3 py-2 rounded-lg text-sm min-w-[40px] transition-all duration-300 ${
                          currentPage === page
                            ? "bg-main-accent/15 border border-main-accent/50 text-main-accent shadow-main-accent/20"
                            : isTransitioning
                            ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
                            : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
                        }`}
                      >
                        <span className="font-tiktok">{page}</span>
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isTransitioning}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    currentPage === totalPages || isTransitioning
                      ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
                  }`}
                >
                  <span className="font-tiktok hidden sm:inline">Next</span>
                  <Icon icon="mingcute:right-line" className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center flex justify-center mt-6 relative z-10">
          <div className="flex items-center gap-2 px-4 py-2   bg-white/[0.05] border border-white/[0.1] rounded-xl">
            <Icon
              icon="material-symbols:schedule"
              className="w-4 h-4 text-main-accent"
            />
            <span className="font-tiktok text-xs text-main-light-text">
              {selectedTimeframe === "realtime"
                ? "Checks for new entries every 10 seconds"
                : selectedTimeframe === "5minute"
                ? "Updates every 10 seconds (5-minute window)"
                : "Updates every 10 seconds (1-hour window)"}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default BonkTrendingFeed;
