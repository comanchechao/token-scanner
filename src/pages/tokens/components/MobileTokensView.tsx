import React, { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Token } from "./TokenCard";
import MobileTokenCard from "./MobileTokenCard";
import Skeleton from "../../../components/Skeleton";

interface MobileTokensViewProps {
  lowCapTokens: Token[];
  midCapTokens: Token[];
  highCapTokens: Token[];
  loading: boolean;
  searchQuery: string;
  onTokenClick: (token: Token) => void;
}

type BracketType = "low" | "mid" | "high";

const MobileTokensView: React.FC<MobileTokensViewProps> = ({
  lowCapTokens,
  midCapTokens,
  highCapTokens,
  loading,
  searchQuery,
  onTokenClick,
}) => {
  const [currentBracket, setCurrentBracket] = useState<BracketType>("low");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [verticalTouchStart, setVerticalTouchStart] = useState<number | null>(
    null
  );
  const [verticalTouchEnd, setVerticalTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const brackets = [
    {
      key: "low" as BracketType,
      title: "Low Cap",
      icon: "💎",
      range: "< $100K",
    },
    {
      key: "mid" as BracketType,
      title: "Mid Cap",
      icon: "📈",
      range: "$100K - $500K",
    },
    {
      key: "high" as BracketType,
      title: "High Cap",
      icon: "🔥",
      range: "> $500K",
    },
  ];

  const getCurrentTokens = () => {
    switch (currentBracket) {
      case "low":
        return lowCapTokens;
      case "mid":
        return midCapTokens;
      case "high":
        return highCapTokens;
      default:
        return lowCapTokens;
    }
  };

  const filterTokens = (tokenList: Token[]) => {
    if (!searchQuery.trim()) return tokenList;

    const query = searchQuery.toLowerCase();
    return tokenList.filter(
      (token) =>
        token.tokenName.toLowerCase().includes(query) ||
        token.tokenSymbol.toLowerCase().includes(query) ||
        token.tokenAddress.toLowerCase().includes(query)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setVerticalTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setVerticalTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const verticalDistance =
      (verticalTouchStart || 0) - (verticalTouchEnd || 0);
    const isHorizontalSwipe = Math.abs(distance) > Math.abs(verticalDistance);
    const minSwipeDistance = 50;

    if (isHorizontalSwipe && Math.abs(distance) > minSwipeDistance) {
      const currentIndex = brackets.findIndex((b) => b.key === currentBracket);

      if (distance > 0) {
        // Swipe left - next bracket
        const nextIndex = (currentIndex + 1) % brackets.length;
        setCurrentBracket(brackets[nextIndex].key);
      } else {
        // Swipe right - previous bracket
        const prevIndex =
          currentIndex === 0 ? brackets.length - 1 : currentIndex - 1;
        setCurrentBracket(brackets[prevIndex].key);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setVerticalTouchStart(null);
    setVerticalTouchEnd(null);
  }, [
    touchStart,
    touchEnd,
    verticalTouchStart,
    verticalTouchEnd,
    currentBracket,
    brackets,
  ]);

  useEffect(() => {
    handleTouchEnd();
  }, [handleTouchEnd]);

  const currentBracketData = brackets.find((b) => b.key === currentBracket);
  const currentTokens = getCurrentTokens();
  const filteredTokens = filterTokens(currentTokens);

  const TokenCardSkeleton: React.FC = () => (
    <div className="bg-[#161616]  border border-white/[0.1] rounded-sm p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton width={40} height={40} className="rounded-sm" />
          <div>
            <Skeleton width={70} height={20} className="mb-1 rounded-lg" />
            <Skeleton width={50} height={14} className="rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="bg-[#161616]  rounded-sm p-2 border border-white/[0.05]">
          <Skeleton width={60} height={12} className="rounded mb-1" />
          <Skeleton width={80} height={14} className="rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton width="100%" height={36} className="rounded-sm" />
        <Skeleton width="100%" height={36} className="rounded-sm" />
        <Skeleton width={36} height={36} className="rounded-sm" />
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-hidden touch-pan-y select-none flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Header with bracket indicator */}
      <div className="flex-shrink-0 bg-gradient-to-b from-main-bg to-transparent pb-4 pt-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.1] rounded-sm px-3 py-2">
            {brackets.map((bracket) => (
              <button
                key={bracket.key}
                onClick={() => setCurrentBracket(bracket.key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-sm transition-all duration-300 ${
                  currentBracket === bracket.key
                    ? "bg-main-accent text-main-bg"
                    : "text-main-light-text hover:text-main-text"
                }`}
              >
                <span className="text-xs">{bracket.icon}</span>
                <span className="font-tiktok text-xs font-medium">
                  {bracket.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current bracket info */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl">{currentBracketData?.icon}</span>
            <h2 className="font-algance text-lg text-main-text">
              {currentBracketData?.title} Tokens
            </h2>
          </div>
          <p className="text-main-light-text text-xs">
            {currentBracketData?.range}
          </p>
        </div>

        {/* Swipe indicator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon
            icon="material-symbols:swipe-left"
            className="w-3 h-3 text-main-accent"
          />
          <span className="text-xs text-main-light-text">
            Swipe to change bracket
          </span>
          <Icon
            icon="material-symbols:swipe-right"
            className="w-3 h-3 text-main-accent"
          />
        </div>
      </div>

      {/* Tokens list - scrollable area */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-20"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <TokenCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-main-light-text mb-2">
              {searchQuery.trim() ? "No tokens found" : "No tokens available"}
            </p>
            {searchQuery.trim() && (
              <p className="text-xs text-main-light-text">
                Try adjusting your search criteria
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTokens.map((token) => (
              <MobileTokenCard
                key={token.tokenAddress}
                token={token}
                onTokenClick={onTokenClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-1 bg-white/[0.1] border border-white/[0.2] rounded-full px-3 py-1">
          <Icon
            icon="material-symbols:keyboard-arrow-up"
            className="w-4 h-4 text-main-accent"
          />
          <span className="text-xs text-main-light-text">Scroll for more</span>
          <Icon
            icon="material-symbols:keyboard-arrow-down"
            className="w-4 h-4 text-main-accent"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileTokensView;
