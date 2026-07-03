/**
 * ============================================================================
 * CANDLE CHANNEL
 * ============================================================================
 */

import { DerivWebSocketClient } from "../client";

export interface Candle {

    open: number;

    high: number;

    low: number;

    close: number;

    epoch: number;

}

export type CandleHandler =

    (

        candle: Candle

    ) => void;

export class CandleChannel {

    private readonly handlers =

        new Map<string, Set<CandleHandler>>();

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

        granularity: number,

        handler: CandleHandler

    ) {

        const key =

            `${symbol}_${granularity}`;

        if (

            !this.handlers.has(

                key

            )

        ) {

            this.handlers.set(

                key,

                new Set()

            );

            this.client.send({

                ticks_history: symbol,

                style: "candles",

                granularity,

                subscribe: 1

            });

        }

        this.handlers.get(

            key

        )!.add(handler);

    }

    public unsubscribe(

        symbol: string,

        granularity: number,

        handler?: CandleHandler

    ) {

        const key =

            `${symbol}_${granularity}`;

        const listeners =

            this.handlers.get(

                key

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

                key

            );

        }

    }

    private handleMessage(

        message: unknown

    ) {

        if (

            !message ||

            typeof message !== "object" ||

            !("candles" in message)

        ) {

            return;

        }

        const payload =

            message as {

                echo_req?: {

                    ticks_history?: string;

                    granularity?: number;

                };

                candles: Candle[];

            };

        const symbol =

            payload.echo_req?.ticks_history;

        const granularity =

            payload.echo_req?.granularity;

        if (

            !symbol ||

            !granularity

        ) {

            return;

        }

        const key =

            `${symbol}_${granularity}`;

        const listeners =

            this.handlers.get(

                key

            );

        if (

            !listeners

        ) {

            return;

        }

        payload.candles.forEach(

            candle =>

                listeners.forEach(

                    listener =>

                        listener(

                            candle

                        )

                )

        );

    }

}

export function createCandleChannel(

    client: DerivWebSocketClient

) {

    return new CandleChannel(

        client

    );

}