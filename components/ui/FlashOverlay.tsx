"use client";

import { useEffect, useState } from "react";

import { useUIStore } from "@/store/useUIStore";

const COLORS = {
    green: "rgba(34,197,94,.18)",
    red: "rgba(239,68,68,.18)",
    blue: "rgba(59,130,246,.18)",
    gold: "rgba(245,158,11,.18)",
};

export default function FlashOverlay() {

    const flash = useUIStore(

        (state) => state.flash

    );

    const clearFlash = useUIStore(

        (state) => state.clearFlash

    );

    const [visible, setVisible] = useState(false);

    useEffect(() => {

        if (!flash.active) return;

        setVisible(true);

        const timer = window.setTimeout(() => {

            setVisible(false);

        }, 220);

        return () => clearTimeout(timer);

    }, [flash]);

    useEffect(() => {

        if (visible) return;

        if (!flash.active) return;

        const timer = window.setTimeout(() => {

            clearFlash();

        }, 180);

        return () => clearTimeout(timer);

    }, [

        visible,

        flash.active,

        clearFlash,

    ]);

    if (!flash.active) {

        return null;

    }

    return (

        <div

            className={`

                flash-overlay

                ${visible ? "flash-enter" : "flash-exit"}

            `}

            style={{

                background:

                    COLORS[flash.color],

                opacity:

                    flash.opacity,

            }}

        />

    );

}