import { useTradeStore } from "@/store/useTradeStore";

export default function LeftToolbar() {
  const trades = useTradeStore((s) => s.trades);

  const closed = trades.filter((t) => t.status === 'CLOSED');
  const recent = closed.slice(-6).reverse();
  const wins = closed.filter((c) => (c.profit ?? 0) > 0).length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;

  return (
    <div className="w-14 bg-[#0f172a] border-r border-gray-800 flex flex-col items-center py-4 gap-4">
      <div className="text-xs text-gray-300">Exec</div>
      <div className="flex flex-col gap-1">
        {recent.map((t) => (
          <div key={t.id} className={`w-8 h-6 rounded flex items-center justify-center ${t.profit && t.profit > 0 ? 'bg-green-600' : 'bg-red-600'}`} title={`${t.direction} ${t.tradeType} ${t.profit?.toFixed(2)}`}>
            <span className="text-xs text-white">{t.profit && t.profit > 0 ? 'W' : 'L'}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-300">{winRate}%</div>

      <button className="hover:bg-gray-700 p-2 rounded">📊</button>
      <button className="hover:bg-gray-700 p-2 rounded">✏️</button>
      <button className="hover:bg-gray-700 p-2 rounded">📈</button>
      <button className="hover:bg-gray-700 p-2 rounded">⚙️</button>
    </div>
  );
}