export interface User {
  id: string;
  walletAddress: string; // This will be the SNIPER address for display
  solanaWalletAddress: string; // This will be the original Solana wallet address for API calls
  auth_date: number;
  username?: string;
  // Telegram-specific fields
  telegramId?: number;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  hash?: string;
  // Auth method tracking
  authMethod: "wallet" | "telegram";
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface GenerateWalletChallengeRequest {
  walletAddress: string;
}

export interface GenerateWalletChallengeResponse {
  success: boolean;
  result: {
    payload: {
      message: string;
      walletAddress: string;
      nonce: string;
      iat: number;
      exp: number;
      domain: string;
      version: string;
    };
  };
}

export interface WalletChallenge {
  message: string;
  walletAddress: string;
  nonce: string;
  iat: number;
  exp: number;
  domain: string;
  version: string;
}

export interface CreateTokenByWalletRequest {
  signature: string;
  challenge: WalletChallenge;
  refId?: string;
}

export interface CreateTokenByWalletResponse {
  success: boolean;
  result: {
    token: string;
  };
}

export interface VerifyTokenResponse {
  success: boolean;
  result: {
    accessToken: string;
    refreshToken: string;
    tokenId: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  result: {
    accessToken: string;
    refreshToken: string;
    tokenId: string;
  };
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  result: {
    message: string;
  };
}

// Auth State Types

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenId: string | null;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  loginWithWallet: (
    walletAddress: string,
    accessToken: string,
    refreshToken: string,
    tokenId: string
  ) => Promise<void>;
  loginWithTelegram: (
    telegramUser: TelegramUser,
    accessToken: string,
    refreshToken: string,
    tokenId: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  updateWalletAddress: (newWalletAddress: string) => void;
}
