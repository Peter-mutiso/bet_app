"use client";

import InstrumentSelector from "./InstrumentSelector";
import OhlcDisplay from "./OhlcDisplay";

interface Props {

    selectedInstrument: string;

    onInstrumentChange(value: string): void;

    candle: {

        open: number;

        high: number;

        low: number;

        close: number;

    } | null;

    onLive(): void;

}

export default function ChartTopBar({

    selectedInstrument,

    onInstrumentChange,

    candle,

    onLive,

}: Props) {

    return (

        <div className="chart-top-bar">

            <div className="chart-top-left">

                <InstrumentSelector

                    value={selectedInstrument}

                    onChange={onInstrumentChange}

                />

            </div>

            <div className="chart-top-right">

                {candle && (

                    <OhlcDisplay

                        open={candle.open}

                        high={candle.high}

                        low={candle.low}

                        close={candle.close}

                    />

                )}

                <button

                    className="live-button"

                    onClick={onLive}

                >

                    LIVE

                </button>

            </div>

        </div>

    );

}