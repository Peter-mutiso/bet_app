import {

    Market

} from "../../types";

interface Props {

    markets: Market[];

}

export default function Watchlist({

    markets

}: Props) {

    return (

        <section

            className="watchlist"

        >

            <h2>

                Watchlist

            </h2>

            {

                markets.length ===

                0 ? (

                    <p>

                        No favorite markets.

                    </p>

                ) : (

                    markets.map(

                        market => (

                            <div

                                key={

                                    market.id

                                }

                            >

                                <strong>

                                    {

                                        market.symbol

                                    }

                                </strong>

                                {" - "}

                                {

                                    market.price

                                }

                            </div>

                        )

                    )

                )

            }

        </section>

    );

}