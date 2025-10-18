import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Icon } from "@iconify/react";
import TrendingRibbonItem from "./TrendingRibbonItem";
import Skeleton from "./Skeleton";
import { KOLService } from "../api";
import { TrendingProject } from "../types/api";

const TrendingRibbon: React.FC = React.memo(() => {
  const [trendingProjects, setTrendingProjects] = useState<TrendingProject[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "right"
  );
  const wasScrollingRef = useRef(false);

  const fetchTrendingProjects = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      const response = await KOLService.getTrendingProjects({
        limit: 50,
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

      if (isInitialLoad) {
        setTrendingProjects(newProjects);
      } else {
        setTrendingProjects((prevProjects) => {
          const existingTokens = new Set(
            prevProjects.map((p) => p.tokenAddress)
          );
          const trulyNewProjects = newProjects.filter(
            (p) => !existingTokens.has(p.tokenAddress)
          );

          if (trulyNewProjects.length > 0) {
            const updatedProjects = [...trulyNewProjects, ...prevProjects];
            console.log("New trending projects added:", trulyNewProjects);
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
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || trendingProjects.length === 0) return;

    const container = scrollContainerRef.current;
    let animationId: number;
    let startDelay: NodeJS.Timeout;

    const scroll = () => {
      if (!isScrolling) {
        const scrollSpeed = 1;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (scrollDirection === "right") {
          container.scrollLeft += scrollSpeed;
          if (container.scrollLeft >= maxScroll) {
            setScrollDirection("left");
          }
        } else {
          container.scrollLeft -= scrollSpeed;
          if (container.scrollLeft <= 0) {
            setScrollDirection("right");
          }
        }
      }

      animationId = requestAnimationFrame(scroll);
    };

    // If scrolling was just stopped (mouse leave), start immediately
    // Otherwise, use the initial 2-second delay
    const shouldStartImmediately = !isScrolling && wasScrollingRef.current;

    if (shouldStartImmediately) {
      // Reset the flag and start immediately
      wasScrollingRef.current = false;
      animationId = requestAnimationFrame(scroll);
    } else if (!isScrolling) {
      // Initial load or other cases - use delay
      startDelay = setTimeout(() => {
        animationId = requestAnimationFrame(scroll);
      }, 2000);
    }

    return () => {
      if (startDelay) {
        clearTimeout(startDelay);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [trendingProjects, isScrolling, scrollDirection]);

  const handleMouseEnter = useCallback(() => {
    wasScrollingRef.current = isScrolling;
    setIsScrolling(true);
  }, [isScrolling]);

  const handleMouseLeave = useCallback(() => {
    wasScrollingRef.current = true;
    setIsScrolling(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    wasScrollingRef.current = true;
    setIsScrolling(false);
  }, []);

  const handleTouchCancel = useCallback(() => {
    wasScrollingRef.current = true;
    setIsScrolling(false);
  }, []);

  useEffect(() => {
    fetchTrendingProjects(true);

    const interval = setInterval(() => {
      fetchTrendingProjects(false);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchTrendingProjects]);

  const memoizedProjects = useMemo(() => trendingProjects, [trendingProjects]);

  if (loading) {
    return (
      <div className="w-full bg-white/[0.02] border-b border-white/[0.05] py-3">
        <div className="flex overflow-x-auto scrollbar-hide space-x-0 px-4">
          {/* Create 5 skeleton items to simulate the loading state */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 min-w-[400px] mx-2"
            >
              <div className="flex items-center justify-between">
                {/* Token Info Skeleton */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Skeleton width={32} height={32} className="rounded-full" />
                    <Skeleton
                      width={16}
                      height={16}
                      className="absolute -top-1 -right-1 rounded-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Skeleton width={80} height={16} className="mb-2" />
                    <div className="flex items-center space-x-2">
                      <Skeleton width={40} height={12} />
                      <Skeleton width={40} height={12} />
                      <Skeleton width={60} height={12} />
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Skeleton width={50} height={24} className="rounded-lg" />
                  <Skeleton width={50} height={24} className="rounded-lg" />
                  <Skeleton width={24} height={24} className="rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || memoizedProjects.length === 0) {
    return (
      <div className="w-full bg-white/[0.02] border-b border-white/[0.05] py-3">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Icon
              icon="material-symbols:error"
              className="w-4 h-4 text-red-400"
            />
            <span className="font-tiktok text-sm text-red-400">
              {error || "No trending tokens available"}
            </span>
          </div>
          <button
            onClick={() => fetchTrendingProjects(true)}
            className="px-3 py-1 bg-main-accent/10 hover:bg-main-accent/20 text-main-accent font-tiktok text-xs rounded-lg transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="  top-16 left-0 w-full bg-main-bg/95 backdrop-blur-sm border-b border-white/[0.05] py-3 overflow-hidden z-40">
      {/* Scrolling Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-0 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {memoizedProjects.map((project) => (
          <TrendingRibbonItem key={project.tokenAddress} project={project} />
        ))}
      </div>
    </div>
  );
});

export default TrendingRibbon;
