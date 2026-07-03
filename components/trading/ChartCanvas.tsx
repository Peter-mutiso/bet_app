"use client";

import {
    useEffect,
    useMemo,
    useRef
} from "react";

interface Props {
    points: {
        time: number;
        value: number;
    }[];

    chartType?: "candles" | "line" | "area";

    fullscreen?: boolean;
}

export default function ChartCanvas({

    points: currentPoints,

    chartType = "line",

    fullscreen = false

}: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef(currentPoints);
    const offsetRef = useRef(0);

const zoomRef = useRef(1);

const mouseRef = useRef<{
    x: number;
    y: number;
    inside: boolean;
}>({
    x: 0,
    y: 0,
    inside: false,
});

useEffect(() => {
    pointsRef.current = currentPoints;
}, [currentPoints]);

    const latest =
    pointsRef.current[
        pointsRef.current.length - 1
    ];

if (!latest) return;

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const resize = () => {

    const ratio = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;

    ctx.scale(ratio, ratio);


};

        const draw = () => {

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            ctx.save();

            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "#0f172a";

            ctx.fillRect(0, 0, width, height);

            const currentPoints = pointsRef.current;

            if (currentPoints.length < 2) return;          
            const values = currentPoints.map((p) => p.value);

            const min = Math.min(...values);

            const max = Math.max(...values);

            const range = (max - min) || 1;

            drawGrid(ctx, width, height);
            ctx.restore();

            switch (chartType) {

    case "candles":
        drawCandles(
            ctx,
            width,
            height,
            min,
            range
        );
        break;

    case "area":
        drawArea(
            ctx,
            width,
            height,
            min,
            range
        );
        break;

    default:
        drawLine(
            ctx,
            width,
            height,
            min,
            range
        );

}
            drawPriceAxis(ctx, width, height, min, max);

            drawTimeAxis(ctx, width, height);

            drawCurrentPrice(ctx, width, height, min, range);

        };

        const drawGrid = (

            ctx: CanvasRenderingContext2D,

            width: number,

            height: number

        ) => {

            ctx.strokeStyle = "#233044";

            ctx.lineWidth = 1;

            for (let x = 0; x < width; x += 80) {

                ctx.beginPath();

                ctx.moveTo(x, 0);

                ctx.lineTo(x, height);

                ctx.stroke();

            }

            for (let y = 0; y < height; y += 60) {

                ctx.beginPath();

                ctx.moveTo(0, y);

                ctx.lineTo(width, y);

                ctx.stroke();

            }

        };

        const drawLine = (

    ctx: CanvasRenderingContext2D,

    width: number,

    height: number,

    min: number,

    range: number

) => {

    ctx.beginPath();

    ctx.lineWidth = 2;

    ctx.strokeStyle = "#4ade80";

    currentPoints.forEach((point, index) => {

        const x =
            (index / (currentPoints.length - 1)) * width;

        const y =
            height -
            ((point.value - min) / range) *
                (height - 30) -
            15;

        if (index === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);

        }

    });

    ctx.stroke();

};
const drawCandles = (

    ctx: CanvasRenderingContext2D,

    width: number,

    height: number,

    min: number,

    range: number

) => {

    if (currentPoints.length < 2) return;

    const candleWidth =
        Math.max(
            3,
            width / currentPoints.length * 0.7
        );

    for (let i = 1; i < currentPoints.length; i++) {

        const previous =
            currentPoints[i - 1];

        const current =
            currentPoints[i];

        const open =
            previous.value;

        const close =
            current.value;

        const high =
            Math.max(open, close);

        const low =
            Math.min(open, close);

        const x =
    (i / (currentPoints.length - 1)) * width;

        const openY =
            height -
            ((open - min) / range) *
                (height - 30) -
            15;

        const closeY =
            height -
            ((close - min) / range) *
                (height - 30) -
            15;

        const highY =
            height -
            ((high - min) / range) *
                (height - 30) -
            15;

        const lowY =
            height -
            ((low - min) / range) *
                (height - 30) -
            15;

        const bullish =
            close >= open;

        ctx.strokeStyle =
            bullish
                ? "#22c55e"
                : "#ef4444";

        ctx.fillStyle =
            bullish
                ? "#22c55e"
                : "#ef4444";

        ctx.beginPath();

        ctx.moveTo(x, highY);

        ctx.lineTo(x, lowY);

        ctx.stroke();

        ctx.fillRect(

            x - candleWidth / 2,

            Math.min(openY, closeY),

            candleWidth,

            Math.max(
                2,
                Math.abs(closeY - openY)
            )

        );

    }

};

const drawArea = (

    ctx: CanvasRenderingContext2D,

    width: number,

    height: number,

    min: number,

    range: number

) => {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    gradient.addColorStop(
        0,
        "rgba(74,222,128,0.35)"
    );

    gradient.addColorStop(
        1,
        "rgba(74,222,128,0)"
    );

    ctx.beginPath();

    currentPoints.forEach((point, index) => {

        const x =
            (index / (currentPoints.length - 1)) * width;

        const y =
            height -
            ((point.value - min) / range) *
                (height - 30) -
            15;

        if (index === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);

        }

    });

    ctx.lineTo(width, height - 15);
    ctx.lineTo(0, height - 15);
    ctx.closePath();

    ctx.fillStyle = gradient;

    ctx.fill();

    drawLine(
        ctx,
        width,
        height,
        min,
        range
    );

};

const drawPriceAxis = (

    ctx: CanvasRenderingContext2D,

    width: number,

    height: number,

    min: number,

    max: number

) => {

    const labels = 6;

    ctx.fillStyle = "#94a3b8";

    ctx.font = "12px sans-serif";

    ctx.textAlign = "right";

    for (let i = 0; i <= labels; i++) {

        const value =
            max -
            ((max - min) / labels) * i;

        const y =
            (height / labels) * i;

        ctx.fillText(
            value.toFixed(2),
            width - 6,
            y + 4
        );

    }

};

const drawTimeAxis = (

    ctx: CanvasRenderingContext2D,

    width: number,

    height: number

) => {

    if (currentPoints.length === 0) return;

    const labels = 5;

    ctx.fillStyle = "#94a3b8";

    ctx.font = "12px sans-serif";

    ctx.textAlign = "center";

    for (let i = 0; i <= labels; i++) {

        const index = Math.floor(
            (currentPoints.length - 1) *
            (i / labels)
        );

        const point = currentPoints[index];

        if (!point) continue;

        const x =
            (width / labels) * i;

        const date = new Date(
            point.time * 1000
        );

        const label =
            date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

        ctx.fillText(
            label,
            x,
            height - 8
        );

    }

};

const drawCurrentPrice = (

    ctx: CanvasRenderingContext2D,

    width: number,

    height: number,

    min: number,

    range: number

) => {

    if (!latest) return;

    const y =
        height -
        ((latest.value - min) / range) *
            (height - 30) -
        15;

    ctx.strokeStyle = "#22c55e";

    ctx.lineWidth = 1;

    ctx.setLineDash([6, 6]);

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(width, y);

    ctx.stroke();

    ctx.setLineDash([]);

    const text =
        latest.value.toFixed(5);

    ctx.font = "bold 12px sans-serif";

    const textWidth =
        ctx.measureText(text).width;

    ctx.fillStyle = "#22c55e";
    const labelY = Math.max(12, Math.min(height - 12, y));

    ctx.fillRect(

        width - textWidth - 16,

        labelY - 10,

        textWidth + 12,

        20

    );

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
    text,
    width - textWidth - 10,
    labelY + 5
);

};
        resize();
let animationFrame = 0;

const animate = () => {
    draw();
    animationFrame = requestAnimationFrame(animate);
};

resize();

animationFrame = requestAnimationFrame(animate);

window.addEventListener("resize", resize);

return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
};

    }, [chartType, fullscreen]);

    return (
        <canvas
    ref={canvasRef}
    aria-label="Trading chart"
    className={
        fullscreen
            ? "fixed inset-0 z-50 w-screen h-screen bg-slate-950"
            : "w-full h-full rounded-lg"
    }
/>
    );

}