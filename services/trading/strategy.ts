/**
 * ============================================================================
 * ABSTRACT STRATEGY
 * ============================================================================
 * Base class for every trading strategy.
 *
 * Responsibilities
 *  - Lifecycle
 *  - Configuration
 *  - Validation
 *  - Metrics
 *  - Event publishing
 *  - Signal generation contract
 * ============================================================================
 */

import { EventEmitter } from "events";

import {

    TradingSignal

} from "./signal";

import {

    Tick

} from "../../models/tick";

import {

    Candle

} from "../../models/candle";

import {

    Balance

} from "../../models/balance";

import {

    Position

} from "../../models/position";

/* -------------------------------------------------------------------------- */
/*                           CONFIGURATION                                    */
/* -------------------------------------------------------------------------- */

export interface StrategyConfiguration {

    readonly enabled: boolean;

    readonly symbol: string;

    readonly timeframe: string;

    readonly minimumConfidence: number;

}

/* -------------------------------------------------------------------------- */
/*                             CONTEXT                                        */
/* -------------------------------------------------------------------------- */

export interface StrategyContext {

    readonly tick?: Tick;

    readonly candle?: Candle;

    readonly balance?: Balance;

    readonly positions:

    readonly Position[];

}

/* -------------------------------------------------------------------------- */
/*                              METRICS                                       */
/* -------------------------------------------------------------------------- */

export interface StrategyMetrics {

    evaluations: number;

    generatedSignals: number;

    acceptedSignals: number;

    rejectedSignals: number;

    lastEvaluation?: Date;

}

/* -------------------------------------------------------------------------- */
/*                           STRATEGY STATE                                   */
/* -------------------------------------------------------------------------- */

export enum StrategyState {

    CREATED = "CREATED",

    INITIALIZING = "INITIALIZING",

    READY = "READY",

    RUNNING = "RUNNING",

    STOPPED = "STOPPED",

    ERROR = "ERROR"

}

/* -------------------------------------------------------------------------- */
/*                        ABSTRACT STRATEGY                                   */
/* -------------------------------------------------------------------------- */

export abstract class Strategy

extends EventEmitter {

    protected state =

        StrategyState.CREATED;

    protected readonly metrics:

    StrategyMetrics = {

        evaluations: 0,

        generatedSignals: 0,

        acceptedSignals: 0,

        rejectedSignals: 0

    };

    protected constructor(

        protected readonly configuration:

        StrategyConfiguration

    ) {

        super();

    }

    /* ---------------------------------------------------------------------- */
    /*                        INFORMATION                                     */
    /* ---------------------------------------------------------------------- */

    public abstract readonly name: string;

    public abstract readonly version: string;

    public stateOf():

    StrategyState {

        return this.state;

    }

    public enabled(): boolean {

        return this.configuration.enabled;

    }

    public config():

    StrategyConfiguration {

        return this.configuration;

    }

    public statistics():

    Readonly<StrategyMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

    /* ---------------------------------------------------------------------- */
    /*                  SIGNAL CONTRACT                                       */
    /* ---------------------------------------------------------------------- */

    public abstract evaluate(

        context: StrategyContext

    ): Promise<TradingSignal | null>;

}
    /* ---------------------------------------------------------------------- */
    /*                           INITIALIZATION                               */
    /* ---------------------------------------------------------------------- */

    public async initialize():

    Promise<void> {

        if (

            this.state !==

            StrategyState.CREATED

        ) {

            return;

        }

        this.state =

            StrategyState.INITIALIZING;

        await this.onInitialize();

        this.state =

            StrategyState.READY;

        this.emit(

            "initialized"

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                              START                                     */
    /* ---------------------------------------------------------------------- */

    public async start():

    Promise<void> {

        if (

            this.state !==

            StrategyState.READY

        ) {

            return;

        }

        await this.onStart();

        this.state =

            StrategyState.RUNNING;

        this.emit(

            "started"

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                               STOP                                     */
    /* ---------------------------------------------------------------------- */

    public async stop():

    Promise<void> {

        if (

            this.state !==

            StrategyState.RUNNING

        ) {

            return;

        }

        await this.onStop();

        this.state =

            StrategyState.STOPPED;

        this.emit(

            "stopped"

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                              RESET                                     */
    /* ---------------------------------------------------------------------- */

    public reset(): void {

        this.metrics.evaluations = 0;

        this.metrics.generatedSignals = 0;

        this.metrics.acceptedSignals = 0;

        this.metrics.rejectedSignals = 0;

        this.metrics.lastEvaluation = undefined;

        this.onReset();

    }

    /* ---------------------------------------------------------------------- */
    /*                           VALIDATION                                   */
    /* ---------------------------------------------------------------------- */

    protected validate(

        context: StrategyContext

    ): boolean {

        return (

            this.enabled() &&

            (

                context.tick !==

                undefined ||

                context.candle !==

                undefined

            )

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                         METRICS                                        */
    /* ---------------------------------------------------------------------- */

    protected beginEvaluation():

    void {

        this.metrics.evaluations++;

        this.metrics.lastEvaluation =

            new Date();

    }

    protected signalGenerated():

    void {

        this.metrics.generatedSignals++;

    }

    protected signalAccepted():

    void {

        this.metrics.acceptedSignals++;

    }

    protected signalRejected():

    void {

        this.metrics.rejectedSignals++;

    }

    /* ---------------------------------------------------------------------- */
    /*                          HEALTH                                        */
    /* ---------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            this.state !==

            StrategyState.ERROR &&

            this.enabled()

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                       LIFECYCLE HOOKS                                  */
    /* ---------------------------------------------------------------------- */

    protected async onInitialize():

    Promise<void> {}

    protected async onStart():

    Promise<void> {}

    protected async onStop():

    Promise<void> {}

    protected onReset():

    void {}
        /* ---------------------------------------------------------------------- */
    /*                     STRATEGY PIPELINE                                  */
    /* ---------------------------------------------------------------------- */

    public override async evaluate(

        context: StrategyContext

    ): Promise<TradingSignal | null> {

        if (

            !this.validate(

                context

            )

        ) {

            return null;

        }

        this.beginEvaluation();

        try {

            const signal =

                await this.generateSignal(

                    context

                );

            if (

                signal === null

            ) {

                return null;

            }

            this.signalGenerated();

            if (

                !this.validateSignal(

                    signal

                )

            ) {

                this.signalRejected();

                return null;

            }

            if (

                signal.confidence <

                this.configuration.minimumConfidence

            ) {

                this.signalRejected();

                return null;

            }

            this.signalAccepted();

            this.emit(

                "signal",

                signal

            );

            return signal;

        }

        catch (

            error

        ) {

            this.state =

                StrategyState.ERROR;

            this.emit(

                "error",

                error

            );

            return null;

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                     SIGNAL VALIDATION                                  */
    /* ---------------------------------------------------------------------- */

    protected validateSignal(

        signal: TradingSignal

    ): boolean {

        return (

            signal.metadata.symbol ===

            this.configuration.symbol &&

            signal.metadata.timeframe ===

            this.configuration.timeframe

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      ABSTRACT TRADING LOGIC                            */
    /* ---------------------------------------------------------------------- */

    protected abstract generateSignal(

        context: StrategyContext

    ): Promise<TradingSignal | null>;

    /* ---------------------------------------------------------------------- */
    /*                     EVENT HELPERS                                      */
    /* ---------------------------------------------------------------------- */

    protected publish(

        event: string,

        payload?: unknown

    ): void {

        this.emit(

            event,

            payload

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        LOGGING                                         */
    /* ---------------------------------------------------------------------- */

    protected log(

        message: string

    ): void {

        console.info(

            `[${this.name}] ${message}`

        );

    }

    protected warn(

        message: string

    ): void {

        console.warn(

            `[${this.name}] ${message}`

        );

    }

    protected error(

        message: string

    ): void {

        console.error(

            `[${this.name}] ${message}`

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                          INFORMATION                                   */
    /* ---------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            name:

                this.name,

            version:

                this.version,

            state:

                this.state,

            enabled:

                this.enabled(),

            configuration:

                this.configuration

        });

    }

    /* ---------------------------------------------------------------------- */
    /*                         DIAGNOSTICS                                    */
    /* ---------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            strategy:

                this.information(),

            metrics:

                this.statistics(),

            healthy:

                this.healthy()

        });

    }

    /* ---------------------------------------------------------------------- */
    /*                     CONFIGURATION HELPERS                              */
    /* ---------------------------------------------------------------------- */

    public symbol():

    string {

        return this.configuration.symbol;

    }

    public timeframe():

    string {

        return this.configuration.timeframe;

    }

    public minimumConfidence():

    number {

        return this.configuration.minimumConfidence;

    }

    /* ---------------------------------------------------------------------- */
    /*                        STATE HELPERS                                   */
    /* ---------------------------------------------------------------------- */

    public isReady(): boolean {

        return this.state ===

            StrategyState.READY;

    }

    public isRunning(): boolean {

        return this.state ===

            StrategyState.RUNNING;

    }

    public hasFailed(): boolean {

        return this.state ===

            StrategyState.ERROR;

    }

    /* ---------------------------------------------------------------------- */
    /*                         DESTRUCTION                                    */
    /* ---------------------------------------------------------------------- */

    public async destroy():

    Promise<void> {

        if (

            this.isRunning()

        ) {

            await this.stop();

        }

        this.removeAllListeners();

        this.onDestroy();

        this.state =

            StrategyState.STOPPED;

    }

    /* ---------------------------------------------------------------------- */
    /*                      FINAL HOOK                                        */
    /* ---------------------------------------------------------------------- */

    protected onDestroy():

    void {}

}
