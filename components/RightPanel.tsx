"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTradeStore, TRADE_TYPE_LABELS, getAllowedTradeTypesForInstrument } from "@/store/useTradeStore";
import { TRADE_TYPES } from "@/store/useTradeStore";
import { INSTRUMENT_GROUPS } from "@/lib/instruments";

export default function RightPanel() {
  const { stake, increaseStake, decreaseStake, setStake, buy, selectedInstrument, setSelectedInstrument, showInstrumentPicker, setShowInstrumentPicker, balance, trades, closeTrade } = useTradeStore();
  const currency = useTradeStore((s) => s.currency);
  const exchangeRate = useTradeStore((s) => s.exchangeRate);
  const setCurrency = useTradeStore((s) => s.setCurrency);

  const groups: Record<string, string[]> = INSTRUMENT_GROUPS as Record<string, string[]>;

  const tradeTypes = TRADE_TYPES;

  const currentTradeType = useTradeStore((s) => s.currentTradeType);
  const setCurrentTradeType = useTradeStore((s) => s.setCurrentTradeType);
  const botDelayMs = useTradeStore((s) => s.botDelayMs);
  const autoMode = useTradeStore((s) => s.autoMode);
  const setAutoMode = useTradeStore((s) => s.setAutoMode);
  const placeBotTrade = useTradeStore((s) => s.placeBotTrade);

  const autoIntervalRef = useRef<number | null>(null as any);
  const lastBotRunAt = useTradeStore((s) => s.lastBotRunAt);
  const [nextCountdown, setNextCountdown] = useState(0);
  const [showConfirmReal, setShowConfirmReal] = useState(false);

  // manage auto-mode loop
  useEffect(() => {
    if (autoMode) {
      // start loop
      if (autoIntervalRef.current) window.clearInterval(autoIntervalRef.current as any);
      autoIntervalRef.current = window.setInterval(() => {
        try {
          placeBotTrade();
        } catch (e) {}
      }, Math.max(500, botDelayMs || 1200));
    } else {
      if (autoIntervalRef.current) {
        window.clearInterval(autoIntervalRef.current as any);
        autoIntervalRef.current = null;
      }
    }

    return () => {
      if (autoIntervalRef.current) {
        window.clearInterval(autoIntervalRef.current as any);
        autoIntervalRef.current = null;
      }
    };
  }, [autoMode, botDelayMs, placeBotTrade]);

  // countdown timer for next run
  useEffect(() => {
    if (!autoMode) {
      setNextCountdown(0);
      return;
    }

    const tick = () => {
      const last = lastBotRunAt || 0;
      const delay = Math.max(500, botDelayMs || 1200);
      const nextAt = last + delay;
      const now = Date.now();
      const remaining = Math.max(0, nextAt - now);
      setNextCountdown(remaining);
    };

    const id = window.setInterval(tick, 200);
    tick();
    return () => window.clearInterval(id);
  }, [autoMode, lastBotRunAt, botDelayMs]);

  return (
    <>
    <div className="w-80 bg-[#0f172a] border-l border-gray-800 p-4">
      
      <h2 className="text-lg font-semibold mb-4">Accumulators</h2>

      {/* Account mode */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Account</p>
        <div className="text-xs text-gray-400 mb-2">Mode is controlled from the header</div>
        <div className="text-xs text-gray-400 mt-2">Demo presets:</div>
        <div className="flex gap-2 mt-2">
          {useTradeStore.getState().demoAccounts.map(d => (
            <button key={d.id} onClick={() => useTradeStore.getState().loadDemoAccount(d.id)} className="px-2 py-1 bg-[#161a20] rounded text-xs">{d.name}</button>
          ))}
        </div>
      </div>

      {/* Growth Rate */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Growth rate</p>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(v => (
            <button
              key={v}
              className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
            >
              {v}%
            </button>
          ))}
        </div>
      </div>

      {/* Stake */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Stake</p>
        <div className="flex gap-2">
          <button onClick={decreaseStake} className="px-3 py-1 bg-gray-800 rounded">−</button>
          <input
            className="flex-1 bg-gray-900 p-2 rounded border border-gray-700 text-right"
            value={`${stake}`}
            onChange={(e) => setStake(Number(e.target.value || 0))}
          />
          <button onClick={increaseStake} className="px-3 py-1 bg-gray-800 rounded">+</button>
        </div>
      </div>

      {/* Auto Mode (simple toggle) */}
      <div className="mb-6 p-3 bg-[#0d1720] rounded border border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300 font-semibold">Auto Mode</div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => {
                const val = e.target.checked;
                if (val && useTradeStore.getState().accountMode === 'REAL') {
                  setShowConfirmReal(true);
                  return;
                }
                setAutoMode(val);
              }}
            />
            <span>{autoMode ? 'Auto' : 'Manual'}</span>
          </label>
        </div>
      </div>

      {/* Instrument selector */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Instrument</p>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowInstrumentPicker(!showInstrumentPicker)}
            className="flex-1 text-left bg-gray-800 px-3 py-2 rounded"
          >
            {selectedInstrument}
          </button>
          <button
            onClick={() => { setSelectedInstrument("Volatility 100 Index"); setShowInstrumentPicker(false); }}
            className="px-3 py-2 bg-gray-700 rounded text-sm"
          >Reset</button>
        </div>

        {showInstrumentPicker && (
          <div className="mt-3 max-h-48 overflow-auto bg-[#0b1220] p-2 rounded border border-gray-800">
            {Object.entries(groups).map(([title, items]) => (
              <div key={title} className="mb-2">
                <div className="text-xs text-gray-300 font-semibold mb-1">{title}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((it) => (
                    <button
                      key={it}
                      onClick={() => { setSelectedInstrument(it); setShowInstrumentPicker(false); }}
                      className="px-2 py-1 bg-[#161a20] rounded text-xs hover:bg-[#233244]"
                    >{it}</button>
                  ))}
                </div>
              </div>
            ))}

            {/* Trade type selector */}
            <div className="mt-3 border-t border-gray-800 pt-3">
              <p className="text-sm text-gray-400 mb-2">Trade type</p>
              <div className="flex gap-2 flex-wrap">
                {getAllowedTradeTypesForInstrument(selectedInstrument).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCurrentTradeType(t as any)}
                    className={`px-2 py-1 rounded text-xs ${currentTradeType === t ? 'bg-red-500 text-white' : 'bg-[#222]'}`}
                  >{TRADE_TYPE_LABELS[t]}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

          {/* Max info */}
          <div className="text-sm text-gray-400 mb-6">
            <p>Max payout: {currency === 'USD' ? '6,000' : (6000 * exchangeRate).toFixed(0)} {currency}</p>
            <p>Max ticks: 85</p>
          </div>

      {/* Trades & Buy */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Balance</div>
        <div className="bg-gray-900 p-2 rounded font-semibold">{currency === 'USD' ? balance.toFixed(2) : (balance * exchangeRate).toFixed(2)} {currency}</div>
      </div>

      {/* (Advanced bot settings moved out of main UI) */}

      <button
        onClick={() => {
          try {
            if (stake > balance) {
              toast.error("Insufficient balance");
              return;
            }

            // call the store directly to avoid stale closures
            useTradeStore.getState().buy();
            toast.success("Trade placed");
          } catch (err) {
            console.error("Buy failed", err);
            toast.error("Buy failed");
          }
        }}
        disabled={stake > balance}
        className={`w-full py-2 rounded font-semibold ${stake > balance ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500'}`}
      >
        Buy
      </button>

      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">Trades</div>
        <div className="max-h-48 overflow-auto space-y-2">
          {trades.length === 0 && <div className="text-xs text-gray-400">No trades</div>}
          {trades.map((t) => (
            <div key={t.id} className="bg-gray-900 p-2 rounded flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold">{t.direction} · {currency === 'USD' ? t.stake : (t.stake * exchangeRate).toFixed(2)} {currency} <span className="text-xs text-gray-400">[{t.tradeType ?? '—'}] <span className="ml-1 text-xs text-gray-500">{t.source ?? 'USER'}</span></span></div>
                <div className="text-gray-400">Entry: {t.entry.toFixed(2)}</div>
                <div className="text-gray-400">Status: {t.status}</div>
              </div>
              <div className="text-right">
                {t.status === 'OPEN' ? (
                  <button onClick={() => closeTrade(t.id)} className="px-2 py-1 bg-[#222] rounded text-xs">Close</button>
                ) : (
                  <div className={`${t.profit && t.profit > 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>{currency === 'USD' ? t.profit?.toFixed(2) : (t.profit ? (t.profit * exchangeRate).toFixed(2) : undefined)} {currency}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executions (closed trades) */}
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">Executions</div>
        <div className="max-h-40 overflow-auto space-y-2">
          {trades.filter(t => t.status === 'CLOSED').length === 0 && <div className="text-xs text-gray-400">No executions yet</div>}
          {trades.filter(t => t.status === 'CLOSED').map(t => (
            <div key={t.id} className="bg-gray-900 p-2 rounded flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold">{t.direction} · {currency === 'USD' ? t.stake : (t.stake * exchangeRate).toFixed(2)} {currency} <span className="text-xs text-gray-400">[{t.tradeType ?? '—'}]</span></div>
                <div className="text-gray-400">Entry: {t.entry.toFixed(2)} → Exit: {t.exit?.toFixed(2)}</div>
                <div className={`${t.profit && t.profit > 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>{currency === 'USD' ? t.profit?.toFixed(2) : (t.profit ? (t.profit * exchangeRate).toFixed(2) : undefined)} {currency}</div>
              </div>
              <div className="text-xs text-gray-400">{new Date((t.exitTime || t.entryTime || 0) * 1000).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>

  </div>

  {/* Confirm enabling Auto Mode on REAL account */}
    {showConfirmReal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-[#0b1220] p-6 rounded w-96">
          <h3 className="text-lg font-semibold mb-3">Enable Auto Mode on REAL account?</h3>
          <p className="text-sm text-gray-400 mb-4">Auto trading on a real account may execute real funds. Are you sure you want to enable it?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowConfirmReal(false)} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
            <button onClick={() => { setAutoMode(true); setShowConfirmReal(false); }} className="px-3 py-1 rounded bg-red-500">Confirm</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}