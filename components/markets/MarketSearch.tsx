interface Props {
    value: string;
    onChange(value: string): void;
}

export default function MarketSearch({
    value,
    onChange,
}: Props) {
    return (
        <div className="market-search">
            <input
                type="search"
                placeholder="Search markets..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}