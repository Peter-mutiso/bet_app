"use client";

import {
    CandlestickChart,
    LineChart,
    AreaChart,
    ChevronDown,
    Camera,
    Maximize2,
    BarChart3,
    Pencil,
    Layers
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";

import TimeframeSelector from "./TimeframeSelector";
import IndicatorPanel from "./IndicatorPanel";
import FullscreenButton from "./FullscreenButton";

export default function ChartToolbar() {

    const instrument =
        useTradeStore(
            state => state.selectedInstrument
        );

    const setInstrument =
        useTradeStore(
            state => state.setSelectedInstrument
        );

    const chartType =
        useTradeStore(
            state => state.chartType
        );

    const setChartType =
        useTradeStore(
            state => state.setChartType
        );

    return (

        <div className="h-[54px] border-b border-[#202734] bg-[#0f1724] px-5 flex items-center justify-between">

            {/* LEFT */}

            <div className="flex items-center gap-4">

                <div className="flex items-center gap-2">

                    <select
                        value={instrument}
                        onChange={(e)=>
                            setInstrument(e.target.value)
                        }
                        className="bg-[#182231] border border-[#2a3647] rounded-md px-3 py-2 text-sm text-white"
                    >

                        {ALL_INSTRUMENTS.map(symbol=>(
                            <option
                                key={symbol}
                                value={symbol}
                            >
                                {symbol}
                            </option>
                        ))}

                    </select>

                    <ChevronDown size={15}/>
                </div>

                <TimeframeSelector/>

            </div>

            {/* CENTER */}

            <div className="flex items-center gap-2">

                <button
                    onClick={()=>setChartType("candles")}
                    className={`toolbar-btn ${
                        chartType==="candles"
                            ? "bg-blue-600 text-white"
                            : ""
                    }`}
                >

                    <CandlestickChart size={17}/>

                </button>

                <button
                    onClick={()=>setChartType("line")}
                    className={`toolbar-btn ${
                        chartType==="line"
                            ? "bg-blue-600 text-white"
                            : ""
                    }`}
                >

                    <LineChart size={17}/>

                </button>

                <button
                    onClick={()=>setChartType("area")}
                    className={`toolbar-btn ${
                        chartType==="area"
                            ? "bg-blue-600 text-white"
                            : ""
                    }`}
                >

                    <AreaChart size={17}/>

                </button>

                <div className="w-px h-7 bg-[#2d3748]"/>

                <IndicatorPanel/>

                <button className="toolbar-btn">

                    <BarChart3 size={17}/>

                    <span>Compare</span>

                </button>

                <button className="toolbar-btn">

                    <Pencil size={17}/>

                    <span>Drawing</span>

                </button>

                <button className="toolbar-btn">

                    <Layers size={17}/>

                    <span>Templates</span>

                </button>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2">

                <button className="toolbar-btn">

                    <Camera size={17}/>

                </button>

                <FullscreenButton/>

            </div>

        </div>

    );

}