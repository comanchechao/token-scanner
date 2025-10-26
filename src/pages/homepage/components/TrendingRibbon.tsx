import React, { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { TrendingProject } from "../../../types/api";
import { getAllTokens, MockTokenData } from "../../../data/mockTokenData";

// Convert MockTokenData to TrendingProject format
const convertToTrendingProject = (token: MockTokenData): TrendingProject => {
  return {
    tokenAddress: token.address,
    tokenName: token.name,
    tokenSymbol: token.symbol,
    tokenImage: token.image,
    lastTradeTimestamp: token.lastTradeTimestamp || Date.now(),
    firstAddedTimestamp: token.firstAddedTimestamp || Date.now(),
    totalTrades: token.totalTrades || 0,
    marketCap: token.marketCapRaw,
    firstTradeMarketCap: token.firstTradeMarketCap || 0,
    marketCapGain: token.marketCapGain || 0,
    bracket: token.bracket || "low",
    tradesCount: token.tradesCount || 0,
    buyTrades: token.buyTrades || 0,
    sellTrades: token.sellTrades || 0,
    rank: token.rank,
    uniqueKOLs: token.uniqueKOLs,
  };
};

interface TrendingRibbonItemProps {
  project: TrendingProject;
}

const TrendingRibbonItem: React.FC<TrendingRibbonItemProps> = ({ project }) => {
  const navigate = useNavigate();

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}K`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  const formatGain = (gain: number) => {
    return `+${gain.toFixed(1)}%`;
  };

  const handleClick = () => {
    navigate(`/tokens/${project.tokenAddress}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex-shrink-0 bg-[#161616] border border-white/[0.08] rounded-sm p-3 hover:bg-white/[0.06] hover:border-main-accent/30 transition-all duration-300 min-w-[280px] mx-2 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        {/* Token Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={project.tokenImage}
                alt={project.tokenName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/dogLogo.webp"; // Fallback image
                }}
              />
            </div>
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-main-accent to-main-highlight text-main-bg text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {project.bracket === "high"
                ? "🔥"
                : project.bracket === "mid"
                ? "📈"
                : "💎"}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-tiktok text-sm font-semibold text-main-text truncate">
                {project.tokenSymbol}
              </h3>
              <span className="font-tiktok text-xs text-main-light-text">
                #{project.rank}
              </span>
            </div>
            <p className="font-tiktok text-xs text-main-light-text truncate">
              {project.tokenName}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-tiktok text-sm font-semibold text-main-text">
              {formatMarketCap(project.marketCap)}
            </span>
            <span className="font-tiktok text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
              {formatGain(project.marketCapGain)}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-main-light-text">
            <span className="flex items-center space-x-1">
              <Icon icon="material-symbols:group" className="w-3 h-3" />
              <span>{project.uniqueKOLs}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon icon="material-symbols:trending-up" className="w-3 h-3" />
              <span>{project.totalTrades}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingRibbon: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "right"
  );
  const wasScrollingRef = useRef(false);

  // Get all tokens and convert to trending format
  const trendingTokens = getAllTokens().map(convertToTrendingProject);

  useEffect(() => {
    if (!scrollContainerRef.current || trendingTokens.length === 0) return;

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
  }, [trendingTokens, isScrolling, scrollDirection]);

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

  return (
    <div className="w-full bg-main-bg/95 backdrop-blur-sm border-b border-white/[0.05] py-3 overflow-hidden z-40">
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
        {trendingTokens.map((project) => (
          <TrendingRibbonItem key={project.tokenAddress} project={project} />
        ))}
      </div>
    </div>
  );
};

export default TrendingRibbon;
