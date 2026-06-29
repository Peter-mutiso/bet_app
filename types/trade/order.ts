/**
 * ============================================================================
 * ORDER TYPES
 * ============================================================================
 * Professional Order Management Models
 *
 * Used by:
 * - Trading Engine
 * - Matching Engine
 * - Risk Engine
 * - Portfolio
 * - AI Trading
 * ============================================================================
 */

import { Instrument } from "../market/market";
import { Timeframe } from "../common";
import { TradeDirection } from "./trade";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum OrderType {

    MARKET = "MARKET",

    LIMIT = "LIMIT",

    STOP = "STOP",

    STOP_LIMIT = "STOP_LIMIT",

    TRAILING_STOP = "TRAILING_STOP"
}

export enum OrderStatus {

    CREATED = "CREATED",

    PENDING = "PENDING",

    ACCEPTED = "ACCEPTED",

    PARTIALLY_FILLED = "PARTIALLY_FILLED",

    FILLED = "FILLED",

    CANCELLED = "CANCELLED",

    REJECTED = "REJECTED",

    EXPIRED = "EXPIRED"
}

export enum TimeInForce {

    GTC = "GTC",

    IOC = "IOC",

    FOK = "FOK",

    DAY = "DAY",

    GTD = "GTD"
}

export enum OrderSource {

    MANUAL = "MANUAL",

    BOT = "BOT",

    API = "API",

    COPY_TRADING = "COPY_TRADING",

    AI = "AI"
}

export enum OrderTrigger {

    MANUAL = "MANUAL",

    PRICE = "PRICE",

    INDICATOR = "INDICATOR",

    SIGNAL = "SIGNAL",

    TIME = "TIME"
}

/* -------------------------------------------------------------------------- */
/*                          ORDER PRICE                                       */
/* -------------------------------------------------------------------------- */

export interface OrderPrice {

    requestedPrice?: number;

    limitPrice?: number;

    stopPrice?: number;

    trailingDistance?: number;

    executionPrice?: number;
}

/* -------------------------------------------------------------------------- */
/*                           ORDER SIZE                                       */
/* -------------------------------------------------------------------------- */

export interface OrderSize {

    quantity: number;

    filledQuantity: number;

    remainingQuantity: number;

    contractSize: number;
}

/* -------------------------------------------------------------------------- */
/*                         ORDER RISK                                         */
/* -------------------------------------------------------------------------- */

export interface OrderRisk {

    stopLoss?: number;

    takeProfit?: number;

    maximumRisk: number;

    estimatedReward: number;

    riskRewardRatio: number;
}

/* -------------------------------------------------------------------------- */
/*                       ORDER METADATA                                       */
/* -------------------------------------------------------------------------- */

export interface OrderMetadata {

    notes?: string;

    tags: string[];

    strategy?: string;

    aiGenerated: boolean;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                            ORDER                                           */
/* -------------------------------------------------------------------------- */

export interface Order {

    id: string;

    accountId: string;

    instrument: Instrument;

    timeframe: Timeframe;

    direction: TradeDirection;

    type: OrderType;

    status: OrderStatus;

    source: OrderSource;

    trigger: OrderTrigger;

    timeInForce: TimeInForce;

    price: OrderPrice;

    size: OrderSize;

    risk: OrderRisk;

    metadata: OrderMetadata;
}

/* -------------------------------------------------------------------------- */
/*                        ORDER SUMMARY                                       */
/* -------------------------------------------------------------------------- */

export interface OrderSummary {

    totalOrders: number;

    pendingOrders: number;

    openOrders: number;

    filledOrders: number;

    cancelledOrders: number;

    rejectedOrders: number;
}
/* -------------------------------------------------------------------------- */
/*                      ORDER EXECUTION                                       */
/* -------------------------------------------------------------------------- */

export enum OrderExecutionStatus {

    PENDING = "PENDING",

    EXECUTING = "EXECUTING",

    PARTIALLY_FILLED = "PARTIALLY_FILLED",

    FILLED = "FILLED",

    FAILED = "FAILED",

    CANCELLED = "CANCELLED"
}

export interface OrderExecution {

    executionId: string;

    orderId: string;

    requestedPrice: number;

    executedPrice: number;

    executedQuantity: number;

    remainingQuantity: number;

    executionStatus: OrderExecutionStatus;

    executionTime: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                        ORDER FILL                                          */
/* -------------------------------------------------------------------------- */

export interface OrderFill {

    fillId: string;

    orderId: string;

    quantity: number;

    price: number;

    commission: number;

    liquidityFee?: number;

    timestamp: Date;
}

export interface OrderFillHistory {

    orderId: string;

    fills: OrderFill[];

    totalFilledQuantity: number;

    averageFillPrice: number;
}

/* -------------------------------------------------------------------------- */
/*                    ORDER MODIFICATION                                      */
/* -------------------------------------------------------------------------- */

export interface OrderModification {

    modificationId: string;

    orderId: string;

    previousPrice?: number;

    newPrice?: number;

    previousQuantity?: number;

    newQuantity?: number;

    previousStopLoss?: number;

    newStopLoss?: number;

    previousTakeProfit?: number;

    newTakeProfit?: number;

    modifiedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    ORDER CANCELLATION                                      */
/* -------------------------------------------------------------------------- */

export enum CancellationReason {

    USER_REQUEST = "USER_REQUEST",

    EXPIRED = "EXPIRED",

    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",

    MARKET_CLOSED = "MARKET_CLOSED",

    RISK_REJECTION = "RISK_REJECTION",

    SYSTEM_ERROR = "SYSTEM_ERROR"
}

export interface OrderCancellation {

    orderId: string;

    cancelledBy: string;

    reason: CancellationReason;

    cancelledAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      BRACKET ORDER                                         */
/* -------------------------------------------------------------------------- */

export interface BracketOrder {

    entryOrder: Order;

    stopLossOrder?: Order;

    takeProfitOrder?: Order;

    active: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     OCO ORDER                                              */
/* -------------------------------------------------------------------------- */

export interface OCOOrder {

    primaryOrder: Order;

    secondaryOrder: Order;

    triggeredOrderId?: string;

    active: boolean;
}

/* -------------------------------------------------------------------------- */
/*                    CONDITIONAL ORDER                                       */
/* -------------------------------------------------------------------------- */

export enum ConditionOperator {

    GREATER_THAN = "GREATER_THAN",

    LESS_THAN = "LESS_THAN",

    EQUAL = "EQUAL",

    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",

    LESS_OR_EQUAL = "LESS_OR_EQUAL"
}

export interface OrderCondition {

    field: string;

    operator: ConditionOperator;

    value: number | string | boolean;
}

export interface ConditionalOrder {

    order: Order;

    conditions: OrderCondition[];

    requireAllConditions: boolean;

    active: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     ORDER VALIDATION                                       */
/* -------------------------------------------------------------------------- */

export interface OrderValidation {

    valid: boolean;

    errors: string[];

    warnings: string[];

    validatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                  EXECUTION QUALITY                                         */
/* -------------------------------------------------------------------------- */

export interface OrderExecutionQuality {

    latencyMilliseconds: number;

    requestedPrice: number;

    executedPrice: number;

    slippage: number;

    executionScore: number;

    fullyFilled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                  SMART ORDER ROUTING                                       */
/* -------------------------------------------------------------------------- */

export interface SmartOrderRoute {

    venue: string;

    expectedPrice: number;

    availableLiquidity: number;

    estimatedLatency: number;

    routingScore: number;
}

export interface SmartOrderRouting {

    orderId: string;

    routes: SmartOrderRoute[];

    selectedVenue: string;

    estimatedExecutionCost: number;
}

/* -------------------------------------------------------------------------- */
/*                  ORDER LIFECYCLE                                           */
/* -------------------------------------------------------------------------- */

export interface OrderLifecycle {

    createdAt: Date;

    submittedAt?: Date;

    acceptedAt?: Date;

    partiallyFilledAt?: Date;

    filledAt?: Date;

    cancelledAt?: Date;

    expiredAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                   REAL-TIME ORDER UPDATE                                   */
/* -------------------------------------------------------------------------- */

export interface RealTimeOrderUpdate {

    orderId: string;

    status: OrderStatus;

    filledQuantity: number;

    remainingQuantity: number;

    executionPrice?: number;

    timestamp: Date;
}
/* -------------------------------------------------------------------------- */
/*                          ORDER HISTORY                                     */
/* -------------------------------------------------------------------------- */

export interface OrderHistory {

    accountId: string;

    orders: Order[];

    totalOrders: number;

    pendingOrders: number;

    completedOrders: number;

    cancelledOrders: number;

    generatedAt: Date;
}

export interface OrderHistoryFilter {

    instrumentId?: string;

    type?: OrderType;

    status?: OrderStatus;

    direction?: TradeDirection;

    from?: Date;

    to?: Date;
}

/* -------------------------------------------------------------------------- */
/*                      ORDER ANALYTICS                                       */
/* -------------------------------------------------------------------------- */

export interface OrderAnalytics {

    averageExecutionTime: number;

    averageSlippage: number;

    fillRate: number;

    cancellationRate: number;

    rejectionRate: number;

    successRate: number;

    averageOrderValue: number;
}

/* -------------------------------------------------------------------------- */
/*                      AI ORDER ANALYSIS                                     */
/* -------------------------------------------------------------------------- */

export enum AIOrderRecommendation {

    EXECUTE = "EXECUTE",

    WAIT = "WAIT",

    MODIFY = "MODIFY",

    CANCEL = "CANCEL"
}

export interface AIOrderAnalysis {

    recommendation: AIOrderRecommendation;

    confidence: number;

    predictedExecutionPrice: number;

    predictedFillProbability: number;

    estimatedSlippage: number;

    explanation: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          ORDER ALERTS                                      */
/* -------------------------------------------------------------------------- */

export enum OrderAlertType {

    PRICE_REACHED = "PRICE_REACHED",

    PARTIAL_FILL = "PARTIAL_FILL",

    FILLED = "FILLED",

    CANCELLED = "CANCELLED",

    REJECTED = "REJECTED",

    EXPIRED = "EXPIRED",

    CUSTOM = "CUSTOM"
}

export interface OrderAlert {

    id: string;

    orderId: string;

    type: OrderAlertType;

    title: string;

    message: string;

    triggered: boolean;

    createdAt: Date;

    triggeredAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                         ICEBERG ORDER                                      */
/* -------------------------------------------------------------------------- */

export interface IcebergOrder {

    order: Order;

    totalQuantity: number;

    visibleQuantity: number;

    hiddenQuantity: number;

    executedHiddenQuantity: number;
}

/* -------------------------------------------------------------------------- */
/*                         TWAP ORDER                                         */
/* -------------------------------------------------------------------------- */

export interface TWAPOrder {

    order: Order;

    totalQuantity: number;

    slices: number;

    intervalSeconds: number;

    executedSlices: number;
}

/* -------------------------------------------------------------------------- */
/*                         VWAP ORDER                                         */
/* -------------------------------------------------------------------------- */

export interface VWAPOrder {

    order: Order;

    targetVolumePercentage: number;

    executedVolume: number;

    remainingVolume: number;
}

/* -------------------------------------------------------------------------- */
/*                    ORDER SYNCHRONIZATION                                   */
/* -------------------------------------------------------------------------- */

export interface OrderSynchronization {

    synchronized: boolean;

    lastSynchronization: Date;

    pendingUpdates: number;

    failedSynchronizations: number;
}

/* -------------------------------------------------------------------------- */
/*                     BACKTEST ORDER RESULT                                  */
/* -------------------------------------------------------------------------- */

export interface OrderBacktestResult {

    strategyId: string;

    totalOrders: number;

    filledOrders: number;

    cancelledOrders: number;

    rejectedOrders: number;

    averageExecutionTime: number;

    averageSlippage: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    ORDER NOTIFICATION                                      */
/* -------------------------------------------------------------------------- */

export interface OrderNotification {

    id: string;

    orderId: string;

    title: string;

    message: string;

    read: boolean;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                   ORDER PORTFOLIO METRICS                                  */
/* -------------------------------------------------------------------------- */

export interface OrderPortfolioMetrics {

    totalOpenOrders: number;

    totalPendingOrders: number;

    totalExecutedOrders: number;

    totalCancelledOrders: number;

    totalRejectedOrders: number;

    totalOrderValue: number;

    averageOrderSize: number;

    averageExecutionPrice: number;
}

/* -------------------------------------------------------------------------- */
/*                     ORDER TIMELINE                                         */
/* -------------------------------------------------------------------------- */

export interface OrderTimelineEvent {

    id: string;

    orderId: string;

    event: string;

    description: string;

    timestamp: Date;
}

export interface OrderTimeline {

    orderId: string;

    events: OrderTimelineEvent[];
}

/* -------------------------------------------------------------------------- */
/*                     ORDER TAGS                                             */
/* -------------------------------------------------------------------------- */

export interface OrderTag {

    id: string;

    name: string;

    color: string;
}

export interface OrderClassification {

    category: string;

    strategy?: string;

    tags: OrderTag[];
}

/* -------------------------------------------------------------------------- */
/*                     ORDER HEALTH                                           */
/* -------------------------------------------------------------------------- */

export interface OrderHealth {

    orderId: string;

    healthy: boolean;

    executionHealth: number;

    latencyScore: number;

    lastChecked: Date;
}

/* -------------------------------------------------------------------------- */
/*                     DEFAULT CONFIGURATION                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ORDER_TYPE = OrderType.MARKET;

export const DEFAULT_ORDER_STATUS = OrderStatus.CREATED;

export const DEFAULT_ORDER_SOURCE = OrderSource.MANUAL;

export const DEFAULT_TIME_IN_FORCE = TimeInForce.GTC;

export const DEFAULT_ORDER_TRIGGER = OrderTrigger.MANUAL;

/* -------------------------------------------------------------------------- */
/*                     DEFAULT ORDER                                          */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ORDER: Order = {

    id: "",

    accountId: "",

    instrument: {} as Instrument,

    timeframe: Timeframe.M1,

    direction: TradeDirection.BUY,

    type: DEFAULT_ORDER_TYPE,

    status: DEFAULT_ORDER_STATUS,

    source: DEFAULT_ORDER_SOURCE,

    trigger: DEFAULT_ORDER_TRIGGER,

    timeInForce: DEFAULT_TIME_IN_FORCE,

    price: {

        requestedPrice: 0,

        executionPrice: 0
    },

    size: {

        quantity: 0,

        filledQuantity: 0,

        remainingQuantity: 0,

        contractSize: 1
    },

    risk: {

        maximumRisk: 0,

        estimatedReward: 0,

        riskRewardRatio: 0
    },

    metadata: {

        tags: [],

        aiGenerated: false,

        createdAt: new Date(),

        updatedAt: new Date()
    }
};

/* -------------------------------------------------------------------------- */
/*                      REGISTRY                                              */
/* -------------------------------------------------------------------------- */

export interface OrderRegistry {

    activeOrders: Order[];

    pendingOrders: Order[];

    filledOrders: Order[];

    cancelledOrders: Order[];

    rejectedOrders: Order[];
}

export interface OrderDefinition {

    type: OrderType;

    description: string;

    supportsPartialFill: boolean;

    supportsModification: boolean;

    supportsCancellation: boolean;

    supportsTrailingStop: boolean;

    supportsBracketOrders: boolean;

    supportsOCO: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      FACTORY OPTIONS                                       */
/* -------------------------------------------------------------------------- */

export interface CreateOrderOptions {

    accountId: string;

    instrument: Instrument;

    direction: TradeDirection;

    type: OrderType;

    quantity: number;

    requestedPrice?: number;

    stopLoss?: number;

    takeProfit?: number;

    timeInForce?: TimeInForce;
}

export interface UpdateOrderOptions {

    orderId: string;

    requestedPrice?: number;

    quantity?: number;

    stopLoss?: number;

    takeProfit?: number;

    notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                      COLLECTIONS                                           */
/* -------------------------------------------------------------------------- */

export interface OrderCollection {

    items: Order[];

    total: number;
}

export interface OrderExecutionCollection {

    items: OrderExecution[];

    total: number;
}

export interface OrderAlertCollection {

    items: OrderAlert[];

    total: number;
}

export interface OrderNotificationCollection {

    items: OrderNotification[];

    total: number;
}

export interface OrderFillCollection {

    items: OrderFill[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                       LOOKUP MAPS                                          */
/* -------------------------------------------------------------------------- */

export type OrderMap = Record<string, Order>;

export type OrderExecutionMap = Record<string, OrderExecution>;

export type OrderAlertMap = Record<string, OrderAlert>;

export type OrderNotificationMap =
    Record<string, OrderNotification>;

export type OrderTimelineMap =
    Record<string, OrderTimeline>;

export type OrderFillMap =
    Record<string, OrderFill>;

/* -------------------------------------------------------------------------- */
/*                     CALLBACK TYPES                                         */
/* -------------------------------------------------------------------------- */

export type OrderCreatedHandler = (

    order: Order

) => void;

export type OrderUpdatedHandler = (

    order: Order

) => void;

export type OrderFilledHandler = (

    order: Order

) => void;

export type OrderCancelledHandler = (

    order: Order

) => void;

export type OrderRejectedHandler = (

    order: Order

) => void;

export type OrderExecutionHandler = (

    execution: OrderExecution

) => void;

export type OrderAlertHandler = (

    alert: OrderAlert

) => void;

export type OrderErrorHandler = (

    error: Error

) => void;

/* -------------------------------------------------------------------------- */
/*                      READONLY TYPES                                        */
/* -------------------------------------------------------------------------- */

export type ReadonlyOrder =
    Readonly<Order>;

export type ReadonlyOrderExecution =
    Readonly<OrderExecution>;

export type ReadonlyOrderAlert =
    Readonly<OrderAlert>;

export type ReadonlyOrderAnalytics =
    Readonly<OrderAnalytics>;

export type ReadonlyOrderHistory =
    Readonly<OrderHistory>;

export type ReadonlyOrderPortfolioMetrics =
    Readonly<OrderPortfolioMetrics>;

/* -------------------------------------------------------------------------- */
/*                     ORDER STATISTICS                                       */
/* -------------------------------------------------------------------------- */

export interface OrderStatistics {

    totalOrders: number;

    activeOrders: number;

    pendingOrders: number;

    completedOrders: number;

    cancelledOrders: number;

    rejectedOrders: number;

    partiallyFilledOrders: number;

    averageExecutionTime: number;

    averageFillRate: number;

    averageOrderValue: number;

    totalOrderVolume: number;
}

/* -------------------------------------------------------------------------- */
/*                     ORDER CAPABILITIES                                     */
/* -------------------------------------------------------------------------- */

export interface OrderCapabilities {

    supportsMarketOrders: boolean;

    supportsLimitOrders: boolean;

    supportsStopOrders: boolean;

    supportsStopLimitOrders: boolean;

    supportsTrailingStops: boolean;

    supportsBracketOrders: boolean;

    supportsOCOOrders: boolean;

    supportsConditionalOrders: boolean;

    supportsIcebergOrders: boolean;

    supportsTWAP: boolean;

    supportsVWAP: boolean;

    supportsSmartRouting: boolean;

    supportsAIOptimization: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     IDENTIFIER                                             */
/* -------------------------------------------------------------------------- */

export interface OrderIdentifier {

    orderId: string;

    accountId: string;

    instrumentId: string;
}

/* -------------------------------------------------------------------------- */
/*                     VERSION                                                */
/* -------------------------------------------------------------------------- */

export interface OrderVersion {

    version: string;

    build: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                        END OF FILE                                         */
/* -------------------------------------------------------------------------- */