import apiClient from "../api";

import {

    WatchlistResponse

} from "./watchlist.types";

export async function getWatchlist() {

    const response =

        await apiClient.get<WatchlistResponse>(

            "/watchlist"

        );

    return response.data;

}

export async function addWatchlist(

    marketId: string

) {

    return apiClient.post(

        "/watchlist",

        {

            marketId

        }

    );

}

export async function removeWatchlist(

    marketId: string

) {

    return apiClient.delete(

        `/watchlist/${marketId}`

    );

}