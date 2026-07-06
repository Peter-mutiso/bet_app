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

    const [price, setPrice] = useState(0);

    useEffect(() => {

        if (!marketId) {

            return;

        }

        let active = true;

        const onTick = (

            tick: Tick

        ) => {

            if (

                active &&
                tick.symbol === marketId

            ) {

                setPrice(

                    tick.quote

                );

            }

        };

        async function start() {

            await tradingProvider.connect();

            await tradingProvider.subscribeTicks(

                marketId,

                onTick

            );

        }

        void start();

        return () => {

            active = false;

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