/* ============================================================================
 * WEBSOCKET PUBLIC EXPORTS
 * ========================================================================== */

/* -------------------------------------------------------------------------- */
/* CLIENT                                                                     */
/* -------------------------------------------------------------------------- */

export {
    DerivWebSocketClient,
    createDerivWebSocketClient
} from "./client";

export type {
    ConnectionState,
    WebSocketConfiguration,
    WebSocketMetrics
} from "./client";

/* -------------------------------------------------------------------------- */
/* MANAGER                                                                    */
/* -------------------------------------------------------------------------- */

export {
    WebSocketManager,
    createWebSocketManager
} from "./manager";

export type {
    WebSocketManagerConfiguration
} from "./manager";

/* -------------------------------------------------------------------------- */
/* BASE CHANNEL                                                               */
/* -------------------------------------------------------------------------- */

export {
    BaseChannel
} from "./channels/base-channel";

export type {
    ChannelConfiguration
} from "./channels/base-channel";

/* -------------------------------------------------------------------------- */
/* CHANNELS                                                                   */
/* -------------------------------------------------------------------------- */

export * from "./channels/tick-channel";
export * from "./channels/candle-channel";
export * from "./channels/proposal-channel";
export * from "./channels/order-channel";
export * from "./channels/balance-channel";
/* -------------------------------------------------------------------------- */
/* SUPPORTING MODULES                                                         */
/* -------------------------------------------------------------------------- */

export * from "./message";
export * from "./logger";
export * from "./types";
export * from "./channel-registry";
export * from "./subscriptions";
export * from "./event-dispatcher";