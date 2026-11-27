import { booleanQuestion, mcq, type Lesson } from '../types';

export const portfolioLessons: Lesson[] = [
  {
    id: 'diversification',
    title: 'Diversification',
    category: 'portfolio',
    minutes: 6,
    premium: false,
    summary: 'Diversification is spreading exposure so one company’s outcome is not the whole result.',
    sections: [
      {
        heading: 'The idea in one sentence',
        body: 'If you own one company, that company’s news is your portfolio’s news. If you own many companies that do not move in lockstep, a setback in one is a smaller part of the total. Diversification reduces idiosyncratic risk, the risk that belongs to one company. It does not remove market risk, the risk that many assets fall together.',
      },
      {
        heading: 'More tickers is not automatically more diverse',
        body: 'Ten software companies can still be one economic bet. Diversity is about different drivers: businesses, sectors, and sometimes asset types such as stocks and bonds. An ETF can hold hundreds of companies, which is one way people package diversification. The ETF itself can still fall when its whole basket falls.',
      },
      {
        heading: 'A teaching sketch',
        body: 'A portfolio that is 90% one stock and 10% everything else is still concentrated. The small sleeve does not cancel the large one. Weight matters as much as the count of symbols.',
        example: 'Illustration only: four equal positions are a different shape from one position that is 80% of the total.',
      },
    ],
    scenario: mcq(
      'diversification-s',
      'A simulated portfolio holds four stocks, all of them large US banks. Is that broad diversification?',
      [
        'Yes, because there are four tickers',
        'No. The holdings still share one sector, so a banking shock can hit all of them',
        'Yes, because banks cannot fall together',
        'No, because diversification requires exactly 30 stocks',
      ],
      'b',
      'Count of tickers is not the test. Shared economic exposure is the test.',
    ),
    quiz: [
      mcq(
        'diversification-q1',
        'Diversification is meant to reduce:',
        [
          'The risk tied to one company or one bet',
          'Every possible loss, including a broad market decline',
          'The need to read what you own',
          'Taxes in every country',
        ],
        'a',
        'It targets concentration in a single outcome. A market-wide decline can still hurt a diversified stock portfolio.',
      ),
      booleanQuestion(
        'diversification-q2',
        'Owning several companies in the same narrow industry completes diversification.',
        false,
        'Those companies can respond to the same customers, regulation, and cycle.',
      ),
      mcq(
        'diversification-q3',
        'Which portfolio is more concentrated?',
        [
          'One stock at 85% of the total and a few small positions',
          'Several positions with no single one near the whole portfolio',
          'A total-market fund plus a bond fund',
          'They are identical because all contain stocks',
        ],
        'a',
        'The 85% position dominates the result. The other shapes spread the outcome.',
      ),
    ],
    takeaways: [
      'Diversification spreads drivers of return.',
      'It does not cancel market-wide declines.',
      'Weights matter more than a raw ticker count.',
    ],
    terms: ['Diversification', 'Idiosyncratic risk', 'Market risk'],
  },
  {
    id: 'asset-allocation',
    title: 'Asset allocation',
    category: 'portfolio',
    minutes: 6,
    premium: true,
    summary: 'Asset allocation is the mix of asset types, such as stocks, bonds, and cash.',
    sections: [
      {
        heading: 'Mix first, products second',
        body: 'Asset allocation is the decision about how much of a portfolio sits in broad asset types. Stock funds and individual stocks are both equity exposure. Bond funds are a different claim, usually loans to governments or companies. Cash is money waiting, not a company you own.',
      },
      {
        heading: 'Why the mix dominates',
        body: 'Over long periods, the split between higher-swing assets and steadier assets explains a large part of how bumpy a portfolio feels. Choosing among similar stock funds is a smaller decision than choosing whether the portfolio is mostly stocks or mostly bonds and cash. There is no universal correct mix. A mix that fits one person’s time horizon can be a poor description of someone else’s.',
      },
      {
        heading: 'Stak will not assign you one',
        body: 'This lesson names the idea. It does not calculate a personal allocation. A personal mix depends on income, debts, time, and how a person responds to losses. Those facts are outside a practice portfolio.',
      },
    ],
    scenario: mcq(
      'asset-allocation-s',
      'Two simulated portfolios both hold only stock ETFs. One is US, one is international. Have they made different asset allocations?',
      [
        'Yes. International stocks are a different asset class from stocks',
        'They differ by region, but both are equity allocations',
        'No difference is possible because both are ETFs',
        'Cash and stocks are the same asset class',
      ],
      'b',
      'Region is a real difference inside equities. The asset-class mix is still stocks versus stocks.',
    ),
    quiz: [
      mcq(
        'asset-allocation-q1',
        'Asset allocation refers to:',
        [
          'The split across asset types such as stocks, bonds, and cash',
          'The hour of the day you trade',
          'A company’s dividend date',
          'The font on a brokerage statement',
        ],
        'a',
        'It is the portfolio’s mix of asset types, not a clock setting.',
      ),
      booleanQuestion(
        'asset-allocation-q2',
        'There is one asset allocation that is correct for every person.',
        false,
        'Time horizon, other money, and tolerance for swings differ. A lesson cannot know them.',
      ),
      mcq(
        'asset-allocation-q3',
        'A portfolio of many stock ETFs and no bonds or cash is best described as:',
        [
          'A bond allocation',
          'An equity allocation that may still be diversified by company',
          'A guaranteed allocation',
          'Cash',
        ],
        'b',
        'Many stock funds can diversify companies and still leave the portfolio exposed to equity markets.',
      ),
    ],
    takeaways: [
      'Allocation is the mix of asset types.',
      'Many stock funds are still an equity mix.',
      'No single mix fits every person.',
    ],
    terms: ['Asset allocation', 'Equity', 'Bond'],
  },
  {
    id: 'investment-risk',
    title: 'Investment risk',
    category: 'portfolio',
    minutes: 5,
    premium: true,
    summary: 'Risk is the chance that results differ from what you expected, including losing money.',
    sections: [
      {
        heading: 'More than a feeling',
        body: 'In investing, risk includes the possibility of permanent loss and the uncertainty of how large the swings will be along the way. A volatile asset can end higher and still have been risky, because the path was uncertain and could have ended lower.',
      },
      {
        heading: 'Different risks have different names',
        body: 'Market risk affects many holdings at once. Concentration risk sits in one company. Inflation risk is the chance that cash buys less later. Interest-rate risk matters for bonds, because existing bonds can fall in price when rates rise. Liquidity risk is the chance you cannot sell near the price you see when you want to.',
      },
      {
        heading: 'Risk is not a villain or a trophy',
        body: 'Higher expected return is the market’s usual way of compensating people who bear certain risks. Expected is not promised. Taking more risk does not entitle anyone to a profit, and avoiding every risk has a cost too, including inflation for cash.',
      },
    ],
    scenario: mcq(
      'investment-risk-s',
      'A stock doubled last year. A friend says that proves it was low risk. What is the careful response?',
      [
        'A past gain does not show the range of outcomes that were possible',
        'Any stock that rose was risk-free',
        'Risk only counts if the price fell',
        'Last year’s winner is required to rise again',
      ],
      'a',
      'The outcome you happened to get is not the full set of outcomes that could have happened.',
    ),
    quiz: [
      mcq(
        'investment-risk-q1',
        'Which is a fair description of investment risk?',
        [
          'Uncertainty of outcomes, including loss',
          'A fee charged by an exchange',
          'A guarantee that disappears after one year',
          'The company name',
        ],
        'a',
        'Risk is about uncertain results, not a product label.',
      ),
      booleanQuestion(
        'investment-risk-q2',
        'If an asset gained money, it cannot have been risky.',
        false,
        'A gain is one outcome. The chance of a different outcome is what made it risky.',
      ),
      mcq(
        'investment-risk-q3',
        'Inflation risk matters most obviously for:',
        [
          'Cash that might buy less in the future',
          'A ticker symbol',
          'The color of a chart',
          'The number of shares you can read on a screen',
        ],
        'a',
        'Cash can be stable in dollars and still lose purchasing power.',
      ),
    ],
    takeaways: [
      'Risk includes loss and uncertainty.',
      'A past gain does not prove low risk.',
      'Cash has inflation risk even when the dollar balance does not fall.',
    ],
    terms: ['Risk', 'Inflation', 'Liquidity'],
  },
  {
    id: 'rebalancing',
    title: 'Portfolio balancing',
    category: 'portfolio',
    minutes: 5,
    premium: true,
    summary: 'Rebalancing means moving a portfolio back toward a chosen mix after prices change the weights.',
    sections: [
      {
        heading: 'Prices rewrite the mix',
        body: 'Suppose a teaching mix is half stocks and half bonds. If stocks rise a lot, stocks become more than half without any new decision. The portfolio drifted. Rebalancing sells some of what grew and buys some of what shrank, until the mix matches the chosen targets again.',
      },
      {
        heading: 'It is a rule, not a prediction',
        body: 'Rebalancing does not know which asset will do better next. It is a way to keep risk near the level someone already chose. It can also create taxes in a real taxable account, and it can be unnecessary if the drift is tiny. This lesson is the definition, not an instruction to trade on a schedule.',
      },
      {
        heading: 'In the simulator',
        body: 'A simulated rebalance uses virtual cash and practice prices. It does not improve a real account, and the practice price may be delayed or limited to one exchange. The point is to see weights change, then see what a reset would do.',
      },
    ],
    scenario: mcq(
      'rebalancing-s',
      'A target mix was 50% stocks. After a rally, stocks are 70% of the simulated portfolio. Rebalancing toward 50% would mean:',
      [
        'Buying more stocks because they went up',
        'Reducing the stock weight and increasing the other sleeve',
        'Closing the account',
        'Ignoring weights because they cannot change',
      ],
      'b',
      'Rebalancing returns weights toward the target. After stocks outperform, that means reducing the stock share of the mix.',
    ),
    quiz: [
      booleanQuestion(
        'rebalancing-q1',
        'Portfolio weights stay fixed even when prices change.',
        false,
        'Weights drift because each holding’s market value changes at a different rate.',
      ),
      mcq(
        'rebalancing-q2',
        'The purpose of rebalancing is to:',
        [
          'Restore a chosen mix after drift',
          'Guarantee a higher return',
          'Pick next year’s best stock',
          'Avoid ever selling',
        ],
        'a',
        'It is a risk-mix maintenance step. It is not a forecast.',
      ),
      mcq(
        'rebalancing-q3',
        'A real taxable account adds which consideration that a textbook sketch can skip?',
        [
          'Taxes on realized gains',
          'The existence of prices',
          'The definition of a share',
          'The color of the chart',
        ],
        'a',
        'Selling winners can create a tax bill. A simulator does not model someone’s tax situation.',
      ),
    ],
    takeaways: [
      'Drift happens when prices move unevenly.',
      'Rebalancing restores a chosen mix.',
      'It is not a prediction, and real accounts can owe tax.',
    ],
    terms: ['Rebalancing', 'Weight', 'Drift'],
  },
  {
    id: 'long-term',
    title: 'Long-term investing concepts',
    category: 'portfolio',
    minutes: 5,
    premium: true,
    summary: 'A long horizon changes how a person might interpret swings. It does not remove them or promise a result.',
    sections: [
      {
        heading: 'Horizon is a fact about time',
        body: 'Money needed next month has a short horizon. Money a person does not expect to use for decades has a long one. A long horizon can make a temporary decline less urgent, because there is time before the cash is needed. It cannot make a decline impossible, and a company can still fail permanently.',
      },
      {
        heading: 'Compounding needs the return to show up',
        body: 'The reason people talk about long periods is the compound-growth math: reinvested gains have more years to earn further gains. That story assumes gains occur. A long holding period full of poor results does not turn into a good result just because the calendar was long.',
      },
      {
        heading: 'Behavior is part of the concept',
        body: 'A plan that a person abandons at the first decline was not a plan they could hold. Long-term investing, as an idea, includes deciding in advance what swings you can actually live with. Stak’s simulator is a place to watch a swing without using money you need.',
      },
    ],
    scenario: mcq(
      'long-term-s',
      'Savings needed for rent in two months are put into a single stock “because long-term investing always works.” What is the mistake?',
      [
        'Two months is a short horizon, and a stock can fall in that window',
        'Rent should always be paid in shares',
        'Stocks cannot fall in two months',
        'A short horizon guarantees a gain',
      ],
      'a',
      'The phrase “long-term” does not apply to cash that is needed almost immediately.',
    ),
    quiz: [
      mcq(
        'long-term-q1',
        'A long time horizon means:',
        [
          'The money is not needed soon',
          'Losses are impossible',
          'The government insures the shares',
          'Prices update once a decade',
        ],
        'a',
        'Horizon is about when the money is needed. It is not insurance.',
      ),
      booleanQuestion(
        'long-term-q2',
        'Holding for many years guarantees a profit on a single stock.',
        false,
        'A business can shrink or fail. Time does not repair every company.',
      ),
      mcq(
        'long-term-q3',
        'Why do lessons connect compounding with long horizons?',
        [
          'More years give reinvested gains more chances to earn further gains, if those gains happen',
          'Exchanges waive risk after year five',
          'Inflation stops',
          'Dividends become mandatory',
        ],
        'a',
        'The math needs both time and actual positive returns. Neither is a promise.',
      ),
    ],
    takeaways: [
      'Horizon means when you need the money.',
      'Time does not insure a single company.',
      'Compounding needs real gains, not just a long calendar.',
    ],
    terms: ['Time horizon', 'Compounding', 'Permanent loss'],
  },
  {
    id: 'volatility',
    title: 'Volatility',
    category: 'portfolio',
    minutes: 5,
    premium: true,
    summary: 'Volatility measures how widely results swing. It is not the same as a loss that never recovers.',
    sections: [
      {
        heading: 'The size of the swings',
        body: 'A volatile investment moves around more. Those moves can be up or down. A standard statistical description looks at how far results stray from their average. You do not need the formula to use the idea: bigger, more frequent swings mean higher volatility.',
      },
      {
        heading: 'Volatility is not the whole of risk',
        body: 'A stock can be quiet and then drop because the business broke. A bond fund can look calm and still lose value when rates jump. Volatility is a useful description of recorded swings. It is not a complete list of ways you can lose money.',
      },
      {
        heading: 'Reading it in Stak',
        body: 'If Stak has several saved portfolio valuations, it can describe whether those recorded values swung. It will not invent a year of history on the first day. No snapshots means no volatility claim.',
      },
    ],
    scenario: mcq(
      'volatility-s',
      'Portfolio snapshots jump between up days and down days, and end near where they started. Which word fits the path?',
      [
        'Volatile, even though the ending value is similar',
        'Risk-free, because it ended flat',
        'A dividend',
        'A primary offering',
      ],
      'a',
      'The path swung. Ending near the start does not make the path calm, and it does not make the next path safe.',
    ),
    quiz: [
      mcq(
        'volatility-q1',
        'Volatility describes:',
        [
          'How widely values swing',
          'The company headquarters',
          'A guaranteed coupon',
          'The number of shareholders required by law',
        ],
        'a',
        'It is a description of variation, not an address or a promise.',
      ),
      booleanQuestion(
        'volatility-q2',
        'Low recent volatility proves the next month will be calm.',
        false,
        'Recent swings are history. They are not a contract about the next month.',
      ),
      mcq(
        'volatility-q3',
        'Why can a flat ending value still be volatile?',
        [
          'The path in between can have large up and down moves',
          'Flat results are illegal',
          'Volatility only counts at the endpoint',
          'Cash is always volatile',
        ],
        'a',
        'Volatility is about the ride, not only the last point.',
      ),
    ],
    takeaways: [
      'Volatility is the size of swings.',
      'A flat ending can still have been a wild path.',
      'Past swings do not schedule future swings.',
    ],
    terms: ['Volatility', 'Snapshot', 'Drawdown'],
  },
  {
    id: 'risk-return',
    title: 'Risk and return',
    category: 'portfolio',
    minutes: 6,
    premium: true,
    summary: 'The usual relationship is that higher expected return comes with bearing more uncertainty. Expected is not owed.',
    sections: [
      {
        heading: 'The tradeoff, stated carefully',
        body: 'Assets that can fall hard are often priced so that their expected return is higher than cash. People demand compensation for bearing uncertainty. If a risky asset offered no extra expected return, there would be little reason to hold it instead of something steadier. That is the risk-return tradeoff.',
      },
      {
        heading: 'Expected is a probability word',
        body: 'An expected return is a probability-weighted idea, not the return you will get. A coin that pays $3 on heads and $0 on tails has an expected value of $1.50. You never actually receive $1.50 on a single flip. A stock’s expected return works the same way: the average of imagined outcomes is not the outcome you live.',
      },
      {
        heading: 'Chasing last year’s number',
        body: 'The asset that just had the highest return was compensated, if it was, for risks that already showed up as a good outcome. That history does not move next year’s result into your account. Comparing risk and return means asking what uncertainty remains, not only what already happened.',
      },
    ],
    scenario: mcq(
      'risk-return-s',
      'A savings illustration pays a stated rate. A stock has no stated rate and can fall 40%. Why might the stock still have a higher expected return in a textbook model?',
      [
        'Because buyers may demand compensation for the chance of that fall',
        'Because stocks are insured',
        'Because the stock must rise 40% next',
        'Because expected means guaranteed',
      ],
      'a',
      'The extra expected return is compensation for uncertainty. It is not a scheduled payment.',
    ),
    quiz: [
      booleanQuestion(
        'risk-return-q1',
        'A higher expected return is a guarantee of a higher actual return.',
        false,
        'Expected describes a probability idea. The actual result can be lower, even much lower.',
      ),
      mcq(
        'risk-return-q2',
        'In the coin illustration, the expected value is $1.50 because:',
        [
          'It is the average of the possible payoffs',
          'Every flip pays $1.50',
          'The exchange sets the coin price',
          'Heads is required',
        ],
        'a',
        'Expectation is an average across outcomes, not the cash from one outcome.',
      ),
      mcq(
        'risk-return-q3',
        'Last year’s best-performing asset:',
        [
          'Has already posted that result; it does not owe you a repeat',
          'Is now risk-free',
          'Must be the best choice for every goal',
          'Becomes cash',
        ],
        'a',
        'A historical return is behind you. The uncertainty that remains is a separate question.',
      ),
    ],
    takeaways: [
      'Higher expected return usually pays for uncertainty.',
      'Expected does not mean received.',
      'A past winner does not owe a repeat.',
    ],
    terms: ['Expected return', 'Risk-return tradeoff', 'Actual return'],
  },
];
