import { useState, useEffect, useRef, useCallback } from "react";

const WEBSOCKET_URL = "wss://tracker.cherrypump.com/ws";

interface WebSocketOptions {
  subscribeCopyTrades?: boolean;
  subscribeMarketCapUpdates?: boolean;
}

export const useWebSocket = <T>(
  onMessage: (data: T) => void,
  options: WebSocketOptions = {
    subscribeCopyTrades: true,
    subscribeMarketCapUpdates: false,
  }
) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second

  // Use ref to store the callback to prevent unnecessary reconnections
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  // Store options in ref to avoid dependency changes
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // console.log("WebSocket message received:", data);
        onMessageRef.current(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        console.log("Raw message data:", event.data);
      }
    },
    [] // No dependencies since we use ref
  );

  const connect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;

      // Subscribe based on options
      if (optionsRef.current.subscribeCopyTrades) {
        socket.send(JSON.stringify({ event: "subscribe_copytrades" }));
      }

      if (optionsRef.current.subscribeMarketCapUpdates) {
        socket.send(JSON.stringify({ event: "subscribe_mc_updates" }));
      }
    };

    socket.onmessage = handleMessage;

    socket.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      setIsConnected(false);

      if (
        event.code !== 1000 &&
        reconnectAttemptsRef.current < maxReconnectAttempts
      ) {
        const delay =
          baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${
            reconnectAttemptsRef.current + 1
          }/${maxReconnectAttempts})`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.error("Max reconnection attempts reached. Giving up.");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
  }, [handleMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  return { isConnected };
};
