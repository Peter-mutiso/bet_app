import { useMemo, useState } from "react";

import type { SelectedMarket } from "@/store/useTradeStore";

export interface MarketFilterState {

    search: string;

    category: string;

    favoritesOnly: boolean;

}

export function useMarketFilters(markets: SelectedMarket[]) {

    const [

        search,

        setSearch

    ] =

        useState("");

    const [

        category,

        setCategory

    ] =

        useState("ALL");

    const [

        favoritesOnly,

        setFavoritesOnly

    ] =

        useState(false);

    const filteredMarkets =

        useMemo(() => {

            return markets.filter(

                market => {

                    if (

                        search.length > 0 &&

                        !market.name

                            .toLowerCase()

                            .includes(

                                search.toLowerCase()

                            ) &&

                        !market.symbol

                            .toLowerCase()

                            .includes(

                                search.toLowerCase()

                            )

                    ) {

                        return false;

                    }

                    if (

                        category !== "ALL" &&

                        market.category !== category

                    ) {

                        return false;

                    }

                    if (

                        favoritesOnly &&

                        !market.favorite

                    ) {

                        return false;

                    }

                    return true;

                }

            );

        },

        [

            markets,

            search,

            category,

            favoritesOnly

        ]

    );

    return {

        filteredMarkets,

        search,

        setSearch,

        category,

        setCategory,

        favoritesOnly,

        setFavoritesOnly

    };

}