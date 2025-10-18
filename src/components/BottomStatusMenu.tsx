import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useWebSocket } from "../hooks/useWebSocket";
import { WebSocketMessage } from "../types/websocket";

const BottomStatusMenu: React.FC = React.memo(() => {
  const [solPrice, setSolPrice] = useState<number | null>(null);

  const handleWebSocketMessage = () => {};

  const { isConnected } = useWebSocket<WebSocketMessage>(
    handleWebSocketMessage
  );

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full z-40">
      <div className="flex items-center space-x-3 backdrop-blur-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.15] hover:border-main-accent/40 px-6 py-2  transition-all duration-500 shadow-2xl shadow-black/20">
        {/* SOL Price */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8   rounded-xl flex items-center justify-center">
            <Icon
              icon="token-branded:solana"
              className="text-main-bg w-4 h-4"
            />
          </div>
          <span className="font-tiktok text-xs text-main-text font-medium">
            SOL
          </span>
          <span className="font-tiktok text-xs text-main-accent font-semibold">
            ${solPrice ? solPrice.toFixed(2) : "---"}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

        {/* WebSocket Status */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isConnected
                  ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                  : "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              }`}
            >
              {isConnected && (
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40"></div>
              )}
            </div>
          </div>
          <span className="font-tiktok text-xs text-main-light-text">
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default BottomStatusMenu;
