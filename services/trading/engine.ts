/**
 * ============================================================================
 * TRADING ENGINE
 * ============================================================================
 *
 * Central coordinator for the Trading subsystem.
 * Responsible for:
 *  - Trade execution
 *  - Risk validation
 *  - Portfolio management
 *  - Store synchronization
 * ============================================================================
 */

import { useTradeStore } from "../../store/useTradeStore";

import { RiskManager } from "./risk-manager";
import { PortfolioManager } from "./portfolio-manager";
import { TradeExecution } from "./execution";

import type { TradeRequest } from "../../types";

import {

    tradingScheduler

} from "./scheduler";
export class TradingEngine {

    private static instance: TradingEngine | null = null;

    private readonly portfolio =

        new PortfolioManager();

    private readonly execution =

        new TradeExecution();

    private risk?: RiskManager;

    private constructor() {}

    /* ---------------------------------------------------------------------- */
    /* SINGLETON                                                              */
    /* ---------------------------------------------------------------------- */

    public static getInstance(): TradingEngine {

        if (

            !TradingEngine.instance

        ) {

            TradingEngine.instance =

                new TradingEngine();

        }

        return TradingEngine.instance;

    }

    /* ---------------------------------------------------------------------- */
    /* RISK                                                                    */
    /* ---------------------------------------------------------------------- */

    public attachRiskManager(

        manager: RiskManager

    ): void {

        this.risk = manager;

    }

    /* ---------------------------------------------------------------------- */
/* CONTRACT EXPIRY                                                        */
/* ---------------------------------------------------------------------- */

public scheduleContractExpiry(

    tradeId: string,

    durationMs: number

): void {

    tradingScheduler.scheduleTimeout(

        tradeId,

        durationMs,

        () => {

            this.closeTrade(

                tradeId

            );

        }

    );

}

    /* ---------------------------------------------------------------------- */
    /* EXECUTE TRADE                                                           */
    /* ---------------------------------------------------------------------- */

    public async executeTrade(

        request: TradeRequest

    ): Promise<void> {

        const store =

            useTradeStore.getState();

        if (

            request.stake <= 0

        ) {

            throw new Error(

                "Stake must be greater than zero."

            );

        }

        if (

            request.stake >

            store.balance

        ) {

            throw new Error(

                "Insufficient balance."

            );

        }

        if (

            this.risk

        ) {

            // Risk evaluation will be connected
            // once TradingSignal generation is completed.
        }

        store.setSelectedInstrument(

            request.marketId

        );

        store.setCurrentTradeType(

            request.contract as "PUT" | "ACCUMULATOR" | "CALL" | "DIGIT_OVER" | "DIGIT_UNDER"

        );

        store.setStake(

            request.stake

        );

        const result =

    await this.execution.execute(

        request

    );

if (

    !result.success

) {

    throw new Error(

        result.message

    );

}

store.buy();
if(
  result.tradeId
){
  this.scheduleContractExpiry(
    result.tradeId,
    request.duration * 1000
  );
}

    }

    /* ---------------------------------------------------------------------- */
    /* CLOSE TRADE                                                             */
    /* ---------------------------------------------------------------------- */

    public closeTrade(

        tradeId: string

    ): void {

        const store =

            useTradeStore.getState();

        store.closeTrade(

            tradeId

        );

    }

    /* ---------------------------------------------------------------------- */
    /* ACTIVE POSITIONS                                                        */
    /* ---------------------------------------------------------------------- */

    public getActiveTrades() {

        const store =

            useTradeStore.getState();

        return store.trades.filter(

            trade =>

                trade.status === "OPEN"

        );

    }

    /* ---------------------------------------------------------------------- */
    /* TRADE HISTORY                                                           */
    /* ---------------------------------------------------------------------- */

    public getTradeHistory() {

        const store =

            useTradeStore.getState();

        return store.trades.filter(

            trade =>

                trade.status === "CLOSED"

        );

    }

    /* ---------------------------------------------------------------------- */
    /* BALANCE                                                                 */
    /* ---------------------------------------------------------------------- */

    public getBalance(): number {

        return useTradeStore

            .getState()

            .balance;

    }

    /* ---------------------------------------------------------------------- */
    /* PRICE UPDATE                                                            */
    /* ---------------------------------------------------------------------- */

    public updatePrice(

        price: number

    ): void {

        useTradeStore

            .getState()

            .setPrice(

                price

            );

        
        useTradeStore
.getState()
.updateOpenTrades(price);
    }

    /* ---------------------------------------------------------------------- */
    /* PORTFOLIO                                                               */
    /* ---------------------------------------------------------------------- */

    public getPortfolio() {

        return this.portfolio;

    }

}

/* -------------------------------------------------------------------------- */
/* FACTORY                                                                    */
/* -------------------------------------------------------------------------- */

export function createTradingEngine():

TradingEngine {

    return TradingEngine.getInstance();

}