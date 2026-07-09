"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import { useNotificationStore } from "@/store/useNotificationStore";

import type { Trade, ContractType } from "../types/trade";
import type { UUID } from "../types/common";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface TradingContextType {
    trades: Trade[];

    openTrade: (
        trade: Omit<
            Trade,
            "id" | "status" | "createdAt" | "updatedAt"
        >
    ) => void;

    executeTrade: (input: {
        marketId: UUID;
        contract: ContractType;
        duration: number;
        stake: number;
        entryPrice: number;
    }) => void;

    updateMarketPrice: (
        marketId: UUID,
        price: number
    ) => void;

    closeTrade: (
        tradeId: UUID,
        result: "WON" | "LOST"
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
    children
}: {
    children: React.ReactNode;
}) {

    const [trades, setTrades] = useState<Trade[]>([]);

    const { addNotification } =
        useNotificationStore();

    /* -----------------------------------------------------
       OPEN TRADE
    ----------------------------------------------------- */

    function openTrade(
        input: Omit<
            Trade,
            "id" | "status" | "createdAt" | "updatedAt"
        >
    ) {

        const newTrade: Trade = {

            ...input,

            id: crypto.randomUUID(),

            status: "OPEN",

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString()

        };

        setTrades(prev => [newTrade, ...prev]);

        addNotification({

            title: "Trade Opened",

            message: `${newTrade.contract} contract opened.`,

            type: "trade",

            priority: "medium",

            read: false

        });

    }

    /* -----------------------------------------------------
       EXECUTE TRADE
    ----------------------------------------------------- */

    function executeTrade(input: {
        marketId: UUID;
        contract: ContractType;
        duration: number;
        stake: number;
        entryPrice: number;
    }) {

        const newTrade: Trade = {

            id: crypto.randomUUID(),

            marketId: input.marketId,

            contract: input.contract,

            duration: input.duration,

            stake: input.stake,

            payout: 80,

            entryPrice: input.entryPrice,

            currentPrice: input.entryPrice,

            status: "OPEN",

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString()

        };

        setTrades(prev => [newTrade, ...prev]);

        addNotification({

            title: "Trade Opened",

            message: `${input.contract} contract opened.`,

            type: "trade",

            priority: "medium",

            read: false

        });

    }

    /* -----------------------------------------------------
       MARKET PRICE UPDATE
    ----------------------------------------------------- */

    function updateMarketPrice(
        marketId: UUID,
        price: number
    ) {

        setTrades(prev =>
            prev.map(trade => {

                if (trade.marketId !== marketId) {
                    return trade;
                }

                return {

                    ...trade,

                    currentPrice: price,

                    updatedAt:
                        new Date().toISOString()

                };

            })
        );

    }

    /* -----------------------------------------------------
       CLOSE TRADE
    ----------------------------------------------------- */

    function closeTrade(
        tradeId: UUID,
        result: "WON" | "LOST"
    ) {

        setTrades(prev =>
            prev.map(trade =>

                trade.id === tradeId

                    ? {

                          ...trade,

                          status: result,

                          updatedAt:
                              new Date().toISOString()

                      }

                    : trade

            )
        );

        addNotification({

            title:
                result === "WON"
                    ? "Trade Won"
                    : "Trade Lost",

            message:
                result === "WON"
                    ? "Your trade closed in profit."
                    : "Your trade closed at a loss.",

            type: "trade",

            priority:
                result === "WON"
                    ? "low"
                    : "high",

            read: false

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
            clearTrades
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