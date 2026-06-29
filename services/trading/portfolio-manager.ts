/**
 * ============================================================================
 * PORTFOLIO MANAGER
 * ============================================================================
 * Maintains the local representation of the trading account.
 * ============================================================================
 */

import { EventEmitter } from "events";

import { Position } from "../../models/position";

import { Balance } from "../../models/balance";

/* -------------------------------------------------------------------------- */
/*                        CONFIGURATION                                       */
/* -------------------------------------------------------------------------- */

export interface PortfolioConfiguration {

    readonly enabled: boolean;

    readonly synchronizeAutomatically: boolean;

}

/* -------------------------------------------------------------------------- */
/*                         STATISTICS                                         */
/* -------------------------------------------------------------------------- */

export interface PortfolioStatistics {

    openPositions: number;

    closedPositions: number;

    realizedProfit: number;

    unrealizedProfit: number;

    totalTrades: number;

    wins: number;

    losses: number;

}

/* -------------------------------------------------------------------------- */
/*                          PORTFOLIO STATE                                   */
/* -------------------------------------------------------------------------- */

export enum PortfolioState {

    CREATED = "CREATED",

    SYNCHRONIZING = "SYNCHRONIZING",

    READY = "READY",

    ERROR = "ERROR"

}

/* -------------------------------------------------------------------------- */
/*                       PORTFOLIO MANAGER                                    */
/* -------------------------------------------------------------------------- */

export class PortfolioManager

extends EventEmitter {

    private readonly openPositions =

        new Map<string, Position>();

    private readonly closedPositions:

    Position[] = [];

    private balance?: Balance;

    private state =

        PortfolioState.CREATED;

    private readonly statistics:

    PortfolioStatistics = {

        openPositions: 0,

        closedPositions: 0,

        realizedProfit: 0,

        unrealizedProfit: 0,

        totalTrades: 0,

        wins: 0,

        losses: 0

    };

    constructor(

        private readonly configuration:

        PortfolioConfiguration

    ) {

        super();

    }

    public enabled(): boolean {

        return this.configuration.enabled;

    }

    public currentState():

    PortfolioState {

        return this.state;

    }

}
/* -------------------------------------------------------------------------- */
/*                          BALANCE                                           */
/* -------------------------------------------------------------------------- */

    public updateBalance(

        balance: Balance

    ): void {

        this.balance = balance;

        this.emit(

            "balanceUpdated",

            balance

        );

    }

    public currentBalance():

    Balance | undefined {

        return this.balance;

    }

/* -------------------------------------------------------------------------- */
/*                     OPEN POSITIONS                                         */
/* -------------------------------------------------------------------------- */

    public openPosition(

        position: Position

    ): void {

        this.openPositions.set(

            position.id,

            position

        );

        this.statistics.openPositions =

            this.openPositions.size;

        this.statistics.totalTrades++;

        this.emit(

            "positionOpened",

            position

        );

    }

    public position(

        id: string

    ): Position | undefined {

        return this.openPositions.get(

            id

        );

    }

    public positions():

    readonly Position[] {

        return [

            ...this.openPositions.values()

        ];

    }

/* -------------------------------------------------------------------------- */
/*                    CLOSE POSITION                                          */
/* -------------------------------------------------------------------------- */

    public closePosition(

        id: string,

        profit: number

    ): Position | undefined {

        const position =

            this.openPositions.get(

                id

            );

        if (

            !position

        ) {

            return undefined;

        }

        this.openPositions.delete(

            id

        );

        this.closedPositions.push(

            position

        );

        this.statistics.openPositions =

            this.openPositions.size;

        this.statistics.closedPositions =

            this.closedPositions.length;

        this.statistics.realizedProfit +=

            profit;

        if (

            profit >= 0

        ) {

            this.statistics.wins++;

        }

        else {

            this.statistics.losses++;

        }

        this.emit(

            "positionClosed",

            {

                position,

                profit

            }

        );

        return position;

    }

/* -------------------------------------------------------------------------- */
/*                        SYNCHRONIZATION                                     */
/* -------------------------------------------------------------------------- */

    public synchronize(

        balance: Balance,

        positions: readonly Position[]

    ): void {

        this.state =

            PortfolioState.SYNCHRONIZING;

        this.balance = balance;

        this.openPositions.clear();

        for (

            const position of positions

        ) {

            this.openPositions.set(

                position.id,

                position

            );

        }

        this.statistics.openPositions =

            this.openPositions.size;

        this.state =

            PortfolioState.READY;

        this.emit(

            "synchronized"

        );

    }
    /* -------------------------------------------------------------------------- */
/*                      PROFIT & LOSS                                         */
/* -------------------------------------------------------------------------- */

    public realizedProfit(): number {

        return this.statistics.realizedProfit;

    }

    public unrealizedProfit(): number {

        return this.statistics.unrealizedProfit;

    }

    public totalProfit(): number {

        return (

            this.statistics.realizedProfit +

            this.statistics.unrealizedProfit

        );

    }

/* -------------------------------------------------------------------------- */
/*                         WIN RATE                                           */
/* -------------------------------------------------------------------------- */

    public winRate(): number {

        const completed =

            this.statistics.wins +

            this.statistics.losses;

        if (

            completed === 0

        ) {

            return 0;

        }

        return (

            this.statistics.wins /

            completed

        ) * 100;

    }

/* -------------------------------------------------------------------------- */
/*                    POSITION FILTERING                                      */
/* -------------------------------------------------------------------------- */

    public positionsForSymbol(

        symbol: string

    ): Position[] {

        return this.positions().filter(

            position =>

                position.symbol === symbol

        );

    }

/* -------------------------------------------------------------------------- */
/*                       PORTFOLIO EXPOSURE                                   */
/* -------------------------------------------------------------------------- */

    public exposure(): number {

        return this.positions()

            .reduce(

                (

                    total,

                    position

                ) =>

                    total +

                    position.amount,

                0

            );

    }

/* -------------------------------------------------------------------------- */
/*                    PERFORMANCE METRICS                                     */
/* -------------------------------------------------------------------------- */

    public averageProfit(): number {

        const completed =

            this.statistics.wins +

            this.statistics.losses;

        if (

            completed === 0

        ) {

            return 0;

        }

        return (

            this.statistics.realizedProfit /

            completed

        );

    }

/* -------------------------------------------------------------------------- */
/*                         HEALTH                                             */
/* -------------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            this.enabled() &&

            this.state !==

            PortfolioState.ERROR

        );

    }

/* -------------------------------------------------------------------------- */
/*                         STATISTICS                                         */
/* -------------------------------------------------------------------------- */

    public metrics():

    Readonly<PortfolioStatistics> {

        return Object.freeze({

            ...this.statistics

        });

    }
    /* -------------------------------------------------------------------------- */
/*                           INFORMATION                                      */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            state:

                this.state,

            enabled:

                this.enabled(),

            balance:

                this.balance,

            openPositions:

                this.openPositions.size,

            closedPositions:

                this.closedPositions.length,

            configuration:

                this.configuration

        });

    }

/* -------------------------------------------------------------------------- */
/*                           DIAGNOSTICS                                      */
/* -------------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            healthy:

                this.healthy(),

            statistics:

                this.metrics(),

            information:

                this.information()

        });

    }

/* -------------------------------------------------------------------------- */
/*                             RESET                                          */
/* -------------------------------------------------------------------------- */

    public reset(): void {

        this.openPositions.clear();

        this.closedPositions.length = 0;

        this.balance = undefined;

        this.state =

            PortfolioState.CREATED;

        this.statistics.openPositions = 0;

        this.statistics.closedPositions = 0;

        this.statistics.realizedProfit = 0;

        this.statistics.unrealizedProfit = 0;

        this.statistics.totalTrades = 0;

        this.statistics.wins = 0;

        this.statistics.losses = 0;

        this.emit(

            "reset"

        );

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
/*                             FACTORY                                        */
/* -------------------------------------------------------------------------- */

export function createPortfolioManager(

    configuration: PortfolioConfiguration

): PortfolioManager {

    return new PortfolioManager(

        configuration

    );

}