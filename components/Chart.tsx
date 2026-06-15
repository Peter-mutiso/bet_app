"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function Chart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = createChart(ref.current!, {
      layout: {
        background: { color: "#0b0f1a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: ref.current!.clientWidth,
      height: ref.current!.clientHeight,
    });

    const series = chart.addAreaSeries({
      lineColor: "#3b82f6",
      topColor: "rgba(59,130,246,0.3)",
      bottomColor: "rgba(59,130,246,0.0)",
    });

    // SIMULATED MARKET DATA (use UTCTimestamp seconds)
    let price = 702;

    const data: any[] = [];
    const start = Math.floor(Date.now() / 1000) - 80;

    for (let i = 0; i < 80; i++) {
      price += (Math.random() - 0.5) * 2;
      data.push({ time: (start + i) as any, value: price });
    }

    series.setData(data);

    // LIVE UPDATE LOOP
    let i = start + 80;
    const interval = setInterval(() => {
      price += (Math.random() - 0.5) * 1.5;

      series.update({
        time: (i++) as any,
        value: price,
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, []);

  return <div ref={ref} className="w-full h-full" />;
}