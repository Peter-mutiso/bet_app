/**
 * ============================================================================
 * TRADING CHART HOOK
 * ============================================================================
 */

import {

    useEffect,

    useMemo,

    useState

} from "react";

import {

    Tick,

    TradingProvider

} from "../services/trading/provider";

export interface ChartPoint {

    time: number;

    value: number;

}

export function useTradingChart(

    provider: TradingProvider,

    symbol: string

) {

    const [

        points,

        setPoints

    ] =

        useState<ChartPoint[]>([]);

    const [

        connected,

        setConnected

    ] =

        useState(

            provider.connected()

        );

    useEffect(

        () => {

            if (

                !symbol

            ) {

                return;

            }

            const handleTick = (

                tick: Tick

            ) => {

                setPoints(

                    previous => [

                        ...previous.slice(

                            -300

                        ),

                        {

                            time:

                                tick.epoch,

                            value:

                                tick.quote

                        }

                    ]

                );

            };

            void provider

                .connect()

                .then(() => {

                    setConnected(

                        true

                    );

                    provider.subscribeTicks(

                        symbol,

                        handleTick

                    );

                });

            return () => {

                provider.unsubscribeTicks(

                    symbol,

                    handleTick

                );

            };

        },

        [

            provider,

            symbol

        ]

    );

    const latestPrice =

        useMemo(

            () =>

                points.length > 0

                    ? points[

                          points.length - 1

                      ].value

                    : null,

            [

                points

            ]

        );

    return {

        connected,

        latestPrice,

        points

    };

}