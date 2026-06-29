/**
 * ============================================================================
 * CANDLE SERVICE
 * ============================================================================
 * Aggregates market ticks into OHLC candles.
 * ============================================================================
 */

import {

    EventEmitter

} from "events";

import {

    MarketTick

} from "./market-data";

/* -------------------------------------------------------------------------- */
/* TIMEFRAME                                                                  */
/* -------------------------------------------------------------------------- */

export enum CandleTimeframe {

    M1 = 60,

    M5 = 300,

    M15 = 900,

    M30 = 1800,

    H1 = 3600,

    H4 = 14400,

    D1 = 86400

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface CandleConfiguration {

    readonly enabled: boolean;

    readonly timeframe: CandleTimeframe;

    readonly maximumCandles: number;

}

/* -------------------------------------------------------------------------- */
/* CANDLE                                                                     */
/* -------------------------------------------------------------------------- */

export interface Candle {

    readonly open: number;

    readonly high: number;

    readonly low: number;

    readonly close: number;

    readonly start: number;

    readonly end: number;

    readonly ticks: number;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface CandleMetrics {

    candles: number;

    updates: number;

    lastCompleted?: Date;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export class CandleService

extends EventEmitter {

    private readonly candles:

    Candle[] = [];

    private current?:

    Candle;

    private readonly metrics:

    CandleMetrics = {

        candles: 0,

        updates: 0

    };

    constructor(

        private readonly configuration:

        CandleConfiguration

    ) {

        super();

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public statistics():

    Readonly<CandleMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                         GENERATE SIGNAL                                    */
/* -------------------------------------------------------------------------- */

    public generate():

    GeneratedSignal {

        let score = 0;

        const reasons: string[] = [];

/* -------------------------------------------------------------------------- */
/*                               RSI                                          */
/* -------------------------------------------------------------------------- */

        const rsi =

            this.indicators.rsi();

        if (

            rsi

        ) {

            if (

                rsi.value <=

                this.configuration.rsiBuyThreshold

            ) {

                score++;

                reasons.push(

                    "RSI indicates oversold conditions."

                );

            }

            else if (

                rsi.value >=

                this.configuration.rsiSellThreshold

            ) {

                score--;

                reasons.push(

                    "RSI indicates overbought conditions."

                );

            }

        }

/* -------------------------------------------------------------------------- */
/*                               EMA / SMA                                    */
/* -------------------------------------------------------------------------- */

        const ema =

            this.indicators.ema();

        const sma =

            this.indicators.sma();

        if (

            ema &&

            sma

        ) {

            if (

                ema.value >

                sma.value

            ) {

                score++;

                reasons.push(

                    "EMA is above SMA."

                );

            }

            else if (

                ema.value <

                sma.value

            ) {

                score--;

                reasons.push(

                    "EMA is below SMA."

                );

            }

        }

/* -------------------------------------------------------------------------- */
/*                                MACD                                        */
/* -------------------------------------------------------------------------- */

        const macd =

            this.indicators.macd();

        if (

            macd

        ) {

            if (

                macd.value > 0

            ) {

                score++;

                reasons.push(

                    "MACD is bullish."

                );

            }

            else if (

                macd.value < 0

            ) {

                score--;

                reasons.push(

                    "MACD is bearish."

                );

            }

        }

/* -------------------------------------------------------------------------- */
/*                         DETERMINE SIGNAL                                   */
/* -------------------------------------------------------------------------- */

        let direction =

            SignalDirection.HOLD;

        if (

            score > 0

        ) {

            direction =

                SignalDirection.BUY;

        }

        else if (

            score < 0

        ) {

            direction =

                SignalDirection.SELL;

        }

        const confidence =

            Math.min(

                Math.abs(

                    score

                ) / 3,

                1

            );

        this.metrics.generated++;

        this.metrics.lastGenerated =

            new Date();

        switch (

            direction

        ) {

            case SignalDirection.BUY:

                this.metrics.buySignals++;

                break;

            case SignalDirection.SELL:

                this.metrics.sellSignals++;

                break;

            default:

                this.metrics.holdSignals++;

        }

        return {

            direction,

            confidence,

            reason:

                reasons.length > 0

                    ? reasons.join(

                        " "

                    )

                    : "No strong trading signal.",

            timestamp:

                new Date()

        };

    }
    /* -------------------------------------------------------------------------- */
/*                         LOOKUP BY TIME                                     */
/* -------------------------------------------------------------------------- */

    public candle(

        start: number

    ): Candle | undefined {

        return this.candles.find(

            candle =>

                candle.start ===

                start

        );

    }

/* -------------------------------------------------------------------------- */
/*                         HIGHEST HIGH                                       */
/* -------------------------------------------------------------------------- */

    public highest(

        count = this.candles.length

    ): number | undefined {

        if (

            this.candles.length === 0

        ) {

            return;

        }

        const candles =

            this.candles.slice(

                -count

            );

        return Math.max(

            ...candles.map(

                candle =>

                    candle.high

            )

        );

    }

/* -------------------------------------------------------------------------- */
/*                         LOWEST LOW                                         */
/* -------------------------------------------------------------------------- */

    public lowest(

        count = this.candles.length

    ): number | undefined {

        if (

            this.candles.length === 0

        ) {

            return;

        }

        const candles =

            this.candles.slice(

                -count

            );

        return Math.min(

            ...candles.map(

                candle =>

                    candle.low

            )

        );

    }

/* -------------------------------------------------------------------------- */
/*                         TOTAL CANDLES                                      */
/* -------------------------------------------------------------------------- */

    public count():

    number {

        return this.candles.length;

    }

/* -------------------------------------------------------------------------- */
/*                         HEALTH                                             */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.enabled() &&

            this.current !==

            undefined

        );

    }

/* -------------------------------------------------------------------------- */
/*                         INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            enabled:

                this.enabled(),

            timeframe:

                this.configuration.timeframe,

            completed:

                this.count(),

            current:

                this.current,

            latest:

                this.latest(),

            metrics:

                this.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                         DIAGNOSTICS                                        */
/* -------------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            healthy:

                this.healthy(),

            metrics:

                this.statistics(),

            information:

                this.information()

        });

    }

/* -------------------------------------------------------------------------- */
/*                         CACHE STATE                                        */
/* -------------------------------------------------------------------------- */

    public empty():

    boolean {

        return this.candles.length === 0;

    }

    public full():

    boolean {

        return (

            this.candles.length >=

            this.configuration.maximumCandles

        );

    }
    /* -------------------------------------------------------------------------- */
/*                             RESET                                          */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.candles.length = 0;

        this.current = undefined;

        this.metrics.candles = 0;

        this.metrics.updates = 0;

        this.metrics.lastCompleted = undefined;

        this.emit(

            "reset"

        );

    }

/* -------------------------------------------------------------------------- */
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public isRunning():

    boolean {

        return (

            this.enabled() &&

            this.current !==

            undefined

        );

    }

    public isStopped():

    boolean {

        return !this.isRunning();

    }

/* -------------------------------------------------------------------------- */
/*                            CLEANUP                                         */
/* -------------------------------------------------------------------------- */

    public destroy():

    void {

        this.reset();

        this.removeAllListeners();

    }

}

/* -------------------------------------------------------------------------- */
/*                           FACTORY                                          */
/* -------------------------------------------------------------------------- */

export function createCandleService(

    configuration:

    CandleConfiguration

): CandleService {

    return new CandleService(

        configuration

    );

}