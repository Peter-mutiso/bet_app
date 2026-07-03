interface Props {

    category: string;

    onCategoryChange(value: string): void;

    favoritesOnly: boolean;

    onFavoritesChange(value: boolean): void;

}

export default function MarketFilters({

    category,

    onCategoryChange,

    favoritesOnly,

    onFavoritesChange

}: Props) {

    return (

        <section className="market-filters">

            <select

                value={category}

                onChange={

                    event =>

                        onCategoryChange(

                            event.target.value

                        )

                }

            >

                <option value="ALL">

                    All Markets

                </option>

                <option value="FOREX">

                    Forex

                </option>

                <option value="CRYPTO">

                    Crypto

                </option>

                <option value="INDICES">

                    Indices

                </option>

                <option value="COMMODITIES">

                    Commodities

                </option>

            </select>

            <label>

                <input

                    type="checkbox"

                    checked={favoritesOnly}

                    onChange={

                        event =>

                            onFavoritesChange(

                                event.target.checked

                            )

                    }

                />

                Favorites only

            </label>

        </section>

    );

}