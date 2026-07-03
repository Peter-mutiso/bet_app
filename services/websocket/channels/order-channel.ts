import { DerivWebSocketClient } from "../client";

export class OrderChannel {

    constructor(

        private readonly client: DerivWebSocketClient

    ) {}

    public buy(

        proposalId: string,

        price: number

    ) {

        return this.client.request({

            buy: proposalId,

            price

        });

    }

    public sell(

        contractId: number,

        price?: number

    ) {

        return this.client.request({

            sell: contractId,

            price

        });

    }

}

export function createOrderChannel(

    client: DerivWebSocketClient

) {

    return new OrderChannel(

        client

    );

}