export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  fromCache: boolean;
}

export interface SocialLinks {
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
}

export interface Portfolio {
  totalValue: number;
  solanaBalance: number;
  // usdcBalance: number;
  winRate: number;
  avgDuration: string;
  topWin: number;
  topWinSol: number;
  totalVolumeSOL: number;
  totalVolume: number;
  totalPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  rank: number;
  rankChange: number;
}

export interface TrendingProject {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImage: string;
  lastTradeTimestamp: number;
  firstAddedTimestamp: number;
  totalTrades: number;
  marketCap: number;
  firstTradeMarketCap: number;
  marketCapGain: number;
  bracket: "high" | "mid" | "low";
  tradesCount: number;
  buyTrades: number;
  sellTrades: number;
  rank?: number;
  uniqueKOLs?: number;
  kolList?: string[];
}

export interface TrendingProjectsResponse {
  data: TrendingProject[];
  meta: TrendingProjectsMeta;
}

export interface TrendingProjectsMeta extends PaginationMeta {
  maxTokensPerBracket: number;
  maxTradesPerToken: number;
  filters: {
    tradeType: string | null;
    sortBy: string;
    sortOrder: string;
    bracket: string | null;
  };
  stats: {
    totalTokens: number;
    tokensWithTrades: number;
    totalTrades: number;
    totalBuyTrades: number;
    totalSellTrades: number;
  };
}

export interface OtherBalance {
  balance: number;
  contractAddress?: string;
  mint?: string;
  decimals: number;
  amount?: number;
  account?: string;
  frozen?: boolean;
  symbol?: string;
  name?: string;
  lastUpdated?: string;
  tokenInfo?: {
    name?: string;
    symbol?: string;
    image?: string;
  };
}

export interface Holdings {
  solanaBalance: number;
  // usdcBalance: number;
  OtherBalances?: OtherBalance[];
  otherBalances?: OtherBalance[];
}

export interface RecentTrade {
  tradeId: string;
  type: "buy" | "sell";
  tokenSymbol: string;
  tokenName: string;
  tokenImage: string;
  tokenAddress: string;
  amount: number;
  solAmount: number;
  price: number;
  timestamp: string;
  timeAgo: string;
  transactionHash: string;
  blockNumber: number;
}

export interface TokenPnL {
  tokenSymbol: string;
  tokenName: string;
  tokenImage: string;
  tokenAddress: string;
  totalBought: number;
  totalSold: number;
  tokensHeld: number;
  totalInvestment: number;
  realizedPnL: number;
  realizedPnLSOL: number;
  realizedRoi: number;
  totalSalesValue: number;
  totalSolBought: number;
  totalSolSold: number;
  firstTrade: string;
  lastTrade: string;
  totalDuration: string;
  status: "buy" | "sell";
  isActive: boolean;
}

export interface Performance {
  [key: string]: any;
}

export interface KOL {
  _id: string;
  kolId: string;
  username: string;
  profileImage: string;
  walletAddress: string;
  socialLinks: SocialLinks;
  portfolio: Portfolio;
  holdings: Holdings;
  recentTrades: RecentTrade[];
  tokenPnL: TokenPnL[];
  performance: Performance;
  isActive: boolean;
  isVerified: boolean;
  tier: string;
  createdAt: string;
  updatedAt: string;
  lastTradeAt: string;
  lastSyncAt: string;
}

export interface TradeData {
  username: string;
  tradeType: "buy" | "sell";
  amount: number | string;
  tokenName: string;
  price: number | string;
  tokenAddress: string;
  timestamp: string | number;
  tokenSymbol: string;
  walletAddress: string;
  transactionHash: string;
  profileImage: string;
  tokenImage: string;
  solSpent?: number | string | null;
}

export interface GetKOLsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetTradesParams {
  page?: number;
  limit?: number;
}

export interface LeaderboardKOL {
  _id?: string;
  walletAddress: string;
  username: string;
  profileImage: string;
  socialLinks: {
    telegram?: string;
    twitter?: string;
  };
  totalPnL?: number;
  totalPnLSOL?: number;
  totalVolume?: number;
  totalVolumeSOL?: number;
  topWin: number;
  topWinSol: number;
  totalTrades?: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  score: number;
  rank?: number;
  isVerified: boolean;
  timeframe?: string;
  calculatedAt?: string;
  updatedAt?: string;
}

export interface LatestTradeMeta {
  total: number;
  limit: number;
  walletAddress: string;
  totalAvailable: number;
}

export interface LatestTrade {
  tradeId: string;
  tradeType: "buy" | "sell";
  amount: number;
  price: number;
  tokenAddress: string;
  timestamp: string;
  transactionHash: string;
  walletAddress: string;
  username: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImage: string;
  profileImage: string;
  solSpent: number | string | null;
}

export interface LatestTradesResponse {
  trades: LatestTrade[];
}

export interface DefiTrade {
  tradeId: string;
  tradeType: "buy" | "sell";
  amount: number;
  price: number;
  tokenAddress: string;
  timestamp: string;
  transactionHash: string;
  walletAddress: string;
  username: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImage: string;
  profileImage: string;
  solSpent: number;
}
