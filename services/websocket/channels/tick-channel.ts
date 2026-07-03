/**
 * ============================================================================
 * TICK CHANNEL
 * ============================================================================
 */

import { DerivWebSocketClient } from "../client";

export interface TickMessage {

    tick: {

        symbol: string;

        quote: number;

        epoch: number;

    };

}

export type TickHandler =

    (

        tick: TickMessage["tick"]

    ) => void;

export class TickChannel {

    private readonly handlers =

        new Map<string, Set<TickHandler>>();

    constructor(

        private readonly client: DerivWebSocketClient

    ) {

        this.client.on(

            "message",

            this.handleMessage.bind(this)

        );

    }

    public subscribe(

        symbol: string,

        handler: TickHandler

    ) {

        if (

            !this.handlers.has(

                symbol

            )

        ) {

            this.handlers.set(

                symbol,

                new Set()

            );

            this.client.send({

                ticks: symbol,

                subscribe: 1

            });

        }

        this.handlers

            .get(symbol)!

            .add(handler);

    }

    public unsubscribe(

        symbol: string,

        handler?: TickHandler

    ) {

        const listeners =

            this.handlers.get(

                symbol

            );

        if (

            !listeners

        ) {

            return;

        }

        if (

            handler

        ) {

            listeners.delete(

                handler

            );

        } else {

            listeners.clear();

        }

        if (

            listeners.size === 0

        ) {

            this.handlers.delete(

                symbol

            );

        }

    }

    private handleMessage(

        message: unknown

    ) {

        if (

            !message ||

            typeof message !== "object" ||

            !("tick" in message)

        ) {

            return;

        }

        const tick =

            (message as TickMessage).tick;

        const listeners =

            this.handlers.get(

                tick.symbol

            );

        if (

            !listeners

        ) {

            return;

        }

        listeners.forEach(

            listener =>

                listener(

                    tick

                )

        );

    }

}

export function createTickChannel(

    client: DerivWebSocketClient

) {

    return new TickChannel(

        client

    );

}