// Placeholder for unfinished scaffold code. Rebuild this module when the feature is wired in.
export {};

/**
 * ============================================================================
 * TRADING STRATEGY
 * ============================================================================
 */

import { TradingSignal } from "./signal";

export interface TradingStrategy {

    generateSignal(

        prices: number[]

    ): TradingSignal;

}