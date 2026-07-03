"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  UTCTimestamp,
} from "lightweight-charts";
import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";

type Props = {
  type?: "line" | "candles" | "area" | "ohlc" | "hollow";
};

type Candle = CandlestickData;

export default function TradingChart({
  type = "candles",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);

  const activeCandleRef = useRef<Candle | null>(null);
  const candlesRef = useRef<Candle[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastCandleTimeRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);

  const { price } = useTradeStore();
  const theme = useTradeStore((s) => s.theme);
  const selectedInstrument = useTradeStore((s) => s.selectedInstrument);
  const setSelectedInstrument = useTradeStore((s) => s.setSelectedInstrument);
  const volatilityState = useTradeStore((s) => s.volatilityState);
  const setVolatilityState = useTradeStore((s) => s.setVolatilityState);
  const INSTRUMENTS = ALL_INSTRUMENTS || [selectedInstrument];

  // small overlay UI for instrument and volatility switching inside the chart
  // Overlay is rendered as React JSX in the returned DOM (no manual DOM insertion)

  // =====================================================
  // CHART INIT
  // =====================================================
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,

      layout: {
        background: {
          type: ColorType.Solid,
          color: "#111317",
        },
        textColor: "#9ca3af",
      },

      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },

      rightPriceScale: {
        borderColor: "#2a2e39",
      },

      timeScale: {
        borderColor: "#2a2e39",
        timeVisible: true,
        secondsVisible: true,
      },
    });

    chartRef.current = chart;
    chart.timeScale().fitContent();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (chartRef.current && seriesRef.current) {
        try {
          chartRef.current.removeSeries(seriesRef.current);
        } catch {}
      }

      try { chartRef.current?.remove(); } catch {}

      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Seed candle data once on mount so switching types/themes doesn't reseed
  useEffect(() => {
    if (candlesRef.current && candlesRef.current.length) return;

    const seed: Candle[] = [];

    let seedPrice = price;
    const now = Math.floor(Date.now() / 1000) - 60;

    for (let i = 0; i < 60; i++) {
      const drift = (Math.random() - 0.5) * 0.6;

      const open = seedPrice;
      const close = seedPrice + drift;

      seed.push({
        time: (now + i) as UTCTimestamp,
        open,
        high: Math.max(open, close),
        low: Math.min(open, close),
        close,
      });

      seedPrice = close;
    }

    candlesRef.current = seed;
    lastCandleTimeRef.current = seed[seed.length - 1].time as number;
  }, []);

  // Load persisted candles when instrument changes
  useEffect(() => {
    try {
      const key = `chart:candles:${selectedInstrument}`;
      const txt = localStorage.getItem(key);
      if (txt) {
        const parsed = JSON.parse(txt) as Candle[];
        if (Array.isArray(parsed) && parsed.length) {
          candlesRef.current = parsed;
          activeCandleRef.current = parsed[parsed.length - 1];
          lastCandleTimeRef.current = parsed[parsed.length - 1].time as number;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [selectedInstrument]);

  // =====================================================
  // RESIZE
  // =====================================================
  useEffect(() => {
    const resize = () => {
      if (!chartRef.current || !containerRef.current) return;

      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // =====================================================
  // SERIES
  // =====================================================
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    // Double-buffer swap: create new series first, populate it, then remove old series
    const oldSeries = seriesRef.current;

    let series: ISeriesApi<any>;

    const isDark = theme === 'dark';
    const upColor = isDark ? "#22c55e" : "#0f9d58";
    const downColor = isDark ? "#ef4444" : "#d32f2f";

    switch (type) {
      case "line":
        series = chart.addLineSeries({
          color: isDark ? "#3b82f6" : "#1e40af",
          lineWidth: 2,
        });
        break;

      case "area":
        series = chart.addAreaSeries({
          lineColor: isDark ? "#14b8a6" : "#0b6b58",
          topColor: isDark ? "rgba(20,184,166,0.25)" : "rgba(11,107,88,0.12)",
          bottomColor: isDark ? "rgba(20,184,166,0.02)" : "rgba(11,107,88,0.02)",
        });
        break;

      default:
        series = chart.addCandlestickSeries({
          upColor,
          downColor,
          borderUpColor: upColor,
          borderDownColor: downColor,
          wickUpColor: upColor,
          wickDownColor: downColor,
        });
    }

    // temporarily hold the new series while we populate it
    let newSeries: ISeriesApi<any> | null = series;

    // populate from preserved seed
    const seed = candlesRef.current || [];
    if (seed.length && newSeries) {
      lastCandleTimeRef.current = seed[seed.length - 1].time as number;

      newSeries.setData(
        type === "line" || type === "area"
          ? seed.map((c) => ({ time: c.time, value: c.close }))
          : seed
      );

      chart.timeScale().scrollToRealTime();
    }

    // now make the new series live and remove the old one shortly after to avoid flicker
    seriesRef.current = newSeries;
    if (oldSeries && oldSeries !== newSeries) {
      // schedule removal on next animation frame to make swap appear atomic
      requestAnimationFrame(() => {
        try { chart.removeSeries(oldSeries); } catch {}
      });
    }
  }, [type, theme]);

  // =====================================================
  // LIVE ENGINE (STABLE CANDLE LOGIC)
  // =====================================================
  useEffect(() => {
    const update = () => {
      const series = seriesRef.current;
      if (!chartRef.current || !series) {
        frameRef.current = requestAnimationFrame(update);
        return;
      }

      // smoothing: use a simple EMA so chart moves smoothly across types
      const rawPrice = useTradeStore.getState().price;
      const prevSmoothed = (seriesRef as any)._smoothedPrice || rawPrice;
      const alpha = 0.2; // smoothing factor (tweakable)
      const smoothed = prevSmoothed * (1 - alpha) + rawPrice * alpha;
      (seriesRef as any)._smoothedPrice = smoothed;

      const currentPrice = smoothed;
      const now = Math.floor(Date.now() / 1000);

      // =====================================================
      // NEW CANDLE CHECK (STRICT)
      // =====================================================
      const isNewCandle = now !== lastCandleTimeRef.current;

      if (isNewCandle) {
        const newCandle: Candle = {
          time: now as UTCTimestamp,
          open: activeCandleRef.current
            ? activeCandleRef.current.close
            : currentPrice,
          high: currentPrice,
          low: currentPrice,
          close: currentPrice,
        };

        activeCandleRef.current = newCandle;
        candlesRef.current.push(newCandle);

        if (candlesRef.current.length > 300) {
          candlesRef.current.shift();
        }

        lastCandleTimeRef.current = now;

        // schedule a save of the new candles to localStorage (throttled)
        try {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => {
            try {
              const key = `chart:candles:${selectedInstrument}`;
              const toSave = candlesRef.current.slice(-300); // limit size
              localStorage.setItem(key, JSON.stringify(toSave));
            } catch (e) {}
            saveTimeoutRef.current = null;
          }, 1500);
        } catch (e) {}
      }

      // =====================================================
      // UPDATE ACTIVE CANDLE (with tails)
      // =====================================================
      const c = activeCandleRef.current;

      if (c) {
        // add slight jitter for tails
        const jitterHigh = Math.max(currentPrice, c.high) + Math.random() * 0.02;
        const jitterLow = Math.min(currentPrice, c.low) - Math.random() * 0.02;

        c.close = currentPrice;
        if (currentPrice > c.high) c.high = jitterHigh;
        if (currentPrice < c.low) c.low = jitterLow;
      }

      // =====================================================
      // RENDER
      // =====================================================
      if (type === "line" || type === "area") {
        series.update({
          time: now as UTCTimestamp,
          value: currentPrice,
        } as LineData);
      } else if (c) {
        series.update({ ...c });
      }

      // render trade markers
      try {
        const trades = useTradeStore.getState().trades;
        const markers = trades.map((t) => {
          if (t.status === "OPEN") {
            return {
              time: t.entryTime || Math.floor(Date.now() / 1000),
              position: "belowBar",
              color: "#2563eb",
              shape: "arrowUp",
              text: `${t.tradeType ?? ""} ${t.stake}`,
            } as any;
          }

          return {
            time: t.exitTime || Math.floor(Date.now() / 1000),
            position: "aboveBar",
            color: t.profit && t.profit > 0 ? "#16a34a" : "#ef4444",
            shape: "arrowDown",
            text: `${t.tradeType ?? ""} ${t.profit?.toFixed(2) ?? ""}`,
          } as any;
        });

        series.setMarkers(markers as any[]);
      } catch (e) {
        // ignore marker errors
      }

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [type]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute left-3 top-3 z-20 text-slate-300 text-xs">
        <div className="flex flex-col gap-2">
          <select
            aria-label="Instrument"
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="bg-[#0b1220] text-slate-300 rounded px-2 py-1 text-xs"
          >
            {INSTRUMENTS.slice(0, 40).map((it: string) => (
              <option key={it} value={it}>{it}</option>
            ))}
          </select>

          <select
            aria-label="Volatility"
            value={String(volatilityState)}
            onChange={(e) => setVolatilityState(Number(e.target.value) as 0|1|2|3|4)}
            className="bg-[#0b1220] text-slate-300 rounded px-2 py-1 text-xs"
          >
            <option value="0">CALM</option>
            <option value="1">LOW</option>
            <option value="2">NORMAL</option>
            <option value="3">HIGH</option>
            <option value="4">EXTREME</option>
          </select>
        </div>
      </div>
    </div>
  );
}
