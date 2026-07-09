"use client";

import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Repeat,
    Plus
} from "lucide-react";

export default function AssetQuickActions() {

    return (

        <section className="asset-actions">

            <button className="asset-action-btn deposit">

                <ArrowDownToLine size={18} />

                <span>Deposit</span>

            </button>

            <button className="asset-action-btn withdraw">

                <ArrowUpFromLine size={18} />

                <span>Withdraw</span>

            </button>

            <button className="asset-action-btn transfer">

                <Repeat size={18} />

                <span>Transfer</span>

            </button>

            <button className="asset-action-btn add">

                <Plus size={18} />

                <span>Add Asset</span>

            </button>

        </section>

    );

}