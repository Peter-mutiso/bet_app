import { Trade } from "../../types";

interface Props {

    positions: Trade[];

}

export default function OpenPositions({

    positions

}: Props) {

    return (

        <section className="open-positions">

            <h2>

                Open Positions

            </h2>

            {

                positions.length === 0 ? (

                    <p>

                        No open positions.

                    </p>

                ) : (

                    positions.map(

                        trade => (

                            <div

                                key={trade.id}

                                className="position-card"

                            >

                                <strong>

                                    {trade.contract}

                                </strong>

                                <p>

                                    Stake: {trade.stake}

                                </p>

                                <p>

                                    Current: {trade.currentPrice}

                                </p>

                                <p>

                                    Status: {trade.status}

                                </p>

                            </div>

                        )

                    )

                )

            }

        </section>

    );

}