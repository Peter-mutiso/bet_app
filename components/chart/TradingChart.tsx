"use client";

import { useEffect, useRef, useState } from "react";

import {
    createChart,
    ColorType,
    CrosshairMode,
    LineStyle,
    IChartApi,
    ISeriesApi,
    CandlestickData,
    LineData,
    UTCTimestamp,
} from "lightweight-charts";

import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";

/* ==========================================================
   TYPES
========================================================== */

type Candle = CandlestickData;

/* ==========================================================
   EMA
========================================================== */

function calculateEMA(
    candles: Candle[],
    period: number
): LineData[] {

    if (candles.length === 0) return [];

    const multiplier = 2 / (period + 1);

    let ema = candles[0].close;

    return candles.map(candle => {

        ema =
            ema +
            (candle.close - ema) *
            multiplier;

        return {

            time: candle.time,

            value: ema

        };

    });

}

/* ==========================================================
   BOLLINGER
========================================================== */

function calculateBollinger(

    candles: Candle[],

    period = 20,

    multiplier = 2

) {

    const upper: LineData[] = [];
    const middle: LineData[] = [];
    const lower: LineData[] = [];

    if (candles.length < period) {

        return {

            upper,
            middle,
            lower

        };

    }

    for (

        let i = period - 1;

        i < candles.length;

        i++

    ) {

        const slice = candles.slice(

            i - period + 1,

            i + 1

        );

        const mean =

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

                        candle.close - mean,

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

                mean +

                deviation *

                multiplier

        });

        middle.push({

            time: candles[i].time,

            value: mean

        });

        lower.push({

            time: candles[i].time,

            value:

                mean -

                deviation *

                multiplier

        });

    }

    return {

        upper,
        middle,
        lower

    };

}

/* ==========================================================
   COMPONENT
========================================================== */

export default function TradingChart() {

    const containerRef =
        useRef<HTMLDivElement>(null);

    const chartRef =
        useRef<IChartApi | null>(null);

    const seriesRef =
        useRef<ISeriesApi<any> | null>(null);

    const ema9SeriesRef =
        useRef<ISeriesApi<"Line"> | null>(null);

    const ema21SeriesRef =
        useRef<ISeriesApi<"Line"> | null>(null);

    const bbUpperRef =
        useRef<ISeriesApi<"Line"> | null>(null);

    const bbMiddleRef =
        useRef<ISeriesApi<"Line"> | null>(null);

    const bbLowerRef =
        useRef<ISeriesApi<"Line"> | null>(null);

    const candlesRef =
        useRef<Candle[]>([]);

    const activeCandleRef =
        useRef<Candle | null>(null);

    const lastCandleTimeRef =
        useRef<number>(0);

    const livePriceRef =
        useRef(100);

    const frameRef = useRef<number | null>(null);

    const followLiveRef =
        useRef(true);

    const saveTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

    const ohlcRef =
        useRef<HTMLDivElement>(null);

    const [chartInitialized, setChartInitialized] =
        useState(false);

    const {

        price,

        theme,

        chartType,

        timeframe,

        enabledIndicators,

        selectedInstrument,

        setSelectedInstrument,

        volatilityState,

    } = useTradeStore();

    useEffect(() => {

        livePriceRef.current = price;

    }, [price]);

    const instruments =
        ALL_INSTRUMENTS ??
        [selectedInstrument];

/* ==========================================================
   CREATE CHART
========================================================== */

useEffect(() => {

    if (!containerRef.current) return;

    const chart = createChart(

        containerRef.current,

        {

            width:
                containerRef.current.clientWidth,

            height:
                containerRef.current.clientHeight,

            layout: {

                background: {

                    type: ColorType.Solid,

                    color: "#0b1220"

                },

                textColor: "#cbd5e1"

            },

            grid: {

                vertLines: {

                    color: "rgba(255,255,255,.04)"

                },

                horzLines: {

                    color: "rgba(255,255,255,.04)"

                }

            },

            crosshair: {

                mode: CrosshairMode.Normal,

                vertLine: {

                    color: "#3b82f6",

                    style: LineStyle.Dashed,

                    width: 1,

                    labelVisible: true

                },

                horzLine: {

                    color: "#3b82f6",

                    style: LineStyle.Dashed,

                    width: 1,

                    labelVisible: true

                }

            },

            rightPriceScale: {

                borderColor: "#1e293b",

                scaleMargins: {

                    top: 0.1,

                    bottom: 0.15

                }

            },

            timeScale: {

                borderColor: "#1e293b",

                rightOffset: 8,

                barSpacing: 18,

                minBarSpacing: 10,

                timeVisible: true,

                secondsVisible: true

            }

        }

    );

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {

        if (!containerRef.current) return;

        chart.applyOptions({

            width:
                containerRef.current.clientWidth,

            height:
                containerRef.current.clientHeight

        });

    });

    resizeObserver.observe(

        containerRef.current

    );

    setChartInitialized(true);

    return () => {

        resizeObserver.disconnect();

        chart.remove();

        chartRef.current = null;

        setChartInitialized(false);

    };

}, []);

/* ==========================================================
   BUILD / REBUILD SERIES
========================================================== */

useEffect(() => {

    if (!chartInitialized) return;
    if (!chartRef.current) return;

    const chart = chartRef.current;

    /* --------------------------------------------------
       REMOVE OLD SERIES
    -------------------------------------------------- */

    [
        seriesRef.current,
        ema9SeriesRef.current,
        ema21SeriesRef.current,
        bbUpperRef.current,
        bbMiddleRef.current,
        bbLowerRef.current

    ].forEach(series => {

        if (!series) return;

        try {
            chart.removeSeries(series);
        } catch {}

    });

    seriesRef.current = null;
    ema9SeriesRef.current = null;
    ema21SeriesRef.current = null;
    bbUpperRef.current = null;
    bbMiddleRef.current = null;
    bbLowerRef.current = null;

    const bullish = "#22c55e";
    const bearish = "#ef4444";

    switch (chartType) {

        case "line":

            seriesRef.current =
                chart.addLineSeries({

                    color: "#3b82f6",

                    lineWidth: 2,

                    lastValueVisible: true,

                    priceLineVisible: true

                });

            break;

        case "area":

            seriesRef.current =
                chart.addAreaSeries({

                    lineColor: "#3b82f6",

                    topColor: "rgba(59,130,246,.35)",

                    bottomColor: "rgba(59,130,246,.02)"

                });

            break;

        default:

            seriesRef.current =
                chart.addCandlestickSeries({

                    upColor: bullish,

                    downColor: bearish,

                    borderUpColor: bullish,

                    borderDownColor: bearish,

                    wickUpColor: bullish,

                    wickDownColor: bearish,

                    lastValueVisible: true,

                    priceLineVisible: true

                });

    }

    /* --------------------------------------------------
       LOAD / GENERATE HISTORY
    -------------------------------------------------- */

}, [

    chartType,

    theme,

    timeframe,

    enabledIndicators,

    selectedInstrument,

    chartInitialized

]);
/* ===========================================================
   LIVE MARKET ENGINE
=========================================================== */

useEffect(() => {

    if (!chartInitialized) return;

    let momentum = 0;
    let volatility = 0.20;
    let tickCounter = 0;

    // Market state
let regime = 0;

let regimeLife = 0;

let trendStrength = 0;

let impulse = 0;

let meanPrice = livePriceRef.current;

    const candleDuration = 5;

    const animate = () => {

        if (!seriesRef.current || !chartRef.current) {

            frameRef.current = requestAnimationFrame(animate);

            return;

        }

        tickCounter++;

        /* ---------------- FPS ---------------- */

        const fps = 4;

        if (tickCounter % Math.floor(60 / fps) !== 0) {

            frameRef.current = requestAnimationFrame(animate);

            return;

        }

        regimeLife--;

if (regimeLife <= 0) {

    regimeLife =
        40 +
        Math.floor(Math.random() * 180);

    regime =
        Math.floor(Math.random() * 5);

    trendStrength =
        0.02 +
        Math.random() * 0.18;

}

        /* ---------------- VOLATILITY ---------------- */

        switch (volatilityState) {

            case 0:
                volatility = 0.08;
                break;

            case 1:
                volatility = 0.15;
                break;

            case 2:
                volatility = 0.22;
                break;

            case 3:
                volatility = 0.35;
                break;

            default:
                volatility = 0.50;

        }





        let drift = 0;

switch (regime) {

    case 0:

        // Range

        drift =
            (meanPrice - livePriceRef.current)
            * 0.015;

        break;

    case 1:

        // Bull

        drift =
            trendStrength +
            (Math.random() - 0.5) * 0.04;

        break;

    case 2:

        // Bear

        drift =
            -trendStrength +
            (Math.random() - 0.5) * 0.04;

        break;

    case 3:

        // Breakout up

        drift =
            trendStrength *

(2 + Math.random() * 4);

        break;

    case 4:

        // Breakout down

        drift =
            trendStrength *

(2 + Math.random() * 4);

        break;

}




        if (Math.random() < 0.02) {

    impulse +=

        (Math.random() > 0.5 ? 1 : -1)

        *

        volatility

        *

        (3 + Math.random() * 7);

}

impulse *= 0.92;

        /* ---------------- MOMENTUM ---------------- */

        momentum += drift;

        momentum *= 0.95;

        if (

    regime !== 0 &&

    Math.random() < 0.02

) {

    momentum *= -0.8;

}

        const noise =
            (Math.random() - 0.5) *
            volatility *
            1.6;

        const pullback =

-drift *

Math.random()

*

0.5;

const move =

momentum +

noise +

impulse +

pullback;

livePriceRef.current += move;

meanPrice +=

(livePriceRef.current - meanPrice)

* 0.004;

        const marketPrice =
            livePriceRef.current;

        /* ---------------- CANDLE TIME ---------------- */

        const now =
            (
                Math.floor(
                    Date.now() /
                    1000 /
                    candleDuration
                ) *
                candleDuration
            ) as UTCTimestamp;

        /* ---------------- NEW CANDLE ---------------- */

        if (now !== lastCandleTimeRef.current) {

            const previousClose =
                activeCandleRef.current?.close ??
                marketPrice;

            activeCandleRef.current = {

                time: now,

                open: previousClose,

                high: previousClose,

                low: previousClose,

                close: previousClose

            };

            candlesRef.current.push(
                activeCandleRef.current
            );

            if (candlesRef.current.length > 600) {

                candlesRef.current.shift();

            }

            lastCandleTimeRef.current = now;

        }

        /* ---------------- UPDATE CANDLE ---------------- */

        const candle =
            activeCandleRef.current;

        if (candle) {

            candle.close = marketPrice;

            const wick =

                Math.abs(move) * 0.15 +
                Math.random() * 0.015;

            candle.high = Math.max(

                candle.high,

                candle.open,

                candle.close

            ) + wick;

            candle.low = Math.min(

                candle.low,

                candle.open,

                candle.close

            ) - wick;

        }

        /* ---------------- UPDATE SERIES ---------------- */

        const usingCandles =

            chartType !== "line" &&
            chartType !== "area";

        if (usingCandles && candle) {

            (seriesRef.current as any)
                .update(candle);

        } else {

            (seriesRef.current as any)
                .update({

                    time: now,

                    value: marketPrice

                });

        }

        /* ---------------- EMA ---------------- */

        if (ema9SeriesRef.current) {

            ema9SeriesRef.current.setData(

                calculateEMA(
                    candlesRef.current,
                    9
                )

            );

        }

        if (ema21SeriesRef.current) {

            ema21SeriesRef.current.setData(

                calculateEMA(
                    candlesRef.current,
                    21
                )

            );

        }

        /* ---------------- BOLLINGER ---------------- */

        if (

            bbUpperRef.current &&
            bbMiddleRef.current &&
            bbLowerRef.current

        ) {

            const bands =

                calculateBollinger(
                    candlesRef.current
                );

            bbUpperRef.current.setData(bands.upper);
            bbMiddleRef.current.setData(bands.middle);
            bbLowerRef.current.setData(bands.lower);

        }

        /* ---------------- FOLLOW LIVE ---------------- */

        if (followLiveRef.current) {

            chartRef.current
                .timeScale()
                .scrollToRealTime();

        }

        /* ---------------- SAVE ---------------- */

        if (tickCounter % 25 === 0) {

            clearTimeout(saveTimeoutRef.current!);

            saveTimeoutRef.current =
                setTimeout(() => {

                    localStorage.setItem(

                        `chart:${selectedInstrument}`,

                        JSON.stringify(
                            candlesRef.current
                        )

                    );

                }, 500);

        }

        frameRef.current =
            requestAnimationFrame(animate);

    };

    frameRef.current =
        requestAnimationFrame(animate);

    return () => {

        if (frameRef.current) {

            cancelAnimationFrame(
                frameRef.current
            );

        }

    };

}, [

    chartInitialized,

    chartType,

    volatilityState,

    selectedInstrument

]);
/* ===========================================================
   RENDER
=========================================================== */

return (

    <div
        className="relative w-full h-full"
        style={{
            width: "100%",
            height: "100%",
            minHeight: "420px"
        }}
    >

        {/* ===========================
            CHART
        =========================== */}

        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%"
            }}
        />

        {/* ===========================
            TOP BAR
        =========================== */}

        <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between">

            {/* LEFT */}

            <div className="flex items-center gap-3">

                <select

                    value={selectedInstrument}

                    onChange={(e) =>
                        setSelectedInstrument(
                            e.target.value
                        )
                    }

                    className="rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-xs text-white"

                >

                    {instruments.map(instrument => (

                        <option
                            key={instrument}
                            value={instrument}
                        >

                            {instrument}

                        </option>

                    ))}

                </select>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

                <div

                    ref={ohlcRef}

                    className="rounded-lg bg-black/70 px-4 py-2 font-mono text-xs text-white"

                >

                    O:- H:- L:- C:-

                </div>

                <button

                    onClick={() => {

                        followLiveRef.current = true;

                        chartRef.current
                            ?.timeScale()
                            .scrollToRealTime();

                    }}

                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-500"

                >

                    LIVE

                </button>

            </div>

        </div>

    </div>

);

}