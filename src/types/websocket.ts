import { TradeData } from "./api";

export interface WebSocketMessage {
  event: "subscribe_copytrades" | "new_trade" | "mc_update" | "error";
  data?: {
    trades: TradeData[];
  };
  tradeData?: {
    tradeDataToBroadcast: TradeData;
    mcUpdateData?: {
      tokenAddress: string;
      newMarketCap: number;
      marketCapGain: number;
      currentPrice: number;
      timestamp: number;
      workerId: string;
    };
  };
  message?: string;
  timestamp: number;
}
