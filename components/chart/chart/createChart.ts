"use client";

import {
    ColorType,
    CrosshairMode,
    IChartApi,
    createChart,
} from "lightweight-charts";

/* ============================================================================
   BUILD CHART
============================================================================ */

export function buildChart(
    container: HTMLDivElement
): IChartApi {

    console.log(
        "[createChart] buildChart called"
    );

    console.log(
        "[createChart] Container details",
        {
            width: container.clientWidth,
            height: container.clientHeight,
            element: container,
            className: container.className,
        }
    );

    const width = Math.max(
        container.clientWidth,
        300
    );

    const height = Math.max(
        container.clientHeight,
        300
    );

    const chart = createChart(container, {

        width,

        height,

        layout: {

            background: {
                type: ColorType.Solid,
                color: "#111827",
            },

            textColor: "#9CA3AF",

            fontSize: 12,

            fontFamily:
                "Inter, sans-serif",

        },

        grid: {

            vertLines: {

                color:
                    "rgba(255,255,255,0.05)",

                visible: true,

            },

            horzLines: {

                color:
                    "rgba(255,255,255,0.05)",

                visible: true,

            },

        },

        crosshair: {

            mode:
                CrosshairMode.Normal,

            vertLine: {

                color:
                    "rgba(255,255,255,.25)",

                width: 1,

                style: 0,

                visible: true,

                labelVisible: true,

            },

            horzLine: {

                color:
                    "rgba(255,255,255,.25)",

                width: 1,

                style: 0,

                visible: true,

                labelVisible: true,

            },

        },

        rightPriceScale: {

            visible: true,

            borderVisible: false,

            autoScale: true,

            scaleMargins: {

                top: 0.15,

                bottom: 0.15,

            },

        },

        leftPriceScale: {

            visible: false,

        },

        timeScale: {

            visible: true,

            borderVisible: false,

            timeVisible: true,

            secondsVisible: false,

            rightOffset: 5,

            barSpacing: 10,

            minBarSpacing: 5,

            fixLeftEdge: false,

            fixRightEdge: false,

            lockVisibleTimeRangeOnResize: true,

            rightBarStaysOnScroll: true,

            shiftVisibleRangeOnNewBar: true,

        },

        handleScroll: {

            mouseWheel: true,

            pressedMouseMove: true,

            horzTouchDrag: true,

            vertTouchDrag: true,

        },

        handleScale: {

            axisPressedMouseMove: true,

            mouseWheel: true,

            pinch: true,

        },

        kineticScroll: {

            mouse: true,

            touch: true,

        },

    });

    chart.applyOptions({

        localization: {

            priceFormatter: (price: number) =>
                price.toFixed(2),

        },

    });

    console.log(
        "[createChart] Chart options",
        chart.options?.()
    );

    console.log(
        "[createChart] Chart instance created",
        {
            chart,
            type: typeof chart,
            hasTimeScale:
                !!chart.timeScale,
            hasRemove:
                !!chart.remove,
        }
    );

    return chart;
}