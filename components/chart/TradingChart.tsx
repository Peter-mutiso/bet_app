"use client";

import { useEffect, useRef } from "react";
import {
    createChart,
    ColorType,
    CrosshairMode,
    IChartApi,
    ISeriesApi,
    CandlestickData,
    LineData,
    UTCTimestamp,
} from "lightweight-charts";
import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";


type Candle = CandlestickData;
function calculateEMA(
    candles: Candle[],
    period: number
) {

    if (candles.length < period) {

        return [];

    }

    const multiplier =
        2 / (period + 1);

    let ema =
        candles[0].close;

    return candles.map(candle => {

        ema =
            (candle.close - ema) *
            multiplier +
            ema;

        return {

            time: candle.time,

            value: ema

        };

    });

}

export default function TradingChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const chartRef = useRef<IChartApi | null>(null);

const seriesRef = useRef<ISeriesApi<any> | null>(null);

const ema9SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

const ema21SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
const bbUpperRef = useRef<ISeriesApi<"Line"> | null>(null);

const bbMiddleRef = useRef<ISeriesApi<"Line"> | null>(null);

const bbLowerRef = useRef<ISeriesApi<"Line"> | null>(null);

  const activeCandleRef = useRef<Candle | null>(null);
  const candlesRef = useRef<Candle[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastCandleTimeRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);

const followLiveRef = useRef(true);
  const ohlcRef = useRef<HTMLDivElement | null>(null);

  const { price } = useTradeStore();
  const theme =
    useTradeStore(
        s => s.theme
    );

const selectedInstrument =
    useTradeStore(
        s => s.selectedInstrument
    );

const setSelectedInstrument =
    useTradeStore(
        s => s.setSelectedInstrument
    );

const volatilityState =
    useTradeStore(
        s => s.volatilityState
    );

const setVolatilityState =
    useTradeStore(
        s => s.setVolatilityState
    );

const chartType =
    useTradeStore(
        s => s.chartType
    );

const timeframe =
    useTradeStore(
        s => s.timeframe
    );

const enabledIndicators =
    useTradeStore(
        s => s.enabledIndicators
    );
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
      handleScroll: {

    mouseWheel: true,

    pressedMouseMove: true,

    horzTouchDrag: true,

    vertTouchDrag: true,

},
      handleScale: {

    mouseWheel: true,

    pinch: true,

    axisPressedMouseMove: true,

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

    rightOffset: 5,

    barSpacing: 8,

    minBarSpacing: 2,

    fixLeftEdge: false,

    fixRightEdge: false,

    lockVisibleTimeRangeOnResize: true,

},
      crosshair: {

    mode: CrosshairMode.Normal,

    vertLine: {

        color: "#3b82f6",

        width: 1,

        style: 2,

        labelVisible: true,

    },

    horzLine: {

        color: "#3b82f6",

        width: 1,

        style: 2,

        labelVisible: true,

    },

},
    });

    chartRef.current = chart;
    chart.timeScale().subscribeVisibleLogicalRangeChange(() => {

    followLiveRef.current = false;

});

chart.subscribeCrosshairMove((param) => {

    if (
        !ohlcRef.current ||
        !param.time ||
        !param.seriesData
    ) {
        return;
    }

    const data =
    param.seriesData.get(
        seriesRef.current as any
    ) as any;

if (!data) {
    return;
}

if ("open" in data) {

    ohlcRef.current.innerHTML = `
        O: ${data.open.toFixed(2)}
        &nbsp;
        H: ${data.high.toFixed(2)}
        &nbsp;
        L: ${data.low.toFixed(2)}
        &nbsp;
        C: ${data.close.toFixed(2)}
    `;

}
else {

    ohlcRef.current.innerHTML = `
        Price:
        ${data.value.toFixed(2)}
    `;

}
containerRef.current?.addEventListener(

    "mouseleave",

    () => {

        if (ohlcRef.current) {

            ohlcRef.current.innerHTML =

                "O:- H:- L:- C:-";

        }

    }

);
});

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
    if (ema9SeriesRef.current) {
    try {
        chart.removeSeries(ema9SeriesRef.current);
    } catch {}
    ema9SeriesRef.current = null;
}

if (ema21SeriesRef.current) {
    try {
        chart.removeSeries(ema21SeriesRef.current);
    } catch {}
    ema21SeriesRef.current = null;
}

    // Double-buffer swap: create new series first, populate it, then remove old series
    const oldSeries = seriesRef.current;

    let series: ISeriesApi<any>;

    const isDark = theme === 'dark';
    const upColor = isDark ? "#22c55e" : "#0f9d58";
    const downColor = isDark ? "#ef4444" : "#d32f2f";

    switch (chartType) {
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
        chartType === "line" || chartType === "area"
          ? seed.map((c) => ({ time: c.time, value: c.close }))
          : seed
      );
      if (
    enabledIndicators.includes("EMA (9)")
) {

    ema9SeriesRef.current =
        chart.addLineSeries({

            color: "#3b82f6",

            lineWidth: 2,

            lastValueVisible: false,

            priceLineVisible: false

        });

    ema9SeriesRef.current.setData(

        calculateEMA(
            seed,
            9
        )
        

    );
function calculateBollinger(
    candles: Candle[],
    period = 20,
    multiplier = 2
) {

    if (candles.length < period) {

        return {
            upper: [],
            middle: [],
            lower: []
        };

    }

    const upper: LineData[] = [];

    const middle: LineData[] = [];

    const lower: LineData[] = [];

    for (

        let i = period - 1;

        i < candles.length;

        i++

    ) {

        const slice = candles.slice(

            i - period + 1,

            i + 1

        );

        const average =

            slice.reduce(

                (sum, candle) =>

                    sum + candle.close,

                0

            ) / period;

        const variance =

            slice.reduce(

                (sum, candle) =>

                    sum +

                    Math.pow(

                        candle.close - average,

                        2

                    ),

                0

            ) / period;

        const deviation =

            Math.sqrt(

                variance

            );

        upper.push({

            time: candles[i].time,

            value:

                average +

                deviation * multiplier

        });

        middle.push({

            time: candles[i].time,

            value: average

        });

        lower.push({

            time: candles[i].time,

            value:

                average -

                deviation * multiplier

        });

    }

    return {

        upper,

        middle,

        lower

    };

}
}

if (
    enabledIndicators.includes("EMA (21)")
) {

    ema21SeriesRef.current =
        chart.addLineSeries({

            color: "#f59e0b",

            lineWidth: 2,

            lastValueVisible: false,

            priceLineVisible: false

        });

    ema21SeriesRef.current.setData(

        calculateEMA(
            seed,
            21
        )

    );

}

if (followLiveRef.current) {

    chart.timeScale().scrollToRealTime();

}
    }

    // now make the new series live and remove the old one shortly after to avoid flicker
    seriesRef.current = newSeries;
    

if (

    enabledIndicators.includes(

        "EMA (21)"

    )

) {

    ema21SeriesRef.current =

        chart.addLineSeries({

            color: "#f59e0b",

            lineWidth: 2,

            lastValueVisible: false,

            priceLineVisible: false

        });

}
    if (oldSeries && oldSeries !== newSeries) {
      // schedule removal on next animation frame to make swap appear atomic
      requestAnimationFrame(() => {
        try { chart.removeSeries(oldSeries); } catch {}
      });
    }
  }, [
    chartType,
    theme,
    enabledIndicators,
    timeframe,
    selectedInstrument,
]);

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
      if (
    chartType === "line" ||
    chartType === "area"
) {

    series.update({

        time: now as UTCTimestamp,

        value: currentPrice,

    } as LineData);

}
else if (c) {

    series.update({

        ...c

    });

}

if (
    ema9SeriesRef.current
) {

    ema9SeriesRef.current.setData(

        calculateEMA(
            candlesRef.current,
            9
        )

    );

}

if (
    ema21SeriesRef.current
) {

    ema21SeriesRef.current.setData(

        calculateEMA(
            candlesRef.current,
            21
        )

    );

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
  }, [chartType]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute left-3 top-3 z-20 text-slate-300 text-xs">
        <div
    ref={ohlcRef}
    className="absolute top-3 right-4 z-30 rounded bg-black/70 px-3 py-1 text-xs text-white"
>

    O:
    -

    H:
    -

    L:
    -

    C:
    -

</div>
<button
    className="
        absolute
        top-12
        right-4
        z-30
        rounded
        bg-blue-600
        px-3
        py-1
        text-xs
        text-white
        hover:bg-blue-700
    "
    onClick={() => {

        followLiveRef.current = true;

        chartRef.current
            ?.timeScale()
            .scrollToRealTime();

    }}
>

    LIVE

</button>
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
