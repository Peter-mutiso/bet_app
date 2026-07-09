"use client";

import {

    Bot,
    Clock3,
    TrendingUp,
    Activity

} from "lucide-react";

const stats = [

    {
        title: "Running Bots",
        value: "4",
        icon: Bot
    },

    {
        title: "Today's Profit",
        value: "+$124.82",
        icon: TrendingUp
    },

    {
        title: "Running Time",
        value: "18h 24m",
        icon: Clock3
    },

    {
        title: "Trades Today",
        value: "92",
        icon: Activity
    }

];

export default function BotSummary() {

    return (

        <section className="bot-summary-grid">

            {

                stats.map(card=>{

                    const Icon = card.icon;

                    return(

                        <div
                            key={card.title}
                            className="bot-summary-card"
                        >

                            <div className="bot-card-top">

                                <div>

                                    <h4>{card.title}</h4>

                                    <h2>{card.value}</h2>

                                </div>

                                <Icon size={28}/>

                            </div>

                        </div>

                    );

                })

            }

        </section>

    );

}