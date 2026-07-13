"use client";

import { ALL_INSTRUMENTS } from "@/lib/instruments";

interface Props {
    value: string;
    onChange(value: string): void;
}

export default function InstrumentSelector({
    value,
    onChange,
}: Props) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="instrument-selector"
        >
            {ALL_INSTRUMENTS.map((instrument) => (
                <option
                    key={instrument.symbol}
                    value={instrument.name}
                >
                    {instrument.name}
                </option>
            ))}
        </select>
    );
}