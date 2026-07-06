"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import type { Trade } from "../types/trade";
import type { UUID } from "../types/common";
import type { ContractType } from "../types/trade";

/* =========================================================
   CONTEXT
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
   CONTEXT INIT
========================================================= */

const TradingContext = createContext<TradingContextType | null>(null);

/* =========================================================
   PROVIDER
========================================================= */

export function TradingProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [trades, setTrades] = useState<Trade[]>([]);

    /* ---------------- OPEN TRADE ---------------- */

    function openTrade(
        input: Omit<Trade, "id" | "status" | "createdAt" | "updatedAt">
    ) {
        const newTrade: Trade = {
            ...input,
            id: crypto.randomUUID(),
            status: "OPEN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setTrades(prev => [newTrade, ...prev]);
    }
    /* ---------------- EXECUTE TRADE ---------------- */

function executeTrade(input: {
    marketId: string;
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
        payout: 80, // default payout (can later be dynamic)
        entryPrice: input.entryPrice,
        currentPrice: input.entryPrice,
        status: "OPEN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    setTrades(prev => [newTrade, ...prev]);
}

    /* =====================================================
       🔥 CORE ENGINE: MARKET → TRADE SYNC
    ===================================================== */

    function updateMarketPrice(marketId: UUID, price: number) {

        setTrades(prev =>
            prev.map(t => {

                if (t.marketId !== marketId) return t;

                const updated = {
                    ...t,
                    currentPrice: price,
                    updatedAt: new Date().toISOString()
                };

                return updated;
            })
        );
    }

    /* ---------------- CLOSE TRADE ---------------- */

    function closeTrade(tradeId: UUID, result: "WON" | "LOST") {

        setTrades(prev =>
            prev.map(t =>
                t.id === tradeId
                    ? {
                        ...t,
                        status: result,
                        updatedAt: new Date().toISOString()
                    }
                    : t
            )
        );
    }

    function clearTrades() {
        setTrades([]);
    }

    /* =========================================================
       VALUE
    ========================================================= */

    const value = useMemo(() => ({
        trades,
        openTrade,
        updateMarketPrice,
        closeTrade,
        executeTrade,
        clearTrades
    }), [trades]);

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
        throw new Error("useTrading must be used inside TradingProvider");
    }

    return ctx;
}