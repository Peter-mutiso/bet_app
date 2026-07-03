/**
 * ============================================================================
 * TRADE EXECUTION
 * ============================================================================
 */

import tradingService from "./trading.service";

import type {

    TradeRequest

} from "../../types";

export interface ExecutionResult {

    success: boolean;

    tradeId?: string;

    message?: string;

}

export class TradeExecution {

    public async execute(

        request: TradeRequest

    ): Promise<ExecutionResult> {

        try {

            const response =

                await tradingService.placeTrade(

                    request

                );

            return {

                success: true,

                tradeId:

                    response.trade.id

            };

        }

        catch (

            error

        ) {

            return {

                success: false,

                message:

                    error instanceof Error

                        ? error.message

                        : "Trade execution failed."

            };

        }

    }

}