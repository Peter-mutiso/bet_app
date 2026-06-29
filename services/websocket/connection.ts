/**
 * ============================================================================
 * WEBSOCKET CONNECTION
 * ============================================================================
 * Manages the lifecycle of a websocket connection.
 * ============================================================================
 */

import {

    WebSocketConnectionState,
    DEFAULT_WEBSOCKET_CONFIGURATION

} from "./constants";

import {

    WebSocketClient,
    ConnectionOptions

} from "./types";

import {

    logger

} from "./logger";

import {

    parser

} from "./parser";

/* -------------------------------------------------------------------------- */
/*                       CONNECTION CLASS                                     */
/* -------------------------------------------------------------------------- */

export class WebSocketConnection {

    private socket: WebSocket | null = null;

    private readonly client: WebSocketClient;

    private readonly options: ConnectionOptions;

    private reconnectAttempts = 0;

    private heartbeatTimer?: number;

    private reconnectTimer?: number;

    constructor(

        options: Partial<ConnectionOptions>

    ) {

        this.options = {

            url: DEFAULT_WEBSOCKET_CONFIGURATION.url,

            protocols: [],

            reconnect: true,

            heartbeat: true,

            authentication: true,

            timeout: 30000,

            ...options

        };

        this.client = {

            id: crypto.randomUUID(),

            url: this.options.url,

            socket: null,

            state: WebSocketConnectionState.DISCONNECTED,

            connected: false,

            authenticated: false,

            latency: 0,

            createdAt: new Date()

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                        CONNECTION                                      */
    /* ---------------------------------------------------------------------- */

    public connect(): void {

        if (

            this.socket &&

            this.socket.readyState === WebSocket.OPEN

        ) {

            logger.warn(

                "WebSocket is already connected."

            );

            return;

        }

        logger.info(

            "Opening WebSocket connection.",

            {

                url: this.options.url

            }

        );

        this.client.state =

            WebSocketConnectionState.CONNECTING;

        this.socket = new WebSocket(

            this.options.url,

            this.options.protocols

        );

        this.client.socket = this.socket;

        this.registerEvents();

    }

    /* ---------------------------------------------------------------------- */
    /*                         DISCONNECT                                     */
    /* ---------------------------------------------------------------------- */

    public disconnect(

        code = 1000,

        reason = "Client disconnected."

    ): void {

        if (!this.socket) {

            return;

        }

        logger.info(

            "Closing WebSocket connection."

        );

        this.stopHeartbeat();

        this.socket.close(

            code,

            reason

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                       GETTERS                                          */
    /* ---------------------------------------------------------------------- */

    public getClient():

        Readonly<WebSocketClient> {

        return this.client;

    }

    public isConnected(): boolean {

        return this.client.connected;

    }

    public state():

        WebSocketConnectionState {

        return this.client.state;

    }
        /* ---------------------------------------------------------------------- */
    /*                      EVENT REGISTRATION                                */
    /* ---------------------------------------------------------------------- */

    private registerEvents(): void {

        if (!this.socket) {

            return;

        }

        this.socket.onopen =

            this.handleOpen.bind(this);

        this.socket.onmessage =

            this.handleMessage.bind(this);

        this.socket.onerror =

            this.handleError.bind(this);

        this.socket.onclose =

            this.handleClose.bind(this);

    }

    /* ---------------------------------------------------------------------- */
    /*                            OPEN                                        */
    /* ---------------------------------------------------------------------- */

    private handleOpen(

        event: Event

    ): void {

        logger.info(

            "WebSocket connected.",

            { event }

        );

        this.client.connected = true;

        this.client.state =

            WebSocketConnectionState.CONNECTED;

        this.client.connectedAt =

            new Date();

        this.reconnectAttempts = 0;

        if (this.options.heartbeat) {

            this.startHeartbeat();

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                           MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    private handleMessage(

        event: MessageEvent<string>

    ): void {

        logger.debug(

            "WebSocket message received."

        );

        const result =

            parser.parse(event.data);

        if (!result.successful) {

            logger.error(

                "Failed to parse websocket message.",

                {

                    error: result.error

                }

            );

            return;

        }

        logger.trace(

            "Message parsed successfully.",

            {

                id: result.message?.header.id,

                type: result.message?.header.type

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                             ERROR                                      */
    /* ---------------------------------------------------------------------- */

    private handleError(

        event: Event

    ): void {

        logger.error(

            "WebSocket error occurred.",

            { event }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                             CLOSE                                      */
    /* ---------------------------------------------------------------------- */

    private handleClose(

        event: CloseEvent

    ): void {

        logger.warn(

            "WebSocket connection closed.",

            {

                code: event.code,

                reason: event.reason,

                wasClean: event.wasClean

            }

        );

        this.client.connected = false;

        this.client.authenticated = false;

        this.client.state =

            WebSocketConnectionState.DISCONNECTED;

        this.client.disconnectedAt =

            new Date();

        this.stopHeartbeat();

        if (

            this.options.reconnect &&

            !event.wasClean

        ) {

            this.scheduleReconnect();

        }

    }
        /* ---------------------------------------------------------------------- */
    /*                           SEND MESSAGE                                 */
    /* ---------------------------------------------------------------------- */

    public send(

        message: string

    ): boolean {

        if (

            !this.socket ||

            this.socket.readyState !== WebSocket.OPEN

        ) {

            logger.warn(

                "Cannot send message. WebSocket is not connected."

            );

            return false;

        }

        this.socket.send(message);

        logger.trace(

            "Message sent.",

            {

                size: message.length

            }

        );

        return true;

    }

    /* ---------------------------------------------------------------------- */
    /*                        SEND JSON OBJECT                                */
    /* ---------------------------------------------------------------------- */

    public sendJson<T>(

        payload: T

    ): boolean {

        return this.send(

            JSON.stringify(payload)

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                            PING                                        */
    /* ---------------------------------------------------------------------- */

    public ping(): void {

        this.sendJson({

            type: "PING",

            timestamp: new Date().toISOString()

        });

    }

    /* ---------------------------------------------------------------------- */
    /*                       HEARTBEAT                                        */
    /* ---------------------------------------------------------------------- */

    private startHeartbeat(): void {

        this.stopHeartbeat();

        this.heartbeatTimer = window.setInterval(

            () => {

                this.ping();

            },

            DEFAULT_WEBSOCKET_CONFIGURATION

                .heartbeat

                .interval

        );

        logger.debug(

            "Heartbeat started."

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     STOP HEARTBEAT                                     */
    /* ---------------------------------------------------------------------- */

    private stopHeartbeat(): void {

        if (

            this.heartbeatTimer !== undefined

        ) {

            clearInterval(

                this.heartbeatTimer

            );

            this.heartbeatTimer = undefined;

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                    RECONNECT                                           */
    /* ---------------------------------------------------------------------- */

    private scheduleReconnect(): void {

        this.reconnectAttempts++;

        const reconnect =

            DEFAULT_WEBSOCKET_CONFIGURATION

                .reconnect;

        if (

            this.reconnectAttempts >

            reconnect.maxAttempts

        ) {

            logger.error(

                "Maximum reconnect attempts reached."

            );

            return;

        }

        const delay = Math.min(

            reconnect.initialDelay *

                Math.pow(

                    2,

                    this.reconnectAttempts - 1

                ),

            reconnect.maximumDelay

        );

        logger.info(

            "Scheduling reconnect.",

            {

                attempt:

                    this.reconnectAttempts,

                delay

            }

        );

        this.reconnectTimer =

            window.setTimeout(

                () => {

                    this.connect();

                },

                delay

            );

    }

    /* ---------------------------------------------------------------------- */
    /*                  CONNECTION TIMEOUT                                    */
    /* ---------------------------------------------------------------------- */

    private startConnectionTimeout(): void {

        window.setTimeout(

            () => {

                if (

                    this.client.state ===

                    WebSocketConnectionState.CONNECTING

                ) {

                    logger.warn(

                        "Connection timed out."

                    );

                    this.disconnect(

                        1000,

                        "Connection timeout."

                    );

                }

            },

            this.options.timeout

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                          CLEANUP                                       */
    /* ---------------------------------------------------------------------- */

    public dispose(): void {

        this.stopHeartbeat();

        if (

            this.reconnectTimer !== undefined

        ) {

            clearTimeout(

                this.reconnectTimer

            );

        }

        if (this.socket) {

            this.socket.onopen = null;

            this.socket.onmessage = null;

            this.socket.onerror = null;

            this.socket.onclose = null;

            if (

                this.socket.readyState ===

                WebSocket.OPEN

            ) {

                this.socket.close();

            }

            this.socket = null;

        }

        logger.info(

            "WebSocket connection disposed."

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                       AUTHENTICATION                                   */
    /* ---------------------------------------------------------------------- */

    public authenticate(

        token: string

    ): boolean {

        if (!this.isConnected()) {

            logger.warn(

                "Cannot authenticate. Connection is not established."

            );

            return false;

        }

        const message = {

            type: "AUTHENTICATION",

            token,

            timestamp: new Date().toISOString()

        };

        return this.sendJson(message);

    }

    /* ---------------------------------------------------------------------- */
    /*                      RECONNECT                                         */
    /* ---------------------------------------------------------------------- */

    public reconnect(): void {

        logger.info(

            "Manual reconnect requested."

        );

        this.dispose();

        this.reconnectAttempts = 0;

        this.connect();

    }

    /* ---------------------------------------------------------------------- */
    /*                     CONNECTION HEALTH                                  */
    /* ---------------------------------------------------------------------- */

    public health(): {

        connected: boolean;

        state: WebSocketConnectionState;

        reconnectAttempts: number;

        latency: number;

    } {

        return {

            connected: this.client.connected,

            state: this.client.state,

            reconnectAttempts: this.reconnectAttempts,

            latency: this.client.latency

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                        CONNECTION STATISTICS                           */
    /* ---------------------------------------------------------------------- */

    public statistics() {

        return {

            id: this.client.id,

            url: this.client.url,

            createdAt: this.client.createdAt,

            connectedAt: this.client.connectedAt,

            disconnectedAt: this.client.disconnectedAt,

            reconnectAttempts: this.reconnectAttempts,

            connected: this.client.connected,

            authenticated: this.client.authenticated

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                       RESET STATE                                      */
    /* ---------------------------------------------------------------------- */

    public reset(): void {

        this.stopHeartbeat();

        this.reconnectAttempts = 0;

        this.client.connected = false;

        this.client.authenticated = false;

        this.client.latency = 0;

        this.client.connectedAt = undefined;

        this.client.disconnectedAt = undefined;

        this.client.state =

            WebSocketConnectionState.DISCONNECTED;

    }

    /* ---------------------------------------------------------------------- */
    /*                        READY STATE                                     */
    /* ---------------------------------------------------------------------- */

    public readyState(): number {

        return this.socket?.readyState ??

            WebSocket.CLOSED;

    }

    /* ---------------------------------------------------------------------- */
    /*                        CONNECTION INFO                                 */
    /* ---------------------------------------------------------------------- */

    public url(): string {

        return this.client.url;

    }

    public socketInstance():

        WebSocket | null {

        return this.socket;

    }

}

/* -------------------------------------------------------------------------- */
/*                       DEFAULT CONNECTION                                   */
/* -------------------------------------------------------------------------- */

export const websocketConnection =

    new WebSocketConnection({

        url: DEFAULT_WEBSOCKET_CONFIGURATION.url

    });

/* -------------------------------------------------------------------------- */
/*                        FACTORY                                             */
/* -------------------------------------------------------------------------- */

export function createConnection(

    options: Partial<ConnectionOptions>

): WebSocketConnection {

    return new WebSocketConnection(

        options

    );

}