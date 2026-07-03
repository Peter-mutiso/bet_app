/**
 * ============================================================================
 * INSTRUMENT TYPES
 * ============================================================================
 * Canonical trading instrument definitions.
 *
 * IMPORTANT:
 * This file owns everything related to a tradable instrument.
 *
 * Used by:
 * - market.ts
 * - candle.ts
 * - chart.ts
 * - trading/*
 * - websocket/*
 * - watchlists
 * - AI engine
 * ============================================================================
 */

import {
    MarketType,
    InstrumentStatus,
    SymbolCategory,
    ContractType,
    ExecutionType,
    TradingMode,
    ExchangeRegion
} from "./enums";

import { CurrencyCode } from "../common/enums";

/* -------------------------------------------------------------------------- */
/*                               EXCHANGE                                     */
/* -------------------------------------------------------------------------- */

export interface Exchange {

    id: string;

    code: string;

    name: string;

    region: ExchangeRegion;

    timezone: string;

    website?: string;

    enabled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           TRADING SESSION                                  */
/* -------------------------------------------------------------------------- */

export interface InstrumentTradingSession {

    day: number;

    open: string;

    close: string;

    enabled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          PRICE PRECISION                                   */
/* -------------------------------------------------------------------------- */

export interface InstrumentPrecision {

    digits: number;

    pip: number;

    tickSize: number;

    stepSize: number;
}

/* -------------------------------------------------------------------------- */
/*                           PRICE LIMITS                                     */
/* -------------------------------------------------------------------------- */

export interface InstrumentPriceLimits {

    minimumPrice?: number;

    maximumPrice?: number;

    minimumDistance?: number;
}

/* -------------------------------------------------------------------------- */
/*                           ORDER LIMITS                                     */
/* -------------------------------------------------------------------------- */

export interface InstrumentOrderLimits {

    minimumVolume: number;

    maximumVolume: number;

    volumeStep: number;

    maximumOpenPositions?: number;

    maximumPendingOrders?: number;
}

/* -------------------------------------------------------------------------- */
/*                          MARGIN REQUIREMENTS                               */
/* -------------------------------------------------------------------------- */

export interface MarginRequirement {

    initialMargin: number;

    maintenanceMargin: number;

    leverage: number;
}

/* -------------------------------------------------------------------------- */
/*                           SWAP INFORMATION                                 */
/* -------------------------------------------------------------------------- */

export interface SwapInformation {

    long: number;

    short: number;

    tripleSwapDay?: number;
}

/* -------------------------------------------------------------------------- */
/*                          CONTRACT SPECIFICATION                            */
/* -------------------------------------------------------------------------- */

export interface ContractSpecification {

    contractType: ContractType;

    contractSize: number;

    quoteCurrency: CurrencyCode;

    baseCurrency?: CurrencyCode;

    settlementCurrency?: CurrencyCode;
}

/* -------------------------------------------------------------------------- */
/*                            FEES                                            */
/* -------------------------------------------------------------------------- */

export interface InstrumentFees {

    commission?: number;

    makerFee?: number;

    takerFee?: number;

    overnightFee?: number;
}

/* -------------------------------------------------------------------------- */
/*                              INSTRUMENT                                    */
/* -------------------------------------------------------------------------- */

export interface Instrument {

    id: string;

    symbol: string;

    displayName: string;

    shortName?: string;

    description?: string;

    marketType: MarketType;

    category: SymbolCategory;

    status: InstrumentStatus;

    exchange: Exchange;

    precision: InstrumentPrecision;

    contract: ContractSpecification;

    execution: ExecutionType;

    tradingMode: TradingMode;

    orderLimits: InstrumentOrderLimits;

    margin: MarginRequirement;

    swap?: SwapInformation;

    fees?: InstrumentFees;

    priceLimits?: InstrumentPriceLimits;

    sessions: InstrumentTradingSession[];

    tags?: string[];

    icon?: string;

    color?: string;

    tradable: boolean;

    visible: boolean;

    favorite?: boolean;

    createdAt?: Date;

    updatedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                        SYMBOL INFORMATION                                  */
/* -------------------------------------------------------------------------- */

export interface SymbolInformation {

    symbol: string;

    displayName: string;

    marketType: MarketType;

    category: SymbolCategory;

    tradable: boolean;

    exchange: string;
}

/* -------------------------------------------------------------------------- */
/*                        SEARCH RESULT                                       */
/* -------------------------------------------------------------------------- */

export interface InstrumentSearchResult {

    total: number;

    items: Instrument[];
}

/* -------------------------------------------------------------------------- */
/*                        COLLECTION TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface InstrumentCollection {

    items: Instrument[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                          LOOKUP MAPS                                       */
/* -------------------------------------------------------------------------- */

export type InstrumentMap = Record<string, Instrument>;

export type ExchangeMap = Record<string, Exchange>;

/* -------------------------------------------------------------------------- */
/*                           CALLBACKS                                        */
/* -------------------------------------------------------------------------- */

export type InstrumentHandler = (

    instrument: Instrument

) => void;

export type ExchangeHandler = (

    exchange: Exchange

) => void;

/* -------------------------------------------------------------------------- */
/*                           READONLY TYPES                                   */
/* -------------------------------------------------------------------------- */

export type ReadonlyInstrument =
    Readonly<Instrument>;

export type ReadonlyExchange =
    Readonly<Exchange>;

/* -------------------------------------------------------------------------- */
/*                         DEFAULT VALUES                                     */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PRECISION: InstrumentPrecision = {

    digits: 5,

    pip: 0.0001,

    tickSize: 0.00001,

    stepSize: 0.01
};

export const DEFAULT_ORDER_LIMITS: InstrumentOrderLimits = {

    minimumVolume: 0.01,

    maximumVolume: 100,

    volumeStep: 0.01
};

export const DEFAULT_MARGIN: MarginRequirement = {

    initialMargin: 100,

    maintenanceMargin: 50,

    leverage: 100
};

/* -------------------------------------------------------------------------- */
/*                             END OF FILE                                    */
/* -------------------------------------------------------------------------- */