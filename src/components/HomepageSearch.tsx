import React, { memo, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useSearch } from "../hooks/useSearch";
import { SearchConfig, SearchResult } from "../types/search";
import { KOLService } from "../api";

interface HomepageSearchProps {
  className?: string;
}

const handleResultClick = (result: SearchResult<any>) => {
  if (result.item.type === "kol" || result.item.type === "trader") {
    window.location.href = `/accounts/${result.item.address}`;
  } else if (result.item.type === "token") {
    window.location.href = "/tokens";
  }
};

const searchFunction = async (query: string) => {
  if (!query.trim()) return [];

  try {
    const response = await KOLService.searchKOLs(query);
    if (response.success && response.data) {
      return response.data.map((kol) => ({
        id: kol.walletAddress,
        item: {
          ...kol,
          type: "kol",
          title:
            kol.username ||
            `${kol.walletAddress.slice(0, 6)}...${kol.walletAddress.slice(-4)}`,
          description: `${kol.walletAddress.slice(
            0,
            6
          )}...${kol.walletAddress.slice(-4)}`,
          address: kol.walletAddress,
          avatar: kol.profileImage,
          query: query,
        },
        matchedFields: ["username", "walletAddress"],
        score: kol.username?.toLowerCase().startsWith(query.toLowerCase())
          ? 100
          : 80,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching KOLs:", error);
    return [];
  }
};

const renderResult = (result: SearchResult<any>, index: number) => (
  <div
    key={result.id}
    className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
      index === result.item.selectedIndex
        ? "bg-white/[0.08] border-l-2 border-main-accent"
        : ""
    }`}
    onClick={() => handleResultClick(result)}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex-shrink-0">
        {result.item.avatar ? (
          <img
            src={result.item.avatar}
            alt={result.item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon
              icon="material-symbols:person"
              className="w-5 h-5 text-main-accent"
            />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-tiktok text-sm text-main-text font-medium truncate">
            {result.item.title}
          </span>
          {result.item.isVerified && (
            <Icon
              icon="material-symbols:verified"
              className="w-4 h-4 text-blue-400 flex-shrink-0"
            />
          )}
        </div>
        <div className="text-xs text-main-light-text/60 truncate">
          {result.item.description}
        </div>
      </div>
    </div>
  </div>
);

const renderNoResults = (query: string) => (
  <div className="px-4 py-8 text-center">
    <Icon
      icon="material-symbols:person-search"
      className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
    />
    <div className="font-tiktok text-sm text-main-light-text/60 mb-2">
      No KOLs found for "{query}"
    </div>
    <div className="font-tiktok text-xs text-main-light-text/40">
      Try searching by KOL name or wallet address
    </div>
  </div>
);

const renderLoading = () => (
  <div className="px-4 py-8 text-center">
    <div className="animate-spin w-6 h-6 border-2 border-main-accent/20 border-t-main-accent rounded-full mx-auto mb-3"></div>
    <div className="font-tiktok text-sm text-main-light-text/60">
      Searching...
    </div>
  </div>
);

const noop = () => {};

// Completely static search configuration - no recreation ever
const HOMEPAGE_SEARCH_CONFIG: SearchConfig<any> = {
  data: [],
  searchFunction,
  placeholder: "Wallet address or KOL name...",
  icon: "icon-park-twotone:search",
  minQueryLength: 2,
  maxResults: 6,
  debounceMs: 300,
  renderResult,
  renderNoResults,
  renderLoading,
  onResultClick: handleResultClick,
  onSearch: noop,
  onClear: noop,
};

const HomepageSearch: React.FC<HomepageSearchProps> = memo(
  ({ className = "" }) => {
    const {
      state,
      handleInputChange,
      handleClear,
      handleFocus,
      handleBlur,
      handleKeyDown,
      hasResults,
      shouldShowResults,
      isSearching,
    } = useSearch(HOMEPAGE_SEARCH_CONFIG);

    const handleSearchClear = useCallback(() => {
      handleClear();
    }, [handleClear]);

    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative   bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/50 rounded-2xl transition-all duration-300">
          {/* Search Icon */}
          <Icon
            icon="icon-park-twotone:search"
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-main-light-text/60 z-20 w-6 h-6"
          />

          {/* Input */}
          <input
            type="text"
            placeholder="Wallet address or KOL name..."
            value={state.query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full pl-14 pr-32 py-4 text-lg bg-transparent text-main-text placeholder-[var(--color-main-light-text)]/60 placeholder:text-sm font-tiktok focus:outline-none focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-all duration-300"
          />

          {/* Clear Button */}
          {state.query && (
            <button
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-main-light-text/60 hover:text-main-light-text transition-colors duration-200 z-20"
            >
              <Icon icon="material-symbols:close" className="w-4 h-4" />
            </button>
          )}

          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
              <div className="animate-spin w-4 h-4 border-2 border-main-accent/20 border-t-main-accent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Results */}
        {shouldShowResults && (
          <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-[9999] bg-white/[0.15] backdrop-blur-md border border-white/[0.2] rounded-2xl shadow-2xl shadow-black/40">
            {isSearching
              ? HOMEPAGE_SEARCH_CONFIG.renderLoading?.()
              : hasResults
              ? state.results.map((result, index) =>
                  HOMEPAGE_SEARCH_CONFIG.renderResult?.(result, index)
                )
              : state.hasSearched
              ? HOMEPAGE_SEARCH_CONFIG.renderNoResults?.(state.query)
              : null}
          </div>
        )}
      </div>
    );
  }
);

HomepageSearch.displayName = "HomepageSearch";

export default HomepageSearch;
