import { LineData } from "lightweight-charts";
import { Candle } from "../types";

/* ==========================================================
   EMA
========================================================== */

export function calculateEMA(

    candles: Candle[],

    period: number

): LineData[] {

    if (candles.length === 0) {

        return [];

    }

    const multiplier = 2 / (period + 1);

    let ema = candles[0].close;

    return candles.map(candle => {

        ema +=

            (candle.close - ema)

            * multiplier;

        return {

            time: candle.time,

            value: ema

        };

    });

}