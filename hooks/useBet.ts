"use client";

import { useMemo } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export function useBet(betId?: string) {

    const trades = useTradeStore(
        state => state.trades
    );

    return useMemo(
        () => ({
            bets: trades,
            bet: betId
                ? trades.find(
                      trade => trade.id === betId
                  )
                : undefined,
        }),
        [trades, betId]
    );
}