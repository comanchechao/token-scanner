// Centralized mock token data used across the application

export interface MockTokenData {
  name: string;
  symbol: string;
  address: string;
  image: string;
  price: string;
  priceChange24h: number;
  marketCap: string;
  marketCapRaw: number;
  marketCapChange24h: number;
  volume24h: string;
  volumeChange24h: number;
  liquidity: string;
  holders: string;
  holdersChange24h: number;
  totalSupply: string;
  circulatingSupply: string;
  fullyDilutedValuation: string;
  description: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  kolActivity: {
    totalKOLs: number;
    activeKOLs24h: number;
    totalInvested: string;
    averageHoldTime: string;
    topKOLs: Array<{
      name: string;
      avatar: string;
      balance: string;
      invested: string;
      pnl: string;
      pnlPercent: number;
    }>;
  };
  security: {
    score: number;
    checks: Array<{
      label: string;
      status: "pass" | "warn" | "fail";
      detail: string;
    }>;
  };
  // For trending data
  lastTradeTimestamp?: number;
  firstAddedTimestamp?: number;
  totalTrades?: number;
  firstTradeMarketCap?: number;
  marketCapGain?: number;
  bracket?: "high" | "mid" | "low";
  tradesCount?: number;
  buyTrades?: number;
  sellTrades?: number;
  rank?: number;
  uniqueKOLs?: number;
}

// Default/General mock token data
export const GENERAL_MOCK_TOKEN: MockTokenData = {
  name: "Neural Protocol",
  symbol: "NEURAL",
  address: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
  image: "/bonkKOLsLogo.webp",
  price: "$0.0847",
  priceChange24h: 24.5,
  marketCap: "$84.7M",
  marketCapRaw: 84700000,
  marketCapChange24h: 18.2,
  volume24h: "$12.3M",
  volumeChange24h: 45.8,
  liquidity: "$8.4M",
  holders: "47,832",
  holdersChange24h: 12.4,
  totalSupply: "1,000,000,000",
  circulatingSupply: "850,000,000",
  fullyDilutedValuation: "$99.6M",
  description:
    "Revolutionary AI-native infrastructure token powering secure, low-latency inference across decentralized on-chain agents. Built for developers who demand speed, security, and scalability.",
  socialLinks: {
    website: "https://neuralprotocol.io",
    twitter: "https://twitter.com/neuralprotocol",
    telegram: "https://t.me/neuralprotocol",
    discord: "https://discord.gg/neuralprotocol",
  },
  kolActivity: {
    totalKOLs: 127,
    activeKOLs24h: 45,
    totalInvested: "$2.8M",
    averageHoldTime: "18.5 days",
    topKOLs: [
      {
        name: "AlphaWhale",
        avatar: "/dogLogo.webp",
        balance: "47.2K",
        invested: "$3.2K",
        pnl: "$8.4K",
        pnlPercent: 162.5,
      },
      {
        name: "CryptoSensei",
        avatar: "/dogLogo.webp",
        balance: "31.8K",
        invested: "$2.7K",
        pnl: "$5.1K",
        pnlPercent: 88.9,
      },
      {
        name: "DeFiNinja",
        avatar: "/goldenCoinLogo.webp",
        balance: "28.4K",
        invested: "$2.4K",
        pnl: "$4.2K",
        pnlPercent: 75.0,
      },
    ],
  },
  security: {
    score: 85,
    checks: [
      {
        label: "Liquidity Locked",
        status: "pass",
        detail: "95% locked for 2 years",
      },
      {
        label: "Contract Verified",
        status: "pass",
        detail: "Audited by CertiK",
      },
      { label: "Mint Authority", status: "pass", detail: "Fully revoked" },
      { label: "Honeypot Check", status: "pass", detail: "No malicious code" },
      { label: "Tax Analysis", status: "warn", detail: "2% buy/sell tax" },
      { label: "Team Tokens", status: "warn", detail: "8% team allocation" },
    ],
  },
  // Trending data
  lastTradeTimestamp: Date.now() - 120000,
  firstAddedTimestamp: Date.now() - 3600000,
  totalTrades: 847,
  firstTradeMarketCap: 12300000,
  marketCapGain: 588.6,
  bracket: "high",
  tradesCount: 847,
  buyTrades: 523,
  sellTrades: 324,
  rank: 1,
  uniqueKOLs: 127,
};

// Collection of all mock tokens (can add more as needed)
export const MOCK_TOKENS: { [address: string]: MockTokenData } = {
  "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1": GENERAL_MOCK_TOKEN,
  "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12": {
    ...GENERAL_MOCK_TOKEN,
    name: "Agent Hub",
    symbol: "AGENT",
    address: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    image: "/logoKOL.png",
    marketCap: "$45.2M",
    marketCapRaw: 45200000,
    firstTradeMarketCap: 8900000,
    marketCapGain: 407.9,
    rank: 2,
    uniqueKOLs: 89,
    tradesCount: 634,
    buyTrades: 412,
    sellTrades: 222,
  },
  "0x5a4b3c2d1e0f9876543210fedcba0987654321ab": {
    ...GENERAL_MOCK_TOKEN,
    name: "SignalsX Pro",
    symbol: "SIGX",
    address: "0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
    image: "/cherryLogo.png",
    marketCap: "$23.1M",
    marketCapRaw: 23100000,
    firstTradeMarketCap: 7600000,
    marketCapGain: 203.9,
    bracket: "mid",
    rank: 3,
    uniqueKOLs: 67,
    tradesCount: 456,
    buyTrades: 289,
    sellTrades: 167,
  },
  "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890": {
    ...GENERAL_MOCK_TOKEN,
    name: "LatencyNet",
    symbol: "LNET",
    address: "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
    image: "/okxlogo.webp",
    marketCap: "$18.7M",
    marketCapRaw: 18700000,
    firstTradeMarketCap: 6500000,
    marketCapGain: 187.7,
    bracket: "mid",
    rank: 4,
    uniqueKOLs: 45,
    tradesCount: 312,
    buyTrades: 198,
    sellTrades: 114,
  },
  "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12": {
    ...GENERAL_MOCK_TOKEN,
    name: "DeepMind Token",
    symbol: "DEEP",
    address: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
    image: "/goldenCoinLogo.webp",
    marketCap: "$15.6M",
    marketCapRaw: 15600000,
    firstTradeMarketCap: 5200000,
    marketCapGain: 200.0,
    bracket: "mid",
    rank: 5,
    uniqueKOLs: 38,
    tradesCount: 289,
    buyTrades: 178,
    sellTrades: 111,
  },
  "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c": {
    ...GENERAL_MOCK_TOKEN,
    name: "Quantum AI",
    symbol: "QNTM",
    address: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    image: "/HosicoLogo.webp",
    marketCap: "$12.3M",
    marketCapRaw: 12300000,
    firstTradeMarketCap: 4100000,
    marketCapGain: 200.0,
    bracket: "low",
    rank: 6,
    uniqueKOLs: 29,
    tradesCount: 234,
    buyTrades: 145,
    sellTrades: 89,
  },
  "0x9f8e7d6c5b4a39281f0e1d2c3b4a5968778899aa": {
    ...GENERAL_MOCK_TOKEN,
    name: "Crypto Sensei",
    symbol: "SENSEI",
    address: "0x9f8e7d6c5b4a39281f0e1d2c3b4a5968778899aa",
    image: "/uselessLogo.webp",
    marketCap: "$9.8M",
    marketCapRaw: 9800000,
    firstTradeMarketCap: 3300000,
    marketCapGain: 197.0,
    bracket: "low",
    rank: 7,
    uniqueKOLs: 22,
    tradesCount: 198,
    buyTrades: 124,
    sellTrades: 74,
  },
  "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0": {
    ...GENERAL_MOCK_TOKEN,
    name: "Alpha Whale",
    symbol: "WHALE",
    address: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    image: "/dogLogo.webp",
    marketCap: "$7.6M",
    marketCapRaw: 7600000,
    firstTradeMarketCap: 2800000,
    marketCapGain: 171.4,
    bracket: "low",
    rank: 8,
    uniqueKOLs: 18,
    tradesCount: 167,
    buyTrades: 103,
    sellTrades: 64,
  },
};

// Helper function to get token data by address
export const getTokenData = (address: string): MockTokenData | null => {
  return MOCK_TOKENS[address] || null;
};

// Get all tokens as array
export const getAllTokens = (): MockTokenData[] => {
  return Object.values(MOCK_TOKENS);
};
