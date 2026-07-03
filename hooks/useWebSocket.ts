"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTradeStore } from "@/store/useTradeStore";
import { DerivWebSocketClient, ConnectionState } from "@/services/websocket/client";

export function useWebSocket() {
  const clientRef = useRef<DerivWebSocketClient | null>(null);
  const { setPrice, selectedInstrument } = useTradeStore();

  const initializeWebSocket = useCallback(() => {
    if (clientRef.current) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://ws.binaryws.com/websockets/v3?app_id=1089";
    
    const client = new DerivWebSocketClient({
      endpoint: wsUrl,
      reconnect: true,
      reconnectInterval: 5000,
      heartbeatInterval: 30000,
    });

    client.on("connected", () => {
      console.log("WebSocket connected");
      if (selectedInstrument) {
        client.send({
          ticks: selectedInstrument.toLowerCase().replace(/\s+/g, "_"),
          subscribe: 1,
        });
      }
    });

    client.on("disconnected", () => {
      console.log("WebSocket disconnected");
    });

    client.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    client.on("message", (data) => {
      if (data && typeof data === "object" && "tick" in data) {
        const tick = (data as { tick: { quote: number } }).tick;
        if (tick && typeof tick.quote === "number") {
          setPrice(tick.quote);
        }
      }
    });

    clientRef.current = client;
    client.connect();
  }, [setPrice, selectedInstrument]);

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
    };
  }, [initializeWebSocket]);

  const connectionState = useCallback((): ConnectionState => {
    return clientRef.current?.connectionState() || ConnectionState.DISCONNECTED;
  }, []);

  const isConnected = useCallback((): boolean => {
    return clientRef.current?.connected() || false;
  }, []);

  return {
    connectionState,
    isConnected,
    client: clientRef.current,
  };
}
