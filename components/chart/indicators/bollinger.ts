import { LineData } from "lightweight-charts";

import {

    Candle,

    BollingerBands

} from "../types";

/* ==========================================================
   BOLLINGER BANDS
========================================================== */

export function calculateBollinger(

    candles: Candle[],

    period = 20,

    multiplier = 2

): BollingerBands {

    const upper: LineData[] = [];

    const middle: LineData[] = [];

    const lower: LineData[] = [];

    if (candles.length < period) {

        return {

            upper,

            middle,

            lower

        };

    }

    for (

        let i = period - 1;

        i < candles.length;

        i++

    ) {

        const slice = candles.slice(

            i - period + 1,

            i + 1

        );

        const mean =

            slice.reduce(

                (sum, candle) =>

                    sum + candle.close,

                0

            ) / period;

        const variance =

            slice.reduce(

                (sum, candle) =>

                    sum +

                    Math.pow(

                        candle.close - mean,

                        2

                    ),

                0

            ) / period;

        const deviation =

            Math.sqrt(

                variance

            );

        upper.push({

            time: candles[i].time,

            value:

                mean +

                deviation *

                multiplier

        });

        middle.push({

            time: candles[i].time,

            value: mean

        });

        lower.push({

            time: candles[i].time,

            value:

                mean -

                deviation *

                multiplier

        });

    }

    return {

        upper,

        middle,

        lower

    };

}