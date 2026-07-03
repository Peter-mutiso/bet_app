export interface EngineParams {
  meanReversionScale: number;
  exhaustionScale: number;
  burstScale: number;
  liquidityScale: number;
  heavyFactorScale: number;
}

let price = 702;
let params: EngineParams = {
  meanReversionScale: 1,
  exhaustionScale: 1,
  burstScale: 1,
  liquidityScale: 1,
  heavyFactorScale: 1,
};

function nextPrice() {
  const center = 702;
  const meanReversion = (center - price) * 0.002 * params.meanReversionScale;
  const noise = (Math.random() - 0.5) * 1.6 * params.liquidityScale;
  const burst = Math.random() > 0.965 ? (Math.random() - 0.5) * 7 * params.burstScale : 0;
  const exhaustion = Math.sin(Date.now() / 9000) * 0.12 * params.exhaustionScale;

  price = Math.max(1, price + meanReversion + noise + burst + exhaustion);
  return Number(price.toFixed(5));
}

export function startMarket(onTick: (price: number) => void, intervalMs = 1000) {
  onTick(price);

  const id = window.setInterval(() => {
    onTick(nextPrice());
  }, Math.max(250, intervalMs));

  return () => window.clearInterval(id);
}

export function setEngineParams(next: Partial<EngineParams>) {
  params = {
    ...params,
    ...next,
  };
}

export function resetMarket(next = 702) {
  price = next;
}

export function currentMarketPrice() {
  return price;
}
