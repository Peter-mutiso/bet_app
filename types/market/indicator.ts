/**
 * ============================================================================
 * INDICATOR TYPES
 * ============================================================================
 * Technical Analysis Indicator Models
 *
 * Used by:
 * - Trading Charts
 * - Strategy Engine
 * - AI Prediction
 * - Signal Generator
 * - Backtesting
 * - Trading Bots
 * ============================================================================
 */

import { Candle, Timeframe } from "./candle";

/* -------------------------------------------------------------------------- */
/*                              ENUMS                                         */
/* -------------------------------------------------------------------------- */

export enum IndicatorCategory {

    TREND = "TREND",

    MOMENTUM = "MOMENTUM",

    VOLUME = "VOLUME",

    VOLATILITY = "VOLATILITY",

    OSCILLATOR = "OSCILLATOR",

    MARKET_STRENGTH = "MARKET_STRENGTH",

    PRICE_ACTION = "PRICE_ACTION",

    CUSTOM = "CUSTOM"
}

export enum IndicatorType {

    SMA = "SMA",

    EMA = "EMA",

    WMA = "WMA",

    VWMA = "VWMA",

    RSI = "RSI",

    MACD = "MACD",

    STOCHASTIC = "STOCHASTIC",

    CCI = "CCI",

    ROC = "ROC",

    ATR = "ATR",

    ADX = "ADX",

    DMI = "DMI",

    BOLLINGER_BANDS = "BOLLINGER_BANDS",

    KELTNER_CHANNEL = "KELTNER_CHANNEL",

    DONCHIAN_CHANNEL = "DONCHIAN_CHANNEL",

    VWAP = "VWAP",

    OBV = "OBV",

    MFI = "MFI",

    ICHIMOKU = "ICHIMOKU",

    PARABOLIC_SAR = "PARABOLIC_SAR",

    AROON = "AROON",

    WILLIAMS_R = "WILLIAMS_R",

    ULTIMATE_OSCILLATOR = "ULTIMATE_OSCILLATOR",

    CUSTOM = "CUSTOM"
}

export enum IndicatorSignal {

    STRONG_BUY = "STRONG_BUY",

    BUY = "BUY",

    NEUTRAL = "NEUTRAL",

    SELL = "SELL",

    STRONG_SELL = "STRONG_SELL"
}

export enum IndicatorStatus {

    ACTIVE = "ACTIVE",

    DISABLED = "DISABLED",

    CALCULATING = "CALCULATING",

    ERROR = "ERROR"
}

/* -------------------------------------------------------------------------- */
/*                       INDICATOR PARAMETER                                  */
/* -------------------------------------------------------------------------- */

export interface IndicatorParameter {

    key: string;

    label: string;

    value: unknown;

    defaultValue: unknown;

    minimum?: number;

    maximum?: number;

    required: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        INDICATOR OUTPUT                                    */
/* -------------------------------------------------------------------------- */

export interface IndicatorOutput {

    timestamp: Date;

    value: number;

    signal?: IndicatorSignal;
}

/* -------------------------------------------------------------------------- */
/*                        INDICATOR RESULT                                    */
/* -------------------------------------------------------------------------- */

export interface IndicatorResult {

    values: unknown[];

    calculatedAt: Date;

    executionTime: number;
}

/* -------------------------------------------------------------------------- */
/*                         INDICATOR                                          */
/* -------------------------------------------------------------------------- */

export interface TechnicalIndicator {

    id: string;

    name: string;

    shortName: string;

    type: IndicatorType;

    category: IndicatorCategory;

    timeframe: Timeframe;

    enabled: boolean;

    visible: boolean;

    status: IndicatorStatus;

    parameters: IndicatorParameter[];

    result?: IndicatorResult;
}

/* -------------------------------------------------------------------------- */
/*                         INDICATOR REQUEST                                  */
/* -------------------------------------------------------------------------- */

export interface IndicatorRequest {

    indicator: IndicatorType;

    candles: Candle[];

    timeframe: Timeframe;

    parameters: IndicatorParameter[];
}

/* -------------------------------------------------------------------------- */
/*                        INDICATOR RESPONSE                                  */
/* -------------------------------------------------------------------------- */

export interface IndicatorResponse {

    success: boolean;

    indicator: TechnicalIndicator;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         INDICATOR COLLECTION                               */
/* -------------------------------------------------------------------------- */

export interface IndicatorCollection {

    indicators: TechnicalIndicator[];

    total: number;
}
/* -------------------------------------------------------------------------- */
/*                     MOVING AVERAGES                                        */
/* -------------------------------------------------------------------------- */

export interface MovingAverageOutput extends IndicatorOutput {

    period: number;
}

export interface SMAResult extends IndicatorResult {

    values: MovingAverageOutput[];
}

export interface EMAResult extends IndicatorResult {

    values: MovingAverageOutput[];
}

export interface WMAResult extends IndicatorResult {

    values: MovingAverageOutput[];
}

export interface VWMAResult extends IndicatorResult {

    values: MovingAverageOutput[];
}

/* -------------------------------------------------------------------------- */
/*                         RSI                                                */
/* -------------------------------------------------------------------------- */

export interface RSIOutput extends IndicatorOutput {

    overbought: boolean;

    oversold: boolean;
}

export interface RSIResult extends IndicatorResult {

    values: RSIOutput[];
}

/* -------------------------------------------------------------------------- */
/*                          MACD                                              */
/* -------------------------------------------------------------------------- */

export interface MACDOutput extends IndicatorOutput {

    macd: number;

    signalLine: number;

    histogram: number;

    crossover: boolean;
}

export interface MACDResult extends IndicatorResult {

    values: MACDOutput[];
}

/* -------------------------------------------------------------------------- */
/*                    BOLLINGER BANDS                                         */
/* -------------------------------------------------------------------------- */

export interface BollingerBandOutput {

    timestamp: Date;

    upper: number;

    middle: number;

    lower: number;

    bandwidth: number;

    squeeze: boolean;
}

export interface BollingerBandsResult extends IndicatorResult {

    values: BollingerBandOutput[];
}

/* -------------------------------------------------------------------------- */
/*                        STOCHASTIC                                          */
/* -------------------------------------------------------------------------- */

export interface StochasticOutput {

    timestamp: Date;

    k: number;

    d: number;

    overbought: boolean;

    oversold: boolean;
}

export interface StochasticResult extends IndicatorResult {

    values: StochasticOutput[];
}

/* -------------------------------------------------------------------------- */
/*                             ATR                                            */
/* -------------------------------------------------------------------------- */

export interface ATROutput extends IndicatorOutput {

    trueRange: number;
}

export interface ATRResult extends IndicatorResult {

    values: ATROutput[];
}

/* -------------------------------------------------------------------------- */
/*                            ADX                                             */
/* -------------------------------------------------------------------------- */

export interface ADXOutput {

    timestamp: Date;

    adx: number;

    plusDI: number;

    minusDI: number;

    trendStrength: number;
}

export interface ADXResult extends IndicatorResult {

    values: ADXOutput[];
}

/* -------------------------------------------------------------------------- */
/*                           CCI                                              */
/* -------------------------------------------------------------------------- */

export interface CCIOutput extends IndicatorOutput {

    extremeBullish: boolean;

    extremeBearish: boolean;
}

export interface CCIResult extends IndicatorResult {

    values: CCIOutput[];
}

/* -------------------------------------------------------------------------- */
/*                         RATE OF CHANGE                                     */
/* -------------------------------------------------------------------------- */

export interface ROCOutput extends IndicatorOutput {

    momentum: number;
}

export interface ROCResult extends IndicatorResult {

    values: ROCOutput[];
}

/* -------------------------------------------------------------------------- */
/*                       VOLUME INDICATORS                                    */
/* -------------------------------------------------------------------------- */

export interface OBVOutput extends IndicatorOutput {

    cumulativeVolume: number;
}

export interface OBVResult extends IndicatorResult {

    values: OBVOutput[];
}

export interface VWAPOutput extends IndicatorOutput {

    cumulativePrice: number;

    cumulativeVolume: number;
}

export interface VWAPResult extends IndicatorResult {

    values: VWAPOutput[];
}

export interface MFIOutput extends IndicatorOutput {

    moneyFlow: number;

    positiveFlow: number;

    negativeFlow: number;
}

export interface MFIResult extends IndicatorResult {

    values: MFIOutput[];
}


/* -------------------------------------------------------------------------- */
/*                          ICHIMOKU CLOUD                                    */
/* -------------------------------------------------------------------------- */

export interface IchimokuOutput {

    timestamp: Date;

    tenkanSen: number;

    kijunSen: number;

    senkouSpanA: number;

    senkouSpanB: number;

    chikouSpan: number;

    bullishCloud: boolean;

    bearishCloud: boolean;
}

export interface IchimokuResult extends IndicatorResult {

    values: IchimokuOutput[];
}

/* -------------------------------------------------------------------------- */
/*                        PARABOLIC SAR                                       */
/* -------------------------------------------------------------------------- */

export interface ParabolicSAROutput extends IndicatorOutput {

    trendUp: boolean;

    accelerationFactor: number;

    extremePoint: number;
}

export interface ParabolicSARResult extends IndicatorResult {

    values: ParabolicSAROutput[];
}

/* -------------------------------------------------------------------------- */
/*                      KELTNER CHANNEL                                       */
/* -------------------------------------------------------------------------- */

export interface KeltnerChannelOutput {

    timestamp: Date;

    upper: number;

    middle: number;

    lower: number;

    width: number;
}

export interface KeltnerChannelResult extends IndicatorResult {

    values: KeltnerChannelOutput[];
}

/* -------------------------------------------------------------------------- */
/*                     DONCHIAN CHANNEL                                       */
/* -------------------------------------------------------------------------- */

export interface DonchianChannelOutput {

    timestamp: Date;

    upper: number;

    middle: number;

    lower: number;

    breakoutHigh: boolean;

    breakoutLow: boolean;
}

export interface DonchianChannelResult extends IndicatorResult {

    values: DonchianChannelOutput[];
}

/* -------------------------------------------------------------------------- */
/*                            AROON                                           */
/* -------------------------------------------------------------------------- */

export interface AroonOutput {

    timestamp: Date;

    aroonUp: number;

    aroonDown: number;

    oscillator: number;
}

export interface AroonResult extends IndicatorResult {

    values: AroonOutput[];
}

/* -------------------------------------------------------------------------- */
/*                         WILLIAMS %R                                        */
/* -------------------------------------------------------------------------- */

export interface WilliamsROutput extends IndicatorOutput {

    overbought: boolean;

    oversold: boolean;
}

export interface WilliamsRResult extends IndicatorResult {

    values: WilliamsROutput[];
}

/* -------------------------------------------------------------------------- */
/*                    ULTIMATE OSCILLATOR                                     */
/* -------------------------------------------------------------------------- */

export interface UltimateOscillatorOutput extends IndicatorOutput {

    bullishSignal: boolean;

    bearishSignal: boolean;
}

export interface UltimateOscillatorResult extends IndicatorResult {

    values: UltimateOscillatorOutput[];
}

/* -------------------------------------------------------------------------- */
/*                     COMPOSITE INDICATORS                                   */
/* -------------------------------------------------------------------------- */

export interface CompositeIndicator {

    id: string;

    name: string;

    indicators: TechnicalIndicator[];

    weightings: number[];

    signal: IndicatorSignal;

    confidence: number;
}

/* -------------------------------------------------------------------------- */
/*                      MULTI-TIMEFRAME ANALYSIS                              */
/* -------------------------------------------------------------------------- */

export interface MultiTimeframeIndicator {

    indicator: IndicatorType;

    timeframeResults: Record<Timeframe, IndicatorResult>;

    overallSignal: IndicatorSignal;

    confidence: number;
}

/* -------------------------------------------------------------------------- */
/*                       INDICATOR ALERTS                                     */
/* -------------------------------------------------------------------------- */

export interface IndicatorAlert {

    id: string;

    indicator: IndicatorType;

    condition: string;

    triggered: boolean;

    value: number;

    threshold: number;

    createdAt: Date;

    triggeredAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                      INDICATOR PIPELINE                                    */
/* -------------------------------------------------------------------------- */

export interface IndicatorPipeline {

    id: string;

    name: string;

    indicators: TechnicalIndicator[];

    enabled: boolean;

    sequentialExecution: boolean;

    generatedSignal?: IndicatorSignal;
}

/* -------------------------------------------------------------------------- */
/*                        INDICATOR CACHE                                     */
/* -------------------------------------------------------------------------- */

export interface IndicatorCache {

    indicator: IndicatorType;

    timeframe: Timeframe;

    result: IndicatorResult;

    cachedAt: Date;

    expiresAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     INDICATOR EXECUTION                                    */
/* -------------------------------------------------------------------------- */

export interface IndicatorExecutionMetadata {

    executionId: string;

    indicator: IndicatorType;

    executionTime: number;

    dataPoints: number;

    successful: boolean;

    calculatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      AI INDICATOR ANALYSIS                                 */
/* -------------------------------------------------------------------------- */

export interface AIIndicatorAnalysis {

    indicator: IndicatorType;

    signal: IndicatorSignal;

    confidence: number;

    explanation: string;

    probability: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      INDICATOR HEALTH                                      */
/* -------------------------------------------------------------------------- */

export interface IndicatorHealth {

    indicator: IndicatorType;

    available: boolean;

    lastCalculation: Date;

    averageExecutionTime: number;

    failureCount: number;
}

/* -------------------------------------------------------------------------- */
/*                     DEFAULT CONFIGURATION                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_INDICATOR_CATEGORY = IndicatorCategory.TREND;

export const DEFAULT_INDICATOR_TYPE = IndicatorType.EMA;

export const DEFAULT_INDICATOR_SIGNAL = IndicatorSignal.NEUTRAL;

export const DEFAULT_INDICATOR_STATUS = IndicatorStatus.ACTIVE;

/* -------------------------------------------------------------------------- */
/*                     DEFAULT PARAMETERS                                     */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PERIOD_PARAMETER: IndicatorParameter = {

    key: "period",

    label: "Period",

    value: 14,

    defaultValue: 14,

    minimum: 1,

    maximum: 500,

    required: true
};

export const DEFAULT_SOURCE_PARAMETER: IndicatorParameter = {

    key: "source",

    label: "Source",

    value: "close",

    defaultValue: "close",

    required: true
};

/* -------------------------------------------------------------------------- */
/*                    DEFAULT INDICATOR                                       */
/* -------------------------------------------------------------------------- */

export const DEFAULT_INDICATOR: TechnicalIndicator = {

    id: "",

    name: "Exponential Moving Average",

    shortName: "EMA",

    type: DEFAULT_INDICATOR_TYPE,

    category: DEFAULT_INDICATOR_CATEGORY,

    timeframe: Timeframe.ONE_MINUTE,

    enabled: true,

    visible: true,

    status: DEFAULT_INDICATOR_STATUS,

    parameters: [

        DEFAULT_PERIOD_PARAMETER,

        DEFAULT_SOURCE_PARAMETER

    ]
};

/* -------------------------------------------------------------------------- */
/*                      REGISTRY                                              */
/* -------------------------------------------------------------------------- */

export interface IndicatorRegistry {

    indicators: TechnicalIndicator[];

    categories: IndicatorCategory[];

    registeredTypes: IndicatorType[];
}

export interface IndicatorDefinition {

    type: IndicatorType;

    name: string;

    category: IndicatorCategory;

    description: string;

    defaultParameters: IndicatorParameter[];
}

/* -------------------------------------------------------------------------- */
/*                      FACTORY OPTIONS                                       */
/* -------------------------------------------------------------------------- */

export interface CreateIndicatorOptions {

    type: IndicatorType;

    timeframe: Timeframe;

    parameters?: IndicatorParameter[];

    enabled?: boolean;

    visible?: boolean;
}

export interface UpdateIndicatorOptions {

    id: string;

    parameters?: IndicatorParameter[];

    enabled?: boolean;

    visible?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                    CUSTOM INDICATORS                                       */
/* -------------------------------------------------------------------------- */

export interface CustomIndicator {

    id: string;

    name: string;

    description: string;

    category: IndicatorCategory;

    parameters: IndicatorParameter[];

    enabled: boolean;
}

export interface IndicatorPlugin {

    id: string;

    name: string;

    version: string;

    author: string;

    indicators: CustomIndicator[];

    enabled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      INDICATOR LIBRARY                                     */
/* -------------------------------------------------------------------------- */

export interface IndicatorLibrary {

    builtIn: TechnicalIndicator[];

    custom: CustomIndicator[];

    plugins: IndicatorPlugin[];
}

/* -------------------------------------------------------------------------- */
/*                     COLLECTION TYPES                                       */
/* -------------------------------------------------------------------------- */

export interface CustomIndicatorCollection {

    items: CustomIndicator[];

    total: number;
}

export interface IndicatorPluginCollection {

    items: IndicatorPlugin[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                     LOOKUP MAPS                                            */
/* -------------------------------------------------------------------------- */

export type IndicatorMap = Record<string, TechnicalIndicator>;

export type IndicatorResultMap = Record<string, IndicatorResult>;

export type IndicatorPluginMap = Record<string, IndicatorPlugin>;

export type IndicatorDefinitionMap = Record<IndicatorType, IndicatorDefinition>;

/* -------------------------------------------------------------------------- */
/*                     CALLBACK TYPES                                         */
/* -------------------------------------------------------------------------- */

export type IndicatorCalculatedHandler = (

    result: IndicatorResult

) => void;

export type IndicatorSignalHandler = (

    signal: IndicatorSignal

) => void;

export type IndicatorErrorHandler = (

    indicator: IndicatorType,

    error: Error

) => void;

export type IndicatorRegisteredHandler = (

    indicator: TechnicalIndicator

) => void;

export type IndicatorRemovedHandler = (

    indicatorId: string

) => void;

/* -------------------------------------------------------------------------- */
/*                    READONLY TYPES                                          */
/* -------------------------------------------------------------------------- */

export type ReadonlyIndicator =

    Readonly<TechnicalIndicator>;

export type ReadonlyIndicatorResult =

    Readonly<IndicatorResult>;

export type ReadonlyIndicatorOutput =

    Readonly<IndicatorOutput>;

export type ReadonlyIndicatorParameter =

    Readonly<IndicatorParameter>;

export type ReadonlyIndicatorAlert =

    Readonly<IndicatorAlert>;

export type ReadonlyCompositeIndicator =

    Readonly<CompositeIndicator>;

/* -------------------------------------------------------------------------- */
/*                     UTILITY TYPES                                          */
/* -------------------------------------------------------------------------- */

export interface IndicatorVersion {

    version: string;

    build: string;

    releasedAt: Date;
}

export interface IndicatorStatistics {

    totalIndicators: number;

    activeIndicators: number;

    disabledIndicators: number;

    customIndicators: number;

    pluginIndicators: number;

    averageCalculationTime: number;
}

export interface IndicatorCapabilities {

    supportsRealtime: boolean;

    supportsHistoricalData: boolean;

    supportsBacktesting: boolean;

    supportsMultiTimeframe: boolean;

    supportsAlerts: boolean;

    supportsAIAnalysis: boolean;
}

export interface IndicatorIdentifier {

    id: string;

    type: IndicatorType;

    timeframe: Timeframe;
}

/* -------------------------------------------------------------------------- */
/*                     END OF FILE                                            */
/* -------------------------------------------------------------------------- */