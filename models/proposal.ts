/**
 * ============================================================================
 * PROPOSAL MODEL
 * ============================================================================
 */

export interface Proposal {

    readonly id: string;

    readonly symbol: string;

    readonly contractType: string;

    readonly stake: number;

    readonly payout: number;

    readonly askPrice: number;

    readonly spot?: number;

    readonly expiry?: Date | string | number;

}