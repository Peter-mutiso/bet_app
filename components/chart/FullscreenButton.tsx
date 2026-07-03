"use client";

import { useEffect, useState } from "react";
import {
    Maximize2,
    Minimize2
} from "lucide-react";

export default function FullscreenButton() {

    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {

        const changeHandler = () => {

            setFullscreen(
                !!document.fullscreenElement
            );

        };

        document.addEventListener(
            "fullscreenchange",
            changeHandler
        );

        return () =>

            document.removeEventListener(
                "fullscreenchange",
                changeHandler
            );

    }, []);

    const toggleFullscreen = async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.error(
                "Fullscreen failed",
                error
            );

        }

    };

    return (

        <button

            className="toolbar-btn"

            onClick={toggleFullscreen}

        >

            {

                fullscreen

                    ? <Minimize2 size={16} />

                    : <Maximize2 size={16} />

            }

            {

                fullscreen

                    ? "Exit"

                    : "Fullscreen"

            }

        </button>

    );

}