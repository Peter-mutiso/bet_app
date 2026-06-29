/**
 * ============================================================================
 * MARKET TYPES
 * ============================================================================
 * Core market domain models.
 *
 * This file defines:
 * - Market types
 * - Instruments
 * - Exchanges
 * - Quotes
 * - Price models
 * - Trading sessions
 * - Market metadata
 *
 * Related files:
 * - candle.ts
 * - chart.ts
 * - indicator.ts
 * - orderbook.ts
 * - websocket.ts
 * ============================================================================
 */

import {
    CurrencyCode,
    Status,
    Timeframe,
    Direction
} from "../common";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum MarketType {

    FOREX = "FOREX",

    CRYPTO = "CRYPTO",

    STOCK = "STOCK",

    INDEX = "INDEX",

    COMMODITY = "COMMODITY",

    ETF = "ETF",

    SYNTHETIC = "SYNTHETIC",

    FUTURES = "FUTURES",

    OPTIONS = "OPTIONS"
}

export enum InstrumentType {

    CURRENCY_PAIR = "CURRENCY_PAIR",

    STOCK = "STOCK",

    INDEX = "INDEX",

    CRYPTO = "CRYPTO",

    COMMODITY = "COMMODITY",

    SYNTHETIC = "SYNTHETIC"
}

export enum MarketStatus {

    PRE_OPEN = "PRE_OPEN",

    OPEN = "OPEN",

    HALTED = "HALTED",

    CLOSED = "CLOSED",

    POST_MARKET = "POST_MARKET"
}

export enum MarketSessionType {

    ASIAN = "ASIAN",

    EUROPEAN = "EUROPEAN",

    AMERICAN = "AMERICAN",

    GLOBAL = "GLOBAL"
}

export enum TickDirection {

    UP = "UP",

    DOWN = "DOWN",

    UNCHANGED = "UNCHANGED"
}

export enum QuoteType {

    REALTIME = "REALTIME",

    DELAYED = "DELAYED",

    END_OF_DAY = "END_OF_DAY"
}

export enum LiquidityLevel {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    VERY_HIGH = "VERY_HIGH"
}

/* -------------------------------------------------------------------------- */
/*                             MARKET EXCHANGE                                */
/* -------------------------------------------------------------------------- */

export interface Exchange {

    id: string;

    code: string;

    name: string;

    country: string;

    timezone: string;

    currency: CurrencyCode;

    website?: string;

    status: Status;
}

/* -------------------------------------------------------------------------- */
/*                             TRADING HOURS                                  */
/* -------------------------------------------------------------------------- */

export interface TradingHours {

    opensAt: string;

    closesAt: string;

    timezone: string;

    openDays: number[];

    supportsWeekendTrading: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              INSTRUMENT                                    */
/* -------------------------------------------------------------------------- */

export interface Instrument {

    id: string;

    symbol: string;

    displaySymbol: string;

    name: string;

    shortName?: string;

    description?: string;

    marketType: MarketType;

    instrumentType: InstrumentType;

    baseCurrency?: CurrencyCode;

    quoteCurrency?: CurrencyCode;

    exchange?: Exchange;

    precision: number;

    pipSize: number;

    contractSize: number;

    minimumTradeSize: number;

    maximumTradeSize: number;

    tradeStep: number;

    leverage?: number;

    status: Status;

    tradable: boolean;

    favorite?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 PRICE                                      */
/* -------------------------------------------------------------------------- */

export interface MarketPrice {

    bid: number;

    ask: number;

    mid: number;

    spread: number;

    change: number;

    changePercent: number;

    high: number;

    low: number;

    open: number;

    close: number;

    volume: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                                 QUOTE                                      */
/* -------------------------------------------------------------------------- */

export interface Quote {

    instrumentId: string;

    symbol: string;

    type: QuoteType;

    price: MarketPrice;

    direction: TickDirection;

    sequence: number;

    receivedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                             MARKET SESSION                                 */
/* -------------------------------------------------------------------------- */

export interface MarketSession {

    id: string;

    type: MarketSessionType;

    name: string;

    startsAt: Date;

    endsAt: Date;

    active: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               MARKET                                       */
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

    createdAt: Date;

    updatedAt: Date;
}
/**
 * ============================================================================
 * MARKET TYPES
 * ============================================================================
 * Core market domain models.
 *
 * This file defines:
 * - Market types
 * - Instruments
 * - Exchanges
 * - Quotes
 * - Price models
 * - Trading sessions
 * - Market metadata
 *
 * Related files:
 * - candle.ts
 * - chart.ts
 * - indicator.ts
 * - orderbook.ts
 * - websocket.ts
 * ============================================================================
 */

import {
    CurrencyCode,
    Status,
    Timeframe,
    Direction
} from "../common";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum MarketType {

    FOREX = "FOREX",

    CRYPTO = "CRYPTO",

    STOCK = "STOCK",

    INDEX = "INDEX",

    COMMODITY = "COMMODITY",

    ETF = "ETF",

    SYNTHETIC = "SYNTHETIC",

    FUTURES = "FUTURES",

    OPTIONS = "OPTIONS"
}

export enum InstrumentType {

    CURRENCY_PAIR = "CURRENCY_PAIR",

    STOCK = "STOCK",

    INDEX = "INDEX",

    CRYPTO = "CRYPTO",

    COMMODITY = "COMMODITY",

    SYNTHETIC = "SYNTHETIC"
}

export enum MarketStatus {

    PRE_OPEN = "PRE_OPEN",

    OPEN = "OPEN",

    HALTED = "HALTED",

    CLOSED = "CLOSED",

    POST_MARKET = "POST_MARKET"
}

export enum MarketSessionType {

    ASIAN = "ASIAN",

    EUROPEAN = "EUROPEAN",

    AMERICAN = "AMERICAN",

    GLOBAL = "GLOBAL"
}

export enum TickDirection {

    UP = "UP",

    DOWN = "DOWN",

    UNCHANGED = "UNCHANGED"
}

export enum QuoteType {

    REALTIME = "REALTIME",

    DELAYED = "DELAYED",

    END_OF_DAY = "END_OF_DAY"
}

export enum LiquidityLevel {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    VERY_HIGH = "VERY_HIGH"
}

/* -------------------------------------------------------------------------- */
/*                             MARKET EXCHANGE                                */
/* -------------------------------------------------------------------------- */

export interface Exchange {

    id: string;

    code: string;

    name: string;

    country: string;

    timezone: string;

    currency: CurrencyCode;

    website?: string;

    status: Status;
}

/* -------------------------------------------------------------------------- */
/*                             TRADING HOURS                                  */
/* -------------------------------------------------------------------------- */

export interface TradingHours {

    opensAt: string;

    closesAt: string;

    timezone: string;

    openDays: number[];

    supportsWeekendTrading: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              INSTRUMENT                                    */
/* -------------------------------------------------------------------------- */

export interface Instrument {

    id: string;

    symbol: string;

    displaySymbol: string;

    name: string;

    shortName?: string;

    description?: string;

    marketType: MarketType;

    instrumentType: InstrumentType;

    baseCurrency?: CurrencyCode;

    quoteCurrency?: CurrencyCode;

    exchange?: Exchange;

    precision: number;

    pipSize: number;

    contractSize: number;

    minimumTradeSize: number;

    maximumTradeSize: number;

    tradeStep: number;

    leverage?: number;

    status: Status;

    tradable: boolean;

    favorite?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 PRICE                                      */
/* -------------------------------------------------------------------------- */

export interface MarketPrice {

    bid: number;

    ask: number;

    mid: number;

    spread: number;

    change: number;

    changePercent: number;

    high: number;

    low: number;

    open: number;

    close: number;

    volume: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                                 QUOTE                                      */
/* -------------------------------------------------------------------------- */

export interface Quote {

    instrumentId: string;

    symbol: string;

    type: QuoteType;

    price: MarketPrice;

    direction: TickDirection;

    sequence: number;

    receivedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                             MARKET SESSION                                 */
/* -------------------------------------------------------------------------- */

export interface MarketSession {

    id: string;

    type: MarketSessionType;

    name: string;

    startsAt: Date;

    endsAt: Date;

    active: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               MARKET                                       */
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

    createdAt: Date;

    updatedAt: Date;
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
/*                           PRICE HISTORY                                    */
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
/*                           MARKET SNAPSHOT                                  */
/* -------------------------------------------------------------------------- */

export interface MarketSnapshot {

    instrumentId: string;

    symbol: string;

    currentPrice: number;

    bid: number;

    ask: number;

    high: number;

    low: number;

    open: number;

    previousClose: number;

    volume: number;

    change: number;

    changePercent: number;

    spread: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                           MARKET SUMMARY                                   */
/* -------------------------------------------------------------------------- */

export interface MarketSummary {

    totalMarkets: number;

    openMarkets: number;

    closedMarkets: number;

    activeTraders: number;

    totalVolume: number;

    totalTrades: number;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           TOP MOVER                                        */
/* -------------------------------------------------------------------------- */

export interface TopMover {

    instrumentId: string;

    symbol: string;

    name: string;

    price: number;

    change: number;

    changePercent: number;

    volume: number;

    direction: Direction;
}

/* -------------------------------------------------------------------------- */
/*                        MARKET LEADERBOARD                                  */
/* -------------------------------------------------------------------------- */

export interface MarketLeaderboard {

    gainers: TopMover[];

    losers: TopMover[];

    mostActive: TopMover[];

    highestVolume: TopMover[];
}

/* -------------------------------------------------------------------------- */
/*                           MARKET NEWS                                      */
/* -------------------------------------------------------------------------- */

export interface MarketNews {

    id: string;

    title: string;

    summary: string;

    source: string;

    author?: string;

    url?: string;

    publishedAt: Date;

    affectedSymbols: string[];

    importance: "LOW" | "MEDIUM" | "HIGH";
}

/* -------------------------------------------------------------------------- */
/*                        ECONOMIC CALENDAR                                   */
/* -------------------------------------------------------------------------- */

export interface EconomicEvent {

    id: string;

    title: string;

    country: string;

    currency: CurrencyCode;

    impact: "LOW" | "MEDIUM" | "HIGH";

    forecast?: number;

    previous?: number;

    actual?: number;

    scheduledAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         TRADING CALENDAR                                   */
/* -------------------------------------------------------------------------- */

export interface TradingCalendar {

    exchangeId: string;

    holidays: Date[];

    specialSessions: MarketSession[];

    updatedAt: Date;
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
}

/* -------------------------------------------------------------------------- */
/*                            MARKET SEARCH                                   */
/* -------------------------------------------------------------------------- */

export interface MarketSearch {

    keyword: string;

    marketType?: MarketType;

    exchangeId?: string;

    tradableOnly?: boolean;
}

export interface MarketSearchResult {

    total: number;

    markets: Market[];
}

/* -------------------------------------------------------------------------- */
/*                            MARKET FILTER                                   */
/* -------------------------------------------------------------------------- */

export interface MarketFilter {

    marketTypes?: MarketType[];

    exchanges?: string[];

    sessions?: MarketSessionType[];

    tradableOnly?: boolean;

    favoritesOnly?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         MARKET RESPONSE                                    */
/* -------------------------------------------------------------------------- */

export interface MarketResponse {

    success: boolean;

    market: Market;

    metadata: MarketMetadata;
}

export interface MarketsResponse {

    success: boolean;

    markets: Market[];

    metadata: MarketMetadata;
}

/* -------------------------------------------------------------------------- */
/*                         MARKET FAVORITE                                    */
/* -------------------------------------------------------------------------- */

export interface FavoriteMarket {

    userId: string;

    instrumentId: string;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         MARKET WATCH                                       */
/* -------------------------------------------------------------------------- */

export interface MarketWatch {

    instrumentId: string;

    lastViewed: Date;

    pinned: boolean;

    alertsEnabled: boolean;
}
/* -------------------------------------------------------------------------- */
/*                         DEFAULT CONFIGURATION                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_TYPE = MarketType.FOREX;

export const DEFAULT_MARKET_STATUS = MarketStatus.CLOSED;

export const DEFAULT_QUOTE_TYPE = QuoteType.REALTIME;

export const DEFAULT_STREAM_STATUS = StreamStatus.DISCONNECTED;

export const DEFAULT_SESSION = MarketSessionType.GLOBAL;

export const DEFAULT_LIQUIDITY = LiquidityLevel.MEDIUM;

/* -------------------------------------------------------------------------- */
/*                         DEFAULT MARKET PRICE                               */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_PRICE: MarketPrice = {

    bid: 0,

    ask: 0,

    mid: 0,

    spread: 0,

    change: 0,

    changePercent: 0,

    high: 0,

    low: 0,

    open: 0,

    close: 0,

    volume: 0,

    timestamp: new Date()
};

/* -------------------------------------------------------------------------- */
/*                          DEFAULT TRADING HOURS                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_TRADING_HOURS: TradingHours = {

    opensAt: "00:00",

    closesAt: "23:59",

    timezone: "UTC",

    openDays: [1, 2, 3, 4, 5],

    supportsWeekendTrading: false
};

/* -------------------------------------------------------------------------- */
/*                        DEFAULT MARKET METADATA                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_METADATA: MarketMetadata = {

    provider: "Internal",

    feedVersion: "1.0.0",

    latency: 0,

    serverTime: new Date(),

    timezone: "UTC",

    synchronized: true
};

/* -------------------------------------------------------------------------- */
/*                        DEFAULT DATA QUALITY                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_DATA_QUALITY: DataQuality = {

    completeness: 100,

    accuracy: 100,

    freshness: 100,

    latency: 0,

    score: 100
};

/* -------------------------------------------------------------------------- */
/*                           DEFAULT HEARTBEAT                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_HEARTBEAT: Heartbeat = {

    sequence: 0,

    timestamp: new Date(),

    latency: 0
};

/* -------------------------------------------------------------------------- */
/*                         DEFAULT LIVE STATE                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_LIVE_MARKET_STATE: LiveMarketState = {

    connected: false,

    streaming: false,

    subscriptions: 0,

    activeMarkets: 0,

    lastUpdate: new Date(),

    heartbeat: DEFAULT_HEARTBEAT
};

/* -------------------------------------------------------------------------- */
/*                         DEFAULT MARKET SUMMARY                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_SUMMARY: MarketSummary = {

    totalMarkets: 0,

    openMarkets: 0,

    closedMarkets: 0,

    activeTraders: 0,

    totalVolume: 0,

    totalTrades: 0,

    updatedAt: new Date()
};

/* -------------------------------------------------------------------------- */
/*                         TYPE ALIASES                                       */
/* -------------------------------------------------------------------------- */

export type Symbol = Instrument;

export type Asset = Instrument;

export type TradingInstrument = Instrument;

export type ExchangeMarket = Market;

export type MarketFeed = MarketStream;

export type MarketTicker = MarketTick;

export type LiveQuote = Quote;

export type PriceSnapshot = MarketSnapshot;

export type TradingSession = MarketSession;

export type TradingExchange = Exchange;

/* -------------------------------------------------------------------------- */
/*                        COLLECTION TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface MarketCollection {

    items: Market[];

    total: number;
}

export interface InstrumentCollection {

    items: Instrument[];

    total: number;
}

export interface ExchangeCollection {

    items: Exchange[];

    total: number;
}

export interface QuoteCollection {

    items: Quote[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                          LOOKUP MAPS                                       */
/* -------------------------------------------------------------------------- */

export type MarketMap = Record<string, Market>;

export type InstrumentMap = Record<string, Instrument>;

export type ExchangeMap = Record<string, Exchange>;

export type QuoteMap = Record<string, Quote>;

export type TickMap = Record<string, MarketTick>;

/* -------------------------------------------------------------------------- */
/*                           CALLBACK TYPES                                   */
/* -------------------------------------------------------------------------- */

export type MarketUpdateHandler = (

    market: Market

) => void;

export type TickHandler = (

    tick: MarketTick

) => void;

export type QuoteHandler = (

    quote: Quote

) => void;

export type MarketEventHandler = (

    event: MarketEvent

) => void;

export type ConnectionStateHandler = (

    state: LiveMarketState

) => void;

/* -------------------------------------------------------------------------- */
/*                           READONLY TYPES                                   */
/* -------------------------------------------------------------------------- */

export type ReadonlyMarket = Readonly<Market>;

export type ReadonlyInstrument = Readonly<Instrument>;

export type ReadonlyQuote = Readonly<Quote>;

export type ReadonlyTick = Readonly<MarketTick>;

export type ReadonlyExchange = Readonly<Exchange>;

export type ReadonlyMarketPrice = Readonly<MarketPrice>;

export type ReadonlySnapshot = Readonly<MarketSnapshot>;

export type ReadonlyMarketEvent = Readonly<MarketEvent>;

/* -------------------------------------------------------------------------- */
/*                         UTILITY TYPES                                      */
/* -------------------------------------------------------------------------- */

export interface MarketIdentifier {

    id: string;

    symbol: string;
}

export interface SymbolLookup {

    symbol: string;

    exchange?: string;
}

export interface InstrumentLookup {

    instrumentId: string;

    symbol: string;
}

export interface MarketVersion {

    version: string;

    build: string;

    releasedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           END OF FILE                                      */
/* -------------------------------------------------------------------------- */