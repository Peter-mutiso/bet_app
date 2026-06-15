"use client";

import { useEffect } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export default function ThemeApplier() {
  const theme = useTradeStore((s) => s.theme);

  useEffect(() => {
    try {
      const html = document.documentElement;
      if (theme === 'light') {
        html.classList.add('light');
        html.classList.remove('dark');
        html.setAttribute('data-theme', 'light');
      } else {
        html.classList.add('dark');
        html.classList.remove('light');
        html.setAttribute('data-theme', 'dark');
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [theme]);

  return null;
}
