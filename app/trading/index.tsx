/**
 * ============================================================================
 * TRADING PAGE
 * ============================================================================
 */

import {

    useMemo,

    useState

} from "react";

import {

    useMarkets

} from "../../hooks/useMarkets";
import {

    tradingProvider

} from "../../services/trading";
import {

    useTrading

} from "../../hooks/useTrading";

import {

    MarketSelector,

    ContractSelector,

    DurationSelector,

    StakeInput,

    BuySellPanel,

    PriceDisplay,

    TradingChart,

    OpenPositions,

    TradeHistory

} from "../../components/trading";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function TradingPage() {

    const {

        markets,

        loading

    } =

        useMarkets();

    const {

        selectedMarket,

        setSelectedMarket,

        contract,

        setContract,

        duration,

        setDuration,

        stake,

        setStake,

        placeTrade

    } =

        useTrading();

    const [

        submitting,

        setSubmitting

    ] =

        useState(false);

    const selected =

        useMemo(

            () =>

                markets.find(

                    market =>

                        market.id === selectedMarket

                ),

            [

                markets,

                selectedMarket

            ]

        );

    const estimatedPayout =

        useMemo(

            () =>

                Number(

                    (stake * 1.95).toFixed(2)

                ),

            [

                stake

            ]

        );

    async function handleTrade() {

        try {

            setSubmitting(

                true

            );

            await placeTrade();

        }

        finally {

            setSubmitting(

                false

            );

        }

    }

    return (

        <div

            className="trading-page"

        >

            <section

                className="trading-left"

            >

                <TradingChart

                    provider={tradingProvider}

                    marketId={selectedMarket}

                />

            </section>

            <section

                className="trading-right"

            >

                <MarketSelector

                    markets={markets}

                    value={selectedMarket}

                    onChange={setSelectedMarket}

                />

                <ContractSelector

                    value={contract}

                    onChange={setContract}

                />

                <DurationSelector

                    value={duration}

                    onChange={setDuration}

                />

                <StakeInput

                    value={stake}

                    onChange={setStake}

                />

                <PriceDisplay

                    bid={selected?.price ?? 0}

                    ask={

                        selected

                            ? selected.price + 0.01

                            : 0

                    }

                />

                <BuySellPanel

                    disabled={

                        !selectedMarket ||

                        loading

                    }

                    loading={submitting}

                    payout={estimatedPayout}

                    onBuy={handleTrade}

                />

            </section>

            <section

                className="trading-bottom"

            >

                <OpenPositions

                    positions={[]}

                />

                <TradeHistory

                    history={[]}

                />

            </section>

        </div>

    );

}