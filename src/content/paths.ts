import type { LearningPath } from './types';

export const paths: LearningPath[] = [
  {
    id: 'beginner',
    title: 'Complete Beginner',
    description: 'Everyday money first, then a clear look at how markets work.',
    lessonIds: [
      'budgeting',
      'saving',
      'emergency-fund',
      'stock-market',
      'how-stocks-work',
      'etfs',
      'diversification',
      'compound-interest',
    ],
  },
  {
    id: 'fundamentals',
    title: 'Investing Fundamentals',
    description: 'Stocks, ETFs, dividends, prices, and where trades actually happen.',
    lessonIds: [
      'stock-market',
      'how-stocks-work',
      'etfs',
      'dividends',
      'compound-growth',
      'market-cap',
      'stock-prices',
      'primary-secondary',
    ],
  },
  {
    id: 'explorer',
    title: 'Market Explorer',
    description: 'Cycles, company numbers, and the forces that move prices.',
    lessonIds: [
      'bull-bear',
      'market-cycles',
      'supply-demand',
      'company-fundamentals',
      'financial-statements',
      'pe-ratio',
      'revenue-earnings',
      'economic-indicators',
    ],
  },
  {
    id: 'personal',
    title: 'Personal Finance',
    description: 'Budgets, saving, credit, debt, and a plan you can revisit.',
    lessonIds: [
      'budgeting',
      'saving',
      'emergency-fund',
      'credit-scores',
      'debt',
      'interest-rates',
      'compound-interest',
      'financial-planning',
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Investor Education',
    description: 'Risk, allocation, volatility, and how a portfolio behaves over time.',
    lessonIds: [
      'diversification',
      'asset-allocation',
      'investment-risk',
      'rebalancing',
      'long-term',
      'volatility',
      'risk-return',
      'financial-statements',
      'pe-ratio',
    ],
  },
];

export function pathById(id: string | null | undefined) {
  return paths.find((path) => path.id === id) ?? paths[0];
}

export function recommendPath(input: { knowledge: string; invested: boolean; interests: string[] }) {
  if (input.interests.includes('Budgeting') || input.interests.includes('Saving')) return 'personal';
  if (input.knowledge === 'experienced') return 'advanced';
  if (input.knowledge === 'new' && !input.invested) return 'beginner';
  if (input.interests.includes('Company research')) return 'explorer';
  return 'fundamentals';
}
