"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTradeStore } from "@/store/useTradeStore";

export default function WithdrawPage() {
  const [amount, setAmount] = useState<number>(100);
  const withdraw = useTradeStore((s) => s.withdraw);
  const currency = useTradeStore((s) => s.currency);

  const handleWithdraw = () => {
    const ok = withdraw(amount);
    if (ok) toast.success(`Withdrew ${amount} ${currency}`);
    else toast.error("Withdraw failed: insufficient funds or invalid amount");
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-lg font-semibold mb-4">Withdraw</h2>

      <div className="mb-3">
        <label className="text-sm text-gray-400">Amount ({currency})</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="block w-64 p-2 mt-1 bg-[#0b1220] rounded" />
      </div>

      <button onClick={handleWithdraw} className="px-4 py-2 bg-red-500 rounded">Withdraw</button>
    </div>
  );
}
