import { create } from "zustand";

type Direction = "BUY" | "SELL";

export const TRADE_TYPES = [
  "ACCUMULATOR",
  "HIGH_LOW",
  "MULTIPLIER",
  "CALL",
  "PUT",
  "DIGITAL",
  "FOREX",
  "CRASH_BOOM",
  "STEP",
  "RANGE_BREAK",
] as const;

export type TradeType = typeof TRADE_TYPES[number];

export const TRADE_TYPE_LABELS: Record<TradeType, string> = {
  ACCUMULATOR: "Accumulator",
  HIGH_LOW: "High / Low",
  MULTIPLIER: "Multiplier",
  CALL: "Call",
  PUT: "Put",
  DIGITAL: "Digital",
  FOREX: "Forex",
  CRASH_BOOM: "Crash / Boom",
  STEP: "Step",
  RANGE_BREAK: "Range Break",
};

// Simplified allowed types mapping by instrument keyword. If no rule, allow all.
const allowedMap: Record<string, TradeType[]> = {
  // Volatility indices: common options
  "Volatility": ["ACCUMULATOR", "HIGH_LOW", "MULTIPLIER", "CALL", "PUT", "DIGITAL"],
  "Boom": ["CRASH_BOOM", "MULTIPLIER", "ACCUMULATOR"],
  "Crash": ["CRASH_BOOM", "MULTIPLIER", "ACCUMULATOR"],
  "Step": ["STEP", "ACCUMULATOR"],
  "Range Break": ["RANGE_BREAK", "ACCUMULATOR"],
  // currency pairs
  "/": ["FOREX", "MULTIPLIER", "ACCUMULATOR"],
  // indices
  "Index": ["ACCUMULATOR", "MULTIPLIER", "HIGH_LOW", "CALL", "PUT"],
};

export function getAllowedTradeTypesForInstrument(instr?: string) {
  if (!instr) return [...TRADE_TYPES];

  // return the union of matching rules
  const allowed = new Set<TradeType>();

  for (const key of Object.keys(allowedMap)) {
    if (instr.includes(key)) {
      for (const t of allowedMap[key]) allowed.add(t);
    }
  }

  if (allowed.size === 0) return [...TRADE_TYPES];

  return TRADE_TYPES.filter((t) => allowed.has(t));
}

type Trade = {
  id: number;
  entry: number;
  entryTime?: number;
  exit?: number;
  exitTime?: number;
  stake: number;
  direction: Direction;
  tradeType?: TradeType;
  profit?: number;
  status: "OPEN" | "CLOSED";
  processed: boolean;
  source?: "USER" | "BOT";
};

type VolatilityState = 0 | 1 | 2 | 3 | 4;

type Store = {
  balance: number;
  price: number;
  stake: number;

  // selected trade type for new trades
  currentTradeType: TradeType;
  setCurrentTradeType: (t: TradeType) => void;

  // account modes
  accountMode: "DEMO" | "REAL";
  setAccountMode: (m: "DEMO" | "REAL") => void;

  // demo accounts presets
  demoAccounts: { id: string; name: string; balance: number }[];
  selectedDemoAccount: string | null;
  loadDemoAccount: (id: string) => void;

  /**
   * =========================
   * NEW VOLATILITY SYSTEM
   * =========================
   */
  volatilityState: VolatilityState;
  volatilityFactor: number;
  volatilityLabel: string;
  volatilityColor: string;

  // selected trading instrument/index
  selectedInstrument: string;
  setSelectedInstrument: (s: string) => void;
  showInstrumentPicker: boolean;
  setShowInstrumentPicker: (v: boolean) => void;

  trend: "NEUTRAL" | "BULL" | "BEAR";
  // recent price history (for simple bot strategies)
  priceHistory: number[];
  trades: Trade[];

  totalProfit: number;
  winRate: number;

  setPrice: (p: number) => void;

  // direct access to price history (read-only)
  getPriceHistory: () => number[];

  setVolatilityState: (v: VolatilityState) => void;

  increaseStake: () => void;
  decreaseStake: () => void;
  setStake: (v: number) => void;

  buy: () => void;
  sell: () => void;

  closeTrade: (id: number) => void;

  deposit: (amount: number) => void;
  currency: "USD" | "KES";
  setCurrency: (c: "USD" | "KES") => void;
  exchangeRate: number; // KES per 1 USD
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  withdraw: (amount: number) => boolean;

  evaluateTrades: () => void;

  reset: () => void;
  // simple auto-trader
  botEnabled: boolean;
  setBotEnabled: (v: boolean) => void;
  botMultiplier: number; // stake multiplier for bot relative to user stake
  botDelayMs: number; // delay before bot places its follow-up trade
  setBotMultiplier: (v: number) => void;
  setBotDelayMs: (v: number) => void;
  // auto-mode: continuous bot trading
  autoMode: boolean;
  setAutoMode: (v: boolean) => void;
  lastBotRunAt: number | null;
  // immediate bot trade placement (used by auto-mode loop)
  placeBotTrade: () => void;
};

const volatilityMap = {
  0: { factor: 0.4, label: "CALM", color: "#22c55e" },
  1: { factor: 0.8, label: "LOW", color: "#3b82f6" },
  2: { factor: 1.2, label: "NORMAL", color: "#facc15" },
  3: { factor: 1.9, label: "HIGH", color: "#f97316" },
  4: { factor: 3.0, label: "EXTREME", color: "#ef4444" },
};

export const useTradeStore = create<Store>((set, get) => ({
  balance: 1000,
  price: 712.28,
  stake: 10,

  // currency: store balance in USD internally; display in selected currency
  currency: "USD",
  exchangeRate: 150, // 1 USD = 150 KES by default
  theme: (typeof window !== 'undefined' && (localStorage.getItem('theme') as "dark" | "light")) || "dark",

  volatilityState: 2,
  volatilityFactor: 1.2,
  volatilityLabel: "NORMAL",
  volatilityColor: "#facc15",

  selectedInstrument: "Volatility 100 Index",
  showInstrumentPicker: false,

  currentTradeType: "HIGH_LOW",
  accountMode: "DEMO",
  demoAccounts: [
    { id: "demo1", name: "Demo - 1k", balance: 1000 },
    { id: "demo2", name: "Demo - 5k", balance: 5000 },
    { id: "demo3", name: "Demo - 10k", balance: 10000 },
  ],
  selectedDemoAccount: (typeof window !== 'undefined' && localStorage.getItem('selectedDemoAccount')) || "demo1",

  trend: "NEUTRAL",
  // simple recent price ring (keeps last ~300 points)
  priceHistory: [],

  trades: [],
  totalProfit: 0,
  winRate: 0,
  // bot defaults
  botEnabled: false,
  botMultiplier: 1.0,
  botDelayMs: 1200,
  // auto-mode: continuous bot trading (toggleable from UI)
  autoMode: false,
  setAutoMode: (v: boolean) => set(() => ({ autoMode: v })),
  // last bot run timestamp (ms)
  lastBotRunAt: null,

  /**
   * =====================
   * MARKET STATE
   * =====================
   */
  setPrice: (price) => {
    set((s) => {
      const hist = (s.priceHistory || []).slice();
      hist.push(price);
      if (hist.length > 600) hist.shift();
      return { price, priceHistory: hist } as any;
    });
    get().evaluateTrades();
  },

  getPriceHistory: () => get().priceHistory || [],

  /**
   * =====================
   * VOLATILITY UPDATE (IMPORTANT FIX)
   * =====================
   */
  setVolatilityState: (v) => {
    const mapped = volatilityMap[v];

    set({
      volatilityState: v,
      volatilityFactor: mapped.factor,
      volatilityLabel: mapped.label,
      volatilityColor: mapped.color,
    });
  },

  setSelectedInstrument: (s: string) => {
    set(() => ({ selectedInstrument: s }));

    // ensure currentTradeType is allowed for new instrument
    const allowed = getAllowedTradeTypesForInstrument(s);
    const cur = get().currentTradeType;
    if (!allowed.includes(cur)) {
      set(() => ({ currentTradeType: allowed[0] }));
    }
  },
  setShowInstrumentPicker: (v: boolean) => set(() => ({ showInstrumentPicker: v })),
  setCurrentTradeType: (t: TradeType) => set(() => ({ currentTradeType: t })),
  setAccountMode: (m) => {
    if (typeof window !== 'undefined') localStorage.setItem('accountMode', m);

    if (m === 'REAL') {
      // real account should start at zero until a deposit is made via MPESA
      set(() => ({ accountMode: 'REAL', balance: 0 }));
      return;
    }

    // DEMO mode: restore the selected demo account (do not force demo1)
    const demoId = (typeof window !== 'undefined' && localStorage.getItem('selectedDemoAccount')) || get().selectedDemoAccount;
    if (demoId) {
      const found = get().demoAccounts.find((d) => d.id === demoId);
      if (found) {
        if (typeof window !== 'undefined') localStorage.setItem('selectedDemoAccount', demoId);
        set(() => ({ accountMode: 'DEMO', balance: found.balance, selectedDemoAccount: demoId }));
        return;
      }
    }

    // fallback: just set DEMO mode, keep balance unchanged
    set(() => ({ accountMode: 'DEMO' }));
  },
  loadDemoAccount: (id: string) => {
    set((s) => {
      const found = s.demoAccounts.find((d) => d.id === id);
      if (!found) return {} as any;

      if (typeof window !== 'undefined') localStorage.setItem('selectedDemoAccount', id);

      return {
        balance: found.balance,
        selectedDemoAccount: id,
        accountMode: "DEMO",
      };
    });
  },

  /**
   * =====================
   * STAKE CONTROL
   * =====================
   */
  setStake: (v) =>
    set(() => ({
      stake: Math.max(1, v),
    })),

  increaseStake: () =>
    set((s) => ({
      stake: Math.min(10000, s.stake + 1),
    })),

  decreaseStake: () =>
    set((s) => ({
      stake: Math.max(1, s.stake - 1),
    })),

  /**
   * =====================
   * TRADE ENTRY
   * =====================
   */
  buy: () => {
    const state = get();

    if (state.stake > state.balance) return;

    const trade: Trade = {
      id: Date.now(),
      entry: state.price,
      entryTime: Math.floor(Date.now() / 1000),
      stake: state.stake,
      direction: "BUY",
      tradeType: state.currentTradeType,
      status: "OPEN",
      processed: false,
      source: "USER",
    };

    set({
      trades: [...state.trades, trade],
      balance: state.balance - state.stake,
    });

    // schedule bot follow-up trade if enabled
    const s2 = get();
    if (s2.botEnabled && trade.source === "USER") {
      const botStake = Math.max(1, Math.round(state.stake * s2.botMultiplier));
      const delay = Math.max(0, s2.botDelayMs || 1000);
      setTimeout(() => {
        const st = get();
        if (st.balance < botStake) return; // skip if insufficient funds
        const botTrade: Trade = {
          id: Date.now() + 1,
          entry: st.price,
          entryTime: Math.floor(Date.now() / 1000),
          stake: botStake,
          direction: trade.direction,
          tradeType: trade.tradeType,
          status: "OPEN",
          processed: false,
          source: "BOT",
        };

        set(({ trades, balance }) => ({ trades: [...trades, botTrade], balance: balance - botStake }));
      }, delay);
    }
  },

  sell: () => {
    const state = get();

    if (state.stake > state.balance) return;

    const trade: Trade = {
      id: Date.now(),
      entry: state.price,
      entryTime: Math.floor(Date.now() / 1000),
      stake: state.stake,
      direction: "SELL",
      tradeType: state.currentTradeType,
      status: "OPEN",
      processed: false,
      source: "USER",
    };

    set({
      trades: [...state.trades, trade],
      balance: state.balance - state.stake,
    });

    // schedule bot follow-up trade if enabled
    const s2 = get();
    if (s2.botEnabled && trade.source === "USER") {
      const botStake = Math.max(1, Math.round(state.stake * s2.botMultiplier));
      const delay = Math.max(0, s2.botDelayMs || 1000);
      setTimeout(() => {
        const st = get();
        if (st.balance < botStake) return; // skip if insufficient funds
        const botTrade: Trade = {
          id: Date.now() + 1,
          entry: st.price,
          entryTime: Math.floor(Date.now() / 1000),
          stake: botStake,
          direction: trade.direction,
          tradeType: trade.tradeType,
          status: "OPEN",
          processed: false,
          source: "BOT",
        };

        set(({ trades, balance }) => ({ trades: [...trades, botTrade], balance: balance - botStake }));
      }, delay);
    }
  },

  /**
   * =====================
   * TRADE ENGINE
   * =====================
   */
  evaluateTrades: () => {
    const state = get();

    let updated = [...state.trades];
    let balance = state.balance;
    let totalProfit = state.totalProfit;

    let wins = 0;
    let losses = 0;

    for (let i = 0; i < updated.length; i++) {
      const t = updated[i];

      if (t.status === "CLOSED") continue;

      const move =
        t.direction === "BUY"
          ? state.price - t.entry
          : t.entry - state.price;

      // determine payout and whether to close based on trade type
      const { profit, shouldClose } = calculatePayout(t, move, state.price);

      if (shouldClose) {
        updated[i] = ({
          ...t,
          exit: state.price,
          exitTime: Math.floor(Date.now() / 1000),
          profit,
          status: "CLOSED",
          processed: true,
        } as Trade);

        balance += t.stake + profit;
        totalProfit += profit;

        if (profit > 0) wins++;
        else losses++;
      }
    }

    const closed = updated.filter((t) => t.status === "CLOSED").length;

    set({
      trades: updated,
      balance,
      totalProfit,
      winRate: closed ? (wins / closed) * 100 : 0,
    });
  },

  closeTrade: (id) => {
    const state = get();

    const updated = state.trades.map((t) => {
      if (t.id !== id || t.processed) return t;

      const move =
        t.direction === "BUY"
          ? state.price - t.entry
          : t.entry - state.price;

      const { profit } = calculatePayout(t, move, state.price);

      return ({
        ...t,
        exit: state.price,
        exitTime: Math.floor(Date.now() / 1000),
        profit,
        status: "CLOSED",
        processed: true,
      } as Trade);
    });

    set({ trades: updated });
    get().evaluateTrades();
  },

  deposit: (amount: number) =>
    set((s) => ({
      balance: s.balance + Math.max(0, amount),
    })),

  withdraw: (amount: number) => {
    const state = get();
    if (amount <= 0 || amount > state.balance) return false;
    set((s) => ({ balance: s.balance - amount }));
    return true;
  },

  setCurrency: (c) => {
    set(() => ({ currency: c }));
  },

  setTheme: (t) => {
    if (typeof window !== 'undefined') localStorage.setItem('theme', t);
    set(() => ({ theme: t }));
  },

  reset: () =>
    set({
      balance: 1000,
      price: 712.28,
      stake: 10,
      trades: [],
      totalProfit: 0,
      winRate: 0,

      volatilityState: 2,
      volatilityFactor: 1.2,
      volatilityLabel: "NORMAL",
      volatilityColor: "#facc15",

      trend: "NEUTRAL",
      botEnabled: false,
      botMultiplier: 1.0,
      botDelayMs: 1200,
    }),
  setBotEnabled: (v: boolean) => set(() => ({ botEnabled: v })),
  setBotMultiplier: (v: number) => set(() => ({ botMultiplier: Math.max(0.1, v) })),
  setBotDelayMs: (v: number) => set(() => ({ botDelayMs: Math.max(100, Math.round(v)) })),
  // place a bot trade immediately (used by auto-mode loop)
  placeBotTrade: () => {
    const state = get();
    const botStake = Math.max(1, Math.round(state.stake * state.botMultiplier));
    if (botStake > state.balance) return;

    // Simple momentum strategy: compare mean of recent window to previous window
    const hist = state.priceHistory || [];
    let direction: Direction = "BUY";

    if (hist.length >= 6) {
      const tail = hist.slice(-3);
      const prev = hist.slice(-6, -3);
      const tailAvg = tail.reduce((a, b) => a + b, 0) / tail.length;
      const prevAvg = prev.reduce((a, b) => a + b, 0) / prev.length;
      direction = tailAvg > prevAvg ? "BUY" : "SELL";
    } else {
      direction = Math.random() < 0.5 ? "BUY" : "SELL";
    }

    const trade: Trade = {
      id: Date.now(),
      entry: state.price,
      entryTime: Math.floor(Date.now() / 1000),
      stake: botStake,
      direction,
      tradeType: state.currentTradeType,
      status: "OPEN",
      processed: false,
      source: "BOT",
    };

    set(({ trades, balance }) => ({ trades: [...trades, trade], balance: balance - botStake, lastBotRunAt: Date.now() }));
  },
}));

  /**
   * Calculate payout and closing condition for a trade given the price move.
   * Returns { profit, shouldClose }
   */
  function calculatePayout(t: Trade, move: number, currentPrice: number) {
    // default: linear payout proportional to move
    let profit = move * t.stake;
    let shouldClose = Math.abs(move) > 0.8; // default threshold

    switch (t.tradeType) {
      case "MULTIPLIER":
        // multiplier amplifies profit/loss
        profit = move * t.stake * 2.5;
        shouldClose = Math.abs(move) > 0.5;
        break;
      case "DIGITAL":
        // digital: fixed payout if direction is correct (binary)
        const correct = (t.direction === "BUY" && move > 0) || (t.direction === "SELL" && move > 0);
        profit = correct ? t.stake * 0.8 : -t.stake; // 80% payout or lose stake
        shouldClose = Math.abs(move) > 0.2;
        break;
      case "CALL":
      case "PUT":
        // options-like: payout equals move*stake with small multiplier
        profit = move * t.stake * 1.1;
        shouldClose = Math.abs(move) > 0.6;
        break;
      case "ACCUMULATOR":
        // accumulator: grows stakes slowly while small moves; close on larger move
        profit = move * t.stake * 0.6;
        shouldClose = Math.abs(move) > 1.2;
        break;
      case "HIGH_LOW":
        // high/low: small threshold
        profit = move * t.stake * 1.0;
        shouldClose = Math.abs(move) > 0.4;
        break;
      case "CRASH_BOOM":
        // large tail events; huge payout if big move
        profit = move * t.stake * (Math.abs(move) > 2 ? 10 : 1);
        shouldClose = Math.abs(move) > 1.5;
        break;
      case "STEP":
        profit = move * t.stake * 0.9;
        shouldClose = Math.abs(move) > 0.7;
        break;
      case "RANGE_BREAK":
        // payout only on breakout beyond a hit range
        profit = Math.abs(move) > 0.5 ? Math.sign(move) * t.stake * 2 : -0.5 * t.stake;
        shouldClose = Math.abs(move) > 0.5;
        break;
      case "FOREX":
        profit = move * t.stake * 1.0;
        shouldClose = Math.abs(move) > 0.3;
        break;
      default:
        break;
    }

    return { profit, shouldClose };
  }