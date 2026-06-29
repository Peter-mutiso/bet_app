/**
 * ============================================================================
 * BET SERVICE
 * ============================================================================
 * Handles bet creation, retrieval and management.
 * ============================================================================
 */

import {

    ApiClient

} from "./client";

import {

    WalletService

} from "./wallet";

/* -------------------------------------------------------------------------- */
/* BET STATUS                                                                 */
/* -------------------------------------------------------------------------- */

export enum BetStatus {

    PENDING = "PENDING",

    OPEN = "OPEN",

    WON = "WON",

    LOST = "LOST",

    CANCELLED = "CANCELLED",

    CASHED_OUT = "CASHED_OUT"

}

/* -------------------------------------------------------------------------- */
/* BET                                                                        */
/* -------------------------------------------------------------------------- */

export interface Bet {

    readonly id: string;

    readonly marketId: string;

    readonly selectionId: string;

    readonly stake: number;

    readonly odds: number;

    readonly potentialPayout: number;

    readonly status: BetStatus;

    readonly createdAt: string;

    readonly settledAt?: string;

}

/* -------------------------------------------------------------------------- */
/* PLACE BET                                                                  */
/* -------------------------------------------------------------------------- */

export interface PlaceBetRequest {

    readonly marketId: string;

    readonly selectionId: string;

    readonly stake: number;

}

/* -------------------------------------------------------------------------- */
/* CASHOUT                                                                    */
/* -------------------------------------------------------------------------- */

export interface CashOutResponse {

    readonly bet: Bet;

    readonly amount: number;

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface BetConfiguration {

    readonly validateStake: boolean;

    readonly minimumStake: number;

    readonly maximumStake: number;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface BetMetrics {

    placed: number;

    cancelled: number;

    cashedOut: number;

    loaded: number;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export class BetService {

    private readonly metrics:

    BetMetrics = {

        placed: 0,

        cancelled: 0,

        cashedOut: 0,

        loaded: 0

    };

    private active:

    Bet[] = [];

    constructor(

        private readonly api:

        ApiClient,

        private readonly wallet:

        WalletService,

        private readonly configuration:

        BetConfiguration

    ) {

    }

    public statistics():

    Readonly<BetMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                           VALIDATE STAKE                                   */
/* -------------------------------------------------------------------------- */

    public validateStake(

        stake: number

    ): void {

        if (

            !this.configuration.validateStake

        ) {

            return;

        }

        if (

            stake <

            this.configuration.minimumStake

        ) {

            throw new Error(

                "Stake is below the minimum allowed."

            );

        }

        if (

            stake >

            this.configuration.maximumStake

        ) {

            throw new Error(

                "Stake exceeds the maximum allowed."

            );

        }

        if (

            stake >

            this.wallet.availableBalance()

        ) {

            throw new Error(

                "Insufficient wallet balance."

            );

        }

    }

/* -------------------------------------------------------------------------- */
/*                             PLACE BET                                      */
/* -------------------------------------------------------------------------- */

    public async place(

        request:

        PlaceBetRequest

    ): Promise<Bet> {

        this.validateStake(

            request.stake

        );

        const response =

            await this.api.post<

                Bet,

                PlaceBetRequest

            >(

                "/bets",

                request

            );

        this.active.push(

            response.data

        );

        this.metrics.placed++;

        await this.wallet.refresh();

        return response.data;

    }

/* -------------------------------------------------------------------------- */
/*                        ACTIVE BETS                                         */
/* -------------------------------------------------------------------------- */

    public async loadActive():

    Promise<readonly Bet[]> {

        const response =

            await this.api.get<

                Bet[]

            >(

                "/bets/active"

            );

        this.active =

            [...response.data];

        this.metrics.loaded +=

            response.data.length;

        return this.active;

    }

/* -------------------------------------------------------------------------- */
/*                         BET HISTORY                                        */
/* -------------------------------------------------------------------------- */

    public async history():

    Promise<readonly Bet[]> {

        const response =

            await this.api.get<

                Bet[]

            >(

                "/bets/history"

            );

        return response.data;

    }

/* -------------------------------------------------------------------------- */
/*                          CANCEL BET                                        */
/* -------------------------------------------------------------------------- */

    public async cancel(

        betId: string

    ): Promise<Bet> {

        const response =

            await this.api.post<

                Bet,

                {}

            >(

                `/bets/${betId}/cancel`,

                {}

            );

        this.active =

            this.active.filter(

                bet =>

                    bet.id !==

                    betId

            );

        this.metrics.cancelled++;

        await this.wallet.refresh();

        return response.data;

    }

/* -------------------------------------------------------------------------- */
/*                          CASH OUT                                          */
/* -------------------------------------------------------------------------- */

    public async cashOut(

        betId: string

    ): Promise<CashOutResponse> {

        const response =

            await this.api.post<

                CashOutResponse,

                {}

            >(

                `/bets/${betId}/cashout`,

                {}

            );

        this.active =

            this.active.filter(

                bet =>

                    bet.id !==

                    betId

            );

        this.metrics.cashedOut++;

        await this.wallet.refresh();

        return response.data;

    }

/* -------------------------------------------------------------------------- */
/*                       CURRENT ACTIVE BETS                                  */
/* -------------------------------------------------------------------------- */

    public activeBets():

    readonly Bet[] {

        return Object.freeze(

            [...this.active]

        );

    }
    /* -------------------------------------------------------------------------- */
/*                           FIND BET                                         */
/* -------------------------------------------------------------------------- */

    public find(

        betId: string

    ): Bet | undefined {

        return this.active.find(

            bet =>

                bet.id ===

                betId

        );

    }

/* -------------------------------------------------------------------------- */
/*                         STATUS FILTERS                                     */
/* -------------------------------------------------------------------------- */

    public byStatus(

        status: BetStatus

    ): readonly Bet[] {

        return this.active.filter(

            bet =>

                bet.status ===

                status

        );

    }

    public openBets():

    readonly Bet[] {

        return this.byStatus(

            BetStatus.OPEN

        );

    }

    public pendingBets():

    readonly Bet[] {

        return this.byStatus(

            BetStatus.PENDING

        );

    }

/* -------------------------------------------------------------------------- */
/*                     UPDATE ACTIVE BET                                      */
/* -------------------------------------------------------------------------- */

    public update(

        bet:

        Bet

    ): void {

        const index =

            this.active.findIndex(

                current =>

                    current.id ===

                    bet.id

            );

        if (

            index >= 0

        ) {

            this.active[index] =

                bet;

        }

        else {

            this.active.push(

                bet

            );

        }

    }

/* -------------------------------------------------------------------------- */
/*                     REMOVE ACTIVE BET                                      */
/* -------------------------------------------------------------------------- */

    public remove(

        betId: string

    ): void {

        this.active =

            this.active.filter(

                bet =>

                    bet.id !==

                    betId

            );

    }

/* -------------------------------------------------------------------------- */
/*                          HEALTH                                            */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return true;

    }

/* -------------------------------------------------------------------------- */
/*                        INFORMATION                                         */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            activeBets:

                this.active.length,

            openBets:

                this.openBets().length,

            pendingBets:

                this.pendingBets().length,

            walletLoaded:

                this.wallet.hasWallet(),

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

            information:

                this.information()

        });

    }
    /* -------------------------------------------------------------------------- */
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.active = [];

        this.metrics.placed = 0;

        this.metrics.cancelled = 0;

        this.metrics.cashedOut = 0;

        this.metrics.loaded = 0;

    }

/* -------------------------------------------------------------------------- */
/*                          CONFIGURATION                                     */
/* -------------------------------------------------------------------------- */

    public settings():

    Readonly<BetConfiguration> {

        return Object.freeze({

            ...this.configuration

        });

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
/*                           CACHE                                             */
/* -------------------------------------------------------------------------- */

    public clearCache():

    void {

        this.active = [];

    }

/* -------------------------------------------------------------------------- */
/*                            CLEANUP                                         */
/* -------------------------------------------------------------------------- */

    public destroy():

    void {

        this.clearCache();

        this.reset();

    }

/* -------------------------------------------------------------------------- */
/*                              VERSION                                       */
/* -------------------------------------------------------------------------- */

    public static readonly VERSION =

        "1.0.0";

/* -------------------------------------------------------------------------- */
/*                              MODULE                                        */
/* -------------------------------------------------------------------------- */

    public static readonly MODULE =

        "Bet Service";

}

/* -------------------------------------------------------------------------- */
/*                              FACTORY                                       */
/* -------------------------------------------------------------------------- */

export function createBetService(

    api:

    ApiClient,

    wallet:

    WalletService,

    configuration:

    BetConfiguration

): BetService {

    return new BetService(

        api,

        wallet,

        configuration

    );

}