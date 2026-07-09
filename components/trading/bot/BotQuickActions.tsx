"use client";

import {

    Plus,
    Upload,
    Store,
    Play

} from "lucide-react";

export default function BotQuickActions(){

    return(

        <section className="bot-actions">

            <button>

                <Plus size={18}/>

                Create Bot

            </button>

            <button>

                <Upload size={18}/>

                Import Strategy

            </button>

            <button>

                <Store size={18}/>

                Marketplace

            </button>

            <button>

                <Play size={18}/>

                Run All

            </button>

        </section>

    );

}