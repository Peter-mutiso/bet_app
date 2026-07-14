import {

    useCallback,

    useEffect,

    useMemo,

    useState

} from "react";
import type { SelectedMarket } from "@/store/useTradeStore";


import watchlistService from "../services/watchlist";

const STORAGE_KEY = "watchlist";

export function useWatchlist(

    markets: SelectedMarket[]

) {

    const [

        ids,

        setIds

    ] =

        useState<string[]>([]);

    /* -------------------------------------------------------------------------- */
    /* LOAD WATCHLIST                                                             */
    /* -------------------------------------------------------------------------- */

    useEffect(

        () => {

            let mounted = true;

            async function loadWatchlist() {

                try {

                    const response =

                        await watchlistService.load();

                    if (

                        mounted

                    ) {

                        const watchlistIds =

                            response.items.map(

                                item =>

                                    item.marketId

                            );

                        setIds(

                            watchlistIds

                        );

                    }

                }

                catch {

                    const cached =

                        localStorage.getItem(

                            STORAGE_KEY

                        );

                    if (

                        cached &&

                        mounted

                    ) {

                        setIds(

                            JSON.parse(

                                cached

                            )

                        );

                    }

                }

            }

            loadWatchlist();

            return () => {

                mounted = false;

            };

        },

        []

    );

    /* -------------------------------------------------------------------------- */
    /* LOCAL CACHE                                                                */
    /* -------------------------------------------------------------------------- */

    useEffect(

        () => {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(ids)

            );

        },

        [

            ids

        ]

    );

    /* -------------------------------------------------------------------------- */
    /* TOGGLE FAVORITE                                                            */
    /* -------------------------------------------------------------------------- */

    const toggleFavorite =

        useCallback(

            async (

                id: string

            ) => {

                const exists =

                    ids.includes(id);

                try {

                    if (

                        exists

                    ) {

                        await watchlistService.remove(

                            id

                        );

                        setIds(

                            previous =>

                                previous.filter(

                                    item =>

                                        item !== id

                                )

                        );

                    }

                    else {

                        await watchlistService.add(

                            id

                        );

                        setIds(

                            previous =>

                                [

                                    ...previous,

                                    id

                                ]

                        );

                    }

                }

                catch (

                    error

                ) {

                    console.error(

                        "Failed to update watchlist:",

                        error

                    );

                }

            },

            [

                ids

            ]

        );

    /* -------------------------------------------------------------------------- */
    /* FAVORITES                                                                  */
    /* -------------------------------------------------------------------------- */

    const favorites =

        useMemo(

            () =>

                markets.filter(

                    market =>

                        ids.includes(

                            market.symbol

                        )

                ),

            [

                markets,

                ids

            ]

        );

    return {

        favorites,

        favoriteIds: ids,

        toggleFavorite

    };

}