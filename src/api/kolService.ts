import { apiClient } from "./config";
import {
  ApiResponse,
  KOL,
  TradeData,
  GetKOLsParams,
  GetTradesParams,
  LeaderboardKOL,
  TrendingProjectsMeta,
  TrendingProject,
} from "../types/api";

export class KOLService {
  static async getVerifiedKOLs(
    params: GetKOLsParams = {}
  ): Promise<ApiResponse<KOL[]>> {
    try {
      const response = await apiClient.get("/kols/verified/cache", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching verified KOLs:", error);
      throw error;
    }
  }

  static async getVerifiedKOLTrades(
    params: GetTradesParams = {}
  ): Promise<ApiResponse<TradeData[]>> {
    try {
      const response = await apiClient.get("/kols/verified/trades/cache", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching verified KOL trades:", error);
      throw error;
    }
  }

  static async getKOLByWallet(walletAddress: string): Promise<KOL | null> {
    try {
      const response = await apiClient.get("/kols/verified/all", {
        params: { walletAddress },
      });

      if (
        !response.data ||
        !response.data.success ||
        !response.data.data ||
        response.data.data.length === 0
      ) {
        console.warn("No KOL found for wallet address:", walletAddress);
        return null;
      }

      const kolData = response.data.data[0];

      // console.log("KOL data fetched successfully:", kolData);

      return kolData;
    } catch (error) {
      console.error("Error fetching KOL by wallet:", error);
      return null;
    }
  }

  static async getRecentTrades(): Promise<ApiResponse<TradeData[]>> {
    try {
      const response = await apiClient.get("/home");

      if (!response.data || !response.data.success) {
        console.warn("Invalid response structure for recent trades:", response);
        return { success: false, data: [] };
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching recent trades:", error);
      return { success: false, data: [] };
    }
  }

  static async getTopKOLs(): Promise<KOL[]> {
    try {
      const response = await this.getVerifiedKOLs();

      if (!response || !response.data || !Array.isArray(response.data)) {
        console.warn("Invalid response structure for top KOLs:", response);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching top KOLs:", error);
      return [];
    }
  }

  static async getLeaderboard(
    params: { page?: number; limit?: number; timeFilter?: string } = {}
  ): Promise<ApiResponse<LeaderboardKOL[]>> {
    try {
      const { timeFilter, ...otherParams } = params;

      let endpoint = "/kols/leaderboard";
      if (timeFilter) {
        switch (timeFilter) {
          case "1h":
            endpoint = "/kols/leaderboard/hourly";
            break;
          case "24h":
            endpoint = "/kols/leaderboard/daily";
            break;
          case "7d":
            endpoint = "/kols/leaderboard/weekly";
            break;
          case "30d":
            endpoint = "/kols/leaderboard/monthly";
            break;
          default:
            endpoint = "/kols/leaderboard";
            break;
        }
      }

      const response = await apiClient.get(endpoint, { params: otherParams });
      return response.data;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  }

  static async getLatestTrades(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get("/trades/latest");

      return response.data;
    } catch (error) {
      console.error("Error fetching latest trades:", error);
      throw error;
    }
  }

  static async getWalletTrades(
    walletAddress: string,
    page: number = 1,
    limit: number = 5
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(
        `/trades/wallet/token/latest?walletAddress=${walletAddress}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet trades:", error);
      throw error;
    }
  }

  static async getWalletLatestTrades(
    walletAddress: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(
        `/trades/wallet/latest?walletAddress=${walletAddress}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet latest trades:", error);
      throw error;
    }
  }

  static async getTokenPnL(
    walletAddress: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(
        `/kols/tokenpnl?walletAddress=${walletAddress}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching token PnL:", error);
      throw error;
    }
  }

  static async getHighestPnLTokens(
    walletAddress: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(
        `/kols/highest-pnl?walletAddress=${walletAddress}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching highest PnL tokens:", error);
      throw error;
    }
  }

  static async getLowestPnLTokens(
    walletAddress: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(
        `/kols/lowest-pnl?walletAddress=${walletAddress}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lowest PnL tokens:", error);
      throw error;
    }
  }

  static async searchKOLs(query: string): Promise<ApiResponse<KOL[]>> {
    try {
      const response = await apiClient.get("/kols/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching KOLs:", error);
      throw error;
    }
  }

  static async getTrendingProjects(
    params: {
      page?: number;
      limit?: number;
      timeframe?: string;
    } = {}
  ): Promise<ApiResponse<TrendingProject[]> & { meta?: TrendingProjectsMeta }> {
    try {
      const response = await apiClient.get("/trending", {
        params,
      });

      return {
        success: response.data.success,
        data: response.data.data || [],
        meta: response.data.meta,
      };
    } catch (error) {
      console.error("Error fetching trending projects:", error);
      return {
        success: false,
        data: [],
      };
    }
  }

  static async getTokenInfo(tokenAddress: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`/tokens/${tokenAddress}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching token info:", error);
      return {
        success: false,
        data: null,
      };
    }
  }
}

export default KOLService;
