/**
 * 5-STATE VOLATILITY SYSTEM
 * - replaces single volatility number
 */

export type VolatilityLevel =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "EXTREME"
  | "CHAOS";

export interface VolatilityState {
  level: VolatilityLevel;
  value: number;
  color: string;
  intensity: number;
}

/**
 * Predefined volatility profiles
 */
const VOLATILITY_MAP: Record<VolatilityLevel, Omit<VolatilityState, "level">> =
  {
    LOW: {
      value: 0.6,
      color: "#22c55e",
      intensity: 0.3,
    },
    NORMAL: {
      value: 1.0,
      color: "#3b82f6",
      intensity: 0.5,
    },
    HIGH: {
      value: 1.6,
      color: "#f59e0b",
      intensity: 0.7,
    },
    EXTREME: {
      value: 2.3,
      color: "#ef4444",
      intensity: 0.9,
    },
    CHAOS: {
      value: 3.2,
      color: "#a855f7",
      intensity: 1,
    },
  };

/**
 * Picks volatility based on market pressure
 */
export function getVolatilityState(
  fearGreed: number,
  momentum: number,
  shock: number
): VolatilityState {
  let level: VolatilityLevel = "NORMAL";

  if (shock > 2) level = "CHAOS";
  else if (shock > 1.2) level = "EXTREME";
  else if (Math.abs(momentum) > 0.6) level = "HIGH";
  else if (Math.abs(momentum) > 0.3) level = "NORMAL";
  else level = "LOW";

  const base = VOLATILITY_MAP[level];

  return {
    level,
    value: base.value,
    color: base.color,
    intensity: base.intensity,
  };
}