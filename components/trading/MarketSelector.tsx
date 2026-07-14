import type { SelectedMarket } from "@/store/useTradeStore";

interface Props {

    markets: SelectedMarket[];

    value: string;

    onChange(value: string): void;

}

export default function MarketSelector({

    markets,

    value,

    onChange

}: Props) {

    return (

        <div className="market-selector">

            <label>

                Market

            </label>

            <select

                value={value}

                onChange={

                    event =>

                        onChange(

                            event.target.value

                        )

                }

            >

                <option value="">

                    Select Market

                </option>

                {

                    markets.map(

                        market => (

                            <option

                                key={market.id}

                                value={market.id}

                            >

                                {market.name}

                            </option>

                        )

                    )

                }

            </select>

        </div>

    );

}