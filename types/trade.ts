import {

    Timestamped,

    UUID

} from "./common";

export type ContractType =

    | "RISE"

    | "FALL"

    | "HIGHER"

    | "LOWER"

    | "TOUCH"

    | "NO_TOUCH"

    | "DIGIT_OVER"

    | "DIGIT_UNDER";

export interface Trade extends Timestamped {

    id: UUID;

    marketId: UUID;

    contract: ContractType;

    duration: number;

    stake: number;

    payout: number;

    entryPrice: number;

    currentPrice: number;

    status:

        | "PENDING"

        | "OPEN"

        | "WON"

        | "LOST";

}