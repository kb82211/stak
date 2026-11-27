import assert from 'node:assert/strict';
import test from 'node:test';

import { availablePeriods, buildInsights, dailyChange, summarizePortfolio } from './portfolio.ts';
import { lessonXpAward, levelForXp } from './progress.ts';
import { planBuy, planSell } from './trade.ts';

test('buy by dollars never spends more cash than submitted', () => {
  const plan = planBuy({ mode: 'dollars', amount: 100, price: 30, cash: 100 });
  assert.ok(plan.quantity > 0);
  assert.ok(plan.notional <= 100);
  assert.equal(plan.quantity, 3.333333);
  assert.equal(plan.notional, 100);
});

test('buy rejects an order larger than virtual cash', () => {
  assert.throws(() => planBuy({ mode: 'shares', amount: 2, price: 50, cash: 40 }));
});

test('sell cannot exceed shares owned', () => {
  assert.throws(() => planSell({ mode: 'shares', amount: 3, price: 20, owned: 2 }));
  const plan = planSell({ mode: 'shares', amount: 1.5, price: 20, owned: 2 });
  assert.equal(plan.quantity, 1.5);
  assert.equal(plan.notional, 30);
});

test('portfolio total stays null when a holding has no price', () => {
  const summary = summarizePortfolio({
    cash: 4000,
    holdings: [
      {
        symbol: 'AAPL',
        name: 'Apple',
        assetType: 'stock',
        sector: 'Technology',
        quantity: 2,
        avgCost: 100,
        price: 110,
        priceAsOf: null,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        assetType: 'stock',
        sector: 'Technology',
        quantity: 1,
        avgCost: 200,
        price: null,
        priceAsOf: null,
      },
    ],
  });
  assert.equal(summary.complete, false);
  assert.equal(summary.total, null);
  assert.equal(summary.profit, null);
  assert.equal(summary.investedCost, 400);
});

test('complete portfolio reports return against the starting balance', () => {
  const summary = summarizePortfolio({
    cash: 9000,
    holdings: [
      {
        symbol: 'VOO',
        name: 'Vanguard S&P 500 ETF',
        assetType: 'etf',
        sector: 'Broad market',
        quantity: 2,
        avgCost: 400,
        price: 550,
        priceAsOf: '2026-01-01T00:00:00Z',
      },
    ],
  });
  assert.equal(summary.total, 10100);
  assert.equal(summary.profit, 300);
  assert.equal(summary.overallReturn, 0.01);
});

test('daily change needs a prior snapshot', () => {
  assert.equal(
    dailyChange([{ total: 10000, at: '2026-11-26T15:00:00.000Z' }], '2026-11-26'),
    null,
  );
  const change = dailyChange(
    [
      { total: 10000, at: '2026-11-25T15:00:00.000Z' },
      { total: 10150, at: '2026-11-26T15:00:00.000Z' },
    ],
    '2026-11-26',
  );
  assert.equal(change?.amount, 150);
});

test('periods appear only when two points exist inside them', () => {
  const now = Date.parse('2026-11-26T18:00:00.000Z');
  const points = [
    { total: 10000, at: '2026-11-20T18:00:00.000Z' },
    { total: 10040, at: '2026-11-26T17:00:00.000Z' },
  ];
  const periods = availablePeriods(points, now);
  assert.equal(periods.includes('1D'), false);
  assert.equal(periods.includes('1W'), true);
  assert.equal(periods.includes('ALL'), true);
});

test('insights describe concentration without telling the user to trade', () => {
  const insights = buildInsights({
    snapshots: [],
    holdings: [
      {
        symbol: 'AAPL',
        name: 'Apple',
        assetType: 'stock',
        sector: 'Technology',
        quantity: 10,
        avgCost: 100,
        price: 100,
        priceAsOf: null,
      },
      {
        symbol: 'VOO',
        name: 'VOO',
        assetType: 'etf',
        sector: 'Broad market',
        quantity: 1,
        avgCost: 100,
        price: 50,
        priceAsOf: null,
      },
    ],
  });
  assert.ok(insights.some((insight) => insight.id === 'concentration'));
  assert.equal(insights.some((insight) => /you should/i.test(insight.body)), false);
});

test('xp and levels follow the published thresholds', () => {
  assert.equal(lessonXpAward(3, 5, false), 0);
  assert.equal(lessonXpAward(4, 5, false), 50);
  assert.equal(lessonXpAward(5, 5, false), 75);
  assert.equal(lessonXpAward(5, 5, true), 0);
  assert.equal(levelForXp(0).name, 'Financial Beginner');
  assert.equal(levelForXp(150).name, 'Money Explorer');
  assert.equal(levelForXp(2200).name, 'Financial Strategist');
});
