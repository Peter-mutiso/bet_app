import { Market } from "../../types";
import MarketCard from "./MarketCard";

interface Props {
    markets: Market[];
    loading: boolean;
    favoriteIds: string[];
    onToggleFavorite: (id: string) => void;
}

export default function MarketTable({
    markets,
    loading,
    favoriteIds,
    onToggleFavorite
}: Props) {

    if (loading) {
        return <p>Loading markets...</p>;
    }

    if (markets.length === 0) {
        return <p>No markets available.</p>;
    }

    return (
        <section className="market-table">
            {markets.map(market => (
                <MarketCard
                    key={market.id}
                    market={market}
                    favorite={favoriteIds.includes(market.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </section>
    );
}