import {
    useEffect,
    useState
} from "react";

import {
    Tick,
    tradingProvider
} from "../services/trading/provider";

export function useLivePrice(
    marketId: string
) {
    const [
        price,
        setPrice
    ] = useState(0);

    useEffect(() => {

        void tradingProvider.connect();

        const onTick = (
            tick: Tick
        ) => {

            if (
                tick.symbol === marketId
            ) {
                setPrice(
                    tick.quote
                );
            }
        };

        tradingProvider.subscribeTicks(
            marketId,
            onTick
        );

        return () => {

            tradingProvider.unsubscribeTicks(
                marketId,
                onTick
            );

        };

    }, [
        marketId
    ]);

    return price;
}