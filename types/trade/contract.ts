/**
 * ============================================================================
 * CONTRACT TYPES
 * ============================================================================
 * Financial Contract Models
 *
 * Used by:
 * - Trading Engine
 * - Contract Engine
 * - Pricing Engine
 * - Settlement Engine
 * - AI Engine
 * ============================================================================
 */

import { Instrument } from "../market/market";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum ContractCategory {

    OPTIONS = "OPTIONS",

    MULTIPLIER = "MULTIPLIER",

    ACCUMULATOR = "ACCUMULATOR",

    FOREX = "FOREX",

    CFD = "CFD",

    FUTURES = "FUTURES",

    CRYPTO = "CRYPTO",

    STOCK = "STOCK",

    SYNTHETIC = "SYNTHETIC"
}

export enum ContractType {

    RISE_FALL = "RISE_FALL",

    HIGHER_LOWER = "HIGHER_LOWER",

    TOUCH_NO_TOUCH = "TOUCH_NO_TOUCH",

    IN_OUT = "IN_OUT",

    MULTIPLIER = "MULTIPLIER",

    ACCUMULATOR = "ACCUMULATOR",

    VANILLA_CALL = "VANILLA_CALL",

    VANILLA_PUT = "VANILLA_PUT",

    DIGITAL_OPTION = "DIGITAL_OPTION"
}

export enum ContractStatus {

    CREATED = "CREATED",

    PENDING = "PENDING",

    ACTIVE = "ACTIVE",

    EXPIRED = "EXPIRED",

    SETTLED = "SETTLED",

    CANCELLED = "CANCELLED",

    VOID = "VOID"
}

export enum SettlementType {

    CASH = "CASH",

    PHYSICAL = "PHYSICAL"
}

/* -------------------------------------------------------------------------- */
/*                       CONTRACT PRICE                                       */
/* -------------------------------------------------------------------------- */

export interface ContractPrice {

    entryPrice: number;

    currentPrice: number;

    exitPrice?: number;

    settlementPrice?: number;
}

/* -------------------------------------------------------------------------- */
/*                     CONTRACT PAYOUT                                        */
/* -------------------------------------------------------------------------- */

export interface ContractPayout {

    stake: number;

    payout: number;

    profit: number;

    returnPercentage: number;

    currency: string;
}

/* -------------------------------------------------------------------------- */
/*                    CONTRACT DURATION                                       */
/* -------------------------------------------------------------------------- */

export interface ContractDuration {

    startTime: Date;

    expiryTime: Date;

    durationInSeconds: number;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT CONDITIONS                                   */
/* -------------------------------------------------------------------------- */

export interface ContractConditions {

    barrier?: number;

    upperBarrier?: number;

    lowerBarrier?: number;

    strikePrice?: number;

    targetPrice?: number;
}

/* -------------------------------------------------------------------------- */
/*                       CONTRACT                                             */
/* -------------------------------------------------------------------------- */

export interface Contract {

    id: string;

    accountId: string;

    instrument: Instrument;

    category: ContractCategory;

    type: ContractType;

    status: ContractStatus;

    settlement: SettlementType;

    price: ContractPrice;

    payout: ContractPayout;

    duration: ContractDuration;

    conditions: ContractConditions;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     CONTRACT SUMMARY                                       */
/* -------------------------------------------------------------------------- */

export interface ContractSummary {

    totalContracts: number;

    activeContracts: number;

    settledContracts: number;

    expiredContracts: number;

    cancelledContracts: number;
}
/* -------------------------------------------------------------------------- */
/*                      CONTRACT LIFECYCLE                                    */
/* -------------------------------------------------------------------------- */

export interface ContractLifecycle {

    purchasedAt: Date;

    activatedAt?: Date;

    startedAt?: Date;

    expiredAt?: Date;

    settledAt?: Date;

    cancelledAt?: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT SETTLEMENT                                   */
/* -------------------------------------------------------------------------- */

export enum SettlementStatus {

    PENDING = "PENDING",

    PROCESSING = "PROCESSING",

    COMPLETED = "COMPLETED",

    FAILED = "FAILED",

    REVERSED = "REVERSED"
}

export interface ContractSettlement {

    settlementId: string;

    contractId: string;

    status: SettlementStatus;

    settlementPrice: number;

    payout: number;

    profit: number;

    fees: number;

    currency: string;

    settledAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                        CONTRACT EXPIRY                                     */
/* -------------------------------------------------------------------------- */

export enum ExpiryType {

    FIXED_TIME = "FIXED_TIME",

    TICK = "TICK",

    DURATION = "DURATION",

    END_OF_DAY = "END_OF_DAY"
}

export interface ContractExpiry {

    type: ExpiryType;

    expiryTime: Date;

    remainingSeconds: number;

    expired: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      BARRIER MONITORING                                    */
/* -------------------------------------------------------------------------- */

export interface BarrierState {

    currentPrice: number;

    barrierPrice: number;

    touched: boolean;

    crossed: boolean;

    timestamp: Date;
}

export interface BarrierMonitoring {

    upperBarrier?: BarrierState;

    lowerBarrier?: BarrierState;

    lastUpdated: Date;
}

/* -------------------------------------------------------------------------- */
/*                       CONTRACT EVENTS                                      */
/* -------------------------------------------------------------------------- */

export enum ContractEventType {

    PURCHASED = "PURCHASED",

    ACTIVATED = "ACTIVATED",

    PRICE_UPDATED = "PRICE_UPDATED",

    BARRIER_TOUCHED = "BARRIER_TOUCHED",

    EXPIRED = "EXPIRED",

    WON = "WON",

    LOST = "LOST",

    SETTLED = "SETTLED",

    CANCELLED = "CANCELLED"
}

export interface ContractEvent {

    id: string;

    contractId: string;

    type: ContractEventType;

    description: string;

    timestamp: Date;
}

export interface ContractTimeline {

    contractId: string;

    events: ContractEvent[];
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT VALIDATION                                   */
/* -------------------------------------------------------------------------- */

export interface ContractValidation {

    valid: boolean;

    errors: string[];

    warnings: string[];

    validatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT EXECUTION                                    */
/* -------------------------------------------------------------------------- */

export interface ContractExecution {

    executionId: string;

    contractId: string;

    executedPrice: number;

    executionLatency: number;

    slippage: number;

    executedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT ANALYTICS                                    */
/* -------------------------------------------------------------------------- */

export interface ContractAnalytics {

    expectedReturn: number;

    probabilityOfProfit: number;

    maximumRisk: number;

    maximumReward: number;

    breakEvenPrice?: number;

    volatility: number;
}

/* -------------------------------------------------------------------------- */
/*                      AI CONTRACT ANALYSIS                                  */
/* -------------------------------------------------------------------------- */

export enum AIContractRecommendation {

    BUY = "BUY",

    WAIT = "WAIT",

    AVOID = "AVOID"
}

export interface AIContractAnalysis {

    recommendation: AIContractRecommendation;

    confidence: number;

    expectedProfit: number;

    expectedLoss: number;

    successProbability: number;

    explanation: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    REAL-TIME CONTRACT UPDATE                               */
/* -------------------------------------------------------------------------- */

export interface RealTimeContractUpdate {

    contractId: string;

    currentPrice: number;

    currentProfit: number;

    status: ContractStatus;

    remainingSeconds: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT NOTIFICATION                                 */
/* -------------------------------------------------------------------------- */

export interface ContractNotification {

    id: string;

    contractId: string;

    title: string;

    message: string;

    read: boolean;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       CONTRACT HISTORY                                     */
/* -------------------------------------------------------------------------- */

export interface ContractHistory {

    accountId: string;

    contracts: Contract[];

    totalContracts: number;

    activeContracts: number;

    settledContracts: number;

    expiredContracts: number;

    generatedAt: Date;
}

export interface ContractHistoryFilter {

    category?: ContractCategory;

    type?: ContractType;

    status?: ContractStatus;

    from?: Date;

    to?: Date;
}

/* -------------------------------------------------------------------------- */
/*                     CONTRACT PERFORMANCE                                   */
/* -------------------------------------------------------------------------- */

export interface ContractPerformance {

    totalStake: number;

    totalPayout: number;

    totalProfit: number;

    roi: number;

    averageProfit: number;

    averageLoss: number;

    averageDuration: number;
}

/* -------------------------------------------------------------------------- */
/*                      WIN / LOSS STATISTICS                                 */
/* -------------------------------------------------------------------------- */

export interface ContractWinLossStatistics {

    totalContracts: number;

    winningContracts: number;

    losingContracts: number;

    breakEvenContracts: number;

    winRate: number;

    lossRate: number;

    longestWinningStreak: number;

    longestLosingStreak: number;
}

/* -------------------------------------------------------------------------- */
/*                        CONTRACT PORTFOLIO                                  */
/* -------------------------------------------------------------------------- */

export interface ContractPortfolio {

    accountId: string;

    activeContracts: Contract[];

    completedContracts: Contract[];

    totalExposure: number;

    unrealizedProfit: number;

    realizedProfit: number;

    totalStake: number;

    portfolioValue: number;
}

/* -------------------------------------------------------------------------- */
/*                     MULTI CONTRACT ANALYTICS                              */
/* -------------------------------------------------------------------------- */

export interface MultiContractAnalytics {

    averageROI: number;

    averageStake: number;

    averagePayout: number;

    averageHoldingTime: number;

    bestPerformingContract: string;

    worstPerformingContract: string;

    portfolioVolatility: number;

    successProbability: number;
}

/* -------------------------------------------------------------------------- */
/*                     COPY TRADING CONTRACT                                  */
/* -------------------------------------------------------------------------- */

export interface CopyTradingContract {

    masterAccountId: string;

    followerAccountId: string;

    masterContractId: string;

    followerContractId: string;

    copiedStake: number;

    copiedAt: Date;
}

export interface CopyTradingStatistics {

    copiedContracts: number;

    activeCopiedContracts: number;

    completedCopiedContracts: number;

    copySuccessRate: number;

    totalProfit: number;
}

/* -------------------------------------------------------------------------- */
/*                    CONTRACT SYNCHRONIZATION                                */
/* -------------------------------------------------------------------------- */

export interface ContractSynchronization {

    synchronized: boolean;

    lastSynchronization: Date;

    pendingUpdates: number;

    failedUpdates: number;
}

/* -------------------------------------------------------------------------- */
/*                      CONTRACT BACKTEST                                     */
/* -------------------------------------------------------------------------- */

export interface ContractBacktestResult {

    strategyId: string;

    testedContracts: number;

    winningContracts: number;

    losingContracts: number;

    netProfit: number;

    roi: number;

    maximumDrawdown: number;

    completedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         CONTRACT ALERT                                     */
/* -------------------------------------------------------------------------- */

export enum ContractAlertType {

    EXPIRING_SOON = "EXPIRING_SOON",

    TARGET_REACHED = "TARGET_REACHED",

    BARRIER_TOUCHED = "BARRIER_TOUCHED",

    SETTLED = "SETTLED",

    WON = "WON",

    LOST = "LOST",

    CUSTOM = "CUSTOM"
}

export interface ContractAlert {

    id: string;

    contractId: string;

    type: ContractAlertType;

    title: string;

    message: string;

    triggered: boolean;

    createdAt: Date;

    triggeredAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                       CONTRACT TAGGING                                     */
/* -------------------------------------------------------------------------- */

export interface ContractTag {

    id: string;

    name: string;

    color: string;
}

export interface ContractClassification {

    category: ContractCategory;

    tags: ContractTag[];

    strategy?: string;

    notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                    CONTRACT REPORT                                         */
/* -------------------------------------------------------------------------- */

export interface ContractReport {

    reportId: string;

    accountId: string;

    totalContracts: number;

    winningContracts: number;

    losingContracts: number;

    totalStake: number;

    totalPayout: number;

    totalProfit: number;

    roi: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                    CONTRACT HEALTH                                         */
/* -------------------------------------------------------------------------- */

export interface ContractHealth {

    contractId: string;

    healthy: boolean;

    executionScore: number;

    pricingScore: number;

    synchronizationScore: number;

    lastChecked: Date;
}

/* -------------------------------------------------------------------------- */
/*                      DEFAULT CONFIGURATION                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CONTRACT_CATEGORY = ContractCategory.OPTIONS;

export const DEFAULT_CONTRACT_TYPE = ContractType.RISE_FALL;

export const DEFAULT_CONTRACT_STATUS = ContractStatus.CREATED;

export const DEFAULT_SETTLEMENT_TYPE = SettlementType.CASH;

export const DEFAULT_EXPIRY_TYPE = ExpiryType.DURATION;

/* -------------------------------------------------------------------------- */
/*                      DEFAULT CONTRACT                                      */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CONTRACT: Contract = {

    id: "",

    accountId: "",

    instrument: {} as Instrument,

    category: DEFAULT_CONTRACT_CATEGORY,

    type: DEFAULT_CONTRACT_TYPE,

    status: DEFAULT_CONTRACT_STATUS,

    settlement: DEFAULT_SETTLEMENT_TYPE,

    price: {

        entryPrice: 0,

        currentPrice: 0

    },

    payout: {

        stake: 0,

        payout: 0,

        profit: 0,

        returnPercentage: 0,

        currency: "USD"

    },

    duration: {

        startTime: new Date(),

        expiryTime: new Date(),

        durationInSeconds: 0

    },

    conditions: {},

    createdAt: new Date(),

    updatedAt: new Date()

};

/* -------------------------------------------------------------------------- */
/*                        REGISTRY                                            */
/* -------------------------------------------------------------------------- */

export interface ContractRegistry {

    activeContracts: Contract[];

    pendingContracts: Contract[];

    settledContracts: Contract[];

    expiredContracts: Contract[];

    cancelledContracts: Contract[];

}

/* -------------------------------------------------------------------------- */
/*                    CONTRACT DEFINITION                                     */
/* -------------------------------------------------------------------------- */

export interface ContractDefinition {

    id: string;

    name: string;

    category: ContractCategory;

    type: ContractType;

    description: string;

    minimumStake: number;

    maximumStake: number;

    minimumDuration: number;

    maximumDuration: number;

    supportsBarrier: boolean;

    supportsMultiplier: boolean;

    supportsTakeProfit: boolean;

    supportsStopLoss: boolean;

}

/* -------------------------------------------------------------------------- */
/*                      FACTORY OPTIONS                                       */
/* -------------------------------------------------------------------------- */

export interface CreateContractOptions {

    accountId: string;

    instrument: Instrument;

    category: ContractCategory;

    type: ContractType;

    stake: number;

    duration: number;

    barrier?: number;

    upperBarrier?: number;

    lowerBarrier?: number;

    strikePrice?: number;

}

export interface UpdateContractOptions {

    contractId: string;

    status?: ContractStatus;

    payout?: number;

    settlementPrice?: number;

}

/* -------------------------------------------------------------------------- */
/*                      COLLECTIONS                                           */
/* -------------------------------------------------------------------------- */

export interface ContractCollection {

    items: Contract[];

    total: number;

}

export interface ContractAlertCollection {

    items: ContractAlert[];

    total: number;

}

export interface ContractNotificationCollection {

    items: ContractNotification[];

    total: number;

}

export interface ContractEventCollection {

    items: ContractEvent[];

    total: number;

}

export interface ContractReportCollection {

    items: ContractReport[];

    total: number;

}

/* -------------------------------------------------------------------------- */
/*                       LOOKUP MAPS                                          */
/* -------------------------------------------------------------------------- */

export type ContractMap =
    Record<string, Contract>;

export type ContractAlertMap =
    Record<string, ContractAlert>;

export type ContractNotificationMap =
    Record<string, ContractNotification>;

export type ContractTimelineMap =
    Record<string, ContractTimeline>;

export type ContractEventMap =
    Record<string, ContractEvent>;

export type ContractReportMap =
    Record<string, ContractReport>;

/* -------------------------------------------------------------------------- */
/*                     CALLBACK TYPES                                         */
/* -------------------------------------------------------------------------- */

export type ContractCreatedHandler =
(
    contract: Contract
) => void;

export type ContractUpdatedHandler =
(
    contract: Contract
) => void;

export type ContractSettledHandler =
(
    settlement: ContractSettlement
) => void;

export type ContractExpiredHandler =
(
    contract: Contract
) => void;

export type ContractAlertHandler =
(
    alert: ContractAlert
) => void;

export type ContractNotificationHandler =
(
    notification: ContractNotification
) => void;

export type ContractErrorHandler =
(
    error: Error
) => void;

/* -------------------------------------------------------------------------- */
/*                      READONLY TYPES                                        */
/* -------------------------------------------------------------------------- */

export type ReadonlyContract =
    Readonly<Contract>;

export type ReadonlyContractAnalytics =
    Readonly<ContractAnalytics>;

export type ReadonlyContractPerformance =
    Readonly<ContractPerformance>;

export type ReadonlyContractReport =
    Readonly<ContractReport>;

export type ReadonlyContractHistory =
    Readonly<ContractHistory>;

export type ReadonlyContractPortfolio =
    Readonly<ContractPortfolio>;

/* -------------------------------------------------------------------------- */
/*                     CONTRACT STATISTICS                                    */
/* -------------------------------------------------------------------------- */

export interface ContractStatistics {

    totalContracts: number;

    activeContracts: number;

    settledContracts: number;

    expiredContracts: number;

    cancelledContracts: number;

    winningContracts: number;

    losingContracts: number;

    averageStake: number;

    averagePayout: number;

    totalProfit: number;

    averageROI: number;

}

/* -------------------------------------------------------------------------- */
/*                     CONTRACT CAPABILITIES                                  */
/* -------------------------------------------------------------------------- */

export interface ContractCapabilities {

    supportsRiseFall: boolean;

    supportsHigherLower: boolean;

    supportsTouchNoTouch: boolean;

    supportsInOut: boolean;

    supportsMultiplier: boolean;

    supportsAccumulator: boolean;

    supportsVanillaOptions: boolean;

    supportsDigitalOptions: boolean;

    supportsCashSettlement: boolean;

    supportsPhysicalSettlement: boolean;

    supportsAIRecommendations: boolean;

    supportsCopyTrading: boolean;

    supportsRealtimeMonitoring: boolean;

    supportsBacktesting: boolean;

}

/* -------------------------------------------------------------------------- */
/*                     IDENTIFIER                                             */
/* -------------------------------------------------------------------------- */

export interface ContractIdentifier {

    contractId: string;

    accountId: string;

    instrumentId: string;

}

/* -------------------------------------------------------------------------- */
/*                     VERSION                                                */
/* -------------------------------------------------------------------------- */

export interface ContractVersion {

    version: string;

    build: string;

    generatedAt: Date;

}

/* -------------------------------------------------------------------------- */
/*                     END OF FILE                                            */
/* -------------------------------------------------------------------------- */