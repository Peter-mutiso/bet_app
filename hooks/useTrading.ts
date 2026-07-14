"use client";

import { useTradeStore } from "@/store/useTradeStore";

export function useTrading() {
    const selectedMarket = useTradeStore(
        (state) => state.selectedMarket
    );

    const setSelectedMarket = useTradeStore(
        (state) => state.setSelectedMarket
    );

    const contract = useTradeStore(
        (state) => state.currentTradeType
    );

    const setContract = useTradeStore(
        (state) => state.setCurrentTradeType
    );

    const duration = useTradeStore(
        (state) => state.duration
    );

    const setDuration = useTradeStore(
        (state) => state.setDuration
    );

    const stake = useTradeStore(
        (state) => state.stake
    );

    const setStake = useTradeStore(
        (state) => state.setStake
    );

    const buy = useTradeStore(
        (state) => state.buy
    );

    const placeTrade = async () => {
        buy();
    };

    return {
        selectedMarket,
        setSelectedMarket,
        contract,
        setContract,
        duration,
        setDuration,
        stake,
        setStake,
        placeTrade,
    };
}