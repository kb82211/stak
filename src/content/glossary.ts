export type GlossaryEntry = {
  term: string;
  definition: string;
};

export const glossary: GlossaryEntry[] = [
  { term: 'Share', definition: 'A unit of ownership in a company or a fund.' },
  { term: 'Common stock', definition: 'The usual ownership claim in a company, paid after lenders and other obligations.' },
  { term: 'Broker', definition: 'A firm that carries a customer’s account and routes real orders. Stak is not a broker.' },
  { term: 'Exchange', definition: 'A venue where securities are quoted and traded.' },
  { term: 'ETF', definition: 'A fund whose shares trade on an exchange during the session.' },
  { term: 'Index fund', definition: 'A fund that tracks a published list of securities. It can be an ETF or a mutual fund.' },
  { term: 'Mutual fund', definition: 'A pooled fund that is commonly priced once a day rather than traded all session.' },
  { term: 'Dividend', definition: 'Cash a company may distribute to owners. It is not guaranteed.' },
  { term: 'Ex-dividend date', definition: 'The date when new buyers are no longer entitled to the upcoming dividend.' },
  { term: 'Yield', definition: 'A payment divided by price. A dividend yield is the dividend relative to the share price.' },
  { term: 'Market cap', definition: 'Share price multiplied by shares outstanding. It is not the cash in the company.' },
  { term: 'Shares outstanding', definition: 'The number of shares the company has issued and not retired.' },
  { term: 'Enterprise value', definition: 'A value measure that considers debt and cash, not equity price alone.' },
  { term: 'Bid', definition: 'A posted price at which a buyer is willing to buy.' },
  { term: 'Ask', definition: 'A posted price at which a seller is willing to sell.' },
  { term: 'Spread', definition: 'The gap between the bid and the ask.' },
  { term: 'Last trade', definition: 'The price of the most recent completed trade.' },
  { term: 'Consolidated tape', definition: 'A feed that combines trades from multiple US venues. One exchange’s feed is not the tape.' },
  { term: 'Primary market', definition: 'Where a new security is created and sold by the issuer.' },
  { term: 'Secondary market', definition: 'Where investors trade securities that already exist.' },
  { term: 'IPO', definition: 'An initial public offering, a company’s first sale of shares to the public.' },
  { term: 'Diversification', definition: 'Spreading exposure so one outcome is not the whole portfolio.' },
  { term: 'Idiosyncratic risk', definition: 'Risk tied to one company or one bet, rather than the whole market.' },
  { term: 'Market risk', definition: 'Risk that many holdings fall together.' },
  { term: 'Asset allocation', definition: 'The mix of asset types, such as stocks, bonds, and cash.' },
  { term: 'Equity', definition: 'Ownership. In a company, equity is what remains after liabilities.' },
  { term: 'Bond', definition: 'A loan packaged as a security. The issuer owes interest and, usually, repayment.' },
  { term: 'Coupon', definition: 'The stated interest payment on a bond.' },
  { term: 'Volatility', definition: 'How widely a value swings. It describes the path, not a guaranteed loss.' },
  { term: 'Expected return', definition: 'A probability-weighted idea of return. It is not the return you will receive.' },
  { term: 'Compounding', definition: 'Growth applied to earlier growth, or interest applied to earlier interest.' },
  { term: 'Principal', definition: 'The starting amount of money, before interest or return.' },
  { term: 'Revenue', definition: 'The value of goods and services sold. It is not profit.' },
  { term: 'Earnings', definition: 'What remains of revenue after costs. Also called profit.' },
  { term: 'EPS', definition: 'Earnings per share, profit divided by the share count.' },
  { term: 'Margin', definition: 'In this app, profit as a fraction of revenue. The word has other meanings in brokerage.' },
  { term: 'P/E ratio', definition: 'Share price divided by earnings per share. A comparison, not a verdict.' },
  { term: 'Inflation', definition: 'How fast a basket of prices is rising, which reduces what cash can buy.' },
  { term: 'Liquidity', definition: 'How readily something can be turned into cash near the price you see.' },
  { term: 'Budget', definition: 'A plan for where income will go before it is spent.' },
  { term: 'Emergency fund', definition: 'Cash set aside for a surprise so you are not forced to borrow or sell.' },
  { term: 'APR', definition: 'Annual percentage rate, a standardized yearly way to quote borrowing cost.' },
  { term: 'Credit utilization', definition: 'How much of a credit limit is in use. High use can pressure a credit score.' },
  { term: 'Time horizon', definition: 'When you expect to need the money.' },
  { term: 'Drawdown', definition: 'A decline from a prior high. It describes a fall, not what happens next.' },
  { term: 'Rebalancing', definition: 'Returning a portfolio toward a chosen mix after prices change the weights.' },
  { term: 'Paper trading', definition: 'A simulated trade with virtual cash. No order is sent and no security is delivered.' },
];

export function glossaryEntry(term: string) {
  return glossary.find((entry) => entry.term.toLowerCase() === term.toLowerCase());
}
