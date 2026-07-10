import {

    useState,

    useCallback

} from "react";

import {

    TradeType

} from "../types";

export function useTrading() {

    const [

        selectedMarket,

        setSelectedMarket

    ] =

        useState("");

    const [

        contract,

        setContract

    ] =

        useState<TradeType>(

            "CALL"

        );

    const [

        duration,

        setDuration

    ] =

        useState(5);

    const [

        stake,

        setStake

    ] =

        useState(1);

    const placeTrade =

    useCallback(

        async () => {

            if (

                !selectedMarket

            ) {

                throw new Error(

                    "Please select a market."

                );

            }

            const request = {

                marketId: selectedMarket,

                contract,

                duration,

                stake

            };

            console.log(

                "Submitting trade:",

                request

            );

            // Next step:
            // await tradingService.placeTrade(request);

        },

        [

            selectedMarket,

            contract,

            duration,

            stake

        ]

    );
    return {

        selectedMarket,

        setSelectedMarket,

        contract,

        setContract,

        duration,

        setDuration,

        stake,

        setStake,

        placeTrade

    };

}