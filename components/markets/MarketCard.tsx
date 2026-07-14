import type { SelectedMarket } from "@/store/useTradeStore";

interface Props {

    market: SelectedMarket;

    favorite: boolean;

    onToggleFavorite(
        id: string
    ): void;

}

export default function MarketCard({

    market,

    favorite,

    onToggleFavorite

}: Props) {

    return (

        <div

            className="market-card"

        >

            <div

                className="market-card-header"

            >

                <h3>

                    {market.name}

                </h3>

                <button

                    type="button"

                    onClick={

                        () =>

                            onToggleFavorite(

                                market.symbol

                            )

                    }

                >

                    {

                        favorite

                            ? "★"

                            : "☆"

                    }

                </button>

            </div>

            <p>

                {market.symbol}

            </p>

            <h2>

                {market.price}

            </h2>

            <span

                className={

                    market.change >= 0

                        ? "positive"

                        : "negative"

                }

            >

                {market.change}%

            </span>

        </div>

    );

}