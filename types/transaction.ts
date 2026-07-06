import {
    Timestamped,
    UUID
} from "./common";

/* =========================================================
   TRANSACTION TYPES
========================================================= */

export type TransactionType =
    | "TRADE_OPEN"
    | "TRADE_SETTLEMENT"
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "BONUS"
    | "COMMISSION"
    | "TRANSFER";

/* =========================================================
   TRANSACTION STATUS
========================================================= */

export type TransactionStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

/* =========================================================
   TRANSACTION MODEL
========================================================= */

export interface Transaction extends Timestamped {

    id: UUID;

    /**
     * Type of account transaction.
     */
    type: TransactionType;

    /**
     * Related trade (if applicable).
     */
    tradeId?: UUID;

    /**
     * Related market (if applicable).
     */
    marketId?: UUID;

    /**
     * Human-readable description.
     * Example:
     * "Opened RISE contract on Volatility 75"
     */
    description: string;

    /**
     * Positive = credit
     * Negative = debit
     */
    amount: number;

    /**
     * Account balance immediately after this transaction.
     */
    balanceAfter: number;

    /**
     * Transaction status.
     */
    status: TransactionStatus;

    /**
     * Optional reference number
     * (useful for deposits/withdrawals).
     */
    reference?: string;

    /**
     * Optional notes.
     */
    notes?: string;
}