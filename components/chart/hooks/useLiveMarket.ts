"use client";
import { IChartApi } from "lightweight-charts";
import {
    useEffect,
    useRef,
    type MutableRefObject,
} from "react";
import { useTradeStore } from "@/store/useTradeStore";
import { chartCoordinates } from "../engine/chartCoordinates";
import {
    createEngine,
    applyVolatility,
    nextTick,
} from "../engine/marketEngine";

import {
    createCandle,
    updateCandle,
    candleTimestamp,
    appendHistory,
} from "../engine/candleEngine";

import {
    generateHistory,
} from "../engine/historyEngine";
import { updateTradeMarkers } from "../chart/tradeMarkers";
import {
    updateSeries,
} from "../chart/createSeries";

import {
    Candle,
    ChartSeries,
} from "../types";

interface UseLiveMarketProps {

    chart: IChartApi | null;

    series: ChartSeries | null;

    volatilityState: number;

    candleDuration: number;

    livePriceRef: MutableRefObject<number>;

    candlesRef: MutableRefObject<Candle[]>;

    activeCandleRef: MutableRefObject<Candle | null>;

    lastTimeRef: MutableRefObject<number>;

    followLiveRef: MutableRefObject<boolean>;

    setPrice: (price: number) => void;

}

export function useLiveMarket({

    chart,

    series,

    volatilityState,

    candleDuration,

    livePriceRef,

    candlesRef,

    activeCandleRef,

    lastTimeRef,

    followLiveRef,

    setPrice,

}: UseLiveMarketProps) {

    const engineRef = useRef(

        createEngine(

            livePriceRef.current || 100

        )

    );
    const tickTrades = useTradeStore(
    state => state.tickTrades
);

const updateOpenTrades = useTradeStore(
    state => state.updateOpenTrades
);

    const frameRef = useRef<number | null>(null);

    const lastFrameRef = useRef(0);

    const TICKS_PER_SECOND = 12;

    const FRAME_INTERVAL =

        1000 / TICKS_PER_SECOND;

    /*
    ===========================================================
    INITIAL HISTORY
    ===========================================================
    */

    useEffect(() => {

        if (!series) return;
        console.log(
    "Generating history with volatility:",
    volatilityState
);
engineRef.current = createEngine(
    livePriceRef.current || 100
);

applyVolatility(
    engineRef.current,
    volatilityState
);
console.log(
    "Selected market:",
    useTradeStore.getState().selectedMarket?.symbol
);
        const history = generateHistory(

            livePriceRef.current || 100,

            candleDuration,

            volatilityState,

            400

        );
        chartCoordinates.setLayout(

    9,

    80

);

chartCoordinates.rebuild(

    history.map(c => Number(c.time))

);
        candlesRef.current = history;

        activeCandleRef.current =

            history[history.length - 1];

        lastTimeRef.current =

            Number(

                activeCandleRef.current.time

            );

        series.candles.setData(history);
        if (chart) {
    chart.timeScale().fitContent();
}

        series.ohlc.setData(history);

        series.line.setData(

            history.map(c => ({

                time: c.time,

                value: c.close,

            }))

        );

        series.area.setData(

            history.map(c => ({

                time: c.time,

                value: c.close,

            }))

        );

        const last =

            history[history.length - 1];
        engineRef.current.price = last.close;

engineRef.current.lastPrice = last.close;

engineRef.current.meanPrice = last.close;

        livePriceRef.current =

            last.close;

        setPrice(last.close);

        applyVolatility(

            engineRef.current,

            volatilityState

        );

    }, [

        series,

        candleDuration,
        volatilityState,

    ]);

    /*
    ===========================================================
    UPDATE VOLATILITY
    ===========================================================
    */

    useEffect(() => {

        applyVolatility(

            engineRef.current,

            volatilityState

        );

    }, [

        volatilityState,

    ]);

    /*
    ===========================================================
    LIVE LOOP
    ===========================================================
    */

    useEffect(() => {

        if (!series || !chart) {

    return;

}
        const animate = (

            now: number

        ) => {

            if (

                now -

                lastFrameRef.current >=

                FRAME_INTERVAL

            ) {

                lastFrameRef.current = now;

                            const tick = nextTick(

                    engineRef.current,

                    livePriceRef.current

                );

                livePriceRef.current = tick.price;

setPrice(tick.price);

// Update all active trades
updateOpenTrades(tick.price);
tickTrades(tick.price);
                const currentTime = Number(

                    candleTimestamp(

                        candleDuration

                    )

                );

                /*
                =======================================================
                START FIRST LIVE CANDLE
                =======================================================
                */

                if (

                    !activeCandleRef.current

                ) {

                    activeCandleRef.current =

                        createCandle(

                            currentTime as any,

                            tick.price

                        );

                    lastTimeRef.current =

                        currentTime;

                }

                /*
                =======================================================
                NEW CANDLE
                =======================================================
                */

                if (

                    currentTime >

                    lastTimeRef.current

                ) {

                    appendHistory(

                        candlesRef.current,

                        activeCandleRef.current

                    );
                    chartCoordinates.rebuild(

    candlesRef.current.map(

        c => Number(c.time)

    )

);

                    activeCandleRef.current =

                        createCandle(

                            currentTime as any,

                            activeCandleRef.current.close

                        );

                    lastTimeRef.current =

                        currentTime;

                    engineRef.current.candleCounter++;

                }

                /*
                =======================================================
                UPDATE CURRENT CANDLE
                =======================================================
                */

                updateCandle(

                    activeCandleRef.current,

                    tick.price,

                    tick.move,

                    engineRef.current.volatility

                );

                /*
                =======================================================
                UPDATE CHART
                =======================================================
                */

                updateSeries(

    series,

    activeCandleRef.current,

    tick.price,

    activeCandleRef.current.time

);
const currentTrades = useTradeStore.getState().trades;

updateTradeMarkers(
    series.candles,
    currentTrades
);

                /*
                =======================================================
                AUTO FOLLOW
                =======================================================
                */

                if (

                    followLiveRef.current

                ) {

                    chart

                        .timeScale()

                        .scrollToRealTime();

                }
                            }

            frameRef.current =

                requestAnimationFrame(

                    animate

                );

        };

        frameRef.current =

            requestAnimationFrame(

                animate

            );

        return () => {

            if (
    frameRef.current !== null
) {

                cancelAnimationFrame(

                    frameRef.current

                );

            }

        };

    }, [

        chart,

        series,

        candleDuration,

        volatilityState,

        setPrice,
        tickTrades,

    updateOpenTrades,


    ]);
        

}