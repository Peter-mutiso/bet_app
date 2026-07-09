
import {
    CandlestickData,
    UTCTimestamp,
    ISeriesApi,
    LineData,
    BarData,
    AreaData,
} from "lightweight-charts";
/* =============================================================================
   MARKET REGIMES
   ============================================================================= */

export enum MarketRegime {

    RANGE = "range",

    BULL = "bull",

    BEAR = "bear",

    BREAKOUT = "breakout",

    REVERSAL = "reversal",

    PANIC = "panic",

    RECOVERY = "recovery",

    CONSOLIDATION = "consolidation",

}

/* =============================================================================
   CANDLE
   ============================================================================= */

export interface Candle extends CandlestickData {

    time: UTCTimestamp;

    open: number;

    high: number;

    low: number;

    close: number;

    volume: number;

    spread: number;

    body: number;

    upperWick: number;

    lowerWick: number;

    bullish: boolean;

    bearish: boolean;

}

/* =============================================================================
   TICK
   ============================================================================= */

export interface MarketTick {

    price: number;

    move: number;

    velocity: number;

    acceleration: number;

    volatility: number;

    spread: number;

    timestamp: number;

}

/* =============================================================================
   MARKET ENGINE
   ============================================================================= */

export interface EngineState {

    /*
    ----------------------------------------------------
    CURRENT MARKET
    ----------------------------------------------------
    */

    price: number;

    lastPrice: number;

    meanPrice: number;

    /*
    ----------------------------------------------------
    TREND
    ----------------------------------------------------
    */

    trend: number;

    trendStrength: number;

    momentum: number;

    acceleration: number;

    /*
    ----------------------------------------------------
    VOLATILITY
    ----------------------------------------------------
    */

    volatility: number;

    volatilityTarget: number;

    volatilityNoise: number;

    /*
    ----------------------------------------------------
    REGIME
    ----------------------------------------------------
    */

    regime: MarketRegime;

    regimeTicks: number;
    regimeDuration: number;

    /*
    ----------------------------------------------------
    IMPULSE
    ----------------------------------------------------
    */

    impulse: number;

    impulseDecay: number;
    drift: number;

    /*
    ----------------------------------------------------
    STATISTICS
    ----------------------------------------------------
    */

    highest: number;

    lowest: number;

    sessionHigh: number;

    sessionLow: number;

    tickCounter: number;

    candleCounter: number;

    /*
----------------------------------------------------
MICRO TICKS
----------------------------------------------------
*/

microTrend: number;

microMomentum: number;

microNoise: number;

lastMove: number;

buyPressure: number;

sellPressure: number;

tickInCandle: number;

}

/* =============================================================================
   NEXT TICK
   ============================================================================= */

export interface TickResult {

    price: number;

    move: number;

    velocity: number;

    acceleration: number;

}

/* =============================================================================
   VOLATILITY PROFILE
   ============================================================================= */

export interface VolatilityProfile {

    multiplier: number;

    trendStrength: number;

    shockChance: number;

    noise: number;

}

/* =============================================================================
   HISTORY
   ============================================================================= */

export interface HistoryOptions {

    candles: number;

    startPrice: number;

    timeframe: number;

    volatility: number;

}

/* =============================================================================
   SERIES
   ============================================================================= */
export interface ChartSeries {

    candles: ISeriesApi<"Candlestick">;

    line: ISeriesApi<"Line">;

    area: ISeriesApi<"Area">;

    ohlc: ISeriesApi<"Bar">;

}

/* =============================================================================
   CHART STATE
   ============================================================================= */

export interface ChartState {

    initialized: boolean;

    loading: boolean;

    chartType: string;

    followLive: boolean;

    candleDuration: number;

    volatilityIndex: number;

}

/* =============================================================================
   MARKET EVENTS
   ============================================================================= */

export interface MarketEvent {

    id: string;

    type:
        | "trend"
        | "shock"
        | "reversal"
        | "breakout"
        | "panic"
        | "recovery";

    strength: number;

    duration: number;

}

/* =============================================================================
   INDICATORS
   ============================================================================= */

export interface IndicatorValues {

    sma20?: number;

    sma50?: number;

    ema20?: number;

    ema50?: number;

    rsi?: number;

    atr?: number;

    macd?: number;

}
/* =============================================================================
   BOLLINGER BANDS
   ============================================================================= */

export interface BollingerBands {

    upper: LineData[];

    middle: LineData[];

    lower: LineData[];

}

/* =============================================================================
   VIEWPORT
   ============================================================================= */

export interface ViewportState {

    autoFollow: boolean;

    zoom: number;

    visibleBars: number;

}

/* =============================================================================
   SIMULATION CONFIG
   ============================================================================= */

export interface SimulationConfig {

    ticksPerSecond: number;

    maxHistory: number;

    defaultPrice: number;

    defaultVolatility: number;

    defaultTimeframe: number;

}

/* =============================================================================
   DEFAULT CONFIG
   ============================================================================= */

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {

    ticksPerSecond: 12,

    maxHistory: 1000,

    defaultPrice: 100,

    defaultVolatility: 2,

    defaultTimeframe: 60,

};