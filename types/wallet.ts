/**
 * ============================================================================
 * WALLET TYPES
 * ============================================================================
 * Financial domain models used throughout the application.
 *
 * This file contains:
 * - Wallet definitions
 * - Balance models
 * - Currency models
 * - Account models
 * - Wallet enums
 *
 * Parts 2–4 will continue directly below this section.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

export enum WalletType {
    MAIN = "MAIN",
    TRADING = "TRADING",
    DEMO = "DEMO",
    BONUS = "BONUS",
    AFFILIATE = "AFFILIATE",
    SAVINGS = "SAVINGS",
    ESCROW = "ESCROW"
}

export enum WalletStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    FROZEN = "FROZEN",
    LOCKED = "LOCKED",
    SUSPENDED = "SUSPENDED",
    CLOSED = "CLOSED"
}

export enum CurrencyType {
    FIAT = "FIAT",
    CRYPTO = "CRYPTO"
}

export enum CurrencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    KES = "KES",
    NGN = "NGN",
    ZAR = "ZAR",
    USDT = "USDT",
    BTC = "BTC",
    ETH = "ETH"
}

export enum BalanceType {
    AVAILABLE = "AVAILABLE",
    LOCKED = "LOCKED",
    BONUS = "BONUS",
    PENDING = "PENDING",
    RESERVED = "RESERVED"
}

export enum AccountType {
    REAL = "REAL",
    DEMO = "DEMO"
}

export enum WalletVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

/* -------------------------------------------------------------------------- */
/*                             CURRENCY INTERFACES                            */
/* -------------------------------------------------------------------------- */

export interface Currency {

    code: CurrencyCode;

    name: string;

    symbol: string;

    type: CurrencyType;

    decimals: number;

    exchangeRate: number;

    enabled: boolean;

    icon?: string;
}

export interface ExchangeRate {

    from: CurrencyCode;

    to: CurrencyCode;

    rate: number;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                            BALANCE INTERFACES                              */
/* -------------------------------------------------------------------------- */

export interface WalletBalance {

    currency: CurrencyCode;

    available: number;

    locked: number;

    pending: number;

    bonus: number;

    reserved: number;

    total: number;

    updatedAt: Date;
}

export interface BalanceBreakdown {

    cash: number;

    trading: number;

    withdrawable: number;

    nonWithdrawable: number;

    promotional: number;

    affiliate: number;

    pendingDeposits: number;

    pendingWithdrawals: number;

    lockedFunds: number;
}

/* -------------------------------------------------------------------------- */
/*                              ACCOUNT MODELS                                */
/* -------------------------------------------------------------------------- */

export interface TradingAccount {

    id: string;

    userId: string;

    accountNumber: string;

    accountType: AccountType;

    baseCurrency: CurrencyCode;

    leverage: number;

    isDefault: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export interface WalletPreferences {

    hideBalance: boolean;

    defaultCurrency: CurrencyCode;

    receiveNotifications: boolean;

    autoConvertCurrencies: boolean;

    preferredWallet: WalletType;
}

/* -------------------------------------------------------------------------- */
/*                             WALLET INTERFACES                              */
/* -------------------------------------------------------------------------- */

export interface Wallet {

    id: string;

    userId: string;

    accountId: string;

    walletType: WalletType;

    status: WalletStatus;

    visibility: WalletVisibility;

    currency: CurrencyCode;

    balance: WalletBalance;

    nickname?: string;

    description?: string;

    color?: string;

    icon?: string;

    isDefault: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export interface WalletSummary {

    totalWallets: number;

    totalBalance: number;

    totalAvailable: number;

    totalLocked: number;

    totalBonus: number;

    totalPending: number;

    currency: CurrencyCode;

    lastUpdated: Date;
}

export interface WalletOverview {

    mainWallet: Wallet;

    tradingWallet: Wallet;

    demoWallet: Wallet;

    bonusWallet: Wallet;

    affiliateWallet: Wallet;

    summary: WalletSummary;
}

/* -------------------------------------------------------------------------- */
/*                              LIMIT DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

export interface WalletLimits {

    minimumDeposit: number;

    maximumDeposit: number;

    minimumWithdrawal: number;

    maximumWithdrawal: number;

    dailyWithdrawalLimit: number;

    dailyDepositLimit: number;

    maximumWalletBalance: number;
}

export interface WalletPermissions {

    canDeposit: boolean;

    canWithdraw: boolean;

    canTransfer: boolean;

    canTrade: boolean;

    canReceiveBonus: boolean;

    canConvertCurrency: boolean;
}
/* -------------------------------------------------------------------------- */
/*                           TRANSACTION ENUMS                                */
/* -------------------------------------------------------------------------- */

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    TRANSFER = "TRANSFER",
    TRADE_STAKE = "TRADE_STAKE",
    TRADE_PAYOUT = "TRADE_PAYOUT",
    BONUS = "BONUS",
    REFERRAL_COMMISSION = "REFERRAL_COMMISSION",
    ADJUSTMENT = "ADJUSTMENT",
    REFUND = "REFUND",
    CONVERSION = "CONVERSION",
    FEE = "FEE",
    REVERSAL = "REVERSAL"
}

export enum TransactionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED",
    REVERSED = "REVERSED",
    EXPIRED = "EXPIRED"
}

export enum PaymentMethodType {
    MPESA = "MPESA",
    BANK = "BANK",
    VISA = "VISA",
    MASTERCARD = "MASTERCARD",
    PAYPAL = "PAYPAL",
    CRYPTO = "CRYPTO",
    AIRTEL_MONEY = "AIRTEL_MONEY",
    MTN_MOMO = "MTN_MOMO"
}

export enum ProviderType {
    SAFARICOM = "SAFARICOM",
    STRIPE = "STRIPE",
    PAYPAL = "PAYPAL",
    FLUTTERWAVE = "FLUTTERWAVE",
    PAYSTACK = "PAYSTACK",
    BINANCE = "BINANCE",
    BANK = "BANK"
}

export enum FeeType {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE",
    HYBRID = "HYBRID"
}

/* -------------------------------------------------------------------------- */
/*                          PAYMENT METHOD MODELS                             */
/* -------------------------------------------------------------------------- */

export interface PaymentMethod {

    id: string;

    userId: string;

    type: PaymentMethodType;

    provider: ProviderType;

    nickname: string;

    isDefault: boolean;

    verified: boolean;

    enabled: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export interface MpesaPaymentMethod extends PaymentMethod {

    phoneNumber: string;

    accountName: string;
}

export interface BankAccount extends PaymentMethod {

    bankName: string;

    accountName: string;

    accountNumber: string;

    branch?: string;

    swiftCode?: string;
}

export interface CardPaymentMethod extends PaymentMethod {

    cardHolder: string;

    maskedNumber: string;

    expiryMonth: number;

    expiryYear: number;

    brand: string;
}

export interface CryptoWallet extends PaymentMethod {

    network: string;

    walletAddress: string;

    currency: CurrencyCode;
}

/* -------------------------------------------------------------------------- */
/*                             TRANSACTION FEES                               */
/* -------------------------------------------------------------------------- */

export interface TransactionFee {

    id: string;

    name: string;

    feeType: FeeType;

    value: number;

    currency: CurrencyCode;

    minimumFee?: number;

    maximumFee?: number;
}

/* -------------------------------------------------------------------------- */
/*                             TRANSACTION MODEL                              */
/* -------------------------------------------------------------------------- */

export interface Transaction {

    id: string;

    reference: string;

    userId: string;

    walletId: string;

    accountId: string;

    transactionType: TransactionType;

    status: TransactionStatus;

    amount: number;

    currency: CurrencyCode;

    fee: number;

    tax?: number;

    exchangeRate?: number;

    netAmount: number;

    description: string;

    remarks?: string;

    paymentMethodId?: string;

    externalReference?: string;

    metadata?: Record<string, unknown>;

    initiatedAt: Date;

    processedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                              DEPOSIT MODEL                                 */
/* -------------------------------------------------------------------------- */

export interface DepositRequest {

    walletId: string;

    amount: number;

    currency: CurrencyCode;

    paymentMethodId: string;
}

export interface Deposit extends Transaction {

    paymentMethod: PaymentMethod;

    confirmationCode?: string;

    receivedAmount: number;
}

/* -------------------------------------------------------------------------- */
/*                             WITHDRAWAL MODEL                               */
/* -------------------------------------------------------------------------- */

export interface WithdrawalRequest {

    walletId: string;

    amount: number;

    paymentMethodId: string;
}

export interface Withdrawal extends Transaction {

    destination: PaymentMethod;

    approvedBy?: string;

    rejectionReason?: string;
}

/* -------------------------------------------------------------------------- */
/*                               TRANSFER MODEL                               */
/* -------------------------------------------------------------------------- */

export interface TransferRequest {

    fromWalletId: string;

    toWalletId: string;

    amount: number;

    currency: CurrencyCode;

    description?: string;
}

export interface Transfer extends Transaction {

    fromWalletId: string;

    toWalletId: string;
}

/* -------------------------------------------------------------------------- */
/*                          MPESA TRANSACTION MODELS                          */
/* -------------------------------------------------------------------------- */

export interface MpesaSTKPushRequest {

    phoneNumber: string;

    amount: number;

    accountReference: string;

    description: string;
}

export interface MpesaSTKPushResponse {

    merchantRequestId: string;

    checkoutRequestId: string;

    responseCode: string;

    responseDescription: string;

    customerMessage: string;
}

export interface MpesaCallback {

    merchantRequestId: string;

    checkoutRequestId: string;

    resultCode: number;

    resultDescription: string;

    mpesaReceiptNumber?: string;

    phoneNumber?: string;

    amount?: number;

    transactionDate?: string;
}

/* -------------------------------------------------------------------------- */
/*                         CURRENCY CONVERSION MODEL                          */
/* -------------------------------------------------------------------------- */

export interface CurrencyConversion {

    from: CurrencyCode;

    to: CurrencyCode;

    amount: number;

    rate: number;

    convertedAmount: number;

    fee: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                          TRANSACTION VALIDATION                            */
/* -------------------------------------------------------------------------- */

export interface TransactionValidation {

    valid: boolean;

    errors: string[];

    warnings: string[];
}

/* -------------------------------------------------------------------------- */
/*                             LEDGER & STATEMENTS                            */
/* -------------------------------------------------------------------------- */

export interface LedgerEntry {

    id: string;

    transactionId: string;

    walletId: string;

    userId: string;

    debit: number;

    credit: number;

    balanceBefore: number;

    balanceAfter: number;

    currency: CurrencyCode;

    description: string;

    reference: string;

    createdAt: Date;
}

export interface WalletStatement {

    id: string;

    walletId: string;

    generatedAt: Date;

    from: Date;

    to: Date;

    openingBalance: number;

    closingBalance: number;

    totalCredits: number;

    totalDebits: number;

    transactions: Transaction[];
}

export interface StatementFilter {

    from?: Date;

    to?: Date;

    transactionTypes?: TransactionType[];

    status?: TransactionStatus[];

    minimumAmount?: number;

    maximumAmount?: number;
}

/* -------------------------------------------------------------------------- */
/*                          BALANCE HISTORY                                   */
/* -------------------------------------------------------------------------- */

export interface BalanceSnapshot {

    id: string;

    walletId: string;

    availableBalance: number;

    lockedBalance: number;

    pendingBalance: number;

    bonusBalance: number;

    totalBalance: number;

    timestamp: Date;
}

export interface BalanceHistory {

    walletId: string;

    snapshots: BalanceSnapshot[];
}

/* -------------------------------------------------------------------------- */
/*                         DAILY & MONTHLY SUMMARIES                          */
/* -------------------------------------------------------------------------- */

export interface DailyWalletSummary {

    date: Date;

    deposits: number;

    withdrawals: number;

    transfersIn: number;

    transfersOut: number;

    tradingCredits: number;

    tradingDebits: number;

    bonuses: number;

    fees: number;

    openingBalance: number;

    closingBalance: number;
}

export interface MonthlyWalletSummary {

    month: number;

    year: number;

    deposits: number;

    withdrawals: number;

    transfers: number;

    bonuses: number;

    commissions: number;

    fees: number;

    netCashFlow: number;

    openingBalance: number;

    closingBalance: number;
}

/* -------------------------------------------------------------------------- */
/*                           CASH FLOW ANALYTICS                              */
/* -------------------------------------------------------------------------- */

export interface CashFlow {

    totalInflow: number;

    totalOutflow: number;

    netCashFlow: number;

    averageDeposit: number;

    averageWithdrawal: number;

    largestDeposit: number;

    largestWithdrawal: number;
}

export interface WalletAnalytics {

    walletId: string;

    totalDeposits: number;

    totalWithdrawals: number;

    totalTransfers: number;

    totalBonuses: number;

    totalFees: number;

    totalTransactions: number;

    successfulTransactions: number;

    failedTransactions: number;

    pendingTransactions: number;

    averageTransactionAmount: number;

    highestTransaction: number;

    lowestTransaction: number;

    cashFlow: CashFlow;
}

/* -------------------------------------------------------------------------- */
/*                         TRANSACTION HISTORY                                */
/* -------------------------------------------------------------------------- */

export interface TransactionHistory {

    transactions: Transaction[];

    total: number;

    page: number;

    pageSize: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;
}

export interface TransactionSearch {

    keyword?: string;

    reference?: string;

    walletId?: string;

    transactionType?: TransactionType[];

    status?: TransactionStatus[];

    from?: Date;

    to?: Date;

    minimumAmount?: number;

    maximumAmount?: number;
}

/* -------------------------------------------------------------------------- */
/*                          FINANCIAL REPORTING                               */
/* -------------------------------------------------------------------------- */

export interface FinancialReport {

    id: string;

    title: string;

    generatedAt: Date;

    generatedBy: string;

    currency: CurrencyCode;

    totalAssets: number;

    totalLiabilities: number;

    totalDeposits: number;

    totalWithdrawals: number;

    totalRevenue: number;

    totalExpenses: number;

    netProfit: number;
}

/* -------------------------------------------------------------------------- */
/*                         PROFIT & LOSS                                      */
/* -------------------------------------------------------------------------- */

export interface ProfitLoss {

    grossProfit: number;

    grossLoss: number;

    realizedProfit: number;

    unrealizedProfit: number;

    tradingProfit: number;

    referralProfit: number;

    bonusProfit: number;

    feesPaid: number;

    taxesPaid: number;

    netProfit: number;
}

/* -------------------------------------------------------------------------- */
/*                           RECONCILIATION                                   */
/* -------------------------------------------------------------------------- */

export interface WalletReconciliation {

    walletId: string;

    expectedBalance: number;

    actualBalance: number;

    difference: number;

    reconciled: boolean;

    reconciledAt?: Date;

    notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                         AUDIT TRAIL                                        */
/* -------------------------------------------------------------------------- */

export interface WalletAuditLog {

    id: string;

    walletId: string;

    userId: string;

    action: string;

    performedBy: string;

    ipAddress?: string;

    device?: string;

    oldValue?: Record<string, unknown>;

    newValue?: Record<string, unknown>;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                      WALLET PERFORMANCE METRICS                            */
/* -------------------------------------------------------------------------- */

export interface WalletPerformance {

    walletId: string;

    averageDailyBalance: number;

    averageMonthlyBalance: number;

    highestBalance: number;

    lowestBalance: number;

    totalGrowth: number;

    growthPercentage: number;

    activeDays: number;

    inactiveDays: number;
}

/* -------------------------------------------------------------------------- */
/*                      EXPORT / IMPORT MODELS                                */
/* -------------------------------------------------------------------------- */

export interface WalletExport {

    format: "csv" | "xlsx" | "pdf";

    from: Date;

    to: Date;

    includeTransactions: boolean;

    includeAnalytics: boolean;

    includeStatements: boolean;
}

export interface WalletImport {

    source: string;

    importedAt: Date;

    totalRecords: number;

    successfulRecords: number;

    failedRecords: number;
}

/* -------------------------------------------------------------------------- */
/*                           API REQUEST MODELS                               */
/* -------------------------------------------------------------------------- */

export interface CreateWalletRequest {

    walletType: WalletType;

    currency: CurrencyCode;

    nickname?: string;
}

export interface UpdateWalletRequest {

    nickname?: string;

    description?: string;

    visibility?: WalletVisibility;

    color?: string;

    icon?: string;
}

export interface WalletResponse {

    success: boolean;

    message: string;

    wallet?: Wallet;
}

export interface WalletListResponse {

    success: boolean;

    wallets: Wallet[];

    total: number;
}

export interface TransactionResponse {

    success: boolean;

    message: string;

    transaction?: Transaction;
}

export interface TransactionsResponse {

    success: boolean;

    transactions: Transaction[];

    total: number;

    page: number;

    pageSize: number;
}

/* -------------------------------------------------------------------------- */
/*                        REAL-TIME WALLET EVENTS                             */
/* -------------------------------------------------------------------------- */

export enum WalletEventType {

    WALLET_CREATED = "WALLET_CREATED",

    WALLET_UPDATED = "WALLET_UPDATED",

    WALLET_DELETED = "WALLET_DELETED",

    BALANCE_CHANGED = "BALANCE_CHANGED",

    DEPOSIT_RECEIVED = "DEPOSIT_RECEIVED",

    WITHDRAWAL_REQUESTED = "WITHDRAWAL_REQUESTED",

    WITHDRAWAL_APPROVED = "WITHDRAWAL_APPROVED",

    WITHDRAWAL_REJECTED = "WITHDRAWAL_REJECTED",

    TRANSFER_COMPLETED = "TRANSFER_COMPLETED",

    BONUS_RECEIVED = "BONUS_RECEIVED",

    COMMISSION_RECEIVED = "COMMISSION_RECEIVED"
}

export interface WalletEvent {

    id: string;

    walletId: string;

    userId: string;

    eventType: WalletEventType;

    payload: unknown;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          BONUS WALLET MODELS                               */
/* -------------------------------------------------------------------------- */

export interface BonusWallet {

    walletId: string;

    totalBonus: number;

    availableBonus: number;

    lockedBonus: number;

    wageringRequirement: number;

    expiryDate?: Date;
}

export interface BonusTransaction {

    id: string;

    bonusType: string;

    amount: number;

    description: string;

    awardedAt: Date;

    expiresAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                        AFFILIATE WALLET MODELS                             */
/* -------------------------------------------------------------------------- */

export interface AffiliateWallet {

    walletId: string;

    totalCommission: number;

    availableCommission: number;

    pendingCommission: number;

    withdrawnCommission: number;
}

export interface CommissionRecord {

    id: string;

    referralId: string;

    amount: number;

    currency: CurrencyCode;

    earnedAt: Date;

    status: TransactionStatus;
}

/* -------------------------------------------------------------------------- */
/*                          MULTI-CURRENCY PORTFOLIO                          */
/* -------------------------------------------------------------------------- */

export interface PortfolioAsset {

    currency: CurrencyCode;

    balance: number;

    usdValue: number;

    percentage: number;
}

export interface WalletPortfolio {

    totalPortfolioValue: number;

    baseCurrency: CurrencyCode;

    assets: PortfolioAsset[];

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         FRAUD & RISK MODELS                                */
/* -------------------------------------------------------------------------- */

export enum RiskFlag {

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    CRITICAL = "CRITICAL"
}

export interface WalletRiskAssessment {

    walletId: string;

    score: number;

    flag: RiskFlag;

    suspiciousTransactions: number;

    lastAssessment: Date;

    notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                           KYC FINANCIAL STATUS                             */
/* -------------------------------------------------------------------------- */

export enum VerificationLevel {

    NONE = "NONE",

    BASIC = "BASIC",

    VERIFIED = "VERIFIED",

    PREMIUM = "PREMIUM"
}

export interface WalletVerification {

    userId: string;

    level: VerificationLevel;

    canDeposit: boolean;

    canWithdraw: boolean;

    maximumDailyWithdrawal: number;

    verifiedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                          PENDING OPERATION QUEUE                           */
/* -------------------------------------------------------------------------- */

export interface PendingWalletOperation {

    id: string;

    walletId: string;

    operation: string;

    status: TransactionStatus;

    createdAt: Date;

    scheduledFor?: Date;

    completedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                          WALLET NOTIFICATIONS                              */
/* -------------------------------------------------------------------------- */

export interface WalletNotification {

    id: string;

    walletId: string;

    title: string;

    message: string;

    read: boolean;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                             SEARCH OPTIONS                                 */
/* -------------------------------------------------------------------------- */

export interface WalletSearchOptions {

    walletType?: WalletType;

    currency?: CurrencyCode;

    status?: WalletStatus;

    isDefault?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           GENERIC PAGINATION                               */
/* -------------------------------------------------------------------------- */

export interface Pagination {

    page: number;

    pageSize: number;

    total: number;

    totalPages: number;
}

/* -------------------------------------------------------------------------- */
/*                         GENERIC API WRAPPERS                               */
/* -------------------------------------------------------------------------- */

export interface ApiSuccess<T> {

    success: true;

    data: T;

    message?: string;
}

export interface ApiError {

    success: false;

    message: string;

    code?: string;

    errors?: string[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/* -------------------------------------------------------------------------- */
/*                           TYPE ALIASES                                     */
/* -------------------------------------------------------------------------- */

export type WalletId = string;

export type TransactionId = string;

export type AccountId = string;

export type UserId = string;

/* -------------------------------------------------------------------------- */
/*                          DEFAULT CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_WALLET_LIMITS: WalletLimits = {

    minimumDeposit: 1,

    maximumDeposit: 1000000,

    minimumWithdrawal: 5,

    maximumWithdrawal: 500000,

    dailyWithdrawalLimit: 1000000,

    dailyDepositLimit: 5000000,

    maximumWalletBalance: 100000000
};

export const DEFAULT_WALLET_PREFERENCES: WalletPreferences = {

    hideBalance: false,

    defaultCurrency: CurrencyCode.USD,

    receiveNotifications: true,

    autoConvertCurrencies: false,

    preferredWallet: WalletType.TRADING
};

/* -------------------------------------------------------------------------- */
/*                               END OF FILE                                  */
/* -------------------------------------------------------------------------- */