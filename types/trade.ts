
export const TRADE_TYPES = [
    "ACCUMULATOR",
    "CALL",
    "PUT",
    "DIGIT_OVER",
    "DIGIT_UNDER",
] as const;

export type TradeType = (typeof TRADE_TYPES)[number];

export type TradeDirection =
    | "BUY"
    | "SELL";


export type TradeStatus =
    | "PENDING"
    | "OPEN"
    | "SETTLING"
    | "CLOSED";


export type TradeSource =
    | "USER"
    | "BOT";



export type TradeResult =
    | "PENDING"
    | "WIN"
    | "LOSS"
    | "DRAW";



/* -------------------------------------------------------------------------- */
/*                             SUPPORT TYPES                                  */
/* -------------------------------------------------------------------------- */


export interface Instrument {

    symbol: string;

    name?: string;

}



export type Timeframe =
    | string;



export interface TradePricing {

    entryPrice: number;

    currentPrice?: number;

    exitPrice?: number;

}



export interface TradeSize {

    volume: number;

}



export interface TradeProfitLoss {

    realizedPnL: number;

    floatingPnL?: number;

}



export interface TradeFees {

    commission?: number;

}



export interface TradeMetadata {

    createdAt?: number;

    updatedAt?: number;

}



/* -------------------------------------------------------------------------- */
/*                             TRADE                                          */
/* -------------------------------------------------------------------------- */


export interface Trade {


    id: string;
    marketId: string;


    accountId?: string;



    /*
    ===============================
    POSITION
    ===============================
    */


    direction: TradeDirection;


    tradeType: TradeType;


    type?: TradeType;



    /*
    ===============================
    INSTRUMENT
    ===============================
    */


    instrument?: Instrument;



    /*
    ===============================
    MONEY
    ===============================
    */


    stake: number;



    size?: TradeSize;



    /*
    ===============================
    PRICE DATA
    ===============================
    */


    entry: number;


    pricing?: TradePricing;


    currentPrice?: number;


    exit?: number;



    /*
    ===============================
    PROFIT
    ===============================
    */


    floatingProfit: number;


    profit?: number;


    profitLoss?: TradeProfitLoss;



    /*
    ===============================
    STATUS
    ===============================
    */


    status: TradeStatus;


    source?: TradeSource;


    result?: TradeResult;



    /*
    ===============================
    TIME
    ===============================
    */


    timeframe?: Timeframe;


    entryTime: number;


    expiryTime: number;


    duration: number;


    remainingSeconds: number;


    exitTime?: number;



    /*
    ===============================
    EXTRA
    ===============================
    */


    fees?: TradeFees;


    metadata?: TradeMetadata;

}