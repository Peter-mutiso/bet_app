import {

    Timestamped,

    UUID

} from "./common";

export interface Bet extends Timestamped {

    id: UUID;

    marketId: UUID;

    market: string;

    stake: number;

    payout: number;

    status:

        | "OPEN"

        | "WON"

        | "LOST"

        | "VOID";

}