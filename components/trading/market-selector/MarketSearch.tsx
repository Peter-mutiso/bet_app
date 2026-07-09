"use client";

import { Search } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function MarketSelectorSearch({
    value,
    onChange
}: Props) {
    return (
        <div className="market-selector-search">
            <Search size={18} />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search markets..."
            />
        </div>
    );
}