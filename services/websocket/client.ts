/**
 * ============================================================================
 * DERIV WEBSOCKET CLIENT
 * ============================================================================
 * Central communication gateway for the Deriv WebSocket API.
 * ============================================================================
 */

import {

    EventEmitter

} from "events";

/* -------------------------------------------------------------------------- */
/* CONNECTION STATE                                                           */
/* -------------------------------------------------------------------------- */

export enum ConnectionState {

    DISCONNECTED = "DISCONNECTED",

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    RECONNECTING = "RECONNECTING",

    CLOSING = "CLOSING"

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface WebSocketConfiguration {

    readonly endpoint: string;

    readonly reconnect: boolean;

    readonly reconnectInterval: number;

    readonly heartbeatInterval: number;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface WebSocketMetrics {

    sent: number;

    received: number;

    reconnects: number;

    lastConnected?: Date;

    lastDisconnected?: Date;

}

/* -------------------------------------------------------------------------- */
/* CLIENT                                                                     */
/* -------------------------------------------------------------------------- */

export class DerivWebSocketClient

extends EventEmitter {

    private socket?:

    WebSocket;

    private state:

    ConnectionState =

        ConnectionState.DISCONNECTED;

    private readonly metrics:

    WebSocketMetrics = {

        sent: 0,

        received: 0,

        reconnects: 0

    };

    constructor(

        private readonly configuration:

        WebSocketConfiguration

    ) {

        super();

    }

/* -------------------------------------------------------------------------- */
/* STATE                                                                      */
/* -------------------------------------------------------------------------- */

    public connectionState():

    ConnectionState {

        return this.state;

    }

    public connected():

    boolean {

        return (

            this.state ===

            ConnectionState.CONNECTED

        );

    }

    public statistics():

    Readonly<WebSocketMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                              CONNECT                                       */
/* -------------------------------------------------------------------------- */

    public async connect():

    Promise<void> {

        if (

            this.connected()

        ) {

            return;

        }

        this.state =

            ConnectionState.CONNECTING;

        this.socket =

            new WebSocket(

                this.configuration.endpoint

            );

        this.registerEvents();

    }

/* -------------------------------------------------------------------------- */
/*                           DISCONNECT                                       */
/* -------------------------------------------------------------------------- */

    public disconnect(

        code = 1000,

        reason = "Normal Closure"

    ): void {

        if (

            !this.socket

        ) {

            return;

        }

        this.state =

            ConnectionState.CLOSING;

        this.socket.close(

            code,

            reason

        );

    }

/* -------------------------------------------------------------------------- */
/*                         SEND MESSAGE                                       */
/* -------------------------------------------------------------------------- */

    public send(

        payload:

        unknown

    ): void {

        if (

            !this.connected() ||

            !this.socket

        ) {

            throw new Error(

                "WebSocket is not connected."

            );

        }

        this.socket.send(

            JSON.stringify(

                payload

            )

        );

        this.metrics.sent++;

    }

/* -------------------------------------------------------------------------- */
/*                     REGISTER SOCKET EVENTS                                 */
/* -------------------------------------------------------------------------- */

    private registerEvents():

    void {

        if (

            !this.socket

        ) {

            return;

        }

        this.socket.onopen =

            () => {

                this.state =

                    ConnectionState.CONNECTED;

                this.metrics.lastConnected =

                    new Date();

                this.emit(

                    "connected"

                );

            };

        this.socket.onmessage =

            (

                event

            ) => {

                this.metrics.received++;

                this.emit(

                    "message",

                    event.data

                );

            };

        this.socket.onerror =

            (

                event

            ) => {

                this.emit(

                    "error",

                    event

                );

            };

        this.socket.onclose =

            () => {

                this.state =

                    ConnectionState.DISCONNECTED;

                this.metrics.lastDisconnected =

                    new Date();

                this.emit(

                    "disconnected"

                );

                this.reconnect();

            };

    }

/* -------------------------------------------------------------------------- */
/*                         RECONNECT                                          */
/* -------------------------------------------------------------------------- */

    private reconnect():

    void {

        if (

            !this.configuration.reconnect

        ) {

            return;

        }

        this.state =

            ConnectionState.RECONNECTING;

        this.metrics.reconnects++;

        setTimeout(

            () => {

                void this.connect();

            },

            this.configuration.reconnectInterval

        );

    }
    /* -------------------------------------------------------------------------- */
/*                          REQUESTS                                          */
/* -------------------------------------------------------------------------- */

    private readonly pending =

    new Map<

        string,

        (response: unknown) => void

    >();

/* -------------------------------------------------------------------------- */
/*                          HEARTBEAT                                         */
/* -------------------------------------------------------------------------- */

    private heartbeat?:

    ReturnType<typeof setInterval>;

/* -------------------------------------------------------------------------- */
/*                      START HEARTBEAT                                       */
/* -------------------------------------------------------------------------- */

    private startHeartbeat():

    void {

        this.stopHeartbeat();

        this.heartbeat =

            setInterval(

                () => {

                    if (

                        this.connected()

                    ) {

                        this.send({

                            ping: 1

                        });

                    }

                },

                this.configuration

                    .heartbeatInterval

            );

    }

/* -------------------------------------------------------------------------- */
/*                      STOP HEARTBEAT                                        */
/* -------------------------------------------------------------------------- */

    private stopHeartbeat():

    void {

        if (

            this.heartbeat

        ) {

            clearInterval(

                this.heartbeat

            );

            this.heartbeat =

                undefined;

        }

    }

/* -------------------------------------------------------------------------- */
/*                         REQUEST                                            */
/* -------------------------------------------------------------------------- */

    public request(

        payload:

        Record<string, unknown>

    ): Promise<unknown> {

        const requestId =

            crypto.randomUUID();

        return new Promise(

            resolve => {

                this.pending.set(

                    requestId,

                    resolve

                );

                this.send({

                    req_id:

                        requestId,

                    ...payload

                });

            }

        );

    }

/* -------------------------------------------------------------------------- */
/*                    HANDLE MESSAGE                                          */
/* -------------------------------------------------------------------------- */

    private handleMessage(

        raw:

        string

    ): void {

        const message =

            JSON.parse(

                raw

            );

        if (

            message.req_id &&

            this.pending.has(

                message.req_id

            )

        ) {

            const resolve =

                this.pending.get(

                    message.req_id

                )!;

            this.pending.delete(

                message.req_id

            );

            resolve(

                message

            );

        }

        this.emit(

            "message",

            message

        );

    }
    /* -------------------------------------------------------------------------- */
/*                              HEALTH                                        */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.connected()

        );

    }

/* -------------------------------------------------------------------------- */
/*                         INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            endpoint:

                this.configuration.endpoint,

            state:

                this.connectionState(),

            connected:

                this.connected(),

            reconnect:

                this.configuration.reconnect,

            heartbeatInterval:

                this.configuration.heartbeatInterval,

            metrics:

                this.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                         DIAGNOSTICS                                        */
/* -------------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            healthy:

                this.healthy(),

            information:

                this.information(),

            pendingRequests:

                this.pending.size

        });

    }

/* -------------------------------------------------------------------------- */
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.pending.clear();

        this.metrics.sent = 0;

        this.metrics.received = 0;

        this.metrics.reconnects = 0;

        this.metrics.lastConnected =

            undefined;

        this.metrics.lastDisconnected =

            undefined;

    }

/* -------------------------------------------------------------------------- */
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public isRunning():

    boolean {

        return this.connected();

    }

    public isStopped():

    boolean {

        return !this.connected();

    }

/* -------------------------------------------------------------------------- */
/*                            CLEANUP                                         */
/* -------------------------------------------------------------------------- */

    public destroy():

    void {

        this.stopHeartbeat();

        this.pending.clear();

        this.disconnect();

        this.removeAllListeners();

        this.reset();

    }

/* -------------------------------------------------------------------------- */
/*                             VERSION                                        */
/* -------------------------------------------------------------------------- */

    public static readonly VERSION =

        "1.0.0";

/* -------------------------------------------------------------------------- */
/*                             MODULE                                         */
/* -------------------------------------------------------------------------- */

    public static readonly MODULE =

        "Deriv WebSocket Client";

}

/* -------------------------------------------------------------------------- */
/*                              FACTORY                                       */
/* -------------------------------------------------------------------------- */

export function createDerivWebSocketClient(

    configuration:

    WebSocketConfiguration

): DerivWebSocketClient {

    return new DerivWebSocketClient(

        configuration

    );

}