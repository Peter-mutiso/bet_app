/**
 * ============================================================================
 * CHANNEL REGISTRY
 * ============================================================================
 *
 * Central registry for all websocket channels.
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

import {
    ProposalChannel,
    createProposalChannel
} from "./channels/proposal-channel";

import {
    OrderChannel,
    createOrderChannel
} from "./channels/order-channel";

import {
    BalanceChannel,
    createBalanceChannel
} from "./channels/balance-channel";

import {
    PortfolioChannel,
    createPortfolioChannel
} from "./channels/portfolio-channel";

export class ChannelRegistry {

    public readonly tick: TickChannel;

    public readonly candle: CandleChannel;

    public readonly proposal: ProposalChannel;

    public readonly order: OrderChannel;

    public readonly balance: BalanceChannel;

    public readonly portfolio: PortfolioChannel;

    constructor(
        client: any
    ) {

        this.tick =
            createTickChannel(client);

        this.candle =
            createCandleChannel(client);

        this.proposal =
            createProposalChannel(client);

        this.order =
            createOrderChannel(client);

        this.balance =
            createBalanceChannel(client);

        this.portfolio =
            createPortfolioChannel(client);

    }

}

export function createChannelRegistry(
    client: any
) {

    return new ChannelRegistry(
        client
    );

}
export {

    EventDispatcher,

    createEventDispatcher

} from "./events";