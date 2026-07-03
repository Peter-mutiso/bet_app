/**
 * ============================================================================
 * TRADING API
 * ============================================================================
 */

import apiClient, {
    API_ENDPOINTS
} from "../api";

import type {

    Trade

} from "../../types";

import {

    PlaceTradeRequest,

    PlaceTradeResponse

} from "./trading.types";

/* -------------------------------------------------------------------------- */
/* PLACE TRADE                                                                */
/* -------------------------------------------------------------------------- */

export async function placeTrade(

    payload: PlaceTradeRequest

): Promise<PlaceTradeResponse> {

    const response =

        await apiClient.post<PlaceTradeResponse>(

            API_ENDPOINTS.TRADING.PLACE,

            payload

        );

    return response.data;

}

/* -------------------------------------------------------------------------- */
/* CLOSE TRADE                                                                */
/* -------------------------------------------------------------------------- */

export async function closeTrade(

    tradeId: string

) {

    const response =

        await apiClient.post(

            API_ENDPOINTS.TRADING.CLOSE,

            {

                tradeId

            }

        );

    return response.data;

}

/* -------------------------------------------------------------------------- */
/* OPEN TRADES                                                                */
/* -------------------------------------------------------------------------- */

export async function getOpenTrades():

Promise<Trade[]> {

    const response =

        await apiClient.get<Trade[]>(

            API_ENDPOINTS.TRADING.ACTIVE

        );

    return response.data;

}

/* -------------------------------------------------------------------------- */
/* TRADE HISTORY                                                              */
/* -------------------------------------------------------------------------- */

export async function getTradeHistory():

Promise<Trade[]> {

    const response =

        await apiClient.get<Trade[]>(

            API_ENDPOINTS.TRADING.HISTORY

        );

    return response.data;

}

/* -------------------------------------------------------------------------- */
/* ACCOUNT BALANCE                                                            */
/* -------------------------------------------------------------------------- */

export async function getBalance():

Promise<number> {

    const response =

        await apiClient.get<number>(

            API_ENDPOINTS.WALLET.BALANCE

        );

    return response.data;

}