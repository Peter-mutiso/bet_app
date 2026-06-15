export function ema(values: number[], period: number) {
  const k = 2 / (period + 1);
  let ema = values[0];

  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
  }

  return ema;
}

export function calcMACD(values: number[]) {
  const fast = ema(values.slice(-26), 12);
  const slow = ema(values.slice(-26), 26);

  const macd = fast - slow;
  const signal = ema([...values.slice(-9), macd], 9);

  return { macd, signal };
}