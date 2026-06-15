export function bollinger(values: number[], period = 20) {
  const slice = values.slice(-period);

  const mean =
    slice.reduce((a, b) => a + b, 0) / slice.length;

  const variance =
    slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    slice.length;

  const std = Math.sqrt(variance);

  return {
    upper: mean + 2 * std,
    middle: mean,
    lower: mean - 2 * std,
  };
}