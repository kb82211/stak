export type Profile = {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  knowledge_level: string | null;
  invested_before: boolean | null;
  interests: string[];
  goals: string[];
  daily_goal_lessons: number;
  learning_path_id: string;
  xp: number;
  level: number;
  streak_current: number;
  streak_longest: number;
  last_activity_date: string | null;
  plan: 'free' | 'premium';
};

export type HoldingRow = {
  symbol: string;
  quantity: number;
  avg_cost: number;
};

export type SnapshotRow = {
  total_value: number;
  cash: number;
  recorded_at: string;
};

export type TransactionRow = {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  notional: number;
  market_as_of: string;
  feed: string;
  source_label: string;
  disclosure: string;
  created_at: string;
};

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

export type BarPoint = {
  t: string;
  c: number;
};

export type MarketAsset = {
  symbol: string;
  name: string;
  assetType: 'stock' | 'etf' | 'unknown';
  sector: string | null;
  description: string | null;
  exchange: string | null;
};

export type DailyActivity = {
  lessons: number;
  questions: number;
  explorations: number;
  challenges: number;
};

export type LessonProgress = {
  lesson_id: string;
  passed: boolean;
  best_score: number;
  best_total: number;
  completed_at: string | null;
};
