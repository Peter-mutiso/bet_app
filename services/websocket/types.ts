/**
 * ============================================================================
 * WEBSOCKET TYPES
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* MESSAGE                                                                    */
/* -------------------------------------------------------------------------- */

export interface WebSocketMessage<T = unknown> {

    readonly type: string;

    readonly payload: T;

    readonly requestId?: string;

    readonly subscriptionId?: string;

    readonly timestamp?: number;

}

/* -------------------------------------------------------------------------- */
/* CONNECTION                                                                 */
/* -------------------------------------------------------------------------- */

export enum WebSocketState {

    DISCONNECTED = "DISCONNECTED",

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    RECONNECTING = "RECONNECTING",

    CLOSED = "CLOSED"

}

/* -------------------------------------------------------------------------- */
/* EVENTS                                                                     */
/* -------------------------------------------------------------------------- */

export interface WebSocketEvent<T = unknown> {

    readonly channel: string;

    readonly message: WebSocketMessage<T>;

}

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTION                                                               */
/* -------------------------------------------------------------------------- */

export interface WebSocketSubscription {

    readonly id: string;

    readonly channel: string;

}

/* -------------------------------------------------------------------------- */
/* STATISTICS                                                                 */
/* -------------------------------------------------------------------------- */

export interface WebSocketStatistics {

    readonly messagesSent: number;

    readonly messagesReceived: number;

    readonly reconnects: number;

}