"use client";

import { useEffect, useState } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export function usePriceHistory(
    symbol: string,
    maxPoints = 60
) {
    const livePrice = useTradeStore(
        state => state.marketPrices[symbol]
    );

    const [history, setHistory] = useState<number[]>([]);

    useEffect(() => {

        if (livePrice === undefined) return;

        setHistory(previous => {

            const next = [...previous, livePrice];

            if (next.length > maxPoints) {
                next.shift();
            }

            return next;

        });

    }, [livePrice, maxPoints]);

    return history;
}