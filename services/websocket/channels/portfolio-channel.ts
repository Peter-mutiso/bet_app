/**
 * ============================================================================
 * PORTFOLIO CHANNEL
 * ============================================================================
 * Tracks open contracts and portfolio state.
 * ============================================================================
 */

import { BaseChannel } from "./base-channel";
import { WebSocketManager } from "../manager";
import { WebSocketMessage } from "../types";
import { messageFactory } from "../message";
import { logger } from "../logger";

import {

    Position

} from "../../models/position";

/* -------------------------------------------------------------------------- */
/*                           CHANNEL                                          */
/* -------------------------------------------------------------------------- */

export class PortfolioChannel extends BaseChannel<Position> {

    private readonly positions =

        new Map<string, Position>();

    constructor(

        manager: WebSocketManager

    ) {

        super(

            manager,

            "portfolio"

        );

        this.initialize();

    }

    /* ---------------------------------------------------------------------- */
    /*                      SUBSCRIBE                                         */
    /* ---------------------------------------------------------------------- */

    public async subscribe():

    Promise<void> {

        this.ensureConnected();

        const message =

            messageFactory.request(

                "portfolio",

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
    /*                     UNSUBSCRIBE                                        */
    /* ---------------------------------------------------------------------- */

    public async unsubscribe():

    Promise<void> {

        this.ensureConnected();

        const message =

            messageFactory.request(

                "forget",

                {

                    stream: "portfolio"

                },

                this.name()

            );

        await this.unsubscribeInternal(

            message

        );

        this.positions.clear();

        await this.onUnsubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                     HANDLE MESSAGE                                     */
    /* ---------------------------------------------------------------------- */

    protected async handleMessage(

        message: WebSocketMessage<Position>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const position =

            message.payload;

        this.positions.set(

            position.id,

            position

        );

        this.emitSafe(

            position

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                      VALIDATION                                        */
    /* ---------------------------------------------------------------------- */

    private latestPosition?: Position;

    private validatePosition(

        position: Position

    ): boolean {

        return (

            typeof position.id === "string" &&

            position.id.length > 0
        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      LOOKUP                                            */
    /* ---------------------------------------------------------------------- */

    public get(

        id: string

    ): Position | undefined {

        return this.positions.get(id);

    }

    public has(

        id: string

    ): boolean {

        return this.positions.has(id);

    }

    public latest():

    Position | undefined {

        return this.latestPosition;

    }

    public values():

    readonly Position[] {

        return [

            ...this.positions.values()

        ];

    }

    /* ---------------------------------------------------------------------- */
    /*                      FILTERS                                           */
    /* ---------------------------------------------------------------------- */

    public active():

    readonly Position[] {

        return [

            ...this.positions.values()

        ].filter(

            position =>

                position.status === "OPEN"

        );

    }

    public closed():

    readonly Position[] {

        return [

            ...this.positions.values()

        ].filter(

            position =>

                position.status !== "OPEN"

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      HANDLE MESSAGE                                    */
    /* ---------------------------------------------------------------------- */

    protected override async handleMessage(

        message: WebSocketMessage<Position>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const position =

            message.payload;

        if (

            !this.validatePosition(

                position

            )

        ) {

            logger.warn(

                "Invalid position received."

            );

            return;

        }

        this.positions.set(

            position.id,

            position

        );

        this.latestPosition =

            position;

        this.emitSafe(

            position

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      REMOVE                                            */
    /* ---------------------------------------------------------------------- */

    public remove(

        id: string

    ): boolean {

        return this.positions.delete(id);

    }

    public clear(): void {

        this.positions.clear();

        this.latestPosition = undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                      INFORMATION                                       */
    /* ---------------------------------------------------------------------- */

    public size(): number {

        return this.positions.size;

    }

    public isEmpty(): boolean {

        return this.positions.size === 0;

    }

    public override statistics() {

        return {

            ...super.statistics(),

            positions: this.positions.size,

            active: this.active().length,

            closed: this.closed().length

        };

    }

    public override healthy(): boolean {

        return super.healthy();

    }

    public override information() {

        return {

            ...super.information(),

            positions: this.positions.size,

            latestPosition:

                this.latestPosition?.id

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                      EXPORT                                            */
    /* ---------------------------------------------------------------------- */

    public export():

    readonly Position[] {

        return Object.freeze(

            [

                ...this.positions.values()

            ]

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      RESET                                             */
    /* ---------------------------------------------------------------------- */

    public override reset(): void {

        super.reset();

        this.clear();

    }

    /* ---------------------------------------------------------------------- */
    /*                      DESTROY                                           */
    /* ---------------------------------------------------------------------- */

    public override destroy(): void {

        this.clear();

        super.destroy();

        logger.info(

            "Portfolio channel destroyed."

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                          FACTORY                                           */
/* -------------------------------------------------------------------------- */

export function createPortfolioChannel(

    manager: WebSocketManager

): PortfolioChannel {

    return new PortfolioChannel(

        manager

    );

}