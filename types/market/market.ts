/**
 * ============================================================================
 * MARKET TYPES
 * ============================================================================
 * Core market domain models.
 *
 * Used by:
 * - Trading Engine
 * - Market Watch
 * - Trading Charts
 * - WebSocket Streams
 * - Order Execution
 * - Watchlists
 * - Technical Analysis
 * - AI Prediction
 * ============================================================================
 */

import {
    Direction,
    ThemeMode,
    Timeframe,
} from "../common/enums";

import { Money } from "../common/money";

/* -------------------------------------------------------------------------- */
/*                              MARKET TYPES                                  */
/* -------------------------------------------------------------------------- */

export enum MarketType {

    FOREX = "FOREX",

    SYNTHETIC = "SYNTHETIC",

    STOCK = "STOCK",

    INDEX = "INDEX",

    ETF = "ETF",

    CRYPTO = "CRYPTO",

    COMMODITY = "COMMODITY",

    METAL = "METAL",

    ENERGY = "ENERGY",

    BOND = "BOND",

    OPTION = "OPTION",

    FUTURE = "FUTURE"
}

export enum MarketStatus {

    OPEN = "OPEN",

    CLOSED = "CLOSED",

    PRE_OPEN = "PRE_OPEN",

    POST_CLOSE = "POST_CLOSE",

    HALTED = "HALTED",

    SUSPENDED = "SUSPENDED",

    MAINTENANCE = "MAINTENANCE"
}

export enum QuoteType {

    REALTIME = "REALTIME",

    DELAYED = "DELAYED",

    SNAPSHOT = "SNAPSHOT"
}

export enum TickDirection {

    UP = "UP",

    DOWN = "DOWN",

    UNCHANGED = "UNCHANGED"
}

export enum StreamStatus {

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    DISCONNECTED = "DISCONNECTED",

    RECONNECTING = "RECONNECTING",

    ERROR = "ERROR"
}

export enum MarketSessionType {

    ASIA = "ASIA",

    EUROPE = "EUROPE",

    AMERICA = "AMERICA",

    PACIFIC = "PACIFIC",

    GLOBAL = "GLOBAL"
}

export enum LiquidityLevel {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH",
}

export enum InstrumentStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELISTED = "DELISTED",
    SUSPENDED = "SUSPENDED",
}

/* -------------------------------------------------------------------------- */
/*                          TRADING HOURS                                     */
/* -------------------------------------------------------------------------- */

export interface TradingHours {
    opensAt: string;
    closesAt: string;
    timezone: string;
    openDays: number[];
    supportsWeekendTrading: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               EXCHANGE                                     */
/* -------------------------------------------------------------------------- */

export interface Exchange {
    id: string;
    code: string;
    name: string;
    country: string;
    timezone: string;
    currency: CurrencyCode;
    active: boolean;
    website?: string;
}
/* -------------------------------------------------------------------------- */
/*                              INSTRUMENT                                    */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             INSTRUMENT                                     */
/* -------------------------------------------------------------------------- */

export interface Instrument {

    id: string;

    symbol: string;

    displaySymbol: string;

    name: string;

    description?: string;

    marketType: MarketType;

    exchangeId: string;

    exchangeCode: string;

    baseCurrency?: CurrencyCode;

    quoteCurrency?: CurrencyCode;

    settlementCurrency?: CurrencyCode;

    digits: number;

    pipSize: number;

    tickSize: number;

    minimumTradeSize: number;

    maximumTradeSize: number;

    contractSize: number;

    leverage?: number;

    marginRate?: number;

    tradable: boolean;

    visible: boolean;

    favorite?: boolean;

    tags?: string[];

    icon?: string;

    createdAt: Date;

    updatedAt: Date;
}
/* -------------------------------------------------------------------------- */
/*                              MARKET PRICE                                  */
/* -------------------------------------------------------------------------- */

export interface MarketPrice {

    bid: number;

    ask: number;

    mid: number;

    last: number;

    open: number;

    high: number;

    low: number;

    close: number;

    spread: number;

    change: number;

    changePercent: number;

    volume: number;

    quoteVolume?: number;

    timestamp: Date;
}
/* -------------------------------------------------------------------------- */
/*                                  QUOTE                                     */
/* -------------------------------------------------------------------------- */

export interface Quote {

    instrumentId: string;

    symbol: string;

    type: QuoteType;

    price: MarketPrice;

    direction: TickDirection;

    sequence: number;

    provider?: string;

    latency?: number;

    receivedAt: Date;
}
/* -------------------------------------------------------------------------- */
/*                            MARKET SESSION                                  */
/* -------------------------------------------------------------------------- */

export interface MarketSession {

    id: string;

    type: MarketSessionType;

    name: string;

    startsAt: Date;

    endsAt: Date;

    active: boolean;

    timezone: string;
}

/* -------------------------------------------------------------------------- */
/*                              MARKET TICK                                   */
/* -------------------------------------------------------------------------- */

export interface MarketTick {

    id: string;

    instrumentId: string;

    symbol: string;

    bid: number;

    ask: number;

    price: number;

    spread: number;

    volume: number;

    direction: TickDirection;

    sequence: number;

    serverTime: Date;

    receivedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          MARKET STREAM                                     */
/* -------------------------------------------------------------------------- */

export interface MarketStream {

    id: string;

    instrumentId: string;

    status: StreamStatus;

    connected: boolean;

    subscribed: boolean;

    reconnectAttempts: number;

    latency: number;

    lastMessage: Date;

    heartbeatInterval: number;
}
/* -------------------------------------------------------------------------- */
/*                              HEARTBEAT                                     */
/* -------------------------------------------------------------------------- */

export interface Heartbeat {

    sequence: number;

    timestamp: Date;

    latency: number;
}

/* -------------------------------------------------------------------------- */
/*                           LIVE MARKET STATE                                */
/* -------------------------------------------------------------------------- */

export interface LiveMarketState {

    connected: boolean;

    streaming: boolean;

    subscriptions: number;

    activeMarkets: number;

    lastUpdate: Date;

    heartbeat: Heartbeat;
}

/* -------------------------------------------------------------------------- */
/*                            DATA QUALITY                                    */
/* -------------------------------------------------------------------------- */

export interface DataQuality {

    completeness: number;

    accuracy: number;

    freshness: number;

    latency: number;

    score: number;
}

/* -------------------------------------------------------------------------- */
/*                              MARKET EVENT                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                          MARKET EVENTS                                     */
/* -------------------------------------------------------------------------- */

export enum MarketEventType {

    CONNECTED = "CONNECTED",

    DISCONNECTED = "DISCONNECTED",

    PRICE_UPDATE = "PRICE_UPDATE",

    SUBSCRIBED = "SUBSCRIBED",

    UNSUBSCRIBED = "UNSUBSCRIBED",

    ERROR = "ERROR"
}

export interface MarketEvent {

    id: string;

    type: MarketEventType;

    instrumentId?: string;

    timestamp: Date;

    payload?: Record<string, unknown>;
}
/* -------------------------------------------------------------------------- */
/*                                MARKET                                      */
/* -------------------------------------------------------------------------- */

export interface Market {

    id: string;

    name: string;

    symbol: string;

    description?: string;

    type: MarketType;

    exchange: Exchange;

    instrument: Instrument;

    currentPrice: MarketPrice;

    tradingHours: TradingHours;

    session: MarketSession;

    status: MarketStatus;

    liquidity: LiquidityLevel;

    supportedTimeframes: Timeframe[];

    favorite: boolean;

    searchable: boolean;

    tradable: boolean;

    metadata?: MarketMetadata;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                            MARKET SNAPSHOT                                 */
/* -------------------------------------------------------------------------- */

export interface MarketSnapshot {

    instrumentId: string;

    symbol: string;

    currentPrice: number;

    bid: number;

    ask: number;

    open: number;

    high: number;

    low: number;

    previousClose: number;

    volume: number;

    change: number;

    changePercent: number;

    spread: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                            PRICE HISTORY                                   */
/* -------------------------------------------------------------------------- */

export interface PriceHistory {

    instrumentId: string;

    timeframe: Timeframe;

    from: Date;

    to: Date;

    highestPrice: number;

    lowestPrice: number;

    openingPrice: number;

    closingPrice: number;

    averagePrice: number;

    totalVolume: number;
}


/* -------------------------------------------------------------------------- */
/*                           MARKET METADATA                                  */
/* -------------------------------------------------------------------------- */

export interface MarketMetadata {

    provider: string;

    feedVersion: string;

    latency: number;

    serverTime: Date;

    timezone: string;

    synchronized: boolean;

    quality?: DataQuality;
}
/* -------------------------------------------------------------------------- */
/*                           DIRECTION                                        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                           CURRENCY                                         */
/* -------------------------------------------------------------------------- */

export enum CurrencyCode {

    USD = "USD",

    EUR = "EUR",

    GBP = "GBP",

    JPY = "JPY",

    AUD = "AUD",

    CAD = "CAD",

    CHF = "CHF",

    NZD = "NZD",

    KES = "KES",

    ZAR = "ZAR",

    BTC = "BTC",

    ETH = "ETH",

    USDT = "USDT"
}

/* -------------------------------------------------------------------------- */
/*                     INSTRUMENT SPECIFICATION                               */
/* -------------------------------------------------------------------------- */

export interface InstrumentSpecification {

    instrumentId: string;

    symbol: string;

    exchangeId: string;

    marketType: MarketType;

    contractSize: number;

    minimumLot: number;

    maximumLot: number;

    lotStep: number;

    minimumPriceIncrement: number;

    tickSize: number;

    tickValue: number;

    digits: number;

    leverage: number;

    marginRequirement: number;

    overnightSwapLong: number;

    overnightSwapShort: number;

    tripleSwapDay: number;

    supportsHedging: boolean;

    supportsNetting: boolean;

    expirationDate?: Date;
}


/* -------------------------------------------------------------------------- */
/*                      TRADING PERMISSIONS                                   */
/* -------------------------------------------------------------------------- */

export interface TradingPermission {

    canBuy: boolean;

    canSell: boolean;

    canClose: boolean;

    canModify: boolean;

    canCancel: boolean;

    canShortSell: boolean;

    canTradeWeekend: boolean;

    canUseMargin: boolean;

    canUseLeverage: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          MARGIN INFO                                       */
/* -------------------------------------------------------------------------- */

export interface MarginInformation {

    initialMargin: number;

    maintenanceMargin: number;

    hedgedMargin: number;

    marginCallLevel: number;

    stopOutLevel: number;

    freeMargin: number;

    usedMargin: number;

    availableMargin: number;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT SPECIFICATION                                */
/* -------------------------------------------------------------------------- */

export interface ContractSpecification {

    contractSize: number;

    contractCurrency: CurrencyCode;

    settlementCurrency: CurrencyCode;

    expirationDate?: Date;

    settlementDate?: Date;

    deliverable: boolean;

    physicallySettled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          MARKET CATEGORY                                   */
/* -------------------------------------------------------------------------- */

export interface MarketCategory {

    id: string;

    name: string;

    description?: string;

    icon?: string;

    displayOrder: number;

    enabled: boolean;
}


/* -------------------------------------------------------------------------- */
/*                          INSTRUMENT TAG                                    */
/* -------------------------------------------------------------------------- */

export interface InstrumentTag {

    id: string;

    name: string;

    color?: string;
}
/* -------------------------------------------------------------------------- */
/*                       INSTRUMENT METADATA                                  */
/* -------------------------------------------------------------------------- */

export interface InstrumentMetadata {

    isin?: string;

    cusip?: string;

    sedol?: string;

    ric?: string;

    bloomberg?: string;

    sector?: string;

    industry?: string;

    country?: string;

    description?: string;
}

/* -------------------------------------------------------------------------- */
/*                       TRADING CAPABILITIES                                 */
/* -------------------------------------------------------------------------- */

export interface TradingCapabilities {

    supportsMarketOrders: boolean;

    supportsLimitOrders: boolean;

    supportsStopOrders: boolean;

    supportsTrailingStops: boolean;

    supportsTakeProfit: boolean;

    supportsStopLoss: boolean;

    supportsPartialClose: boolean;

    supportsGuaranteedStop: boolean;

    supportsOCO: boolean;

    supportsBracketOrders: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        MARKET STATISTICS                                   */
/* -------------------------------------------------------------------------- */

export interface MarketStatistics {

    totalTrades: number;

    totalVolume: number;

    averageSpread: number;

    highestPrice: number;

    lowestPrice: number;

    averagePrice: number;

    averageVolume: number;

    volatility: number;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         INSTRUMENT STATE                                   */
/* -------------------------------------------------------------------------- */

export interface InstrumentState {

    instrumentId: string;

    tradable: boolean;

    suspended: boolean;

    halted: boolean;

    maintenance: boolean;

    lastTradingTime?: Date;

    nextTradingSession?: Date;
}

/* -------------------------------------------------------------------------- */
/*                         PRICE PRECISION                                    */
/* -------------------------------------------------------------------------- */

export interface PricePrecision {

    digits: number;

    pipSize: number;

    tickSize: number;

    displayDecimals: number;
}

/* -------------------------------------------------------------------------- */
/*                      MARKET SUBSCRIPTION                                   */
/* -------------------------------------------------------------------------- */

export interface MarketSubscription {

    id: string;

    instrumentId: string;

    subscribedAt: Date;

    active: boolean;

    realtime: boolean;

    lastSequence: number;
}


/* -------------------------------------------------------------------------- */
/*                    MARKET SUBSCRIPTION REGISTRY                            */
/* -------------------------------------------------------------------------- */

export interface MarketSubscriptionRegistry {

    subscriptions: MarketSubscription[];

    totalSubscriptions: number;

    activeSubscriptions: number;
}

/* -------------------------------------------------------------------------- */
/*                          SYMBOL GROUP                                      */
/* -------------------------------------------------------------------------- */

export interface SymbolGroup {

    id: string;

    name: string;

    symbols: string[];

    displayOrder: number;
}

