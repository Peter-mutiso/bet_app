import { DerivWebSocketClient, ConnectionState } from "./client";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface WebSocketManagerConfiguration {

    readonly autoConnect: boolean;

    readonly maxReconnectAttempts: number;

    readonly reconnectDelay: number;

}

export type WebSocketListener = (

    payload?: unknown

) => void;

/* -------------------------------------------------------------------------- */
/* MANAGER                                                                    */
/* -------------------------------------------------------------------------- */

export class WebSocketManager {

    private readonly listeners =

        new Map<string, Set<WebSocketListener>>();

    private reconnectAttempts = 0;

    private started = false;

    constructor(

        private readonly client: DerivWebSocketClient,

        private readonly configuration: WebSocketManagerConfiguration

    ) {

        this.setupClientListeners();

    }

    /* ---------------------------------------------------------------------- */
    /* CLIENT EVENTS                                                          */
    /* ---------------------------------------------------------------------- */

    private setupClientListeners(): void {

        this.client.on(

            "connected",

            () => {

                this.reconnectAttempts = 0;

                this.emit("connected");

            }

        );

        this.client.on(

            "disconnected",

            () => {

                this.emit("disconnected");

            }

        );

        this.client.on(

            "message",

            message => {

                this.emit(

                    "message",

                    message

                );

            }

        );

        this.client.on(

            "error",

            error => {

                this.emit(

                    "error",

                    error

                );

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /* EVENTS                                                                 */
    /* ---------------------------------------------------------------------- */

    public on(

        event: string,

        listener: WebSocketListener

    ): this {

        if (

            !this.listeners.has(event)

        ) {

            this.listeners.set(

                event,

                new Set()

            );

        }

        this.listeners

            .get(event)!

            .add(listener);

        return this;

    }

    public off(

        event: string,

        listener: WebSocketListener

    ): this {

        this.listeners

            .get(event)

            ?.delete(listener);

        return this;

    }

    private emit(

        event: string,

        payload?: unknown

    ): void {

        for (

            const listener of

            this.listeners.get(event) ??

            []

        ) {

            listener(payload);

        }

    }

    /* ---------------------------------------------------------------------- */
    /* CONNECTION                                                              */
    /* ---------------------------------------------------------------------- */

    public async start(): Promise<void> {

        if (

            this.started

        ) {

            return;

        }

        this.started = true;

        await this.client.connect();

    }

    public stop(): void {

        this.started = false;

        this.client.disconnect();

    }

    public connected(): boolean {

        return this.client.connected();

    }

    public connectionState(): ConnectionState {

        return this.client.connectionState();

    }

    /* ---------------------------------------------------------------------- */
    /* SEND                                                                    */
    /* ---------------------------------------------------------------------- */

    public send(

        message: unknown

    ): boolean {

        if (

            !this.connected()

        ) {

            return false;

        }

        this.client.send(message);

        return true;

    }

    /* ---------------------------------------------------------------------- */
    /* SUBSCRIPTIONS                                                           */
    /* ---------------------------------------------------------------------- */

    public subscribe(

        channel: string,

        payload?: unknown

    ): boolean {

        return this.send({

            subscribe: channel,

            ...(

                payload as object ??

                {}

            )

        });

    }

    public unsubscribe(

        channel: string

    ): boolean {

        return this.send({

            forget: channel

        });

    }

    /* ---------------------------------------------------------------------- */
    /* STATUS                                                                  */
    /* ---------------------------------------------------------------------- */

    public healthy(): boolean {

        return this.connected();

    }

    public statistics() {

        return {

            started:

                this.started,

            reconnectAttempts:

                this.reconnectAttempts,

            connected:

                this.connected()

        };

    }

    public information() {

        return {

            configuration:

                this.configuration,

            statistics:

                this.statistics(),

            client:

                this.client.information()

        };

    }

    public diagnostics() {

        return {

            healthy:

                this.healthy(),

            information:

                this.information()

        };

    }

    public reset(): void {

        this.reconnectAttempts = 0;

    }

    public destroy(): void {

        this.stop();

        this.listeners.clear();

        this.reset();

    }

    /* ---------------------------------------------------------------------- */

    public getClient(): DerivWebSocketClient {

        return this.client;

    }

}

/* -------------------------------------------------------------------------- */
/* FACTORY                                                                    */
/* -------------------------------------------------------------------------- */

export function createWebSocketManager(

    client: DerivWebSocketClient,

    configuration: WebSocketManagerConfiguration

): WebSocketManager {

    return new WebSocketManager(

        client,

        configuration

    );

}