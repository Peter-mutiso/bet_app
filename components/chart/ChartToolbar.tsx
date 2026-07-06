"use client";

import {
    CandlestickChart,
    LineChart,
    AreaChart,
    Star,
    Maximize2,
    Activity,
    BarChart3
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";

import TimeframeSelector from "./TimeframeSelector";
import IndicatorPanel from "./IndicatorPanel";

export default function ChartToolbar() {

    const instrument =
        useTradeStore(state => state.selectedInstrument);

    const setInstrument =
        useTradeStore(state => state.setSelectedInstrument);

    const chartType =
        useTradeStore(state => state.chartType);

    const setChartType =
        useTradeStore(state => state.setChartType);

    const toggleFullscreen =
        useTradeStore(state => state.toggleFullscreen);

    const addToWatchlist =
        useTradeStore(state => state.addToWatchlist);

    return (

        <header className="chart-toolbar">

            <div className="toolbar-left">

                <div className="market-live">

                    <Activity size={14}/>

                    LIVE

                </div>

                <select

                    className="instrument-select"

                    value={instrument}

                    onChange={(e)=>

                        setInstrument(e.target.value)

                    }

                >

                    {

                        ALL_INSTRUMENTS.map(symbol=>(

                            <option

                                key={symbol}

                                value={symbol}

                            >

                                {symbol}

                            </option>

                        ))

                    }

                </select>

                <TimeframeSelector/>

            </div>

            <div className="toolbar-center">

                <button

                    className={

                        chartType==="candles"

                            ?"tool-btn active"

                            :"tool-btn"

                    }

                    onClick={()=>

                        setChartType("candles")

                    }

                >

                    <CandlestickChart size={17}/>

                </button>

                <button

                    className={

                        chartType==="line"

                            ?"tool-btn active"

                            :"tool-btn"

                    }

                    onClick={()=>

                        setChartType("line")

                    }

                >

                    <LineChart size={17}/>

                </button>

                <button

                    className={

                        chartType==="area"

                            ?"tool-btn active"

                            :"tool-btn"

                    }

                    onClick={()=>

                        setChartType("area")

                    }

                >

                    <AreaChart size={17}/>

                </button>

            </div>

            <div className="toolbar-right">

                <IndicatorPanel/>

                <button

                    className="tool-btn"

                    onClick={()=>

                        addToWatchlist(instrument)

                    }

                >

                    <Star size={16}/>

                </button>

                <button

                    className="tool-btn"

                    onClick={toggleFullscreen}

                >

                    <Maximize2 size={16}/>

                </button>

                <button className="analysis-btn">

                    <BarChart3 size={16}/>

                    Analysis

                </button>

            </div>

        </header>

    );

}