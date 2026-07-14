"use client";

/**
 * ============================================================================
 * MARKETS PAGE
 * ============================================================================
 */

import { useMemo } from "react";
import type { SelectedMarket } from "@/store/useTradeStore";

import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";

import { useMarketFilters } from "../../../hooks/useMarketFilters";

import {
    MarketSearch,
    MarketFilters,
    MarketCategories,
    MarketTable,
    Watchlist,
    PriceTicker,
} from "../../../components/markets";

export default function MarketsPage() {

    const marketPrices = useTradeStore(
        state => state.marketPrices
    );

    const markets = useMemo(() => {

        return ALL_INSTRUMENTS.map(market => ({

            id: market.symbol,
            symbol: market.symbol,
            name: market.name,
            category: market.category,

            price:
                marketPrices[market.symbol] ??
                market.price,

            change:
                market.change ?? 0,

            bid:
                (marketPrices[market.symbol] ??
                    market.price) - 0.25,

            ask:
                (marketPrices[market.symbol] ??
                    market.price) + 0.25,

            spread: 0.50,

            high:
                (marketPrices[market.symbol] ??
                    market.price) + 5,

            low:
                (marketPrices[market.symbol] ??
                    market.price) - 5,

            volume:
                market.volume ?? 1000,

            tickDirection: "flat" as const,

        }));

    }, [marketPrices]);

    const loading = false;

    const {
        filteredMarkets,
        search,
        setSearch,
        category,
        setCategory,
        favoritesOnly,
        setFavoritesOnly,
    } = useMarketFilters(markets);

    return (

        <div className="markets-page">

            <PriceTicker
                markets={markets}
            />

            <MarketSearch
                value={search}
                onChange={setSearch}
            />

            <MarketFilters
                category={category}
                onCategoryChange={setCategory}
                favoritesOnly={favoritesOnly}
                onFavoritesChange={setFavoritesOnly}
            />

            <MarketCategories
                categories={[
                    "ALL",
                    "Volatility",
                    "Forex",
                    "Crypto",
                    "Stocks",
                    "Indices",
                ]}
                value={category}
                onChange={setCategory}
            />

            <MarketTable
                markets={filteredMarkets}
                loading={loading}
            />

            <Watchlist
                markets={filteredMarkets}
            />

        </div>

    );
}