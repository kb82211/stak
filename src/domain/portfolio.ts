export type SnapshotPoint = {
  total: number;
  at: string;
};

export type HoldingValuation = {
  symbol: string;
  name: string;
  assetType: 'stock' | 'etf' | 'unknown';
  sector: string | null;
  quantity: number;
  avgCost: number;
  price: number | null;
  priceAsOf: string | null;
};

export type Insight = {
  id: string;
  title: string;
  body: string;
};

export const PERIODS = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;
export type Period = (typeof PERIODS)[number];

const PERIOD_MS: Record<Exclude<Period, 'ALL'>, number> = {
  '1D': 86_400_000,
  '1W': 7 * 86_400_000,
  '1M': 30 * 86_400_000,
  '3M': 90 * 86_400_000,
  '1Y': 365 * 86_400_000,
};

export function filterSnapshots(points: SnapshotPoint[], period: Period, now: number) {
  const ordered = [...points].sort((a, b) => a.at.localeCompare(b.at));
  if (period === 'ALL') return ordered;
  const cutoff = now - PERIOD_MS[period];
  return ordered.filter((point) => new Date(point.at).getTime() >= cutoff);
}

export function availablePeriods(points: SnapshotPoint[], now: number) {
  return PERIODS.filter((period) => filterSnapshots(points, period, now).length >= 2);
}

export function costBasis(holding: HoldingValuation) {
  return holding.quantity * holding.avgCost;
}

export function marketValue(holding: HoldingValuation) {
  if (holding.price == null) return null;
  return holding.quantity * holding.price;
}

export function summarizePortfolio(input: {
  cash: number;
  holdings: HoldingValuation[];
  startingCash?: number;
}) {
  const startingCash = input.startingCash ?? 10_000;
  const investedCost = input.holdings.reduce((sum, holding) => sum + costBasis(holding), 0);
  const unpriced = input.holdings.filter((holding) => holding.price == null);
  const priced = input.holdings.filter((holding) => holding.price != null);
  const pricedMarket = priced.reduce((sum, holding) => sum + (marketValue(holding) ?? 0), 0);
  const pricedCost = priced.reduce((sum, holding) => sum + costBasis(holding), 0);
  const complete = unpriced.length === 0;
  const total = complete ? input.cash + pricedMarket : null;
  const profit = complete ? pricedMarket - pricedCost : null;
  const overallReturn = total == null || startingCash === 0 ? null : (total - startingCash) / startingCash;

  return {
    cash: input.cash,
    investedCost,
    pricedMarket,
    unpricedCount: unpriced.length,
    complete,
    total,
    profit,
    overallReturn,
  };
}

export function allocationByPrice(holdings: HoldingValuation[]) {
  const valued = holdings
    .map((holding) => ({ holding, value: marketValue(holding) }))
    .filter((row): row is { holding: HoldingValuation; value: number } => row.value != null && row.value > 0);
  const total = valued.reduce((sum, row) => sum + row.value, 0);
  if (total <= 0) return [];
  return valued.map((row) => ({
    symbol: row.holding.symbol,
    label: row.holding.symbol,
    value: row.value,
    weight: row.value / total,
  }));
}

export function dailyChange(points: SnapshotPoint[], today: string) {
  const ordered = [...points].sort((a, b) => a.at.localeCompare(b.at));
  const latestToday = [...ordered].reverse().find((point) => point.at.slice(0, 10) === today);
  const prior = [...ordered].reverse().find((point) => point.at.slice(0, 10) < today);
  if (!latestToday || !prior || prior.total === 0) return null;
  const amount = latestToday.total - prior.total;
  return { amount, percent: amount / prior.total };
}

export function buildInsights(input: {
  holdings: HoldingValuation[];
  snapshots: SnapshotPoint[];
}): Insight[] {
  const insights: Insight[] = [];
  const weights = allocationByPrice(input.holdings);
  const largest = [...weights].sort((a, b) => b.weight - a.weight)[0];

  if (input.holdings.length === 1) {
    insights.push({
      id: 'single',
      title: 'One company drives the result',
      body: 'This simulated portfolio holds a single asset. Its results will follow that one business, with no offset from other holdings.',
    });
  } else if (largest && largest.weight >= 0.4) {
    insights.push({
      id: 'concentration',
      title: 'A large share sits in one holding',
      body: `${largest.symbol} is ${Math.round(largest.weight * 100)}% of the priced holdings. Concentration means a portfolio’s results depend heavily on one company or fund.`,
    });
  }

  const sectors = new Set(
    input.holdings.map((holding) => holding.sector).filter((sector): sector is string => Boolean(sector)),
  );
  if (input.holdings.length >= 2 && sectors.size === 1) {
    const [sector] = [...sectors];
    insights.push({
      id: 'sector',
      title: 'Holdings share one sector',
      body: `The holdings with a known sector are all in ${sector}. Companies in the same sector can react to the same economic forces together.`,
    });
  }

  const types = new Set(input.holdings.map((holding) => holding.assetType));
  if (types.has('stock') && types.has('etf')) {
    insights.push({
      id: 'mix',
      title: 'Stocks and ETFs are both present',
      body: 'Individual stocks represent one company. ETFs package many securities into one traded fund. Owning both means the portfolio mixes single-company exposure with basket exposure.',
    });
  }

  if (input.snapshots.length >= 5) {
    const ordered = [...input.snapshots].sort((a, b) => a.at.localeCompare(b.at));
    const returns: number[] = [];
    for (let i = 1; i < ordered.length; i += 1) {
      const prev = ordered[i - 1].total;
      if (prev > 0) returns.push((ordered[i].total - prev) / prev);
    }
    if (returns.length >= 4) {
      const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
      const variance =
        returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / returns.length;
      const deviation = Math.sqrt(variance);
      if (deviation >= 0.02) {
        insights.push({
          id: 'volatility',
          title: 'Recorded values have swung',
          body: 'Across saved valuations, this portfolio’s value has moved by a noticeable amount from one snapshot to the next. Volatility describes the size of those swings. It is not the same thing as a permanent loss.',
        });
      }
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: 'steady',
      title: 'Nothing here is a recommendation',
      body: 'These notes describe the shape of the simulated portfolio. They do not say what to buy, sell, or hold.',
    });
  }

  return insights;
}
