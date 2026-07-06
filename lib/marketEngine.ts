export interface EngineParams {
    meanReversionScale: number;
    exhaustionScale: number;
    burstScale: number;
    liquidityScale: number;
    heavyFactorScale: number;
}

let price = 702;

/*
---------------------------------------------------
MARKET STATE
---------------------------------------------------
*/

let trend = 0;
let volatility = 1;
let momentum = 0;
let regime = 0;
let lastBurst = 0;

let params: EngineParams = {
    meanReversionScale: 1,
    exhaustionScale: 1,
    burstScale: 1,
    liquidityScale: 1,
    heavyFactorScale: 1
};

function randomNormal() {

    let u = 0;
    let v = 0;

    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    return Math.sqrt(-2 * Math.log(u))
        * Math.cos(2 * Math.PI * v);

}

function updateRegime() {

    if (Math.random() < 0.002) {

        regime = Math.floor(
            Math.random() * 4
        );

    }

}

function updateVolatility() {

    volatility +=
        (Math.random() - 0.5) * 0.04;

    volatility =
        Math.max(
            0.5,
            Math.min(
                volatility,
                3
            )
        );

}

function updateTrend() {

    trend +=
        randomNormal() * 0.02;

    trend *= 0.995;

}

function nextPrice() {

    updateRegime();

    updateTrend();

    updateVolatility();

    /*
    -------------------------------
    REGIME EFFECT
    -------------------------------
    */

    let regimeDrift = 0;

    switch (regime) {

        case 0:

            regimeDrift = 0;

            break;

        case 1:

            regimeDrift = 0.18;

            break;

        case 2:

            regimeDrift = -0.18;

            break;

        case 3:

            regimeDrift = 0;

            volatility += 0.02;

            break;

    }

    /*
    -------------------------------
    MOMENTUM
    -------------------------------
    */

    momentum *= 0.96;

    momentum +=
        trend * 0.12;

    /*
    -------------------------------
    RANDOM WALK
    -------------------------------
    */

    const gaussian =

        randomNormal()

        *

        volatility

        *

        params.liquidityScale;

    /*
    -------------------------------
    HEAVY TAILS
    -------------------------------
    */

    let heavyMove = 0;

    if (Math.random() < 0.025) {

        heavyMove =

            randomNormal()

            *

            5

            *

            params.heavyFactorScale;

    }

    /*
    -------------------------------
    BURSTS
    -------------------------------
    */

    if (

        lastBurst > 0

    ) {

        lastBurst--;

    }

    let burst = 0;

    if (

        lastBurst === 0

        &&

        Math.random() < 0.008

    ) {

        burst =

            randomNormal()

            *

            8

            *

            params.burstScale;

        lastBurst = 12;

    }

    /*
    -------------------------------
    EXHAUSTION
    -------------------------------
    */

    const exhaustion =

        Math.sin(

            Date.now()

            / 8000

        )

        *

        0.08

        *

        params.exhaustionScale;

    /*
    -------------------------------
    PRICE
    -------------------------------
    */

    price +=

        gaussian

        +

        momentum

        +

        regimeDrift

        +

        burst

        +

        heavyMove

        +

        exhaustion;

    if (price < 1) {

        price = 1;

    }

    return Number(

        price.toFixed(5)

    );

}

/*
---------------------------------------------------
ENGINE
---------------------------------------------------
*/

export function startMarket(

    onTick: (

        price: number

    ) => void,

    intervalMs = 250

) {

    onTick(price);

    const id = window.setInterval(

        () => {

            onTick(

                nextPrice()

            );

        },

        Math.max(

            60,

            intervalMs

        )

    );

    return () =>

        window.clearInterval(id);

}

export function setEngineParams(

    next: Partial<EngineParams>

) {

    params = {

        ...params,

        ...next

    };

}

export function resetMarket(

    next = 702

) {

    price = next;

    trend = 0;

    volatility = 1;

    momentum = 0;

    regime = 0;

}

export function currentMarketPrice() {

    return price;

}