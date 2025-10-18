export interface AutoSwapRequest {
  messageId: string;
  orderDirection: "buy" | "sell";
  tokenQuery: string;
  inputAmount: string;
}

export interface AutoSwapResponse {
  success: boolean;
  data?: {
    orderId: string;
    transactionHash?: string;
    status: string;
    message?: string;
  };
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface TokenInfo {
  name: string;
  title: string;
  symbol: string;
  contractAddress: string;
  unitDecimals: number;
  decimalsToShow: number;
}

export interface Position {
  token: TokenInfo;
  marketCap: number;
  priceNative: string;
  priceUsd: string;
  buyValueInSol: string;
  sellValueInSol: string;
  buyValueInUsd: string;
  sellValueInUsd: string;
  currentValueInSol: string;
  currentValueInUsd: string;
  avgPriceEntryInSol: string;
  avgPriceEntryInUsd: string;
  remainedTokens: string;
  profitLossInSol: string;
  profitLossInUsd: string;
  profitLossPercentInSol: string;
  profitLossPercentInUsd: string;
}

export interface SolWallet {
  confirmedBalance: string;
  key: {
    label: string;
  };
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string | null;
  defaultWalletId: string;
  referralId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositionsResponse {
  success: boolean;
  result: {
    solWallet: SolWallet;
    user: User;
    positions: Position[];
  };
}

export interface BuySettings {
  slippage: number;
  priorityFee: number;
  bribeAmount: number;
  maxFee: number | null;
  autoFee: boolean;
  mevMode: "off" | "reduced" | "secure";
  broadcastService: "normal" | "jito" | "nextblock" | "bloxroute" | "zeroslot";
  serviceConfig: string | null;
}

export interface SellSettings {
  slippage: number;
  priorityFee: number;
  bribeAmount: number;
  maxFee: number | null;
  autoFee: boolean;
  mevMode: "off" | "reduced" | "secure";
  broadcastService: "normal" | "jito" | "nextblock" | "bloxroute" | "zeroslot";
  serviceConfig: string | null;
}

export interface CopyTradeRequest {
  tag: string | null;
  targetWallet: string;
  buyPercentage: number | null;
  fixedBuyAmount: string | null;
  copySells: boolean;
  minBuyAmount: string | null;
  maxBuyAmount: string | null;
  minLiquidity: string | null;
  minMarketCap: string | null;
  maxMarketCap: string | null;
  allowDuplicateBuys: boolean;
  onlyRenounced: boolean;
  excludePumpfunTokens: boolean;
  mintBlackList: string[];
  buySettings: BuySettings;
  sellSettings: SellSettings;
}

export interface CopyTradeResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface CopyTradeOrder {
  id: number;
  tag: string;
  targetWallet: string;
  buyPercentage: number | null;
  fixedBuyAmount: string | null;
  copySells: boolean;
  minBuyAmount: string | null;
  maxBuyAmount: string | null;
  minLiquidity: string | null;
  minMarketCap: string | null;
  maxMarketCap: string | null;
  allowDuplicateBuys: boolean;
  onlyRenounced: boolean;
  excludePumpfunTokens: boolean;
  mintBlackList: string[];
  buySettings: BuySettings;
  sellSettings: SellSettings;
  createdAt: string;
  updatedAt: string;
  active?: boolean;
  status?: string;
}

export interface CopyTradeOrdersResponse {
  success: boolean;
  result?: {
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName?: string;
      profilePhoto?: string;
      walletAddress?: string;
    };
    copyTradeOrders: CopyTradeOrder[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    isLastPage: boolean;
  };
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface CloseCopyTradeRequest {
  copyTradeId: string;
}

export interface CloseCopyTradeResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface CloseAllCopyTradesRequest {
  // No parameters needed - user is identified by auth token
}

export interface CloseAllCopyTradesResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface PauseCopyTradeRequest {
  copyTradeId: string;
}

export interface PauseCopyTradeResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface PauseAllCopyTradesRequest {
  // No parameters needed - user is identified by auth token
}

export interface PauseAllCopyTradesResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface ResumeCopyTradeRequest {
  copyTradeId: string;
}

export interface ResumeCopyTradeResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface ResumeAllCopyTradesRequest {
  // No parameters needed - user is identified by auth token
}

export interface ResumeAllCopyTradesResponse {
  success: boolean;
  message?: string;
  error?:
    | {
        message: string;
        [key: string]: any;
      }
    | string;
}

export interface WalletToken {
  name: string;
  title: string;
  symbol: string;
  contractAddress: string;
  unitDecimals: number;
  decimalsToShow: number;
}

export interface WalletKey {
  label: string;
  selectedWallet: boolean;
}

export interface WalletBalance {
  id: string;
  parentId: string | null;
  confirmedBalance: string;
  address: string;
  token: WalletToken;
  key: WalletKey;
  confirmedBalanceUSD: string;
}

export interface UserPoint {
  points: number;
  totalUsdVolume: number;
  tier: string;
}

export interface UpdateBalanceResponse {
  success: boolean;
  result: WalletBalance[];
  userPoint: UserPoint;
}
