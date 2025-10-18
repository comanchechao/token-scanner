import { Icon } from "@iconify/react";
import { SearchConfig, SearchResult } from "../types/search";
import { createSearchFunction } from "../hooks/useSearch";
import { HighlightedText } from "../components/SearchComponent";
import { useNavigate } from "react-router-dom";
import { KOLService } from "../api/kolService";

export function createTokenSearchConfig(
  tokens: any[],
  onResultClick?: (result: SearchResult<any>) => void
): SearchConfig<any> {
  return {
    data: tokens,
    searchFunction: createSearchFunction(
      [
        { field: "tokenName", weight: 3 },
        { field: "tokenSymbol", weight: 2 },
        { field: "tokenAddress", weight: 1 },
      ],
      tokens
    ),
    placeholder: "Search tokens...",
    icon: "material-symbols:token",
    minQueryLength: 1,
    maxResults: 8,
    debounceMs: 150,
    renderResult: (result: SearchResult<any>, index: number) => (
      <div
        key={result.id}
        className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
          index === result.item.selectedIndex
            ? "bg-white/[0.08] border-l-2 border-main-accent"
            : ""
        }`}
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-main-accent/20 to-main-highlight/20 rounded-xl flex items-center justify-center">
            <Icon
              icon="material-symbols:token"
              className="w-5 h-5 text-main-accent"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <HighlightedText
                text={result.item.tokenName}
                query={result.item.query}
                className="font-tiktok text-sm text-main-text font-medium"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-main-light-text/60">
              <HighlightedText
                text={result.item.tokenSymbol}
                query={result.item.query}
                className="font-mono"
              />
              <span>•</span>
              <span>
                {result.item.marketCap >= 1000000
                  ? `$${(result.item.marketCap / 1000000).toFixed(1)}M`
                  : `$${(result.item.marketCap / 1000).toFixed(1)}K`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-tiktok text-sm text-main-text">
              MC:{" "}
              {result.item.marketCap >= 1000000
                ? `$${(result.item.marketCap / 1000000).toFixed(1)}M`
                : `$${(result.item.marketCap / 1000).toFixed(1)}K`}
            </div>
            <div className="font-tiktok text-xs text-main-light-text/60">
              {result.item.totalTrades} trades
            </div>
          </div>
        </div>
      </div>
    ),
    renderNoResults: (query: string) => (
      <div className="px-4 py-8 text-center">
        <Icon
          icon="material-symbols:search-off-outline"
          className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
        />
        <div className="font-tiktok text-sm text-main-light-text/60 mb-2">
          No tokens found for "{query}"
        </div>
        <div className="font-tiktok text-xs text-main-light-text/40">
          Try searching by token name, symbol, or address
        </div>
      </div>
    ),
    onResultClick:
      onResultClick ||
      ((result) => {
        // Default action - could navigate to token detail page
        console.log("Token selected:", result.item);
      }),
  };
}

// Trader search configuration
export function createTraderSearchConfig(
  traders: any[],
  onResultClick?: (result: SearchResult<any>) => void
): SearchConfig<any> {
  const navigate = useNavigate();

  return {
    data: traders,
    searchFunction: createSearchFunction(
      [
        { field: "username", weight: 3 },
        { field: "walletAddress", weight: 2 },
      ],
      traders
    ),
    placeholder: "Search traders...",
    icon: "material-symbols:person",
    minQueryLength: 1,
    maxResults: 6,
    debounceMs: 150,
    renderResult: (result: SearchResult<any>, index: number) => (
      <div
        key={result.id}
        className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
          index === result.item.selectedIndex
            ? "bg-white/[0.08] border-l-2 border-main-accent"
            : ""
        }`}
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
            {result.item.profileImage ? (
              <img
                src={result.item.profileImage}
                alt={result.item.username}
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
              <HighlightedText
                text={result.item.username}
                query={result.item.query}
                className="font-tiktok text-sm text-main-text font-medium"
              />
              {result.item.verified && (
                <Icon
                  icon="material-symbols:verified"
                  className="w-4 h-4 text-blue-400"
                />
              )}
            </div>
            <div className="text-xs text-main-light-text/60">
              <HighlightedText
                text={`${result.item.walletAddress.slice(
                  0,
                  6
                )}...${result.item.walletAddress.slice(-4)}`}
                query={result.item.query}
                className="font-mono"
              />
              <span className="ml-2">•</span>
              <span className="ml-2">
                {result.item.trades?.length || 0} trades
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-tiktok text-xs text-main-light-text/60">
              Score: {result.score.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    ),
    renderNoResults: (query: string) => (
      <div className="px-4 py-8 text-center">
        <Icon
          icon="material-symbols:person-off-outline"
          className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
        />
        <div className="font-tiktok text-sm text-main-light-text/60 mb-2">
          No traders found for "{query}"
        </div>
        <div className="font-tiktok text-xs text-main-light-text/40">
          Try searching by username or wallet address
        </div>
      </div>
    ),
    onResultClick:
      onResultClick ||
      ((result) => {
        // Navigate to trader's account page
        navigate(`/accounts/${result.item.walletAddress}`);
      }),
  };
}

// KOL/Leaderboard search configuration
export function createKOLSearchConfig(
  kols: any[],
  onResultClick?: (result: SearchResult<any>) => void
): SearchConfig<any> {
  const navigate = useNavigate();

  return {
    data: kols,
    searchFunction: createSearchFunction(
      [
        { field: "username", weight: 3 },
        { field: "walletAddress", weight: 2 },
        { field: "socialLinks.twitter", weight: 1 },
        { field: "socialLinks.telegram", weight: 1 },
      ],
      kols
    ),
    placeholder: "Search KOLs...",
    icon: "material-symbols:leaderboard",
    minQueryLength: 1,
    maxResults: 8,
    debounceMs: 150,
    renderResult: (result: SearchResult<any>, index: number) => (
      <div
        key={result.id}
        className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
          index === result.item.selectedIndex
            ? "bg-white/[0.08] border-l-2 border-main-accent"
            : ""
        }`}
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
            {result.item.profileImage ? (
              <img
                src={result.item.profileImage}
                alt={result.item.username}
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
              <HighlightedText
                text={result.item.username}
                query={result.item.query}
                className="font-tiktok text-sm text-main-text font-medium"
              />
              {result.item.isVerified && (
                <Icon
                  icon="material-symbols:verified"
                  className="w-4 h-4 text-blue-400"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-main-light-text/60">
              <span>Win Rate: {result.item.winRate.toFixed(1)}%</span>
              <span>•</span>
              <span>Score: {result.item.score.toFixed(0)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-tiktok text-xs text-main-light-text/60">
              Rank #{result.item.rank || "N/A"}
            </div>
          </div>
        </div>
      </div>
    ),
    renderNoResults: (query: string) => (
      <div className="px-4 py-8 text-center">
        <Icon
          icon="material-symbols:leaderboard-off"
          className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
        />
        <div className="font-tiktok text-sm text-main-light-text/60 mb-2">
          No KOLs found for "{query}"
        </div>
        <div className="font-tiktok text-xs text-main-light-text/40">
          Try searching by username or wallet address
        </div>
      </div>
    ),
    onResultClick:
      onResultClick ||
      ((result) => {
        // Navigate to KOL's account page
        navigate(`/accounts/${result.item.walletAddress}`);
      }),
  };
}

// Trade search configuration
export function createTradeSearchConfig(
  trades: any[],
  onResultClick?: (result: SearchResult<any>) => void
): SearchConfig<any> {
  return {
    data: trades,
    searchFunction: createSearchFunction(
      [
        { field: "tradeId", weight: 3 },
        { field: "tokenName", weight: 2 },
        { field: "tokenSymbol", weight: 2 },
        { field: "walletAddress", weight: 1 },
        { field: "username", weight: 1 },
      ],
      trades
    ),
    placeholder: "Search trades...",
    icon: "material-symbols:swap-horiz",
    minQueryLength: 1,
    maxResults: 10,
    debounceMs: 150,
    renderResult: (result: SearchResult<any>, index: number) => (
      <div
        key={result.id}
        className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
          index === result.item.selectedIndex
            ? "bg-white/[0.08] border-l-2 border-main-accent"
            : ""
        }`}
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              result.item.tradeType === "buy"
                ? "bg-green-400/20 text-green-400"
                : "bg-red-400/20 text-red-400"
            }`}
          >
            <Icon
              icon={
                result.item.tradeType === "buy"
                  ? "material-symbols:trending-up"
                  : "material-symbols:trending-down"
              }
              className="w-4 h-4"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <HighlightedText
                text={result.item.tokenName}
                query={result.item.query}
                className="font-tiktok text-sm text-main-text font-medium"
              />
              <span className="font-tiktok text-xs text-main-light-text/60">
                (
                <HighlightedText
                  text={result.item.tokenSymbol}
                  query={result.item.query}
                  className="font-mono"
                />
                )
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-main-light-text/60">
              <HighlightedText
                text={result.item.username}
                query={result.item.query}
              />
              <span>•</span>
              <span className="capitalize">{result.item.tradeType}</span>
              <span>•</span>
              <span>{result.item.amount.toFixed(2)} tokens</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-tiktok text-sm text-main-text">
              ${result.item.price.toFixed(result.item.price < 1 ? 6 : 2)}
            </div>
            <div className="font-tiktok text-xs text-main-light-text/60">
              {result.item.timestamp}
            </div>
          </div>
        </div>
      </div>
    ),
    renderNoResults: (query: string) => (
      <div className="px-4 py-8 text-center">
        <Icon
          icon="material-symbols:swap-horiz-off"
          className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
        />
        <div className="font-tiktok text-sm text-main-light-text/60 mb-2">
          No trades found for "{query}"
        </div>
        <div className="font-tiktok text-xs text-main-light-text/40">
          Try searching by token name, symbol, or trader
        </div>
      </div>
    ),
    onResultClick:
      onResultClick ||
      ((result) => {
        console.log("Trade selected:", result.item);
      }),
  };
}

export function createGeneralSearchConfig(
  activities: any[] = [],
  onResultClick?: (result: SearchResult<any>) => void
): SearchConfig<any> {
  const navigate = useNavigate();

  return {
    data: activities,
    searchFunction: (query: string) => {
      if (!query.trim()) return [];

      const normalizedQuery = query.toLowerCase();
      const results: any[] = [];

      const uniqueTraders = new Map();
      const uniqueTokens = new Map();

      activities.forEach((activity) => {
        // Add trader/KOL
        if (!uniqueTraders.has(activity.walletAddress)) {
          uniqueTraders.set(activity.walletAddress, {
            id: `trader-${activity.walletAddress}`,
            type: "kol",
            title: activity.name,
            description: `Recent activity: ${activity.action} ${activity.amount} ${activity.token}`,
            address: activity.walletAddress,
            avatar: activity.avatar,
            query: query,
          });
        }

        // Add token
        if (!uniqueTokens.has(activity.token)) {
          uniqueTokens.set(activity.token, {
            id: `token-${activity.token}`,
            type: "token",
            title: activity.token,
            description: `Recent trade: ${activity.price} • ${activity.action}`,
            address: activity.tokenAddress,
            query: query,
          });
        }
      });

      // Search through traders
      uniqueTraders.forEach((trader) => {
        if (
          trader.title.toLowerCase().includes(normalizedQuery) ||
          trader.description.toLowerCase().includes(normalizedQuery) ||
          trader.address.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            id: trader.id,
            item: trader,
            matchedFields: ["title", "description"],
            score: trader.title.toLowerCase().startsWith(normalizedQuery)
              ? 100
              : 80,
          });
        }
      });

      // Search through tokens
      uniqueTokens.forEach((token) => {
        if (
          token.title.toLowerCase().includes(normalizedQuery) ||
          token.description.toLowerCase().includes(normalizedQuery) ||
          token.address.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            id: token.id,
            item: token,
            matchedFields: ["title", "description"],
            score: token.title.toLowerCase().startsWith(normalizedQuery)
              ? 90
              : 70,
          });
        }
      });

      return results.sort((a, b) => b.score - a.score);
    },
    placeholder: "Search KOLs, tokens...",
    icon: "icon-park-twotone:search",
    minQueryLength: 2,
    maxResults: 6,
    debounceMs: 200,
    renderResult: (result: SearchResult<any>, index: number) => (
      <div
        key={result.id}
        className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
          index === result.item.selectedIndex
            ? "bg-white/[0.08] border-l-2 border-main-accent"
            : ""
        }`}
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-main-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
            {result.item.avatar ? (
              <img
                src={result.item.avatar}
                alt={result.item.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Icon
                icon={
                  result.item.type === "kol"
                    ? "material-symbols:person"
                    : result.item.type === "token"
                    ? "material-symbols:token"
                    : "material-symbols:search"
                }
                className="w-4 h-4 text-main-accent"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-tiktok text-sm text-main-text font-medium truncate">
              <HighlightedText
                text={result.item.title}
                query={result.item.query}
              />
            </div>
            <div className="font-tiktok text-xs text-main-light-text/60 mt-1">
              <span className="capitalize">{result.item.type}</span> •{" "}
              {result.item.description}
            </div>
          </div>
        </div>
      </div>
    ),
    renderNoResults: (query: string) => (
      <div className="px-4 py-8 text-center">
        <Icon
          icon="material-symbols:search-off-outline"
          className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
        />
        <div className="font-tiktok text-sm text-main-light-text/60 mb-2">
          No results found for "{query}"
        </div>
        <div className="font-tiktok text-xs text-main-light-text/40">
          Try searching for KOLs, tokens, or wallet addresses
        </div>
      </div>
    ),
    onResultClick:
      onResultClick ||
      ((result) => {
        // Handle general search result
        if (result.item.type === "token") {
          navigate("/tokens");
        } else if (
          result.item.type === "trader" ||
          result.item.type === "kol"
        ) {
          navigate(`/accounts/${result.item.address}`);
        }
      }),
  };
}

// API-based KOL search configuration for homepage
export function createKOLApiSearchConfig(
  onResultClick?: (result: SearchResult<any>) => void
): SearchConfig<any> {
  const navigate = useNavigate();

  return {
    data: [], // Data comes from API, not static
    searchFunction: async (query: string) => {
      if (!query.trim()) return [];

      try {
        const response = await KOLService.searchKOLs(query);
        if (response.success && response.data) {
          return response.data.map((kol) => ({
            id: kol.walletAddress,
            item: {
              ...kol,
              type: "kol",
              title: kol.username,
              description: `${kol.tier} KOL • Last trade: ${new Date(
                kol.lastTradeAt
              ).toLocaleDateString()}`,
              address: kol.walletAddress,
              avatar: kol.profileImage,
              query: query,
            },
            matchedFields: ["username", "walletAddress"],
            score: kol.username.toLowerCase().startsWith(query.toLowerCase())
              ? 100
              : 80,
          }));
        }
        return [];
      } catch (error) {
        console.error("Error searching KOLs:", error);
        return [];
      }
    },
    placeholder: "Search KOLs by name or wallet address...",
    icon: "icon-park-twotone:search",
    minQueryLength: 2,
    maxResults: 6,
    debounceMs: 300,
    renderResult: (result: SearchResult<any>, index: number) => (
      <div
        key={result.id}
        className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
          index === result.item.selectedIndex
            ? "bg-white/[0.08] border-l-2 border-main-accent"
            : ""
        }`}
        onClick={() => onResultClick?.(result)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
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
              <HighlightedText
                text={result.item.title}
                query={result.item.query}
                className="font-tiktok text-sm text-main-text font-medium"
              />
              {result.item.isVerified && (
                <Icon
                  icon="material-symbols:verified"
                  className="w-4 h-4 text-blue-400"
                />
              )}
            </div>
            <div className="text-xs text-main-light-text/60">
              <HighlightedText
                text={`${result.item.address.slice(
                  0,
                  6
                )}...${result.item.address.slice(-4)}`}
                query={result.item.query}
                className="font-mono"
              />
              <span className="ml-2">•</span>
              <span className="ml-2 capitalize">{result.item.tier}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {result.item.socialLinks?.twitter && (
              <a
                href={result.item.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-main-light-text/60 hover:text-main-accent transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon="mdi:twitter" className="w-4 h-4" />
              </a>
            )}
            {result.item.socialLinks?.telegram && (
              <a
                href={result.item.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-main-light-text/60 hover:text-main-accent transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon="mdi:telegram" className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    ),
    renderNoResults: (query: string) => (
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
    ),
    onResultClick:
      onResultClick ||
      ((result) => {
        // Navigate to KOL's account page
        navigate(`/accounts/${result.item.address}`);
      }),
  };
}
