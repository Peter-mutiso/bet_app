/**
 * ============================================================================
 * CHANNEL REGISTRY
 * ============================================================================
 */

import { DerivWebSocketClient } from "./client";

import {
    TickChannel,
    createTickChannel
} from "./channels/tick-channel";

import {
    CandleChannel,
    createCandleChannel
} from "./channels/candle-channel";

export class ChannelRegistry {

    public readonly tick: TickChannel;

    public readonly candle: CandleChannel;

    constructor(
        client: DerivWebSocketClient
    ) {

        this.tick =
            createTickChannel(client);

        this.candle =
            createCandleChannel(client);

    }

    public information() {

        return Object.freeze({

            channels: [

                "tick",

                "candle"

            ]

        });

    }

}

export function createChannelRegistry(

    client: DerivWebSocketClient

): ChannelRegistry {

    return new ChannelRegistry(

        client

    );

}