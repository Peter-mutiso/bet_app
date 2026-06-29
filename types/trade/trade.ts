/**
 * ============================================================================
 * TRADE TYPES
 * ============================================================================
 * Professional Trading Models
 *
 * Used by:
 * - Trading Engine
 * - Order Management
 * - Position Management
 * - Risk Management
 * - AI Prediction
 * - Analytics
 * ============================================================================
 */

import { Timeframe } from "../common";
import { Instrument } from "../market/market";

/* -------------------------------------------------------------------------- */
/*                             ENUMS                                          */
/* -------------------------------------------------------------------------- */

export enum TradeDirection {

    BUY = "BUY",

    SELL = "SELL"
}

export enum TradeStatus {

    PENDING = "PENDING",

    OPEN = "OPEN",

    PARTIALLY_CLOSED = "PARTIALLY_CLOSED",

    CLOSED = "CLOSED",

    CANCELLED = "CANCELLED",

    REJECTED = "REJECTED",

    EXPIRED = "EXPIRED"
}

export enum TradeType {

    MARKET = "MARKET",

    LIMIT = "LIMIT",

    STOP = "STOP",

    STOP_LIMIT = "STOP_LIMIT"
}

export enum TradeSource {

    MANUAL = "MANUAL",

    BOT = "BOT",

    COPY_TRADING = "COPY_TRADING",

    SIGNAL = "SIGNAL",

    API = "API",

    AI = "AI"
}

export enum TradeResult {

    WIN = "WIN",

    LOSS = "LOSS",

    BREAKEVEN = "BREAKEVEN",

    RUNNING = "RUNNING"
}

/* -------------------------------------------------------------------------- */
/*                          TRADE PRICING                                     */
/* -------------------------------------------------------------------------- */

export interface TradePricing {

    entryPrice: number;

    exitPrice?: number;

    currentPrice?: number;

    stopLoss?: number;

    takeProfit?: number;
}

/* -------------------------------------------------------------------------- */
/*                          TRADE SIZE                                        */
/* -------------------------------------------------------------------------- */

export interface TradeSize {

    quantity: number;

    volume: number;

    contractSize: number;

    leverage?: number;
}

/* -------------------------------------------------------------------------- */
/*                        TRADE PROFIT & LOSS                                 */
/* -------------------------------------------------------------------------- */

export interface TradeProfitLoss {

    realizedPnL: number;

    unrealizedPnL: number;

    grossProfit: number;

    grossLoss: number;

    netProfit: number;

    percentage: number;
}

/* -------------------------------------------------------------------------- */
/*                         TRADE FEES                                         */
/* -------------------------------------------------------------------------- */

export interface TradeFees {

    commission: number;

    spreadCost: number;

    swap: number;

    taxes: number;

    totalFees: number;
}

/* -------------------------------------------------------------------------- */
/*                        TRADE METADATA                                      */
/* -------------------------------------------------------------------------- */

export interface TradeMetadata {

    notes?: string;

    tags: string[];

    strategy?: string;

    aiGenerated: boolean;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                             TRADE                                          */
/* -------------------------------------------------------------------------- */

export interface Trade {

    id: string;

    accountId: string;

    instrument: Instrument;

    timeframe: Timeframe;

    direction: TradeDirection;

    type: TradeType;

    source: TradeSource;

    status: TradeStatus;

    result: TradeResult;

    pricing: TradePricing;

    size: TradeSize;

    profitLoss: TradeProfitLoss;

    fees: TradeFees;

    metadata: TradeMetadata;
}

/* -------------------------------------------------------------------------- */
/*                      TRADE SUMMARY                                         */
/* -------------------------------------------------------------------------- */

export interface TradeSummary {

    totalTrades: number;

    winningTrades: number;

    losingTrades: number;

    openTrades: number;

    closedTrades: number;

    totalProfit: number;

    totalLoss: number;

    winRate: number;
}

/* -------------------------------------------------------------------------- */
/*                          TRADE HISTORY                                     */
/* -------------------------------------------------------------------------- */

export interface TradeHistory {

    accountId: string;

    trades: Trade[];

    totalTrades: number;

    from: Date;

    to: Date;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      TRADE HISTORY FILTER                                  */
/* -------------------------------------------------------------------------- */

export interface TradeHistoryFilter {

    instrumentId?: string;

    timeframe?: Timeframe;

    direction?: TradeDirection;

    status?: TradeStatus;

    result?: TradeResult;

    from?: Date;

    to?: Date;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION SNAPSHOT                                      */
/* -------------------------------------------------------------------------- */

export interface PositionSnapshot {

    snapshotId: string;

    tradeId: string;

    timestamp: Date;

    currentPrice: number;

    unrealizedPnL: number;

    realizedPnL: number;

    quantity: number;

    marginUsed: number;

    equity: number;
}

/* -------------------------------------------------------------------------- */
/*                         TRADE JOURNAL                                      */
/* -------------------------------------------------------------------------- */

export interface TradeJournalEntry {

    id: string;

    tradeId: string;

    title: string;

    notes: string;

    emotions?: string;

    lessonsLearned?: string;

    rating?: number;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     PORTFOLIO EXPOSURE                                     */
/* -------------------------------------------------------------------------- */

export interface PortfolioExposure {

    totalExposure: number;

    longExposure: number;

    shortExposure: number;

    netExposure: number;

    marginUsed: number;

    availableMargin: number;
}

/* -------------------------------------------------------------------------- */
/*                     DRAWDOWN ANALYSIS                                      */
/* -------------------------------------------------------------------------- */

export interface DrawdownAnalysis {

    maximumDrawdown: number;

    currentDrawdown: number;

    drawdownPercentage: number;

    recoveryRequired: number;

    measuredAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       TRADE ANALYTICS                                      */
/* -------------------------------------------------------------------------- */

export interface TradeAnalytics {

    averageHoldingTime: number;

    averageWin: number;

    averageLoss: number;

    expectancy: number;

    winRate: number;

    lossRate: number;

    profitFactor: number;
}

/* -------------------------------------------------------------------------- */
/*                        BACKTEST RESULT                                     */
/* -------------------------------------------------------------------------- */

export interface BacktestResult {

    strategyId: string;

    strategyName: string;

    tradesExecuted: number;

    winningTrades: number;

    losingTrades: number;

    netProfit: number;

    maximumDrawdown: number;

    winRate: number;

    sharpeRatio: number;

    startedAt: Date;

    completedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       COPY TRADING                                         */
/* -------------------------------------------------------------------------- */

export interface CopyTrade {

    masterTradeId: string;

    followerTradeId: string;

    copiedVolume: number;

    copiedAt: Date;
}

export interface CopyTradingStatistics {

    copiedTrades: number;

    successfulCopies: number;

    failedCopies: number;

    totalProfit: number;

    winRate: number;
}

/* -------------------------------------------------------------------------- */
/*                   TRADE SYNCHRONIZATION                                    */
/* -------------------------------------------------------------------------- */

export interface TradeSynchronization {

    synchronized: boolean;

    lastSynchronization: Date;

    pendingTrades: number;

    failedSynchronizations: number;
}

/* -------------------------------------------------------------------------- */
/*                    REAL-TIME TRADE UPDATE                                  */
/* -------------------------------------------------------------------------- */

export interface RealTimeTradeUpdate {

    tradeId: string;

    status: TradeStatus;

    currentPrice: number;

    unrealizedPnL: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                      TRADE NOTIFICATION                                    */
/* -------------------------------------------------------------------------- */

export interface TradeNotification {

    id: string;

    tradeId: string;

    title: string;

    message: string;

    read: boolean;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      TRADE ALERT                                           */
/* -------------------------------------------------------------------------- */

export interface TradeAlert {

    id: string;

    tradeId: string;

    condition: string;

    triggered: boolean;

    createdAt: Date;

    triggeredAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                       TRADE SESSION                                        */
/* -------------------------------------------------------------------------- */

export interface TradingSession {

    id: string;

    accountId: string;

    startedAt: Date;

    endedAt?: Date;

    tradesExecuted: number;

    totalProfit: number;

    totalLoss: number;
}

/* -------------------------------------------------------------------------- */
/*                      PORTFOLIO SUMMARY                                     */
/* -------------------------------------------------------------------------- */

export interface PortfolioSummary {

    totalBalance: number;

    totalEquity: number;

    availableMargin: number;

    usedMargin: number;

    floatingPnL: number;

    realizedPnL: number;

    openPositions: number;

    closedPositions: number;
}

/* -------------------------------------------------------------------------- */
/*                     DEFAULT CONFIGURATION                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_TRADE_DIRECTION = TradeDirection.BUY;

export const DEFAULT_TRADE_TYPE = TradeType.MARKET;

export const DEFAULT_TRADE_STATUS = TradeStatus.PENDING;

export const DEFAULT_TRADE_SOURCE = TradeSource.MANUAL;

export const DEFAULT_TRADE_RESULT = TradeResult.RUNNING;

/* -------------------------------------------------------------------------- */
/*                     DEFAULT TRADE                                          */
/* -------------------------------------------------------------------------- */

export const DEFAULT_TRADE: Trade = {

    id: "",

    accountId: "",

    instrument: {} as Instrument,

    timeframe: Timeframe.M1,

    direction: DEFAULT_TRADE_DIRECTION,

    type: DEFAULT_TRADE_TYPE,

    source: DEFAULT_TRADE_SOURCE,

    status: DEFAULT_TRADE_STATUS,

    result: DEFAULT_TRADE_RESULT,

    pricing: {

        entryPrice: 0,

        currentPrice: 0
    },

    size: {

        quantity: 0,

        volume: 0,

        contractSize: 1
    },

    profitLoss: {

        realizedPnL: 0,

        unrealizedPnL: 0,

        grossProfit: 0,

        grossLoss: 0,

        netProfit: 0,

        percentage: 0
    },

    fees: {

        commission: 0,

        spreadCost: 0,

        swap: 0,

        taxes: 0,

        totalFees: 0
    },

    metadata: {

        tags: [],

        aiGenerated: false,

        createdAt: new Date(),

        updatedAt: new Date()
    }
};

/* -------------------------------------------------------------------------- */
/*                     REGISTRY                                               */
/* -------------------------------------------------------------------------- */

export interface TradeRegistry {

    activeTrades: Trade[];

    closedTrades: Trade[];

    pendingTrades: Trade[];

    cancelledTrades: Trade[];
}

export interface TradeDefinition {

    tradeType: TradeType;

    description: string;

    supportsStopLoss: boolean;

    supportsTakeProfit: boolean;

    supportsPartialClose: boolean;

    supportsTrailingStop: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     FACTORY OPTIONS                                        */
/* -------------------------------------------------------------------------- */

export interface CreateTradeOptions {

    accountId: string;

    instrument: Instrument;

    direction: TradeDirection;

    type: TradeType;

    quantity: number;

    entryPrice?: number;

    stopLoss?: number;

    takeProfit?: number;
}

export interface UpdateTradeOptions {

    tradeId: string;

    stopLoss?: number;

    takeProfit?: number;

    quantity?: number;

    notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                     COLLECTION TYPES                                       */
/* -------------------------------------------------------------------------- */

export interface TradeCollection {

    items: Trade[];

    total: number;
}

export interface TradeExecutionCollection {

    items: TradeExecution[];

    total: number;
}

export interface TradeSignalCollection {

    items: TradeSignal[];

    total: number;
}

export interface TradeAlertCollection {

    items: TradeAlert[];

    total: number;
}

export interface TradeNotificationCollection {

    items: TradeNotification[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                     LOOKUP MAPS                                            */
/* -------------------------------------------------------------------------- */

export type TradeMap = Record<string, Trade>;

export type TradeExecutionMap = Record<string, TradeExecution>;

export type TradeSignalMap = Record<string, TradeSignal>;

export type TradeAlertMap = Record<string, TradeAlert>;

export type TradeJournalMap = Record<string, TradeJournalEntry>;

export type PositionSnapshotMap = Record<string, PositionSnapshot>;

/* -------------------------------------------------------------------------- */
/*                     CALLBACK TYPES                                         */
/* -------------------------------------------------------------------------- */

export type TradeCreatedHandler = (

    trade: Trade

) => void;

export type TradeUpdatedHandler = (

    trade: Trade

) => void;

export type TradeClosedHandler = (

    trade: Trade

) => void;

export type TradeExecutionHandler = (

    execution: TradeExecution

) => void;

export type TradeSignalHandler = (

    signal: TradeSignal

) => void;

export type TradeAlertHandler = (

    alert: TradeAlert

) => void;

export type TradeNotificationHandler = (

    notification: TradeNotification

) => void;

export type TradeErrorHandler = (

    error: Error

) => void;

/* -------------------------------------------------------------------------- */
/*                     READONLY TYPES                                         */
/* -------------------------------------------------------------------------- */

export type ReadonlyTrade = Readonly<Trade>;

export type ReadonlyTradeExecution = Readonly<TradeExecution>;

export type ReadonlyTradeSignal = Readonly<TradeSignal>;

export type ReadonlyTradeHistory = Readonly<TradeHistory>;

export type ReadonlyTradeAlert = Readonly<TradeAlert>;

export type ReadonlyTradeNotification = Readonly<TradeNotification>;

export type ReadonlyPortfolioSummary = Readonly<PortfolioSummary>;

export type ReadonlyTradeAnalytics = Readonly<TradeAnalytics>;

/* -------------------------------------------------------------------------- */
/*                     STATISTICS                                             */
/* -------------------------------------------------------------------------- */

export interface TradingStatistics {

    totalTrades: number;

    openTrades: number;

    closedTrades: number;

    winningTrades: number;

    losingTrades: number;

    cancelledTrades: number;

    winRate: number;

    lossRate: number;

    averageProfit: number;

    averageLoss: number;

    largestWin: number;

    largestLoss: number;

    profitFactor: number;

    expectancy: number;
}

/* -------------------------------------------------------------------------- */
/*                     CAPABILITIES                                           */
/* -------------------------------------------------------------------------- */

export interface TradingCapabilities {

    supportsMarketOrders: boolean;

    supportsLimitOrders: boolean;

    supportsStopOrders: boolean;

    supportsTrailingStops: boolean;

    supportsPartialClose: boolean;

    supportsCopyTrading: boolean;

    supportsBacktesting: boolean;

    supportsAITrading: boolean;

    supportsTradingBots: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      IDENTIFIER                                            */
/* -------------------------------------------------------------------------- */

export interface TradeIdentifier {

    tradeId: string;

    accountId: string;

    instrumentId: string;
}

/* -------------------------------------------------------------------------- */
/*                      VERSION                                               */
/* -------------------------------------------------------------------------- */

export interface TradingVersion {

    version: string;

    build: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         END OF FILE                                        */
/* -------------------------------------------------------------------------- */