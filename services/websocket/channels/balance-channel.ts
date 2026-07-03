import { DerivWebSocketClient } from "../client";

export class BalanceChannel {

    constructor(

        private readonly client: DerivWebSocketClient

    ) {}

    public subscribe() {

        this.client.send({

            balance: 1,

            subscribe: 1

        });

    }

}

export function createBalanceChannel(

    client: DerivWebSocketClient

) {

    return new BalanceChannel(

        client

    );

}