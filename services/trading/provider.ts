/**
 * ============================================================================
 * TRADING PROVIDER
 * ============================================================================
 * Creates and manages the trading framework.
 * ============================================================================
 */

import {

    TradingEngine,
    TradingEngineConfiguration,
    createTradingEngine,

    TradingSession,
    SessionConfiguration,
    createTradingSession,

    TradingScheduler,
    SchedulerConfiguration,
    createTradingScheduler,

    Strategy,
    StrategyConfiguration,
    createStrategy,

    RiskManager,
    RiskConfiguration,
    createRiskManager,

    ExecutionService,
    ExecutionConfiguration,
    createExecutionService,

    PortfolioManager,
    PortfolioConfiguration,
    createPortfolioManager

} from "./index";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface TradingProviderConfiguration {

    readonly engine:

        TradingEngineConfiguration;

    readonly session:

        SessionConfiguration;

    readonly scheduler:

        SchedulerConfiguration;

    readonly strategy:

        StrategyConfiguration;

    readonly risk:

        RiskConfiguration;

    readonly execution:

        ExecutionConfiguration;

    readonly portfolio:

        PortfolioConfiguration;

}

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

export class TradingProvider {

    public readonly engine:

    TradingEngine;

    public readonly session:

    TradingSession;

    public readonly scheduler:

    TradingScheduler;

    public readonly strategy:

    Strategy;

    public readonly riskManager:

    RiskManager;

    public readonly execution:

    ExecutionService;

    public readonly portfolio:

    PortfolioManager;

    constructor(

        configuration:

        TradingProviderConfiguration

    ) {

        this.session =

            createTradingSession(

                configuration.session

            );

        this.scheduler =

            createTradingScheduler(

                configuration.scheduler

            );

        this.strategy =

            createStrategy(

                configuration.strategy

            );

        this.riskManager =

            createRiskManager(

                configuration.risk

            );

        this.execution =

            createExecutionService(

                configuration.execution

            );

        this.portfolio =

            createPortfolioManager(

                configuration.portfolio

            );

        this.engine =

            createTradingEngine(

                configuration.engine,

                this.strategy,

                this.riskManager,

                this.execution,

                this.portfolio,

                this.session,

                this.scheduler

            );

    }

}
/* -------------------------------------------------------------------------- */
/*                             START                                          */
/* -------------------------------------------------------------------------- */

    public async start():

    Promise<void> {

        await this.engine.start();

    }

/* -------------------------------------------------------------------------- */
/*                              STOP                                          */
/* -------------------------------------------------------------------------- */

    public async stop():

    Promise<void> {

        await this.engine.stop();

    }

/* -------------------------------------------------------------------------- */
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.engine.reset();

    }

/* -------------------------------------------------------------------------- */
/*                             DESTROY                                        */
/* -------------------------------------------------------------------------- */

    public async destroy():

    Promise<void> {

        await this.engine.destroy();

    }

/* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.engine.healthy() &&

            this.session.healthy() &&

            this.scheduler.healthy() &&

            this.strategy.healthy() &&

            this.riskManager.healthy() &&

            this.execution.healthy() &&

            this.portfolio.healthy()

        );

    }

/* -------------------------------------------------------------------------- */
/*                         INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            engine:

                this.engine.information(),

            session:

                this.session.information(),

            scheduler:

                this.scheduler.information(),

            strategy:

                this.strategy.information(),

            riskManager:

                this.riskManager.information(),

            execution:

                this.execution.information(),

            portfolio:

                this.portfolio.information()

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

            engine:

                this.engine.diagnostics(),

            session:

                this.session.diagnostics(),

            scheduler:

                this.scheduler.diagnostics(),

            strategy:

                this.strategy.diagnostics(),

            riskManager:

                this.riskManager.diagnostics(),

            execution:

                this.execution.diagnostics(),

            portfolio:

                this.portfolio.diagnostics()

        });

    }
    /* -------------------------------------------------------------------------- */
/*                           METRICS                                          */
/* -------------------------------------------------------------------------- */

    public metrics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            engine:

                this.engine.statistics(),

            session:

                this.session.statistics(),

            scheduler:

                this.scheduler.statistics(),

            strategy:

                this.strategy.statistics(),

            riskManager:

                this.riskManager.statistics(),

            execution:

                this.execution.statistics(),

            portfolio:

                this.portfolio.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

    public configuration():

    Readonly<TradingProviderConfiguration> {

        return Object.freeze({

            engine:

                this.engineConfiguration,

            session:

                this.sessionConfiguration,

            scheduler:

                this.schedulerConfiguration,

            strategy:

                this.strategyConfiguration,

            risk:

                this.riskConfiguration,

            execution:

                this.executionConfiguration,

            portfolio:

                this.portfolioConfiguration

        });

    }

/* -------------------------------------------------------------------------- */
/*                         SERVICE ACCESS                                     */
/* -------------------------------------------------------------------------- */

    public services() {

        return Object.freeze({

            engine:

                this.engine,

            session:

                this.session,

            scheduler:

                this.scheduler,

            strategy:

                this.strategy,

            riskManager:

                this.riskManager,

            execution:

                this.execution,

            portfolio:

                this.portfolio

        });

    }

/* -------------------------------------------------------------------------- */
/*                         STATUS HELPERS                                     */
/* -------------------------------------------------------------------------- */

    public isRunning():

    boolean {

        return this.engine.isRunning();

    }

    public isStopped():

    boolean {

        return this.engine.isStopped();

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

        "Trading Provider";

}

/* -------------------------------------------------------------------------- */
/*                         FACTORY FUNCTION                                   */
/* -------------------------------------------------------------------------- */

export function createTradingProvider(

    configuration:

    TradingProviderConfiguration

): TradingProvider {

    return new TradingProvider(

        configuration

    );

}