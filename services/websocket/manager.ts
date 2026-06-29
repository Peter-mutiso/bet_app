/**
 * ============================================================================
 * WEBSOCKET MANAGER
 * ============================================================================
 * Coordinates the websocket subsystem.
 * ============================================================================
 */

import {

    WebSocketConnection,
    createConnection

} from "./connection";

import {

    WebSocketMessage,
    EventHandler,
    MessageHandler,
    ConnectionOptions

} from "./types";

import {

    logger

} from "./logger";

/* -------------------------------------------------------------------------- */
/*                           MANAGER                                          */
/* -------------------------------------------------------------------------- */

export class WebSocketManager {

    private readonly connection: WebSocketConnection;

    private readonly eventHandlers =
        new Map<string, Set<EventHandler>>();

    private readonly messageHandlers =
        new Map<string, Set<MessageHandler>>();

    private readonly pendingRequests =
        new Map<string, (message: WebSocketMessage) => void>();

    constructor(

        options: Partial<ConnectionOptions>

    ) {

        this.connection =

            createConnection(options);

    }

    /* ---------------------------------------------------------------------- */
    /*                     CONNECTION                                         */
    /* ---------------------------------------------------------------------- */

    public connect(): void {

        logger.info(

            "Starting websocket manager."

        );

        this.connection.connect();

    }

    public disconnect(): void {

        logger.info(

            "Stopping websocket manager."

        );

        this.connection.disconnect();

    }

    public reconnect(): void {

        logger.info(

            "Restarting websocket connection."

        );

        this.connection.reconnect();

    }

    /* ---------------------------------------------------------------------- */
    /*                     CONNECTION ACCESS                                  */
    /* ---------------------------------------------------------------------- */

    public getConnection():

        Readonly<WebSocketConnection> {

        return this.connection;

    }

    public isConnected(): boolean {

        return this.connection.isConnected();

    }

    /* ---------------------------------------------------------------------- */
    /*                      SEND                                               */
    /* ---------------------------------------------------------------------- */

    public send<T>(

        message: WebSocketMessage<T>

    ): boolean {

        return this.connection.send(

            JSON.stringify(message)

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     REQUEST TRACKING                                   */
    /* ---------------------------------------------------------------------- */

    public registerPendingRequest(

        id: string,

        callback: (

            message: WebSocketMessage

        ) => void

    ): void {

        this.pendingRequests.set(

            id,

            callback

        );

    }

    public resolvePendingRequest(

        id: string,

        message: WebSocketMessage

    ): boolean {

        const callback =

            this.pendingRequests.get(id);

        if (!callback) {

            return false;

        }

        callback(message);

        this.pendingRequests.delete(id);

        return true;

    }
        /* ---------------------------------------------------------------------- */
    /*                     EVENT HANDLERS                                     */
    /* ---------------------------------------------------------------------- */

    public on(

        event: string,

        handler: EventHandler

    ): void {

        if (!this.eventHandlers.has(event)) {

            this.eventHandlers.set(

                event,

                new Set()

            );

        }

        this.eventHandlers.get(event)!.add(handler);

    }

    public off(

        event: string,

        handler: EventHandler

    ): void {

        const handlers =

            this.eventHandlers.get(event);

        if (!handlers) {

            return;

        }

        handlers.delete(handler);

        if (handlers.size === 0) {

            this.eventHandlers.delete(event);

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                    MESSAGE HANDLERS                                   */
    /* ---------------------------------------------------------------------- */

    public onMessage(

        type: string,

        handler: MessageHandler

    ): void {

        if (!this.messageHandlers.has(type)) {

            this.messageHandlers.set(

                type,

                new Set()

            );

        }

        this.messageHandlers.get(type)!.add(handler);

    }

    public offMessage(

        type: string,

        handler: MessageHandler

    ): void {

        const handlers =

            this.messageHandlers.get(type);

        if (!handlers) {

            return;

        }

        handlers.delete(handler);

        if (handlers.size === 0) {

            this.messageHandlers.delete(type);

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                    EVENT DISPATCHING                                   */
    /* ---------------------------------------------------------------------- */

    public async emit(

        event: string,

        message: WebSocketMessage

    ): Promise<void> {

        const handlers =

            this.eventHandlers.get(event);

        if (!handlers) {

            return;

        }

        for (const handler of handlers) {

            try {

                await handler(

                    message as any

                );

            }

            catch (error) {

                logger.exception(

                    error,

                    {

                        event

                    }

                );

            }

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                    MESSAGE DISPATCHING                                 */
    /* ---------------------------------------------------------------------- */

    public async dispatch(

        type: string,

        message: WebSocketMessage

    ): Promise<void> {

        const handlers =

            this.messageHandlers.get(type);

        if (!handlers) {

            return;

        }

        for (const handler of handlers) {

            try {

                await handler(

                    message as any

                );

            }

            catch (error) {

                logger.exception(

                    error,

                    {

                        type

                    }

                );

            }

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                        BROADCAST                                       */
    /* ---------------------------------------------------------------------- */

    public async broadcast(

        message: WebSocketMessage

    ): Promise<void> {

        for (

            const type

            of this.messageHandlers.keys()

        ) {

            await this.dispatch(

                type,

                message

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                       CLEAR                                             */
    /* ---------------------------------------------------------------------- */

    public clearHandlers(): void {

        this.eventHandlers.clear();

        this.messageHandlers.clear();

    }

    /* ---------------------------------------------------------------------- */
    /*                       INFORMATION                                       */
    /* ---------------------------------------------------------------------- */

    public eventCount(): number {

        return this.eventHandlers.size;

    }

    public messageHandlerCount(): number {

        return this.messageHandlers.size;

    }
        /* ---------------------------------------------------------------------- */
    /*                     SUBSCRIPTIONS                                      */
    /* ---------------------------------------------------------------------- */

    private readonly subscriptions =

        new Set<string>();

    public subscribe(

        channel: string

    ): void {

        this.subscriptions.add(channel);

        logger.info(

            `Subscribed to '${channel}'.`

        );

    }

    public unsubscribe(

        channel: string

    ): void {

        this.subscriptions.delete(channel);

        logger.info(

            `Unsubscribed from '${channel}'.`

        );

    }

    public isSubscribed(

        channel: string

    ): boolean {

        return this.subscriptions.has(channel);

    }

    public subscriptionsList():

        readonly string[] {

        return [

            ...this.subscriptions

        ];

    }

    /* ---------------------------------------------------------------------- */
    /*                  REQUEST TIMEOUTS                                      */
    /* ---------------------------------------------------------------------- */

    public registerPendingRequestWithTimeout(

        id: string,

        callback: (

            message: WebSocketMessage

        ) => void,

        timeout = 30000

    ): void {

        this.registerPendingRequest(

            id,

            callback

        );

        window.setTimeout(

            () => {

                if (

                    this.pendingRequests.has(id)

                ) {

                    logger.warn(

                        `Pending request '${id}' timed out.`

                    );

                    this.pendingRequests.delete(id);

                }

            },

            timeout

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                RESPONSE CORRELATION                                    */
    /* ---------------------------------------------------------------------- */

    public correlate(

        message: WebSocketMessage

    ): boolean {

        const correlationId =

            message.header.correlationId;

        if (!correlationId) {

            return false;

        }

        return this.resolvePendingRequest(

            correlationId,

            message

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                       MIDDLEWARE                                       */
    /* ---------------------------------------------------------------------- */

    private readonly middleware =

        new Array<

            (

                message: WebSocketMessage

            ) => WebSocketMessage

        >();

    public use(

        middleware: (

            message: WebSocketMessage

        ) => WebSocketMessage

    ): void {

        this.middleware.push(

            middleware

        );

    }

    private applyMiddleware(

        message: WebSocketMessage

    ): WebSocketMessage {

        return this.middleware.reduce(

            (

                current,

                middleware

            ) => middleware(current),

            message

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    INCOMING PIPELINE                                   */
    /* ---------------------------------------------------------------------- */

    public async processIncoming(

        message: WebSocketMessage

    ): Promise<void> {

        const processed =

            this.applyMiddleware(

                message

            );

        if (

            this.correlate(

                processed

            )

        ) {

            return;

        }

        await this.dispatch(

            processed.header.type,

            processed

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        STATISTICS                                      */
    /* ---------------------------------------------------------------------- */

    public statistics() {

        return {

            subscriptions:

                this.subscriptions.size,

            pendingRequests:

                this.pendingRequests.size,

            middleware:

                this.middleware.length,

            eventHandlers:

                this.eventHandlers.size,

            messageHandlers:

                this.messageHandlers.size

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                     HEALTH CHECK                                       */
    /* ---------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            this.connection.isConnected()

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                    LIFECYCLE HOOKS                                     */
    /* ---------------------------------------------------------------------- */

    public async start(): Promise<void> {

        logger.info(

            "Starting WebSocket manager."

        );

        this.connect();

    }

    public async stop(): Promise<void> {

        logger.info(

            "Stopping WebSocket manager."

        );

        this.disconnect();

        this.clearHandlers();

        this.pendingRequests.clear();

        this.subscriptions.clear();

        this.middleware.length = 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                    DEFAULT EVENTS                                      */
    /* ---------------------------------------------------------------------- */

    public registerDefaultHandlers(): void {

        this.onMessage(

            "ERROR",

            async message => {

                logger.error(

                    "WebSocket error message received.",

                    {

                        message

                    }

                );

            }

        );

        this.onMessage(

            "PING",

            async () => {

                logger.trace(

                    "Ping received."

                );

            }

        );

        this.onMessage(

            "PONG",

            async () => {

                logger.trace(

                    "Pong received."

                );

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     RESET                                              */
    /* ---------------------------------------------------------------------- */

    public reset(): void {

        logger.info(

            "Resetting WebSocket manager."

        );

        this.clearHandlers();

        this.pendingRequests.clear();

        this.subscriptions.clear();

        this.middleware.length = 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                     DESTROY                                            */
    /* ---------------------------------------------------------------------- */

    public destroy(): void {

        logger.info(

            "Destroying WebSocket manager."

        );

        this.stop();

        this.connection.dispose();

    }

    /* ---------------------------------------------------------------------- */
    /*                     INFORMATION                                        */
    /* ---------------------------------------------------------------------- */

    public information() {

        return {

            connected:

                this.connection.isConnected(),

            healthy:

                this.healthy(),

            statistics:

                this.statistics(),

            connection:

                this.connection.statistics()

        };

    }

}

/* -------------------------------------------------------------------------- */
/*                     DEFAULT MANAGER                                        */
/* -------------------------------------------------------------------------- */

export const websocketManager =

    new WebSocketManager({});

/* -------------------------------------------------------------------------- */
/*                     FACTORY                                                */
/* -------------------------------------------------------------------------- */

export function createWebSocketManager(

    options: Partial<ConnectionOptions> = {}

): WebSocketManager {

    return new WebSocketManager(

        options

    );

}