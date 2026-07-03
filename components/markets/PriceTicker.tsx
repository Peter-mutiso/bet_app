import {

    Market

} from "../../types";

interface Props {

    markets: Market[];

}

export default function PriceTicker({

    markets

}: Props) {

    return (

        <div

            className="price-ticker"

        >

            {

                markets.map(

                    market => (

                        <span

                            key={market.id}

                        >

                            {market.symbol}

                            {" "}

                            {market.price}

                        </span>

                    )

                )

            }

        </div>

    );

}