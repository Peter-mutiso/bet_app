"use client";

import { useEffect, useState } from "react";
import { useLivePrice } from "./useLivePrice";

export function usePriceHistory(
    symbol: string,
    maxPoints = 60
) {
    const livePrice = useLivePrice(symbol);

    const [history, setHistory] = useState<number[]>([]);

    useEffect(() => {

        if (!livePrice) return;

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