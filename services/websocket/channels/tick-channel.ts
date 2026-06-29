/**
 * ============================================================================
 * TICK CHANNEL
 * ============================================================================
 * Handles realtime tick subscriptions.
 * ============================================================================
 */

import { BaseChannel } from "./base-channel";
import { WebSocketManager } from "../manager";
import { WebSocketMessage } from "../types";
import { messageFactory } from "../message";
import { logger } from "../logger";

/* -------------------------------------------------------------------------- */
/*                             TYPES                                          */
/* -------------------------------------------------------------------------- */

export interface Tick {

    symbol: string;

    price: number;

    bid?: number;

    ask?: number;

    epoch: number;

    quoteTime: Date;

}

/* -------------------------------------------------------------------------- */
/*                           CHANNEL                                          */
/* -------------------------------------------------------------------------- */

export class TickChannel extends BaseChannel<Tick> {

    private symbol?: string;

    constructor(

        manager: WebSocketManager

    ) {

        super(

            manager,

            "tick"

        );

        this.initialize();

    }

    /* ---------------------------------------------------------------------- */
    /*                       SUBSCRIBE                                        */
    /* ---------------------------------------------------------------------- */

    public async subscribe(

        symbol: string

    ): Promise<void> {

        this.ensureConnected();

        this.symbol = symbol;

        const message =

            messageFactory.request(

                "subscribe",

                {

                    ticks: symbol

                },

                this.name()

            );

        await this.subscribeInternal(

            message

        );

        await this.onSubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                     UNSUBSCRIBE                                        */
    /* ---------------------------------------------------------------------- */

    public async unsubscribe():

    Promise<void> {

        this.ensureConnected();

        if (!this.symbol) {

            return;

        }

        const message =

            messageFactory.request(

                "unsubscribe",

                {

                    ticks: this.symbol

                },

                this.name()

            );

        await this.unsubscribeInternal(

            message

        );

        this.symbol = undefined;

        await this.onUnsubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                    MESSAGE HANDLER                                     */
    /* ---------------------------------------------------------------------- */

    protected async handleMessage(

        message: WebSocketMessage<Tick>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        this.emitSafe(

            message.payload

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                    PAYLOAD VALIDATION                                  */
    /* ---------------------------------------------------------------------- */

    private validateTick(

        tick: Tick

    ): boolean {

        return (

            typeof tick.symbol === "string" &&

            typeof tick.price === "number" &&

            typeof tick.epoch === "number" &&

            tick.quoteTime instanceof Date

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     SYMBOL MANAGEMENT                                  */
    /* ---------------------------------------------------------------------- */

    public currentSymbol():

    string | undefined {

        return this.symbol;

    }

    public async switchSymbol(

        symbol: string

    ): Promise<void> {

        if (

            this.symbol === symbol

        ) {

            return;

        }

        if (

            this.isSubscribed()

        ) {

            await this.unsubscribe();

        }

        await this.subscribe(symbol);

    }

    /* ---------------------------------------------------------------------- */
    /*                  AUTOMATIC RECONNECT                                   */
    /* ---------------------------------------------------------------------- */

    public async reconnect():

    Promise<void> {

        if (

            !this.symbol

        ) {

            return;

        }

        logger.info(

            `Restoring tick subscription for '${this.symbol}'.`

        );

        await this.subscribe(

            this.symbol

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      INFORMATION                                        */
    /* ---------------------------------------------------------------------- */

    public statistics() {

        return {

            ...super.statistics(),

            symbol: this.symbol

        };

    }

    public information() {

        return {

            ...super.information(),

            symbol: this.symbol

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                        HEALTH                                           */
    /* ---------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            super.healthy() &&

            this.symbol !== undefined

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      LOGGING                                            */
    /* ---------------------------------------------------------------------- */

    protected override async onSubscribed():

    Promise<void> {

        logger.info(

            `Tick subscription established for '${this.symbol}'.`

        );

    }

    protected override async onUnsubscribed():

    Promise<void> {

        logger.info(

            "Tick subscription closed."

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                       LAST TICK                                        */
    /* ---------------------------------------------------------------------- */

    private lastTick?: Tick;

    public latest():

    Tick | undefined {

        return this.lastTick;

    }

    /* ---------------------------------------------------------------------- */
    /*                       HISTORY BUFFER                                   */
    /* ---------------------------------------------------------------------- */

    private readonly history: Tick[] = [];

    private readonly maximumHistory = 500;

    private remember(

        tick: Tick

    ): void {

        this.lastTick = tick;

        this.history.push(tick);

        if (

            this.history.length >

            this.maximumHistory

        ) {

            this.history.shift();

        }

    }

    public recentTicks():

    readonly Tick[] {

        return [...this.history];

    }

    /* ---------------------------------------------------------------------- */
    /*                       PRICE HELPERS                                    */
    /* ---------------------------------------------------------------------- */

    public latestPrice():

    number | undefined {

        return this.lastTick?.price;

    }

    public hasTick(): boolean {

        return this.lastTick !== undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                     FILTERING                                          */
    /* ---------------------------------------------------------------------- */

    public filter(

        predicate: (

            tick: Tick

        ) => boolean

    ): Tick[] {

        return this.history.filter(predicate);

    }

    /* ---------------------------------------------------------------------- */
    /*                     HANDLE TICK                                        */
    /* ---------------------------------------------------------------------- */

    protected override async handleMessage(

        message: WebSocketMessage<Tick>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        if (

            !this.validateTick(

                message.payload

            )

        ) {

            logger.warn(

                "Invalid tick payload received."

            );

            return;

        }

        this.remember(

            message.payload

        );

        this.emitSafe(

            message.payload

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                       RESET                                            */
    /* ---------------------------------------------------------------------- */

    public override reset(): void {

        super.reset();

        this.symbol = undefined;

        this.lastTick = undefined;

        this.history.length = 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                      INFORMATION                                       */
    /* ---------------------------------------------------------------------- */

    public override information() {

        return {

            ...super.information(),

            symbol: this.symbol,

            lastPrice: this.latestPrice(),

            cachedTicks: this.history.length

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                      CLEAR HISTORY                                     */
    /* ---------------------------------------------------------------------- */

    public clearHistory(): void {

        this.history.length = 0;

        this.lastTick = undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                      CACHE INFORMATION                                 */
    /* ---------------------------------------------------------------------- */

    public cacheSize(): number {

        return this.history.length;

    }

    public hasHistory(): boolean {

        return this.history.length > 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                     EXPORT HISTORY                                     */
    /* ---------------------------------------------------------------------- */

    public exportHistory():

    readonly Tick[] {

        return Object.freeze(

            [...this.history]

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     DESTROY                                            */
    /* ---------------------------------------------------------------------- */

    public override destroy(): void {

        this.clearHistory();

        this.symbol = undefined;

        super.destroy();

        logger.info(

            "Tick channel destroyed."

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                         FACTORY                                            */
/* -------------------------------------------------------------------------- */

export function createTickChannel(

    manager: WebSocketManager

): TickChannel {

    return new TickChannel(

        manager

    );

}