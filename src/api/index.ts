export { default as apiClient } from "./config";
export { default as KOLService } from "./kolService";
export { default as TradingService } from "./tradingService";
export * from "./config";
export * from "./kolService";
export * from "./tradingService";

export const getTokensByBracket = async (
  bracket: "low" | "mid" | "high",
  page: number = 1,
  limit: number = 20
) => {
  const response = await fetch(
    `https://tracker.cherrypump.com/tokens/all?bracket=${bracket}&page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

export const getAllTokens = async (page: number = 1, limit: number = 20) => {
  return getTokensByBracket("low", page, limit);
};
