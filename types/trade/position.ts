/**
 * ============================================================================
 * POSITION TYPES
 * ============================================================================
 * Professional Trading Position Models
 *
 * Used by:
 * - Trading Engine
 * - Portfolio
 * - Margin Engine
 * - Risk Management
 * - AI Trading
 * ============================================================================
 */

import { Instrument } from "../market/market";
import { Timeframe } from "../common";
import {
    TradeDirection,
    TradeStatus
} from "./trade";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum PositionStatus {

    OPEN = "OPEN",

    PARTIALLY_CLOSED = "PARTIALLY_CLOSED",

    CLOSED = "CLOSED",

    LIQUIDATED = "LIQUIDATED"
}

export enum PositionType {

    LONG = "LONG",

    SHORT = "SHORT"
}

export enum PositionSource {

    MANUAL = "MANUAL",

    BOT = "BOT",

    COPY_TRADING = "COPY_TRADING",

    API = "API",

    AI = "AI"
}

/* -------------------------------------------------------------------------- */
/*                          POSITION PRICE                                    */
/* -------------------------------------------------------------------------- */

export interface PositionPrice {

    entryPrice: number;

    currentPrice: number;

    markPrice: number;

    liquidationPrice?: number;

    breakEvenPrice?: number;
}

/* -------------------------------------------------------------------------- */
/*                         POSITION SIZE                                      */
/* -------------------------------------------------------------------------- */

export interface PositionSize {

    quantity: number;

    volume: number;

    contractSize: number;

    leverage: number;
}

/* -------------------------------------------------------------------------- */
/*                          POSITION PNL                                      */
/* -------------------------------------------------------------------------- */

export interface PositionPnL {

    unrealizedPnL: number;

    realizedPnL: number;

    dailyPnL: number;

    percentage: number;
}

/* -------------------------------------------------------------------------- */
/*                         POSITION RISK                                      */
/* -------------------------------------------------------------------------- */

export interface PositionRisk {

    stopLoss?: number;

    takeProfit?: number;

    riskAmount: number;

    rewardAmount: number;

    riskRewardRatio: number;
}

/* -------------------------------------------------------------------------- */
/*                         POSITION MARGIN                                    */
/* -------------------------------------------------------------------------- */

export interface PositionMargin {

    initialMargin: number;

    maintenanceMargin: number;

    usedMargin: number;

    freeMargin: number;

    marginLevel: number;
}

/* -------------------------------------------------------------------------- */
/*                           POSITION                                         */
/* -------------------------------------------------------------------------- */

export interface Position {

    id: string;

    tradeId: string;

    accountId: string;

    instrument: Instrument;

    timeframe: Timeframe;

    direction: TradeDirection;

    type: PositionType;

    source: PositionSource;

    status: PositionStatus;

    tradeStatus: TradeStatus;

    price: PositionPrice;

    size: PositionSize;

    pnl: PositionPnL;

    risk: PositionRisk;

    margin: PositionMargin;

    openedAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION SUMMARY                                       */
/* -------------------------------------------------------------------------- */

export interface PositionSummary {

    totalPositions: number;

    openPositions: number;

    closedPositions: number;

    profitablePositions: number;

    losingPositions: number;

    totalUnrealizedPnL: number;

    totalRealizedPnL: number;
}
/* -------------------------------------------------------------------------- */
/*                      POSITION LIFECYCLE                                    */
/* -------------------------------------------------------------------------- */

export interface PositionLifecycle {

    openedAt: Date;

    lastModifiedAt?: Date;

    partiallyClosedAt?: Date;

    closedAt?: Date;

    liquidationTime?: Date;

    durationMilliseconds?: number;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION EXECUTION                                     */
/* -------------------------------------------------------------------------- */

export interface PositionExecution {

    executionId: string;

    positionId: string;

    executedPrice: number;

    executedQuantity: number;

    slippage: number;

    commission: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION SNAPSHOT                                      */
/* -------------------------------------------------------------------------- */

export interface PositionSnapshot {

    snapshotId: string;

    positionId: string;

    timestamp: Date;

    marketPrice: number;

    unrealizedPnL: number;

    realizedPnL: number;

    equity: number;

    marginLevel: number;
}

/* -------------------------------------------------------------------------- */
/*                      POSITION ANALYTICS                                    */
/* -------------------------------------------------------------------------- */

export interface PositionAnalytics {

    averageEntryPrice: number;

    averageExitPrice?: number;

    maximumProfit: number;

    maximumLoss: number;

    averageHoldingTime: number;

    volatilityExposure: number;

    profitFactor: number;
}

/* -------------------------------------------------------------------------- */
/*                       POSITION ALERT                                       */
/* -------------------------------------------------------------------------- */

export enum PositionAlertType {

    STOP_LOSS = "STOP_LOSS",

    TAKE_PROFIT = "TAKE_PROFIT",

    MARGIN_CALL = "MARGIN_CALL",

    LIQUIDATION = "LIQUIDATION",

    PRICE_TARGET = "PRICE_TARGET",

    CUSTOM = "CUSTOM"
}

export interface PositionAlert {

    id: string;

    positionId: string;

    type: PositionAlertType;

    message: string;

    triggered: boolean;

    createdAt: Date;

    triggeredAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION HEDGING                                       */
/* -------------------------------------------------------------------------- */

export interface HedgedPosition {

    primaryPositionId: string;

    hedgePositionId: string;

    hedgeRatio: number;

    hedgeCost: number;

    effectiveness: number;
}

/* -------------------------------------------------------------------------- */
/*                    POSITION SCALING                                        */
/* -------------------------------------------------------------------------- */

export interface PositionScaleOperation {

    id: string;

    positionId: string;

    quantity: number;

    price: number;

    increasePosition: boolean;

    timestamp: Date;
}

export interface PositionScaling {

    operations: PositionScaleOperation[];

    totalScaledIn: number;

    totalScaledOut: number;
}

/* -------------------------------------------------------------------------- */
/*                   AI POSITION ANALYSIS                                     */
/* -------------------------------------------------------------------------- */

export interface AIPositionAnalysis {

    confidence: number;

    recommendation: string;

    predictedPnL: number;

    exitProbability: number;

    suggestedStopLoss?: number;

    suggestedTakeProfit?: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    POSITION VALIDATION                                     */
/* -------------------------------------------------------------------------- */

export interface PositionValidation {

    valid: boolean;

    errors: string[];

    warnings: string[];

    validatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    REAL-TIME POSITION UPDATE                               */
/* -------------------------------------------------------------------------- */

export interface RealTimePositionUpdate {

    positionId: string;

    currentPrice: number;

    unrealizedPnL: number;

    marginLevel: number;

    status: PositionStatus;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                      POSITION PERFORMANCE                                  */
/* -------------------------------------------------------------------------- */

export interface PositionPerformance {

    returnPercentage: number;

    annualizedReturn?: number;

    maximumDrawdown: number;

    recoveryFactor: number;

    sharpeRatio?: number;

    sortinoRatio?: number;
}
/* -------------------------------------------------------------------------- */
/*                      POSITION HISTORY                                      */
/* -------------------------------------------------------------------------- */

export interface PositionHistory {

    accountId: string;

    positions: Position[];

    totalPositions: number;

    openedPositions: number;

    closedPositions: number;

    generatedAt: Date;
}

export interface PositionHistoryFilter {

    instrumentId?: string;

    status?: PositionStatus;

    type?: PositionType;

    from?: Date;

    to?: Date;
}

/* -------------------------------------------------------------------------- */
/*                      PORTFOLIO EXPOSURE                                    */
/* -------------------------------------------------------------------------- */

export interface PositionExposure {

    instrumentId: string;

    longExposure: number;

    shortExposure: number;

    netExposure: number;

    exposurePercentage: number;
}

export interface PortfolioExposureAnalysis {

    totalExposure: number;

    exposures: PositionExposure[];

    largestExposure: number;

    diversificationScore: number;
}

/* -------------------------------------------------------------------------- */
/*                       MARGIN ANALYSIS                                      */
/* -------------------------------------------------------------------------- */

export interface MarginAnalysis {

    totalMarginUsed: number;

    availableMargin: number;

    freeMargin: number;

    marginLevel: number;

    marginCallRisk: boolean;

    liquidationRisk: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     LIQUIDATION ANALYSIS                                   */
/* -------------------------------------------------------------------------- */

export interface LiquidationAnalysis {

    liquidationPrice: number;

    distanceToLiquidation: number;

    liquidationPercentage: number;

    estimatedLoss: number;

    highRisk: boolean;
}

/* -------------------------------------------------------------------------- */
/*                     FUNDING INFORMATION                                    */
/* -------------------------------------------------------------------------- */

export interface FundingInformation {

    fundingRate: number;

    nextFundingTime: Date;

    estimatedFundingFee: number;

    accumulatedFunding: number;
}

/* -------------------------------------------------------------------------- */
/*                  POSITION SYNCHRONIZATION                                  */
/* -------------------------------------------------------------------------- */

export interface PositionSynchronization {

    synchronized: boolean;

    lastSynchronization: Date;

    pendingUpdates: number;

    synchronizationErrors: number;
}

/* -------------------------------------------------------------------------- */
/*                    COPY TRADING POSITION                                   */
/* -------------------------------------------------------------------------- */

export interface CopyTradingPosition {

    masterPositionId: string;

    followerPositionId: string;

    copiedVolume: number;

    proportionalRatio: number;

    copiedAt: Date;
}

export interface CopyPositionStatistics {

    copiedPositions: number;

    activeCopiedPositions: number;

    closedCopiedPositions: number;

    totalProfit: number;

    winRate: number;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION NOTIFICATION                                  */
/* -------------------------------------------------------------------------- */

export interface PositionNotification {

    id: string;

    positionId: string;

    title: string;

    message: string;

    read: boolean;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     BACKTEST POSITION RESULT                               */
/* -------------------------------------------------------------------------- */

export interface PositionBacktestResult {

    strategyId: string;

    positionsOpened: number;

    positionsClosed: number;

    winningPositions: number;

    losingPositions: number;

    netProfit: number;

    maximumDrawdown: number;

    averageHoldingTime: number;

    completedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     MULTI-POSITION ANALYTICS                               */
/* -------------------------------------------------------------------------- */

export interface MultiPositionAnalytics {

    totalPositions: number;

    profitablePositions: number;

    losingPositions: number;

    averageReturn: number;

    averageHoldingTime: number;

    portfolioVolatility: number;

    portfolioSharpeRatio: number;
}

/* -------------------------------------------------------------------------- */
/*                      POSITION TIMELINE                                     */
/* -------------------------------------------------------------------------- */

export interface PositionTimelineEvent {

    id: string;

    positionId: string;

    event: string;

    description: string;

    timestamp: Date;
}

export interface PositionTimeline {

    positionId: string;

    events: PositionTimelineEvent[];
}

/* -------------------------------------------------------------------------- */
/*                     POSITION TAG                                           */
/* -------------------------------------------------------------------------- */

export interface PositionTag {

    id: string;

    name: string;

    color: string;
}

export interface PositionClassification {

    tags: PositionTag[];

    category: string;

    strategy?: string;
}

/* -------------------------------------------------------------------------- */
/*                     POSITION HEALTH                                        */
/* -------------------------------------------------------------------------- */

export interface PositionHealth {

    positionId: string;

    healthy: boolean;

    riskScore: number;

    marginHealth: number;

    lastChecked: Date;
}
/* -------------------------------------------------------------------------- */
/*                     DEFAULT CONFIGURATION                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_POSITION_STATUS = PositionStatus.OPEN;

export const DEFAULT_POSITION_TYPE = PositionType.LONG;

export const DEFAULT_POSITION_SOURCE = PositionSource.MANUAL;

/* -------------------------------------------------------------------------- */
/*                     DEFAULT POSITION                                       */
/* -------------------------------------------------------------------------- */

export const DEFAULT_POSITION: Position = {

    id: "",

    tradeId: "",

    accountId: "",

    instrument: {} as Instrument,

    timeframe: Timeframe.M1,

    direction: TradeDirection.BUY,

    type: DEFAULT_POSITION_TYPE,

    source: DEFAULT_POSITION_SOURCE,

    status: DEFAULT_POSITION_STATUS,

    tradeStatus: TradeStatus.OPEN,

    price: {

        entryPrice: 0,

        currentPrice: 0,

        markPrice: 0
    },

    size: {

        quantity: 0,

        volume: 0,

        contractSize: 1,

        leverage: 1
    },

    pnl: {

        unrealizedPnL: 0,

        realizedPnL: 0,

        dailyPnL: 0,

        percentage: 0
    },

    risk: {

        riskAmount: 0,

        rewardAmount: 0,

        riskRewardRatio: 0
    },

    margin: {

        initialMargin: 0,

        maintenanceMargin: 0,

        usedMargin: 0,

        freeMargin: 0,

        marginLevel: 0
    },

    openedAt: new Date(),

    updatedAt: new Date()
};

/* -------------------------------------------------------------------------- */
/*                        REGISTRY                                            */
/* -------------------------------------------------------------------------- */

export interface PositionRegistry {

    openPositions: Position[];

    closedPositions: Position[];

    liquidatedPositions: Position[];

    archivedPositions: Position[];
}

export interface PositionDefinition {

    positionType: PositionType;

    description: string;

    supportsHedging: boolean;

    supportsScaling: boolean;

    supportsPartialClose: boolean;

    supportsMarginTrading: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        FACTORY OPTIONS                                     */
/* -------------------------------------------------------------------------- */

export interface CreatePositionOptions {

    tradeId: string;

    accountId: string;

    instrument: Instrument;

    direction: TradeDirection;

    quantity: number;

    entryPrice: number;

    leverage?: number;

    stopLoss?: number;

    takeProfit?: number;
}

export interface UpdatePositionOptions {

    positionId: string;

    stopLoss?: number;

    takeProfit?: number;

    quantity?: number;
}

/* -------------------------------------------------------------------------- */
/*                        COLLECTIONS                                         */
/* -------------------------------------------------------------------------- */

export interface PositionCollection {

    items: Position[];

    total: number;
}

export interface PositionSnapshotCollection {

    items: PositionSnapshot[];

    total: number;
}

export interface PositionAlertCollection {

    items: PositionAlert[];

    total: number;
}

export interface PositionNotificationCollection {

    items: PositionNotification[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                          LOOKUP MAPS                                       */
/* -------------------------------------------------------------------------- */

export type PositionMap = Record<string, Position>;

export type PositionSnapshotMap = Record<string, PositionSnapshot>;

export type PositionAlertMap = Record<string, PositionAlert>;

export type PositionNotificationMap =
    Record<string, PositionNotification>;

export type PositionTimelineMap =
    Record<string, PositionTimeline>;

/* -------------------------------------------------------------------------- */
/*                        CALLBACK TYPES                                      */
/* -------------------------------------------------------------------------- */

export type PositionOpenedHandler = (

    position: Position

) => void;

export type PositionUpdatedHandler = (

    position: Position

) => void;

export type PositionClosedHandler = (

    position: Position

) => void;

export type PositionLiquidatedHandler = (

    position: Position

) => void;

export type PositionAlertHandler = (

    alert: PositionAlert

) => void;

export type PositionNotificationHandler = (

    notification: PositionNotification

) => void;

export type PositionErrorHandler = (

    error: Error

) => void;

/* -------------------------------------------------------------------------- */
/*                       READONLY TYPES                                       */
/* -------------------------------------------------------------------------- */

export type ReadonlyPosition =
    Readonly<Position>;

export type ReadonlyPositionSnapshot =
    Readonly<PositionSnapshot>;

export type ReadonlyPositionAlert =
    Readonly<PositionAlert>;

export type ReadonlyPositionAnalytics =
    Readonly<PositionAnalytics>;

export type ReadonlyMarginAnalysis =
    Readonly<MarginAnalysis>;

export type ReadonlyLiquidationAnalysis =
    Readonly<LiquidationAnalysis>;

export type ReadonlyPortfolioExposureAnalysis =
    Readonly<PortfolioExposureAnalysis>;

/* -------------------------------------------------------------------------- */
/*                        STATISTICS                                          */
/* -------------------------------------------------------------------------- */

export interface PositionStatistics {

    totalPositions: number;

    activePositions: number;

    closedPositions: number;

    liquidatedPositions: number;

    profitablePositions: number;

    losingPositions: number;

    averageHoldingTime: number;

    averageProfit: number;

    averageLoss: number;

    averageLeverage: number;

    totalExposure: number;
}

/* -------------------------------------------------------------------------- */
/*                      CAPABILITIES                                          */
/* -------------------------------------------------------------------------- */

export interface PositionCapabilities {

    supportsLeverage: boolean;

    supportsHedging: boolean;

    supportsScaling: boolean;

    supportsPartialClose: boolean;

    supportsTrailingStop: boolean;

    supportsCopyTrading: boolean;

    supportsRealtimeUpdates: boolean;

    supportsAIAnalysis: boolean;

    supportsBacktesting: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       IDENTIFIER                                           */
/* -------------------------------------------------------------------------- */

export interface PositionIdentifier {

    positionId: string;

    tradeId: string;

    accountId: string;

    instrumentId: string;
}

/* -------------------------------------------------------------------------- */
/*                          VERSION                                           */
/* -------------------------------------------------------------------------- */

export interface PositionVersion {

    version: string;

    build: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          END OF FILE                                       */
/* -------------------------------------------------------------------------- */