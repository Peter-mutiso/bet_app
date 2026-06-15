// Clean market engine: no duplicate declarations, stable TypeScript, and exports

let price = 712.28;
let timer: ReturnType<typeof setTimeout> | null = null;
let microTimer: ReturnType<typeof setInterval> | null = null;
let watchdogTimer: ReturnType<typeof setInterval> | null = null;
let lastEmit = Date.now();

// Engine adjustable parameters (per-instrument presets can update these)
const engineParams = {
  meanReversionScale: 1.0,
  exhaustionScale: 1.0,
  burstScale: 1.0,
  liquidityScale: 1.0,
  heavyFactorScale: 1.0,
};

export function setEngineParams(p: Partial<typeof engineParams>) {
  Object.assign(engineParams, p);
}

export function getEngineParams() {
  return { ...engineParams };
}

/**
 * =========================
 * REGIME STATE
 * =========================
 */
let trend: "UP" | "DOWN" | "SIDE" = "SIDE";
let trendStrength = 0;
let trendDuration = 0;

// fair value (EMA) that mean-reversion pulls towards
let fairPrice = price;

// recent pressure for liquidity/friction modeling (positive = net buy pressure)
let recentPressure = 0;

// volatility burst state (clusters): multiplier that temporarily increases noise
let volatilityBurst = 0;

/**
 * =========================
 * VOLATILITY STATES
 * =========================
 */
type VolatilityState = 0 | 1 | 2 | 3 | 4;
let volatilityState: VolatilityState = 2;

/**
 * volatility behavior map
 */
const volatilityMap: Record<number, { base: number; noise: number; shock: number }> = {
  0: { base: 0.4, noise: 0.04, shock: 0.0012 },
  1: { base: 0.8, noise: 0.07, shock: 0.003 },
  2: { base: 1.2, noise: 0.1, shock: 0.005 },
  3: { base: 1.9, noise: 0.18, shock: 0.009 },
  4: { base: 3.0, noise: 0.32, shock: 0.018 },
};

/**
 * =========================
 * DYNAMICS
 * =========================
 */
let momentum = 0;
let acceleration = 0;
let friction = 0;

// stochastic volatility state (variance)
let sigma2 = 0.01;

// GARCH-like parameters for variance updates
const GARCH = {
  omega: 0.000001,
  alpha: 0.12,
  beta: 0.86,
};

// heavy-tail settings: mixture of normals
const heavyProbBase = 0.02;
const heavyFactor = 4.0;

/**
 * =========================
 * SENTIMENT
 * =========================
 */
let fearGreed = 50;

/**
 * =========================
 * SHOCK SYSTEM
 * =========================
 */
let shockCooldown = 0;

/**
 * =========================
 * NOISE MEMORY
 * =========================
 */
let noiseMemory = 0;

/**
 * =========================
 * HELPERS
 * =========================
 */
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function ema(current: number, previous: number, alpha: number) {
  return previous + alpha * (current - previous);
}

/**
 * =========================
 * VOLATILITY ENGINE (STABLE)
 * =========================
 */
function updateVolatilityState() {
  const v = volatilityState;

  const stress = fearGreed < 30 || fearGreed > 70 ? 0.03 : 0.015;

  const r = Math.random();

  // move up volatility
  if (r < stress && v < 4) {
    volatilityState = (v + 1) as VolatilityState;
  }

  // relax volatility (slower than increase → prevents flicker)
  else if (r > 0.985 && v > 0) {
    volatilityState = (v - 1) as VolatilityState;
  }
}

/**
 * =========================
 * REGIME ENGINE
 * =========================
 */
function updateMarketRegime() {
  trendDuration++;

  const switchProb = Math.min(0.015 + trendDuration * 0.0012, 0.4);

  if (Math.random() < switchProb) {
    const r = Math.random();
    trend = r < 0.4 ? "UP" : r < 0.8 ? "DOWN" : "SIDE";
    trendDuration = 0;
  }

  // trend strength should slowly build but decay over long durations (exhaustion)
  const build = Math.random() * 0.6;
  const decay = Math.min(0.02 + trendDuration * 0.001, 0.15);
  trendStrength = clamp(ema(build, trendStrength, 0.07) - decay * 0.5, 0, 1.5);
}

/**
 * =========================
 * MOMENTUM ENGINE
 * =========================
 */
function updateMomentum() {
  const v = volatilityMap[volatilityState];

  const bias = trend === "UP" ? 0.14 : trend === "DOWN" ? -0.14 : 0;

  // trend exhaustion: reduce bias as trendDuration grows
  const exhaustionFactor = Math.exp(-trendDuration * 0.02) * engineParams.exhaustionScale;

  acceleration = ema(bias * trendStrength * exhaustionFactor, acceleration, 0.08);
  momentum = ema(acceleration, momentum, 0.06);

  // dynamic friction that increases when recent pressure is very high (liquidity resistance)
  const liquidityFriction = -Math.tanh(recentPressure * 0.6) * 0.12;

  const exhaustion = Math.tanh(momentum * 2) * -0.06;

  friction = momentum * -0.18 + exhaustion + liquidityFriction;

  // volatility scaling
  momentum *= 1 - v.base * 0.01;
}

function updateMeanReversionAndLiquidity() {
  // update fairPrice (EMA of price) to represent a moving anchor
  fairPrice = ema(price, fairPrice, 0.01);

  // mean reversion pressure is stronger when price deviates more from fairPrice
  const deviation = (fairPrice - price) / fairPrice;

  // liquidity pressure: recentPressure integrates signed micro moves
  recentPressure = ema(recentPressure, recentPressure + deviation * 0.5, 0.05);

  // volatility bursts: if deviation grows quickly, increase burst
  if (Math.abs(deviation) > 0.005 && Math.random() < 0.25) {
    volatilityBurst = Math.min(1.8, volatilityBurst + Math.random() * 0.8 + 0.2);
  }

  // decay burst slowly
  volatilityBurst = Math.max(0, volatilityBurst * 0.96 - 0.01);
}

/**
 * =========================
 * SENTIMENT
 * =========================
 */
function updateSentiment() {
  const drift = trend === "UP" ? 0.2 : trend === "DOWN" ? -0.2 : 0;

  fearGreed = clamp(
    fearGreed + drift + (Math.random() - 0.5) * 1.0,
    0,
    100
  );
}

/**
 * =========================
 * SHOCK SYSTEM (STABLE)
 * =========================
 */
function maybeShock() {
  const v = volatilityMap[volatilityState];

  if (shockCooldown > 0) {
    shockCooldown--;
    return 0;
  }

  if (Math.random() < v.shock) {
    shockCooldown = 12 + Math.floor(Math.random() * 18);

    const direction = Math.random() < 0.5 ? -1 : 1;

    trend = direction === 1 ? "UP" : "DOWN";
    trendStrength = 1;

    volatilityState = 4;

    return direction * v.base * 2.5;
  }

  return 0;
}

/**
 * =========================
 * MICRO NOISE
 * =========================
 */
function microNoise() {
  const v = volatilityMap[volatilityState];

  const raw = (Math.random() - 0.5) * v.noise;

  noiseMemory = ema(raw, noiseMemory, 0.18);

  return noiseMemory;
}

/**
 * =========================
 * MARKET LOOP
 * =========================
 */
function tick(callback: (price: number) => void, intervalMs: number) {
  // We wrap the whole tick computation in try/finally so that even if
  // something unexpected throws, the next timer is scheduled and the
  // engine doesn't silently stop (helps with long intervals like 15s).
  try {
    // update state
    updateVolatilityState();
    updateMarketRegime();
    updateMomentum();
    updateSentiment();
    updateMeanReversionAndLiquidity();

    const v = volatilityMap[volatilityState];

    // macro shock and noise
    const shock = maybeShock();
    // micro noise enhanced by volatilityBurst and engine burstScale
    const noise = microNoise() * (1 + volatilityBurst * engineParams.burstScale);

    const trendForce =
      trend === "UP"
        ? 0.045 * v.base
        : trend === "DOWN"
        ? -0.045 * v.base
        : 0;

    // mean reversion now towards fairPrice
    const meanReversion = ((fairPrice - price) * 0.00025) * v.base * engineParams.meanReversionScale;

    // base raw change (macro)
    let rawChange =
      momentum * 0.35 +
      acceleration * 0.12 +
      friction +
      trendForce +
      shock +
      noise +
      meanReversion;

    // liquidity friction: reduce rawChange magnitude when recentPressure is high
    const liquidityDrag = Math.tanh(Math.abs(recentPressure) * 1.2) * 0.35 * engineParams.liquidityScale;
    rawChange *= 1 - liquidityDrag * 0.5;

    // introduce heavy-tail mixing: occasionally inflate the macro change
    const heavyProb = heavyProbBase * (1 + v.base * 0.5);
    if (Math.random() < heavyProb) {
      rawChange *= 1 + Math.random() * heavyFactor * engineParams.heavyFactorScale;
    }

    // update variance using a simple GARCH-like rule on the macro change
    sigma2 = GARCH.omega + GARCH.alpha * rawChange * rawChange + GARCH.beta * sigma2;

    // emit micro-steps within this tick to create candle wicks and sub-tick randomness
    const microSteps = 1 + Math.floor(Math.random() * 6); // 1..6 sub-steps

    for (let i = 0; i < microSteps; i++) {
      // micro component: split macro change plus micro noise drawn from mixture
      const split = rawChange * (0.6 + Math.random() * 0.8) / microSteps;
      // draw micro noise (mixture of normals for heavy tails)
      const baseZ = (Math.random() - 0.5) * 2; // simple proxy for gaussian-like noise
      const heavy = Math.random() < heavyProb ? (1 + Math.random() * heavyFactor) : 1;
      const microNoiseVal = baseZ * Math.sqrt(sigma2) * v.noise * heavy;

      const microChange = split + microNoiseVal + (Math.random() - 0.5) * v.noise * 0.5;

      price = clamp(price + microChange, 10, 1000000);

      // update local variance with micro movement
      sigma2 = GARCH.omega + GARCH.alpha * microChange * microChange + GARCH.beta * sigma2;

      // callback with each micro-price so the chart can update highs/lows
      try {
        callback(price);
        lastEmit = Date.now();
      } catch (e) {
        // swallow callback errors so engine continues
        // console.error('callback error in market tick', e);
      }
    }
  } finally {
    // schedule next tick based on requested interval with small jitter
    try {
      const jitter = Math.min(500, intervalMs * 0.25);
      const delay = Math.max(20, Math.round(intervalMs + Math.random() * jitter));

      timer = setTimeout(() => tick(callback, intervalMs), delay);
    } catch (e) {
      // ensure we never leave the engine without a scheduling attempt
      console.error('failed to schedule next market tick', e);
      timer = setTimeout(() => tick(callback, intervalMs), Math.max(1000, intervalMs));
    }
  }
}

/**
 * =========================
 * START / STOP / RESET / DEBUG
 * =========================
 */
export function startMarket(callback: (price: number) => void, intervalMs = 1000) {
  // debug log for visibility in the browser console
  try {
    // best-effort logging only when console is available
    console.debug?.(`[marketEngine] startMarket intervalMs=${intervalMs}`);
  } catch {}

  stopMarket();
  // start a micro-timer that emits frequent micro-price updates so the
  // chart remains fluid even when macro ticks are spaced far apart.
  const microIntervalMs = Math.min(1000, Math.max(150, Math.floor(intervalMs / 10)));
  microTimer = setInterval(() => {
    try {
      const v = volatilityMap[volatilityState];
      // small continuous micro movement
      const micro = microNoise() * (1 + volatilityBurst * engineParams.burstScale) * 0.6;
      const jitter = (Math.random() - 0.5) * v.noise * 0.5;
      price = clamp(price + micro + jitter, 10, 1000000);
      // local variance update
      sigma2 = GARCH.omega + GARCH.alpha * micro * micro + GARCH.beta * sigma2;
      try {
        callback(price);
      } catch (e) {
        // swallow
      }
    } catch (e) {
      // micro-timer must not kill the engine
      console.error?.('[marketEngine] microTimer error', e);
    }
  }, microIntervalMs);

  // start a simple watchdog that ensures the UI keeps receiving price emits
  // if for some reason the main timers stop firing. This is defensive and
  // helps recover from unexpected interruptions (e.g. synchronous errors
  // elsewhere in the app that disrupt scheduling).
  try {
    if (watchdogTimer) clearInterval(watchdogTimer as any);
  } catch {}

  watchdogTimer = setInterval(() => {
    const staleMs = Math.max(2000, intervalMs * 1.5);
    if (Date.now() - lastEmit > staleMs) {
      try {
        // emit a keepalive price to the callback so consumer UI can recover
        callback(price);
        lastEmit = Date.now();
      } catch (e) {
        // swallow
      }
    }
  }, Math.max(800, Math.floor(intervalMs / 4)));

  // start macro tick loop
  tick(callback, intervalMs);
  return stopMarket;
}

export function stopMarket() {
  try {
    console.debug?.('[marketEngine] stopMarket');
  } catch {}

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (microTimer) {
    clearInterval(microTimer);
    microTimer = null;
  }
  if (watchdogTimer) {
    clearInterval(watchdogTimer as any);
    watchdogTimer = null;
  }
  lastEmit = Date.now();
}

export function resetMarket(seed = 712.28) {
  stopMarket();

  price = seed;
  trend = "SIDE";
  trendStrength = 0;
  trendDuration = 0;

  volatilityState = 2;

  momentum = 0;
  acceleration = 0;
  friction = 0;

  fearGreed = 50;
  shockCooldown = 0;
  noiseMemory = 0;
}

export function getMarketState() {
  const v = volatilityMap[volatilityState];

  return {
    price,
    trend,
    volatilityState,
    volatility: v,
    trendStrength,
    momentum,
    acceleration,
    fearGreed,
  };
}
