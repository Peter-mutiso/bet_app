interface Props {

    bid: number;

    ask: number;

}

export default function PriceDisplay({

    bid,

    ask

}: Props) {

    return (

        <div

            className="price-display"

        >

            <div>

                <small>

                    Bid

                </small>

                <h2>

                    {bid}

                </h2>

            </div>

            <div>

                <small>

                    Ask

                </small>

                <h2>

                    {ask}

                </h2>

            </div>

        </div>

    );

}