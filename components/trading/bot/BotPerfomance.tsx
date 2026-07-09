"use client";

import {
    TrendingUp,
    Target,
    BarChart3,
    ShieldCheck
} from "lucide-react";

const metrics = [

    {
        title: "Win Rate",
        value: "78%",
        icon: Target
    },

    {
        title: "Net Profit",
        value: "+$12,482",
        icon: TrendingUp
    },

    {
        title: "Trades Executed",
        value: "4,268",
        icon: BarChart3
    },

    {
        title: "Risk Score",
        value: "Low",
        icon: ShieldCheck
    }

];

export default function BotPerformance() {

    return (

        <section className="bot-performance">

            <div className="section-title">

                <h2>

                    Bot Performance

                </h2>

                <span>

                    Overall strategy performance

                </span>

            </div>

            <div className="performance-grid">

                {

                    metrics.map(metric=>{

                        const Icon=metric.icon;

                        return(

                            <div
                                key={metric.title}
                                className="performance-card"
                            >

                                <Icon size={28}/>

                                <h3>

                                    {metric.value}

                                </h3>

                                <p>

                                    {metric.title}

                                </p>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}