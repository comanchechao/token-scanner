import axios from "axios";
import {
  AutoSwapRequest,
  AutoSwapResponse,
  PositionsResponse,
  CopyTradeRequest,
  CopyTradeResponse,
  CopyTradeOrdersResponse,
  CloseCopyTradeRequest,
  CloseCopyTradeResponse,
  CloseAllCopyTradesRequest,
  CloseAllCopyTradesResponse,
  PauseCopyTradeRequest,
  PauseCopyTradeResponse,
  PauseAllCopyTradesRequest,
  PauseAllCopyTradesResponse,
  ResumeCopyTradeRequest,
  ResumeCopyTradeResponse,
  ResumeAllCopyTradesRequest,
  ResumeAllCopyTradesResponse,
  UpdateBalanceResponse,
} from "../types/trading";

const getTradingBaseURL = () => {
  return "https://sniper.cherrybot.ai";
};

const tradingApiClient = axios.create({
  baseURL: getTradingBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

let isTradingRefreshing = false;
let tradingFailedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processTradingQueue = (error: any, token: string | null = null) => {
  tradingFailedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  tradingFailedQueue = [];
};

tradingApiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("🔒 [Trading Service] Adding auth token to request:", {
        endpoint: config.url,
        method: config.method,
        hasToken: !!accessToken,
      });
    } else {
      console.warn(
        "⚠️ [Trading Service] No access token available for request:",
        {
          endpoint: config.url,
          method: config.method,
        }
      );
    }
    return config;
  },
  (error) => {
    console.error("❌ [Trading Service] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

tradingApiClient.interceptors.response.use(
  (response) => {
    console.log("✅ [Trading Service] Response received:", {
      endpoint: response.config.url,
      status: response.status,
      success: response.data?.success,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(
        "🔄 [Trading Service] Access token expired, attempting refresh..."
      );

      if (isTradingRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            tradingFailedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return tradingApiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isTradingRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          console.log(
            "🔄 [Trading Service] Using refresh token to get new access token..."
          );

          const { default: authService } = await import(
            "../services/authService"
          );
          const result = await authService.refreshToken(refreshToken);

          if (result.success) {
            console.log(
              "✅ [Trading Service] Token refresh successful, retrying original request"
            );

            const {
              accessToken,
              refreshToken: newRefreshToken,
              tokenId,
            } = result.result;

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", newRefreshToken);
            localStorage.setItem("token_id", tokenId);

            processTradingQueue(null, accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            window.dispatchEvent(
              new CustomEvent("tokenRefreshed", {
                detail: { accessToken, refreshToken: newRefreshToken, tokenId },
              })
            );

            return tradingApiClient(originalRequest);
          } else {
            throw new Error("Refresh token response was not successful");
          }
        } catch (refreshError: any) {
          console.error(
            "❌ [Trading Service] Refresh token failed:",
            refreshError.message
          );

          processTradingQueue(refreshError, null);

          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_id");
          localStorage.removeItem("telegram_auth_user");

          window.dispatchEvent(
            new CustomEvent("authError", {
              detail: { error: "Token refresh failed", shouldLogout: true },
            })
          );

          console.log(
            "🔄 [Trading Service] Cleared auth data, user needs to login again"
          );
        } finally {
          isTradingRefreshing = false;
        }
      } else {
        console.log(
          "⚠️ [Trading Service] No refresh token available, user needs to login"
        );

        processTradingQueue(new Error("No refresh token available"), null);
        isTradingRefreshing = false;

        // Trigger logout event
        window.dispatchEvent(
          new CustomEvent("authError", {
            detail: { error: "No refresh token available", shouldLogout: true },
          })
        );
      }
    }

    console.error("❌ [Trading Service] Response error:", {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

class TradingService {
  private static instance: TradingService;

  public static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  async executeAutoSwap(request: AutoSwapRequest): Promise<AutoSwapResponse> {
    console.log("🔄 [Trading Service] Starting autoSwap process...", {
      direction: request.orderDirection,
      tokenQuery: request.tokenQuery,
      amount: request.inputAmount,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("📤 [Trading Service] Sending autoSwap request:", {
        endpoint: getTradingBaseURL() + "/api/v1/order/autoSwap/new",
        payload: request,
      });

      const response = await tradingApiClient.post<AutoSwapResponse>(
        "/api/v1/order/autoSwap/new",
        request
      );

      console.log("✅ [Trading Service] AutoSwap request successful:", {
        success: response.data.success,
        orderId: response.data.data?.orderId,
      });

      if (
        !response.data.success &&
        response.data.error &&
        typeof response.data.error === "object" &&
        response.data.error.message === "Access token has expired"
      ) {
        console.error("🔑 [Trading Service] Access token has expired");
        throw new Error("Access token has expired");
      }

      if (
        !response.data.success &&
        response.data.error &&
        typeof response.data.error === "object" &&
        response.data.error.message === "Not enough balance"
      ) {
        console.error("💰 [Trading Service] Not enough balance");
        throw new Error("Not enough balance");
      }

      return response.data;
    } catch (error: any) {
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        console.error(
          "❌ [Trading Service] CORS/Network Error - Trading API not accessible:",
          {
            error: "CORS policy blocking request to Cherry Sniper API",
            endpoint: getTradingBaseURL() + "/api/v1/order/autoSwap/new",
            solution:
              "Ensure CORS is enabled on Cherry Sniper API or check network connectivity",
          }
        );
        throw new Error(
          "Cherry Sniper service unavailable (CORS/Network error)"
        );
      }

      if (
        (error.response?.data?.error &&
          typeof error.response?.data?.error === "object" &&
          error.response?.data?.error.message === "Access token has expired") ||
        error.message === "Access token has expired"
      ) {
        console.error("🔑 [Trading Service] Access token has expired");
        throw new Error("Access token has expired");
      }

      // Check for not enough balance error in error response
      if (
        (error.response?.data?.error &&
          typeof error.response?.data?.error === "object" &&
          error.response?.data?.error.message === "Not enough balance") ||
        error.message === "Not enough balance"
      ) {
        console.error("💰 [Trading Service] Not enough balance");
        throw new Error("Not enough balance");
      }

      console.error("❌ [Trading Service] AutoSwap failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });
      throw error;
    }
  }

  async buyToken(
    messageId: string,
    tokenAddress: string,
    amount: number | string
  ): Promise<AutoSwapResponse> {
    const request: AutoSwapRequest = {
      messageId,
      orderDirection: "buy",
      tokenQuery: tokenAddress,
      inputAmount: typeof amount === "string" ? amount : amount.toString(),
    };

    return this.executeAutoSwap(request);
  }

  async sellToken(
    messageId: string,
    tokenAddress: string,
    amount: number | string
  ): Promise<AutoSwapResponse> {
    const request: AutoSwapRequest = {
      messageId,
      orderDirection: "sell",
      tokenQuery: tokenAddress,
      inputAmount: typeof amount === "string" ? amount : amount.toString(),
    };

    return this.executeAutoSwap(request);
  }

  async getPositions(
    solanaWalletAddress: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PositionsResponse> {
    console.log("📊 [Trading Service] Fetching user positions...", {
      pageNumber,
      pageSize,
      timestamp: new Date().toISOString(),
    });

    // Auth headers handled automatically by interceptor
    console.log("🔑 [Trading Service] Auth will be handled by interceptor");

    // Log the exact request params
    const requestParams = {
      pageNumber,
      pageSize,
      authorizedWallet: solanaWalletAddress,
    };

    console.log("📤 [Trading Service] API request details:", {
      url: getTradingBaseURL() + "/api/v1/user/getPositions",
      params: requestParams,
      // headers: authHeaders, // No longer needed
    });

    try {
      const response = await tradingApiClient.get<PositionsResponse>(
        `/api/v1/user/getPositions`,
        {
          params: requestParams,
          // Auth headers handled automatically by interceptor
        }
      );

      console.log("✅ [Trading Service] Positions fetched successfully:", {
        success: response.data.success,
        positionsCount: response.data.result?.positions?.length || 0,
        solBalance: response.data.result?.solWallet?.confirmedBalance,
        userId: response.data.result?.user?.id, // Log what the API returned
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Failed to fetch positions:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        fullResponse: error.response, // Full response for debugging
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      throw error;
    }
  }
  async updateBalance(): Promise<UpdateBalanceResponse> {
    console.log("📤 [Trading Service] API request details:", {
      url: getTradingBaseURL() + "/api/v1/wallet/updateBalance",
    });

    try {
      const response = await tradingApiClient.post<UpdateBalanceResponse>(
        `/api/v1/wallet/updateBalance`
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Failed to fetch positions:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        fullResponse: error.response, // Full response for debugging
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      throw error;
    }
  }
  async createCopyTrade(request: CopyTradeRequest): Promise<CopyTradeResponse> {
    console.log("🔄 [Trading Service] Starting copy trade creation...", {
      targetWallet: request.targetWallet,
      tag: request.tag,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("📤 [Trading Service] Sending copy trade request:", {
        endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/create",
        payload: request,
      });

      const response = await tradingApiClient.post<CopyTradeResponse>(
        "/api/v1/order/copyTrade/new",
        request
      );

      console.log("✅ [Trading Service] Copy trade creation successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Copy trade creation failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 400) {
        throw new Error("Invalid copy trade request parameters");
      }

      if (error.response?.status === 422) {
        throw new Error("Validation error in copy trade settings");
      }

      throw error;
    }
  }

  async getCopyTradeOrders(
    solanaWalletAddress: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<CopyTradeOrdersResponse> {
    console.log("📊 [Trading Service] Fetching copy trade orders...", {
      solanaWalletAddress,
      pageNumber,
      pageSize,
      timestamp: new Date().toISOString(),
    });

    // Log the exact request params
    const requestParams = {
      pageNumber,
      pageSize,
      authorizedWallet: solanaWalletAddress,
    };

    console.log("📤 [Trading Service] API request details:", {
      url: getTradingBaseURL() + "/api/v1/order/copyTrade/orders",
      params: requestParams,
    });

    try {
      const response = await tradingApiClient.get<CopyTradeOrdersResponse>(
        `/api/v1/order/copyTrade/orders`,
        {
          params: requestParams,
        }
      );

      console.log(
        "✅ [Trading Service] Copy trade orders fetched successfully:",
        {
          success: response.data.success,
          ordersCount: response.data.result?.copyTradeOrders?.length || 0,
          totalCount: response.data.result?.totalCount || 0,
          pageNumber: response.data.result?.pageNumber || 1,
          totalPages: response.data.result?.totalPages || 1,
          requestedIdentifier: solanaWalletAddress,
          responseUserId: response.data.result?.user?.id,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Failed to fetch copy trade orders:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        requestedIdentifier: solanaWalletAddress,
        fullResponse: error.response,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 400) {
        throw new Error("Invalid request parameters");
      }

      if (error.response?.status === 404) {
        throw new Error("User not found");
      }

      throw error;
    }
  }

  async closeCopyTrade(
    request: CloseCopyTradeRequest
  ): Promise<CloseCopyTradeResponse> {
    console.log("🔄 [Trading Service] Closing copy trade...", {
      copyTradeId: request.copyTradeId,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("📤 [Trading Service] Sending close copy trade request:", {
        endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/close",
        payload: request,
      });

      const response = await tradingApiClient.post<CloseCopyTradeResponse>(
        "/api/v1/order/copyTrade/close",
        request
      );

      console.log("✅ [Trading Service] Close copy trade successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Close copy trade failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 400) {
        throw new Error("Copy trade not found or does not belong to user");
      }

      if (error.response?.status === 404) {
        throw new Error("Copy trade not found");
      }

      throw error;
    }
  }

  async closeAllCopyTrades(
    request: CloseAllCopyTradesRequest
  ): Promise<CloseAllCopyTradesResponse> {
    console.log("🔄 [Trading Service] Closing all copy trades...", {
      timestamp: new Date().toISOString(),
    });

    try {
      console.log(
        "📤 [Trading Service] Sending close all copy trades request:",
        {
          endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/closeAll",
          payload: request,
        }
      );

      const response = await tradingApiClient.post<CloseAllCopyTradesResponse>(
        "/api/v1/order/copyTrade/closeAll",
        request
      );

      console.log("✅ [Trading Service] Close all copy trades successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Close all copy trades failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 404) {
        throw new Error("User not found");
      }

      throw error;
    }
  }

  async pauseCopyTrade(
    request: PauseCopyTradeRequest
  ): Promise<PauseCopyTradeResponse> {
    console.log("⏸️ [Trading Service] Pausing copy trade...", {
      copyTradeId: request.copyTradeId,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("📤 [Trading Service] Sending pause copy trade request:", {
        endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/pause",
        payload: request,
      });

      const response = await tradingApiClient.post<PauseCopyTradeResponse>(
        "/api/v1/order/copyTrade/pause",
        request
      );

      console.log("✅ [Trading Service] Pause copy trade successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Pause copy trade failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 400) {
        throw new Error("Copy trade not found or does not belong to user");
      }

      if (error.response?.status === 404) {
        throw new Error("Copy trade not found");
      }

      throw error;
    }
  }

  async pauseAllCopyTrades(
    request: PauseAllCopyTradesRequest
  ): Promise<PauseAllCopyTradesResponse> {
    console.log("⏸️ [Trading Service] Pausing all copy trades...", {
      timestamp: new Date().toISOString(),
    });

    try {
      console.log(
        "📤 [Trading Service] Sending pause all copy trades request:",
        {
          endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/pauseAll",
          payload: request,
        }
      );

      const response = await tradingApiClient.post<PauseAllCopyTradesResponse>(
        "/api/v1/order/copyTrade/pauseAll",
        request
      );

      console.log("✅ [Trading Service] Pause all copy trades successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Pause all copy trades failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 404) {
        throw new Error("User not found");
      }

      throw error;
    }
  }

  async resumeCopyTrade(
    request: ResumeCopyTradeRequest
  ): Promise<ResumeCopyTradeResponse> {
    console.log("▶️ [Trading Service] Resuming copy trade...", {
      copyTradeId: request.copyTradeId,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("📤 [Trading Service] Sending resume copy trade request:", {
        endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/resume",
        payload: request,
      });

      const response = await tradingApiClient.post<ResumeCopyTradeResponse>(
        "/api/v1/order/copyTrade/resume",
        request
      );

      console.log("✅ [Trading Service] Resume copy trade successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Resume copy trade failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 400) {
        throw new Error("Copy trade not found or does not belong to user");
      }

      if (error.response?.status === 404) {
        throw new Error("Copy trade not found");
      }

      throw error;
    }
  }

  async resumeAllCopyTrades(
    request: ResumeAllCopyTradesRequest
  ): Promise<ResumeAllCopyTradesResponse> {
    console.log("▶️ [Trading Service] Resuming all copy trades...", {
      timestamp: new Date().toISOString(),
    });

    try {
      console.log(
        "📤 [Trading Service] Sending resume all copy trades request:",
        {
          endpoint: getTradingBaseURL() + "/api/v1/order/copyTrade/resumeAll",
          payload: request,
        }
      );

      const response = await tradingApiClient.post<ResumeAllCopyTradesResponse>(
        "/api/v1/order/copyTrade/resumeAll",
        request
      );

      console.log("✅ [Trading Service] Resume all copy trades successful:", {
        success: response.data.success,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [Trading Service] Resume all copy trades failed:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: request,
      });

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        throw new Error("Unable to connect to Cherry Sniper service");
      }

      if (error.response?.status === 401) {
        throw new Error("Access token has expired");
      }

      if (error.response?.status === 404) {
        throw new Error("User not found");
      }

      throw error;
    }
  }
}

export default TradingService.getInstance();
