/**
 * ============================================================================
 * MARKET DATA SERVICE
 * ============================================================================
 * Central source of market prices for the trading engine.
 * ============================================================================
 */

import { EventEmitter } from "events";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface MarketDataConfiguration {

    readonly enabled: boolean;

    readonly symbol: string;

    readonly cacheSize: number;

}

/* -------------------------------------------------------------------------- */
/* MARKET TICK                                                                */
/* -------------------------------------------------------------------------- */

export interface MarketTick {

    readonly symbol: string;

    readonly bid: number;

    readonly ask: number;

    readonly price: number;

    readonly epoch: number;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface MarketDataMetrics {

    ticks: number;

    reconnects: number;

    lastUpdate?: Date;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                     */
/* -------------------------------------------------------------------------- */

export class MarketDataService

extends EventEmitter {

    private readonly cache:

    MarketTick[] = [];

    private readonly metrics:

    MarketDataMetrics = {

        ticks: 0,

        reconnects: 0

    };

    constructor(

        private readonly configuration:

        MarketDataConfiguration

    ) {

        super();

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public statistics():

    Readonly<MarketDataMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                         INGEST TICK                                        */
/* -------------------------------------------------------------------------- */

    public update(

        tick: MarketTick

    ): void {

        this.cache.push(

            tick

        );

        while (

            this.cache.length >

            this.configuration.cacheSize

        ) {

            this.cache.shift();

        }

        this.metrics.ticks++;

        this.metrics.lastUpdate =

            new Date();

        this.emit(

            "tick",

            tick

        );

    }

/* -------------------------------------------------------------------------- */
/*                         LATEST TICK                                        */
/* -------------------------------------------------------------------------- */

    public latest():

    MarketTick | undefined {

        return this.cache[

            this.cache.length - 1

        ];

    }

/* -------------------------------------------------------------------------- */
/*                         CACHE ACCESS                                       */
/* -------------------------------------------------------------------------- */

    public history():

    readonly MarketTick[] {

        return Object.freeze(

            [...this.cache]

        );

    }

/* -------------------------------------------------------------------------- */
/*                         LAST PRICE                                         */
/* -------------------------------------------------------------------------- */

    public price():

    number | undefined {

        return this.latest()

            ?.price;

    }

/* -------------------------------------------------------------------------- */
/*                         BID / ASK                                          */
/* -------------------------------------------------------------------------- */

    public bid():

    number | undefined {

        return this.latest()

            ?.bid;

    }

    public ask():

    number | undefined {

        return this.latest()

            ?.ask;

    }

/* -------------------------------------------------------------------------- */
/*                         CACHE STATE                                        */
/* -------------------------------------------------------------------------- */

    public hasTicks():

    boolean {

        return this.cache.length >

            0;

    }

    public count():

    number {

        return this.cache.length;

    }

    /* -------------------------------------------------------------------------- */
/*                         CACHE MANAGEMENT                                   */
/* -------------------------------------------------------------------------- */

    public clear(): void {

        this.cache.length = 0;

        this.emit(

            "cacheCleared"

        );

    }

/* -------------------------------------------------------------------------- */
/*                         SYMBOL                                             */
/* -------------------------------------------------------------------------- */

    public symbol():

    string {

        return this.configuration.symbol;

    }

    public supports(

        symbol: string

    ): boolean {

        return (

            this.configuration.symbol ===

            symbol

        );

    }

/* -------------------------------------------------------------------------- */
/*                         HEALTH                                             */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.enabled() &&

            this.hasTicks()

        );

    }

/* -------------------------------------------------------------------------- */
/*                         INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            symbol:

                this.symbol(),

            enabled:

                this.enabled(),

            cacheSize:

                this.count(),

            latest:

                this.latest(),

            configuration:

                this.configuration

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
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public empty():

    boolean {

        return this.cache.length === 0;

    }

    public full():

    boolean {

        return (

            this.cache.length >=

            this.configuration.cacheSize

        );

    }
    /* -------------------------------------------------------------------------- */
/*                             RESET                                          */
/* -------------------------------------------------------------------------- */

    public reset(): void {

        this.cache.length = 0;

        this.metrics.ticks = 0;

        this.metrics.reconnects = 0;

        this.metrics.lastUpdate = undefined;

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

            this.hasTicks()

        );

    }

    public isStopped():

    boolean {

        return !this.isRunning();

    }

/* -------------------------------------------------------------------------- */
/*                            CLEANUP                                         */
/* -------------------------------------------------------------------------- */

    public destroy(): void {

        this.reset();

        this.removeAllListeners();

    }

}

/* -------------------------------------------------------------------------- */
/*                           FACTORY                                          */
/* -------------------------------------------------------------------------- */

export function createMarketDataService(

    configuration: MarketDataConfiguration

): MarketDataService {

    return new MarketDataService(

        configuration

    );

}