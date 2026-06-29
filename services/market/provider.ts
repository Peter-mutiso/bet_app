/**
 * ============================================================================
 * MARKET PROVIDER
 * ============================================================================
 * Creates and manages the complete market subsystem.
 * ============================================================================
 */

import {

    MarketDataConfiguration,
    MarketDataService,
    createMarketDataService

} from "./market-data";

import {

    CandleConfiguration,
    CandleService,
    createCandleService

} from "./candles";

import {

    IndicatorConfiguration,
    IndicatorService,
    createIndicatorService

} from "./indicators";

import {

    SignalGenerator,
    SignalGeneratorConfiguration,
    createSignalGenerator

} from "./signal-generator";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface MarketProviderConfiguration {

    readonly market:

        MarketDataConfiguration;

    readonly candles:

        CandleConfiguration;

    readonly indicators:

        IndicatorConfiguration;

    readonly signals:

        SignalGeneratorConfiguration;

}

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

export class MarketProvider {

    private readonly configuration:

    MarketProviderConfiguration;

    public readonly market:

    MarketDataService;

    public readonly candles:

    CandleService;

    public readonly indicators:

    IndicatorService;

    public readonly signals:

    SignalGenerator;

    constructor(

        configuration:

        MarketProviderConfiguration

    ) {

        this.configuration =

            configuration;

        this.market =

            createMarketDataService(

                configuration.market

            );

        this.candles =

            createCandleService(

                configuration.candles

            );

        this.indicators =

            createIndicatorService(

                configuration.indicators,

                this.market

            );

        this.signals =

            createSignalGenerator(

                configuration.signals,

                this.indicators

            );

    }

}
/* -------------------------------------------------------------------------- */
/*                             START                                          */
/* -------------------------------------------------------------------------- */

    public async start():

    Promise<void> {

        /*
         * Reserved for future initialization:
         * - Subscribe to WebSocket feeds
         * - Restore cached candles
         * - Initialize indicator cache
         */

    }

/* -------------------------------------------------------------------------- */
/*                              STOP                                          */
/* -------------------------------------------------------------------------- */

    public async stop():

    Promise<void> {

        /*
         * Reserved for graceful shutdown.
         */

    }

/* -------------------------------------------------------------------------- */
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.market.reset();

        this.candles.reset();

        this.indicators.reset();

        this.signals.reset();

    }

/* -------------------------------------------------------------------------- */
/*                             DESTROY                                        */
/* -------------------------------------------------------------------------- */

    public async destroy():

    Promise<void> {

        this.signals.destroy();

        this.indicators.destroy();

        this.candles.destroy();

        this.market.destroy();

    }

/* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.market.healthy() &&

            this.candles.healthy() &&

            this.indicators.healthy() &&

            this.signals.healthy()

        );

    }

/* -------------------------------------------------------------------------- */
/*                         INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            market:

                this.market.information(),

            candles:

                this.candles.information(),

            indicators:

                this.indicators.information(),

            signals:

                this.signals.information()

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

            market:

                this.market.diagnostics(),

            candles:

                this.candles.diagnostics(),

            indicators:

                this.indicators.diagnostics(),

            signals:

                this.signals.diagnostics()

        });

    }
    /* -------------------------------------------------------------------------- */
/*                           METRICS                                          */
/* -------------------------------------------------------------------------- */

    public metrics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            market:

                this.market.statistics(),

            candles:

                this.candles.statistics(),

            indicators:

                this.indicators.statistics(),

            signals:

                this.signals.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

    public configuration():

    Readonly<MarketProviderConfiguration> {

        return Object.freeze({

            ...this.configuration

        });

    }

/* -------------------------------------------------------------------------- */
/*                         SERVICE ACCESS                                     */
/* -------------------------------------------------------------------------- */

    public services() {

        return Object.freeze({

            market:

                this.market,

            candles:

                this.candles,

            indicators:

                this.indicators,

            signals:

                this.signals

        });

    }

/* -------------------------------------------------------------------------- */
/*                         STATUS HELPERS                                     */
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
/*                         PROVIDER STATE                                     */
/* -------------------------------------------------------------------------- */

    public state():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            running:

                this.isRunning(),

            healthy:

                this.healthy(),

            metrics:

                this.metrics()

        });

    }
    /* -------------------------------------------------------------------------- */
/*                             VERSION                                        */
/* -------------------------------------------------------------------------- */

    public static readonly VERSION =

        "1.0.0";

/* -------------------------------------------------------------------------- */
/*                           MODULE NAME                                      */
/* -------------------------------------------------------------------------- */

    public static readonly MODULE =

        "Market Provider";

}

/* -------------------------------------------------------------------------- */
/*                           FACTORY                                          */
/* -------------------------------------------------------------------------- */

export function createMarketProvider(

    configuration:

    MarketProviderConfiguration

): MarketProvider {

    return new MarketProvider(

        configuration

    );

}