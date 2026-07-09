"use client";

interface Props {

    open: number;

    high: number;

    low: number;

    close: number;

}

export default function OhlcDisplay({

    open,

    high,

    low,

    close,

}: Props) {

    return (

        <div className="ohlc-display">

            <span>

                O

                <strong>

                    {open.toFixed(2)}

                </strong>

            </span>

            <span>

                H

                <strong>

                    {high.toFixed(2)}

                </strong>

            </span>

            <span>

                L

                <strong>

                    {low.toFixed(2)}

                </strong>

            </span>

            <span>

                C

                <strong>

                    {close.toFixed(2)}

                </strong>

            </span>

        </div>

    );

}