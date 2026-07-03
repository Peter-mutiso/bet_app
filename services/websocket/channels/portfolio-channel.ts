import { DerivWebSocketClient } from "../client";

export class PortfolioChannel {

    constructor(

        private readonly client: DerivWebSocketClient

    ) {}

    public subscribe() {

        this.client.send({

            portfolio: 1,

            subscribe: 1

        });

    }

}

export function createPortfolioChannel(

    client: DerivWebSocketClient

) {

    return new PortfolioChannel(

        client

    );

}