/**
 * ============================================================================
 * TRADING SERVICE
 * ============================================================================
 *
 * Business service responsible for:
 *  - Trade placement
 *  - Trade settlement
 *  - Open positions
 *  - Trade history
 *  - Balance synchronization
 * ============================================================================
 */

import * as api from "./trading.api";

import type {

    Trade,

    TradeRequest

} from "../../types";

class TradingService {

    /* ---------------------------------------------------------------------- */
    /* PLACE TRADE                                                            */
    /* ---------------------------------------------------------------------- */

    public async placeTrade(

        payload: TradeRequest

    ) {

        return api.placeTrade(

            payload

        );

    }

    /* ---------------------------------------------------------------------- */
    /* CLOSE TRADE                                                            */
    /* ---------------------------------------------------------------------- */

    public async closeTrade(

        tradeId: string

    ) {

        return api.closeTrade(

            tradeId

        );

    }

    /* ---------------------------------------------------------------------- */
    /* OPEN POSITIONS                                                         */
    /* ---------------------------------------------------------------------- */

    public async getOpenTrades():

    Promise<Trade[]> {

        return api.getOpenTrades();

    }

    /* ---------------------------------------------------------------------- */
    /* TRADE HISTORY                                                          */
    /* ---------------------------------------------------------------------- */

    public async getTradeHistory():

    Promise<Trade[]> {

        return api.getTradeHistory();

    }

    /* ---------------------------------------------------------------------- */
    /* ACCOUNT BALANCE                                                        */
    /* ---------------------------------------------------------------------- */

    public async getBalance():

    Promise<number> {

        return api.getBalance();

    }

    /* ---------------------------------------------------------------------- */
    /* REFRESH                                                                */
    /* ---------------------------------------------------------------------- */

    public async refresh() {

        const [

            balance,

            openTrades

        ] =

            await Promise.all([

                this.getBalance(),

                this.getOpenTrades()

            ]);

        return {

            balance,

            openTrades

        };

    }

}

export default new TradingService();