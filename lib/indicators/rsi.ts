export function calcRSI(values: number[], period = 14) {
  if (values.length < period + 1) return 50;

  let gain = 0;
  let loss = 0;

  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }

  const rs = gain / (loss || 1);
  return 100 - 100 / (1 + rs);
}