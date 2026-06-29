/**
 * ============================================================================
 * MARKET INDICATORS
 * ============================================================================
 * Calculates technical indicators from market data.
 * ============================================================================
 */

import { MarketDataService } from "./market-data";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface IndicatorConfiguration {

    readonly period: number;

    readonly enabled: boolean;

}

/* -------------------------------------------------------------------------- */
/* RESULT                                                                     */
/* -------------------------------------------------------------------------- */

export interface IndicatorResult {

    readonly name: string;

    readonly value: number;

    readonly timestamp: Date;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface IndicatorMetrics {

    calculations: number;

    failures: number;

    lastCalculation?: Date;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export class IndicatorService {

    private readonly metrics:

    IndicatorMetrics = {

        calculations: 0,

        failures: 0

    };

    constructor(

        private readonly configuration:

        IndicatorConfiguration,

        private readonly market:

        MarketDataService

    ) {

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public statistics():

    Readonly<IndicatorMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

    protected values():

    number[] {

        return this.market

            .history()

            .map(

                tick => tick.price

            );

    }

}

/* -------------------------------------------------------------------------- */
/*                    SIMPLE MOVING AVERAGE (SMA)                             */
/* -------------------------------------------------------------------------- */

    public sma(

        period = this.configuration.period

    ): IndicatorResult | undefined {

        const values = this.values();

        if (

            values.length < period

        ) {

            return;

        }

        const slice =

            values.slice(

                -period

            );

        const value =

            slice.reduce(

                (sum, price) =>

                    sum + price,

                0

            ) / period;

        this.metrics.calculations++;

        this.metrics.lastCalculation =

            new Date();

        return {

            name:

                "SMA",

            value,

            timestamp:

                new Date()

        };

    }

/* -------------------------------------------------------------------------- */
/*                 EXPONENTIAL MOVING AVERAGE (EMA)                           */
/* -------------------------------------------------------------------------- */

    public ema(

        period = this.configuration.period

    ): IndicatorResult | undefined {

        const values = this.values();

        if (

            values.length < period

        ) {

            return;

        }

        const multiplier =

            2 /

            (period + 1);

        let ema =

            values[0];

        for (

            let index = 1;

            index < values.length;

            index++

        ) {

            ema =

                (

                    values[index] -

                    ema

                ) *

                multiplier +

                ema;

        }

        this.metrics.calculations++;

        this.metrics.lastCalculation =

            new Date();

        return {

            name:

                "EMA",

            value: ema,

            timestamp:

                new Date()

        };

    }

/* -------------------------------------------------------------------------- */
/*                       HIGHEST HIGH                                         */
/* -------------------------------------------------------------------------- */

    public highest(

        period = this.configuration.period

    ): number | undefined {

        const values =

            this.values();

        if (

            values.length < period

        ) {

            return;

        }

        return Math.max(

            ...values.slice(

                -period

            )

        );

    }

/* -------------------------------------------------------------------------- */
/*                       LOWEST LOW                                           */
/* -------------------------------------------------------------------------- */

    public lowest(

        period = this.configuration.period

    ): number | undefined {

        const values =

            this.values();

        if (

            values.length < period

        ) {

            return;

        }

        return Math.min(

            ...values.slice(

                -period

            )

        );

    }

/* -------------------------------------------------------------------------- */
/*                       TYPICAL PRICE                                        */
/* -------------------------------------------------------------------------- */

    public typicalPrice():

    number | undefined {

        const latest =

            this.market.latest();

        if (

            !latest

        ) {

            return;

        }

        return (

            latest.bid +

            latest.ask +

            latest.price

        ) / 3;

    }

    /* -------------------------------------------------------------------------- */
/*                    RELATIVE STRENGTH INDEX (RSI)                           */
/* -------------------------------------------------------------------------- */

    public rsi(

        period = this.configuration.period

    ): IndicatorResult | undefined {

        const values = this.values();

        if (

            values.length <= period

        ) {

            return;

        }

        let gains = 0;

        let losses = 0;

        const prices = values.slice(

            -(period + 1)

        );

        for (

            let index = 1;

            index < prices.length;

            index++

        ) {

            const difference =

                prices[index] -

                prices[index - 1];

            if (

                difference >= 0

            ) {

                gains += difference;

            } else {

                losses +=

                    Math.abs(

                        difference

                    );

            }

        }

        const averageGain =

            gains / period;

        const averageLoss =

            losses / period;

        const rs =

            averageLoss === 0

                ? Number.POSITIVE_INFINITY

                : averageGain /

                  averageLoss;

        const value =

            100 -

            (

                100 /

                (1 + rs)

            );

        this.metrics.calculations++;

        this.metrics.lastCalculation =

            new Date();

        return {

            name:

                "RSI",

            value,

            timestamp:

                new Date()

        };

    }

/* -------------------------------------------------------------------------- */
/*               MOVING AVERAGE CONVERGENCE DIVERGENCE (MACD)                 */
/* -------------------------------------------------------------------------- */

    public macd():

    IndicatorResult | undefined {

        const fast =

            this.ema(12);

        const slow =

            this.ema(26);

        if (

            !fast ||

            !slow

        ) {

            return;

        }

        this.metrics.calculations++;

        this.metrics.lastCalculation =

            new Date();

        return {

            name:

                "MACD",

            value:

                fast.value -

                slow.value,

            timestamp:

                new Date()

        };

    }

/* -------------------------------------------------------------------------- */
/*                     BOLLINGER BANDS                                        */
/* -------------------------------------------------------------------------- */

    public bollinger(

        period = this.configuration.period,

        deviation = 2

    ) {

        const values = this.values();

        if (

            values.length < period

        ) {

            return;

        }

        const slice =

            values.slice(

                -period

            );

        const mean =

            slice.reduce(

                (sum, value) =>

                    sum + value,

                0

            ) / period;

        const variance =

            slice.reduce(

                (sum, value) =>

                    sum +

                    Math.pow(

                        value - mean,

                        2

                    ),

                0

            ) / period;

        const standardDeviation =

            Math.sqrt(

                variance

            );

        this.metrics.calculations++;

        this.metrics.lastCalculation =

            new Date();

        return {

            upper:

                mean +

                deviation *

                standardDeviation,

            middle:

                mean,

            lower:

                mean -

                deviation *

                standardDeviation

        };

    }

/* -------------------------------------------------------------------------- */
/*                    AVERAGE TRUE RANGE (ATR)                                */
/* -------------------------------------------------------------------------- */

    public atr(

        period = this.configuration.period

    ): IndicatorResult | undefined {

        const values = this.values();

        if (

            values.length < period

        ) {

            return;

        }

        let total = 0;

        const slice =

            values.slice(

                -period

            );

        for (

            let index = 1;

            index < slice.length;

            index++

        ) {

            total += Math.abs(

                slice[index] -

                slice[index - 1]

            );

        }

        this.metrics.calculations++;

        this.metrics.lastCalculation =

            new Date();

        return {

            name:

                "ATR",

            value:

                total /

                (period - 1),

            timestamp:

                new Date()

        };

    }
    /* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.enabled() &&

            this.market.healthy()

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

            period:

                this.configuration.period,

            calculations:

                this.metrics.calculations,

            lastCalculation:

                this.metrics.lastCalculation,

            market:

                this.market.information()

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
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.metrics.calculations = 0;

        this.metrics.failures = 0;

        this.metrics.lastCalculation =

            undefined;

    }

/* -------------------------------------------------------------------------- */
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public isRunning():

    boolean {

        return this.healthy();

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

    }

}

/* -------------------------------------------------------------------------- */
/*                           FACTORY                                          */
/* -------------------------------------------------------------------------- */

export function createIndicatorService(

    configuration:

    IndicatorConfiguration,

    market:

    MarketDataService

): IndicatorService {

    return new IndicatorService(

        configuration,

        market

    );

}