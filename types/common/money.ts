/**
 * ============================================================================
 * MONEY TYPES
 * ============================================================================
 * Enterprise Financial Value Objects
 *
 * Shared across:
 * - Wallet
 * - Trading
 * - Market
 * - Analytics
 * - Payments
 * - Reports
 * ============================================================================
 */

import { CurrencyCode } from "./enums";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum CurrencyType {

    FIAT = "FIAT",

    CRYPTO = "CRYPTO"
}

export enum ExchangeRateProvider {

    INTERNAL = "INTERNAL",

    ECB = "ECB",

    FOREX = "FOREX",

    BINANCE = "BINANCE",

    COINBASE = "COINBASE",

    FIXER = "FIXER"
}

export enum RoundingMode {

    UP = "UP",

    DOWN = "DOWN",

    HALF_UP = "HALF_UP",

    HALF_DOWN = "HALF_DOWN",

    HALF_EVEN = "HALF_EVEN"
}

/* -------------------------------------------------------------------------- */
/*                           MONEY VALUE OBJECT                               */
/* -------------------------------------------------------------------------- */

export interface Money {

    amount: number;

    currency: CurrencyCode;

    formatted: string;

    precision: number;
}

/* -------------------------------------------------------------------------- */
/*                         CURRENCY INFORMATION                               */
/* -------------------------------------------------------------------------- */

export interface Currency {

    code: CurrencyCode;

    name: string;

    symbol: string;

    type: CurrencyType;

    decimals: number;

    locale: string;

    exchangeRate: number;

    enabled: boolean;

    icon?: string;

    flag?: string;
}

/* -------------------------------------------------------------------------- */
/*                         EXCHANGE RATE                                      */
/* -------------------------------------------------------------------------- */

export interface ExchangeRate {

    id: string;

    from: CurrencyCode;

    to: CurrencyCode;

    rate: number;

    provider: ExchangeRateProvider;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                        MONEY CONVERSION                                    */
/* -------------------------------------------------------------------------- */

export interface CurrencyConversion {

    source: Money;

    target: Money;

    exchangeRate: ExchangeRate;

    conversionFee: Money;

    convertedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          MONEY RANGE                                       */
/* -------------------------------------------------------------------------- */

export interface MoneyRange {

    minimum: Money;

    maximum: Money;
}

/* -------------------------------------------------------------------------- */
/*                         PRICE                                               */
/* -------------------------------------------------------------------------- */

export interface Price {

    value: Money;

    discount?: Money;

    tax?: Money;

    final: Money;
}

/* -------------------------------------------------------------------------- */
/*                         FEE                                                 */
/* -------------------------------------------------------------------------- */

export interface Fee {

    id: string;

    name: string;

    amount: Money;

    percentage?: number;

    description?: string;
}

/* -------------------------------------------------------------------------- */
/*                      TAX                                                    */
/* -------------------------------------------------------------------------- */

export interface Tax {

    name: string;

    percentage: number;

    amount: Money;
}

/* -------------------------------------------------------------------------- */
/*                     BALANCE                                                */
/* -------------------------------------------------------------------------- */

export interface Balance {

    available: Money;

    locked: Money;

    pending: Money;

    reserved: Money;

    bonus: Money;

    total: Money;
}

/* -------------------------------------------------------------------------- */
/*                      PROFIT LOSS                                           */
/* -------------------------------------------------------------------------- */

export interface ProfitLoss {

    profit: Money;

    loss: Money;

    net: Money;

    roi: number;
}

/* -------------------------------------------------------------------------- */
/*                       DEFAULTS                                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PRECISION = 2;

export const DEFAULT_ROUNDING_MODE = RoundingMode.HALF_UP;


/**
 * ============================================================================
 * MONEY TYPES
 * ============================================================================
 * Enterprise Financial Value Objects
 *
 * Shared across:
 * - Wallet
 * - Trading
 * - Market
 * - Analytics
 * - Payments
 * - Reports
 * ============================================================================
 */

import { CurrencyCode } from "./enums";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum CurrencyType {

    FIAT = "FIAT",

    CRYPTO = "CRYPTO"
}

export enum ExchangeRateProvider {

    INTERNAL = "INTERNAL",

    ECB = "ECB",

    FOREX = "FOREX",

    BINANCE = "BINANCE",

    COINBASE = "COINBASE",

    FIXER = "FIXER"
}

export enum RoundingMode {

    UP = "UP",

    DOWN = "DOWN",

    HALF_UP = "HALF_UP",

    HALF_DOWN = "HALF_DOWN",

    HALF_EVEN = "HALF_EVEN"
}

/* -------------------------------------------------------------------------- */
/*                           MONEY VALUE OBJECT                               */
/* -------------------------------------------------------------------------- */

export interface Money {

    amount: number;

    currency: CurrencyCode;

    formatted: string;

    precision: number;
}

/* -------------------------------------------------------------------------- */
/*                         CURRENCY INFORMATION                               */
/* -------------------------------------------------------------------------- */

export interface Currency {

    code: CurrencyCode;

    name: string;

    symbol: string;

    type: CurrencyType;

    decimals: number;

    locale: string;

    exchangeRate: number;

    enabled: boolean;

    icon?: string;

    flag?: string;
}

/* -------------------------------------------------------------------------- */
/*                         EXCHANGE RATE                                      */
/* -------------------------------------------------------------------------- */

export interface ExchangeRate {

    id: string;

    from: CurrencyCode;

    to: CurrencyCode;

    rate: number;

    provider: ExchangeRateProvider;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                        MONEY CONVERSION                                    */
/* -------------------------------------------------------------------------- */

export interface CurrencyConversion {

    source: Money;

    target: Money;

    exchangeRate: ExchangeRate;

    conversionFee: Money;

    convertedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          MONEY RANGE                                       */
/* -------------------------------------------------------------------------- */

export interface MoneyRange {

    minimum: Money;

    maximum: Money;
}

/* -------------------------------------------------------------------------- */
/*                         PRICE                                               */
/* -------------------------------------------------------------------------- */

export interface Price {

    value: Money;

    discount?: Money;

    tax?: Money;

    final: Money;
}

/* -------------------------------------------------------------------------- */
/*                         FEE                                                 */
/* -------------------------------------------------------------------------- */

export interface Fee {

    id: string;

    name: string;

    amount: Money;

    percentage?: number;

    description?: string;
}

/* -------------------------------------------------------------------------- */
/*                      TAX                                                    */
/* -------------------------------------------------------------------------- */

export interface Tax {

    name: string;

    percentage: number;

    amount: Money;
}

/* -------------------------------------------------------------------------- */
/*                     BALANCE                                                */
/* -------------------------------------------------------------------------- */

export interface Balance {

    available: Money;

    locked: Money;

    pending: Money;

    reserved: Money;

    bonus: Money;

    total: Money;
}

/* -------------------------------------------------------------------------- */
/*                      PROFIT LOSS                                           */
/* -------------------------------------------------------------------------- */

export interface ProfitLoss {

    profit: Money;

    loss: Money;

    net: Money;

    roi: number;
}

/* -------------------------------------------------------------------------- */
/*                       DEFAULTS                                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PRECISION = 2;

export const DEFAULT_ROUNDING_MODE = RoundingMode.HALF_UP;

/* -------------------------------------------------------------------------- */
/*                        PORTFOLIO & HOLDINGS                                */
/* -------------------------------------------------------------------------- */

export interface PortfolioAsset {

    id: string;

    currency: CurrencyCode;

    balance: Money;

    available: Money;

    locked: Money;

    percentage: number;

    marketValue: Money;

    averageAcquisitionPrice?: Money;

    currentPrice?: Money;

    profitLoss?: ProfitLoss;

    updatedAt: Date;
}

export interface Portfolio {

    id: string;

    userId: string;

    baseCurrency: CurrencyCode;

    totalValue: Money;

    totalAvailable: Money;

    totalLocked: Money;

    totalProfitLoss: ProfitLoss;

    assets: PortfolioAsset[];

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          ACCOUNT BALANCES                                  */
/* -------------------------------------------------------------------------- */

export interface AccountBalance {

    accountId: string;

    currency: CurrencyCode;

    balance: Balance;

    lastUpdated: Date;
}

export interface BalanceSnapshot {

    id: string;

    accountId: string;

    balance: Balance;

    recordedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           PAYMENT AMOUNTS                                  */
/* -------------------------------------------------------------------------- */

export interface DepositAmount {

    requested: Money;

    fee: Money;

    tax?: Money;

    received: Money;
}

export interface WithdrawalAmount {

    requested: Money;

    fee: Money;

    tax?: Money;

    payable: Money;
}

export interface TransferAmount {

    source: Money;

    destination: Money;

    fee: Money;

    exchangeRate?: ExchangeRate;
}

/* -------------------------------------------------------------------------- */
/*                          TRADING AMOUNTS                                   */
/* -------------------------------------------------------------------------- */

export interface TradeStake {

    amount: Money;

    leverage?: number;

    margin?: Money;
}

export interface TradePayout {

    stake: Money;

    payout: Money;

    profit: Money;

    percentageReturn: number;
}

export interface MarginRequirement {

    required: Money;

    available: Money;

    freeMargin: Money;

    marginLevel: number;
}

/* -------------------------------------------------------------------------- */
/*                            COMMISSIONS                                     */
/* -------------------------------------------------------------------------- */

export interface Commission {

    id: string;

    name: string;

    amount: Money;

    percentage: number;

    currency: CurrencyCode;

    createdAt: Date;
}

export interface Rebate {

    id: string;

    description: string;

    amount: Money;

    appliedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           BONUS VALUES                                     */
/* -------------------------------------------------------------------------- */

export interface BonusAmount {

    awarded: Money;

    locked: Money;

    available: Money;

    wageringRequirement: number;

    expiresAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                          CASH FLOW                                          */
/* -------------------------------------------------------------------------- */

export interface CashFlow {

    inflow: Money;

    outflow: Money;

    netFlow: Money;

    openingBalance: Money;

    closingBalance: Money;
}

/* -------------------------------------------------------------------------- */
/*                       FINANCIAL LIMITS                                     */
/* -------------------------------------------------------------------------- */

export interface FinancialLimits {

    minimumDeposit: Money;

    maximumDeposit: Money;

    minimumWithdrawal: Money;

    maximumWithdrawal: Money;

    dailyDepositLimit: Money;

    dailyWithdrawalLimit: Money;

    maximumAccountBalance: Money;
}

/* -------------------------------------------------------------------------- */
/*                         MONEY ALLOCATION                                   */
/* -------------------------------------------------------------------------- */

export interface Allocation {

    category: string;

    amount: Money;

    percentage: number;
}

export interface AllocationSummary {

    total: Money;

    allocations: Allocation[];
}

/* -------------------------------------------------------------------------- */
/*                           RESERVES                                         */
/* -------------------------------------------------------------------------- */

export interface ReservedFunds {

    tradeMargin: Money;

    pendingWithdrawal: Money;

    pendingDeposit: Money;

    openOrders: Money;

    totalReserved: Money;
}

/* -------------------------------------------------------------------------- */
/*                         DAILY FINANCIAL SUMMARY                            */
/* -------------------------------------------------------------------------- */

export interface DailyFinancialSummary {

    date: Date;

    deposits: Money;

    withdrawals: Money;

    commissions: Money;

    rebates: Money;

    bonuses: Money;

    tradingProfit: Money;

    tradingLoss: Money;

    netMovement: Money;
}

/* -------------------------------------------------------------------------- */
/*                         MONTHLY FINANCIAL SUMMARY                          */
/* -------------------------------------------------------------------------- */

export interface MonthlyFinancialSummary {

    month: number;

    year: number;

    deposits: Money;

    withdrawals: Money;

    fees: Money;

    commissions: Money;

    profit: Money;

    loss: Money;

    closingBalance: Money;
}

/* -------------------------------------------------------------------------- */
/*                         MONEY FORMAT OPTIONS                               */
/* -------------------------------------------------------------------------- */

export interface MoneyFormatOptions {

    locale: string;

    currency: CurrencyCode;

    minimumFractionDigits: number;

    maximumFractionDigits: number;

    useGrouping: boolean;

    currencyDisplay: "symbol" | "code" | "name";

    signDisplay?: "auto" | "always" | "never" | "exceptZero";
}

/* -------------------------------------------------------------------------- */
/*                        MONEY PRECISION SETTINGS                            */
/* -------------------------------------------------------------------------- */

export interface PrecisionSettings {

    currency: CurrencyCode;

    decimalPlaces: number;

    rounding: RoundingMode;

    allowNegative: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         MONEY COMPARISON                                   */
/* -------------------------------------------------------------------------- */

export interface MoneyComparison {

    left: Money;

    right: Money;

    greaterThan: boolean;

    lessThan: boolean;

    equal: boolean;

    difference: Money;
}

/* -------------------------------------------------------------------------- */
/*                           MONEY AGGREGATE                                  */
/* -------------------------------------------------------------------------- */

export interface MoneyAggregate {

    minimum: Money;

    maximum: Money;

    average: Money;

    median: Money;

    total: Money;

    count: number;
}

/* -------------------------------------------------------------------------- */
/*                            MONEY DTO                                       */
/* -------------------------------------------------------------------------- */

export interface MoneyDTO {

    amount: number;

    currency: CurrencyCode;
}

export interface ExchangeRateDTO {

    from: CurrencyCode;

    to: CurrencyCode;

    rate: number;
}

export interface CurrencyDTO {

    code: CurrencyCode;

    symbol: string;

    decimals: number;
}

/* -------------------------------------------------------------------------- */
/*                         PAYMENT REQUEST DTO                                */
/* -------------------------------------------------------------------------- */

export interface PaymentRequest {

    amount: MoneyDTO;

    reference: string;

    description?: string;
}

export interface PaymentResponse {

    success: boolean;

    transactionId: string;

    processedAmount: Money;

    processedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                        CURRENCY CONVERTER                                  */
/* -------------------------------------------------------------------------- */

export interface CurrencyConverter {

    sourceCurrency: CurrencyCode;

    targetCurrency: CurrencyCode;

    amount: Money;

    convertedAmount: Money;

    exchangeRate: number;

    convertedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         MONEY VALIDATION                                   */
/* -------------------------------------------------------------------------- */

export interface MoneyValidation {

    valid: boolean;

    errors: string[];

    warnings: string[];
}

/* -------------------------------------------------------------------------- */
/*                          DEFAULT CURRENCY INFO                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CURRENCY_INFO: Currency = {

    code: CurrencyCode.USD,

    name: "US Dollar",

    symbol: "$",

    type: CurrencyType.FIAT,

    decimals: 2,

    locale: "en-US",

    exchangeRate: 1,

    enabled: true
};

/* -------------------------------------------------------------------------- */
/*                        DEFAULT FORMAT OPTIONS                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MONEY_FORMAT: MoneyFormatOptions = {

    locale: "en-US",

    currency: CurrencyCode.USD,

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

    useGrouping: true,

    currencyDisplay: "symbol",

    signDisplay: "auto"
};

/* -------------------------------------------------------------------------- */
/*                          COMMON PRECISION                                  */
/* -------------------------------------------------------------------------- */

export const COMMON_PRECISION: Record<CurrencyCode, number> = {

    [CurrencyCode.USD]: 2,

    [CurrencyCode.EUR]: 2,

    [CurrencyCode.GBP]: 2,

    [CurrencyCode.KES]: 2,

    [CurrencyCode.NGN]: 2,

    [CurrencyCode.UGX]: 0,

    [CurrencyCode.TZS]: 0,

    [CurrencyCode.ZAR]: 2,

    [CurrencyCode.GHS]: 2,

    [CurrencyCode.INR]: 2,

    [CurrencyCode.CNY]: 2,

    [CurrencyCode.JPY]: 0,

    [CurrencyCode.AUD]: 2,

    [CurrencyCode.CAD]: 2,

    [CurrencyCode.CHF]: 2,

    [CurrencyCode.USDT]: 2,

    [CurrencyCode.BTC]: 8,

    [CurrencyCode.ETH]: 18
};

/* -------------------------------------------------------------------------- */
/*                         DEFAULT EXCHANGE PROVIDER                          */
/* -------------------------------------------------------------------------- */

export const DEFAULT_EXCHANGE_PROVIDER =
    ExchangeRateProvider.INTERNAL;

/* -------------------------------------------------------------------------- */
/*                         DEFAULT EXCHANGE RATE                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_EXCHANGE_RATE: ExchangeRate = {

    id: "default",

    from: CurrencyCode.USD,

    to: CurrencyCode.USD,

    rate: 1,

    provider: ExchangeRateProvider.INTERNAL,

    timestamp: new Date()
};

/* -------------------------------------------------------------------------- */
/*                         TYPE ALIASES                                       */
/* -------------------------------------------------------------------------- */

export type MonetaryValue = Money;

export type WalletBalance = Balance;

export type Profit = Money;

export type Loss = Money;

export type Stake = Money;

export type Payout = Money;

export type Deposit = Money;

export type Withdrawal = Money;

export type CommissionAmount = Money;

export type TaxAmount = Money;

export type FeeAmount = Money;

/* -------------------------------------------------------------------------- */
/*                         READONLY TYPES                                     */
/* -------------------------------------------------------------------------- */

export type ReadonlyMoney = Readonly<Money>;

export type ReadonlyBalance = Readonly<Balance>;

export type ReadonlyCurrency = Readonly<Currency>;

export type ReadonlyExchangeRate = Readonly<ExchangeRate>;

/* -------------------------------------------------------------------------- */
/*                            END OF FILE                                     */
/* -------------------------------------------------------------------------- */