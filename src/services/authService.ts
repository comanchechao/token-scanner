import axios from "axios";
import {
  VerifyTokenRequest,
  VerifyTokenResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  GenerateWalletChallengeRequest,
  GenerateWalletChallengeResponse,
  CreateTokenByWalletRequest,
  CreateTokenByWalletResponse,
  WalletChallenge,
} from "../types/auth";

const getAuthBaseURL = () => {
  return "/auth-api";
};

const authApiClient = axios.create({
  baseURL: getAuthBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    console.log("🔐 [Auth Service] Starting verifyToken process...", {
      tokenLength: token.length,
      timestamp: new Date().toISOString(),
    });

    try {
      const request: VerifyTokenRequest = { token };

      console.log("📤 [Auth Service] Sending verifyToken request:", {
        endpoint: "/auth/verifyToken",
        tokenLength: token.length,
      });

      const response = await authApiClient.post<VerifyTokenResponse>(
        "/auth/verifyToken",
        request
      );

      return response.data;
    } catch (error: any) {
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        console.error(
          "❌ [Auth Service] CORS/Network Error - Auth API not accessible:",
          {
            error: "CORS policy blocking request to auth API",
            endpoint: getAuthBaseURL() + "/auth/verifyToken",
            solution:
              "Backend needs to add CORS headers, or restart dev server if proxy was just added",
          }
        );
        throw new Error(
          "Authentication service unavailable (CORS/Network error)"
        );
      }

      console.error("❌ [Auth Service] VerifyToken failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        tokenLength: token.length,
      });
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    console.log("🔄 [Auth Service] Starting refreshToken process...", {
      refreshTokenLength: refreshToken.length,
      timestamp: new Date().toISOString(),
    });

    try {
      const request: RefreshTokenRequest = { refreshToken };

      console.log("📤 [Auth Service] Sending refreshToken request:", {
        endpoint: "/auth/refresh",
        refreshTokenLength: refreshToken.length,
      });

      const response = await authApiClient.post<RefreshTokenResponse>(
        "/auth/refresh",
        request
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ [Auth Service] RefreshToken failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        refreshTokenLength: refreshToken.length,
      });
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<LogoutResponse> {
    console.log("🚪 [Auth Service] Starting logout process...", {
      refreshTokenLength: refreshToken.length,
      timestamp: new Date().toISOString(),
    });

    try {
      const request: LogoutRequest = { refreshToken };

      console.log("📤 [Auth Service] Sending logout request:", {
        endpoint: "/auth/logoutToken",
        refreshTokenLength: refreshToken.length,
      });

      const response = await authApiClient.post<LogoutResponse>(
        "/auth/logoutToken",
        request
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ [Auth Service] Logout failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        refreshTokenLength: refreshToken.length,
      });
      throw error;
    }
  }

  async generateWalletChallenge(
    walletAddress: string
  ): Promise<GenerateWalletChallengeResponse> {
    console.log(
      "🔐 [Auth Service] Generating wallet challenge for address:",
      walletAddress
    );

    try {
      const request: GenerateWalletChallengeRequest = { walletAddress };

      console.log(
        "📤 [Auth Service] Sending generateWalletChallenge request:",
        {
          endpoint: "/auth/generateWalletChallenge",
          walletAddress,
        }
      );

      const response =
        await authApiClient.post<GenerateWalletChallengeResponse>(
          "/auth/generateWalletChallenge",
          request
        );

      console.log("  [Auth Service] Wallet challenge generated successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ [Auth Service] Failed to generate wallet challenge:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        walletAddress,
      });
      throw error;
    }
  }

  async createTokenByWallet(
    signature: string,
    challenge: WalletChallenge,
    refId?: string
  ): Promise<CreateTokenByWalletResponse> {
    console.log("🔐 [Auth Service] Creating token by wallet signature:", {
      walletAddress: challenge.walletAddress,
      signatureLength: signature.length,
      timestamp: new Date().toISOString(),
    });

    try {
      const request: CreateTokenByWalletRequest = {
        signature,
        challenge,
        ...(refId && { refId }),
      };

      console.log("📤 [Auth Service] Sending createTokenByWallet request:", {
        endpoint: "/auth/createTokenByWalletAddress",
        walletAddress: challenge.walletAddress,
        hasRefId: !!refId,
        requestPayload: {
          signature: signature.substring(0, 20) + "...",
          challenge: {
            message: challenge.message.substring(0, 50) + "...",
            walletAddress: challenge.walletAddress,
            nonce: challenge.nonce,
            iat: challenge.iat,
            exp: challenge.exp,
            domain: challenge.domain,
            version: challenge.version,
          },
          refId: refId || undefined,
        },
      });

      const response = await authApiClient.post<CreateTokenByWalletResponse>(
        "/auth/createTokenByWalletAddress",
        request
      );

      console.log("  [Auth Service] Token created successfully by wallet");
      return response.data;
    } catch (error: any) {
      console.error("❌ [Auth Service] Failed to create token by wallet:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        walletAddress: challenge.walletAddress,
      });
      throw error;
    }
  }
}

export default AuthService.getInstance();
