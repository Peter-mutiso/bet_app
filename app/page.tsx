"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTradeStore } from "@/store/useTradeStore";
import { startMarket } from "@/lib/marketEngine";
import { toast, Toaster } from "react-hot-toast";
import { Wallet, ChevronDown, BarChart3, Settings } from "lucide-react";
import { TRADE_TYPES, TRADE_TYPE_LABELS, getAllowedTradeTypesForInstrument } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";

const TradingChart = dynamic(
  () => import("@/components/TradingChart"),
  { ssr: false }
);

type ChartType =
  | "line"
  | "candles"
  | "area"
  | "ohlc"
  | "hollow";

export default function Home() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(100);
  const [depositLoading, setDepositLoading] = useState(false);

  const {
    price,
    setPrice,
    stake,
    increaseStake,
    decreaseStake,
    buy,
    setStake,

    // 🔥 NEW: REAL MARKET STATE
    volatilityState,
    trend,
    setVolatilityState,
    selectedInstrument,
    showInstrumentPicker,
    setShowInstrumentPicker,
    setSelectedInstrument,
    // trade type selector wiring
    currentTradeType,
    setCurrentTradeType,
    theme,
    setTheme,
    deposit,
    accountMode,
    setAccountMode,
    selectedDemoAccount,
  } = useTradeStore();

  const [chartType, setChartType] = useState<ChartType>("candles");
  const [tickIndex, setTickIndex] = useState<number>(0);
  const [showConfirmMode, setShowConfirmMode] = useState(false);
  const [pendingMode, setPendingMode] = useState<"DEMO" | "REAL" | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const tickOptions = [1000, 10000, 15000, 25000, 50000, 100000]; // ms: 1s,10s,15s,25s,50s,100s

  const tradeTypes = TRADE_TYPES;

  const [flash, setFlash] = useState(false);
  // instrument picker moved to RightPanel; page only displays selectedInstrument

  const lastPriceRef = useRef(price);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // load persisted account mode on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mode = localStorage.getItem("accountMode") as "DEMO" | "REAL" | null;
    const demoId = localStorage.getItem("selectedDemoAccount");

    if (mode) setAccountMode(mode);
    if (demoId) useTradeStore.getState().loadDemoAccount(demoId);
  }, [setAccountMode]);

  /**
   * =========================
   * MARKET ENGINE
   * =========================
   */
  useEffect(() => {
    const stop = startMarket((p: number) => {
      const prev = lastPriceRef.current;

      setPrice(p);

      lastPriceRef.current = p;

      setFlash(true);

      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }

      flashTimeoutRef.current = setTimeout(() => {
        setFlash(false);
      }, 120);
  }, tickOptions[tickIndex]);

    return () => {
      stop?.();

      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, [setPrice, tickIndex]);

  // apply simple per-instrument presets to the market engine when instrument changes
  useEffect(() => {
    // small preset map: tune engineParams for a few known instrument name fragments
    const presets: Record<string, Partial<any>> = {
      "Volatility 100": { meanReversionScale: 0.9, exhaustionScale: 1.2, burstScale: 1.4, liquidityScale: 1.0, heavyFactorScale: 1.2 },
      "Volatility 75": { meanReversionScale: 1.0, exhaustionScale: 1.0, burstScale: 1.0, liquidityScale: 1.0, heavyFactorScale: 1.0 },
      "Forex": { meanReversionScale: 1.6, exhaustionScale: 0.8, burstScale: 0.6, liquidityScale: 1.4, heavyFactorScale: 0.8 },
      "Boom": { meanReversionScale: 0.6, exhaustionScale: 1.6, burstScale: 2.0, liquidityScale: 0.8, heavyFactorScale: 1.8 },
    };

    const instr = selectedInstrument || "";

    let applied: Partial<any> | null = null;

    for (const k of Object.keys(presets)) {
      if (instr.includes(k)) {
        applied = presets[k];
        break;
      }
    }

    if (!applied) {
      // default neutral params
      applied = { meanReversionScale: 1.0, exhaustionScale: 1.0, burstScale: 1.0, liquidityScale: 1.0, heavyFactorScale: 1.0 };
    }

    try {
      // import the engine setter lazily to avoid SSR issues
      const engine = require("@/lib/marketEngine");
      engine.setEngineParams(applied);
      // also reset market for a clean start on instrument change
      engine.resetMarket();
      toast.success(`Applied presets for ${selectedInstrument}`);
    } catch (e) {
      // best-effort only
      console.warn("Failed to apply engine presets", e);
    }
  }, [selectedInstrument]);

  /**
   * =========================
   * DEPOSIT
   * =========================
   */
  const handleDeposit = useCallback(async () => {
    const cleanAmount = Number(amount);

    if (!phone || !cleanAmount || cleanAmount <= 0) {
      toast.error("Enter valid phone and amount");
      return;
    }

    setDepositLoading(true);

    try {
      const formattedPhone = phone.startsWith("0")
        ? "254" + phone.slice(1)
        : phone;

      const res = await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: cleanAmount,
        }),
      });

      // safely parse response text to avoid JSON parse errors on empty body
      const txt = await res.text();
      let data: any = {};
      try {
        data = txt ? JSON.parse(txt) : {};
      } catch (e) {
        data = { text: txt };
      }

      if (!res.ok) {
        console.error("STK error", data);
        toast.error("Deposit failed: " + (data?.error || res.statusText || "unknown"));
        return;
      }

      // update local balance immediately (optimistic)

      toast.success("STK push sent to phone");
      setShowDeposit(false);
    } catch (err) {
      console.error(err);
      toast.error("Deposit failed");
    } finally {
      setDepositLoading(false);
    }
  }, [phone, amount]);

  /**
   * =========================
   * VOLATILITY COLOR
   * =========================
   */
  const volatilityColor =
    volatilityState === 0
      ? "text-blue-300"
      : volatilityState === 1
      ? "text-green-300"
      : volatilityState === 2
      ? "text-yellow-300"
      : volatilityState === 3
      ? "text-orange-400"
      : "text-red-500";

  return (
    <main className="h-screen bg-[#0E0F11] flex overflow-hidden">
      <Toaster position="top-right" />

      {/* Deposit modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0b1220] p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-3">Deposit</h3>
            <label className="text-xs text-gray-400">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 mb-3 bg-[#0f1724] rounded" />
            <label className="text-xs text-gray-400">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 mb-4 bg-[#0f1724] rounded" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeposit(false)} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
              <button onClick={handleDeposit} className="px-3 py-1 rounded bg-red-500">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-[72px] bg-[#15171C] border-r border-[#222] flex flex-col items-center py-5 gap-6">
        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg">
          d
        </div>

        <BarChart3 className="text-gray-400" />

        <Wallet
          className="text-gray-400 cursor-pointer"
          onClick={() => setShowDeposit(true)}
        />
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="h-14 bg-[#15171C] border-b border-[#222] px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {tickOptions.map((ms, idx) => (
                  <button
                    key={ms}
                    onClick={() => setTickIndex(idx)}
                    className={`px-2 py-1 text-xs rounded ${
                      tickIndex === idx ? "bg-red-500 text-white" : "bg-[#22252B] text-gray-300"
                    }`}
                  >
                    {ms / 1000}s
                  </button>
                ))}
              </div>
            </div>

            {/* status area (no instrument/volatility here; chart contains controls) */}
          </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-[#22252B] rounded">
                    <Settings className="text-gray-200" />
                  </button>
                </div>

              <div className="ml-2 px-3 py-1 rounded text-xs bg-[#1f2937] text-gray-200">
                {accountMode} {accountMode === 'DEMO' && selectedDemoAccount ? `· ${selectedDemoAccount}` : ''}
              </div>

              {/* Currency selector */}
              {/* currency moved to Settings modal */}

              <button
                onClick={() => setShowDeposit(true)}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white text-sm"
              >
                Deposit
              </button>

              <div className="bg-[#22252B] px-4 py-2 rounded-lg text-white">
                {useTradeStore.getState().currency === 'USD' ? useTradeStore.getState().balance?.toFixed(2) ?? '0.00' : ((useTradeStore.getState().balance ?? 0) * useTradeStore.getState().exchangeRate).toFixed(2)} {useTradeStore.getState().currency}
              </div>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">

          {/* CHART AREA */}
          <section className="flex-1 relative bg-[#111317]">
            {/* instrument picker is rendered in RightPanel; homepage only toggles it */}

            {/* Chart overlay UI moved inside TradingChart component */}

            {/* CHART TYPE */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {(["line", "candles", "area", "ohlc", "hollow"] as ChartType[]).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={`px-3 py-1 rounded-md text-xs ${
                      chartType === t
                        ? "bg-red-500 text-white"
                        : "bg-[#1A1D23] text-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>

            <TradingChart type={chartType} />
          </section>

          {/* TRADE PANEL */}
          <aside className="w-[360px] bg-[#15171C] border-l border-[#222] p-5 flex flex-col text-white">
            <h2 className="font-semibold text-lg">Accumulators</h2>

            <div className="mt-5">
              <div className="text-sm text-gray-400 mb-2">Stake</div>

              <div className="bg-[#1E2127] rounded-xl p-4 flex items-center justify-between">
                <button onClick={decreaseStake}>−</button>

                <span className="font-bold text-lg">{useTradeStore.getState().currency === 'USD' ? stake : (stake * useTradeStore.getState().exchangeRate).toFixed(2)} {useTradeStore.getState().currency}</span>

                <button onClick={increaseStake}>+</button>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {[5, 10, 25, 50].map((v) => (
                  <button
                    key={v}
                    onClick={() => setStake(v)}
                    className="bg-[#22252B] py-2 rounded-lg"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

              {/* Auto Mode toggle (only control for bot: Auto vs Manual) */}
              <div className="mb-4 mt-4 p-3 bg-[#0d1720] rounded border border-gray-800 text-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Auto Mode</div>
                  <label className="flex items-center gap-2 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={useTradeStore.getState().autoMode}
                      onChange={(e) => {
                        const val = e.target.checked;
                        if (val && useTradeStore.getState().accountMode === 'REAL') {
                          setPendingMode('REAL');
                          setShowConfirmMode(true);
                          return;
                        }
                        useTradeStore.getState().setAutoMode(val);
                      }}
                    />
                    <span>{useTradeStore.getState().autoMode ? 'Auto' : 'Manual'}</span>
                  </label>
                </div>
              </div>

            <button
              onClick={() => {
                try {
                  const s = useTradeStore.getState();
                  if (s.stake > s.balance) {
                    toast.error("Insufficient balance");
                    return;
                  }
                  s.buy();
                  toast.success("Trade placed");
                } catch (err) {
                  console.error("Buy failed", err);
                  toast.error("Buy failed");
                }
              }}
              className="mt-auto bg-green-500 hover:bg-green-600 rounded-xl py-4 font-semibold"
            >
              Buy
            </button>

            {/* Account mode controlled from header (single control) */}
          </aside>
        </div>
      </div>

      {/* Confirm switch modal for REAL mode */}
      {showConfirmMode && pendingMode === 'REAL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0b1220] p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-3">Switch to REAL account?</h3>
            <p className="text-sm text-gray-400 mb-4">Switching to a real account will use your real balance. Are you sure?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowConfirmMode(false); setPendingMode(null); }} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
              <button onClick={() => { setAccountMode('REAL'); setShowConfirmMode(false); setPendingMode(null); toast.success('Switched to REAL'); }} className="px-3 py-1 rounded bg-red-500">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0b1220] p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-3">Settings</h3>
            <div className="mb-4">
              <label className="text-sm text-gray-400">Account Mode</label>
              <select
                value={accountMode}
                onChange={(e) => {
                  const v = e.target.value as 'DEMO' | 'REAL';
                  if (v === 'REAL' && accountMode !== 'REAL') {
                    setPendingMode('REAL');
                    setShowConfirmMode(true);
                  } else if (v === 'DEMO') {
                    setAccountMode('DEMO');
                    toast.success('Switched to DEMO');
                  }
                }}
                className="w-full bg-[#111317] p-2 rounded mt-2"
              >
                <option value="DEMO">Demo</option>
                <option value="REAL">Real</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-400">Currency</label>
              <select
                value={useTradeStore.getState().currency}
                onChange={(e) => useTradeStore.getState().setCurrency(e.target.value as any)}
                className="w-full bg-[#111317] p-2 rounded mt-2"
              >
                <option value="USD">USD</option>
                <option value="KES">KES</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-400">Theme</label>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => useTradeStore.getState().setTheme('dark')}
                  className={`px-3 py-1 rounded ${useTradeStore.getState().theme === 'dark' ? 'bg-red-500 text-white' : 'bg-[#111317] text-gray-300'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => useTradeStore.getState().setTheme('light')}
                  className={`px-3 py-1 rounded ${useTradeStore.getState().theme === 'light' ? 'bg-red-500 text-white' : 'bg-[#111317] text-gray-300'}`}
                >
                  Light
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSettingsModal(false)} className="px-3 py-1 rounded bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}