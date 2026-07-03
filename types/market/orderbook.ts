
import {
    OrderSide,
    MarketOrderType as OrderType,
    LiquidityLevel
} from "./enums";

import { Timeframe } from "./candle";

import { Instrument } from "./instrument";


export enum OrderBookStatus {

    OPEN = "OPEN",

    CLOSED = "CLOSED",

    HALTED = "HALTED",

    AUCTION = "AUCTION"
}



/* -------------------------------------------------------------------------- */
/*                           ORDER BOOK LEVEL                                 */
/* -------------------------------------------------------------------------- */

export interface OrderBookLevel {

    price: number;

    quantity: number;

    orderCount: number;
}

/* -------------------------------------------------------------------------- */
/*                            BID / ASK                                       */
/* -------------------------------------------------------------------------- */

export interface BidLevel extends OrderBookLevel {}

export interface AskLevel extends OrderBookLevel {}

/* -------------------------------------------------------------------------- */
/*                          ORDER BOOK                                         */
/* -------------------------------------------------------------------------- */

export interface OrderBook {

    instrumentId: string;
    instrument?: Instrument;


    bids: BidLevel[];

    asks: AskLevel[];

    spread: number;

    midPrice: number;

    status: OrderBookStatus;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          MARKET DEPTH                                      */
/* -------------------------------------------------------------------------- */

export interface MarketDepth {

    bidDepth: number;

    askDepth: number;

    totalDepth: number;

    imbalance: number;
}

/* -------------------------------------------------------------------------- */
/*                        SPREAD ANALYSIS                                     */
/* -------------------------------------------------------------------------- */

export interface SpreadAnalysis {

    spread: number;

    percentage: number;

    tight: boolean;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                       BEST BID / ASK                                       */
/* -------------------------------------------------------------------------- */

export interface BestBidAsk {

    bestBid: BidLevel;

    bestAsk: AskLevel;

    spread: number;

    midPrice: number;
}

/* -------------------------------------------------------------------------- */
/*                       ORDER BOOK SNAPSHOT                                  */
/* -------------------------------------------------------------------------- */

export interface OrderBookSnapshot {

    instrumentId: string;

    bids: BidLevel[];

    asks: AskLevel[];

    capturedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                        ORDER BOOK UPDATE                                   */
/* -------------------------------------------------------------------------- */

export interface OrderBookUpdate {

    instrumentId: string;

    bids: BidLevel[];

    asks: AskLevel[];

    sequence: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                       LIQUIDITY SUMMARY                                    */
/* -------------------------------------------------------------------------- */

export interface LiquiditySummary {

    level: LiquidityLevel;

    totalBidVolume: number;

    totalAskVolume: number;

    averageSpread: number;
}
/* -------------------------------------------------------------------------- */
/*                          INDIVIDUAL ORDER                                  */
/* -------------------------------------------------------------------------- */

export enum OrderStatus {

    PENDING = "PENDING",

    PARTIALLY_FILLED = "PARTIALLY_FILLED",

    FILLED = "FILLED",

    CANCELLED = "CANCELLED",

    REJECTED = "REJECTED",

    EXPIRED = "EXPIRED"
}

export interface MarketOrder {

    id: string;

    instrumentId: string;

    side: OrderSide;

    type: OrderType;

    price?: number;

    quantity: number;

    filledQuantity: number;

    remainingQuantity: number;

    status: OrderStatus;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       ORDER EXECUTION                                      */
/* -------------------------------------------------------------------------- */

export interface OrderExecution {

    executionId: string;

    orderId: string;

    executionPrice: number;

    executionQuantity: number;

    executionValue: number;

    fee: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                          RECENT TRADE                                      */
/* -------------------------------------------------------------------------- */

export interface MarketTrade {

    id: string;

    instrumentId: string;

    side: OrderSide;

    price: number;

    quantity: number;

    value: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                      ORDER BOOK EVENT                                      */
/* -------------------------------------------------------------------------- */

export enum OrderBookEventType {

    ORDER_ADDED = "ORDER_ADDED",

    ORDER_UPDATED = "ORDER_UPDATED",

    ORDER_REMOVED = "ORDER_REMOVED",

    TRADE_EXECUTED = "TRADE_EXECUTED",

    SNAPSHOT_RECEIVED = "SNAPSHOT_RECEIVED"
}

export interface OrderBookEvent {

    id: string;

    type: OrderBookEventType;

    instrumentId: string;

    timestamp: Date;

    payload?: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                     ORDER FLOW ANALYSIS                                    */
/* -------------------------------------------------------------------------- */

export interface OrderFlowAnalysis {

    buyVolume: number;

    sellVolume: number;

    netVolume: number;

    buyOrders: number;

    sellOrders: number;

    imbalance: number;

    analyzedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     MARKET IMPACT                                          */
/* -------------------------------------------------------------------------- */

export interface MarketImpactAnalysis {

    expectedPriceImpact: number;

    slippage: number;

    liquidityConsumed: number;

    executionProbability: number;
}

/* -------------------------------------------------------------------------- */
/*                        VOLUME PROFILE                                      */
/* -------------------------------------------------------------------------- */

export interface VolumeProfileLevel {

    price: number;

    volume: number;

    percentage: number;
}

export interface VolumeProfile {

    levels: VolumeProfileLevel[];

    pointOfControl: number;

    valueAreaHigh: number;

    valueAreaLow: number;
}

/* -------------------------------------------------------------------------- */
/*                        LIQUIDITY ZONE                                      */
/* -------------------------------------------------------------------------- */

export interface OrderBookLiquidityZone {

    lowerPrice: number;

    upperPrice: number;

    totalVolume: number;

    strength: number;

    support: boolean;

    resistance: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         ICEBERG ORDER                                      */
/* -------------------------------------------------------------------------- */

export interface IcebergOrderDetection {

    detected: boolean;

    estimatedHiddenVolume: number;

    confidence: number;

    detectedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         SPOOFING DETECTION                                 */
/* -------------------------------------------------------------------------- */

export interface SpoofingDetection {

    suspected: boolean;

    confidence: number;

    cancelledOrders: number;

    detectedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      LIQUIDITY IMBALANCE                                   */
/* -------------------------------------------------------------------------- */

export interface LiquidityImbalance {

    bidLiquidity: number;

    askLiquidity: number;

    imbalanceRatio: number;

    dominantSide: OrderSide;
}

/* -------------------------------------------------------------------------- */
/*                         ORDER CLUSTER                                      */
/* -------------------------------------------------------------------------- */

export interface OrderCluster {

    price: number;

    orderCount: number;

    totalQuantity: number;

    averageOrderSize: number;
}

/* -------------------------------------------------------------------------- */
/*                      DEPTH DISTRIBUTION                                    */
/* -------------------------------------------------------------------------- */

export interface DepthDistribution {

    priceLevels: number;

    averageQuantity: number;

    maximumQuantity: number;

    minimumQuantity: number;
}
/* -------------------------------------------------------------------------- */
/*                     LEVEL 2 MARKET DATA                                    */
/* -------------------------------------------------------------------------- */

export interface Level2MarketData {

    instrumentId: string;

    bids: BidLevel[];

    asks: AskLevel[];

    spread: number;

    sequence: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                     LEVEL 3 MARKET DATA                                    */
/* -------------------------------------------------------------------------- */

export interface Level3Order {

    orderId: string;

    side: OrderSide;

    price: number;

    quantity: number;

    timestamp: Date;
}

export interface Level3MarketData {

    instrumentId: string;

    orders: Level3Order[];

    sequence: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                  REAL-TIME ORDER BOOK STREAM                               */
/* -------------------------------------------------------------------------- */

export enum OrderBookStreamStatus {

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    DISCONNECTED = "DISCONNECTED",

    RECONNECTING = "RECONNECTING",

    ERROR = "ERROR"
}

export interface OrderBookStream {

    instrumentId: string;

    status: OrderBookStreamStatus;

    connected: boolean;

    lastSequence: number;

    lastUpdate: Date;
}

/* -------------------------------------------------------------------------- */
/*                  INCREMENTAL DEPTH UPDATE                                  */
/* -------------------------------------------------------------------------- */

export interface DepthLevelUpdate {

    side: OrderSide;

    price: number;

    quantity: number;

    orderCount: number;
}

export interface IncrementalDepthUpdate {

    instrumentId: string;

    sequence: number;

    updates: DepthLevelUpdate[];

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                    MARKET MAKER ACTIVITY                                   */
/* -------------------------------------------------------------------------- */

export interface MarketMakerActivity {

    marketMakerId: string;

    buyOrders: number;

    sellOrders: number;

    quotedSpread: number;

    totalLiquidity: number;

    lastActivity: Date;
}

/* -------------------------------------------------------------------------- */
/*                      SMART ORDER ROUTING                                   */
/* -------------------------------------------------------------------------- */

export interface SmartOrderRoute {

    venue: string;

    expectedPrice: number;

    expectedSlippage: number;

    availableLiquidity: number;

    executionProbability: number;
}

export interface SmartOrderRoutingAnalysis {

    routes: SmartOrderRoute[];

    recommendedVenue: string;

    bestExecutionPrice: number;

    estimatedCost: number;
}

/* -------------------------------------------------------------------------- */
/*                      AI LIQUIDITY ANALYSIS                                 */
/* -------------------------------------------------------------------------- */

export interface AILiquidityAnalysis {

    liquidityScore: number;

    predictedSpread: number;

    expectedVolatility: number;

    recommendedOrderSize: number;

    executionRisk: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    HISTORICAL ORDER BOOK                                   */
/* -------------------------------------------------------------------------- */

export interface HistoricalOrderBook {

    instrumentId: string;

    timeframe: Timeframe;

    snapshots: OrderBookSnapshot[];

    from: Date;

    to: Date;
}

/* -------------------------------------------------------------------------- */
/*                    ORDER BOOK REPLAY                                       */
/* -------------------------------------------------------------------------- */

export enum ReplayMode {

    STOPPED = "STOPPED",

    PLAYING = "PLAYING",

    PAUSED = "PAUSED",

    FINISHED = "FINISHED"
}

export interface OrderBookReplay {

    enabled: boolean;

    mode: ReplayMode;

    currentSnapshot: number;

    playbackSpeed: number;

    totalSnapshots: number;
}

/* -------------------------------------------------------------------------- */
/*                     STREAM PERFORMANCE                                     */
/* -------------------------------------------------------------------------- */

export interface OrderBookPerformance {

    updatesPerSecond: number;

    latencyMilliseconds: number;

    droppedUpdates: number;

    reconnectCount: number;

    averageProcessingTime: number;
}

/* -------------------------------------------------------------------------- */
/*                     ORDER BOOK HEALTH                                      */
/* -------------------------------------------------------------------------- */

export interface OrderBookHealth {

    healthy: boolean;

    synchronized: boolean;

    lastHeartbeat: Date;

    sequenceGapDetected: boolean;

    messageLossDetected: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      DEPTH HEATMAP                                         */
/* -------------------------------------------------------------------------- */

export interface DepthHeatmapLevel {

    price: number;

    liquidity: number;

    intensity: number;
}

export interface DepthHeatmap {

    levels: DepthHeatmapLevel[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     EXECUTION QUALITY                                      */
/* -------------------------------------------------------------------------- */

export interface ExecutionQuality {

    averageSlippage: number;

    fillRate: number;

    averageExecutionTime: number;

    rejectedOrders: number;

    partiallyFilledOrders: number;
}

/* -------------------------------------------------------------------------- */
/*                     DEFAULT CONFIGURATION                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ORDER_SIDE = OrderSide.BUY;

export const DEFAULT_ORDER_TYPE = OrderType.MARKET;

export const DEFAULT_ORDER_STATUS = OrderStatus.PENDING;

export const DEFAULT_ORDERBOOK_STATUS = OrderBookStatus.OPEN;

export const DEFAULT_LIQUIDITY_LEVEL = LiquidityLevel.NORMAL;

/* -------------------------------------------------------------------------- */
/*                     DEFAULT ORDER BOOK                                     */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ORDER_BOOK: OrderBook = {

    instrumentId: "",

    bids: [],

    asks: [],

    spread: 0,

    midPrice: 0,

    status: DEFAULT_ORDERBOOK_STATUS,

    updatedAt: new Date()
};

/* -------------------------------------------------------------------------- */
/*                       DEFAULT MARKET DEPTH                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_DEPTH: MarketDepth = {

    bidDepth: 0,

    askDepth: 0,

    totalDepth: 0,

    imbalance: 0
};

/* -------------------------------------------------------------------------- */
/*                         REGISTRY                                           */
/* -------------------------------------------------------------------------- */

export interface OrderBookRegistry {

    books: OrderBook[];

    instruments: string[];

    activeStreams: OrderBookStream[];
}

export interface OrderBookDefinition {

    instrumentId: string;

    supportsLevel2: boolean;

    supportsLevel3: boolean;

    supportsReplay: boolean;

    supportsHistoricalData: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        FACTORY OPTIONS                                     */
/* -------------------------------------------------------------------------- */

export interface CreateOrderBookOptions {

    instrumentId: string;

    initialDepth?: number;

    enableStreaming?: boolean;

    enableCaching?: boolean;
}

export interface UpdateOrderBookOptions {

    instrumentId: string;

    bids?: BidLevel[];

    asks?: AskLevel[];

    sequence?: number;
}

/* -------------------------------------------------------------------------- */
/*                        COLLECTION TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface OrderBookCollection {

    items: OrderBook[];

    total: number;
}

export interface MarketTradeCollection {

    items: MarketTrade[];

    total: number;
}

export interface OrderExecutionCollection {

    items: OrderExecution[];

    total: number;
}

export interface OrderBookEventCollection {

    items: OrderBookEvent[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                          LOOKUP MAPS                                       */
/* -------------------------------------------------------------------------- */

export type OrderBookMap = Record<string, OrderBook>;

export type MarketTradeMap = Record<string, MarketTrade>;

export type OrderExecutionMap = Record<string, OrderExecution>;

export type OrderBookEventMap = Record<string, OrderBookEvent>;

export type LiquidityZoneMap = Record<string, OrderBookLiquidityZone>;

/* -------------------------------------------------------------------------- */
/*                        CALLBACK TYPES                                      */
/* -------------------------------------------------------------------------- */

export type OrderBookUpdateHandler = (

    book: OrderBook

) => void;

export type OrderExecutionHandler = (

    execution: OrderExecution

) => void;

export type TradeHandler = (

    trade: MarketTrade

) => void;

export type LiquidityHandler = (

    liquidity: LiquiditySummary

) => void;

export type DepthUpdateHandler = (

    update: IncrementalDepthUpdate

) => void;

export type OrderBookErrorHandler = (

    error: Error

) => void;

/* -------------------------------------------------------------------------- */
/*                        READONLY TYPES                                      */
/* -------------------------------------------------------------------------- */

export type ReadonlyOrderBook =

    Readonly<OrderBook>;

export type ReadonlyOrder =

    Readonly<MarketOrder>;

export type ReadonlyTrade =

    Readonly<MarketTrade>;

export type ReadonlyExecution =

    Readonly<OrderExecution>;

export type ReadonlyDepth =

    Readonly<MarketDepth>;

export type ReadonlyLiquidity =

    Readonly<LiquiditySummary>;

export type ReadonlyOrderBookSnapshot =

    Readonly<OrderBookSnapshot>;

/* -------------------------------------------------------------------------- */
/*                      PLUGIN SUPPORT                                        */
/* -------------------------------------------------------------------------- */

export interface OrderBookPlugin {

    id: string;

    name: string;

    version: string;

    author: string;

    enabled: boolean;

    supportedFeatures: string[];
}

export interface OrderBookPluginCollection {

    items: OrderBookPlugin[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                        STATISTICS                                          */
/* -------------------------------------------------------------------------- */

export interface OrderBookStatistics {

    totalBooks: number;

    activeBooks: number;

    totalTrades: number;

    totalExecutions: number;

    averageSpread: number;

    averageDepth: number;

    averageLatency: number;
}

/* -------------------------------------------------------------------------- */
/*                         CAPABILITIES                                       */
/* -------------------------------------------------------------------------- */

export interface OrderBookCapabilities {

    supportsLevel2: boolean;

    supportsLevel3: boolean;

    supportsStreaming: boolean;

    supportsReplay: boolean;

    supportsHeatmap: boolean;

    supportsAIAnalysis: boolean;

    supportsHistoricalData: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         IDENTIFIER                                         */
/* -------------------------------------------------------------------------- */

export interface OrderBookIdentifier {

    instrumentId: string;

    timeframe?: Timeframe;

    sequence?: number;
}

/* -------------------------------------------------------------------------- */
/*                           VERSION                                          */
/* -------------------------------------------------------------------------- */

export interface OrderBookVersion {

    version: string;

    build: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          END OF FILE                                       */
/* -------------------------------------------------------------------------- */
