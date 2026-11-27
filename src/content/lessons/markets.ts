import { booleanQuestion, matchQuestion, mcq, type Lesson } from '../types';

export const marketLessons: Lesson[] = [
  {
    id: 'bull-bear',
    title: 'Bull and bear markets',
    category: 'markets',
    minutes: 5,
    premium: true,
    summary: 'Bull and bear are names for long rising and falling stretches. They are labels after the fact, not signals by themselves.',
    sections: [
      {
        heading: 'Names for a long move',
        body: 'A bull market is a long period when prices, often a broad index, trend upward. A bear market is a long period of decline, commonly described as a drop of about 20% from a recent high. The 20% figure is a convention used by commentators. It is not a law, and different people date the start and end differently.',
      },
      {
        heading: 'You usually know the label late',
        body: 'The name is applied by looking backward. On the day a decline begins, nobody can certify that it will become a bear market. A sharp drop can also reverse before it earns the name. Using the words as if they predict the next day overstates what a label can do.',
      },
      {
        heading: 'Indexes, not one stock',
        body: 'People usually attach these words to a broad market, not to a single company. One stock can fall while an index rises. In Stak, index discussion uses funds that track indexes when we have their traded prices. The fund is not the index itself.',
      },
    ],
    scenario: mcq(
      'bull-bear-s',
      'A broad market is down 8% from its high. A headline calls it a bear market. Using the common convention, what is off?',
      [
        'Nothing. Any decline is a bear market',
        'Commentators often reserve “bear market” for a decline around 20%, and even that is a convention',
        'Bear markets only happen to bonds',
        'An 8% drop is required to be permanent',
      ],
      'b',
      'The familiar 20% rule of thumb is a label, and an 8% drop is usually called a correction or a decline, not a bear market.',
    ),
    quiz: [
      mcq(
        'bull-bear-q1',
        'A bull market is:',
        [
          'A long upward stretch in prices',
          'A guaranteed year',
          'A type of bank account',
          'A dividend',
        ],
        'a',
        'It names a rising period. It does not insure the next period.',
      ),
      booleanQuestion(
        'bull-bear-q2',
        'The common 20% bear-market figure is a legal definition that every exchange must follow.',
        false,
        'It is a convention used in market commentary, not a statute.',
      ),
      mcq(
        'bull-bear-q3',
        'Why is the label a weak day-to-day signal?',
        [
          'It is assigned by looking back, after much of the move has happened',
          'Prices never trend',
          'Indexes cannot fall',
          'Labels are prices',
        ],
        'a',
        'You cannot use a backward-looking name as if it were printed on tomorrow’s open.',
      ),
    ],
    takeaways: [
      'Bull and bear name long moves.',
      'The 20% bear figure is a convention.',
      'The label arrives by looking backward.',
    ],
    terms: ['Bull market', 'Bear market', 'Correction'],
  },
  {
    id: 'market-cycles',
    title: 'Market cycles',
    category: 'markets',
    minutes: 5,
    premium: true,
    summary: 'Economies and markets move through expansions and slowdowns. The turns are clearer in history than in real time.',
    sections: [
      {
        heading: 'Expansion and slowdown',
        body: 'A common sketch of a cycle runs from recovery, to expansion, to a peak, to a slowdown or recession, and back. Company profits and employment often rise in expansions and strain in recessions. Markets try to anticipate those shifts, so stock prices can turn before the economic data does.',
      },
      {
        heading: 'Cycles are not clocks',
        body: 'A cycle does not last a fixed number of months. Some expansions are long. Some slowdowns are shallow. Anyone who says the cycle “is due” because a number of years passed is treating history like a timer. Past spacing is not a schedule.',
      },
      {
        heading: 'What a learner can watch',
        body: 'Economic reports, company earnings, and interest rates are the public clues people discuss. None of them rings a bell at the turning point. Learning the words helps you read the news without treating a headline as an instruction.',
      },
    ],
    scenario: mcq(
      'market-cycles-s',
      'An expansion has lasted longer than the previous one. A post says a recession is therefore due next month. What is the error?',
      [
        'Cycles do not have a fixed length, so age alone does not date the next turn',
        'Expansions are illegal after one year',
        'Recessions cannot follow expansions',
        'Markets and the economy are unrelated',
      ],
      'a',
      'Length varies. “Due” language pretends the past interval is a contract.',
    ),
    quiz: [
      booleanQuestion(
        'market-cycles-q1',
        'Stock prices always turn on the same day a recession is officially declared.',
        false,
        'Markets often move before official dates, and official dates are announced late.',
      ),
      mcq(
        'market-cycles-q2',
        'A market cycle is best described as:',
        [
          'A repeating but irregular pattern of stronger and weaker conditions',
          'A clock that rings every four years',
          'A single stock’s dividend',
          'A fee schedule',
        ],
        'a',
        'The pattern is real enough to study and irregular enough to resist a timer.',
      ),
      mcq(
        'market-cycles-q3',
        'Why can share prices fall before a recession shows up in jobs data?',
        [
          'Traders are trying to anticipate future profits',
          'Jobs data are prices',
          'Companies stop existing at the peak',
          'Indexes are required to lead by 30 days',
        ],
        'a',
        'Prices reflect expectations about future results, so they can move first. They can also be wrong.',
      ),
    ],
    takeaways: [
      'Cycles alternate between stronger and weaker conditions.',
      'They are not fixed-length clocks.',
      'Markets can move before the official data.',
    ],
    terms: ['Expansion', 'Recession', 'Cycle'],
  },
  {
    id: 'supply-demand',
    title: 'Supply and demand',
    category: 'markets',
    minutes: 5,
    premium: true,
    summary: 'A traded price is where the shares offered and the shares wanted meet.',
    sections: [
      {
        heading: 'Orders are the supply and the demand',
        body: 'In a stock, “supply” at a moment is the shares sellers are willing to part with at various prices. “Demand” is the shares buyers are willing to take. The last trade is a price where those two sides met. If buyers become more eager, they lift the prices they will pay. If sellers become more eager, they accept less.',
      },
      {
        heading: 'News works through orders',
        body: 'A headline does not edit the price by itself. People read it and change their orders. That is why the same news can move a thin stock more than a heavily traded one: fewer shares are posted, so a modest order walks the price further.',
      },
      {
        heading: 'Illustration',
        body: 'If the only posted seller near the market wants $10 and a buyer agrees, the trade is $10. If that seller leaves and the next seller wants $12, the next trade can be $12 without the company earning a single new dollar that minute.',
        example: 'The $10 and $12 figures are a sketch of an order book, not a quote.',
      },
    ],
    scenario: mcq(
      'supply-demand-s',
      'Many holders decide to sell at once and few new buyers appear. What is the likely immediate effect?',
      [
        'The price they agree tends to fall until buyers are willing to take the shares',
        'The price is required to rise because selling is popular',
        'The company must issue a dividend',
        'Trading stops forever',
      ],
      'a',
      'More supply of shares for sale, with unchanged demand, is resolved at lower prices.',
    ),
    quiz: [
      mcq(
        'supply-demand-q1',
        'A last trade price is:',
        [
          'A price where a buyer and a seller met',
          'The company’s book value',
          'Always yesterday’s close',
          'A tax rate',
        ],
        'a',
        'It is an agreed trade, the meeting point of both sides.',
      ),
      booleanQuestion(
        'supply-demand-q2',
        'A headline changes the official price even if nobody changes an order.',
        false,
        'The price changes when orders and trades change. The headline is only the prompt.',
      ),
      mcq(
        'supply-demand-q3',
        'A thinly traded stock can jump more on a small order because:',
        [
          'Fewer shares are posted near the current price',
          'Thin stocks have fixed prices',
          'Small orders are banned',
          'Market cap equals volume',
        ],
        'a',
        'A thin book means the next posted prices are farther away.',
      ),
    ],
    takeaways: [
      'Price is where orders meet.',
      'News matters when it changes orders.',
      'Thin trading can mean larger jumps.',
    ],
    terms: ['Bid', 'Ask', 'Volume', 'Order'],
  },
  {
    id: 'company-fundamentals',
    title: 'Company fundamentals',
    category: 'markets',
    minutes: 6,
    premium: true,
    summary: 'Fundamentals are the business facts underneath a ticker: what it sells, what it earns, and what it owes.',
    sections: [
      {
        heading: 'The business before the chart',
        body: 'A ticker is a label. The business is the product, the customers, the costs, and the competition. Fundamentals are those facts, usually summarized in financial statements. A chart records what traders paid. It does not, by itself, explain how the company makes money.',
      },
      {
        heading: 'A short list of questions',
        body: 'What does the company sell? Who pays? Are sales growing, shrinking, or flat? After costs, is there profit? How much debt is there relative to the business? Could a new competitor copy the product? Those questions do not produce a “correct” price. They stop you from owning a story you cannot describe.',
      },
      {
        heading: 'Stak’s descriptions',
        body: 'When Stak shows a company description, it is an educational summary of the business, not a rating and not a full filing. If a description is missing, the app will say so. It will not invent a business model to fill the space.',
      },
    ],
    scenario: mcq(
      'company-fundamentals-s',
      'You can recite a stock’s 30-day price path but cannot say what the company sells. What are you missing?',
      [
        'The fundamentals, the business facts behind the ticker',
        'Nothing. The path is the business',
        'The primary market',
        'A dividend guarantee',
      ],
      'a',
      'Price history without the business is only a record of trades.',
    ),
    quiz: [
      mcq(
        'company-fundamentals-q1',
        'Which item is a fundamental question?',
        [
          'How does this company make money?',
          'What color is today’s chart?',
          'How many times did the price tick in one second?',
          'What is the app icon?',
        ],
        'a',
        'Fundamentals start with the business model, not the pixel color of a chart.',
      ),
      booleanQuestion(
        'company-fundamentals-q2',
        'A rising chart replaces the need to know what the company sells.',
        false,
        'The chart is a price record. The business is a separate set of facts.',
      ),
      mcq(
        'company-fundamentals-q3',
        'Debt matters in a fundamental read because:',
        [
          'Lenders are paid before common owners',
          'Debt erases the share count',
          'Debt is a dividend',
          'Only banks have customers',
        ],
        'a',
        'Obligations come ahead of the residual claim that common stock represents.',
      ),
    ],
    takeaways: [
      'Fundamentals are business facts.',
      'A chart is a record of prices, not the business model.',
      'Know the product, the profit, and the obligations.',
    ],
    terms: ['Fundamentals', 'Business model', 'Debt'],
  },
  {
    id: 'financial-statements',
    title: 'Financial statements',
    category: 'markets',
    minutes: 7,
    premium: true,
    summary: 'Three statements answer what a company earned, what it owns, and where cash actually went.',
    sections: [
      {
        heading: 'Income statement',
        body: 'The income statement covers a period, such as a quarter or a year. It starts with revenue, subtracts costs, and arrives at profit. Profit is an accounting measure. It is not the same as cash collected in the period, because some sales are not paid immediately and some expenses are spread over time.',
      },
      {
        heading: 'Balance sheet',
        body: 'The balance sheet is a snapshot on one date. Assets are what the company controls. Liabilities are what it owes. Equity is the residual, assets minus liabilities. Market cap is not the equity line on the balance sheet. One is a market price. The other is an accounting residual.',
      },
      {
        heading: 'Cash flow statement',
        body: 'The cash flow statement groups cash from operations, investing, and financing. A profitable company can still run short of cash if customers pay slowly or if it spends heavily on equipment. Reading profit without cash is an incomplete picture.',
      },
    ],
    scenario: mcq(
      'financial-statements-s',
      'A company reports a profit, but cash from operations is negative. Is that possible?',
      [
        'Yes. Accounting profit and cash collected can diverge',
        'No. Profit is defined as cash in the bank',
        'Only if the statements are fake',
        'Only for ETFs',
      ],
      'a',
      'Timing of payments, inventory, and non-cash expenses can split profit from operating cash.',
    ),
    quiz: [
      matchQuestion(
        'financial-statements-q1',
        'Match each statement to its job.',
        [
          { term: 'Income statement', definition: 'Results over a period, from revenue to profit' },
          { term: 'Balance sheet', definition: 'Assets, liabilities, and equity on one date' },
          { term: 'Cash flow statement', definition: 'Where cash came from and where it went' },
        ],
        'Period results, a dated snapshot, and cash movements are three different questions.',
      ),
      booleanQuestion(
        'financial-statements-q2',
        'The equity line on the balance sheet is the same number as market cap.',
        false,
        'Accounting equity is assets minus liabilities. Market cap is price times shares.',
      ),
      mcq(
        'financial-statements-q3',
        'Revenue sits on which statement?',
        [
          'The income statement',
          'Only the cash flow statement',
          'The dividend calendar',
          'The bid-ask spread',
        ],
        'a',
        'Revenue is the top of the income statement. Cash collections are a related but different figure.',
      ),
    ],
    takeaways: [
      'Income is a period. The balance sheet is a date. Cash flow tracks cash.',
      'Profit and cash can disagree.',
      'Book equity is not market cap.',
    ],
    terms: ['Revenue', 'Profit', 'Asset', 'Liability', 'Equity'],
  },
  {
    id: 'pe-ratio',
    title: 'Price-to-earnings ratios',
    category: 'markets',
    minutes: 6,
    premium: true,
    summary: 'A P/E ratio compares the share price with earnings per share. It is a comparison, not a verdict.',
    sections: [
      {
        heading: 'The fraction',
        body: 'Price-to-earnings divides the current share price by earnings per share. A teaching example: a $40 share and $2 of earnings per share is a P/E of 20. You are looking at a price equal to 20 years of those earnings, if earnings never changed. Earnings do change, so the “years” picture is only a way to feel the size of the ratio.',
        example: 'Illustration: $40 / $2 = 20. Not a live ratio.',
      },
      {
        heading: 'Trailing and forward',
        body: 'A trailing P/E uses earnings that were already reported. A forward P/E uses estimates of future earnings. Estimates can be wrong. A low trailing P/E can mean a low price, or it can mean earnings that are about to fall. A high P/E can mean high expectations. Neither number says “buy” or “avoid” by itself.',
      },
      {
        heading: 'Compare like with like',
        body: 'A software company and a utility often carry different typical ratios because their growth and stability differ. Comparing a P/E across very different businesses, or using a ratio when earnings are near zero, misleads. Stak’s market feed may not include P/E at all. If it does not, the app will not invent one.',
      },
    ],
    scenario: mcq(
      'pe-ratio-s',
      'Company A has a P/E of 12 and Company B has a P/E of 30. A post says A is automatically the better investment. What is missing?',
      [
        'The ratio does not say why earnings or expectations differ',
        'The lower number is always required to win',
        'P/E is a dividend',
        'Company B’s ratio is impossible',
      ],
      'a',
      'A lower P/E is a cheaper price relative to the earnings figure used. It is not a full comparison of the businesses.',
    ),
    quiz: [
      mcq(
        'pe-ratio-q1',
        'P/E equals:',
        [
          'Share price / earnings per share',
          'Revenue / debt',
          'Dividend / interest rate',
          'Assets / employees',
        ],
        'a',
        'The name is literal: price compared with earnings.',
      ),
      booleanQuestion(
        'pe-ratio-q2',
        'A forward P/E uses earnings that have already been reported.',
        false,
        'Forward uses estimates. Trailing uses reported earnings.',
      ),
      mcq(
        'pe-ratio-q3',
        'A P/E near zero earnings is hard to use because:',
        [
          'Dividing by a tiny earnings number makes the ratio unstable or meaningless',
          'The formula forbids prices',
          'Utilities cannot have earnings',
          'Ratios only work on ETFs',
        ],
        'a',
        'The denominator is the problem. Tiny or negative earnings break the simple reading.',
      ),
    ],
    takeaways: [
      'P/E compares price with earnings per share.',
      'Trailing is history. Forward is an estimate.',
      'The ratio is not a buy or sell label.',
    ],
    terms: ['P/E ratio', 'Earnings per share', 'Trailing', 'Forward'],
  },
  {
    id: 'revenue-earnings',
    title: 'Revenue and earnings',
    category: 'markets',
    minutes: 5,
    premium: true,
    summary: 'Revenue is what customers are billed. Earnings are what remains after costs. Growing sales can still lose money.',
    sections: [
      {
        heading: 'Top line and bottom line',
        body: 'Revenue, the top line, is the value of goods and services sold. Earnings, the bottom line, are what is left after the costs of running and financing the business. A company can grow revenue and still lose money if costs grow faster. It can also grow earnings while revenue is flat, by spending less.',
      },
      {
        heading: 'Margins connect them',
        body: 'A margin is earnings as a fraction of revenue. A 10% profit margin on $100 of revenue is $10 of profit in a simple illustration. Margins let you compare profitability without being fooled by company size. They still need context: a grocery business and a software business do not live at the same margin.',
        example: 'Illustration: $100 revenue × 10% margin = $10 profit. Not a reported result.',
      },
      {
        heading: 'Per share',
        body: 'Earnings per share divides earnings by the share count. If the company issues many new shares, earnings can rise while earnings per share do not. Owners care about the claim per share, not only the company’s total profit.',
      },
    ],
    scenario: mcq(
      'revenue-earnings-s',
      'Revenue rose 20% and profit fell. Which explanation fits the statements?',
      [
        'Costs rose even faster than sales',
        'Revenue and profit are the same number',
        'The income statement forbids this',
        'Margins must have doubled',
      ],
      'a',
      'Profit is revenue minus costs. Faster cost growth can shrink profit while sales rise.',
    ),
    quiz: [
      booleanQuestion(
        'revenue-earnings-q1',
        'Revenue is another word for profit.',
        false,
        'Revenue is the top line. Profit is what remains after costs.',
      ),
      mcq(
        'revenue-earnings-q2',
        'A profit margin is:',
        [
          'Profit divided by revenue',
          'Revenue divided by the share price',
          'Cash divided by debt',
          'The bid minus the ask',
        ],
        'a',
        'Margin expresses profit as a share of sales.',
      ),
      mcq(
        'revenue-earnings-q3',
        'Earnings per share can fail to rise even when total earnings rise if:',
        [
          'The company issued enough new shares',
          'The price is unchanged',
          'Revenue is a liability',
          'Margins are a type of bond',
        ],
        'a',
        'More shares split the profit into smaller claims per share.',
      ),
    ],
    takeaways: [
      'Revenue is sales. Earnings are sales minus costs.',
      'Margins put profit in proportion to sales.',
      'Watch per-share results when the share count changes.',
    ],
    terms: ['Revenue', 'Earnings', 'Margin', 'EPS'],
  },
  {
    id: 'economic-indicators',
    title: 'Economic indicators',
    category: 'markets',
    minutes: 6,
    premium: true,
    summary: 'Indicators are public measurements of the economy. They describe the backdrop. They do not dictate a trade.',
    sections: [
      {
        heading: 'A few you will see in headlines',
        body: 'Inflation measures how fast prices of goods and services are rising. The unemployment rate measures the share of the labor force without a job and looking for one. Gross domestic product tracks the value of production. Interest-rate decisions by a central bank change the cost of borrowing in the banking system. Each series has a definition and a release calendar.',
      },
      {
        heading: 'Leading, coincident, lagging',
        body: 'Some series tend to move earlier, some alongside the economy, and some after turns are already underway. The categories are tendencies, not rules. A single strong report can be revised later. First prints of data are often updated.',
      },
      {
        heading: 'How not to use them',
        body: 'An indicator is a measurement of the past or the present, published on a delay. Markets may already have reacted by the time you read a summary. Learning the definition helps you understand the sentence. It does not turn the sentence into a personal instruction to buy or sell.',
      },
    ],
    scenario: mcq(
      'economic-indicators-s',
      'A hot inflation report is released. An app tells every user to sell stocks. What is the educational problem?',
      [
        'A statistic is not a personal trade instruction, and the market may already have moved',
        'Inflation figures are secret',
        'Unemployment is the same thing as inflation',
        'Indicators are illegal to read',
      ],
      'a',
      'The report is context. A blanket instruction ignores the person’s situation and pretends the number has one market response.',
    ),
    quiz: [
      matchQuestion(
        'economic-indicators-q1',
        'Match the indicator.',
        [
          { term: 'Inflation', definition: 'How fast a basket of prices is rising' },
          { term: 'Unemployment rate', definition: 'The share of the labor force without a job and seeking one' },
          { term: 'GDP', definition: 'A measure of the value of production' },
        ],
        'Each series answers a different question about the economy.',
      ),
      booleanQuestion(
        'economic-indicators-q2',
        'The first release of an economic series is never revised.',
        false,
        'Many series are revised as more complete data arrives.',
      ),
      mcq(
        'economic-indicators-q3',
        'A useful way to treat an indicator is:',
        [
          'As context with a definition, a date, and no personal order attached',
          'As a required trade',
          'As a dividend',
          'As a replacement for company financials',
        ],
        'a',
        'Definitions and dates keep the number honest. They do not pick a security for you.',
      ),
    ],
    takeaways: [
      'Indicators measure the economy, each with its own definition.',
      'First releases can be revised.',
      'A statistic is context, not an order.',
    ],
    terms: ['Inflation', 'Unemployment rate', 'GDP', 'Central bank'],
  },
];
