// Centralized mock accounts data used across the application
import { DefiTrade, KOL } from "../types/api";

export interface TokenPnLData {
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
  status: string;
  isActive: boolean;
  rank: number;
}

export interface UserMetrics {
  totalPnL: number;
  totalPnLSOL: number;
  totalTransactions: number;
  winningTransactions: number;
  losingTransactions: number;
  breakEvenTransactions: number;
  winRate: string;
  roiBuckets: {
    above500: number;
    range200to500: number;
    range50to200: number;
    range0to50: number;
    belowZero: number;
  };
}

export interface CopyTradeOrder {
  id: number;
  targetWallet: string;
  status: "active" | "paused" | "stopped";
  buyPercentage?: number | null;
  fixedBuyAmount?: number | null;
  copySells: boolean;
  tag?: string;
  createdAt: string;
}

// Mock Defi Trades Data
export const MOCK_DEFI_TRADES: DefiTrade[] = [
  {
    tradeId: "1",
    tradeType: "buy",
    amount: 1250000,
    price: 0.000234,
    tokenAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    transactionHash: "5YQz9WfVkNJq7YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "BonkKOLs",
    tokenSymbol: "BONK",
    tokenImage: "/bonkKOLsLogo.webp",
    profileImage: "/dogLogo.webp",
    solSpent: 2.93,
  },
  {
    tradeId: "2",
    tradeType: "buy",
    amount: 89000,
    price: 0.001234,
    tokenAddress: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    transactionHash: "9WfVkNJq7YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK5YQ",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "Agent Hub",
    tokenSymbol: "AGENT",
    tokenImage: "/logoKOL.png",
    profileImage: "/dogLogo.webp",
    solSpent: 109.83,
  },
  {
    tradeId: "3",
    tradeType: "sell",
    amount: 45000,
    price: 0.004567,
    tokenAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    transactionHash: "VkNJq7YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK9Wf5Y",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "BonkKOLs",
    tokenSymbol: "BONK",
    tokenImage: "/bonkKOLsLogo.webp",
    profileImage: "/dogLogo.webp",
    solSpent: 205.52,
  },
  {
    tradeId: "4",
    tradeType: "buy",
    amount: 670000,
    price: 0.000156,
    tokenAddress: "0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    transactionHash: "NJq7YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK9WfVk5Y",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "SignalsX Pro",
    tokenSymbol: "SIGX",
    tokenImage: "/cherryLogo.png",
    profileImage: "/dogLogo.webp",
    solSpent: 104.52,
  },
  {
    tradeId: "5",
    tradeType: "sell",
    amount: 123000,
    price: 0.002345,
    tokenAddress: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    transactionHash: "Jq7YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK9WfVkN5Y",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "Agent Hub",
    tokenSymbol: "AGENT",
    tokenImage: "/logoKOL.png",
    profileImage: "/dogLogo.webp",
    solSpent: 288.44,
  },
  {
    tradeId: "6",
    tradeType: "buy",
    amount: 234000,
    price: 0.000789,
    tokenAddress: "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    transactionHash: "7YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK9WfVkNJq5Y",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "LatencyNet",
    tokenSymbol: "LNET",
    tokenImage: "/okxlogo.webp",
    profileImage: "/dogLogo.webp",
    solSpent: 184.63,
  },
  {
    tradeId: "7",
    tradeType: "buy",
    amount: 456000,
    price: 0.000456,
    tokenAddress: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    transactionHash: "YqZJx7Lq6VKNJYx7LqK9YqZJYx7LqK9WfVkNJq75Y",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "DeepMind Token",
    tokenSymbol: "DEEP",
    tokenImage: "/goldenCoinLogo.webp",
    profileImage: "/dogLogo.webp",
    solSpent: 208.14,
  },
  {
    tradeId: "8",
    tradeType: "sell",
    amount: 345000,
    price: 0.001111,
    tokenAddress: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    transactionHash: "qZJx7Lq6VKNJYx7LqK9YqZJYx7LqK9WfVkNJq7Y5Y",
    walletAddress: "wallet1",
    username: "CryptoWhale",
    tokenName: "Quantum AI",
    tokenSymbol: "QNTM",
    tokenImage: "/HosicoLogo.webp",
    profileImage: "/dogLogo.webp",
    solSpent: 382.95,
  },
];

// Mock Token PnL Data
export const MOCK_TOKEN_PNL: TokenPnLData[] = [
  {
    tokenSymbol: "BONK",
    tokenName: "BonkKOLs",
    tokenImage: "/bonkKOLsLogo.webp",
    tokenAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
    totalBought: 2500000,
    totalSold: 1700000,
    tokensHeld: 800000,
    totalInvestment: 1234.56,
    realizedPnL: 4567.89,
    realizedPnLSOL: 234.45,
    realizedRoi: 175.4,
    totalSalesValue: 5701.45,
    totalSolBought: 585.23,
    totalSolSold: 819.68,
    firstTrade: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastTrade: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    totalDuration: "6 days",
    status: "active",
    isActive: true,
    rank: 1,
  },
  {
    tokenSymbol: "AGENT",
    tokenName: "Agent Hub",
    tokenImage: "/logoKOL.png",
    tokenAddress: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    totalBought: 890000,
    totalSold: 123000,
    tokensHeld: 767000,
    totalInvestment: 345.67,
    realizedPnL: 234.56,
    realizedPnLSOL: 12.34,
    realizedRoi: 67.8,
    totalSalesValue: 580.23,
    totalSolBought: 230.45,
    totalSolSold: 218.11,
    firstTrade: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastTrade: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    totalDuration: "12 days",
    status: "active",
    isActive: true,
    rank: 2,
  },
  {
    tokenSymbol: "SIGX",
    tokenName: "SignalsX Pro",
    tokenImage: "/cherryLogo.png",
    tokenAddress: "0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
    totalBought: 670000,
    totalSold: 450000,
    tokensHeld: 220000,
    totalInvestment: 567.89,
    realizedPnL: -123.45,
    realizedPnLSOL: -6.45,
    realizedRoi: -21.7,
    totalSalesValue: 444.44,
    totalSolBought: 234.56,
    totalSolSold: 228.11,
    firstTrade: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastTrade: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    totalDuration: "4 days",
    status: "closed",
    isActive: false,
    rank: 3,
  },
  {
    tokenSymbol: "LNET",
    tokenName: "LatencyNet",
    tokenImage: "/okxlogo.webp",
    tokenAddress: "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
    totalBought: 890000,
    totalSold: 0,
    tokensHeld: 890000,
    totalInvestment: 445.67,
    realizedPnL: 0,
    realizedPnLSOL: 0,
    realizedRoi: 0,
    totalSalesValue: 0,
    totalSolBought: 234.56,
    totalSolSold: 0,
    firstTrade: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastTrade: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    totalDuration: "2 days",
    status: "active",
    isActive: true,
    rank: 4,
  },
  {
    tokenSymbol: "DEEP",
    tokenName: "DeepMind Token",
    tokenImage: "/goldenCoinLogo.webp",
    tokenAddress: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
    totalBought: 560000,
    totalSold: 560000,
    tokensHeld: 0,
    totalInvestment: 234.56,
    realizedPnL: 789.01,
    realizedPnLSOL: 41.23,
    realizedRoi: 336.5,
    totalSalesValue: 1023.57,
    totalSolBought: 123.45,
    totalSolSold: 164.68,
    firstTrade: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastTrade: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    totalDuration: "2 days",
    status: "closed",
    isActive: false,
    rank: 5,
  },
];

// Mock User Metrics
export const MOCK_USER_METRICS: UserMetrics = {
  totalPnL: 5324.21,
  totalPnLSOL: 281.57,
  totalTransactions: 47,
  winningTransactions: 28,
  losingTransactions: 12,
  breakEvenTransactions: 7,
  winRate: "59.6",
  roiBuckets: {
    above500: 3,
    range200to500: 8,
    range50to200: 12,
    range0to50: 5,
    belowZero: 12,
  },
};

// Mock Copy Trade Orders
export const MOCK_COPY_TRADE_ORDERS: CopyTradeOrder[] = [
  {
    id: 1,
    targetWallet: "AlphaTrader.sol",
    status: "active",
    buyPercentage: 50,
    fixedBuyAmount: null,
    copySells: true,
    tag: "Follow Alpha Trader",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    targetWallet: "CryptoWhale.sol",
    status: "paused",
    buyPercentage: null,
    fixedBuyAmount: 2.5,
    copySells: false,
    tag: "Copy Whale",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    targetWallet: "DeFiNinja.sol",
    status: "active",
    buyPercentage: 30,
    fixedBuyAmount: null,
    copySells: true,
    tag: "Ninja Trader",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper function to get mock data with pagination
export const getMockDefiTrades = (
  page: number = 1,
  perPage: number = 4
): {
  trades: DefiTrade[];
  total: number;
  totalPages: number;
  currentPage: number;
} => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const total = MOCK_DEFI_TRADES.length;
  const totalPages = Math.ceil(total / perPage);

  return {
    trades: MOCK_DEFI_TRADES.slice(startIndex, endIndex),
    total,
    totalPages,
    currentPage: page,
  };
};

export const getMockTokenPnL = (
  page: number = 1,
  perPage: number = 5,
  filter: string = "mostRecent"
): {
  tokens: TokenPnLData[];
  total: number;
  totalPages: number;
  currentPage: number;
} => {
  let sortedTokens = [...MOCK_TOKEN_PNL];

  // Apply sorting based on filter
  if (filter === "highestPnl") {
    sortedTokens.sort((a, b) => b.realizedPnLSOL - a.realizedPnLSOL);
  } else if (filter === "lowestPnl") {
    sortedTokens.sort((a, b) => a.realizedPnLSOL - b.realizedPnLSOL);
  } else {
    // mostRecent - sort by lastTrade
    sortedTokens.sort(
      (a, b) =>
        new Date(b.lastTrade).getTime() - new Date(a.lastTrade).getTime()
    );
  }

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const total = sortedTokens.length;
  const totalPages = Math.ceil(total / perPage);

  return {
    tokens: sortedTokens.slice(startIndex, endIndex),
    total,
    totalPages,
    currentPage: page,
  };
};

// Mock KOL Data
export const MOCK_KOL_DATA: KOL = {
  _id: "mock-kol-id",
  kolId: "mock-kol-id",
  username: "CryptoWhale",
  profileImage: "/dogLogo.webp",
  walletAddress: "wallet1",
  socialLinks: {
    twitter: "https://twitter.com/CryptoWhale",
    telegram: "https://t.me/CryptoWhale",
    discord: "https://discord.gg/CryptoWhale",
    website: "https://cryptowhale.io",
  },
  portfolio: {
    totalValue: 50000,
    solanaBalance: 234.56,
    winRate: 65.4,
    avgDuration: "18h",
    topWin: 5000,
    topWinSol: 250,
    totalVolumeSOL: 5000,
    totalVolume: 250000,
    totalPnL: 10000,
    totalTrades: 47,
    winningTrades: 28,
    losingTrades: 12,
    rank: 1,
    rankChange: 0,
  },
  holdings: {
    solanaBalance: 234.56,
    OtherBalances: [
      {
        balance: 1250000,
        contractAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
        decimals: 9,
        symbol: "BONK",
        name: "BonkKOLs",
        tokenInfo: {
          name: "BonkKOLs",
          symbol: "BONK",
          image: "/bonkKOLsLogo.webp",
        },
      },
      {
        balance: 890000,
        contractAddress: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
        decimals: 9,
        symbol: "AGENT",
        name: "Agent Hub",
        tokenInfo: {
          name: "Agent Hub",
          symbol: "AGENT",
          image: "/logoKOL.png",
        },
      },
    ],
  },
  recentTrades: [],
  tokenPnL: [],
  performance: {},
  isActive: true,
  isVerified: true,
  tier: "diamond",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastTradeAt: new Date().toISOString(),
  lastSyncAt: new Date().toISOString(),
};

// Export all mock data
export const MOCK_ACCOUNTS_DATA = {
  defiTrades: MOCK_DEFI_TRADES,
  tokenPnL: MOCK_TOKEN_PNL,
  userMetrics: MOCK_USER_METRICS,
  copyTradeOrders: MOCK_COPY_TRADE_ORDERS,
  kolData: MOCK_KOL_DATA,
};
