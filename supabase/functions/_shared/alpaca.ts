export type Quote = {
  symbol: string;
  price: number;
  asOf: string;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number | null;
  feed: string;
  exchange: string | null;
  pricing: 'exchange_trade' | 'end_of_day';
  sourceLabel: string;
  stale: boolean;
  provider: 'alpaca';
};

const EXCHANGES: Record<string, string> = {
  V: 'IEX',
  Q: 'NASDAQ',
  N: 'NYSE',
  P: 'NYSE Arca',
  Z: 'Cboe',
  A: 'NYSE American',
};

export function credentials() {
  const key = Deno.env.get('ALPACA_API_KEY_ID') ?? '';
  const secret = Deno.env.get('ALPACA_API_SECRET_KEY') ?? '';
  const feed = Deno.env.get('ALPACA_DATA_FEED') || 'iex';
  return { key, secret, feed, configured: Boolean(key && secret) };
}

export function describe(feed: string, pricing: Quote['pricing'], stale: boolean) {
  const source =
    feed === 'iex'
      ? 'IEX exchange-specific data. This is not consolidated US market data.'
      : feed === 'sip'
        ? 'SIP consolidated tape data.'
        : `${feed} data from Alpaca.`;
  const timing =
    pricing === 'end_of_day'
      ? 'The price is an end-of-day close, not a live quote.'
      : stale
        ? 'The cached price is more than 15 minutes old.'
        : 'The timestamp is the provider print time.';
  return `${source} ${timing}`;
}

export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const { key, secret, feed, configured } = credentials();
  if (!configured) {
    throw new Error('Alpaca credentials are not set on the server.');
  }
  const unique = [...new Set(symbols.map((symbol) => symbol.toUpperCase()))].filter(Boolean);
  if (unique.length === 0) return [];
  const url = new URL('https://data.alpaca.markets/v2/stocks/snapshots');
  url.searchParams.set('symbols', unique.join(','));
  url.searchParams.set('feed', feed);
  const response = await fetch(url, {
    headers: { 'APCA-API-KEY-ID': key, 'APCA-API-SECRET-KEY': secret },
  });
  if (!response.ok) {
    throw new Error(`Alpaca returned ${response.status} for snapshots.`);
  }
  const body = await response.json();
  const quotes: Quote[] = [];
  for (const symbol of unique) {
    const snap = body[symbol];
    if (!snap) continue;
    const trade = snap.latestTrade;
    const daily = snap.dailyBar;
    const previous = snap.prevDailyBar;
    const price = typeof trade?.p === 'number' ? trade.p : typeof daily?.c === 'number' ? daily.c : null;
    if (typeof price !== 'number' || price <= 0) continue;
    const pricing = typeof trade?.p === 'number' ? 'exchange_trade' : 'end_of_day';
    const asOf = (trade?.t as string | undefined) ?? (daily?.t as string | undefined);
    if (!asOf) continue;
    const ageMs = Date.now() - new Date(asOf).getTime();
    const stale = Number.isFinite(ageMs) && ageMs > 15 * 60 * 1000;
    const previousClose = typeof previous?.c === 'number' ? previous.c : null;
    const change = previousClose == null ? null : price - previousClose;
    const changePercent = previousClose ? (change! / previousClose) * 100 : null;
    const exchange = trade?.x ? EXCHANGES[trade.x] ?? trade.x : null;
    quotes.push({
      symbol,
      price,
      asOf,
      previousClose,
      change,
      changePercent,
      volume: typeof daily?.v === 'number' ? daily.v : null,
      feed,
      exchange,
      pricing,
      sourceLabel: describe(feed, pricing, stale),
      stale,
      provider: 'alpaca',
    });
  }
  return quotes;
}

export async function fetchBars(symbol: string, range: '1D' | '1M' | '3M' | '1Y') {
  const { key, secret, feed, configured } = credentials();
  if (!configured) throw new Error('Alpaca credentials are not set on the server.');
  const now = new Date();
  const start = new Date(now);
  if (range === '1D') start.setDate(start.getDate() - 2);
  if (range === '1M') start.setMonth(start.getMonth() - 1);
  if (range === '3M') start.setMonth(start.getMonth() - 3);
  if (range === '1Y') start.setFullYear(start.getFullYear() - 1);
  const timeframe = range === '1D' ? '15Min' : '1Day';
  const url = new URL(`https://data.alpaca.markets/v2/stocks/${encodeURIComponent(symbol)}/bars`);
  url.searchParams.set('timeframe', timeframe);
  url.searchParams.set('start', start.toISOString());
  url.searchParams.set('limit', '1000');
  url.searchParams.set('feed', feed);
  url.searchParams.set('adjustment', 'split');
  const response = await fetch(url, {
    headers: { 'APCA-API-KEY-ID': key, 'APCA-API-SECRET-KEY': secret },
  });
  if (!response.ok) throw new Error(`Alpaca returned ${response.status} for bars.`);
  const body = await response.json();
  const bars = (body.bars ?? [])
    .filter((bar: { c?: number; t?: string }) => typeof bar.c === 'number' && typeof bar.t === 'string')
    .map((bar: { c: number; t: string }) => ({ t: bar.t, c: bar.c }));
  const rangeLabel = range === '1D' ? '15-minute bars from the requested feed' : 'Daily closes from the requested feed';
  return { bars, rangeLabel, sourceLabel: describe(feed, range === '1D' ? 'exchange_trade' : 'end_of_day', false) };
}

export async function lookupAsset(symbol: string) {
  const { key, secret, configured } = credentials();
  if (!configured) throw new Error('Alpaca credentials are not set on the server.');
  const response = await fetch(`https://paper-api.alpaca.markets/v2/assets/${encodeURIComponent(symbol)}`, {
    headers: { 'APCA-API-KEY-ID': key, 'APCA-API-SECRET-KEY': secret },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Alpaca returned ${response.status} for the asset lookup.`);
  const asset = await response.json();
  if (asset.status !== 'active' || asset.tradable === false) return null;
  const name = String(asset.name ?? symbol);
  const assetType = /\bETF\b|Index Fund|Trust/i.test(name) ? 'etf' : 'stock';
  return {
    symbol: String(asset.symbol),
    name,
    assetType,
    exchange: asset.exchange ? String(asset.exchange) : null,
  };
}

export const FILL_DISCLOSURE =
  'Simulated fill at the displayed price and timestamp. Stak does not route an order to an exchange or a broker, and this is not an execution.';
