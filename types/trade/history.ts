/**
 * ============================================================================
 * HISTORY TYPES
 * ============================================================================
 * Central Historical Data Models
 *
 * Used by:
 * - Trading Engine
 * - Portfolio
 * - Analytics
 * - Reports
 * - Audit Logs
 * - AI Engine
 * ============================================================================
 */

import { Trade } from "./trade";
import { Position } from "./position";
import { Order } from "./order";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum HistoryRecordType {

    TRADE = "TRADE",

    POSITION = "POSITION",

    ORDER = "ORDER",

    TRANSACTION = "TRANSACTION",

    WALLET = "WALLET",

    LOGIN = "LOGIN",

    SYSTEM = "SYSTEM"
}

export enum HistoryAction {

    CREATED = "CREATED",

    UPDATED = "UPDATED",

    EXECUTED = "EXECUTED",

    MODIFIED = "MODIFIED",

    CANCELLED = "CANCELLED",

    CLOSED = "CLOSED",

    DELETED = "DELETED"
}

/* -------------------------------------------------------------------------- */
/*                         BASE HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface HistoryRecord {

    id: string;

    accountId: string;

    type: HistoryRecordType;

    action: HistoryAction;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                       TRADE HISTORY                                        */
/* -------------------------------------------------------------------------- */

export interface TradeHistoryRecord extends HistoryRecord {

    trade: Trade;

}

/* -------------------------------------------------------------------------- */
/*                     POSITION HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface PositionHistoryRecord extends HistoryRecord {

    position: Position;

}

/* -------------------------------------------------------------------------- */
/*                       ORDER HISTORY                                        */
/* -------------------------------------------------------------------------- */

export interface OrderHistoryRecord extends HistoryRecord {

    order: Order;

}

/* -------------------------------------------------------------------------- */
/*                     WALLET HISTORY                                         */
/* -------------------------------------------------------------------------- */

export interface WalletHistoryRecord extends HistoryRecord {

    walletId: string;

    balanceBefore: number;

    balanceAfter: number;

    amount: number;

    currency: string;

}

/* -------------------------------------------------------------------------- */
/*                   TRANSACTION HISTORY                                      */
/* -------------------------------------------------------------------------- */

export interface TransactionHistoryRecord extends HistoryRecord {

    transactionId: string;

    amount: number;

    currency: string;

    reference: string;

    description: string;

}

/* -------------------------------------------------------------------------- */
/*                      UNIFIED HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface TradingHistory {

    records: HistoryRecord[];

    totalRecords: number;

    generatedAt: Date;

}

/* -------------------------------------------------------------------------- */
/*                         HISTORY FILTER                                     */
/* -------------------------------------------------------------------------- */

export interface HistoryFilter {

    accountId?: string;

    recordType?: HistoryRecordType;

    action?: HistoryAction;

    from?: Date;

    to?: Date;

    search?: string;

}

/* -------------------------------------------------------------------------- */
/*                        HISTORY SORT                                        */
/* -------------------------------------------------------------------------- */

export enum HistorySortField {

    DATE = "DATE",

    TYPE = "TYPE",

    ACTION = "ACTION"
}

export enum SortDirection {

    ASC = "ASC",

    DESC = "DESC"
}

export interface HistorySort {

    field: HistorySortField;

    direction: SortDirection;

}

/* -------------------------------------------------------------------------- */
/*                     HISTORY PAGINATION                                     */
/* -------------------------------------------------------------------------- */

export interface HistoryPagination {

    page: number;

    pageSize: number;

    totalPages: number;

    totalRecords: number;

}

/* -------------------------------------------------------------------------- */
/*                         HISTORY TIMELINE                                   */
/* -------------------------------------------------------------------------- */

export enum TimelineEventType {

    ACCOUNT_CREATED = "ACCOUNT_CREATED",

    LOGIN = "LOGIN",

    LOGOUT = "LOGOUT",

    ORDER_CREATED = "ORDER_CREATED",

    ORDER_MODIFIED = "ORDER_MODIFIED",

    ORDER_CANCELLED = "ORDER_CANCELLED",

    TRADE_OPENED = "TRADE_OPENED",

    TRADE_CLOSED = "TRADE_CLOSED",

    POSITION_OPENED = "POSITION_OPENED",

    POSITION_CLOSED = "POSITION_CLOSED",

    DEPOSIT = "DEPOSIT",

    WITHDRAWAL = "WITHDRAWAL"
}

export interface TimelineEvent {

    id: string;

    accountId: string;

    type: TimelineEventType;

    title: string;

    description: string;

    timestamp: Date;

    metadata?: Record<string, unknown>;
}

export interface HistoryTimeline {

    accountId: string;

    events: TimelineEvent[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       HISTORY SNAPSHOT                                     */
/* -------------------------------------------------------------------------- */

export interface AccountSnapshot {

    snapshotId: string;

    accountId: string;

    balance: number;

    equity: number;

    margin: number;

    freeMargin: number;

    unrealizedPnL: number;

    openPositions: number;

    timestamp: Date;
}

export interface HistorySnapshot {

    snapshots: AccountSnapshot[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           AUDIT LOG                                        */
/* -------------------------------------------------------------------------- */

export enum AuditSeverity {

    INFO = "INFO",

    WARNING = "WARNING",

    ERROR = "ERROR",

    CRITICAL = "CRITICAL"
}

export interface AuditLog {

    id: string;

    accountId: string;

    action: string;

    severity: AuditSeverity;

    description: string;

    performedBy: string;

    ipAddress?: string;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                        USER ACTIVITY                                       */
/* -------------------------------------------------------------------------- */

export interface UserActivity {

    id: string;

    accountId: string;

    activity: string;

    page?: string;

    durationMilliseconds?: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                        LOGIN HISTORY                                       */
/* -------------------------------------------------------------------------- */

export enum LoginStatus {

    SUCCESS = "SUCCESS",

    FAILED = "FAILED"
}

export interface LoginHistory {

    id: string;

    accountId: string;

    status: LoginStatus;

    ipAddress: string;

    country?: string;

    city?: string;

    deviceId?: string;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                       DEVICE HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface DeviceHistory {

    deviceId: string;

    accountId: string;

    deviceName: string;

    operatingSystem: string;

    browser: string;

    trusted: boolean;

    lastUsed: Date;
}

/* -------------------------------------------------------------------------- */
/*                      SESSION HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface SessionHistory {

    sessionId: string;

    accountId: string;

    startedAt: Date;

    endedAt?: Date;

    durationMilliseconds?: number;

    active: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       CHANGE TRACKING                                      */
/* -------------------------------------------------------------------------- */

export interface FieldChange {

    field: string;

    previousValue: unknown;

    newValue: unknown;
}

export interface ChangeLog {

    id: string;

    recordId: string;

    recordType: HistoryRecordType;

    changes: FieldChange[];

    changedBy: string;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                       HISTORY REPLAY                                       */
/* -------------------------------------------------------------------------- */

export enum ReplayStatus {

    STOPPED = "STOPPED",

    PLAYING = "PLAYING",

    PAUSED = "PAUSED",

    FINISHED = "FINISHED"
}

export interface HistoryReplay {

    status: ReplayStatus;

    currentRecord: number;

    totalRecords: number;

    playbackSpeed: number;
}

/* -------------------------------------------------------------------------- */
/*                       HISTORY METADATA                                     */
/* -------------------------------------------------------------------------- */

export interface HistoryMetadata {

    source: string;

    imported: boolean;

    archived: boolean;

    checksum?: string;

    version: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      EQUITY HISTORY                                        */
/* -------------------------------------------------------------------------- */

export interface EquityHistoryPoint {

    timestamp: Date;

    equity: number;

    balance: number;

    floatingPnL: number;
}

export interface EquityHistory {

    accountId: string;

    points: EquityHistoryPoint[];

    highestEquity: number;

    lowestEquity: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      BALANCE HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface BalanceHistoryPoint {

    timestamp: Date;

    balance: number;

    change: number;

    reason: string;
}

export interface BalanceHistory {

    accountId: string;

    points: BalanceHistoryPoint[];

    openingBalance: number;

    closingBalance: number;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       MARGIN HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface MarginHistoryPoint {

    timestamp: Date;

    usedMargin: number;

    freeMargin: number;

    marginLevel: number;

    equity: number;
}

export interface MarginHistory {

    accountId: string;

    points: MarginHistoryPoint[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                        PNL HISTORY                                         */
/* -------------------------------------------------------------------------- */

export interface ProfitLossHistoryPoint {

    timestamp: Date;

    realizedPnL: number;

    unrealizedPnL: number;

    totalPnL: number;
}

export interface ProfitLossHistory {

    accountId: string;

    points: ProfitLossHistoryPoint[];

    totalProfit: number;

    totalLoss: number;

    netProfit: number;
}

/* -------------------------------------------------------------------------- */
/*                    PERFORMANCE HISTORY                                     */
/* -------------------------------------------------------------------------- */

export interface PerformanceHistoryPoint {

    timestamp: Date;

    winRate: number;

    profitFactor: number;

    expectancy: number;

    sharpeRatio?: number;
}

export interface PerformanceHistory {

    accountId: string;

    points: PerformanceHistoryPoint[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                     DRAWDOWN HISTORY                                       */
/* -------------------------------------------------------------------------- */

export interface DrawdownHistoryPoint {

    timestamp: Date;

    drawdown: number;

    drawdownPercentage: number;
}

export interface DrawdownHistory {

    accountId: string;

    points: DrawdownHistoryPoint[];

    maximumDrawdown: number;

    averageDrawdown: number;
}

/* -------------------------------------------------------------------------- */
/*                     AI ANALYTICS HISTORY                                   */
/* -------------------------------------------------------------------------- */

export interface AIAnalyticsHistory {

    timestamp: Date;

    modelName: string;

    prediction: string;

    confidence: number;

    actualOutcome?: string;

    accuracy?: number;
}

export interface AIHistory {

    accountId: string;

    analytics: AIAnalyticsHistory[];

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                        HISTORICAL REPORT                                   */
/* -------------------------------------------------------------------------- */

export enum ReportFormat {

    PDF = "PDF",

    CSV = "CSV",

    XLSX = "XLSX",

    JSON = "JSON"
}

export interface HistoryReport {

    reportId: string;

    accountId: string;

    title: string;

    format: ReportFormat;

    generatedAt: Date;

    generatedBy: string;
}

/* -------------------------------------------------------------------------- */
/*                       EXPORT REQUEST                                       */
/* -------------------------------------------------------------------------- */

export interface HistoryExportRequest {

    accountId: string;

    format: ReportFormat;

    from: Date;

    to: Date;

    includeOrders: boolean;

    includeTrades: boolean;

    includePositions: boolean;

    includeTransactions: boolean;
}

export interface HistoryExportResult {

    exportId: string;

    fileName: string;

    format: ReportFormat;

    generatedAt: Date;

    successful: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      HISTORY STATISTICS                                    */
/* -------------------------------------------------------------------------- */

export interface HistoryStatistics {

    totalRecords: number;

    totalTrades: number;

    totalOrders: number;

    totalPositions: number;

    totalTransactions: number;

    totalLogins: number;

    totalSessions: number;

    firstRecord: Date;

    latestRecord: Date;
}

/* -------------------------------------------------------------------------- */
/*                    DATA RETENTION                                          */
/* -------------------------------------------------------------------------- */

export interface DataRetentionPolicy {

    retentionDays: number;

    archiveAfterDays: number;

    deleteAfterDays?: number;

    automaticArchiving: boolean;

    automaticDeletion: boolean;
}

/* -------------------------------------------------------------------------- */
/*                    HISTORY ARCHIVE                                         */
/* -------------------------------------------------------------------------- */

export interface HistoryArchive {

    archiveId: string;

    accountId: string;

    archivedRecords: number;

    archivedAt: Date;

    compressed: boolean;

    encrypted: boolean;
}

/* -------------------------------------------------------------------------- */
/*                    DEFAULT CONFIGURATION                                   */
/* -------------------------------------------------------------------------- */

export const DEFAULT_HISTORY_PAGE_SIZE = 50;

export const MAX_HISTORY_PAGE_SIZE = 500;

export const DEFAULT_EXPORT_FORMAT = ReportFormat.CSV;

export const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

export const DEFAULT_HISTORY_SORT_FIELD = HistorySortField.DATE;

/* -------------------------------------------------------------------------- */
/*                      DEFAULT HISTORY FILTER                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_HISTORY_FILTER: HistoryFilter = {

    search: "",

    from: undefined,

    to: undefined,

    accountId: undefined,

    recordType: undefined,

    action: undefined
};

/* -------------------------------------------------------------------------- */
/*                      DEFAULT PAGINATION                                    */
/* -------------------------------------------------------------------------- */

export const DEFAULT_HISTORY_PAGINATION: HistoryPagination = {

    page: 1,

    pageSize: DEFAULT_HISTORY_PAGE_SIZE,

    totalPages: 1,

    totalRecords: 0
};

/* -------------------------------------------------------------------------- */
/*                      DEFAULT SORT                                          */
/* -------------------------------------------------------------------------- */

export const DEFAULT_HISTORY_SORT: HistorySort = {

    field: DEFAULT_HISTORY_SORT_FIELD,

    direction: DEFAULT_SORT_DIRECTION
};

/* -------------------------------------------------------------------------- */
/*                      COLLECTIONS                                           */
/* -------------------------------------------------------------------------- */

export interface HistoryCollection {

    items: HistoryRecord[];

    total: number;

    page: number;

    pageSize: number;
}

export interface AuditLogCollection {

    items: AuditLog[];

    total: number;
}

export interface TimelineCollection {

    items: TimelineEvent[];

    total: number;
}

export interface LoginHistoryCollection {

    items: LoginHistory[];

    total: number;
}

export interface SessionHistoryCollection {

    items: SessionHistory[];

    total: number;
}

export interface AccountSnapshotCollection {

    items: AccountSnapshot[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                      REGISTRIES                                            */
/* -------------------------------------------------------------------------- */

export interface HistoryRegistry {

    records: HistoryRecord[];

    auditLogs: AuditLog[];

    timelines: TimelineEvent[];

    snapshots: AccountSnapshot[];

    loginHistory: LoginHistory[];

    sessions: SessionHistory[];
}

/* -------------------------------------------------------------------------- */
/*                      LOOKUP MAPS                                           */
/* -------------------------------------------------------------------------- */

export type HistoryRecordMap =
    Record<string, HistoryRecord>;

export type AuditLogMap =
    Record<string, AuditLog>;

export type TimelineEventMap =
    Record<string, TimelineEvent>;

export type AccountSnapshotMap =
    Record<string, AccountSnapshot>;

export type LoginHistoryMap =
    Record<string, LoginHistory>;

export type SessionHistoryMap =
    Record<string, SessionHistory>;

/* -------------------------------------------------------------------------- */
/*                      FACTORY OPTIONS                                       */
/* -------------------------------------------------------------------------- */

export interface CreateHistoryRecordOptions {

    accountId: string;

    type: HistoryRecordType;

    action: HistoryAction;

    timestamp?: Date;
}

export interface CreateAuditLogOptions {

    accountId: string;

    action: string;

    severity: AuditSeverity;

    description: string;

    performedBy: string;
}

export interface CreateHistoryExportOptions {

    accountId: string;

    format: ReportFormat;

    from: Date;

    to: Date;
}

/* -------------------------------------------------------------------------- */
/*                      CALLBACK TYPES                                        */
/* -------------------------------------------------------------------------- */

export type HistoryRecordCreatedHandler =
(
    record: HistoryRecord
) => void;

export type HistoryRecordUpdatedHandler =
(
    record: HistoryRecord
) => void;

export type HistoryExportCompletedHandler =
(
    result: HistoryExportResult
) => void;

export type AuditLogCreatedHandler =
(
    log: AuditLog
) => void;

export type TimelineUpdatedHandler =
(
    timeline: HistoryTimeline
) => void;

export type HistoryErrorHandler =
(
    error: Error
) => void;

/* -------------------------------------------------------------------------- */
/*                      READONLY TYPES                                        */
/* -------------------------------------------------------------------------- */

export type ReadonlyHistoryRecord =
    Readonly<HistoryRecord>;

export type ReadonlyAuditLog =
    Readonly<AuditLog>;

export type ReadonlyTimelineEvent =
    Readonly<TimelineEvent>;

export type ReadonlyHistoryStatistics =
    Readonly<HistoryStatistics>;

export type ReadonlyHistoryFilter =
    Readonly<HistoryFilter>;

export type ReadonlyHistoryPagination =
    Readonly<HistoryPagination>;

/* -------------------------------------------------------------------------- */
/*                      CAPABILITIES                                          */
/* -------------------------------------------------------------------------- */

export interface HistoryCapabilities {

    supportsAuditLogs: boolean;

    supportsReplay: boolean;

    supportsExport: boolean;

    supportsSnapshots: boolean;

    supportsTimeline: boolean;

    supportsPagination: boolean;

    supportsFiltering: boolean;

    supportsSorting: boolean;

    supportsArchiving: boolean;

    supportsCompression: boolean;

    supportsEncryption: boolean;

    supportsAIAnalytics: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      VERSION                                               */
/* -------------------------------------------------------------------------- */

export interface HistoryVersion {

    version: string;

    build: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                      IDENTIFIER                                            */
/* -------------------------------------------------------------------------- */

export interface HistoryIdentifier {

    historyId: string;

    accountId: string;

    recordType: HistoryRecordType;
}

/* -------------------------------------------------------------------------- */
/*                      END OF FILE                                           */
/* -------------------------------------------------------------------------- */