"use client";

import {

    ReactNode,

    useEffect,

    useState,

} from "react";

import type { Trade } from "@/types/trade";

interface Props {

    trade: Trade;

    children: ReactNode;

}

export default function AnimatedTradeCard({

    trade,

    children,

}: Props) {

    const [

        exiting,

        setExiting,

    ] = useState(false);

    const [

        settled,

        setSettled,

    ] = useState(false);

    useEffect(() => {

        if (

            trade.status === "CLOSED"

        ) {

            setSettled(true);

            const timer =

                window.setTimeout(() => {

                    setExiting(true);

                }, 250);

            return () =>

                clearTimeout(timer);

        }

    }, [

        trade.status,

    ]);

    return (

        <div

            className={`

trade-card

${settled ? "trade-settled" : ""}

${exiting ? "trade-exit" : ""}

`}

        >

            {children}

        </div>

    );

}