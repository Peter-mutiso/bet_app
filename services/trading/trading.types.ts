import {

    Trade

} from "../../types";

export interface PlaceTradeRequest {

    marketId: string;

    contract: string;

    duration: number;

    stake: number;

}

export interface PlaceTradeResponse {

    trade: Trade;

}