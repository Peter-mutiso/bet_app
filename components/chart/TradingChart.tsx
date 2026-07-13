"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useTradeStore } from "@/store/useTradeStore";

import ChartTopBar from "./overlays/ChartTopBar";

import {
    useChart,
} from "./hooks/useChart";

import {
    useLiveMarket,
} from "./hooks/useLiveMarket";

import {
    Candle,
} from "./types";

interface Props {
    initialInstrument?: string;
}

export default function TradingChart({

    initialInstrument = "Volatility 100",

}: Props) {

    /*
    ============================================================
    UI STATE
    ============================================================
    */
    const chartType = useTradeStore(
        (state) => state.chartType
    );

    const instrument = useTradeStore(
    state => state.selectedMarket?.name ??
        initialInstrument
);
    const [candleDuration, setCandleDuration] =
        useState(60);
    const timeframe = useTradeStore(
    state => state.timeframe
);
const selectedMarket = useTradeStore(
    state => state.selectedMarket
);
console.log(
    "TradingChart selectedMarket:",
    selectedMarket
);
const volatility = useTradeStore(
    state => state.volatilityState
);

useEffect(() => {
    console.log(
        "Selected Market:",
        selectedMarket?.symbol
    );

    console.log(
        "Calculated Volatility:",
        volatility
    );
}, [selectedMarket, volatility]);

    const [price, setPrice] =
        useState(100);
    
    const trades = useTradeStore(state => state.trades);

    /*
    ============================================================
    MARKET REFS
    ============================================================
    */

    const livePriceRef =
        useRef(price);

    const candlesRef =
        useRef<Candle[]>([]);

    const activeCandleRef =
        useRef<Candle | null>(null);

    const lastTimeRef =
        useRef(0);

    const followLiveRef =
        useRef(true);

    /*
    ============================================================
    CHART
    ============================================================
    */

   const {

    containerRef,

    chartRef,

    seriesRef,

    chart,

    series,

    initialized,

    width,

    height,

} = useChart(chartType);
    /*
    ============================================================
    LIVE MARKET
    ============================================================
    */

    useLiveMarket({

        chart,

        series,
        volatilityState: volatility,

        candleDuration,

        livePriceRef,

        candlesRef,

        activeCandleRef,

        lastTimeRef,

        followLiveRef,

        setPrice,

    });
useEffect(() => {

    let duration = 60;

    switch (timeframe) {

        case "1T":
            duration = 60;
            break;

        case "5T":
            duration = 300;
            break;

        case "15T":
            duration = 900;
            break;

        case "1H":
            duration = 3600;
            break;

        case "4H":
            duration = 14400;
            break;

        case "1D":
            duration = 86400;
            break;

    }

    setCandleDuration(duration);

    console.log(
        "Timeframe:",
        timeframe,
        "Duration:",
        duration
    );

}, [timeframe]);
    /*
    ============================================================
    KEEP REF IN SYNC
    ============================================================
    */

    useEffect(() => {

        livePriceRef.current = price;

    }, [price]);

    /*
    ============================================================
    LIVE BUTTON
    ============================================================
    */

    function handleLive() {

        followLiveRef.current = true;

        chart
            ?.timeScale()
            .scrollToRealTime();

    }

    /*
    ============================================================
    DEBUG
    ============================================================
    */

    useEffect(() => {

        console.log(
            "[TradingChart]",
            {
                initialized,
                chart: !!chart,
                series: !!series,
                candles:
                    candlesRef.current.length,
            }
        );

    }, [

        initialized,

        chart,

        series,

    ]);

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div
            className="trading-chart-wrapper"
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >

            <ChartTopBar

                selectedInstrument={
                    instrument
                }

                onInstrumentChange={() => {}}

                candle={

                    activeCandleRef.current
                        ? {

                            open:
                                activeCandleRef.current.open,

                            high:
                                activeCandleRef.current.high,

                            low:
                                activeCandleRef.current.low,

                            close:
                                activeCandleRef.current.close,

                        }
                        : null

                }

                onLive={
                    handleLive
                }

            />

            <div

    style={{
        flex: 1,
        position: "relative",
    }}

>

    <div
    ref={containerRef}
    className="trading-chart-container"
    style={{
        flex: 1,
        width: "100%",
        minHeight: 400,
        position: "relative",
    }}
>

</div>
     
</div>

        </div>

    );

}