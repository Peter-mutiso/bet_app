/**
 * ============================================================================
 * CANDLE TYPES
 * ============================================================================
 * Candlestick models for charting and technical analysis.
 *
 * Used by:
 * - TradingView charts
 * - Historical data
 * - Indicators
 * - Strategy engine
 * - AI prediction models
 * - Backtesting
 * ============================================================================
 */

import { Instrument } from "./market";

/* -------------------------------------------------------------------------- */
/*                              ENUMS                                         */
/* -------------------------------------------------------------------------- */

export enum CandleSource {

    LIVE = "LIVE",

    HISTORICAL = "HISTORICAL",

    SIMULATED = "SIMULATED"
}

export enum CandleColor {

    BULLISH = "BULLISH",

    BEARISH = "BEARISH",

    NEUTRAL = "NEUTRAL"
}

export enum CandleStatus {

    FORMING = "FORMING",

    CLOSED = "CLOSED"
}

export enum CandlePriceType {

    BID = "BID",

    ASK = "ASK",

    MID = "MID",

    LAST = "LAST"
}

export enum Timeframe {

    ONE_MINUTE = "1m",

    THREE_MINUTES = "3m",

    FIVE_MINUTES = "5m",

    FIFTEEN_MINUTES = "15m",

    THIRTY_MINUTES = "30m",

    ONE_HOUR = "1h",

    TWO_HOURS = "2h",

    FOUR_HOURS = "4h",

    SIX_HOURS = "6h",

    EIGHT_HOURS = "8h",

    TWELVE_HOURS = "12h",

    ONE_DAY = "1d",

    THREE_DAYS = "3d",

    ONE_WEEK = "1w",

    ONE_MONTH = "1M"
}

/* -------------------------------------------------------------------------- */
/*                              OHLC                                          */
/* -------------------------------------------------------------------------- */

export interface OHLC {

    open: number;

    high: number;

    low: number;

    close: number;
}

/* -------------------------------------------------------------------------- */
/*                              CANDLE                                        */
/* -------------------------------------------------------------------------- */

export interface Candle {

    id: string;

    instrumentId: string;

    timeframe: Timeframe;

    timestamp: Date;

    open: number;

    high: number;

    low: number;

    close: number;

    volume: number;

    quoteVolume?: number;

    trades?: number;

    status: CandleStatus;

    source: CandleSource;
}

/* -------------------------------------------------------------------------- */
/*                        ENHANCED CANDLE                                     */
/* -------------------------------------------------------------------------- */

export interface EnhancedCandle extends Candle {

    bodySize: number;

    upperShadow: number;

    lowerShadow: number;

    totalRange: number;

    averagePrice: number;

    medianPrice: number;

    typicalPrice: number;

    weightedPrice: number;

    color: CandleColor;
}

/* -------------------------------------------------------------------------- */
/*                        CANDLE SERIES                                       */
/* -------------------------------------------------------------------------- */

export interface CandleSeries {

    instrument: Instrument;

    timeframe: Timeframe;

    candles: Candle[];

    loadedFrom: Date;

    loadedTo: Date;

    synchronized: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       CANDLE REQUEST                                       */
/* -------------------------------------------------------------------------- */

export interface CandleRequest {

    instrumentId: string;

    timeframe: Timeframe;

    from: Date;

    to: Date;

    limit?: number;
}

/* -------------------------------------------------------------------------- */
/*                      CANDLE RESPONSE                                       */
/* -------------------------------------------------------------------------- */

export interface CandleResponse {

    success: boolean;

    candles: Candle[];

    timeframe: Timeframe;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      LIVE CANDLE UPDATE                                    */
/* -------------------------------------------------------------------------- */

export interface LiveCandleUpdate {

    candle: Candle;

    completed: boolean;

    serverTime: Date;
}

/* -------------------------------------------------------------------------- */
/*                       CANDLE METADATA                                      */
/* -------------------------------------------------------------------------- */

export interface CandleMetadata {

    totalCandles: number;

    timeframe: Timeframe;

    source: CandleSource;

    priceType: CandlePriceType;

    generatedAt: Date;
}
/* -------------------------------------------------------------------------- */
/*                       CANDLE PATTERNS                                      */
/* -------------------------------------------------------------------------- */

export enum CandlestickPattern {

    DOJI = "DOJI",

    HAMMER = "HAMMER",

    HANGING_MAN = "HANGING_MAN",

    SHOOTING_STAR = "SHOOTING_STAR",

    INVERTED_HAMMER = "INVERTED_HAMMER",

    BULLISH_ENGULFING = "BULLISH_ENGULFING",

    BEARISH_ENGULFING = "BEARISH_ENGULFING",

    MORNING_STAR = "MORNING_STAR",

    EVENING_STAR = "EVENING_STAR",

    THREE_WHITE_SOLDIERS = "THREE_WHITE_SOLDIERS",

    THREE_BLACK_CROWS = "THREE_BLACK_CROWS",

    SPINNING_TOP = "SPINNING_TOP",

    MARUBOZU = "MARUBOZU",

    PIERCING_LINE = "PIERCING_LINE",

    DARK_CLOUD_COVER = "DARK_CLOUD_COVER",

    HARAMI = "HARAMI",

    TWEEZER_TOP = "TWEEZER_TOP",

    TWEEZER_BOTTOM = "TWEEZER_BOTTOM",

    NONE = "NONE"
}

/* -------------------------------------------------------------------------- */
/*                          TREND DIRECTION                                   */
/* -------------------------------------------------------------------------- */

export enum TrendDirection {

    STRONG_UPTREND = "STRONG_UPTREND",

    UPTREND = "UPTREND",

    SIDEWAYS = "SIDEWAYS",

    DOWNTREND = "DOWNTREND",

    STRONG_DOWNTREND = "STRONG_DOWNTREND"
}

/* -------------------------------------------------------------------------- */
/*                            GAP TYPE                                        */
/* -------------------------------------------------------------------------- */

export enum GapType {

    NONE = "NONE",

    GAP_UP = "GAP_UP",

    GAP_DOWN = "GAP_DOWN",

    BREAKAWAY = "BREAKAWAY",

    RUNAWAY = "RUNAWAY",

    EXHAUSTION = "EXHAUSTION"
}

/* -------------------------------------------------------------------------- */
/*                     CANDLE PATTERN RESULT                                  */
/* -------------------------------------------------------------------------- */

export interface CandlePattern {

    pattern: CandlestickPattern;

    confidence: number;

    bullish: boolean;

    bearish: boolean;

    detectedAt: Date;

    description?: string;
}

/* -------------------------------------------------------------------------- */
/*                         GAP ANALYSIS                                       */
/* -------------------------------------------------------------------------- */

export interface GapAnalysis {

    type: GapType;

    size: number;

    percentage: number;

    filled: boolean;

    fillPercentage: number;
}

/* -------------------------------------------------------------------------- */
/*                        TREND ANALYSIS                                      */
/* -------------------------------------------------------------------------- */

export interface TrendAnalysis {

    direction: TrendDirection;

    strength: number;

    duration: number;

    slope: number;

    confidence: number;
}

/* -------------------------------------------------------------------------- */
/*                         SWING POINT                                        */
/* -------------------------------------------------------------------------- */

export interface SwingPoint {

    timestamp: Date;

    price: number;

    index: number;

    isHigh: boolean;

    isLow: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       CANDLE STATISTICS                                    */
/* -------------------------------------------------------------------------- */

export interface CandleStatistics {

    averageBodySize: number;

    averageRange: number;

    averageVolume: number;

    bullishCandles: number;

    bearishCandles: number;

    neutralCandles: number;

    highestHigh: number;

    lowestLow: number;
}

/* -------------------------------------------------------------------------- */
/*                        VOLATILITY                                          */
/* -------------------------------------------------------------------------- */

export interface CandleVolatility {

    standardDeviation: number;

    variance: number;

    averageTrueRange: number;

    historicalVolatility: number;
}

/* -------------------------------------------------------------------------- */
/*                    MULTI TIMEFRAME CANDLE                                 */
/* -------------------------------------------------------------------------- */

export interface MultiTimeframeCandle {

    instrumentId: string;

    candles: Record<Timeframe, Candle>;
}

/* -------------------------------------------------------------------------- */
/*                      AGGREGATED CANDLE                                     */
/* -------------------------------------------------------------------------- */

export interface AggregatedCandle {

    timeframe: Timeframe;

    candles: Candle[];

    aggregated: Candle;
}

/* -------------------------------------------------------------------------- */
/*                     CANDLE COMPARISON                                      */
/* -------------------------------------------------------------------------- */

export interface CandleComparison {

    current: Candle;

    previous: Candle;

    priceChange: number;

    percentageChange: number;

    volumeChange: number;
}

/* -------------------------------------------------------------------------- */
/*                      PRICE CHANNEL                                         */
/* -------------------------------------------------------------------------- */

export interface PriceChannel {

    upper: number;

    middle: number;

    lower: number;

    width: number;
}

/* -------------------------------------------------------------------------- */
/*                       SUPPORT / RESISTANCE                                 */
/* -------------------------------------------------------------------------- */

export interface SupportResistanceLevel {

    price: number;

    touches: number;

    strength: number;

    resistance: boolean;

    support: boolean;
}
/* -------------------------------------------------------------------------- */
/*                         CANDLE ANALYSIS                                    */
/* -------------------------------------------------------------------------- */

export interface CandleAnalysis {

    candle: EnhancedCandle;

    pattern?: CandlePattern;

    trend: TrendAnalysis;

    volatility: CandleVolatility;

    supportLevels: SupportResistanceLevel[];

    resistanceLevels: SupportResistanceLevel[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       CANDLE SIGNAL                                        */
/* -------------------------------------------------------------------------- */

export enum CandleSignalType {

    STRONG_BUY = "STRONG_BUY",

    BUY = "BUY",

    NEUTRAL = "NEUTRAL",

    SELL = "SELL",

    STRONG_SELL = "STRONG_SELL"
}

export interface CandleSignal {

    id: string;

    instrumentId: string;

    timeframe: Timeframe;

    signal: CandleSignalType;

    confidence: number;

    reason: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      PRICE MOVEMENT                                        */
/* -------------------------------------------------------------------------- */

export interface PriceMovement {

    absoluteChange: number;

    percentageChange: number;

    highestMove: number;

    lowestMove: number;

    averageMove: number;
}

/* -------------------------------------------------------------------------- */
/*                     VOLUME ANALYSIS                                        */
/* -------------------------------------------------------------------------- */

export interface VolumeAnalysis {

    currentVolume: number;

    averageVolume: number;

    highestVolume: number;

    lowestVolume: number;

    relativeVolume: number;

    volumeIncreasing: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       MOMENTUM ANALYSIS                                    */
/* -------------------------------------------------------------------------- */

export interface MomentumAnalysis {

    momentum: number;

    acceleration: number;

    velocity: number;

    strength: number;

    direction: TrendDirection;
}

/* -------------------------------------------------------------------------- */
/*                       BREAKOUT ANALYSIS                                    */
/* -------------------------------------------------------------------------- */

export interface BreakoutAnalysis {

    breakout: boolean;

    direction: TrendDirection;

    breakoutPrice: number;

    confidence: number;

    confirmed: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      REVERSAL ANALYSIS                                     */
/* -------------------------------------------------------------------------- */

export interface ReversalAnalysis {

    reversalDetected: boolean;

    previousTrend: TrendDirection;

    newTrend: TrendDirection;

    confidence: number;
}

/* -------------------------------------------------------------------------- */
/*                     CONSOLIDATION ANALYSIS                                 */
/* -------------------------------------------------------------------------- */

export interface ConsolidationAnalysis {

    consolidating: boolean;

    duration: number;

    upperBoundary: number;

    lowerBoundary: number;

    breakoutExpected: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        PRICE ZONES                                         */
/* -------------------------------------------------------------------------- */

export interface PriceZone {

    name: string;

    lowerPrice: number;

    upperPrice: number;

    importance: number;
}

/* -------------------------------------------------------------------------- */
/*                      MARKET STRUCTURE                                      */
/* -------------------------------------------------------------------------- */

export interface MarketStructure {

    higherHighs: number;

    higherLows: number;

    lowerHighs: number;

    lowerLows: number;

    trend: TrendDirection;
}

/* -------------------------------------------------------------------------- */
/*                     FRACTAL POINT                                          */
/* -------------------------------------------------------------------------- */

export interface FractalPoint {

    timestamp: Date;

    price: number;

    bullish: boolean;

    bearish: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     FAIR VALUE GAP                                         */
/* -------------------------------------------------------------------------- */

export interface FairValueGap {

    detected: boolean;

    upperPrice: number;

    lowerPrice: number;

    filled: boolean;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     LIQUIDITY ZONE                                         */
/* -------------------------------------------------------------------------- */

export interface LiquidityZone {

    price: number;

    volume: number;

    strength: number;

    tested: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      CANDLE VALIDATION                                     */
/* -------------------------------------------------------------------------- */

export interface CandleValidation {

    valid: boolean;

    errors: string[];

    warnings: string[];

    repaired: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     HISTORICAL CANDLE SET                                  */
/* -------------------------------------------------------------------------- */

export interface HistoricalCandles {

    instrumentId: string;

    timeframe: Timeframe;

    candles: Candle[];

    from: Date;

    to: Date;

    synchronized: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       CANDLE CACHE                                         */
/* -------------------------------------------------------------------------- */

export interface CandleCache {

    instrumentId: string;

    timeframe: Timeframe;

    candles: Candle[];

    cachedAt: Date;

    expiresAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     BACKTEST DATASET                                       */
/* -------------------------------------------------------------------------- */

export interface BacktestCandles {

    instrumentId: string;

    timeframe: Timeframe;

    candles: Candle[];

    totalCandles: number;

    generatedAt: Date;
}
/* -------------------------------------------------------------------------- */
/*                         DEFAULT CONFIGURATION                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CANDLE_SOURCE = CandleSource.HISTORICAL;

export const DEFAULT_CANDLE_STATUS = CandleStatus.CLOSED;

export const DEFAULT_CANDLE_PRICE_TYPE = CandlePriceType.MID;

export const DEFAULT_CANDLE_SIGNAL = CandleSignalType.NEUTRAL;

export const DEFAULT_TREND_DIRECTION = TrendDirection.SIDEWAYS;

/* -------------------------------------------------------------------------- */
/*                          DEFAULT OHLC                                      */
/* -------------------------------------------------------------------------- */

export const DEFAULT_OHLC: OHLC = {

    open: 0,

    high: 0,

    low: 0,

    close: 0
};

/* -------------------------------------------------------------------------- */
/*                       DEFAULT CANDLE METADATA                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CANDLE_METADATA: CandleMetadata = {

    totalCandles: 0,

    timeframe: Timeframe.ONE_MINUTE,

    source: DEFAULT_CANDLE_SOURCE,

    priceType: DEFAULT_CANDLE_PRICE_TYPE,

    generatedAt: new Date()
};

/* -------------------------------------------------------------------------- */
/*                     DEFAULT VOLATILITY                                     */
/* -------------------------------------------------------------------------- */

export const DEFAULT_VOLATILITY: CandleVolatility = {

    standardDeviation: 0,

    variance: 0,

    averageTrueRange: 0,

    historicalVolatility: 0
};

/* -------------------------------------------------------------------------- */
/*                       DEFAULT TREND                                        */
/* -------------------------------------------------------------------------- */

export const DEFAULT_TREND_ANALYSIS: TrendAnalysis = {

    direction: DEFAULT_TREND_DIRECTION,

    strength: 0,

    duration: 0,

    slope: 0,

    confidence: 0
};

/* -------------------------------------------------------------------------- */
/*                     COLLECTION TYPES                                       */
/* -------------------------------------------------------------------------- */

export interface CandleCollection {

    items: Candle[];

    total: number;
}

export interface EnhancedCandleCollection {

    items: EnhancedCandle[];

    total: number;
}

export interface CandlePatternCollection {

    items: CandlePattern[];

    total: number;
}

export interface CandleSignalCollection {

    items: CandleSignal[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                         LOOKUP MAPS                                        */
/* -------------------------------------------------------------------------- */

export type CandleMap = Record<string, Candle>;

export type EnhancedCandleMap = Record<string, EnhancedCandle>;

export type CandlePatternMap = Record<string, CandlePattern>;

export type CandleSignalMap = Record<string, CandleSignal>;

/* -------------------------------------------------------------------------- */
/*                         CALLBACK TYPES                                     */
/* -------------------------------------------------------------------------- */

export type CandleUpdateHandler = (

    candle: Candle

) => void;

export type CandleCloseHandler = (

    candle: Candle

) => void;

export type CandlePatternHandler = (

    pattern: CandlePattern

) => void;

export type CandleSignalHandler = (

    signal: CandleSignal

) => void;

export type TrendAnalysisHandler = (

    analysis: TrendAnalysis

) => void;

/* -------------------------------------------------------------------------- */
/*                     STREAMING CONFIGURATION                                */
/* -------------------------------------------------------------------------- */

export interface CandleStreamingConfiguration {

    enabled: boolean;

    timeframe: Timeframe;

    bufferSize: number;

    reconnect: boolean;

    autoReconnectInterval: number;
}

/* -------------------------------------------------------------------------- */
/*                      CACHE CONFIGURATION                                   */
/* -------------------------------------------------------------------------- */

export interface CandleCacheConfiguration {

    enabled: boolean;

    maxCandles: number;

    expirationMinutes: number;

    persistToDisk: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         LOADER CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

export interface CandleLoaderConfiguration {

    preloadHistory: boolean;

    initialLoad: number;

    incrementalLoad: number;

    retryAttempts: number;

    requestTimeout: number;
}

/* -------------------------------------------------------------------------- */
/*                      VALIDATION RESULT                                     */
/* -------------------------------------------------------------------------- */

export interface CandleValidationResult {

    success: boolean;

    validation: CandleValidation;

    processedCandles: number;

    invalidCandles: number;
}

/* -------------------------------------------------------------------------- */
/*                      READONLY TYPES                                        */
/* -------------------------------------------------------------------------- */

export type ReadonlyOHLC = Readonly<OHLC>;

export type ReadonlyCandle = Readonly<Candle>;

export type ReadonlyEnhancedCandle = Readonly<EnhancedCandle>;

export type ReadonlyTrendAnalysis = Readonly<TrendAnalysis>;

export type ReadonlyPattern = Readonly<CandlePattern>;

export type ReadonlySignal = Readonly<CandleSignal>;

export type ReadonlyStatistics = Readonly<CandleStatistics>;

/* -------------------------------------------------------------------------- */
/*                        UTILITY TYPES                                       */
/* -------------------------------------------------------------------------- */

export interface CandleIdentifier {

    id: string;

    instrumentId: string;

    timeframe: Timeframe;

    timestamp: Date;
}

export interface CandleRange {

    start: Date;

    end: Date;

    count: number;
}

export interface CandleVersion {

    version: string;

    provider: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           END OF FILE                                      */
/* -------------------------------------------------------------------------- */