import { booleanQuestion, matchQuestion, mcq, type Lesson } from '../types';

export const personalLessons: Lesson[] = [
  {
    id: 'budgeting',
    title: 'Budgeting',
    category: 'personal',
    minutes: 5,
    premium: false,
    summary: 'A budget is a plan for where money will go, written before the month spends it for you.',
    sections: [
      {
        heading: 'A plan, then a record',
        body: 'A budget assigns incoming money to needs, wants, and goals before the month starts. Tracking is the record of what actually happened. The plan and the record are both useful. The plan without the record is a wish. The record without a plan is a diary.',
      },
      {
        heading: 'A simple split',
        body: 'One teaching split is needs, wants, and saving. Needs are housing, food, transport, and minimum debt payments. Wants are choices. Saving is money you do not assign to this month’s spending. The percentages people quote online are examples, not a rule that fits every rent payment.',
      },
      {
        heading: 'Why it comes before investing',
        body: 'Money you will need for rent is a poor candidate for a swinging market. A budget shows which dollars have a job this month and which dollars have a longer job. Investing lessons sit on top of that distinction.',
      },
    ],
    scenario: mcq(
      'budgeting-s',
      'After rent, groceries, and a minimum loan payment, $200 is left and payday is three weeks away. What is the budgeting question?',
      [
        'Which remaining jobs can this $200 cover, and which wants wait',
        'Which single stock will double before rent is due',
        'How to hide the spending so the plan looks perfect',
        'Whether a budget forbids food',
      ],
      'a',
      'A budget is an assignment of limited dollars. Near-term bills come before a market bet.',
    ),
    quiz: [
      matchQuestion(
        'budgeting-q1',
        'Match the budgeting word.',
        [
          { term: 'Need', definition: 'A cost such as housing, food, or a minimum debt payment' },
          { term: 'Want', definition: 'A choice you could delay' },
          { term: 'Saving', definition: 'Money not assigned to this month’s spending' },
        ],
        'The labels separate obligations, choices, and money kept for later.',
      ),
      booleanQuestion(
        'budgeting-q2',
        'A budget is the same document as a brokerage statement.',
        false,
        'A budget plans your cash. A brokerage statement lists investments. They answer different questions.',
      ),
      mcq(
        'budgeting-q3',
        'Tracking spending matters because:',
        [
          'It shows whether the plan matched real life',
          'It sets the stock market’s close',
          'It replaces the need to earn income',
          'It guarantees a surplus',
        ],
        'a',
        'The comparison of plan and record is what lets you adjust.',
      ),
    ],
    takeaways: [
      'A budget assigns dollars before they leave.',
      'Needs, wants, and saving are a simple split.',
      'Near-term bills are not a stock-market experiment.',
    ],
    terms: ['Budget', 'Need', 'Want', 'Cash flow'],
  },
  {
    id: 'saving',
    title: 'Saving',
    category: 'personal',
    minutes: 4,
    premium: false,
    summary: 'Saving is keeping money instead of spending it. It is the raw material for emergencies and for investing.',
    sections: [
      {
        heading: 'Saving is a gap',
        body: 'Saving is income minus spending over a period. If you earn $3,000 and spend $2,700, you saved $300. The location of the $300, whether a bank account or a jar, is a second decision. The first decision was not spending it.',
        example: 'Illustration: $3,000 income − $2,700 spending = $300 saved. Not a recommendation of a bank.',
      },
      {
        heading: 'Saving and investing are different jobs',
        body: 'Saving builds the pile. Investing puts some of that pile into assets that can rise or fall. You can save without investing. You cannot invest money you already spent. Treating them as the same word hides the fact that invested money can be worth less when you need it.',
      },
      {
        heading: 'Pay yourself in the plan',
        body: 'People save more reliably when the transfer happens on payday, before wants expand to fill the checking account. That is a behavioral trick, not a market forecast. The amount has to be one the rest of the budget can actually carry.',
      },
    ],
    scenario: mcq(
      'saving-s',
      'Someone invests every spare dollar and then cannot cover a car repair without selling shares at a bad time. What was missing?',
      [
        'A separation between money saved for near-term needs and money that can be invested',
        'A higher share price',
        'A rule against saving',
        'More wants in the budget',
      ],
      'a',
      'Investing money you might need immediately couples a real bill to a market price.',
    ),
    quiz: [
      mcq(
        'saving-q1',
        'Saving over a month equals:',
        [
          'Income minus spending',
          'The change in a stock index',
          'Revenue minus earnings',
          'Bid minus ask',
        ],
        'a',
        'It is the unspent gap. Investing is what you might do with it later.',
      ),
      booleanQuestion(
        'saving-q2',
        'Money that is invested cannot fall in value.',
        false,
        'Investing introduces the chance of loss. Saving as cash avoids that market swing and takes on inflation risk instead.',
      ),
      mcq(
        'saving-q3',
        'An automatic transfer on payday helps because:',
        [
          'It moves money before casual spending expands',
          'It sets the market’s return',
          'It removes all bills',
          'It is a type of dividend',
        ],
        'a',
        'The help is behavioral. It does not change what markets will do.',
      ),
    ],
    takeaways: [
      'Saving is the unspent gap.',
      'Investing is a later, riskier job for some of those dollars.',
      'Near-term needs and long-term investing should not share one pile by accident.',
    ],
    terms: ['Saving', 'Investing', 'Spending'],
  },
  {
    id: 'emergency-fund',
    title: 'Emergency funds',
    category: 'personal',
    minutes: 5,
    premium: false,
    summary: 'An emergency fund is cash set aside for a surprise, so a surprise does not become a debt or a forced sale.',
    sections: [
      {
        heading: 'What it is for',
        body: 'Job loss, a medical bill, or a broken car are the usual examples. The fund is boring on purpose. It is meant to be there at full value when the surprise arrives, not to seek a market return. A common guideline is three to six months of essential expenses. That range is a teaching guideline, not a number calculated for you.',
      },
      {
        heading: 'Where the guideline comes from',
        body: 'Essential expenses are the needs from your budget, not your entire income and not your wants. Three months is a smaller cushion. Six months covers a longer job search. People with unstable income sometimes aim longer. The right length depends on those facts.',
      },
      {
        heading: 'Why it sits outside the stock lesson',
        body: 'Shares can be down in the same month the emergency arrives. Selling then locks in the low price and may still not cover the bill if the timing is bad. Cash has inflation risk. For this job, being able to pay the bill usually outranks earning a return.',
      },
    ],
    scenario: mcq(
      'emergency-fund-s',
      'Essential costs are $2,000 a month. Using the common three-month guideline, how large is the illustration?',
      [
        '$6,000 set aside for essentials, not for a stock purchase',
        '$2,000 invested in one company',
        '$6,000 of credit-card limit',
        'Three shares of an index',
      ],
      'a',
      'Three months × $2,000 is $6,000. The figure is a guideline applied to this illustration, not personal advice.',
    ),
    quiz: [
      mcq(
        'emergency-fund-q1',
        'The job of an emergency fund is to:',
        [
          'Pay a surprise without a new debt or a forced sale',
          'Beat the stock market',
          'Replace a budget',
          'Maximize dividend yield',
        ],
        'a',
        'Availability is the point. Return is secondary for this pile.',
      ),
      booleanQuestion(
        'emergency-fund-q2',
        'A common teaching range is three to six months of essential expenses.',
        true,
        'That range is widely taught. It is a guideline, and essential expenses are the base, not total income.',
      ),
      mcq(
        'emergency-fund-q3',
        'Why is a stock a poor default container for the emergency fund?',
        [
          'The price can be down at the moment you need the cash',
          'Stocks are always cash',
          'Emergencies are scheduled',
          'Prices cannot fall',
        ],
        'a',
        'The emergency and the market decline do not coordinate their calendars.',
      ),
    ],
    takeaways: [
      'The fund is for surprises, in cash you can reach.',
      'Three to six months of essentials is a common guideline.',
      'Market swings make stocks a poor default for this job.',
    ],
    terms: ['Emergency fund', 'Essential expenses', 'Liquidity'],
  },
  {
    id: 'credit-scores',
    title: 'Credit scores',
    category: 'personal',
    minutes: 5,
    premium: false,
    summary: 'A credit score is a model of how you have handled borrowed money. Lenders use it. It is not a grade of your character.',
    sections: [
      {
        heading: 'What the number summarizes',
        body: 'In the US, scores such as FICO combine items from a credit report: whether you pay on time, how much of your limits you use, how long you have had credit, the mix of accounts, and recent applications. Exact weights differ by model. The score is a prediction aid for lenders, not a moral score and not a measure of investing skill.',
      },
      {
        heading: 'Why people care',
        body: 'A lower score can mean a higher interest rate on a loan, a rejected application, or a larger deposit for an apartment or a utility. The cost shows up as more interest paid over time. Improving a score is mostly ordinary behavior: pay on time, and avoid using most of a card’s limit.',
      },
      {
        heading: 'What does not belong in the myth',
        body: 'Checking your own score through a consumer service is not the same as a lender pulling your file for a new loan. You do not need to carry a balance to “build credit.” Paying a statement in full and on time is a clean record. Carrying a balance just adds interest.',
      },
    ],
    scenario: mcq(
      'credit-scores-s',
      'A card is nearly maxed and a payment was late. Which factors are the score actually reacting to?',
      [
        'Payment history and how much of the limit is used',
        'The person’s investing returns',
        'The color of the card',
        'Whether they have an emergency fund in stocks',
      ],
      'a',
      'On-time payments and credit utilization are core inputs. Portfolio results are not.',
    ),
    quiz: [
      booleanQuestion(
        'credit-scores-q1',
        'A credit score measures whether you are a good person.',
        false,
        'It summarizes credit-report behavior for lenders. It is not a character grade.',
      ),
      mcq(
        'credit-scores-q2',
        'A practical way scores get hurt is:',
        [
          'Late payments and high balances relative to limits',
          'Reading a lesson about ETFs',
          'Paying a statement in full',
          'Having a budget',
        ],
        'a',
        'Payment history and utilization are the usual pressure points.',
      ),
      mcq(
        'credit-scores-q3',
        'Carrying a credit-card balance is:',
        [
          'Required to build credit',
          'A way to owe interest, not a requirement for a positive history',
          'The same as a dividend',
          'Invisible to every scoring model',
        ],
        'b',
        'On-time payment of the full statement builds a record without interest. A carried balance adds interest.',
      ),
    ],
    takeaways: [
      'A score summarizes credit-report behavior.',
      'On-time payments and low utilization matter most in common models.',
      'You do not need to carry a balance to have a credit history.',
    ],
    terms: ['Credit score', 'Credit report', 'Utilization'],
  },
  {
    id: 'debt',
    title: 'Managing debt',
    category: 'personal',
    minutes: 6,
    premium: true,
    summary: 'Debt is borrowed money you have to repay, usually with interest. The interest rate decides how expensive it is to wait.',
    sections: [
      {
        heading: 'Not all debt has the same price',
        body: 'A credit card at a high rate and a federal student loan at a lower rate are both debt, and they are not the same problem. The expensive one grows faster if you only pay the minimum. The minimum payment on a card is designed to keep the loan alive for a long time. It is not a payoff plan.',
      },
      {
        heading: 'Two payoff sketches',
        body: 'The avalanche method puts extra money toward the highest interest rate first, which reduces interest paid in a simple math model. The snowball method puts extra money toward the smallest balance first, which creates quicker paid-off accounts. One is about interest math. One is about motivation. Either requires paying at least the minimum on every debt so nothing falls behind.',
      },
      {
        heading: 'New investing versus expensive interest',
        body: 'A market return is uncertain. Credit-card interest is a known cost. Comparing a hoped-for market gain with a certain high interest charge is not a close contest in most textbooks. This is a description of the math, not a personalized plan for anyone’s loans.',
      },
    ],
    scenario: mcq(
      'debt-s',
      'A card charges 20% interest and a practice portfolio is not a promise of 20%. Where does the certain cost sit?',
      [
        'On the card. The 20% is a contractual charge, while a market gain is not contractual',
        'On the portfolio, because markets always beat 20%',
        'Nowhere. Interest is optional',
        'On dividends, which must exceed the card',
      ],
      'a',
      'Contractual interest is known. An investment return is not. The comparison starts there.',
    ),
    quiz: [
      mcq(
        'debt-q1',
        'The avalanche method directs extra payments to:',
        [
          'The highest interest rate',
          'The smallest balance',
          'The newest account, always',
          'Whichever lender advertises most',
        ],
        'a',
        'Avalanche targets the rate. Snowball targets the smallest balance.',
      ),
      booleanQuestion(
        'debt-q2',
        'A credit-card minimum payment is a fast payoff plan.',
        false,
        'Minimums keep the balance outstanding and let interest accumulate. A payoff plan pays more than the minimum.',
      ),
      mcq(
        'debt-q3',
        'While using either payoff method, you still:',
        [
          'Pay at least the minimum on every debt',
          'Skip payments on the other debts',
          'Close every account the same day',
          'Convert the debt into shares',
        ],
        'a',
        'Extra money goes to one target. The others still need their minimums to stay current.',
      ),
    ],
    takeaways: [
      'The interest rate is the price of waiting.',
      'Avalanche targets rate. Snowball targets the smallest balance.',
      'A certain high interest charge is different from a hoped-for market return.',
    ],
    terms: ['Interest', 'Minimum payment', 'Avalanche', 'Snowball'],
  },
  {
    id: 'interest-rates',
    title: 'Interest rates',
    category: 'personal',
    minutes: 5,
    premium: false,
    summary: 'An interest rate is the price of borrowing money, or the price a saver is paid for lending it.',
    sections: [
      {
        heading: 'The same word, two chairs',
        body: 'When you borrow, interest is what you pay. When you lend, including a savings account or a bond, interest is what you are paid. The rate is usually quoted per year. A 12% yearly rate does not mean 12% per month. Mixing up the period is a common and expensive misread.',
      },
      {
        heading: 'APR and the payment',
        body: 'APR, annual percentage rate, is a standardized way to describe the yearly cost of borrowing, including certain fees depending on the product. The monthly payment on an installment loan depends on the rate, the amount, and the number of months. A lower rate, all else equal, means less interest over the life of the same loan.',
      },
      {
        heading: 'Rates and already-issued bonds',
        body: 'When market rates rise, existing bonds with lower fixed coupons become less attractive, so their prices tend to fall. When rates fall, those older higher coupons become more attractive, so prices tend to rise. You do not need to trade bonds to understand why a “safe” bond fund can show a down year.',
      },
    ],
    scenario: mcq(
      'interest-rates-s',
      'A sign says 2% a month. Someone treats it as 2% a year. What went wrong?',
      [
        'The period was ignored. A monthly rate and a yearly rate are different prices',
        'Percentages cannot be monthly',
        'APR always means per day',
        'Interest only applies to stocks',
      ],
      'a',
      'Always read the period attached to the rate. Two percent each month is not two percent a year.',
    ),
    quiz: [
      booleanQuestion(
        'interest-rates-q1',
        'An interest rate is quoted without a time period and is still unambiguous.',
        false,
        'The period is part of the price. Per month and per year are different.',
      ),
      mcq(
        'interest-rates-q2',
        'When market interest rates rise, existing fixed-rate bonds tend to:',
        [
          'Fall in price',
          'Double their coupon automatically',
          'Become stocks',
          'Stop counting as debt',
        ],
        'a',
        'Newer bonds pay more, so the old lower coupon is worth less in the market.',
      ),
      mcq(
        'interest-rates-q3',
        'APR is used so borrowers can:',
        [
          'Compare yearly borrowing costs on a more standard basis',
          'Ignore fees',
          'Skip payments',
          'Convert loans into ETFs',
        ],
        'a',
        'Standardizing the yearly quote makes offers easier to compare. Read what each APR includes.',
      ),
    ],
    takeaways: [
      'Interest is the price of borrowing or the payment for lending.',
      'Read the time period on the rate.',
      'Rising rates tend to push existing bond prices down.',
    ],
    terms: ['Interest rate', 'APR', 'Coupon', 'Bond'],
  },
  {
    id: 'compound-interest',
    title: 'Compound interest',
    category: 'personal',
    minutes: 6,
    premium: false,
    summary: 'Compound interest is interest earned on interest. On a debt, it is interest charged on unpaid interest.',
    sections: [
      {
        heading: 'The savings version',
        body: 'If a savings illustration pays 5% a year and you leave the interest in the account, year two pays 5% on a larger balance. A $1,000 start becomes $1,050, then $1,102.50. The extra $2.50 in the second year is interest on the first year’s interest. This is a stated-rate example. A bank states the rate. A stock does not.',
        example: 'Illustration: $1,000 at 5% for two years, compounded yearly, is $1,102.50. Not a current bank offer.',
      },
      {
        heading: 'The debt version',
        body: 'The same math runs against you on a card if interest is added and then future interest is charged on that larger balance. Paying only a small amount, or none, lets the balance compound upward. This is why a high card rate is urgent in a way a savings rate is not.',
      },
      {
        heading: 'Frequency',
        body: 'Compounding monthly instead of yearly, at the same stated annual rate, produces a slightly higher result because interest is added sooner. The difference is real and usually smaller than the difference between a 2% rate and a 20% rate. The rate still matters more than the fine print of the frequency.',
      },
    ],
    scenario: mcq(
      'compound-interest-s',
      'You leave interest inside a savings illustration. Why is year two’s interest larger than year one’s if the rate stays at 5%?',
      [
        'The 5% applies to a balance that already includes year one’s interest',
        'The bank is required to raise the rate',
        'Inflation sets the rate to 5%',
        'Year two is always double',
      ],
      'a',
      'That is the definition of compounding: the new interest base includes prior interest.',
    ),
    quiz: [
      mcq(
        'compound-interest-q1',
        'Compound interest means:',
        [
          'Interest calculated on a balance that includes earlier interest',
          'A fee that never changes a balance',
          'A stock’s dividend guarantee',
          'A one-time gift',
        ],
        'a',
        'The base grows by the interest that was left in place.',
      ),
      booleanQuestion(
        'compound-interest-q2',
        'Compounding can increase a debt if unpaid interest is added to the balance.',
        true,
        'The math is not only a savings story. It works on balances you owe, too.',
      ),
      mcq(
        'compound-interest-q3',
        'Compared with the stated annual rate, compounding monthly rather than yearly:',
        [
          'Changes the result somewhat, and usually less than a large difference in the rate itself',
          'Does nothing',
          'Doubles the rate by law',
          'Applies only to stocks',
        ],
        'a',
        'Frequency matters. The rate usually matters more.',
      ),
    ],
    takeaways: [
      'Compound interest is interest on interest.',
      'On a debt, it can make the balance grow faster.',
      'A stated savings rate is not the same as a stock return.',
    ],
    terms: ['Compound interest', 'Principal', 'APR'],
  },
  {
    id: 'financial-planning',
    title: 'Financial planning',
    category: 'personal',
    minutes: 6,
    premium: true,
    summary: 'A financial plan orders the jobs your money has: bills, a cushion, expensive debt, then long-term goals.',
    sections: [
      {
        heading: 'Goals with dates',
        body: 'A plan starts with what the money is for and when. Rent this month, a move in a year, and retirement in several decades are different goals. Each goal gets a vehicle that matches the date. Near dates point toward cash. Distant dates can tolerate more swings, if the person can actually leave the money alone.',
      },
      {
        heading: 'A common order of operations',
        body: 'A widely taught sequence is: cover essential bills, build a starter emergency fund, capture any clearly free employer retirement match if you have one, pay down expensive debt, then fund longer-term investing and a fuller cushion. The sequence is a teaching order. Taxes, benefits, and high-interest debt can change the emphasis. It is not a personalized plan.',
      },
      {
        heading: 'Review, do not set and forget forever',
        body: 'Income changes, a new child arrives, or a debt is paid off. The plan is a document you revisit, not a tattoo. Stak’s lessons and simulator are practice for the vocabulary and the market mechanics. They do not know your employer plan, your tax bracket, or your debts.',
      },
    ],
    scenario: mcq(
      'financial-planning-s',
      'Someone skips rent savings and a high-interest card to practice stock trading with money they need next month. Which planning idea did they skip?',
      [
        'Match the vehicle to the date, and handle known high-cost debt before uncertain returns',
        'Always invest cash that has a job this month',
        'Plans forbid emergency funds',
        'Dates do not matter',
      ],
      'a',
      'Next month’s rent is a short-dated cash job. A 20% card is a known cost. A stock has neither a date nor a promised return.',
    ),
    quiz: [
      mcq(
        'financial-planning-q1',
        'A financial goal needs:',
        [
          'A purpose and a time',
          'Only a ticker',
          'A bull-market label',
          'An IPO',
        ],
        'a',
        'Purpose and timing decide what kind of money it is.',
      ),
      booleanQuestion(
        'financial-planning-q2',
        'The same dollars should usually serve next month’s rent and a decades-long goal at the same time.',
        false,
        'Those jobs have different dates and different tolerance for a market swing.',
      ),
      mcq(
        'financial-planning-q3',
        'Why revisit a plan?',
        [
          'Income, debts, and goals change',
          'Market vocabulary is illegal to reuse',
          'Budgets expire every weekend by law',
          'Interest rates never change',
        ],
        'a',
        'A plan describes a life that moves. The document should move with it.',
      ),
    ],
    takeaways: [
      'Give each goal a date.',
      'Match cash to near dates and accept swings only where time allows.',
      'A teaching sequence is not a personal financial plan.',
    ],
    terms: ['Financial plan', 'Goal', 'Time horizon'],
  },
];
