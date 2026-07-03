// Placeholder for unfinished scaffold code. Rebuild this module when the feature is wired in.
export {};

/**
 * ============================================================================
 * TRADING SIGNAL
 * ============================================================================
 */

export type SignalType =

    | "BUY"

    | "SELL"

    | "HOLD";

export interface TradingSignal {

    type: SignalType;

    confidence: number;

    reason: string;

}