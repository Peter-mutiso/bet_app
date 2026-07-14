/*
===============================================================================
REALISTIC SYNTHETIC MARKET ENGINE
===============================================================================
*/

import { useTradeStore } from "@/store/useTradeStore";

import {

    EngineState,
    TickResult,
    MarketRegime,

} from "../types";
const REGIME_DURATION = {

    RANGE: [300, 800] as [number, number],

    BULL: [500, 1200] as [number, number],

    BEAR: [500, 1200] as [number, number],

    BREAKOUT: [80, 180] as [number, number],

    REVERSAL: [100, 220] as [number, number],

    PANIC: [60, 140] as [number, number],

    RECOVERY: [120, 260] as [number, number],

    CONSOLIDATION: [150, 350] as [number, number],

};
/*
===============================================================================
ENGINE CONSTANTS
===============================================================================
*/


const VOLATILITY_PROFILE = {

    0: 0.18,

    1: 0.45,

    2: 1.00,

    3: 2.00,

    4: 3.50,

};

const NEWS_PROBABILITY = 0.0015;

const IMPULSE_PROBABILITY = 0.006;

/*
===============================================================================
HELPERS
===============================================================================
*/

function random(

    min: number,

    max: number

) {

    return min +

        Math.random() *

        (max - min);

}

function randomInt(

    min: number,

    max: number

) {

    return Math.floor(

        random(

            min,

            max + 1

        )

    );

}

function clamp(

    value: number,

    min: number,

    max: number

) {

    return Math.max(

        min,

        Math.min(

            max,

            value

        )

    );

}

function gaussian() {

    let u = 0;

    let v = 0;

    while (u === 0)

        u = Math.random();

    while (v === 0)

        v = Math.random();

    return Math.sqrt(

        -2 *

        Math.log(u)

    ) *

    Math.cos(

        2 *

        Math.PI *

        v

    );

}

/*
===============================================================================
CREATE ENGINE
===============================================================================
*/

export function createEngine(

    initialPrice: number

): EngineState {

    return {

        /*
        PRICE
        */

        price: initialPrice,

        lastPrice: initialPrice,

        meanPrice: initialPrice,

        /*
        TREND
        */

        trend: 0,

        trendStrength: 0,

        momentum: 0,

        acceleration: 0,

        /*
        VOLATILITY
        */

        volatility: 1,

        volatilityTarget: 1,

        volatilityNoise: 1,

        /*
        REGIME
        */

        regime: MarketRegime.RANGE,

        regimeTicks: 0,

        regimeDuration: randomInt(

            300,

            700

        ),

        /*
        IMPULSE
        */

        impulse: 0,

        impulseDecay: 0.97,

        drift: 0,

        /*
        STATS
        */

        highest: initialPrice,

        lowest: initialPrice,

        sessionHigh: initialPrice,

        sessionLow: initialPrice,

        tickCounter: 0,

candleCounter: 0,

microTrend: 0,

microMomentum: 0,

microNoise: 0,

buyPressure: 0,

sellPressure: 0,

lastMove: 0,

tickInCandle: 0,

    };

}

/*
===============================================================================
VOLATILITY
===============================================================================
*/

export function applyVolatility(

    engine: EngineState,

    state: number

) {

    engine.volatilityTarget =

        VOLATILITY_PROFILE[

            state as keyof typeof VOLATILITY_PROFILE

        ] ?? 1;

    engine.volatility +=

        (

            engine.volatilityTarget -

            engine.volatility

        )

        * 0.03;

}
/*
===============================================================================
CHOOSE NEXT MARKET REGIME
===============================================================================
*/

function chooseNextRegime(

    current: MarketRegime

): MarketRegime {

    const r = Math.random();

    switch (current) {

        /*
        ------------------------------------------------------------------------
        RANGE
        ------------------------------------------------------------------------
        */

        case MarketRegime.RANGE:

            if (r < 0.22) return MarketRegime.BULL;

            if (r < 0.44) return MarketRegime.BEAR;

            if (r < 0.58) return MarketRegime.CONSOLIDATION;

            if (r < 0.70) return MarketRegime.BREAKOUT;

            if (r < 0.78) return MarketRegime.REVERSAL;

            if (r < 0.83) return MarketRegime.PANIC;

            if (r < 0.88) return MarketRegime.RECOVERY;

            return MarketRegime.RANGE;

        /*
        ------------------------------------------------------------------------
        BULL
        ------------------------------------------------------------------------
        */

        case MarketRegime.BULL:

            if (r < 0.55) return MarketRegime.BULL;

            if (r < 0.70) return MarketRegime.CONSOLIDATION;

            if (r < 0.82) return MarketRegime.REVERSAL;

            if (r < 0.92) return MarketRegime.RANGE;

            return MarketRegime.BREAKOUT;

        /*
        ------------------------------------------------------------------------
        BEAR
        ------------------------------------------------------------------------
        */

        case MarketRegime.BEAR:

            if (r < 0.55) return MarketRegime.BEAR;

            if (r < 0.70) return MarketRegime.CONSOLIDATION;

            if (r < 0.82) return MarketRegime.REVERSAL;

            if (r < 0.90) return MarketRegime.RANGE;

            return MarketRegime.PANIC;

        /*
        ------------------------------------------------------------------------
        CONSOLIDATION
        ------------------------------------------------------------------------
        */

        case MarketRegime.CONSOLIDATION:

            if (r < 0.45) return MarketRegime.CONSOLIDATION;

            if (r < 0.72) return MarketRegime.BREAKOUT;

            if (r < 0.85) return MarketRegime.BULL;

            return MarketRegime.BEAR;

        /*
        ------------------------------------------------------------------------
        BREAKOUT
        ------------------------------------------------------------------------
        */

        case MarketRegime.BREAKOUT:

            if (r < 0.40) return MarketRegime.BULL;

            if (r < 0.75) return MarketRegime.BEAR;

            return MarketRegime.RANGE;

        /*
        ------------------------------------------------------------------------
        REVERSAL
        ------------------------------------------------------------------------
        */

        case MarketRegime.REVERSAL:

            if (r < 0.50) return MarketRegime.BULL;

            return MarketRegime.BEAR;

        /*
        ------------------------------------------------------------------------
        PANIC
        ------------------------------------------------------------------------
        */

        case MarketRegime.PANIC:

            if (r < 0.70) return MarketRegime.RECOVERY;

            return MarketRegime.RANGE;

        /*
        ------------------------------------------------------------------------
        RECOVERY
        ------------------------------------------------------------------------
        */

        case MarketRegime.RECOVERY:

            if (r < 0.60) return MarketRegime.BULL;

            return MarketRegime.RANGE;

        default:

            return MarketRegime.RANGE;

    }

}

/*
===============================================================================
UPDATE REGIME
===============================================================================
*/

function updateRegime(

    engine: EngineState

) {

    engine.regimeTicks++;

    if (

        engine.regimeTicks <

        engine.regimeDuration

    ) {

        return;

    }

    engine.regime =

        chooseNextRegime(

            engine.regime

        );

    engine.regimeTicks = 0;

    switch (

        engine.regime

    ) {

        case MarketRegime.RANGE:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.RANGE

                );

            break;

        case MarketRegime.BULL:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.BULL

                );

            engine.trendStrength =

                random(

                    0.05,

                    0.18

                );

            break;

        case MarketRegime.BEAR:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.BEAR

                );

            engine.trendStrength =

                -random(

                    0.05,

                    0.18

                );

            break;

        case MarketRegime.BREAKOUT:

    engine.regimeDuration =
        randomInt(
            ...REGIME_DURATION.BREAKOUT
        );

    engine.trendStrength =
        Math.random() > 0.5
            ? random(0.18, 0.35)
            : -random(0.18, 0.35);

    break;

        case MarketRegime.REVERSAL:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.REVERSAL

                );

            engine.trendStrength *= -1;

            break;

        case MarketRegime.PANIC:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.PANIC

                );

            break;

        case MarketRegime.RECOVERY:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.RECOVERY

                );

            break;

        case MarketRegime.CONSOLIDATION:

            engine.regimeDuration =

                randomInt(

                    ...REGIME_DURATION.CONSOLIDATION

                );

            break;

    }

}
/*
===============================================================================
UPDATE TREND
===============================================================================
*/

function updateTrend(

    engine: EngineState

) {

    switch (engine.regime) {

        /*
        ------------------------------------------------------------------------
        RANGE
        ------------------------------------------------------------------------
        */

        case MarketRegime.RANGE:

            engine.trend *= 0.985;

            break;

        /*
        ------------------------------------------------------------------------
        BULL
        ------------------------------------------------------------------------
        */

        case MarketRegime.BULL:

            engine.trend +=

                engine.trendStrength * 0.004;

            break;

        /*
        ------------------------------------------------------------------------
        BEAR
        ------------------------------------------------------------------------
        */

        case MarketRegime.BEAR:

            engine.trend +=

                engine.trendStrength * 0.004;

            break;

        /*
        ------------------------------------------------------------------------
        BREAKOUT
        ------------------------------------------------------------------------
        */

        case MarketRegime.BREAKOUT:

            engine.trend +=

                engine.trendStrength * 0.012;

            break;

        /*
        ------------------------------------------------------------------------
        REVERSAL
        ------------------------------------------------------------------------
        */

        case MarketRegime.REVERSAL:

            engine.trend *= 0.96;

            break;

        /*
        ------------------------------------------------------------------------
        PANIC
        ------------------------------------------------------------------------
        */

        case MarketRegime.PANIC:

            engine.trend -= 0.08;

            break;

        /*
        ------------------------------------------------------------------------
        RECOVERY
        ------------------------------------------------------------------------
        */

        case MarketRegime.RECOVERY:

            engine.trend += 0.06;

            break;

        /*
        ------------------------------------------------------------------------
        CONSOLIDATION
        ------------------------------------------------------------------------
        */

        case MarketRegime.CONSOLIDATION:

            engine.trend *= 0.97;

            break;

    }

}

/*
===============================================================================
UPDATE MOMENTUM
===============================================================================
*/

function updateMomentum(

    engine: EngineState

) {

    engine.momentum *= 0.985;

    let impulse = gaussian();

    switch (engine.regime) {

        case MarketRegime.RANGE:

            impulse *= 0.02;

            break;

        case MarketRegime.BULL:

            impulse *= 0.05;

            break;

        case MarketRegime.BEAR:

            impulse *= 0.05;

            break;

        case MarketRegime.BREAKOUT:

            impulse *= 0.12;

            break;

        case MarketRegime.PANIC:

            impulse *= 0.18;

            break;

        case MarketRegime.RECOVERY:

            impulse *= 0.10;

            break;

        case MarketRegime.CONSOLIDATION:

            impulse *= 0.015;

            break;

        default:

            impulse *= 0.04;

    }

    engine.momentum += impulse;

}

/*
===============================================================================
UPDATE VOLATILITY
===============================================================================
*/
function updateVolatility(
    engine: EngineState
) {

    let regimeMultiplier = 1;

    switch (engine.regime) {

        case MarketRegime.RANGE:
            regimeMultiplier = 0.50;
            break;

        case MarketRegime.CONSOLIDATION:
            regimeMultiplier = 0.35;
            break;

        case MarketRegime.BULL:
            regimeMultiplier = 0.90;
            break;

        case MarketRegime.BEAR:
            regimeMultiplier = 1.00;
            break;

        case MarketRegime.REVERSAL:
            regimeMultiplier = 1.30;
            break;

        case MarketRegime.BREAKOUT:
            regimeMultiplier = 2.20;
            break;

        case MarketRegime.RECOVERY:
            regimeMultiplier = 1.60;
            break;

        case MarketRegime.PANIC:
            regimeMultiplier = 3.00;
            break;

    }

    const target =
        engine.volatilityTarget *
        regimeMultiplier;

    engine.volatility +=
        (target - engine.volatility)
        * 0.04;

}

/*
===============================================================================
UPDATE IMPULSE
===============================================================================
*/

function updateImpulse(

    engine: EngineState

) {

    if (

        Math.random() < IMPULSE_PROBABILITY

    ) {

        engine.impulse +=

            gaussian()

            *

            engine.volatility

            *

            random(

                2,

                6

            );

    }

    engine.impulse *=

        engine.impulseDecay;

}

/*
===============================================================================
UPDATE DRIFT
===============================================================================
*/

function updateDrift(

    engine: EngineState

) {

    engine.drift *= 0.995;

    engine.drift +=

        gaussian()

        *

        0.002;

}

/*
===============================================================================
UPDATE ACCELERATION
===============================================================================
*/

function updateAcceleration(

    engine: EngineState

) {

    engine.acceleration *= 0.90;

    engine.acceleration +=

        (

            engine.momentum -

            engine.acceleration

        )

        *

        0.08;

}
/*
===============================================================================
MEAN REVERSION
===============================================================================
*/

function meanReversion(

    engine: EngineState

) {

    engine.meanPrice +=

        (

            engine.price -

            engine.meanPrice

        )

        * 0.002;

    return (

        engine.meanPrice -

        engine.price

    ) * 0.018;

}

/*
===============================================================================
RANDOM NEWS EVENT
===============================================================================
*/

function newsShock(

    engine: EngineState

) {

    if (

        Math.random() >

        NEWS_PROBABILITY

    ) {

        return 0;

    }

    return gaussian()

        *

        engine.volatility

        *

        random(

            5,

            10

        );

}

/*
===============================================================================
PANIC EVENT
===============================================================================
*/

function panicShock(

    engine: EngineState

) {

    if (

        engine.regime !==

        MarketRegime.PANIC

    ) {

        return 0;

    }

    return -

        Math.abs(

            gaussian()

        )

        *

        engine.volatility

        *

        random(

            1.5,

            4

        );

}

/*
===============================================================================
BREAKOUT EXPANSION
===============================================================================
*/

function breakoutExpansion(

    engine: EngineState

) {

    if (

        engine.regime !==

        MarketRegime.BREAKOUT

    ) {

        return 0;

    }

    return (

        engine.trendStrength >= 0

            ? 1

            : -1

    )

    *

    engine.volatility

    *

    random(

        0.8,

        2.2

    );

}

/*
===============================================================================
MARKET NOISE
===============================================================================
*/

function marketNoise(

    engine: EngineState

) {

    return gaussian()

        *

        engine.volatility

        *

        0.55;

}

/*
===============================================================================
LIMIT EXTREME MOVES
===============================================================================
*/

function clampMove(

    engine: EngineState,

    move: number

) {

    const maxMove =

        engine.volatility

        * 15;

    return clamp(

        move,

        -maxMove,

        maxMove

    );

}
/*
===============================================================================
LIQUIDITY SWEEP
===============================================================================
*/

function liquiditySweep(

    engine: EngineState

) {

    if (Math.random() > 0.0025) {

        return 0;

    }

    return (

        Math.random() > 0.5 ? 1 : -1

    )

    *

    engine.volatility

    *

    random(

        3,

        8

    );

}

/*
===============================================================================
STOP HUNT
===============================================================================
*/

function stopHunt(

    engine: EngineState

) {

    if (

        Math.random() >

        0.0015

    ) {

        return 0;

    }

    const direction =

        Math.random() > 0.5

            ? 1

            : -1;

    return direction *

        engine.volatility *

        random(

            5,

            12

        );

}

/*
===============================================================================
TREND EXHAUSTION
===============================================================================
*/

function trendExhaustion(

    engine: EngineState

) {

    if (

        Math.abs(

            engine.trend

        ) < 2

    ) {

        return 0;

    }

    return -engine.trend * 0.03;

}

/*
===============================================================================
VOLATILITY BURST
===============================================================================
*/

function volatilityBurst(

    engine: EngineState

) {

    if (

        Math.random() >

        0.001

    ) {

        return 0;

    }

    return gaussian()

        *

        engine.volatility

        *

        random(

            6,

            15

        );

}

/*
===============================================================================
BUY / SELL CLIMAX
===============================================================================
*/

function climaxMove(

    engine: EngineState

) {

    if (

        Math.random() >

        0.0008

    ) {

        return 0;

    }

    const strength =

        random(

            4,

            10

        );

    return (

        engine.trend >= 0

            ? 1

            : -1

    )

    *

    strength;

}

/*
===============================================================================
MICRO MARKET STRUCTURE
===============================================================================
*/

function updateMicroStructure(
    engine: EngineState
) {
    engine.tickInCandle++;
    engine.microTrend *= 0.96;

    engine.microMomentum *= 0.94;

    engine.buyPressure *= 0.985;

    engine.sellPressure *= 0.985;

    if (Math.random() < 0.55) {

        engine.buyPressure += Math.random();

    } else {

        engine.sellPressure += Math.random();

    }

    engine.microTrend +=
        (engine.buyPressure - engine.sellPressure) * 0.02;

    engine.microMomentum +=
        gaussian() * 0.03;

    engine.microNoise =
    engine.microNoise * 0.75 +
    gaussian() *
    engine.volatility *
    0.025;

}
/*
===============================================================================
NEXT TICK
===============================================================================
*/

export function nextTick(
    engine: EngineState,
    currentPrice: number
): TickResult {

    engine.tickCounter++;

    engine.lastPrice = currentPrice;

    engine.price = currentPrice;

    updateRegime(engine);

    updateTrend(engine);

    updateMomentum(engine);

    updateVolatility(engine);

    updateImpulse(engine);

    updateDrift(engine);

    updateAcceleration(engine);

    updateMicroStructure(engine);

    const move =
        engine.trend +
        engine.momentum +
        engine.acceleration +
        engine.impulse +
        engine.drift +
        meanReversion(engine) +
        marketNoise(engine) +
        breakoutExpansion(engine) +
        panicShock(engine) +
        newsShock(engine) +
        liquiditySweep(engine) +
        stopHunt(engine) +
        trendExhaustion(engine) +
        volatilityBurst(engine) +
        climaxMove(engine) +
        engine.microTrend +
        engine.microMomentum +
        engine.microNoise;

    const smoothMove =
    move * 0.70 +
    engine.lastMove * 0.30;

const limitedMove =
    clampMove(
        engine,
        smoothMove
    );

    const nextPrice = Math.max(
        0.01,
        currentPrice + limitedMove
    );

    engine.price = nextPrice;
    engine.lastMove = limitedMove;

    engine.highest = Math.max(
        engine.highest,
        nextPrice
    );

    engine.lowest = Math.min(
        engine.lowest,
        nextPrice
    );

    engine.sessionHigh = Math.max(
        engine.sessionHigh,
        nextPrice
    );

    engine.sessionLow = Math.min(
    engine.sessionLow,
    nextPrice
);

/* ===========================================================
   UPDATE OPEN TRADES
=========================================================== */

const store = useTradeStore.getState();

store.updateOpenTrades(
    store.selectedMarket?.symbol ?? "R_100",
    nextPrice
);

return {

    price: Number(
        nextPrice.toFixed(2)
    ),

    move: limitedMove,

    velocity: engine.momentum,

    acceleration: engine.acceleration,

};
}