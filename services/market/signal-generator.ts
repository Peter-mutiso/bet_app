/**
 * ============================================================================
 * SIGNAL GENERATOR
 * ============================================================================
 * Generates standardized trading signals from market indicators.
 * ============================================================================
 */

import {

    IndicatorService

} from "./indicators";

/* -------------------------------------------------------------------------- */
/* SIGNAL                                                                     */
/* -------------------------------------------------------------------------- */

export enum SignalDirection {

    BUY = "BUY",

    SELL = "SELL",

    HOLD = "HOLD"

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface SignalGeneratorConfiguration {

    readonly enabled: boolean;

    readonly rsiBuyThreshold: number;

    readonly rsiSellThreshold: number;

}

/* -------------------------------------------------------------------------- */
/* RESULT                                                                     */
/* -------------------------------------------------------------------------- */

export interface GeneratedSignal {

    readonly direction:

        SignalDirection;

    readonly confidence:

        number;

    readonly reason:

        string;

    readonly timestamp:

        Date;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface SignalGeneratorMetrics {

    generated: number;

    buySignals: number;

    sellSignals: number;

    holdSignals: number;

    lastGenerated?: Date;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export class SignalGenerator {

    private readonly metrics:

    SignalGeneratorMetrics = {

        generated: 0,

        buySignals: 0,

        sellSignals: 0,

        holdSignals: 0

    };

    constructor(

        private readonly configuration:

        SignalGeneratorConfiguration,

        private readonly indicators:

        IndicatorService

    ) {

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public statistics():

    Readonly<SignalGeneratorMetrics> {

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
/*                           SIGNAL HISTORY                                   */
/* -------------------------------------------------------------------------- */

    private readonly history:

    GeneratedSignal[] = [];

/* -------------------------------------------------------------------------- */
/*                         STORE SIGNAL                                       */
/* -------------------------------------------------------------------------- */

    private remember(

        signal: GeneratedSignal

    ): GeneratedSignal {

        this.history.push(

            signal

        );

        while (

            this.history.length >

            100

        ) {

            this.history.shift();

        }

        return signal;

    }

/* -------------------------------------------------------------------------- */
/*                         SIGNAL HISTORY                                     */
/* -------------------------------------------------------------------------- */

    public signals():

    readonly GeneratedSignal[] {

        return Object.freeze(

            [...this.history]

        );

    }

    public latest():

    GeneratedSignal | undefined {

        return this.history[

            this.history.length - 1

        ];

    }

/* -------------------------------------------------------------------------- */
/*                         HEALTH                                             */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.enabled() &&

            this.indicators.healthy()

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

            historySize:

                this.history.length,

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
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.history.length = 0;

        this.metrics.generated = 0;

        this.metrics.buySignals = 0;

        this.metrics.sellSignals = 0;

        this.metrics.holdSignals = 0;

        this.metrics.lastGenerated =

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

export function createSignalGenerator(

    configuration:

    SignalGeneratorConfiguration,

    indicators:

    IndicatorService

): SignalGenerator {

    return new SignalGenerator(

        configuration,

        indicators

    );

}