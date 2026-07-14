"use client";

import { useState } from "react";
import {
    Bot,
    Play,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";

import { scanBestMarket } from "@/components/chart/engine/marketScanner";
type BotStatus =
    | "READY"
    | "SCANNING"
    | "TRADING";

export default function BotQuickActions() {

    const [status, setStatus] =
        useState<BotStatus>("READY");

    const [confidence, setConfidence] =
        useState<number | null>(null);

    const [market, setMarket] =
        useState("--");

    const [direction, setDirection] =
        useState<"BUY" | "SELL" | "--">("--");
    const [progress, setProgress] = useState(0);
    const runSmartBot = () => {

        if (status !== "READY") return;

        setStatus("SCANNING");

        setConfidence(null);

        setMarket("--");

        setDirection("--");
        setProgress(0);

const interval = setInterval(() => {

    setProgress(prev => {

        if (prev >= 100) {

            clearInterval(interval);

            return 100;

        }

        return prev + 4;

    });

}, 100);

        setTimeout(() => {

    const store = useTradeStore.getState();

    const result = scanBestMarket();

    setMarket(result.symbol);

    setDirection(result.direction);

    setConfidence(result.confidence);

    setStatus("TRADING");

    //--------------------------------------------------
    // Switch chart to selected market
    //--------------------------------------------------

    const current =
        store.selectedMarket;

    store.setSelectedMarket({
    symbol: result.symbol,
    name: result.symbol,
    category: current?.category ?? "Synthetic",
    price: store.marketPrices[result.symbol],
    change: 0,
});

    //--------------------------------------------------
    // BUY or SELL
    //--------------------------------------------------

    store.setCurrentTradeType(

        result.direction === "BUY"

            ? "CALL"

            : "PUT"

    );

    //--------------------------------------------------
    // Execute ONE trade
    //--------------------------------------------------

    store.buy();

}, 2500);

    };

    return (

        <section className="smart-bot-card">

            <div className="smart-bot-header">

                <Bot size={28} />

                <div>

                    <h2>
                        Smart Trading Bot
                    </h2>

                    <p>
                        Scans every market, chooses the strongest setup and
                        executes one trade.
                    </p>

                </div>

            </div>

            <div className="smart-bot-info">

                <div>

                    <span>Status</span>

                    <strong>{status}</strong>

                </div>

                <div>

                    <span>Market</span>

                    <strong>{market}</strong>

                </div>

                <div>

                    <span>Direction</span>

                    <strong>{direction}</strong>

                </div>

                <div>

                    <span>Confidence</span>

                    <strong>

                        {confidence !== null
                            ? `${confidence}%`
                            : "--"}

                    </strong>

                </div>

            </div>
            <div className="scan-progress">

    <div
        className="scan-progress-fill"
        style={{
            width: `${progress}%`,
        }}
    />

</div>

<p className="scan-text">

    {status === "READY" &&
        "Ready to scan markets"}

    {status === "SCANNING" &&
        `Scanning markets... ${progress}%`}

    {status === "TRADING" &&
        "Best opportunity found"}

</p>
<div className="smart-bot-analysis">

    <div className="analysis-row">
        <span>Expected Profit</span>
        <strong className="profit">
            ${(useTradeStore.getState().stake * 0.86).toFixed(2)}
        </strong>
    </div>

    <div className="analysis-row">
        <span>Risk Level</span>
        <strong>
            {confidence === null
                ? "--"
                : confidence >= 90
                ? "Low"
                : confidence >= 80
                ? "Medium"
                : "High"}
        </strong>
    </div>

    <div className="analysis-row">

    <span>Reason</span>

    <strong className="reason">

        {confidence === null
            ? "--"
            : confidence >= 95
            ? `Exceptional setup detected. Strong trend confirmation on ${market}.`
            : confidence >= 90
            ? `High probability opportunity identified on ${market}.`
            : confidence >= 85
            ? `Strong momentum with favorable volatility conditions.`
            : `Trade selected based on current market momentum.`}

    </strong>

</div>
</div>
            <button

                className="smart-bot-button"

                disabled={status !== "READY"}

                onClick={runSmartBot}

            >

                {status === "READY" && (
                    <>
                        <Play size={18} />
                        Run Smart Bot
                    </>
                )}

                {status === "SCANNING" && (
                    <>
                        <Loader2
                            size={18}
                            className="spin"
                        />
                        Scanning Markets...
                    </>
                )}

                {status === "TRADING" && (
                    <>
                        <CheckCircle2 size={18} />
                        Trade Executed
                    </>
                )}

            </button>

        </section>

    );

}