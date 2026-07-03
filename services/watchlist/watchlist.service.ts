import * as api from "./watchlist.api";

class WatchlistService {

    async load() {

        return api.getWatchlist();

    }

    async add(

        marketId: string

    ) {

        await api.addWatchlist(

            marketId

        );

    }

    async remove(

        marketId: string

    ) {

        await api.removeWatchlist(

            marketId

        );

    }

}

export default new WatchlistService();