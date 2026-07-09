
"use client";

import {
    CandlestickChart,
    LineChart,
    AreaChart,
    ChartColumn,
    Star,
    Maximize2,
    Activity,
    BarChart3,
    ChevronDown,
    Settings2,
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";

import TimeframeSelector from "./TimeframeSelector";
import IndicatorPanel from "./IndicatorPanel";


export default function ChartToolbar() {


    const market = useTradeStore(
        (state) => state.selectedMarket
    );


    const chartType = useTradeStore(
        (state) => state.chartType
    );


    const setChartType = useTradeStore(
        (state) => state.setChartType
    );


    const toggleFullscreen = useTradeStore(
        (state) => state.toggleFullscreen
    );


    const addToWatchlist = useTradeStore(
        (state) => state.addToWatchlist
    );


    const setShowInstrumentPicker = useTradeStore(
        (state) => state.setShowInstrumentPicker
    );



    return (

        <header className="chart-toolbar">


            {/* LEFT */}

            <div className="toolbar-left">


                



                



                <TimeframeSelector />


            </div>




            {/* CENTER */}

            <div className="toolbar-center">


                <div className="chart-type-group">


                    <button
                        className={
                            chartType === "candles"
                            ? "tool-btn active"
                            : "tool-btn"
                        }

                        onClick={() =>
                            setChartType("candles")
                        }

                        title="Candlestick"
                    >
                        <CandlestickChart size={17}/>
                    </button>



                    <button
                        className={
                            chartType === "ohlc"
                            ? "tool-btn active"
                            : "tool-btn"
                        }

                        onClick={() =>
                            setChartType("ohlc")
                        }

                        title="OHLC"
                    >
                        <ChartColumn size={17}/>
                    </button>



                    <button
                        className={
                            chartType === "line"
                            ? "tool-btn active"
                            : "tool-btn"
                        }

                        onClick={() =>
                            setChartType("line")
                        }

                        title="Line"
                    >
                        <LineChart size={17}/>
                    </button>



                    <button
                        className={
                            chartType === "area"
                            ? "tool-btn active"
                            : "tool-btn"
                        }

                        onClick={() =>
                            setChartType("area")
                        }

                        title="Area"
                    >
                        <AreaChart size={17}/>
                    </button>


                </div>


            </div>





            {/* RIGHT */}

            <div className="toolbar-right">


                <div className="toolbar-divider"/>


                <IndicatorPanel />



                <button
                    className="tool-btn"
                    title="Watchlist"

                    onClick={() =>
                        addToWatchlist(
                            market?.name ??
                            "Volatility 100 Index"
                        )
                    }
                >

                    <Star size={16}/>

                </button>




                <button
                    className="tool-btn"
                    title="Fullscreen"

                    onClick={toggleFullscreen}
                >

                    <Maximize2 size={16}/>

                </button>




                <button
                    className="tool-btn"
                    title="Settings"
                >

                    <Settings2 size={16}/>

                </button>




                


            </div>


        </header>

    );
}
