/**
 * ============================================================================
 * ORDER CHANNEL
 * ============================================================================
 * Handles trade execution and order lifecycle.
 * ============================================================================
 */

import { BaseChannel } from "./base-channel";
import { WebSocketManager } from "../manager";
import { WebSocketMessage } from "../types";
import { messageFactory } from "../message";
import { logger } from "../logger";

import {

    Order

} from "../../models/order";

/* -------------------------------------------------------------------------- */
/*                        ORDER STATES                                        */
/* -------------------------------------------------------------------------- */

export enum OrderState {

    CREATED = "CREATED",

    SUBMITTED = "SUBMITTED",

    ACCEPTED = "ACCEPTED",

    OPEN = "OPEN",

    SETTLED = "SETTLED",

    CLOSED = "CLOSED",

    CANCELLED = "CANCELLED",

    FAILED = "FAILED"

}

/* -------------------------------------------------------------------------- */
/*                        CHANNEL                                             */
/* -------------------------------------------------------------------------- */

export class OrderChannel extends BaseChannel<Order> {

    private readonly orders =

        new Map<string, Order>();

    constructor(

        manager: WebSocketManager

    ) {

        super(

            manager,

            "order"

        );

        this.initialize();

    }

    /* ---------------------------------------------------------------------- */
    /*                         PLACE ORDER                                    */
    /* ---------------------------------------------------------------------- */

    public async place(

        proposalId: string,

        price: number

    ): Promise<void> {

        this.ensureConnected();

        const message =

            messageFactory.request(

                "buy",

                {

                    proposal_id: proposalId,

                    price

                },

                this.name()

            );

        const sent =

            this.manager.send(

                message

            );

        if (!sent) {

            throw new Error(

                "Unable to place order."

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                     SUBSCRIBE                                          */
    /* ---------------------------------------------------------------------- */

    public async subscribe():

    Promise<void> {

        // Orders are event-driven.

    }

    public async unsubscribe():

    Promise<void> {

        this.orders.clear();

    }

    /* ---------------------------------------------------------------------- */
    /*                     HANDLE MESSAGE                                     */
    /* ---------------------------------------------------------------------- */

    protected async handleMessage(

        message: WebSocketMessage<Order>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const order =

            message.payload;

        this.orders.set(

            order.id,

            order

        );

        this.emitSafe(

            order

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                     ORDER STATE                                        */
    /* ---------------------------------------------------------------------- */

    private readonly states =

        new Map<string, OrderState>();

    /* ---------------------------------------------------------------------- */
    /*                     VALIDATION                                         */
    /* ---------------------------------------------------------------------- */

    private validateOrder(

        order: Order

    ): boolean {

        return (

            typeof order.id === "string" &&

            order.id.length > 0

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      LOOKUP                                            */
    /* ---------------------------------------------------------------------- */

    public get(

        id: string

    ): Order | undefined {

        return this.orders.get(id);

    }

    public has(

        id: string

    ): boolean {

        return this.orders.has(id);

    }

    public stateOf(

        id: string

    ): OrderState | undefined {

        return this.states.get(id);

    }

    public orderIds():

    readonly string[] {

        return [

            ...this.orders.keys()

        ];

    }

    /* ---------------------------------------------------------------------- */
    /*                    STATE MANAGEMENT                                    */
    /* ---------------------------------------------------------------------- */

    public setState(

        id: string,

        state: OrderState

    ): void {

        if (

            this.orders.has(id)

        ) {

            this.states.set(

                id,

                state

            );

        }

    }

    public isOpen(

        id: string

    ): boolean {

        return (

            this.states.get(id) ===

            OrderState.OPEN

        );

    }

    public openOrders():

    readonly Order[] {

        return [

            ...this.orders.values()

        ].filter(

            order =>

                this.isOpen(

                    order.id

                )

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override statistics() {

        return {

            ...super.statistics(),

            orders:

                this.orders.size,

            openOrders:

                this.openOrders().length

        };

    }

    public override healthy(): boolean {

        return super.healthy();

    }

    protected override async onSubscribed():

    Promise<void> {

        logger.info(

            "Order channel ready."

        );

    }

    protected override async onUnsubscribed():

    Promise<void> {

        logger.info(

            "Order cache cleared."

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                     LATEST ORDER                                       */
    /* ---------------------------------------------------------------------- */

    private latestOrder?: Order;

    public latest():

    Order | undefined {

        return this.latestOrder;

    }

    /* ---------------------------------------------------------------------- */
    /*                     REMOVE                                             */
    /* ---------------------------------------------------------------------- */

    public remove(

        id: string

    ): boolean {

        this.states.delete(id);

        return this.orders.delete(id);

    }

    public clear(): void {

        this.orders.clear();

        this.states.clear();

        this.latestOrder = undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                    HANDLE MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    protected override async handleMessage(

        message: WebSocketMessage<Order>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const order =

            message.payload;

        if (

            !this.validateOrder(

                order

            )

        ) {

            logger.warn(

                "Invalid order received."

            );

            return;

        }

        this.orders.set(

            order.id,

            order

        );

        if (

            "state" in order &&

            order.state

        ) {

            this.states.set(

                order.id,

                order.state as OrderState

            );

        }

        else if (

            !this.states.has(

                order.id

            )

        ) {

            this.states.set(

                order.id,

                OrderState.ACCEPTED

            );

        }

        this.latestOrder =

            order;

        this.emitSafe(

            order

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    EXPORT                                              */
    /* ---------------------------------------------------------------------- */

    public export():

    readonly Order[] {

        return Object.freeze(

            [

                ...this.orders.values()

            ]

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    CACHE                                               */
    /* ---------------------------------------------------------------------- */

    public size(): number {

        return this.orders.size;

    }

    public isEmpty(): boolean {

        return this.orders.size === 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                    RESET                                               */
    /* ---------------------------------------------------------------------- */

    public override reset(): void {

        super.reset();

        this.clear();

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override information() {

        return {

            ...super.information(),

            orders:

                this.orders.size,

            latestOrder:

                this.latestOrder?.id,

            openOrders:

                this.openOrders().length

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                    COMPLETED ORDERS                                    */
    /* ---------------------------------------------------------------------- */

    public completedOrders():

    readonly Order[] {

        return [

            ...this.orders.values()

        ].filter(

            order => {

                const state =

                    this.states.get(

                        order.id

                    );

                return (

                    state === OrderState.SETTLED ||

                    state === OrderState.CLOSED ||

                    state === OrderState.CANCELLED ||

                    state === OrderState.FAILED

                );

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    ACTIVE ORDERS                                       */
    /* ---------------------------------------------------------------------- */

    public activeOrders():

    readonly Order[] {

        return [

            ...this.orders.values()

        ].filter(

            order => {

                const state =

                    this.states.get(

                        order.id

                    );

                return (

                    state === OrderState.CREATED ||

                    state === OrderState.SUBMITTED ||

                    state === OrderState.ACCEPTED ||

                    state === OrderState.OPEN

                );

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    DESTROY                                             */
    /* ---------------------------------------------------------------------- */

    public override destroy(): void {

        this.clear();

        super.destroy();

        logger.info(

            "Order channel destroyed."

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                     FACTORY                                                */
/* -------------------------------------------------------------------------- */

export function createOrderChannel(

    manager: WebSocketManager

): OrderChannel {

    return new OrderChannel(

        manager

    );

}