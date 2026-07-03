/**
 * ============================================================================
 * MARKET DATA SERVICE
 * ============================================================================
 */

import {

    tradingProvider,

    Tick

} from "./provider";

class MarketDataService {

    start() {

        tradingProvider.connect();

    }

    stop() {

        tradingProvider.disconnect();

    }

    publish(

        tick: Tick

    ) {

        (tradingProvider as any).publishTick(

            tick

        );

    }

}

export default new MarketDataService();