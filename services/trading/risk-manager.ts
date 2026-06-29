/**
 * ============================================================================
 * RISK MANAGER
 * ============================================================================
 * Evaluates whether a trade is allowed under the configured risk rules.
 * ============================================================================
 */

import { TradingSignal } from "./signal";
import { Balance } from "../models/balance";
import { Position } from "../models/position";

/* -------------------------------------------------------------------------- */
/*                            CONFIGURATION                                   */
/* -------------------------------------------------------------------------- */

export interface RiskConfiguration {

    readonly maximumOpenPositions: number;

    readonly maximumRiskPerTrade: number;

    readonly minimumBalance: number;

    readonly dailyLossLimit: number;

    readonly minimumConfidence: number;

}

/* -------------------------------------------------------------------------- */
/*                             DECISION                                       */
/* -------------------------------------------------------------------------- */

export interface RiskDecision {

    readonly approved: boolean;

    readonly reason: string;

}

/* -------------------------------------------------------------------------- */
/*                          RISK MANAGER                                      */
/* -------------------------------------------------------------------------- */

export class RiskManager {

    constructor(

        private readonly configuration:

        RiskConfiguration

    ) {}

    public evaluate(

        signal: TradingSignal,

        balance: Balance,

        positions: readonly Position[],

        dailyLoss: number

    ): RiskDecision {

        if (

            signal.confidence <

            this.configuration.minimumConfidence

        ) {

            return {

                approved: false,

                reason: "Signal confidence below minimum threshold."

            };

        }

        if (

            balance.balance <

            this.configuration.minimumBalance

        ) {

            return {

                approved: false,

                reason: "Insufficient account balance."

            };

        }

        if (

            positions.length >=

            this.configuration.maximumOpenPositions

        ) {

            return {

                approved: false,

                reason: "Maximum number of open positions reached."

            };

        }

        if (

            dailyLoss >=

            this.configuration.dailyLossLimit

        ) {

            return {

                approved: false,

                reason: "Daily loss limit exceeded."

            };

        }

        return {

            approved: true,

            reason: "Trade approved."

        };

    }

    public configuration():

    RiskConfiguration {

        return this.configuration;

    }

}