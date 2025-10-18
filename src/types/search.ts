import { ReactNode } from "react";

export interface SearchResult<T = any> {
  id: string;
  item: T;
  matchedFields: string[];
  score: number;
}

export interface SearchConfig<T = any> {
  data: T[];
  searchFunction: (
    query: string
  ) => SearchResult<T>[] | Promise<SearchResult<T>[]>;

  placeholder?: string;
  icon?: string;
  className?: string;
  containerClassName?: string;
  resultsClassName?: string;

  minQueryLength?: number;
  maxResults?: number;
  debounceMs?: number;
  showResultsOnFocus?: boolean;

  renderResult?: (result: SearchResult<T>, index: number) => ReactNode;
  renderNoResults?: (query: string) => ReactNode;
  renderLoading?: () => ReactNode;

  onResultClick?: (result: SearchResult<T>) => void;
  onSearch?: (query: string, results: SearchResult<T>[]) => void;
  onClear?: () => void;
}

export interface SearchState<T = any> {
  query: string;
  results: SearchResult<T>[];
  isLoading: boolean;
  isOpen: boolean;
  selectedIndex: number;
  hasSearched: boolean;
}

export interface SearchFieldConfig {
  field: string;
  weight: number;
  exact?: boolean;
  fuzzy?: boolean;
}

export type SearchContextType =
  | "tokens"
  | "traders"
  | "kols"
  | "trades"
  | "leaderboard"
  | "general";

export interface TokenSearchItem {
  id: number;
  name: string;
  symbol: string;
  address: string;
  category: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  isVerified: boolean;
}

export interface TraderSearchItem {
  walletAddress: string;
  username: string;
  profileImage: string;
  verified: boolean;
  trades: any[];
}

export interface KOLSearchItem {
  walletAddress: string;
  username: string;
  profileImage: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
  };
  winRate: number;
  score: number;
  isVerified: boolean;
}

export interface TradeSearchItem {
  tradeId: string;
  tokenName: string;
  tokenSymbol: string;
  tradeType: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: string;
  walletAddress: string;
  username: string;
}

export interface SearchUtils {
  highlightText: (text: string, query: string) => ReactNode;
  formatResult: (
    result: SearchResult<any>,
    context: SearchContextType
  ) => ReactNode;
  getSearchScore: (
    item: any,
    query: string,
    fields: SearchFieldConfig[]
  ) => number;
}
