/**
 * ============================================================================
 * USE MARKETS HOOK
 * ============================================================================
 */

import { useEffect, useState } from "react";

import type { Market } from "../types/market";

export function useMarkets() {

    const [markets, setMarkets] = useState<Market[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadMarkets() {

            setLoading(true);

            try {

                /**
                 * Temporary data.
                 * Later this will come from the MarketDataService.
                 */

                const now = new Date().toISOString();

                setMarkets([

                    {
                        id: "R_10",
                        name: "Volatility 10",
                        symbol: "R_10",
                        category: "Volatility",
                        favorite: false,
                        price: 1234.56,
                        change: 0.42,
                        isOpen: true,
                        createdAt: now,
                        updatedAt: now
                    },

                    {
                        id: "R_25",
                        name: "Volatility 25",
                        symbol: "R_25",
                        category: "Volatility",
                        favorite: false,
                        price: 2345.67,
                        change: -0.18,
                        isOpen: true,
                        createdAt: now,
                        updatedAt: now
                    },

                    {
                        id: "R_50",
                        name: "Volatility 50",
                        symbol: "R_50",
                        category: "Volatility",
                        favorite: false,
                        price: 3456.78,
                        change: 1.25,
                        isOpen: true,
                        createdAt: now,
                        updatedAt: now
                    },

                    {
                        id: "R_75",
                        name: "Volatility 75",
                        symbol: "R_75",
                        category: "Volatility",
                        favorite: false,
                        price: 4567.89,
                        change: -0.34,
                        isOpen: true,
                        createdAt: now,
                        updatedAt: now
                    },

                    {
                        id: "R_100",
                        name: "Volatility 100",
                        symbol: "R_100",
                        category: "Volatility",
                        favorite: false,
                        price: 5678.90,
                        change: 0.91,
                        isOpen: true,
                        createdAt: now,
                        updatedAt: now
                    }

                ]);

            } finally {

                setLoading(false);

            }

        }

        void loadMarkets();

    }, []);

    return {

        markets,

        loading

    };

}