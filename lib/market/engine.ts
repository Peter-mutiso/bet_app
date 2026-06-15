let price = 712.28;
let interval: ReturnType<typeof setInterval> | null = null;

/**
 * MARKET STATE (stable regime system)
 */
let trend: "UP" | "DOWN" | "SIDE" = "SIDE";
let trendStrength = 0;
let trendDuration = 20;

let volatility = 1.2;
let volatilityCycle = 0;

let shockCooldown = 0;
let lastChange = 0;
let smoothed = price;

/**
 * helpers
 */
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const ema = (cur: number, prev: number, a: number) =>
  prev + a * (cur - prev);

/**
 * stable regime switcher (LESS RANDOM THAN YOUR OLD ONE)
 */
function updateRegime() {
  trendDuration--;

  if (trendDuration <= 0) {
    const r = Math.random();

    trend = r < 0.4 ? "UP" : r < 0.8 ? "DOWN" : "SIDE";
    trendDuration = 20 + Math.floor(Math.random() * 40);
  }

  trendStrength = ema(Math.random(), trendStrength, 0.08);

  volatilityCycle += 0.02;
  volatility = clamp(
    1 + Math.sin(volatilityCycle) * 0.6 + Math.random() * 0.2,
    0.6,
    2.5
  );
}

function microNoise() {
  const n = (Math.random() - 0.5) * 0.12 * volatility;
  lastChange = ema(n, lastChange, 0.2);
  return lastChange;
}

function shockEvent() {
  if (shockCooldown-- > 0) return 0;

  if (Math.random() < 0.003) {
    shockCooldown = 10;
    return (Math.random() - 0.5) * 3 * volatility;
  }

  return 0;
}

/**
 * MAIN ENGINE (stable, non-chaotic)
 */
export function startMarket(callback: (p: number) => void) {
  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    updateRegime();

    const trendForce =
      trend === "UP" ? 0.05 : trend === "DOWN" ? -0.05 : 0;

    const shock = shockEvent();
    const noise = microNoise();

    const raw =
      trendForce +
      trendStrength * 0.03 +
      shock +
      noise;

    smoothed = ema(price + raw, smoothed, 0.35);

    price = clamp(smoothed, 100, 5000);

    callback(price);
  }, 1000);

  return stopMarket;
}

export function stopMarket() {
  if (interval) clearInterval(interval);
  interval = null;
}

export function getPrice() {
  return price;
}