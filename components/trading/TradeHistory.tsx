import { Trade } from "../../types";

interface Props {

    history: Trade[];

}

export default function TradeHistory({

    history

}: Props) {

    return (

        <section className="trade-history">

            <h2>

                Trade History

            </h2>

            {

                history.length === 0 ? (

                    <p>

                        No completed trades.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Contract</th>

                                <th>Stake</th>

                                <th>Payout</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                history.map(

                                    trade => (

                                        <tr key={trade.id}>

                                            <td>{trade.contract}</td>

                                            <td>{trade.stake}</td>

                                            <td>{trade.payout}</td>

                                            <td>{trade.status}</td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                )

            }

        </section>

    );

}