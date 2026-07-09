import { UTCTimestamp } from "lightweight-charts";
import { Candle } from "../types";

/* =============================================================================
   CREATE CANDLE
============================================================================= */

export function createCandle(

    time: UTCTimestamp,

    open: number

): Candle {

    return {

        time,

        open,

        high: open,

        low: open,

        close: open,

        volume: 0,

        spread: 0,

        body: 0,

        upperWick: 0,

        lowerWick: 0,

        bullish: false,

        bearish: false,

    };

}

/* =============================================================================
   UPDATE CANDLE
============================================================================= */

export function updateCandle(

    candle: Candle,

    marketPrice: number,

    move: number,

    volatility: number

) {

    /*
    ------------------------------------------------------------------
    Close follows market immediately
    ------------------------------------------------------------------
    */

    candle.close = marketPrice;

    /*
    ------------------------------------------------------------------
    Body size
    ------------------------------------------------------------------
    */

    candle.body = Math.abs(

        candle.close -

        candle.open

    );

    /*
    ------------------------------------------------------------------
    Natural wick size
    ------------------------------------------------------------------
    */

    const baseWick =

        Math.max(

            candle.body * 0.20,

            Math.abs(move) * 0.80,

            volatility * 0.05

        );

    const upperNoise =

        Math.random() * baseWick;

    const lowerNoise =

        Math.random() * baseWick;

    /*
    ------------------------------------------------------------------
    Update High
    ------------------------------------------------------------------
    */

    candle.high = Math.max(

        candle.high,

        candle.open,

        candle.close + upperNoise

    );

    /*
    ------------------------------------------------------------------
    Update Low
    ------------------------------------------------------------------
    */

    candle.low = Math.min(

        candle.low,

        candle.open,

        candle.close - lowerNoise

    );

    /*
    ------------------------------------------------------------------
    Metadata
    ------------------------------------------------------------------
    */

    candle.upperWick =

        candle.high -

        Math.max(

            candle.open,

            candle.close

        );

    candle.lowerWick =

        Math.min(

            candle.open,

            candle.close

        ) -

        candle.low;

    candle.spread =

        candle.high -

        candle.low;

    candle.bullish =

        candle.close >= candle.open;

    candle.bearish =

        candle.close < candle.open;

    /*
    ------------------------------------------------------------------
    Fake volume
    ------------------------------------------------------------------
    */

    candle.volume +=

        Math.abs(move)

        *

        (15 + Math.random() * 40);

}

/* =============================================================================
   TIMESTAMP
============================================================================= */

export function candleTimestamp(

    duration: number

): UTCTimestamp {

    return (

        Math.floor(

            Date.now() /

            1000 /

            duration

        )

        *

        duration

    ) as UTCTimestamp;

}

/* =============================================================================
   HISTORY
============================================================================= */

export function appendHistory(

    candles: Candle[],

    candle: Candle,

    max = 1000

) {

    candles.push(candle);

    while (

        candles.length > max

    ) {

        candles.shift();

    }

}