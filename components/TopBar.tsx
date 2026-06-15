import { useTradeStore } from "@/store/useTradeStore";

export default function TopBar() {
  const balance = useTradeStore((s) => s.balance);
  const currency = useTradeStore((s) => s.currency);
  const exchangeRate = useTradeStore((s) => s.exchangeRate);

  return (
    <div className="h-12 flex items-center justify-between px-4 bg-[#111827] border-b border-gray-800">
      
      <div className="flex gap-6 text-sm">
        <span>Trader’s Hub</span>
        <span>Cashier</span>
        <span>Reports</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-red-500 px-3 py-1 rounded">
          Deposit
        </button>
        <span className="text-green-400">{currency === 'USD' ? balance.toFixed(2) : (balance * exchangeRate).toFixed(2)} {currency}</span>
      </div>

    </div>
  );
}