"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

import { useNotificationStore } from "@/store/useNotificationStore";

import type { Trade, TradeType } from "../types/trade";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface TradingContextType {
    trades: Trade[];

    openTrade: (
        trade: Omit<Trade, "id" | "status">
    ) => void;

    executeTrade: (input: {
        marketId: string;
        tradeType: TradeType;
        direction: "BUY" | "SELL";
        stake: number;
        entry: number;
        duration: number;
    }) => void;

    updateMarketPrice: (
    marketId: string,
    price: number
) => void;

    closeTrade: (
        tradeId: string,
        result: "WIN" | "LOSS"
    ) => void;

    clearTrades: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const TradingContext =
    createContext<TradingContextType | null>(null);

/* =========================================================
   PROVIDER
========================================================= */

export function TradingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [trades, setTrades] = useState<Trade[]>([]);

    const { addNotification } = useNotificationStore();

    /* -----------------------------------------------------
       OPEN TRADE
    ----------------------------------------------------- */

    function openTrade(
        input: Omit<Trade, "id" | "status">
    ) {
        const newTrade: Trade = {
            ...input,
            id: crypto.randomUUID(),
            status: "OPEN",
        };

        setTrades((prev) => [newTrade, ...prev]);

        addNotification({
            title: "Trade Opened",
            message: `${newTrade.tradeType} trade opened.`,
            type: "trade",
            priority: "medium",
            read: false,
        });
    }

    /* -----------------------------------------------------
       EXECUTE TRADE
    ----------------------------------------------------- */

    function executeTrade(input: {
        marketId: string;
        tradeType: TradeType;
        direction: "BUY" | "SELL";
        stake: number;
        entry: number;
        duration: number;
    }) {
        const now = Date.now();

        const newTrade: Trade = {
            marketId: input.marketId,
            id: crypto.randomUUID(),

            direction: input.direction,

            tradeType: input.tradeType,

            stake: input.stake,

            entry: input.entry,

            currentPrice: input.entry,

            floatingProfit: 0,

            status: "OPEN",

            entryTime: now,

            expiryTime: now + input.duration * 1000,

            duration: input.duration,

            remainingSeconds: input.duration,
        };

        setTrades((prev) => [newTrade, ...prev]);

        addNotification({
            title: "Trade Opened",
            message: `${input.tradeType} trade opened.`,
            type: "trade",
            priority: "medium",
            read: false,
        });
    }

    /* -----------------------------------------------------
       UPDATE PRICE
    ----------------------------------------------------- */

    function updateMarketPrice(
    marketId: string,
    price: number
) {
    setTrades(prev =>
        prev.map(trade => {
            if (trade.marketId !== marketId) {
                return trade;
            }

            const floatingProfit =
                trade.direction === "BUY"
                    ? (price - trade.entry) * trade.stake
                    : (trade.entry - price) * trade.stake;

            return {
                ...trade,
                currentPrice: price,
                floatingProfit,
            };
        })
    );
}

    /* -----------------------------------------------------
       CLOSE TRADE
    ----------------------------------------------------- */

    function closeTrade(
        tradeId: string,
        result: "WIN" | "LOSS"
    ) {
        setTrades((prev) =>
            prev.map((trade) => {
                if (trade.id !== tradeId) return trade;

                return {
                    ...trade,
                    status: "CLOSED",
                    result,
                    profit:
                        result === "WIN"
                            ? trade.floatingProfit
                            : -Math.abs(trade.floatingProfit),
                    exit: trade.currentPrice,
                    exitTime: Date.now(),
                    remainingSeconds: 0,
                };
            })
        );

        addNotification({
            title:
                result === "WIN"
                    ? "Trade Won"
                    : "Trade Lost",

            message:
                result === "WIN"
                    ? "Your trade closed in profit."
                    : "Your trade closed at a loss.",

            type: "trade",

            priority:
                result === "WIN"
                    ? "low"
                    : "high",

            read: false,
        });
    }

    /* -----------------------------------------------------
       CLEAR
    ----------------------------------------------------- */

    function clearTrades() {
        setTrades([]);
    }

    /* =====================================================
       CONTEXT VALUE
    ===================================================== */

    const value = useMemo(
        () => ({
            trades,
            openTrade,
            executeTrade,
            updateMarketPrice,
            closeTrade,
            clearTrades,
        }),
        [trades]
    );

    return (
        <TradingContext.Provider value={value}>
            {children}
        </TradingContext.Provider>
    );
}

/* =========================================================
   HOOK
========================================================= */

export function useTrading() {
    const ctx = useContext(TradingContext);

    if (!ctx) {
        throw new Error(
            "useTrading must be used inside TradingProvider"
        );
    }

    return ctx;
}