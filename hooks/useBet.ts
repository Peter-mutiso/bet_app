"use client";

import { useMemo } from "react";
import { useBets } from "./useBets";

export function useBet(betId?: string) {

    const bets = useBets();

    return useMemo(
        () => ({
            ...bets,
            bet: betId
                ? bets.find(betId)
                : undefined
        }),
        [bets, betId]
    );
}