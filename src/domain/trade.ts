export type OrderMode = 'dollars' | 'shares';

export type OrderPlan = {
  quantity: number;
  notional: number;
};

const SHARE_PRECISION = 1_000_000;

function roundCents(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function floorShares(value: number) {
  return Math.floor(value * SHARE_PRECISION + 1e-8) / SHARE_PRECISION;
}

export function planBuy(input: {
  mode: OrderMode;
  amount: number;
  price: number;
  cash: number;
}): OrderPlan {
  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new Error('A validated price is required.');
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Enter an amount greater than zero.');
  }
  if (!Number.isFinite(input.cash) || input.cash < 0) {
    throw new Error('Virtual cash is unavailable.');
  }

  const quantity =
    input.mode === 'dollars' ? floorShares(input.amount / input.price) : floorShares(input.amount);

  if (quantity <= 0) {
    throw new Error('That amount is too small for a simulated share at this price.');
  }

  const notional = roundCents(quantity * input.price);
  if (notional < 1) {
    throw new Error('The minimum simulated order is $1.00.');
  }
  if (notional > roundCents(input.cash)) {
    throw new Error('That order costs more virtual cash than you have.');
  }

  return { quantity, notional };
}

export function planSell(input: {
  mode: OrderMode;
  amount: number;
  price: number;
  owned: number;
}): OrderPlan {
  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new Error('A validated price is required.');
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Enter an amount greater than zero.');
  }
  if (!Number.isFinite(input.owned) || input.owned <= 0) {
    throw new Error('You do not hold this asset.');
  }

  let quantity =
    input.mode === 'dollars' ? floorShares(input.amount / input.price) : floorShares(input.amount);

  if (quantity <= 0) {
    throw new Error('That amount is too small for a simulated share at this price.');
  }
  if (quantity > input.owned + 1e-8) {
    throw new Error('You cannot sell more shares than you hold.');
  }
  if (quantity > input.owned) quantity = floorShares(input.owned);

  const notional = roundCents(quantity * input.price);
  if (notional < 1) {
    throw new Error('The minimum simulated order is $1.00.');
  }

  return { quantity, notional };
}
