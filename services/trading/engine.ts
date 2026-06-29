/**
 * ============================================================================
 * TRADING ENGINE
 * ============================================================================
 * Central orchestrator for the automated trading platform.
 * ============================================================================
 */

import { EventEmitter } from "events";

import { Strategy } from "./strategy";
import { RiskManager } from "./risk-manager";
import { ExecutionService } from "./execution";
import { PortfolioManager } from "./portfolio-manager";
import { TradingSession } from "./session";
import { TradingScheduler } from "./scheduler";

import { TradingSignal } from "./signal";

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

export interface TradingEngineConfiguration {

    readonly enabled: boolean;

    readonly automaticTrading: boolean;

}

/* -------------------------------------------------------------------------- */
/*                           METRICS                                          */
/* -------------------------------------------------------------------------- */

export interface TradingEngineMetrics {

    cycles: number;

    executedTrades: number;

    rejectedSignals: number;

    lastCycle?: Date;

}

/* -------------------------------------------------------------------------- */
/*                        TRADING ENGINE                                      */
/* -------------------------------------------------------------------------- */

export class TradingEngine

extends EventEmitter {

    private readonly metrics:

    TradingEngineMetrics = {

        cycles: 0,

        executedTrades: 0,

        rejectedSignals: 0

    };

    constructor(

        private readonly configuration:

        TradingEngineConfiguration,

        private readonly strategy: Strategy,

        private readonly riskManager: RiskManager,

        private readonly execution: ExecutionService,

        private readonly portfolio: PortfolioManager,

        private readonly session: TradingSession,

        private readonly scheduler: TradingScheduler

    ) {

        super();

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public statistics():

    Readonly<TradingEngineMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                             START                                          */
/* -------------------------------------------------------------------------- */

    public async start():

    Promise<void> {

        if (

            !this.enabled()

        ) {

            return;

        }

        await this.session.start();

        this.scheduler.start();

        this.emit(

            "started"

        );

    }

/* -------------------------------------------------------------------------- */
/*                              STOP                                          */
/* -------------------------------------------------------------------------- */

    public async stop():

    Promise<void> {

        this.scheduler.stop();

        await this.session.stop();

        this.emit(

            "stopped"

        );

    }

/* -------------------------------------------------------------------------- */
/*                         TRADING CYCLE                                      */
/* -------------------------------------------------------------------------- */

    public async executeCycle(

    ): Promise<void> {

        this.metrics.cycles++;

        this.metrics.lastCycle =

            new Date();

        const signal =

            await this.strategy.evaluate({

                positions:

                    this.portfolio.positions(),

                balance:

                    this.portfolio.currentBalance()

            });

        if (

            signal === null

        ) {

            return;

        }

        await this.processSignal(

            signal

        );

    }

/* -------------------------------------------------------------------------- */
/*                        SIGNAL PIPELINE                                     */
/* -------------------------------------------------------------------------- */

    protected async processSignal(

        signal: TradingSignal

    ): Promise<void> {

        const decision =

            await this.riskManager.evaluate({

                signal,

                balance:

                    this.portfolio.currentBalance()!,

                positions:

                    this.portfolio.positions(),

                dailyLoss: 0

            });

        if (

            !decision.approved

        ) {

            this.metrics.rejectedSignals++;

            this.emit(

                "signalRejected",

                decision

            );

            return;

        }

        const execution =

            await this.execution.execute(

                signal

            );

        if (

            execution.success

        ) {

            this.metrics.executedTrades++;

        }

        this.emit(

            "signalExecuted",

            execution

        );

    }
    /* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            this.enabled() &&

            this.session.healthy() &&

            this.scheduler

            /* -------------------------------------------------------------------------- */
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public isRunning(): boolean {

        return this.session.isRunning();

    }

    public isStopped(): boolean {

        return this.session.isStopped();

    }

/* -------------------------------------------------------------------------- */
/*                             RESET                                          */
/* -------------------------------------------------------------------------- */

    public reset(): void {

        this.metrics.cycles = 0;

        this.metrics.executedTrades = 0;

        this.metrics.rejectedSignals = 0;

        this.metrics.lastCycle = undefined;

        this.execution.reset();

        this.portfolio.reset();

        this.scheduler.reset();

        this.session.reset();

        this.emit(

            "reset"

        );

    }

/* -------------------------------------------------------------------------- */
/*                           CLEANUP                                          */
/* -------------------------------------------------------------------------- */

    public async destroy():

    Promise<void> {

        await this.stop();

        this.reset();

        this.removeAllListeners();

    }

}

/* -------------------------------------------------------------------------- */
/*                             FACTORY                                        */
/* -------------------------------------------------------------------------- */

export function createTradingEngine(

    configuration: TradingEngineConfiguration,

    strategy: Strategy,

    riskManager: RiskManager,

    execution: ExecutionService,

    portfolio: PortfolioManager,

    session: TradingSession,

    scheduler: TradingScheduler

): TradingEngine {

    return new TradingEngine(

        configuration,

        strategy,

        riskManager,

        execution,

        portfolio,

        session,

        scheduler

    );

}