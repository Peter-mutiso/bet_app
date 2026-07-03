/**
 * ============================================================================
 * MARKET CATEGORIES
 * ============================================================================
 */

interface Props {

    categories: string[];

    value: string;

    onChange(category: string): void;

}

export default function MarketCategories({

    categories,

    value,

    onChange

}: Props) {

    return (

        <div className="market-categories">

            {

                categories.map(category => (

                    <button

                        key={category}

                        className={

                            category === value

                                ? "active"

                                : ""

                        }

                        onClick={() => onChange(category)}

                    >

                        {category}

                    </button>

                ))

            }

        </div>

    );

}