import { Bet } from "../../types";

export function mapBet(raw: any): Bet {

    return {

        id: raw.id,

        marketId: raw.marketId,

        market: raw.market,

        stake: raw.stake,

        payout: raw.payout,

        status: raw.status,

        createdAt: raw.createdAt,

        updatedAt: raw.updatedAt

    };

}