/**
 * ============================================================================
 * MARKET ENUMS
 * ============================================================================
 * Shared market-specific enumerations.
 *
 * IMPORTANT:
 * This file contains ONLY enums used by market-related modules.
 *
 * Used by:
 * - instrument.ts
 * - market.ts
 * - candle.ts
 * - chart.ts
 * - websocket.ts
 * - orderbook.ts
 * - signal.ts
 * - statistics.ts
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                               MARKET TYPE                                  */
/* -------------------------------------------------------------------------- */

export enum MarketType {

    FOREX = "FOREX",

    STOCK = "STOCK",

    INDEX = "INDEX",

    COMMODITY = "COMMODITY",

    CRYPTO = "CRYPTO",

    ETF = "ETF",

    FUTURES = "FUTURES",

    OPTIONS = "OPTIONS",

    SYNTHETIC = "SYNTHETIC",

    DERIVED = "DERIVED"
}

/* -------------------------------------------------------------------------- */
/*                          SYMBOL CATEGORY                                   */
/* -------------------------------------------------------------------------- */

export enum SymbolCategory {

    MAJOR = "MAJOR",

    MINOR = "MINOR",

    EXOTIC = "EXOTIC",

    METAL = "METAL",

    ENERGY = "ENERGY",

    AGRICULTURE = "AGRICULTURE",

    INDEX = "INDEX",

    EQUITY = "EQUITY",

    CRYPTO = "CRYPTO",

    VOLATILITY = "VOLATILITY",

    BOOM = "BOOM",

    CRASH = "CRASH",

    STEP = "STEP",

    RANGE_BREAK = "RANGE_BREAK"
}

/* -------------------------------------------------------------------------- */
/*                          INSTRUMENT STATUS                                 */
/* -------------------------------------------------------------------------- */

export enum InstrumentStatus {

    ACTIVE = "ACTIVE",

    CLOSED = "CLOSED",

    HALTED = "HALTED",

    SUSPENDED = "SUSPENDED",

    DELISTED = "DELISTED",

    MAINTENANCE = "MAINTENANCE"
}

/* -------------------------------------------------------------------------- */
/*                         CONTRACT TYPE                                      */
/* -------------------------------------------------------------------------- */

export enum ContractType {

    SPOT = "SPOT",

    CFD = "CFD",

    FUTURE = "FUTURE",

    OPTION = "OPTION",

    DIGITAL_OPTION = "DIGITAL_OPTION",

    MULTIPLIER = "MULTIPLIER"
}

/* -------------------------------------------------------------------------- */
/*                         EXECUTION TYPE                                     */
/* -------------------------------------------------------------------------- */

export enum ExecutionType {

    MARKET = "MARKET",

    INSTANT = "INSTANT",

    REQUEST = "REQUEST",

    EXCHANGE = "EXCHANGE"
}

/* -------------------------------------------------------------------------- */
/*                         TRADING MODE                                       */
/* -------------------------------------------------------------------------- */

export enum TradingMode {

    FULL = "FULL",

    CLOSE_ONLY = "CLOSE_ONLY",

    READ_ONLY = "READ_ONLY",

    DISABLED = "DISABLED"
}

/* -------------------------------------------------------------------------- */
/*                          EXCHANGE REGION                                   */
/* -------------------------------------------------------------------------- */

export enum ExchangeRegion {

    GLOBAL = "GLOBAL",

    AFRICA = "AFRICA",

    EUROPE = "EUROPE",

    NORTH_AMERICA = "NORTH_AMERICA",

    SOUTH_AMERICA = "SOUTH_AMERICA",

    ASIA = "ASIA",

    OCEANIA = "OCEANIA",

    MIDDLE_EAST = "MIDDLE_EAST"
}

/* -------------------------------------------------------------------------- */
/*                          MARKET STATUS                                     */
/* -------------------------------------------------------------------------- */

export enum MarketStatus {

    PRE_OPEN = "PRE_OPEN",

    OPEN = "OPEN",

    CLOSED = "CLOSED",

    POST_MARKET = "POST_MARKET",

    HOLIDAY = "HOLIDAY",

    MAINTENANCE = "MAINTENANCE"
}

/* -------------------------------------------------------------------------- */
/*                          SESSION STATUS                                    */
/* -------------------------------------------------------------------------- */

export enum TradingSessionStatus {

    UPCOMING = "UPCOMING",

    OPEN = "OPEN",

    CLOSING = "CLOSING",

    CLOSED = "CLOSED"
}

/* -------------------------------------------------------------------------- */
/*                          PRICE MOVEMENT                                    */
/* -------------------------------------------------------------------------- */

export enum PriceMovement {

    UP = "UP",

    DOWN = "DOWN",

    FLAT = "FLAT"
}

/* -------------------------------------------------------------------------- */
/*                          QUOTE STATUS                                      */
/* -------------------------------------------------------------------------- */

export enum QuoteStatus {

    LIVE = "LIVE",

    DELAYED = "DELAYED",

    HISTORICAL = "HISTORICAL",

    STALE = "STALE"
}

/* -------------------------------------------------------------------------- */
/*                          MARKET DEPTH                                      */
/* -------------------------------------------------------------------------- */

export enum MarketDepthLevel {

    LEVEL_1 = "LEVEL_1",

    LEVEL_2 = "LEVEL_2",

    LEVEL_3 = "LEVEL_3"
}

/* -------------------------------------------------------------------------- */
/*                          ORDER SIDE                                        */
/* -------------------------------------------------------------------------- */

export enum OrderSide {

    BUY = "BUY",

    SELL = "SELL"
}

/* -------------------------------------------------------------------------- */
/*                         ORDER TYPE                                         */
/* -------------------------------------------------------------------------- */

export enum MarketOrderType {

    MARKET = "MARKET",

    LIMIT = "LIMIT",

    STOP = "STOP",

    STOP_LIMIT = "STOP_LIMIT"
}

/* -------------------------------------------------------------------------- */
/*                           LIQUIDITY                                        */
/* -------------------------------------------------------------------------- */

export enum LiquidityLevel {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    NORMAL = "NORMAL",

    HIGH = "HIGH",

    VERY_HIGH = "VERY_HIGH"
}

/* -------------------------------------------------------------------------- */
/*                        MARKET VOLATILITY                                   */
/* -------------------------------------------------------------------------- */

export enum MarketVolatility {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    NORMAL = "NORMAL",

    HIGH = "HIGH",

    EXTREME = "EXTREME"
}

/* -------------------------------------------------------------------------- */
/*                          TREND                                             */
/* -------------------------------------------------------------------------- */

export enum MarketTrend {

    STRONG_BULLISH = "STRONG_BULLISH",

    BULLISH = "BULLISH",

    SIDEWAYS = "SIDEWAYS",

    BEARISH = "BEARISH",

    STRONG_BEARISH = "STRONG_BEARISH"
}

/* -------------------------------------------------------------------------- */
/*                       STREAM STATUS                                        */
/* -------------------------------------------------------------------------- */

export enum StreamStatus {

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    RECONNECTING = "RECONNECTING",

    DISCONNECTED = "DISCONNECTED",

    FAILED = "FAILED"
}

/* -------------------------------------------------------------------------- */
/*                     SUBSCRIPTION STATUS                                    */
/* -------------------------------------------------------------------------- */

export enum SubscriptionStatus {

    SUBSCRIBED = "SUBSCRIBED",

    PENDING = "PENDING",

    UNSUBSCRIBED = "UNSUBSCRIBED",

    FAILED = "FAILED"
}

/* -------------------------------------------------------------------------- */
/*                          CACHE STRATEGY                                    */
/* -------------------------------------------------------------------------- */

export enum MarketCachePolicy {

    MEMORY = "MEMORY",

    SESSION = "SESSION",

    LOCAL_STORAGE = "LOCAL_STORAGE",

    INDEXED_DB = "INDEXED_DB",

    NONE = "NONE"
}

/* -------------------------------------------------------------------------- */
/*                           END OF FILE                                      */
/* -------------------------------------------------------------------------- */