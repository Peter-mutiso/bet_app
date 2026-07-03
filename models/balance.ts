/**
 * ============================================================================
 * BALANCE MODEL
 * ============================================================================
 */

export interface Balance {

    readonly balance: number;

    readonly available: number;

    readonly locked: number;

    readonly currency: string;

}