"use client";
import { useTrading } from "../contexts/TradingContext";

import { useEffect, useState, useRef } from "react";
import type { Market } from "../types/market";


/* =========================================================
   EXTENDED MARKET TYPE (UI-SAFE ENRICHMENT)
========================================================= */

type MarketWithTick = Market & {
    bid: number;
    ask: number;
    spread: number;
    high: number;
    low: number;
    volume: number;

    previousPrice?: number;
    tickDirection?: "up" | "down" | "flat";
};

/* =========================================================
   HOOK
========================================================= */

export function useMarkets() {
    const { updateMarketPrice } = useTrading();
    const [markets, setMarkets] = useState<MarketWithTick[]>([]);
    const [loading, setLoading] = useState(true);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    /* ---------------- INITIAL LOAD ---------------- */

    useEffect(() => {
        const now = new Date().toISOString();

        const initial: MarketWithTick[] = [
            { id: "R_10", name: "Volatility 10", symbol: "R_10", category: "Volatility", favorite: false, price: 1200, change: 0, isOpen: true, createdAt: now, updatedAt: now, bid: 1199.5, ask: 1200.5, spread: 1, high: 1200, low: 1200, volume: 0 },
            { id: "R_25", name: "Volatility 25", symbol: "R_25", category: "Volatility", favorite: false, price: 2400, change: 0, isOpen: true, createdAt: now, updatedAt: now, bid: 2399.5, ask: 2400.5, spread: 1, high: 2400, low: 2400, volume: 0 },
            { id: "R_50", name: "Volatility 50", symbol: "R_50", category: "Volatility", favorite: false, price: 3600, change: 0, isOpen: true, createdAt: now, updatedAt: now, bid: 3599.5, ask: 3600.5, spread: 1, high: 3600, low: 3600, volume: 0 },
            { id: "R_75", name: "Volatility 75", symbol: "R_75", category: "Volatility", favorite: false, price: 4800, change: 0, isOpen: true, createdAt: now, updatedAt: now, bid: 4799.5, ask: 4800.5, spread: 1, high: 4800, low: 4800, volume: 0 },
            { id: "R_100", name: "Volatility 100", symbol: "R_100", category: "Volatility", favorite: false, price: 6000, change: 0, isOpen: true, createdAt: now, updatedAt: now, bid: 5999.5, ask: 6000.5, spread: 1, high: 6000, low: 6000, volume: 0 }
        ];
        
        
        setMarkets(initial);
setLoading(false);
    }, []);

    /* ---------------- LIVE ENGINE ---------------- */

useEffect(() => {
    if (loading) return;

    intervalRef.current = setInterval(() => {
        setMarkets(prev =>
            prev.map(m => {
                const volatility =
                    m.category === "Volatility" ? 40 : 10;

                const move = (Math.random() - 0.5) * volatility;

                const previousPrice = m.price;
                const newPrice = Math.max(1, previousPrice + move);

                const change =
                    previousPrice !== 0
                        ? ((newPrice - previousPrice) / previousPrice) * 100
                        : 0;

                const tickDirection: "up" | "down" | "flat" =
                    newPrice > previousPrice
                        ? "up"
                        : newPrice < previousPrice
                            ? "down"
                            : "flat";

                const high = Math.max(m.high ?? newPrice, newPrice);
                const low = Math.min(m.low ?? newPrice, newPrice);

                const bid = newPrice - 0.3;
                const ask = newPrice + 0.3;
                updateMarketPrice(m.id, newPrice);
                return {
                    ...m,

                    /* price tracking */
                    previousPrice,
                    price: newPrice,

                    /* market movement */
                    change,
                    tickDirection,

                    /* order book simulation */
                    bid,
                    ask,
                    spread: ask - bid,

                    /* range tracking */
                    high,
                    low,

                    /* activity */
                    volume:
                        (m.volume ?? 0) +
                        Math.floor(Math.random() * 50),

                    updatedAt: new Date().toISOString()
                };
            })
        );
    }, 800);

    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
}, [loading, updateMarketPrice]);

    return {
        markets,
        loading
    };
}