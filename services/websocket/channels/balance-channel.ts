/**
 * ============================================================================
 * BALANCE CHANNEL
 * ============================================================================
 * Handles realtime account balance updates.
 * ============================================================================
 */

import { BaseChannel } from "./base-channel";
import { WebSocketManager } from "../manager";
import { WebSocketMessage } from "../types";
import { messageFactory } from "../message";
import { logger } from "../logger";

import {

    Balance

} from "../../models/balance";

/* -------------------------------------------------------------------------- */
/*                           CHANNEL                                          */
/* -------------------------------------------------------------------------- */

export class BalanceChannel extends BaseChannel<Balance> {

    private currentBalance?: Balance;

    constructor(

        manager: WebSocketManager

    ) {

        super(

            manager,

            "balance"

        );

        this.initialize();

    }

    /* ---------------------------------------------------------------------- */
    /*                     SUBSCRIBE                                          */
    /* ---------------------------------------------------------------------- */

    public async subscribe():

    Promise<void> {

        this.ensureConnected();

        const message =

            messageFactory.request(

                "balance",

                {

                    subscribe: 1

                },

                this.name()

            );

        await this.subscribeInternal(

            message

        );

        await this.onSubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                   UNSUBSCRIBE                                          */
    /* ---------------------------------------------------------------------- */

    public async unsubscribe():

    Promise<void> {

        this.ensureConnected();

        const message =

            messageFactory.request(

                "forget",

                {

                    stream: "balance"

                },

                this.name()

            );

        await this.unsubscribeInternal(

            message

        );

        this.currentBalance =

            undefined;

        await this.onUnsubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                     HANDLE MESSAGE                                     */
    /* ---------------------------------------------------------------------- */

    protected async handleMessage(

        message: WebSocketMessage<Balance>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        this.currentBalance =

            message.payload;

        this.emitSafe(

            message.payload

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                     VALIDATION                                         */
    /* ---------------------------------------------------------------------- */

    private validateBalance(

        balance: Balance

    ): boolean {

        return (

            typeof balance.balance === "number" &&

            typeof balance.currency === "string"

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     ACCESSORS                                          */
    /* ---------------------------------------------------------------------- */

    public latest():

    Balance | undefined {

        return this.currentBalance;

    }

    public amount():

    number | undefined {

        return this.currentBalance?.balance;

    }

    public currency():

    string | undefined {

        return this.currentBalance?.currency;

    }

    public available():

    number | undefined {

        return this.currentBalance?.available;

    }

    public equity():

    number | undefined {

        return this.currentBalance?.equity;

    }

    /* ---------------------------------------------------------------------- */
    /*                     STATUS                                             */
    /* ---------------------------------------------------------------------- */

    public hasBalance(): boolean {

        return this.currentBalance !== undefined;

    }

    public hasFunds(

        amount: number

    ): boolean {

        const available =

            this.available() ??

            this.amount();

        if (

            available === undefined

        ) {

            return false;

        }

        return available >= amount;

    }

    /* ---------------------------------------------------------------------- */
    /*                     INFORMATION                                        */
    /* ---------------------------------------------------------------------- */

    public override statistics() {

        return {

            ...super.statistics(),

            hasBalance:

                this.hasBalance(),

            currency:

                this.currency()

        };

    }

    public override healthy(): boolean {

        return (

            super.healthy() &&

            this.hasBalance()

        );

    }

    protected override async onSubscribed():

    Promise<void> {

        logger.info(

            "Balance subscription established."

        );

    }

    protected override async onUnsubscribed():

    Promise<void> {

        logger.info(

            "Balance subscription closed."

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                    PREVIOUS BALANCE                                    */
    /* ---------------------------------------------------------------------- */

    private previousBalance?: Balance;

    public previous():

    Balance | undefined {

        return this.previousBalance;

    }

    /* ---------------------------------------------------------------------- */
    /*                    CHANGE DETECTION                                    */
    /* ---------------------------------------------------------------------- */

    public hasChanged(): boolean {

        if (

            !this.previousBalance ||

            !this.currentBalance

        ) {

            return false;

        }

        return (

            this.previousBalance.balance !==

            this.currentBalance.balance

        );

    }

    public difference():

    number | undefined {

        if (

            !this.previousBalance ||

            !this.currentBalance

        ) {

            return undefined;

        }

        return (

            this.currentBalance.balance -

            this.previousBalance.balance

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    HANDLE MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    protected override async handleMessage(

        message: WebSocketMessage<Balance>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const balance =

            message.payload;

        if (

            !this.validateBalance(

                balance

            )

        ) {

            logger.warn(

                "Invalid balance update received."

            );

            return;

        }

        this.previousBalance =

            this.currentBalance;

        this.currentBalance =

            balance;

        this.emitSafe(

            balance

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    RESET                                               */
    /* ---------------------------------------------------------------------- */

    public override reset(): void {

        super.reset();

        this.previousBalance = undefined;

        this.currentBalance = undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override information() {

        return {

            ...super.information(),

            balance:

                this.amount(),

            currency:

                this.currency(),

            difference:

                this.difference(),

            changed:

                this.hasChanged()

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                    EXPORT                                              */
    /* ---------------------------------------------------------------------- */

    public export():

    Readonly<Balance> | undefined {

        if (

            !this.currentBalance

        ) {

            return undefined;

        }

        return Object.freeze(

            {

                ...this.currentBalance

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    CLEAR                                               */
    /* ---------------------------------------------------------------------- */

    public clear(): void {

        this.previousBalance = undefined;

        this.currentBalance = undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                    DESTROY                                             */
    /* ---------------------------------------------------------------------- */

    public override destroy(): void {

        this.clear();

        super.destroy();

        logger.info(

            "Balance channel destroyed."

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                     FACTORY                                                */
/* -------------------------------------------------------------------------- */

export function createBalanceChannel(

    manager: WebSocketManager

): BalanceChannel {

    return new BalanceChannel(

        manager

    );

}