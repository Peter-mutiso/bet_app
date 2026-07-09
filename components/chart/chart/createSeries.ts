"use client";

import {
    IChartApi,
    LineStyle,
} from "lightweight-charts";

import { ChartSeries } from "../types";

export type ChartType =
    | "candles"
    | "line"
    | "area"
    | "ohlc";

/* ============================================================================
   BUILD SERIES
============================================================================ */

export function buildSeries(
    chart: IChartApi,
    chartType: ChartType = "candles"
): ChartSeries {

    /* ------------------------------------------------------------------------
       Candlesticks
    ------------------------------------------------------------------------ */

    const candles = chart.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
        priceLineVisible: true,
        lastValueVisible: true,
    });

    /* ------------------------------------------------------------------------
       Line
    ------------------------------------------------------------------------ */

    const line = chart.addLineSeries({
        color: "#3b82f6",
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
    });

    /* ------------------------------------------------------------------------
       Area
    ------------------------------------------------------------------------ */

    const area = chart.addAreaSeries({
        lineColor: "#2563eb",
        topColor: "rgba(37,99,235,.35)",
        bottomColor: "rgba(37,99,235,.02)",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
    });

    /* ------------------------------------------------------------------------
       OHLC
    ------------------------------------------------------------------------ */

    const ohlc = chart.addBarSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        thinBars: false,
        openVisible: true,
    });

    /* ------------------------------------------------------------------------
       Initial visibility
    ------------------------------------------------------------------------ */

    candles.applyOptions({
        visible: chartType === "candles",
    });

    line.applyOptions({
        visible: chartType === "line",
    });

    area.applyOptions({
        visible: chartType === "area",
    });

    ohlc.applyOptions({
        visible: chartType === "ohlc",
    });

    return {
        candles,
        line,
        area,
        ohlc,
    };
}

/* ============================================================================
   SWITCH ACTIVE SERIES
============================================================================ */

export function setChartType(
    series: ChartSeries,
    type: ChartType
): void {

    series.candles.applyOptions({
        visible: type === "candles",
    });

    series.line.applyOptions({
        visible: type === "line",
    });

    series.area.applyOptions({
        visible: type === "area",
    });

    series.ohlc.applyOptions({
        visible: type === "ohlc",
    });

}

/* ============================================================================
   REMOVE SERIES
============================================================================ */

export function removeSeries(
    chart: IChartApi,
    series: ChartSeries
): void {

    chart.removeSeries(series.candles);
    chart.removeSeries(series.line);
    chart.removeSeries(series.area);
    chart.removeSeries(series.ohlc);

}

/* ============================================================================
   UPDATE ALL SERIES
============================================================================ */

export function updateSeries(
    series: ChartSeries,
    candle: any,
    price: number,
    time: any
): void {

    /* Candlestick */

    series.candles.update(candle);

    /* OHLC */

    series.ohlc.update(candle);

    /* Line */

    series.line.update({
        time,
        value: price,
    });

    /* Area */

    series.area.update({
        time,
        value: price,
    });

}