/**
 * ============================================================================
 * WALLET SERVICE
 * ============================================================================
 * Handles wallet operations for the betting platform.
 * ============================================================================
 */

import {

    ApiClient

} from "./client";

/* -------------------------------------------------------------------------- */
/* WALLET                                                                     */
/* -------------------------------------------------------------------------- */

export interface Wallet {

    readonly id: string;

    readonly currency: string;

    readonly balance: number;

    readonly availableBalance: number;

    readonly lockedBalance: number;

    readonly updatedAt: string;

}

/* -------------------------------------------------------------------------- */
/* TRANSACTION                                                                */
/* -------------------------------------------------------------------------- */

export interface WalletTransaction {

    readonly id: string;

    readonly type:

        | "deposit"

        | "withdraw"

        | "bet"

        | "win"

        | "refund"

        | "bonus"

        | "adjustment";

    readonly amount: number;

    readonly balance: number;

    readonly description: string;

    readonly createdAt: string;

}

/* -------------------------------------------------------------------------- */
/* DEPOSIT                                                                    */
/* -------------------------------------------------------------------------- */

export interface DepositRequest {

    readonly amount: number;

    readonly paymentMethod: string;

}

/* -------------------------------------------------------------------------- */
/* WITHDRAW                                                                   */
/* -------------------------------------------------------------------------- */

export interface WithdrawRequest {

    readonly amount: number;

    readonly destination: string;

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface WalletConfiguration {

    readonly autoRefresh: boolean;

    readonly refreshInterval: number;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface WalletMetrics {

    refreshes: number;

    deposits: number;

    withdrawals: number;

    transactionsLoaded: number;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export class WalletService {

    private wallet?:

    Wallet;

    private readonly metrics:

    WalletMetrics = {

        refreshes: 0,

        deposits: 0,

        withdrawals: 0,

        transactionsLoaded: 0

    };

    constructor(

        private readonly api:

        ApiClient,

        private readonly configuration:

        WalletConfiguration

    ) {

    }

    public statistics():

    Readonly<WalletMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                            LOAD WALLET                                     */
/* -------------------------------------------------------------------------- */

    public async load():

    Promise<Wallet> {

        const response =

            await this.api.get<

                Wallet

            >(

                "/wallet"

            );

        this.wallet =

            response.data;

        this.metrics.refreshes++;

        return this.wallet;

    }

/* -------------------------------------------------------------------------- */
/*                           REFRESH WALLET                                   */
/* -------------------------------------------------------------------------- */

    public async refresh():

    Promise<Wallet> {

        return this.load();

    }

/* -------------------------------------------------------------------------- */
/*                              DEPOSIT                                       */
/* -------------------------------------------------------------------------- */

    public async deposit(

        request:

        DepositRequest

    ): Promise<Wallet> {

        const response =

            await this.api.post<

                Wallet,

                DepositRequest

            >(

                "/wallet/deposit",

                request

            );

        this.wallet =

            response.data;

        this.metrics.deposits++;

        return this.wallet;

    }

/* -------------------------------------------------------------------------- */
/*                              WITHDRAW                                      */
/* -------------------------------------------------------------------------- */

    public async withdraw(

        request:

        WithdrawRequest

    ): Promise<Wallet> {

        const response =

            await this.api.post<

                Wallet,

                WithdrawRequest

            >(

                "/wallet/withdraw",

                request

            );

        this.wallet =

            response.data;

        this.metrics.withdrawals++;

        return this.wallet;

    }

/* -------------------------------------------------------------------------- */
/*                        TRANSACTION HISTORY                                 */
/* -------------------------------------------------------------------------- */

    public async transactions():

    Promise<

        readonly WalletTransaction[]

    > {

        const response =

            await this.api.get<

                readonly WalletTransaction[]

            >(

                "/wallet/transactions"

            );

        this.metrics.transactionsLoaded +=

            response.data.length;

        return response.data;

    }

/* -------------------------------------------------------------------------- */
/*                          CURRENT WALLET                                    */
/* -------------------------------------------------------------------------- */

    public current():

    Wallet | undefined {

        return this.wallet;

    }

/* -------------------------------------------------------------------------- */
/*                        HAS WALLET                                          */
/* -------------------------------------------------------------------------- */

    public hasWallet():

    boolean {

        return (

            this.wallet !==

            undefined

        );

    }
    /* -------------------------------------------------------------------------- */
/*                          AUTO REFRESH                                      */
/* -------------------------------------------------------------------------- */

    private refreshTimer?:

    ReturnType<typeof setInterval>;

/* -------------------------------------------------------------------------- */
/*                        START AUTO REFRESH                                  */
/* -------------------------------------------------------------------------- */

    public startAutoRefresh():

    void {

        if (

            !this.configuration.autoRefresh ||

            this.refreshTimer

        ) {

            return;

        }

        this.refreshTimer =

            setInterval(

                () => {

                    void this.refresh();

                },

                this.configuration

                    .refreshInterval

            );

    }

/* -------------------------------------------------------------------------- */
/*                        STOP AUTO REFRESH                                   */
/* -------------------------------------------------------------------------- */

    public stopAutoRefresh():

    void {

        if (

            !this.refreshTimer

        ) {

            return;

        }

        clearInterval(

            this.refreshTimer

        );

        this.refreshTimer =

            undefined;

    }

/* -------------------------------------------------------------------------- */
/*                        BALANCE HELPERS                                     */
/* -------------------------------------------------------------------------- */

    public balance():

    number {

        return (

            this.wallet?.balance ??

            0

        );

    }

    public availableBalance():

    number {

        return (

            this.wallet?.availableBalance ??

            0

        );

    }

    public lockedBalance():

    number {

        return (

            this.wallet?.lockedBalance ??

            0

        );

    }

/* -------------------------------------------------------------------------- */
/*                              HEALTH                                        */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.wallet !==

            undefined

        );

    }

/* -------------------------------------------------------------------------- */
/*                          INFORMATION                                       */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            loaded:

                this.hasWallet(),

            currency:

                this.wallet?.currency,

            balance:

                this.balance(),

            availableBalance:

                this.availableBalance(),

            lockedBalance:

                this.lockedBalance(),

            autoRefresh:

                this.configuration.autoRefresh,

            refreshInterval:

                this.configuration.refreshInterval,

            metrics:

                this.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                          DIAGNOSTICS                                       */
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
/*                               RESET                                        */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.stopAutoRefresh();

        this.wallet =

            undefined;

        this.metrics.refreshes = 0;

        this.metrics.deposits = 0;

        this.metrics.withdrawals = 0;

        this.metrics.transactionsLoaded = 0;

    }

/* -------------------------------------------------------------------------- */
/*                           STATE HELPERS                                    */
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
/*                          CONFIGURATION                                     */
/* -------------------------------------------------------------------------- */

    public settings():

    Readonly<WalletConfiguration> {

        return Object.freeze({

            ...this.configuration

        });

    }

/* -------------------------------------------------------------------------- */
/*                             CLEANUP                                        */
/* -------------------------------------------------------------------------- */

    public destroy():

    void {

        this.stopAutoRefresh();

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

        "Wallet Service";

}

/* -------------------------------------------------------------------------- */
/*                              FACTORY                                       */
/* -------------------------------------------------------------------------- */

export function createWalletService(

    api:

    ApiClient,

    configuration:

    WalletConfiguration

): WalletService {

    return new WalletService(

        api,

        configuration

    );

}