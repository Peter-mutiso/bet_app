import { Candle } from "../types";

import {

    createEngine,

    applyVolatility,

    nextTick,

} from "./marketEngine";

import {

    createCandle,

    updateCandle,

} from "./candleEngine";

import {

    UTCTimestamp,

} from "lightweight-charts";

/* ============================================================================
   BUILD HISTORY
============================================================================ */

export function generateHistory(

    startPrice: number,

    candleDuration: number,

    volatilityState: number,

    candles = 400

): Candle[] {

    const engine =

        createEngine(

            startPrice

        );

    applyVolatility(

        engine,

        volatilityState

    );

    const history: Candle[] = [];

    let price = startPrice;

    const startTime =

        Math.floor(

            Date.now() / 1000

        ) -

        candles * candleDuration;

    for (

        let i = 0;

        i < candles;

        i++

    ) {

        const time = (

            startTime +

            i * candleDuration

        ) as UTCTimestamp;

        const open = price;

        const candle =

            createCandle(

                time,

                open

            );

        /*
        --------------------------------------------------------
        Simulate 12 ticks inside every candle
        --------------------------------------------------------
        */
       const ticksPerCandle = [6, 9, 12, 18, 24][volatilityState];

        for (

            let t = 0;

            t < ticksPerCandle;

            t++

        ) {

            applyVolatility(

                engine,

                volatilityState

            );

            const tick =

                nextTick(

                    engine,

                    price

                );

            price = tick.price;

            updateCandle(

                candle,

                price,

                tick.move,

                engine.volatility

            );

        }

        history.push(

            candle

        );

    }

    return history;

}