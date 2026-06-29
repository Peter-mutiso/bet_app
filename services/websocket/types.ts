/**
 * ============================================================================
 * WEBSOCKET TYPES
 * ============================================================================
 * Shared type definitions for the WebSocket subsystem.
 *
 * Every websocket service imports from this file.
 * ============================================================================
 */

import {

    RetryStrategy,

    WebSocketConnectionState,

    WebSocketLogLevel

} from "./constants";

/* -------------------------------------------------------------------------- */
/*                            CLIENT                                          */
/* -------------------------------------------------------------------------- */

export interface WebSocketClient {

    id: string;

    url: string;

    socket: WebSocket | null;

    state: WebSocketConnectionState;

    connected: boolean;

    authenticated: boolean;

    latency: number;

    createdAt: Date;

    connectedAt?: Date;

    disconnectedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                        CONNECTION OPTIONS                                  */
/* -------------------------------------------------------------------------- */

export interface ConnectionOptions {

    url: string;

    protocols?: string[];

    reconnect: boolean;

    heartbeat: boolean;

    authentication: boolean;

    timeout: number;
}

/* -------------------------------------------------------------------------- */
/*                           AUTHENTICATION                                   */
/* -------------------------------------------------------------------------- */

export interface AuthenticationCredentials {

    token: string;

    refreshToken?: string;

    expiresAt?: Date;

}

export interface AuthenticationState {

    authenticated: boolean;

    authenticating: boolean;

    credentials?: AuthenticationCredentials;

    authenticatedAt?: Date;

}

/* -------------------------------------------------------------------------- */
/*                          CONNECTION INFO                                   */
/* -------------------------------------------------------------------------- */

export interface ConnectionInformation {

    protocol: string;

    version: string;

    transport: string;

    remoteAddress?: string;

    localAddress?: string;

    secure: boolean;

}

/* -------------------------------------------------------------------------- */
/*                         CONNECTION HEALTH                                  */
/* -------------------------------------------------------------------------- */

export interface ConnectionHealth {

    healthy: boolean;

    latency: number;

    missedHeartbeats: number;

    reconnectAttempts: number;

    lastHeartbeat?: Date;

    lastMessage?: Date;

}

/* -------------------------------------------------------------------------- */
/*                       CONNECTION METADATA                                  */
/* -------------------------------------------------------------------------- */

export interface ConnectionMetadata {

    clientId: string;

    sessionId: string;

    application: string;

    applicationVersion: string;

    operatingSystem: string;

    browser: string;

    environment: string;

}

/* -------------------------------------------------------------------------- */
/*                       CONNECTION STATISTICS                                */
/* -------------------------------------------------------------------------- */

export interface ConnectionStatistics {

    bytesSent: number;

    bytesReceived: number;

    messagesSent: number;

    messagesReceived: number;

    reconnectCount: number;

    errorCount: number;

    uptime: number;

}

/* -------------------------------------------------------------------------- */
/*                          RECONNECT POLICY                                  */
/* -------------------------------------------------------------------------- */

export interface ReconnectPolicy {

    enabled: boolean;

    strategy: RetryStrategy;

    maximumAttempts: number;

    initialDelay: number;

    maximumDelay: number;

}

/* -------------------------------------------------------------------------- */
/*                         HEARTBEAT                                          */
/* -------------------------------------------------------------------------- */

export interface HeartbeatState {

    enabled: boolean;

    interval: number;

    timeout: number;

    lastPing?: Date;

    lastPong?: Date;

    missedHeartbeats: number;

}

/* -------------------------------------------------------------------------- */
/*                            MESSAGE TYPES                                   */
/* -------------------------------------------------------------------------- */

export enum WebSocketMessageType {

    REQUEST = "REQUEST",

    RESPONSE = "RESPONSE",

    EVENT = "EVENT",

    ERROR = "ERROR",

    PING = "PING",

    PONG = "PONG",

    HEARTBEAT = "HEARTBEAT",

    AUTHENTICATION = "AUTHENTICATION",

    SUBSCRIPTION = "SUBSCRIPTION"
}

/* -------------------------------------------------------------------------- */
/*                           MESSAGE HEADER                                   */
/* -------------------------------------------------------------------------- */

export interface MessageHeader {

    id: string;

    type: WebSocketMessageType;

    timestamp: Date;

    correlationId?: string;

    requestId?: string;

    channel?: string;

    version: string;

}

/* -------------------------------------------------------------------------- */
/*                           MESSAGE METADATA                                 */
/* -------------------------------------------------------------------------- */

export interface MessageMetadata {

    clientId?: string;

    sessionId?: string;

    userId?: string;

    sequenceNumber?: number;

    compressed: boolean;

    encrypted: boolean;

    retryCount: number;

}

/* -------------------------------------------------------------------------- */
/*                         BASE MESSAGE                                       */
/* -------------------------------------------------------------------------- */

export interface WebSocketMessage<T = unknown> {

    header: MessageHeader;

    metadata: MessageMetadata;

    payload: T;

}

/* -------------------------------------------------------------------------- */
/*                        OUTGOING MESSAGE                                    */
/* -------------------------------------------------------------------------- */

export interface OutgoingMessage<T = unknown>
    extends WebSocketMessage<T> {

    sent: boolean;

    sentAt?: Date;

}

/* -------------------------------------------------------------------------- */
/*                        INCOMING MESSAGE                                    */
/* -------------------------------------------------------------------------- */

export interface IncomingMessage<T = unknown>
    extends WebSocketMessage<T> {

    receivedAt: Date;

    processingStartedAt?: Date;

    processingCompletedAt?: Date;

}

/* -------------------------------------------------------------------------- */
/*                        REQUEST MESSAGE                                     */
/* -------------------------------------------------------------------------- */

export interface RequestMessage<T = unknown>
    extends OutgoingMessage<T> {

    operation: string;

    requiresAuthentication: boolean;

}

/* -------------------------------------------------------------------------- */
/*                       RESPONSE MESSAGE                                     */
/* -------------------------------------------------------------------------- */

export interface ResponseMessage<T = unknown>
    extends IncomingMessage<T> {

    success: boolean;

    statusCode: number;

    statusMessage: string;

}

/* -------------------------------------------------------------------------- */
/*                         EVENT MESSAGE                                      */
/* -------------------------------------------------------------------------- */

export interface EventMessage<T = unknown>
    extends IncomingMessage<T> {

    event: string;

    channel: string;

}

/* -------------------------------------------------------------------------- */
/*                         ERROR MESSAGE                                      */
/* -------------------------------------------------------------------------- */

export interface ErrorMessage {

    code: string;

    message: string;

    details?: unknown;

    recoverable: boolean;

    timestamp: Date;

}

export interface ErrorResponse
    extends ResponseMessage<ErrorMessage> {

}

/* -------------------------------------------------------------------------- */
/*                         ACKNOWLEDGEMENT                                    */
/* -------------------------------------------------------------------------- */

export interface AcknowledgementMessage {

    requestId: string;

    acknowledged: boolean;

    timestamp: Date;

}

/* -------------------------------------------------------------------------- */
/*                           SUBSCRIPTIONS                                    */
/* -------------------------------------------------------------------------- */

export interface Subscription {

    id: string;

    channel: string;

    topic?: string;

    symbol?: string;

    active: boolean;

    subscribedAt: Date;

    metadata?: Record<string, unknown>;

}

export interface SubscriptionRequest {

    channel: string;

    topic?: string;

    symbol?: string;

    parameters?: Record<string, unknown>;

}

export interface SubscriptionResponse {

    subscriptionId: string;

    successful: boolean;

    channel: string;

    timestamp: Date;

}

/* -------------------------------------------------------------------------- */
/*                              CHANNELS                                      */
/* -------------------------------------------------------------------------- */

export interface Channel {

    id: string;

    name: string;

    description?: string;

    authenticated: boolean;

    realtime: boolean;

    enabled: boolean;

}

export interface ChannelStatistics {

    channel: string;

    subscriberCount: number;

    messagesSent: number;

    messagesReceived: number;

    lastActivity: Date;

}

/* -------------------------------------------------------------------------- */
/*                           EVENT HANDLERS                                   */
/* -------------------------------------------------------------------------- */

export type MessageHandler<T = unknown> = (

    message: IncomingMessage<T>

) => Promise<void> | void;

export type EventHandler<T = unknown> = (

    event: EventMessage<T>

) => Promise<void> | void;

export type ErrorHandler = (

    error: ErrorMessage

) => Promise<void> | void;

export type ConnectionHandler = (

    client: WebSocketClient

) => Promise<void> | void;

/* -------------------------------------------------------------------------- */
/*                           EVENT LISTENERS                                  */
/* -------------------------------------------------------------------------- */

export interface EventListener {

    id: string;

    event: string;

    once: boolean;

    enabled: boolean;

    createdAt: Date;

}

/* -------------------------------------------------------------------------- */
/*                            MESSAGE QUEUE                                   */
/* -------------------------------------------------------------------------- */

export interface QueueItem<T = unknown> {

    id: string;

    message: WebSocketMessage<T>;

    priority: number;

    attempts: number;

    queuedAt: Date;

}

export interface MessageQueue {

    items: QueueItem[];

    maximumSize: number;

    currentSize: number;

}

/* -------------------------------------------------------------------------- */
/*                           BATCH PROCESSING                                 */
/* -------------------------------------------------------------------------- */

export interface MessageBatch<T = unknown> {

    id: string;

    messages: WebSocketMessage<T>[];

    createdAt: Date;

    processed: boolean;

}

export interface BatchProcessingResult {

    batchId: string;

    processedMessages: number;

    failedMessages: number;

    processingTime: number;

}

/* -------------------------------------------------------------------------- */
/*                             PARSER                                         */
/* -------------------------------------------------------------------------- */

export interface ParseResult<T = unknown> {

    successful: boolean;

    message?: WebSocketMessage<T>;

    error?: ErrorMessage;

}

export interface ParserConfiguration {

    strict: boolean;

    validateSchema: boolean;

    allowUnknownFields: boolean;

}

/* -------------------------------------------------------------------------- */
/*                              METRICS                                       */
/* -------------------------------------------------------------------------- */

export interface WebSocketMetrics {

    totalConnections: number;

    activeConnections: number;

    totalMessagesSent: number;

    totalMessagesReceived: number;

    averageLatency: number;

    averageProcessingTime: number;

    totalErrors: number;

    uptime: number;

}

/* -------------------------------------------------------------------------- */
/*                              LOGGER                                        */
/* -------------------------------------------------------------------------- */

export interface LogEntry {

    timestamp: Date;

    level: WebSocketLogLevel;

    message: string;

    context?: Record<string, unknown>;

}

export interface LoggerConfiguration {

    enabled: boolean;

    level: WebSocketLogLevel;

    includeTimestamp: boolean;

    includeContext: boolean;

}

/* -------------------------------------------------------------------------- */
/*                            RUNTIME STATE                                   */
/* -------------------------------------------------------------------------- */

export interface RuntimeState {

    initialized: boolean;

    running: boolean;

    shuttingDown: boolean;

    startedAt?: Date;

    stoppedAt?: Date;

}

export interface WebSocketContext {

    client: WebSocketClient;

    connection: ConnectionInformation;

    authentication: AuthenticationState;

    health: ConnectionHealth;

    statistics: ConnectionStatistics;

    runtime: RuntimeState;

}

/* -------------------------------------------------------------------------- */
/*                         COLLECTIONS                                        */
/* -------------------------------------------------------------------------- */

export interface ClientCollection {

    items: WebSocketClient[];

    total: number;

}

export interface SubscriptionCollection {

    items: Subscription[];

    total: number;

}

export interface ChannelCollection {

    items: Channel[];

    total: number;

}

export interface MessageCollection<T = unknown> {

    items: WebSocketMessage<T>[];

    total: number;

}

export interface QueueCollection {

    items: QueueItem[];

    total: number;

}

export interface LogCollection {

    items: LogEntry[];

    total: number;

}

/* -------------------------------------------------------------------------- */
/*                           REGISTRIES                                       */
/* -------------------------------------------------------------------------- */

export interface ClientRegistry {

    clients: WebSocketClient[];

}

export interface SubscriptionRegistry {

    subscriptions: Subscription[];

}

export interface ChannelRegistry {

    channels: Channel[];

}

export interface HandlerRegistry {

    messageHandlers: Record<string, MessageHandler>;

    eventHandlers: Record<string, EventHandler>;

    errorHandlers: Record<string, ErrorHandler>;

    connectionHandlers: Record<string, ConnectionHandler>;

}

/* -------------------------------------------------------------------------- */
/*                           LOOKUP MAPS                                      */
/* -------------------------------------------------------------------------- */

export type ClientMap =
    Record<string, WebSocketClient>;

export type SubscriptionMap =
    Record<string, Subscription>;

export type ChannelMap =
    Record<string, Channel>;

export type QueueMap =
    Record<string, QueueItem>;

export type MessageMap<T = unknown> =
    Record<string, WebSocketMessage<T>>;

export type ListenerMap =
    Record<string, EventListener>;

/* -------------------------------------------------------------------------- */
/*                           CALLBACK TYPES                                   */
/* -------------------------------------------------------------------------- */

export type ConnectedCallback = (

    client: WebSocketClient

) => void;

export type DisconnectedCallback = (

    client: WebSocketClient

) => void;

export type ReconnectedCallback = (

    client: WebSocketClient

) => void;

export type AuthenticatedCallback = (

    authentication: AuthenticationState

) => void;

export type QueueProcessedCallback = (

    result: BatchProcessingResult

) => void;

export type MetricsUpdatedCallback = (

    metrics: WebSocketMetrics

) => void;

/* -------------------------------------------------------------------------- */
/*                         FEATURE CONFIGURATION                              */
/* -------------------------------------------------------------------------- */

export interface FeatureConfiguration {

    autoReconnect: boolean;

    heartbeat: boolean;

    batching: boolean;

    compression: boolean;

    metrics: boolean;

    logging: boolean;

    tracing: boolean;

}

/* -------------------------------------------------------------------------- */
/*                        READONLY TYPES                                      */
/* -------------------------------------------------------------------------- */

export type ReadonlyClient =
    Readonly<WebSocketClient>;

export type ReadonlySubscription =
    Readonly<Subscription>;

export type ReadonlyChannel =
    Readonly<Channel>;

export type ReadonlyMetrics =
    Readonly<WebSocketMetrics>;

export type ReadonlyConnectionHealth =
    Readonly<ConnectionHealth>;

export type ReadonlyRuntimeState =
    Readonly<RuntimeState>;

/* -------------------------------------------------------------------------- */
/*                        WEBSOCKET VERSION                                   */
/* -------------------------------------------------------------------------- */

export interface WebSocketVersion {

    version: string;

    protocolVersion: string;

    build: string;

    generatedAt: Date;

}

/* -------------------------------------------------------------------------- */
/*                      WEBSOCKET CAPABILITIES                                */
/* -------------------------------------------------------------------------- */

export interface WebSocketCapabilities {

    supportsBinary: boolean;

    supportsCompression: boolean;

    supportsAuthentication: boolean;

    supportsHeartbeat: boolean;

    supportsAutoReconnect: boolean;

    supportsSubscriptions: boolean;

    supportsBatching: boolean;

    supportsMetrics: boolean;

    supportsLogging: boolean;

    supportsTracing: boolean;

    supportsEncryption: boolean;

    supportsRateLimiting: boolean;

}

/* -------------------------------------------------------------------------- */
/*                     DEFAULT RUNTIME STATE                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_RUNTIME_STATE: RuntimeState = {

    initialized: false,

    running: false,

    shuttingDown: false

};

export const DEFAULT_CONNECTION_HEALTH: ConnectionHealth = {

    healthy: false,

    latency: 0,

    missedHeartbeats: 0,

    reconnectAttempts: 0

};

export const DEFAULT_CONNECTION_STATISTICS: ConnectionStatistics = {

    bytesSent: 0,

    bytesReceived: 0,

    messagesSent: 0,

    messagesReceived: 0,

    reconnectCount: 0,

    errorCount: 0,

    uptime: 0

};

export const DEFAULT_FEATURE_CONFIGURATION: FeatureConfiguration = {

    autoReconnect: true,

    heartbeat: true,

    batching: true,

    compression: true,

    metrics: true,

    logging: true,

    tracing: false

};

/* -------------------------------------------------------------------------- */
/*                              UTILITIES                                     */
/* -------------------------------------------------------------------------- */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncHandler<T = void> =
    () => Promise<T>;

export type AsyncMessageHandler<T = unknown> =
(
    message: WebSocketMessage<T>
) => Promise<void>;

export type Dictionary<T> =
    Record<string, T>;

export type Identifier = string;

/* -------------------------------------------------------------------------- */
/*                              END OF FILE                                   */
/* -------------------------------------------------------------------------- */