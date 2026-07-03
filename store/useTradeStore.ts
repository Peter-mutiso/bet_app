"use client";

import { create } from "zustand";

export const TRADE_TYPES = ["ACCUMULATOR", "CALL", "PUT", "DIGIT_OVER", "DIGIT_UNDER"] as const;

export type TradeType = (typeof TRADE_TYPES)[number];
export type AccountMode = "DEMO" | "REAL";
export type Currency = "USD" | "KES";
export type TradeStatus = "OPEN" | "CLOSED";

export type ChartType =
    | "candles"
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

export interface Trade {
  id: string;
  direction: "BUY" | "SELL";
  tradeType: TradeType;
  stake: number;
  entry: number;
  exit?: number;
  profit?: number;
  status: TradeStatus;
  source?: "USER" | "BOT";
  entryTime: number;
  exitTime?: number;
}

interface DemoAccount {
  id: string;
  name: string;
  balance: number;
}

interface TradeState {
  price: number;
  stake: number;
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
  setPrice: (price: number) => void;
  setStake: (stake: number) => void;
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
}

function settle(entry: number, exit: number, stake: number, type: TradeType) {
  const won = type === "PUT" ? exit < entry : exit >= entry;
  return won ? stake * 0.86 : -stake;
}

export const useTradeStore = create<TradeState>((set, get) => ({
  price: 702,
  stake: 10,
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
  timeframe: "1m",
  chartType: "CANDLESTICK",
  enabledIndicators: [],
  watchlist: [],
  fullscreen: false,
  showInstrumentPicker: false,
  currentTradeType: "ACCUMULATOR",
  autoMode: false,
  botDelayMs: 1200,
  lastBotRunAt: 0,

  setPrice: (nextPrice) => {
    const previous = get().price;
    set({
      price: nextPrice,
      trend: nextPrice > previous ? "UP" : nextPrice < previous ? "DOWN" : "FLAT",
    });
  },
  setStake: (stake) => set({ stake: Math.max(0, Number.isFinite(stake) ? stake : 0) }),
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

    if (state.stake <= 0 || state.stake > state.balance) {
      throw new Error("Insufficient balance or invalid stake.");
    }

    const trade: Trade = {
      id: crypto.randomUUID(),
      direction: state.currentTradeType === "PUT" ? "SELL" : "BUY",
      tradeType: state.currentTradeType,
      stake: state.stake,
      entry: state.price,
      status: "OPEN",
      source: "USER",
      entryTime: Math.floor(Date.now() / 1000),
    };

    set((current) => ({
      balance: current.balance - current.stake,
      trades: [...current.trades, trade],
    }));

    return trade;
  },
  closeTrade: (id) => {
    const state = get();

    set({
      trades: state.trades.map((trade) => {
        if (trade.id !== id || trade.status === "CLOSED") {
          return trade;
        }

        const profit = settle(trade.entry, state.price, trade.stake, trade.tradeType);

        return {
          ...trade,
          status: "CLOSED",
          exit: state.price,
          profit,
          exitTime: Math.floor(Date.now() / 1000),
        };
      }),
      balance:
        state.balance +
        state.trades.reduce((total, trade) => {
          if (trade.id !== id || trade.status === "CLOSED") {
            return total;
          }

          const profit = settle(trade.entry, state.price, trade.stake, trade.tradeType);
          return total + trade.stake + profit;
        }, 0),
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
  setVolatilityState: (volatilityState) => set({ volatilityState }),
  setSelectedInstrument: (selectedInstrument) => {
    const allowed = getAllowedTradeTypesForInstrument(selectedInstrument);

    set((state) => ({
      selectedInstrument,
      currentTradeType: allowed.includes(state.currentTradeType)
        ? state.currentTradeType
        : allowed[0],
    }));
  },
  setShowInstrumentPicker: (showInstrumentPicker) => set({ showInstrumentPicker }),
  setCurrentTradeType: (currentTradeType) => set({ currentTradeType }),
  setAutoMode: (autoMode) => set({ autoMode }),
  placeBotTrade: () => {
    const state = get();

    if (state.stake > state.balance) {
      set({ autoMode: false });
      return;
    }

    const trade = state.buy();
    const direction = Math.random() > 0.5 ? 1 : -1;
    const exit = state.price + direction * (Math.random() * 2);
    const profit = settle(trade.entry, exit, trade.stake, trade.tradeType);

    set((current) => ({
      lastBotRunAt: Date.now(),
      trades: current.trades.map((item) =>
        item.id === trade.id
          ? {
              ...item,
              source: "BOT",
              status: "CLOSED",
              exit,
              profit,
              exitTime: Math.floor(Date.now() / 1000),
            }
          : item
      ),
      balance: current.balance + trade.stake + profit,
    }));
  },
}));
