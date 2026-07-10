"use client";

import {

    useEffect,
    useRef,
    useState,

} from "react";

interface AnimatedCounterProps {

    value: number;

    duration?: number;

    decimals?: number;

    prefix?: string;

    suffix?: string;

    className?: string;

    locale?: string;

    useGrouping?: boolean;

}

export default function AnimatedCounter({

    value,

    duration = 700,

    decimals = 2,

    prefix = "",

    suffix = "",

    className = "",

    locale = "en-KE",

    useGrouping = true,

}: AnimatedCounterProps) {

    const [displayValue, setDisplayValue] =

        useState(value);

    const frameRef = useRef<number | null>(null);

    const previousValue = useRef(value);

    useEffect(() => {

        if (frameRef.current !== null) {

            cancelAnimationFrame(

                frameRef.current

            );

        }

        const startValue =

            previousValue.current;

        const endValue = value;

        const difference =

            endValue - startValue;

        if (difference === 0) {

            setDisplayValue(endValue);

            return;

        }

        let startTime: number | null = null;

        const easeOutCubic = (

            t: number

        ) => {

            return 1 - Math.pow(

                1 - t,

                3

            );

        };

        const animate = (

            timestamp: number

        ) => {

            if (!startTime) {

                startTime = timestamp;

            }

            const elapsed =

                timestamp - startTime;

            const progress =

                Math.min(

                    elapsed / duration,

                    1

                );

            const eased =

                easeOutCubic(progress);

            const current =

                startValue +

                difference * eased;

            setDisplayValue(current);

            if (progress < 1) {

                frameRef.current =

                    requestAnimationFrame(

                        animate

                    );

            } else {

                previousValue.current =

                    endValue;

                setDisplayValue(endValue);

            }

        };

        frameRef.current =

            requestAnimationFrame(

                animate

            );

        return () => {

            if (frameRef.current) {

                cancelAnimationFrame(

                    frameRef.current

                );

            }

        };

    }, [

        value,

        duration,

    ]);

    const formatted =

        displayValue.toLocaleString(

            locale,

            {

                minimumFractionDigits:

                    decimals,

                maximumFractionDigits:

                    decimals,

                useGrouping,

            }

        );

    return (

        <span

            className={className}

        >

            {prefix}

            {formatted}

            {suffix}

        </span>

    );

}