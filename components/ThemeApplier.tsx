"use client";

import { useEffect } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export default function ThemeApplier() {
    const theme = useTradeStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    return null;
}