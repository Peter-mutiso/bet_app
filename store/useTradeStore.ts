"use client";
import type {
    Trade,
    TradeType,
    TradeStatus,
} from "@/types/trade";

import {
    TRADE_TYPES,
} from "@/types/trade";


import { create } from "zustand";
import { settlementManager } from "@/lib/settlementManager";



export type Currency = "USD" | "KES";

export type ChartType =
    | "candles"
    | "ohlc"
    | "line"
    | "area";
export type Timeframe =
    | "1T"
    | "5T"
    | "15T"
    | "1H"
    | "4H"
    | "1D";

export type Indicator =
    | "EMA (9)"
    | "EMA (21)"
    | "EMA (50)"
    | "SMA (20)"
    | "RSI"
    | "MACD"
    | "Bollinger Bands"
    | "Stochastic"
    | "ATR"
    | "VWAP";

export const TRADE_TYPE_LABELS: Record<TradeType, string> = {
  ACCUMULATOR: "Accumulator",
  CALL: "Rise",
  PUT: "Fall",
  DIGIT_OVER: "Digit Over",
  DIGIT_UNDER: "Digit Under",
};

export function getAllowedTradeTypesForInstrument(instrument: string): readonly TradeType[] {
  if (instrument.includes("Forex")) {
    return ["CALL", "PUT"];
  }

  if (instrument.includes("Volatility")) {
    return ["ACCUMULATOR", "CALL", "PUT", "DIGIT_OVER", "DIGIT_UNDER"];
  }

  return ["ACCUMULATOR", "CALL", "PUT"];
}


export type AccountMode = "DEMO" | "REAL";




interface DemoAccount {
  id: string;
  name: string;
  balance: number;
}

export interface SelectedMarket {
    id?: string;

    symbol: string;

    name: string;

    category: string;

    price: number;

    change: number;

    bid?: number;

    ask?: number;

    spread?: number;

    high?: number;

    low?: number;

    volume?: number;

    tickDirection?: "up" | "down" | "flat";
     favorite?: boolean;
}

interface TradeState {
  price: number;
  /*
=========================================================
LIVE PRICES FOR EVERY MARKET
=========================================================
*/
marketPrices: Record<string, number>;

  stake: number;
  duration:number;
  balance: number;
  currency: Currency;
  exchangeRate: number;
  theme: "dark" | "light";
  accountMode: AccountMode;
  selectedDemoAccount?: string;
  demoAccounts: DemoAccount[];
  trades: Trade[];
  volatilityState: 0 | 1 | 2 | 3 | 4;
  trend: "UP" | "DOWN" | "FLAT";
  selectedInstrument: string;
  selectedMarket: SelectedMarket | null;
  selectedSide: "BUY" | "SELL";
  timeframe: Timeframe;
  chartType: ChartType;
  enabledIndicators: Indicator[];

  watchlist: string[];

  fullscreen: boolean;
  showInstrumentPicker: boolean;
  currentTradeType: TradeType;
  autoMode: boolean;
  botDelayMs: number;
  lastBotRunAt: number;
  setPrice: (
    price: number,
    marketId?: string
) => void;
  setStake: (stake: number) => void;
  setDuration:(seconds:number)=>void;
  increaseStake: () => void;
  decreaseStake: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  buy: () => Trade;
  closeTrade: (id: string) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: "dark" | "light") => void;
  setAccountMode: (mode: AccountMode) => void;
  loadDemoAccount: (id: string) => void;
  setVolatilityState: (state: 0 | 1 | 2 | 3 | 4) => void;
  setSelectedInstrument: (instrument: string) => void;
  
  setTimeframe: (
    timeframe: Timeframe
) => void;

setChartType: (
    type: ChartType
) => void;

toggleIndicator: (
    indicator: Indicator
) => void;
setSelectedMarket: (
    market: SelectedMarket
) => void;

setSelectedSide: (
    side: "BUY" | "SELL"
) => void;

addToWatchlist: (
    symbol: string
) => void;

removeFromWatchlist: (
    symbol: string
) => void;

toggleFullscreen: () => void;
  setShowInstrumentPicker: (show: boolean) => void;
  setCurrentTradeType: (type: TradeType) => void;
  setAutoMode: (enabled: boolean) => void;
  placeBotTrade: () => void;
  updateOpenTrades: (
    marketId: string,
    price: number
) => void;

tickTrades: (
    marketId: string,
    price: number
) => void;

}
const PAYOUT = 0.86;

interface SettlementResult {

    won: boolean;

    profit: number;

    payout: number;

}

function settleTrade(

    entry: number,

    exit: number,

    stake: number,

    type: TradeType

): SettlementResult {

    const won =
        type === "PUT"
            ? exit < entry
            : exit >= entry;

    const profit =
        won
            ? stake * PAYOUT
            : -stake;

    return {

        won,

        profit,

        payout: stake + profit,

    };

}

export const useTradeStore = create<TradeState>((set, get) => ({
  price: 702,

marketPrices: {
    R_10: 1200,
    R_25: 2400,
    R_50: 3600,
    R_75: 4800,
    R_100: 6000,
},
  stake: 10,
  duration:30,
  balance: 10000,
  currency: "USD",
  exchangeRate: 129,
  theme: "dark",
  
  accountMode: "DEMO",
  selectedDemoAccount: "demo-standard",
  demoAccounts: [
    { id: "demo-standard", name: "Standard", balance: 10000 },
    { id: "demo-small", name: "Small", balance: 1000 },
    { id: "demo-large", name: "Large", balance: 50000 },
  ],
  trades: [],
  volatilityState: 2,
  trend: "FLAT",
  selectedInstrument: "Volatility 100 Index",
  selectedMarket: {

    symbol: "R_100",

    name: "Volatility 100 Index",

    category: "Synthetic",

    price: 702,

    

    change: 1.42,

},

selectedSide: "BUY",
  timeframe: "1T",
  chartType: "candles",
  enabledIndicators: [

    "EMA (9)",

    "EMA (21)",

    "Bollinger Bands"

  ],

  watchlist: [

    "Volatility 10 Index",

    "Volatility 25 Index",

    "Volatility 50 Index",

    "Volatility 75 Index",

    "Volatility 100 Index"

  ],

fullscreen: false,
  showInstrumentPicker: false,
  currentTradeType: "ACCUMULATOR" as TradeType,
  autoMode: false,
  botDelayMs: 1200,
  lastBotRunAt: 0,

  setPrice: (
    nextPrice,
    marketId
) => {

    const state = get();

    const previous = state.price;

    const currentMarket =
        marketId ??
        state.selectedMarket?.symbol;

    set({

        price: nextPrice,

        trend:
            nextPrice > previous
                ? "UP"
                : nextPrice < previous
                ? "DOWN"
                : "FLAT",

        marketPrices: currentMarket
            ? {

                  ...state.marketPrices,

                  [currentMarket]: nextPrice,

              }
            : state.marketPrices,

        selectedMarket:
            state.selectedMarket &&
            currentMarket ===
                state.selectedMarket.symbol
                ? {

                      ...state.selectedMarket,

                      price: nextPrice,

                  }
                : state.selectedMarket,

    });

},
  setStake: (stake) => set({ stake: Math.max(0, Number.isFinite(stake) ? stake : 0) }),
  setDuration: (duration) =>
    set({
        duration
    }),
  increaseStake: () => set((state) => ({ stake: state.stake + 1 })),
  decreaseStake: () => set((state) => ({ stake: Math.max(1, state.stake - 1) })),
  deposit: (amount) => set((state) => ({ balance: state.balance + Math.max(0, amount) })),
  withdraw: (amount) => {
    const cleanAmount = Math.max(0, amount);

    if (!cleanAmount || cleanAmount > get().balance) {
      return false;
    }

    set((state) => ({ balance: state.balance - cleanAmount }));
    return true;
  },
  buy: () => {
    const state = get();

const symbol =
    state.selectedMarket?.symbol ??
    "R_100";


const marketPrice =
    state.marketPrices[symbol] ??
    state.price;
const now = Math.floor(Date.now() / 1000);

    if (state.stake <= 0 || state.stake > state.balance) {
      throw new Error("Insufficient balance or invalid stake.");
    }

    const trade: Trade = {

  id: crypto.randomUUID(),
  marketId: state.selectedMarket?.symbol ?? "R_100",

  direction:
    state.currentTradeType === "PUT"
      ? "SELL"
      : "BUY",

  tradeType: state.currentTradeType,

  stake: state.stake,

  entry: marketPrice,

  currentPrice: marketPrice,

  floatingProfit: 0,

 status: "PENDING",

source: "USER",

entryTime: now,

duration: state.duration,

expiryTime: now + state.duration,

remainingSeconds: state.duration

};

    set((current) => {
    const nextTrades = [...current.trades, trade];

    

    return {
        balance: current.balance - current.stake,
        trades: nextTrades,
        
    };
    
});

console.log(
    "Store after buy:",
    useTradeStore.getState().trades
);

return trade;
  },
  closeTrade: (id) => {
    const state = get();

    set({
      trades: state.trades.map((trade) => {
        if (trade.id !== id || trade.status === "CLOSED") {
          return trade;
        }

        const result = settleTrade(

    trade.entry,

    state.marketPrices[
    trade.marketId
] ??
state.price,

    trade.stake,

    trade.tradeType

);

        return {
          ...trade,
          status: "CLOSED",
          exit: state.price,
          profit: result.profit,
          exitTime: Math.floor(Date.now() / 1000),
        };
      }),
      balance:
        state.balance +
        state.trades.reduce((total, trade) => {
          if (trade.id !== id || trade.status === "CLOSED") {
            return total;
          }

          const result = settleTrade(

    trade.entry,

    state.price,

    trade.stake,

    trade.tradeType

);
          return total + result.payout;
        }, 0),
    });
  },
  updateOpenTrades: (marketId, price) => {

set((state)=>({
trades: state.trades.map((trade) => {

    if (
        trade.marketId !== marketId
    ) {
        return trade;
    }


let floatingProfit=0;


if(trade.direction==="BUY"){

floatingProfit =
(price-trade.entry)
*
trade.stake;

}


if(trade.direction==="SELL"){

floatingProfit =
(trade.entry-price)
*
trade.stake;

}


return {

...trade,

currentPrice:price,

floatingProfit

};


})

}));

},
tickTrades: (marketId, price) => {

    const now = Math.floor(Date.now() / 1000);

    set((state) => {

        let balance = state.balance;

        const trades: Trade[] = state.trades.map((trade): Trade => {

            if (
    trade.status === "CLOSED" ||
    trade.marketId !== marketId
) {
    return trade;
}

let status = trade.status;
            let remainingSeconds = trade.remainingSeconds;

            if (
                status === "PENDING" &&
                now - trade.entryTime >= 1
            ) {
                status = "OPEN";
            }

            if (status === "OPEN") {

                remainingSeconds =
                    Math.max(
                        0,
                        trade.expiryTime - now
                    );

                if (remainingSeconds === 0) {

                  const result = settleTrade(

    trade.entry,

    price,

    trade.stake,

    trade.tradeType

);

balance += result.payout;

settlementManager({

    won: result.won,

    stake: trade.stake,

    profit: result.profit,

});  
                    

                    return {

                        ...trade,

                        status: "CLOSED",
                        result: result.won ? "WIN" : "LOSS",

                        exit: price,

                        currentPrice: price,

                        profit: result.profit,

                        floatingProfit: result.profit,

                        remainingSeconds: 0,

                        exitTime: now

                    } as Trade;

                }

            }

            let floatingProfit = 0;

            if (trade.direction === "BUY") {

                floatingProfit =
                    (price - trade.entry)
                    * trade.stake;

            } else {

                floatingProfit =
                    (trade.entry - price)
                    * trade.stake;

            }

            return {

                ...trade,

                status: status as TradeStatus,

                currentPrice: price,

                remainingSeconds,

                floatingProfit

            } as  Trade;

        });

        return {

            balance,

            trades

        };

    });

},
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }

    set({ theme });
  },
  setAccountMode: (accountMode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accountMode", accountMode);
    }

    set({ accountMode });
  },
  loadDemoAccount: (id) => {
    const account = get().demoAccounts.find((demo) => demo.id === id);

    if (!account) {
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("selectedDemoAccount", id);
    }

    set({
      selectedDemoAccount: id,
      balance: account.balance,
      accountMode: "DEMO",
      trades: [],
    });
  },
  setVolatilityState: (volatilityState) => {

    console.log(
        "VOLATILITY CHANGED:",
        volatilityState
    );

    set({
        volatilityState
    });

},
  setSelectedInstrument: (selectedInstrument) => {
    const allowed = getAllowedTradeTypesForInstrument(selectedInstrument);
  

    set((state) => ({
      selectedInstrument,
      currentTradeType: allowed.includes(state.currentTradeType)
        ? state.currentTradeType
        : allowed[0],
    }));
  },
  
setSelectedMarket: (selectedMarket) => {

    let volatilityState: 0 | 1 | 2 | 3 | 4 = 2;

    switch (selectedMarket.symbol) {

        case "R_10":
            volatilityState = 0;
            break;

        case "R_25":
            volatilityState = 1;
            break;

        case "R_50":
            volatilityState = 2;
            break;

        case "R_75":
            volatilityState = 3;
            break;

        case "R_100":
            volatilityState = 4;
            break;

        default:
            volatilityState = 2;
    }
    

    set((state) => ({

    selectedMarket: {

    ...selectedMarket,

    price:
        state.marketPrices[
            selectedMarket.symbol
        ] ??
        selectedMarket.price,

},

    selectedInstrument:
        selectedMarket.name,

    price:
    state.marketPrices[
        selectedMarket.symbol
    ] ??
    selectedMarket.price,

    volatilityState,

    trades:
        state.trades.map(trade =>

            trade.status === "CLOSED"

                ? trade

                : {

                    ...trade,

                    currentPrice:
                        selectedMarket.price

                }

        ),

    trend:
        selectedMarket.price > state.price

            ? "UP"

            : selectedMarket.price < state.price

            ? "DOWN"

            : "FLAT"

}));

},
setSelectedSide: (selectedSide) => {

    set({

        selectedSide

    });

},

 setTimeframe: (timeframe) => {
    console.log("STORE TIMEFRAME:", timeframe);

    set({
        timeframe,
    });
},

setChartType: (chartType) => {
  set({ chartType });
},

toggleIndicator: (indicator) => {
  set((state) => ({
    enabledIndicators: state.enabledIndicators.includes(indicator)
      ? state.enabledIndicators.filter((i) => i !== indicator)
      : [...state.enabledIndicators, indicator],
  }));
},

addToWatchlist: (symbol) => {
  set((state) => ({
    watchlist: state.watchlist.includes(symbol)
      ? state.watchlist
      : [...state.watchlist, symbol],
  }));
},

removeFromWatchlist: (symbol) => {
  set((state) => ({
    watchlist: state.watchlist.filter((item) => item !== symbol),
  }));
},

toggleFullscreen: () => {
  set((state) => ({
    fullscreen: !state.fullscreen,
  }));
},
  setShowInstrumentPicker: (showInstrumentPicker) => set({ showInstrumentPicker }),
  setCurrentTradeType: (currentTradeType: TradeType) =>
    set({ currentTradeType }),
  setAutoMode: (autoMode) => set({ autoMode }),
  placeBotTrade: () => {
    const state = get();
    const marketPrice =
    state.selectedMarket?.price ?? state.price;

    if (state.stake > state.balance) {
      set({ autoMode: false });
      return;
    }

    const trade = state.buy();
    const direction = Math.random() > 0.5 ? 1 : -1;
    const exit =
marketPrice +
direction *
(Math.random()*2);
    const result = settleTrade(

    trade.entry,

    exit,

    trade.stake,

    trade.tradeType

);

    set((current) => ({
      lastBotRunAt: Date.now(),
      trades: current.trades.map((item) =>
        item.id === trade.id
          ? {
              ...item,
              source: "BOT",
              status: "CLOSED",
              exit,
              profit: result.profit,
              exitTime: Math.floor(Date.now() / 1000),
            }
          : item
      ),
      balance:
current.balance +
result.payout,
    }));
  },
}));
