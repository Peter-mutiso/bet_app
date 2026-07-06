/**
 * ============================================================================
 * MARKETS PAGE
 * ============================================================================
 */

import {

    useMemo

} from "react";

import {

    useMarkets

} from "../../hooks/useMarkets";
import { useMarketFilters } from "../../hooks/useMarketFilters";
import type { Market } from "../../types/market";

import {

    MarketSearch,

    MarketFilters,

    MarketCategories,

    MarketTable,

    Watchlist,

    PriceTicker

} from "../../components/markets";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function MarketsPage() {

    const {

        markets,

        loading

    } =

        useMarkets();

    const {

    filteredMarkets,

    search,

    setSearch,

    category,

    setCategory,

    favoritesOnly,

    setFavoritesOnly

} =

    useMarketFilters(

        markets

    );
    return (

        <div

            className="markets-page"

        >

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
        "Indices"
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