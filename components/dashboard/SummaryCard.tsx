"use client";

import {
    ReactNode
} from "react";

interface SummaryCardProps {

    title: string;

    value: string | number;

    subtitle?: string;

    icon?: ReactNode;

    color?: "blue" | "green" | "orange" | "red";

}

export default function SummaryCard({

    title,

    value,

    subtitle,

    icon,

    color = "blue"

}: SummaryCardProps) {

    return (

        <div className={`summary-card ${color}`}>

            <div className="summary-top">

                <div>

                    <span className="summary-title">
                        {title}
                    </span>

                    <h2 className="summary-value">
                        {value}
                    </h2>

                    {subtitle && (

                        <p className="summary-subtitle">
                            {subtitle}
                        </p>

                    )}

                </div>

                <div className="summary-icon">

                    {icon}

                </div>

            </div>

        </div>

    );

}