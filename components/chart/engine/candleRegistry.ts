import { Candle } from "../types";

export interface CandleCoordinate {

    candle: Candle;

    x: number;

}

const registry = new Map<number, CandleCoordinate>();

export function registerCandle(

    candle: Candle,

    x: number

) {

    registry.set(Number(candle.time), {

        candle,

        x,

    });

}

export function getCoordinate(

    time: number

) {

    return registry.get(time);

}

export function clearRegistry() {

    registry.clear();

}