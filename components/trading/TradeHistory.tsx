import { Trade } from "@/types/trade";

interface Props {
    history: Trade[];
}

export default function TradeHistory({
    history,
}: Props) {
    const completedTrades = history.filter(
        (trade) => trade.status === "CLOSED"
    );

    return (
        <section className="trade-history space-y-4">

            <h2 className="text-xl font-semibold">
                Trade History
            </h2>

            {completedTrades.length === 0 ? (

                <p className="text-slate-500">
                    No completed trades.
                </p>

            ) : (

                <div className="overflow-x-auto rounded-xl border border-slate-800">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-900 text-slate-300">

                            <tr>

                                <th className="p-3 text-left">
                                    Instrument
                                </th>

                                <th className="p-3 text-left">
                                    Type
                                </th>

                                <th className="p-3 text-right">
                                    Entry
                                </th>

                                <th className="p-3 text-right">
                                    Exit
                                </th>

                                <th className="p-3 text-right">
                                    Stake
                                </th>

                                <th className="p-3 text-right">
                                    P/L
                                </th>

                                <th className="p-3 text-center">
                                    Result
                                </th>

                                <th className="p-3 text-center">
                                    Time
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {completedTrades.map((trade) => {

                                const won =
                                    (trade.profit ?? 0) >= 0;

                                return (

                                    <tr
                                        key={trade.id}
                                        className="border-t border-slate-800 hover:bg-slate-900/40 transition-colors"
                                    >

                                        <td className="p-3">
                                            {"Volatility 100"}
                                        </td>

                                        <td className="p-3">
                                            {trade.tradeType}
                                        </td>

                                        <td className="p-3 text-right">
                                            {trade.entry.toFixed(2)}
                                        </td>

                                        <td className="p-3 text-right">
                                            {trade.exit?.toFixed(2) ?? "--"}
                                        </td>

                                        <td className="p-3 text-right">
                                            KES {trade.stake.toFixed(2)}
                                        </td>

                                        <td
                                            className={`p-3 text-right font-semibold ${
                                                won
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }`}
                                        >
                                            {won ? "+" : ""}
                                            KES {(trade.profit ?? 0).toFixed(2)}
                                        </td>

                                        <td className="p-3 text-center">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    won
                                                        ? "bg-green-600 text-white"
                                                        : "bg-red-600 text-white"
                                                }`}
                                            >
                                                {won ? "WIN" : "LOSS"}
                                            </span>

                                        </td>

                                        <td className="p-3 text-center">

                                            {trade.exitTime
                                                ? new Date(
                                                      trade.exitTime * 1000
                                                  ).toLocaleTimeString()
                                                : "--"}

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}