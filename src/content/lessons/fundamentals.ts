import { booleanQuestion, matchQuestion, mcq, type Lesson } from '../types';

export const fundamentalLessons: Lesson[] = [
  {
    id: 'stock-market',
    title: 'What is the stock market?',
    category: 'fundamentals',
    minutes: 5,
    premium: false,
    summary: 'The stock market is the network of venues where people trade shares of companies.',
    sections: [
      {
        heading: 'Ownership, traded',
        body: 'A share is a piece of ownership in a company. The stock market is not a single building. It is the set of exchanges and electronic venues where buyers and sellers trade those shares. Prices you see are records of trades and quotes, not a promise of what the next trade will be.',
      },
      {
        heading: 'Why people use it',
        body: 'Companies can raise money by selling new shares. After that, investors trade existing shares with each other. Someone buys because they want ownership. Someone sells because they want cash, or because they no longer want that ownership. The market matches those two sides.',
      },
      {
        heading: 'What it is not',
        body: 'A brokerage account is not a savings account. Share prices move, and you can get back less than you put in. Stak lets you practice with virtual cash so you can see that movement without sending a real order.',
      },
    ],
    scenario: mcq(
      'stock-market-s',
      'A friend says the stock market is a place where the company pays you a fixed amount every year, like a savings bond. What is the accurate response?',
      [
        'That is right. Shares pay a guaranteed yearly amount.',
        'Shares are ownership. Any cash the company pays is not guaranteed, and the sale price can fall.',
        'The market only exists so companies can buy their own products.',
        'Prices are set once a year by the government.',
      ],
      'b',
      'Stocks are ownership claims. Dividends and prices can change. They are not a promised fixed payment.',
    ),
    quiz: [
      booleanQuestion(
        'stock-market-q1',
        'The stock market is one physical room where every US trade happens.',
        false,
        'Trading happens across electronic venues and exchanges. There is no single room that is “the market.”',
      ),
      mcq(
        'stock-market-q2',
        'After a company has already sold new shares, later trades of those shares are mostly between:',
        [
          'The company and a bank only',
          'Investors who already hold or want the shares',
          'The tax authority and the exchange',
          'Employees and customers of the store',
        ],
        'b',
        'In the secondary market, investors trade existing shares with each other. The company does not receive the cash from those later trades.',
      ),
      mcq(
        'stock-market-q3',
        'A displayed share price is best described as:',
        [
          'A government-guaranteed value',
          'The amount of cash inside the company',
          'A record of trading interest, such as a recent trade or quote',
          'The company’s profit this year',
        ],
        'c',
        'A price is a market record. It is not the company’s cash balance and it is not a guarantee.',
      ),
    ],
    takeaways: [
      'A share is a unit of ownership.',
      'Markets match buyers and sellers across venues.',
      'Prices can fall. They are not promised payments.',
    ],
    terms: ['Share', 'Exchange', 'Broker'],
  },
  {
    id: 'how-stocks-work',
    title: 'How do stocks work?',
    category: 'fundamentals',
    minutes: 6,
    premium: false,
    summary: 'Buying a stock means buying a claim on part of a company, including its uncertain future results.',
    sections: [
      {
        heading: 'What you actually own',
        body: 'Common stock is a residual claim. Lenders and other obligations are ahead of common shareholders. If the business does well, owners may benefit through a higher trading price or through dividends. If it does poorly, the claim can be worth much less.',
      },
      {
        heading: 'Why a price changes',
        body: 'A trade happens when a buyer and seller agree. News, earnings, interest rates, and simple shifts in how many people want to buy or sell can all change that agreement. The price does not change because a chart “wants” to go up. It changes because orders do.',
      },
      {
        heading: 'A tiny illustration',
        body: 'Suppose a company has 100 shares and you buy 1. You own 1% of the equity, not 1% of the office furniture in a way you can take home. You own a financial claim. The illustration is about the fraction of ownership, not a forecast.',
        example: '1 share out of 100 is a 1% ownership claim. It is not a promise that the claim will rise in price.',
      },
    ],
    scenario: mcq(
      'how-stocks-work-s',
      'You own shares and the company has a bad year. Which statement fits how common stock works?',
      [
        'The exchange must refund your purchase.',
        'Your ownership claim can become less valuable because you are paid after other obligations.',
        'Your shares convert into a loan the company must repay you.',
        'The price is frozen until the company recovers.',
      ],
      'b',
      'Common shareholders are last in line. A weak business can reduce what buyers will pay for the shares.',
    ),
    quiz: [
      booleanQuestion(
        'how-stocks-work-q1',
        'Owning common stock means the company owes you a fixed repayment date.',
        false,
        'A loan has a repayment claim. Common stock is ownership, not a dated IOU.',
      ),
      mcq(
        'how-stocks-work-q2',
        'The most direct reason a last trade price changes is:',
        [
          'A new trade is agreed at a different price',
          'The logo of the company changes',
          'The market closes for lunch',
          'A chart pattern completes itself',
        ],
        'a',
        'Prices printed on a tape are trades or quotes. A new agreed price is what updates the last trade.',
      ),
      matchQuestion(
        'how-stocks-work-q3',
        'Match each idea to its meaning.',
        [
          { term: 'Common stock', definition: 'Ownership claim paid after other obligations' },
          { term: 'Last trade', definition: 'The most recent price buyers and sellers agreed' },
          { term: 'Dividend', definition: 'Cash a company may choose to pay owners' },
        ],
        'Stock is ownership, a last trade is an agreed price, and a dividend is an optional cash distribution.',
      ),
    ],
    takeaways: [
      'Stock is an ownership claim, not a loan.',
      'Prices update when new trades or quotes happen.',
      'A bad business outcome can reduce what the claim is worth.',
    ],
    terms: ['Common stock', 'Last trade', 'Dividend'],
  },
  {
    id: 'etfs',
    title: 'What are ETFs?',
    category: 'fundamentals',
    minutes: 6,
    premium: false,
    summary: 'An ETF is a fund whose shares trade through the day, often holding a basket of investments.',
    sections: [
      {
        heading: 'A basket with a ticker',
        body: 'ETF means exchange-traded fund. The fund holds a collection of assets. You buy and sell shares of the fund on an exchange, much like a stock. One share does not mean you picked each company inside the basket yourself. It means you own a share of the fund.',
      },
      {
        heading: 'ETF and index fund are not synonyms',
        body: 'An index fund tracks a published list of securities, such as a large-cap stock index. That fund can be structured as an ETF or as a traditional mutual fund. A mutual fund is usually priced once a day. An ETF trades whenever its venue is open. Some ETFs do not track a broad index at all.',
      },
      {
        heading: 'What the price is telling you',
        body: 'The ETF share price is a market price for the fund share. It is related to the value of the holdings, but it is still a traded price. Stak will only show a price when the data provider returns one, and it will name the feed and the time.',
      },
    ],
    scenario: mcq(
      'etfs-s',
      'Someone says, “Every index fund is an ETF, so they all trade all day.” What should you correct?',
      [
        'Nothing. The words mean the same thing.',
        'An index fund can be an ETF or a mutual fund. Only the ETF version trades through the day.',
        'ETFs are priced once a month.',
        'Index funds hold only one company.',
      ],
      'b',
      'Index tracking describes the strategy. ETF describes a traded fund structure. They overlap, but they are not the same word.',
    ),
    quiz: [
      mcq(
        'etfs-q1',
        'Buying one share of a broad stock ETF usually means:',
        [
          'You bought a single company',
          'You bought a share of a fund that holds many securities',
          'You lent money to the exchange',
          'You are guaranteed the index’s past return',
        ],
        'b',
        'The ETF share is a claim on the fund. The fund, not you directly, holds the basket.',
      ),
      booleanQuestion(
        'etfs-q2',
        'A traditional mutual fund and an ETF are priced in exactly the same way during the day.',
        false,
        'Mutual funds are commonly priced once a day. ETF shares trade through the session.',
      ),
      matchQuestion(
        'etfs-q3',
        'Match the term to the description.',
        [
          { term: 'ETF', definition: 'A fund whose shares trade on an exchange' },
          { term: 'Index fund', definition: 'A fund that tracks a published list of securities' },
          { term: 'Mutual fund', definition: 'A pooled fund commonly priced once a day' },
        ],
        'Structure and strategy are different ideas. An index fund can use more than one structure.',
      ),
    ],
    takeaways: [
      'An ETF is a traded share of a fund.',
      'Index fund describes a strategy, not a trading schedule.',
      'Past index results are not a promise for the fund’s future.',
    ],
    terms: ['ETF', 'Index fund', 'Mutual fund'],
  },
  {
    id: 'dividends',
    title: 'What are dividends?',
    category: 'fundamentals',
    minutes: 5,
    premium: true,
    summary: 'A dividend is cash a company chooses to pay to shareholders. It is not extra free value.',
    sections: [
      {
        heading: 'A distribution, not a bonus from nowhere',
        body: 'When a company pays a dividend, it sends cash from the business to its owners. That cash is no longer inside the company. On the ex-dividend date, the share price often opens lower by about the dividend if nothing else changed, because new buyers will not receive that payment.',
      },
      {
        heading: 'Not every company pays one',
        body: 'Some companies keep earnings to reinvest. Some pay regularly. A dividend can be cut if the business weakens. A high dividend yield is not, by itself, a sign that a company is safer.',
      },
      {
        heading: 'Illustration',
        body: 'Imagine a $50 share and a $1 dividend. If nothing else about the business changed, a rough textbook adjustment is a $49 share plus $1 cash to the owner who was entitled to the dividend. Real markets also move for many other reasons at the same time.',
        example: 'This $50 to $49 sketch is a teaching example, not a quote and not a prediction.',
      },
    ],
    scenario: mcq(
      'dividends-s',
      'A share is about to go ex-dividend for $1. A classmate says the $1 is free money on top of an unchanged share price. What is the better explanation?',
      [
        'The cash leaves the company, so the share is often worth about $1 less, all else equal.',
        'The exchange adds $1 to the price as a reward.',
        'Dividends are interest on a loan.',
        'Only bondholders receive dividends.',
      ],
      'a',
      'The dividend is a transfer of value from the company to the shareholder, not new value created at the opening auction.',
    ),
    quiz: [
      booleanQuestion(
        'dividends-q1',
        'A company is required to raise its dividend every year.',
        false,
        'Dividends are declared by the company. They can stay flat, rise, or be cut.',
      ),
      mcq(
        'dividends-q2',
        'All else equal, paying a dividend does which of these?',
        [
          'Moves cash from the company to shareholders',
          'Increases the company’s cash',
          'Erases the shareholder’s ownership',
          'Sets the share price for the next year',
        ],
        'a',
        'The company distributes cash it already had. Ownership remains, but the company holds less cash.',
      ),
      mcq(
        'dividends-q3',
        'A high dividend yield by itself tells you:',
        [
          'The company is safe',
          'The price will rise',
          'Only that the latest dividend is large relative to the current price',
          'The shares are a savings account',
        ],
        'c',
        'Yield is a ratio. It does not settle the question of business quality or future payments.',
      ),
    ],
    takeaways: [
      'Dividends move cash from the company to owners.',
      'They can be reduced or skipped.',
      'A yield is a ratio, not a safety rating.',
    ],
    terms: ['Dividend', 'Ex-dividend date', 'Yield'],
  },
  {
    id: 'compound-growth',
    title: 'What is compound growth?',
    category: 'fundamentals',
    minutes: 6,
    premium: true,
    summary: 'Compounding means growth applied to earlier growth. In markets, that growth is not promised.',
    sections: [
      {
        heading: 'Growth on top of growth',
        body: 'If a balance earns a return, and that return stays invested, the next period’s return is calculated on a larger base. That is compounding. The arithmetic is the same idea as compound interest, but a stock portfolio does not have a stated interest rate.',
      },
      {
        heading: 'Why time matters in the math',
        body: 'A hypothetical account that grows 8% every year from $1,000 reaches about $2,159 after 10 years. The extra beyond a simple 10 × 8% comes from returns earned on earlier returns. The 8% is an illustration. A real portfolio can lose money in a year, and many years will not match a smooth rate.',
        example: 'Illustration only: $1,000 × 1.08^10 ≈ $2,159. This is not a forecast.',
      },
      {
        heading: 'What compounding cannot do',
        body: 'Compounding does not remove the chance of loss. Fees, taxes, and a sequence of bad returns all change the result. A smooth chart in a textbook is a model, not a memory of a guaranteed product.',
      },
    ],
    scenario: mcq(
      'compound-growth-s',
      'Two illustrations start at $1,000. One earns a hypothetical 5% and withdraws the gain each year. The other leaves the gain invested at the same hypothetical 5%. After many years, why can the second be larger?',
      [
        'Because later returns apply to a bigger balance',
        'Because the market is required to pay 5%',
        'Because withdrawn gains are illegal',
        'Because prices cannot fall in the second account',
      ],
      'a',
      'Leaving gains invested is what lets later growth apply to earlier growth. The 5% is still only a model.',
    ),
    quiz: [
      booleanQuestion(
        'compound-growth-q1',
        'A stock portfolio has a contractual compound interest rate like a bank CD.',
        false,
        'Stocks do not promise a rate. Compounding describes a pattern of reinvested returns, which can be negative.',
      ),
      mcq(
        'compound-growth-q2',
        'In a smooth positive illustration, compounding is larger than “rate × years” mainly because:',
        [
          'Each period’s gain can earn its own later gain',
          'The exchange adds a bonus',
          'Inflation is always zero',
          'Shares stop trading',
        ],
        'a',
        'The base grows, so the same percentage is applied to more money. Real years are not smooth.',
      ),
      mcq(
        'compound-growth-q3',
        'Which statement is accurate?',
        [
          'Compounding guarantees a profit if you wait long enough',
          'A long holding period removes the need to understand risk',
          'Reinvested gains can compound, and losses can compound in the other direction',
          'Compounding only applies to cash under a mattress',
        ],
        'c',
        'The math works for negative returns too. A loss reduces the base that future returns apply to.',
      ),
    ],
    takeaways: [
      'Compounding is growth on earlier growth.',
      'Market returns are not a stated interest rate.',
      'Time helps the math only when the returns are actually earned.',
    ],
    terms: ['Compounding', 'Return', 'Principal'],
  },
  {
    id: 'market-cap',
    title: 'What is market capitalization?',
    category: 'fundamentals',
    minutes: 5,
    premium: true,
    summary: 'Market cap is the share price multiplied by the number of shares. It is not the cash in the company.',
    sections: [
      {
        heading: 'The quick definition',
        body: 'Market capitalization is price times shares outstanding. If a teaching example uses a $20 price and 1 billion shares, the market cap is $20 billion. That number is the market’s current price tag for the equity, not a count of money sitting in a bank account.',
        example: 'Illustration: $20 × 1,000,000,000 shares = $20 billion. Not a live quote.',
      },
      {
        heading: 'Large, mid, and small',
        body: 'People sort companies into large-cap, mid-cap, and small-cap ranges. The ranges are conventions, not laws of nature. A larger market cap usually means a bigger equity price tag. It does not automatically mean a safer business or a better future return.',
      },
      {
        heading: 'What it leaves out',
        body: 'Market cap ignores debt. Enterprise value is a different concept that considers debt and cash. A company can have a modest market cap and a large loan, or the reverse. Looking at only the market cap misses that capital structure.',
      },
    ],
    scenario: mcq(
      'market-cap-s',
      'A company’s share price falls 10% and the share count stays the same. What happens to market cap?',
      [
        'It falls about 10% because price is one of the two inputs',
        'It stays the same because the company still exists',
        'It becomes equal to this year’s profit',
        'It can only change when the company sells new shares',
      ],
      'a',
      'Market cap moves with price and with the number of shares. A 10% price drop, share count unchanged, is about a 10% smaller market cap.',
    ),
    quiz: [
      mcq(
        'market-cap-q1',
        'Market cap equals:',
        [
          'Share price × shares outstanding',
          'Revenue × profit margin',
          'Cash minus debt',
          'Dividend × number of employees',
        ],
        'a',
        'The definition is price times share count. Profit and cash are different measures.',
      ),
      booleanQuestion(
        'market-cap-q2',
        'Market cap is the amount of cash the company currently holds.',
        false,
        'Cash is on the balance sheet. Market cap is a market price for the equity.',
      ),
      mcq(
        'market-cap-q3',
        'Two companies have the same market cap. What can you conclude?',
        [
          'They have the same debt',
          'They will have the same return next year',
          'Their equity has the same current price tag, and little else for certain',
          'They are in the same industry',
        ],
        'c',
        'Equal market caps do not settle debt, industry, or future results.',
      ),
    ],
    takeaways: [
      'Market cap = price × shares.',
      'It is a price tag, not a cash balance.',
      'Debt is a separate fact.',
    ],
    terms: ['Market cap', 'Shares outstanding', 'Enterprise value'],
  },
  {
    id: 'stock-prices',
    title: 'Understanding stock prices',
    category: 'fundamentals',
    minutes: 6,
    premium: true,
    summary: 'A price can mean a last trade, a bid, or an ask. Those are not the same number, and one feed is not the whole market.',
    sections: [
      {
        heading: 'Bid, ask, and last',
        body: 'The bid is the highest price a buyer is currently posting. The ask is the lowest price a seller is posting. The last trade is the price of the most recent deal. A chart often plots one of these, not all three. The gap between bid and ask is the spread.',
      },
      {
        heading: 'Feeds are not interchangeable',
        body: 'US stocks trade on more than one venue. A consolidated tape tries to combine them. An exchange-specific feed, such as IEX, shows that venue only. Stak will name the feed it actually received. An IEX price must not be described as the full US consolidated market.',
      },
      {
        heading: 'Time belongs next to the number',
        body: 'A price without a timestamp is incomplete. Delayed, end-of-day, and exchange-specific prices can all be useful for learning, as long as the label is honest. Stak will not fill a simulated trade without a provider price and a timestamp.',
      },
    ],
    scenario: mcq(
      'stock-prices-s',
      'An app shows $100 from an IEX feed at 10:41. Another app shows $100.15 from a consolidated feed a minute later. What is a careful reading?',
      [
        'One of the apps invented a number',
        'They can both be real records of different feeds and times',
        'The higher number is always the official daily value',
        'Prices cannot differ across venues',
      ],
      'b',
      'Different feeds and timestamps can print different prices. The label and the clock tell you what you are looking at.',
    ),
    quiz: [
      matchQuestion(
        'stock-prices-q1',
        'Match each price word.',
        [
          { term: 'Bid', definition: 'A posted price where a buyer is willing to buy' },
          { term: 'Ask', definition: 'A posted price where a seller is willing to sell' },
          { term: 'Last', definition: 'The price of the most recent trade' },
        ],
        'Bid and ask are quotes. Last is a trade that already happened.',
      ),
      booleanQuestion(
        'stock-prices-q2',
        'An IEX price is the same thing as consolidated US market data.',
        false,
        'IEX is one exchange. Consolidated data combines venues. Stak must not relabel one as the other.',
      ),
      mcq(
        'stock-prices-q3',
        'Before you treat a number as “the” price, you also need:',
        [
          'The company logo',
          'The feed and the timestamp',
          'Yesterday’s weather',
          'A prediction for next year',
        ],
        'b',
        'Feed and time tell you what the number represents. Without them, the number is easy to misread.',
      ),
    ],
    takeaways: [
      'Bid, ask, and last are different.',
      'Name the feed. Do not upgrade IEX into “the whole market.”',
      'Keep the timestamp with the price.',
    ],
    terms: ['Bid', 'Ask', 'Spread', 'Consolidated tape'],
  },
  {
    id: 'primary-secondary',
    title: 'Primary versus secondary markets',
    category: 'fundamentals',
    minutes: 5,
    premium: true,
    summary: 'The primary market is where new securities are created. The secondary market is where investors trade them afterward.',
    sections: [
      {
        heading: 'Primary: the company raises money',
        body: 'In a primary offering, such as an IPO or a later share sale, the issuer sells new securities. The cash from that sale goes to the issuer, minus fees. Buyers receive newly created shares.',
      },
      {
        heading: 'Secondary: investors trade with each other',
        body: 'Most of what people call “the stock market” day to day is secondary trading. You buy shares from another investor. The company does not receive that cash. The exchange or venue provides the mechanism. Your broker is the firm that carries your account. Stak is neither.',
      },
      {
        heading: 'Why the distinction matters',
        body: 'A rising secondary price does not send new cash into the company’s bank account. It can still matter to the company later, because a higher price can affect future fundraising, employee stock, and acquisitions. But today’s trade between two investors is not itself a deposit into the company.',
      },
    ],
    scenario: mcq(
      'primary-secondary-s',
      'You buy 10 shares of a long-listed company in a normal brokerage account. Where does your cash go?',
      [
        'To the company, as if it were a new share sale',
        'To the selling shareholder, through the market’s settlement process',
        'To the regulator, as a tax',
        'It stays in your account and the shares are only a picture',
      ],
      'b',
      'A normal trade in a listed stock is secondary. You pay the seller, not the company.',
    ),
    quiz: [
      mcq(
        'primary-secondary-q1',
        'An IPO is an example of:',
        [
          'The primary market',
          'A secondary trade between two funds only',
          'A dividend',
          'A bond coupon',
        ],
        'a',
        'The issuer creates and sells new shares in the primary market.',
      ),
      booleanQuestion(
        'primary-secondary-q2',
        'When you buy shares on an exchange years after the IPO, the company typically receives the cash from your purchase.',
        false,
        'That purchase is a secondary trade. The seller receives the proceeds.',
      ),
      mcq(
        'primary-secondary-q3',
        'Stak’s simulator is:',
        [
          'A primary offering of Stak shares',
          'A secondary-market practice book that does not send orders',
          'A broker that holds customer securities',
          'An exchange',
        ],
        'b',
        'Virtual trades are educational records. No issuer, broker, or exchange receives an order from Stak.',
      ),
    ],
    takeaways: [
      'Primary sales raise money for the issuer.',
      'Secondary trades move shares between investors.',
      'A practice fill in Stak is not either of those real events.',
    ],
    terms: ['Primary market', 'Secondary market', 'IPO'],
  },
];
