/**
 * ============================================================================
 * POSITION MODEL
 * ============================================================================
 */

export interface Position {

    readonly id: string;

    readonly symbol: string;

    readonly stake: number;

    readonly entryPrice: number;

    readonly currentPrice: number;

    readonly profit: number;

    readonly status: string;

}