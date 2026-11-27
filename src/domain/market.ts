export type PricingMethod = 'exchange_trade' | 'end_of_day';

export function describeMarketData(input: {
  feed: string;
  pricing: PricingMethod;
  stale: boolean;
}) {
  const feed =
    input.feed === 'iex'
      ? 'IEX exchange-specific data. This is not consolidated US market data.'
      : input.feed === 'sip'
        ? 'SIP consolidated tape data.'
        : `${input.feed} data from the connected provider.`;

  const timing =
    input.pricing === 'end_of_day'
      ? 'The price is an end-of-day close, not a live quote.'
      : input.stale
        ? 'The cached price is more than 15 minutes old.'
        : 'The timestamp is the provider’s print time.';

  return `${feed} ${timing}`;
}

export const SIMULATED_FILL_DISCLOSURE =
  'Simulated fill at the displayed price and timestamp. Stak does not route an order to an exchange or a broker, and this is not an execution.';
