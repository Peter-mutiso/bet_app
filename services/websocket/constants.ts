/**
 * ============================================================================
 * WEBSOCKET CONSTANTS
 * ============================================================================
 * Central configuration for the WebSocket infrastructure.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                              CONNECTION                                    */
/* -------------------------------------------------------------------------- */

export const WS_PROTOCOL = "wss";

export const WS_DEFAULT_PORT = 443;

export const WS_CONNECT_TIMEOUT = 15000;

export const WS_CLOSE_TIMEOUT = 5000;

export const WS_MAX_CONNECTIONS = 3;

/* -------------------------------------------------------------------------- */
/*                              HEARTBEAT                                     */
/* -------------------------------------------------------------------------- */

export const WS_HEARTBEAT_INTERVAL = 30000;

export const WS_HEARTBEAT_TIMEOUT = 10000;

export const WS_MAX_MISSED_HEARTBEATS = 3;

/* -------------------------------------------------------------------------- */
/*                              RECONNECT                                     */
/* -------------------------------------------------------------------------- */

export const WS_INITIAL_RECONNECT_DELAY = 1000;

export const WS_MAX_RECONNECT_DELAY = 30000;

export const WS_RECONNECT_MULTIPLIER = 2;

export const WS_MAX_RECONNECT_ATTEMPTS = 20;

export const WS_ENABLE_EXPONENTIAL_BACKOFF = true;

/* -------------------------------------------------------------------------- */
/*                               QUEUE                                        */
/* -------------------------------------------------------------------------- */

export const WS_MAX_QUEUE_SIZE = 10000;

export const WS_BATCH_SIZE = 100;

export const WS_BATCH_INTERVAL = 50;

/* -------------------------------------------------------------------------- */
/*                            MESSAGE SIZE                                    */
/* -------------------------------------------------------------------------- */

export const WS_MAX_MESSAGE_SIZE = 1024 * 1024;

export const WS_MAX_BINARY_SIZE = 5 * 1024 * 1024;

/* -------------------------------------------------------------------------- */
/*                              LATENCY                                       */
/* -------------------------------------------------------------------------- */

export const WS_HIGH_LATENCY_THRESHOLD = 250;

export const WS_CRITICAL_LATENCY_THRESHOLD = 500;
/* -------------------------------------------------------------------------- */
/*                           CONNECTION STATES                                */
/* -------------------------------------------------------------------------- */

export enum WebSocketConnectionState {

    IDLE = "IDLE",

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    AUTHENTICATING = "AUTHENTICATING",

    AUTHENTICATED = "AUTHENTICATED",

    RECONNECTING = "RECONNECTING",

    DISCONNECTING = "DISCONNECTING",

    DISCONNECTED = "DISCONNECTED",

    CLOSED = "CLOSED",

    ERROR = "ERROR"
}

/* -------------------------------------------------------------------------- */
/*                           CONNECTION EVENTS                                */
/* -------------------------------------------------------------------------- */

export const WS_EVENT_CONNECT = "ws:connect";

export const WS_EVENT_CONNECTED = "ws:connected";

export const WS_EVENT_DISCONNECT = "ws:disconnect";

export const WS_EVENT_DISCONNECTED = "ws:disconnected";

export const WS_EVENT_RECONNECT = "ws:reconnect";

export const WS_EVENT_RECONNECTED = "ws:reconnected";

export const WS_EVENT_ERROR = "ws:error";

export const WS_EVENT_MESSAGE = "ws:message";

export const WS_EVENT_SEND = "ws:send";

export const WS_EVENT_AUTHENTICATED = "ws:authenticated";

export const WS_EVENT_SUBSCRIBED = "ws:subscribed";

export const WS_EVENT_UNSUBSCRIBED = "ws:unsubscribed";

/* -------------------------------------------------------------------------- */
/*                           MESSAGE TYPES                                    */
/* -------------------------------------------------------------------------- */

export const WS_MESSAGE_REQUEST = "request";

export const WS_MESSAGE_RESPONSE = "response";

export const WS_MESSAGE_EVENT = "event";

export const WS_MESSAGE_ERROR = "error";

export const WS_MESSAGE_PING = "ping";

export const WS_MESSAGE_PONG = "pong";

export const WS_MESSAGE_HEARTBEAT = "heartbeat";

/* -------------------------------------------------------------------------- */
/*                           CHANNELS                                         */
/* -------------------------------------------------------------------------- */

export const WS_CHANNEL_MARKET = "market";

export const WS_CHANNEL_CANDLES = "candles";

export const WS_CHANNEL_TICKS = "ticks";

export const WS_CHANNEL_ORDERBOOK = "orderbook";

export const WS_CHANNEL_TRADES = "trades";

export const WS_CHANNEL_POSITIONS = "positions";

export const WS_CHANNEL_ORDERS = "orders";

export const WS_CHANNEL_CONTRACTS = "contracts";

export const WS_CHANNEL_PORTFOLIO = "portfolio";

export const WS_CHANNEL_WALLET = "wallet";

export const WS_CHANNEL_NOTIFICATIONS = "notifications";

export const WS_CHANNEL_SIGNALS = "signals";

export const WS_CHANNEL_NEWS = "news";

export const WS_CHANNEL_AI = "ai";

/* -------------------------------------------------------------------------- */
/*                      AUTHENTICATION                                        */
/* -------------------------------------------------------------------------- */

export const WS_AUTH_TIMEOUT = 15000;

export const WS_AUTH_REFRESH_INTERVAL = 15 * 60 * 1000;

export const WS_AUTH_HEADER = "Authorization";

export const WS_BEARER_PREFIX = "Bearer";

/* -------------------------------------------------------------------------- */
/*                         COMPRESSION                                        */
/* -------------------------------------------------------------------------- */

export const WS_ENABLE_COMPRESSION = true;

export const WS_COMPRESSION_THRESHOLD = 1024;

export const WS_COMPRESSION_LEVEL = 6;

/* -------------------------------------------------------------------------- */
/*                          LOGGING                                           */
/* -------------------------------------------------------------------------- */

export enum WebSocketLogLevel {

    TRACE = "TRACE",

    DEBUG = "DEBUG",

    INFO = "INFO",

    WARN = "WARN",

    ERROR = "ERROR",

    FATAL = "FATAL"
}

/* -------------------------------------------------------------------------- */
/*                       PERFORMANCE                                          */
/* -------------------------------------------------------------------------- */

export const WS_MONITOR_MEMORY = true;

export const WS_MONITOR_CPU = true;

export const WS_MONITOR_NETWORK = true;

export const WS_PERFORMANCE_SAMPLE_INTERVAL = 5000;

export const WS_MAX_PROCESSING_TIME = 100;

export const WS_MAX_EVENT_LOOP_DELAY = 50;
/* -------------------------------------------------------------------------- */
/*                          CLOSE CODES                                       */
/* -------------------------------------------------------------------------- */

export enum WebSocketCloseCode {

    NORMAL_CLOSURE = 1000,

    GOING_AWAY = 1001,

    PROTOCOL_ERROR = 1002,

    UNSUPPORTED_DATA = 1003,

    NO_STATUS_RECEIVED = 1005,

    ABNORMAL_CLOSURE = 1006,

    INVALID_PAYLOAD = 1007,

    POLICY_VIOLATION = 1008,

    MESSAGE_TOO_BIG = 1009,

    MANDATORY_EXTENSION = 1010,

    INTERNAL_ERROR = 1011,

    SERVICE_RESTART = 1012,

    TRY_AGAIN_LATER = 1013,

    BAD_GATEWAY = 1014,

    TLS_HANDSHAKE_FAILURE = 1015
}

/* -------------------------------------------------------------------------- */
/*                          RETRY POLICY                                      */
/* -------------------------------------------------------------------------- */

export enum RetryStrategy {

    NONE = "NONE",

    IMMEDIATE = "IMMEDIATE",

    FIXED_DELAY = "FIXED_DELAY",

    LINEAR_BACKOFF = "LINEAR_BACKOFF",

    EXPONENTIAL_BACKOFF = "EXPONENTIAL_BACKOFF"
}

export const WS_DEFAULT_RETRY_STRATEGY =
    RetryStrategy.EXPONENTIAL_BACKOFF;

export const WS_RETRY_JITTER = true;

export const WS_RETRY_JITTER_FACTOR = 0.25;

/* -------------------------------------------------------------------------- */
/*                          DEFAULT ENDPOINTS                                 */
/* -------------------------------------------------------------------------- */

export const WS_DEFAULT_ENDPOINT = "/ws";

export const WS_PUBLIC_ENDPOINT = "/ws/public";

export const WS_PRIVATE_ENDPOINT = "/ws/private";

export const WS_MARKET_ENDPOINT = "/ws/market";

export const WS_TRADING_ENDPOINT = "/ws/trading";

export const WS_NOTIFICATION_ENDPOINT = "/ws/notifications";

/* -------------------------------------------------------------------------- */
/*                          API VERSION                                       */
/* -------------------------------------------------------------------------- */

export const WS_PROTOCOL_VERSION = "1.0.0";

export const WS_API_VERSION = "v1";

/* -------------------------------------------------------------------------- */
/*                          SECURITY                                          */
/* -------------------------------------------------------------------------- */

export const WS_ENABLE_TLS = true;

export const WS_VERIFY_CERTIFICATE = true;

export const WS_ALLOW_SELF_SIGNED = false;

export const WS_ENABLE_ORIGIN_CHECK = true;

export const WS_ENABLE_TOKEN_REFRESH = true;

/* -------------------------------------------------------------------------- */
/*                        RATE LIMITING                                       */
/* -------------------------------------------------------------------------- */

export const WS_MAX_MESSAGES_PER_SECOND = 100;

export const WS_MAX_SUBSCRIPTIONS = 500;

export const WS_MAX_CONCURRENT_REQUESTS = 50;

export const WS_RATE_LIMIT_WINDOW = 1000;

/* -------------------------------------------------------------------------- */
/*                         BUFFER SETTINGS                                    */
/* -------------------------------------------------------------------------- */

export const WS_SEND_BUFFER_SIZE = 1024 * 1024;

export const WS_RECEIVE_BUFFER_SIZE = 1024 * 1024;

export const WS_MAX_PENDING_MESSAGES = 5000;

export const WS_FLUSH_INTERVAL = 25;

/* -------------------------------------------------------------------------- */
/*                        HEALTH MONITORING                                   */
/* -------------------------------------------------------------------------- */

export const WS_HEALTH_CHECK_INTERVAL = 10000;

export const WS_MAX_HEALTH_FAILURES = 5;

export const WS_HEALTH_RECOVERY_TIMEOUT = 30000;

/* -------------------------------------------------------------------------- */
/*                         METRICS                                            */
/* -------------------------------------------------------------------------- */

export const WS_METRIC_CONNECTION_TIME = "connection_time";

export const WS_METRIC_RECONNECT_COUNT = "reconnect_count";

export const WS_METRIC_MESSAGES_SENT = "messages_sent";

export const WS_METRIC_MESSAGES_RECEIVED = "messages_received";

export const WS_METRIC_MESSAGES_DROPPED = "messages_dropped";

export const WS_METRIC_LATENCY = "latency";

export const WS_METRIC_THROUGHPUT = "throughput";

export const WS_METRIC_ERRORS = "errors";

/* -------------------------------------------------------------------------- */
/*                         ENVIRONMENT                                        */
/* -------------------------------------------------------------------------- */

export const WS_DEVELOPMENT = "development";

export const WS_STAGING = "staging";

export const WS_PRODUCTION = "production";

export const WS_DEFAULT_ENVIRONMENT =
    WS_DEVELOPMENT;

/* -------------------------------------------------------------------------- */
/*                        FEATURE FLAGS                                       */
/* -------------------------------------------------------------------------- */

export const WS_ENABLE_AUTO_RECONNECT = true;

export const WS_ENABLE_MESSAGE_QUEUE = true;

export const WS_ENABLE_HEARTBEAT = true;

export const WS_ENABLE_METRICS = true;

export const WS_ENABLE_LOGGING = true;

export const WS_ENABLE_TRACING = false;

export const WS_ENABLE_DEBUG_MESSAGES = false;

export const WS_ENABLE_BATCHING = true;

export const WS_ENABLE_DEDUPLICATION = true;

/* -------------------------------------------------------------------------- */
/*                      DEFAULT CONFIGURATION                                 */
/* -------------------------------------------------------------------------- */

export interface WebSocketConfiguration {

    url: string;

    reconnect: {

        enabled: boolean;

        strategy: RetryStrategy;

        maxAttempts: number;

        initialDelay: number;

        maximumDelay: number;
    };

    heartbeat: {

        enabled: boolean;

        interval: number;

        timeout: number;

        maximumMissedHeartbeats: number;
    };

    queue: {

        enabled: boolean;

        maximumSize: number;

        batchSize: number;

        batchInterval: number;
    };

    logging: {

        enabled: boolean;

        level: WebSocketLogLevel;
    };

    metrics: {

        enabled: boolean;

        sampleInterval: number;
    };
}

export const DEFAULT_WEBSOCKET_CONFIGURATION:
Readonly<WebSocketConfiguration> = {

    url: "",

    reconnect: {

        enabled: WS_ENABLE_AUTO_RECONNECT,

        strategy: WS_DEFAULT_RETRY_STRATEGY,

        maxAttempts: WS_MAX_RECONNECT_ATTEMPTS,

        initialDelay: WS_INITIAL_RECONNECT_DELAY,

        maximumDelay: WS_MAX_RECONNECT_DELAY
    },

    heartbeat: {

        enabled: WS_ENABLE_HEARTBEAT,

        interval: WS_HEARTBEAT_INTERVAL,

        timeout: WS_HEARTBEAT_TIMEOUT,

        maximumMissedHeartbeats: WS_MAX_MISSED_HEARTBEATS
    },

    queue: {

        enabled: WS_ENABLE_MESSAGE_QUEUE,

        maximumSize: WS_MAX_QUEUE_SIZE,

        batchSize: WS_BATCH_SIZE,

        batchInterval: WS_BATCH_INTERVAL
    },

    logging: {

        enabled: WS_ENABLE_LOGGING,

        level: WebSocketLogLevel.INFO
    },

    metrics: {

        enabled: WS_ENABLE_METRICS,

        sampleInterval: WS_PERFORMANCE_SAMPLE_INTERVAL
    }
};

/* -------------------------------------------------------------------------- */
/*                            TIME CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

export const ONE_SECOND = 1000;

export const FIVE_SECONDS = 5 * ONE_SECOND;

export const TEN_SECONDS = 10 * ONE_SECOND;

export const THIRTY_SECONDS = 30 * ONE_SECOND;

export const ONE_MINUTE = 60 * ONE_SECOND;

export const FIVE_MINUTES = 5 * ONE_MINUTE;

export const TEN_MINUTES = 10 * ONE_MINUTE;

export const FIFTEEN_MINUTES = 15 * ONE_MINUTE;

export const THIRTY_MINUTES = 30 * ONE_MINUTE;

export const ONE_HOUR = 60 * ONE_MINUTE;

/* -------------------------------------------------------------------------- */
/*                           CACHE SETTINGS                                   */
/* -------------------------------------------------------------------------- */

export const WS_CACHE_ENABLED = true;

export const WS_CACHE_SIZE = 10000;

export const WS_CACHE_TTL = FIVE_MINUTES;

/* -------------------------------------------------------------------------- */
/*                           ERROR CODES                                      */
/* -------------------------------------------------------------------------- */

export enum WebSocketErrorCode {

    UNKNOWN = "UNKNOWN",

    CONNECTION_FAILED = "CONNECTION_FAILED",

    CONNECTION_TIMEOUT = "CONNECTION_TIMEOUT",

    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",

    AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",

    SUBSCRIPTION_FAILED = "SUBSCRIPTION_FAILED",

    INVALID_MESSAGE = "INVALID_MESSAGE",

    PARSE_ERROR = "PARSE_ERROR",

    HEARTBEAT_TIMEOUT = "HEARTBEAT_TIMEOUT",

    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

    MESSAGE_TOO_LARGE = "MESSAGE_TOO_LARGE",

    INTERNAL_ERROR = "INTERNAL_ERROR"
}

/* -------------------------------------------------------------------------- */
/*                      RESERVED EVENT NAMES                                  */
/* -------------------------------------------------------------------------- */

export const WS_RESERVED_EVENTS = Object.freeze([

    "connect",

    "disconnect",

    "reconnect",

    "message",

    "error",

    "ping",

    "pong",

    "heartbeat"

] as const);

/* -------------------------------------------------------------------------- */
/*                     RESERVED MESSAGE FIELDS                                */
/* -------------------------------------------------------------------------- */

export const WS_RESERVED_FIELDS = Object.freeze([

    "id",

    "type",

    "channel",

    "event",

    "timestamp",

    "payload",

    "error"

] as const);

/* -------------------------------------------------------------------------- */
/*                        INTERNAL IDENTIFIERS                                */
/* -------------------------------------------------------------------------- */

export const WS_INTERNAL_CLIENT_ID = "__client__";

export const WS_INTERNAL_SERVER_ID = "__server__";

export const WS_SYSTEM_CHANNEL = "__system__";

/* -------------------------------------------------------------------------- */
/*                         DEFAULT HEADERS                                    */
/* -------------------------------------------------------------------------- */

export const WS_DEFAULT_HEADERS = Object.freeze({

    "Content-Type": "application/json",

    "Accept": "application/json"

});

/* -------------------------------------------------------------------------- */
/*                         SUPPORTED PROTOCOLS                                */
/* -------------------------------------------------------------------------- */

export const WS_SUPPORTED_PROTOCOLS = Object.freeze([

    "json",

    "binary"

] as const);

/* -------------------------------------------------------------------------- */
/*                       SUPPORTED ENVIRONMENTS                               */
/* -------------------------------------------------------------------------- */

export const WS_ENVIRONMENTS = Object.freeze([

    WS_DEVELOPMENT,

    WS_STAGING,

    WS_PRODUCTION

] as const);

/* -------------------------------------------------------------------------- */
/*                        DEFAULT METRIC NAMES                                */
/* -------------------------------------------------------------------------- */

export const WS_METRICS = Object.freeze({

    CONNECTION_TIME: WS_METRIC_CONNECTION_TIME,

    RECONNECT_COUNT: WS_METRIC_RECONNECT_COUNT,

    MESSAGES_SENT: WS_METRIC_MESSAGES_SENT,

    MESSAGES_RECEIVED: WS_METRIC_MESSAGES_RECEIVED,

    LATENCY: WS_METRIC_LATENCY,

    THROUGHPUT: WS_METRIC_THROUGHPUT,

    ERRORS: WS_METRIC_ERRORS

});

/* -------------------------------------------------------------------------- */
/*                            END OF FILE                                     */
/* -------------------------------------------------------------------------- */