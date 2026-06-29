/**
 * ============================================================================
 * TRADING SIGNAL
 * ============================================================================
 * Standard trading signal model used throughout the trading engine.
 *
 * This file defines the canonical representation of every trading opportunity.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                             DIRECTION                                      */
/* -------------------------------------------------------------------------- */

export enum SignalDirection {

    BUY = "BUY",

    SELL = "SELL",

    HOLD = "HOLD"

}

/* -------------------------------------------------------------------------- */
/*                               STATUS                                       */
/* -------------------------------------------------------------------------- */

export enum SignalStatus {

    CREATED = "CREATED",

    VALIDATED = "VALIDATED",

    APPROVED = "APPROVED",

    REJECTED = "REJECTED",

    EXECUTING = "EXECUTING",

    EXECUTED = "EXECUTED",

    EXPIRED = "EXPIRED",

    CANCELLED = "CANCELLED"

}

/* -------------------------------------------------------------------------- */
/*                               PRIORITY                                     */
/* -------------------------------------------------------------------------- */

export enum SignalPriority {

    VERY_LOW = 1,

    LOW = 2,

    NORMAL = 3,

    HIGH = 4,

    CRITICAL = 5

}

/* -------------------------------------------------------------------------- */
/*                             STRENGTH                                       */
/* -------------------------------------------------------------------------- */

export enum SignalStrength {

    VERY_WEAK = 20,

    WEAK = 40,

    MODERATE = 60,

    STRONG = 80,

    VERY_STRONG = 100

}

/* -------------------------------------------------------------------------- */
/*                             ORIGIN                                         */
/* -------------------------------------------------------------------------- */

export enum SignalOrigin {

    EMA = "EMA",

    RSI = "RSI",

    MACD = "MACD",

    STOCHASTIC = "STOCHASTIC",

    BOLLINGER = "BOLLINGER",

    BREAKOUT = "BREAKOUT",

    AI = "AI",

    MANUAL = "MANUAL",

    CUSTOM = "CUSTOM"

}

/* -------------------------------------------------------------------------- */
/*                           PRICE TARGETS                                    */
/* -------------------------------------------------------------------------- */

export interface PriceTargets {

    readonly entry: number;

    readonly stopLoss: number;

    readonly takeProfit: number;

}

/* -------------------------------------------------------------------------- */
/*                           RISK PROFILE                                     */
/* -------------------------------------------------------------------------- */

export interface RiskProfile {

    readonly riskRewardRatio: number;

    readonly maximumLoss: number;

    readonly expectedProfit: number;

    readonly positionSize: number;

}

/* -------------------------------------------------------------------------- */
/*                          SIGNAL METADATA                                   */
/* -------------------------------------------------------------------------- */

export interface SignalMetadata {

    readonly strategy: string;

    readonly strategyVersion: string;

    readonly timeframe: string;

    readonly symbol: string;

    readonly market: string;

    readonly indicators:

    Readonly<Record<string, number>>;

}

/* -------------------------------------------------------------------------- */
/*                          TRADING SIGNAL                                    */
/* -------------------------------------------------------------------------- */

export interface TradingSignal {

    readonly id: string;

    readonly direction: SignalDirection;

    readonly status: SignalStatus;

    readonly priority: SignalPriority;

    readonly strength: SignalStrength;

    readonly confidence: number;

    readonly origin: SignalOrigin;

    readonly prices: PriceTargets;

    readonly risk: RiskProfile;

    readonly metadata: SignalMetadata;

    readonly createdAt: Date;

    readonly expiresAt: Date;

}
/* -------------------------------------------------------------------------- */
/*                           BUILDER INPUT                                    */
/* -------------------------------------------------------------------------- */

export interface TradingSignalBuilder {

    id?: string;

    direction: SignalDirection;

    priority?: SignalPriority;

    strength?: SignalStrength;

    confidence: number;

    origin: SignalOrigin;

    prices: PriceTargets;

    risk: RiskProfile;

    metadata: SignalMetadata;

    createdAt?: Date;

    expiresAt: Date;

}

/* -------------------------------------------------------------------------- */
/*                            VALIDATION RESULT                               */
/* -------------------------------------------------------------------------- */

export interface ValidationResult {

    readonly valid: boolean;

    readonly errors: readonly string[];

}

/* -------------------------------------------------------------------------- */
/*                              VALIDATION                                    */
/* -------------------------------------------------------------------------- */

export function validateSignal(

    signal: TradingSignal

): ValidationResult {

    const errors: string[] = [];

    if (

        signal.confidence < 0 ||

        signal.confidence > 1

    ) {

        errors.push(

            "Confidence must be between 0 and 1."

        );

    }

    if (

        signal.prices.entry <= 0

    ) {

        errors.push(

            "Entry price must be positive."

        );

    }

    if (

        signal.risk.positionSize <= 0

    ) {

        errors.push(

            "Position size must be positive."

        );

    }

    if (

        signal.expiresAt <= signal.createdAt

    ) {

        errors.push(

            "Expiration must be after creation."

        );

    }

    if (

        signal.metadata.symbol.length === 0

    ) {

        errors.push(

            "Symbol cannot be empty."

        );

    }

    if (

        signal.metadata.strategy.length === 0

    ) {

        errors.push(

            "Strategy name cannot be empty."

        );

    }

    return {

        valid:

            errors.length === 0,

        errors

    };

}

/* -------------------------------------------------------------------------- */
/*                             ID GENERATOR                                   */
/* -------------------------------------------------------------------------- */

function generateSignalId(): string {

    return [

        "SIG",

        Date.now(),

        Math.random()

            .toString(36)

            .substring(2, 10)

    ].join("-");

}

/* -------------------------------------------------------------------------- */
/*                              FACTORY                                       */
/* -------------------------------------------------------------------------- */

export function createSignal(

    builder: TradingSignalBuilder

): TradingSignal {

    const signal: TradingSignal = {

        id:

            builder.id ??

            generateSignalId(),

        direction:

            builder.direction,

        status:

            SignalStatus.CREATED,

        priority:

            builder.priority ??

            SignalPriority.NORMAL,

        strength:

            builder.strength ??

            SignalStrength.MODERATE,

        confidence:

            builder.confidence,

        origin:

            builder.origin,

        prices:

            Object.freeze({

                ...builder.prices

            }),

        risk:

            Object.freeze({

                ...builder.risk

            }),

        metadata:

            Object.freeze({

                ...builder.metadata

            }),

        createdAt:

            builder.createdAt ??

            new Date(),

        expiresAt:

            builder.expiresAt

    };

    const validation =

        validateSignal(

            signal

        );

    if (

        !validation.valid

    ) {

        throw new Error(

            validation.errors.join(

                "\n"

            )

        );

    }

    return Object.freeze(

        signal

    );

}

/* -------------------------------------------------------------------------- */
/*                             CLONING                                        */
/* -------------------------------------------------------------------------- */

export function cloneSignal(

    signal: TradingSignal

): TradingSignal {

    return createSignal({

        ...signal,

        createdAt:

            new Date(

                signal.createdAt

            ),

        expiresAt:

            new Date(

                signal.expiresAt

            )

    });

}
/* -------------------------------------------------------------------------- */
/*                         EXPIRATION                                         */
/* -------------------------------------------------------------------------- */

export function hasExpired(

    signal: TradingSignal

): boolean {

    return new Date() >= signal.expiresAt;

}

export function remainingLifetime(

    signal: TradingSignal

): number {

    return Math.max(

        0,

        signal.expiresAt.getTime() -

        Date.now()

    );

}

/* -------------------------------------------------------------------------- */
/*                       EXECUTION HELPERS                                    */
/* -------------------------------------------------------------------------- */

export function canExecute(

    signal: TradingSignal

): boolean {

    return (

        signal.status ===

        SignalStatus.APPROVED &&

        !hasExpired(

            signal

        )

    );

}

export function requiresExecution(

    signal: TradingSignal

): boolean {

    return (

        signal.direction !==

        SignalDirection.HOLD

    );

}

/* -------------------------------------------------------------------------- */
/*                         RISK HELPERS                                       */
/* -------------------------------------------------------------------------- */

export function riskAmount(

    signal: TradingSignal

): number {

    return signal.risk.maximumLoss;

}

export function expectedProfit(

    signal: TradingSignal

): number {

    return signal.risk.expectedProfit;

}

export function riskRewardRatio(

    signal: TradingSignal

): number {

    return signal.risk.riskRewardRatio;

}

export function positionSize(

    signal: TradingSignal

): number {

    return signal.risk.positionSize;

}

/* -------------------------------------------------------------------------- */
/*                      PRICE HELPERS                                         */
/* -------------------------------------------------------------------------- */

export function entryPrice(

    signal: TradingSignal

): number {

    return signal.prices.entry;

}

export function stopLoss(

    signal: TradingSignal

): number {

    return signal.prices.stopLoss;

}

export function takeProfit(

    signal: TradingSignal

): number {

    return signal.prices.takeProfit;

}

/* -------------------------------------------------------------------------- */
/*                     STATUS HELPERS                                         */
/* -------------------------------------------------------------------------- */

export function withStatus(

    signal: TradingSignal,

    status: SignalStatus

): TradingSignal {

    return Object.freeze({

        ...signal,

        status

    });

}

export function approve(

    signal: TradingSignal

): TradingSignal {

    return withStatus(

        signal,

        SignalStatus.APPROVED

    );

}

export function reject(

    signal: TradingSignal

): TradingSignal {

    return withStatus(

        signal,

        SignalStatus.REJECTED

    );

}

export function execute(

    signal: TradingSignal

): TradingSignal {

    return withStatus(

        signal,

        SignalStatus.EXECUTING

    );

}

export function complete(

    signal: TradingSignal

): TradingSignal {

    return withStatus(

        signal,

        SignalStatus.EXECUTED

    );

}

/* -------------------------------------------------------------------------- */
/*                        SCORING                                             */
/* -------------------------------------------------------------------------- */

export function score(

    signal: TradingSignal

): number {

    return (

        signal.confidence *

        signal.strength *

        signal.priority

    );

}
/* -------------------------------------------------------------------------- */
/*                          SERIALIZATION                                     */
/* -------------------------------------------------------------------------- */

export interface SerializedTradingSignal {

    readonly id: string;

    readonly direction: SignalDirection;

    readonly status: SignalStatus;

    readonly priority: SignalPriority;

    readonly strength: SignalStrength;

    readonly confidence: number;

    readonly origin: SignalOrigin;

    readonly prices: PriceTargets;

    readonly risk: RiskProfile;

    readonly metadata: SignalMetadata;

    readonly createdAt: string;

    readonly expiresAt: string;

}

export function serialize(

    signal: TradingSignal

): SerializedTradingSignal {

    return {

        ...signal,

        createdAt:

            signal.createdAt.toISOString(),

        expiresAt:

            signal.expiresAt.toISOString()

    };

}

export function deserialize(

    signal: SerializedTradingSignal

): TradingSignal {

    return createSignal({

        ...signal,

        createdAt:

            new Date(

                signal.createdAt

            ),

        expiresAt:

            new Date(

                signal.expiresAt

            )

    });

}

/* -------------------------------------------------------------------------- */
/*                           COMPARISON                                       */
/* -------------------------------------------------------------------------- */

export function compareSignals(

    left: TradingSignal,

    right: TradingSignal

): number {

    return (

        score(

            right

        ) -

        score(

            left

        )

    );

}

export function sortSignals(

    signals:

    readonly TradingSignal[]

): TradingSignal[] {

    return [

        ...signals

    ].sort(

        compareSignals

    );

}

export function highestPriority(

    signals:

    readonly TradingSignal[]

): TradingSignal | undefined {

    if (

        signals.length === 0

    ) {

        return undefined;

    }

    return sortSignals(

        signals

    )[0];

}

/* -------------------------------------------------------------------------- */
/*                        DISPLAY                                             */
/* -------------------------------------------------------------------------- */

export function description(

    signal: TradingSignal

): string {

    return [

        signal.direction,

        signal.metadata.symbol,

        signal.metadata.timeframe,

        `${(

            signal.confidence * 100

        ).toFixed(

            1

        )}%`

    ].join(

        " | "

    );

}

/* -------------------------------------------------------------------------- */
/*                         EQUALITY                                           */
/* -------------------------------------------------------------------------- */

export function equals(

    left: TradingSignal,

    right: TradingSignal

): boolean {

    return left.id === right.id;

}

/* -------------------------------------------------------------------------- */
/*                      EXPORT COLLECTION                                     */
/* -------------------------------------------------------------------------- */

export const SignalUtilities = Object.freeze({

    createSignal,

    cloneSignal,

    validateSignal,

    serialize,

    deserialize,

    compareSignals,

    sortSignals,

    highestPriority,

    description,

    equals,

    score,

    approve,

    reject,

    execute,

    complete,

    canExecute,

    hasExpired,

    remainingLifetime

});