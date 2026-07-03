/**
 * ============================================================================
 * PRICE TYPES
 * ============================================================================
 * Canonical market pricing models.
 *
 * This file owns:
 * - Tick
 * - Quote
 * - Bid/Ask
 * - Spread
 * - Price snapshots
 * - Streaming price models
 * ============================================================================
 */

import { Instrument } from "./instrument";

/* -------------------------------------------------------------------------- */
/*                              ENUMS                                         */
/* -------------------------------------------------------------------------- */

export enum PriceSource {

    LIVE = "LIVE",

    HISTORICAL = "HISTORICAL",

    SIMULATED = "SIMULATED",

    CACHE = "CACHE"
}

export enum TickDirection {

    UP = "UP",

    DOWN = "DOWN",

    UNCHANGED = "UNCHANGED"
}

/* -------------------------------------------------------------------------- */
/*                              BID / ASK                                     */
/* -------------------------------------------------------------------------- */

export interface BidAsk {

    bid: number;

    ask: number;
}

/* -------------------------------------------------------------------------- */
/*                              SPREAD                                        */
/* -------------------------------------------------------------------------- */

export interface Spread {

    value: number;

    percentage: number;
}

/* -------------------------------------------------------------------------- */
/*                             MARKET PRICE                                   */
/* -------------------------------------------------------------------------- */

export interface MarketPrice {

    bid: number;

    ask: number;

    mid: number;

    last: number;

    spread: number;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                                TICK                                        */
/* -------------------------------------------------------------------------- */

export interface MarketTick {

    symbol: string;

    price: number;

    bid: number;

    ask: number;

    volume?: number;

    direction: TickDirection;

    epoch: number;

    timestamp: Date;

    source: PriceSource;
}

/* -------------------------------------------------------------------------- */
/*                                QUOTE                                       */
/* -------------------------------------------------------------------------- */

export interface Quote {

    instrument: Instrument;

    price: MarketPrice;

    dailyOpen?: number;

    dailyHigh?: number;

    dailyLow?: number;

    dailyClose?: number;

    change?: number;

    changePercent?: number;

    volume?: number;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           PRICE SNAPSHOT                                   */
/* -------------------------------------------------------------------------- */

export interface MarketSnapshot {

    instrument: Instrument;

    quote: Quote;

    tick: MarketTick;

    capturedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         STREAMING PRICE                                    */
/* -------------------------------------------------------------------------- */

export interface StreamingPrice {

    instrumentId: string;

    tick: MarketTick;

    receivedAt: Date;

    latency: number;
}

/* -------------------------------------------------------------------------- */
/*                       HISTORICAL PRICE                                     */
/* -------------------------------------------------------------------------- */

export interface HistoricalPrice {

    timestamp: Date;

    open: number;

    high: number;

    low: number;

    close: number;

    volume?: number;
}

/* -------------------------------------------------------------------------- */
/*                        PRICE COLLECTION                                    */
/* -------------------------------------------------------------------------- */

export interface QuoteCollection {

    items: Quote[];

    total: number;
}

export interface TickCollection {

    items: MarketTick[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                             LOOKUP MAPS                                    */
/* -------------------------------------------------------------------------- */

export type QuoteMap = Record<string, Quote>;

export type TickMap = Record<string, MarketTick>;

export type PriceMap = Record<string, MarketPrice>;

/* -------------------------------------------------------------------------- */
/*                         CALLBACK TYPES                                     */
/* -------------------------------------------------------------------------- */

export type TickHandler = (

    tick: MarketTick

) => void;

export type QuoteHandler = (

    quote: Quote

) => void;

export type SnapshotHandler = (

    snapshot: MarketSnapshot

) => void;

/* -------------------------------------------------------------------------- */
/*                         READONLY TYPES                                     */
/* -------------------------------------------------------------------------- */

export type ReadonlyTick =
    Readonly<MarketTick>;

export type ReadonlyQuote =
    Readonly<Quote>;

export type ReadonlyPrice =
    Readonly<MarketPrice>;

export type ReadonlySnapshot =
    Readonly<MarketSnapshot>;

/* -------------------------------------------------------------------------- */
/*                        DEFAULT VALUES                                      */
/* -------------------------------------------------------------------------- */

export const DEFAULT_MARKET_PRICE: MarketPrice = {

    bid: 0,

    ask: 0,

    mid: 0,

    last: 0,

    spread: 0,

    timestamp: new Date()
};

/* -------------------------------------------------------------------------- */
/*                             END OF FILE                                    */
/* -------------------------------------------------------------------------- */