import { assetBySymbol, catalogAssets } from '@/content/assets';
import { lessonById } from '@/content';
import { localDateString } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { BarPoint, DailyActivity, HoldingRow, LessonProgress, MarketAsset, Profile, Quote, SnapshotRow, TransactionRow } from '@/lib/types';

function client() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

async function invoke<T>(name: string, body: Record<string, unknown>) {
  const { data, error } = await client().functions.invoke(name, { body });
  if (data?.error) throw new Error(data.message ?? data.error);
  if (error) {
    const response = (error as { context?: { json?: () => Promise<{ message?: string }> } }).context;
    if (response?.json) {
      const payload = await response.json().catch(() => null);
      if (payload?.message) throw new Error(payload.message);
    }
    throw new Error(error.message);
  }
  return data as T;
}

export async function getProfile(userId: string) {
  const { data, error } = await client().from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, patch: Partial<Profile>) {
  const { data, error } = await client().from('profiles').update(patch).eq('id', userId).select('*').single();
  if (error) throw error;
  return data as Profile;
}

export async function usernameAvailable(name: string) {
  const { data, error } = await client().rpc('username_available', { p_name: name });
  if (error) throw error;
  return Boolean(data);
}

export async function loadProgress(userId: string) {
  const { data, error } = await client().from('lesson_progress').select('*').eq('user_id', userId);
  if (error) throw error;
  return (data ?? []) as LessonProgress[];
}

export async function loadActivity(userId: string, date = localDateString()) {
  const { data, error } = await client()
    .from('daily_activity')
    .select('*')
    .eq('user_id', userId)
    .eq('activity_date', date)
    .maybeSingle();
  if (error) throw error;
  return {
    lessons: data?.lessons ?? 0,
    questions: data?.questions ?? 0,
    explorations: data?.explorations ?? 0,
    challenges: data?.challenges ?? 0,
  } satisfies DailyActivity;
}

export async function submitLesson(lessonId: string, answers: Record<string, string | Record<string, string>>) {
  const lesson = lessonById(lessonId);
  if (!lesson) throw new Error('Unknown lesson.');
  const { data, error } = await client().rpc('submit_quiz', {
    p_lesson_id: lessonId,
    p_answers: answers,
    p_local_date: localDateString(),
  });
  if (error) throw error;
  return data as QuizResult;
}

export type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  perfect: boolean;
  xpAwarded: number;
  alreadyCompleted: boolean;
  level: number;
  totalXp: number;
  streak: number;
  results: { id: string; correct: boolean; explanation: string }[];
  unlocked: { id: string; title: string }[];
};

export async function loadAccount(userId: string) {
  const { data, error } = await client().from('virtual_accounts').select('cash').eq('user_id', userId).single();
  if (error) throw error;
  return Number(data.cash);
}

export async function loadHoldings(userId: string) {
  const { data, error } = await client().from('holdings').select('symbol, quantity, avg_cost').eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    symbol: row.symbol as string,
    quantity: Number(row.quantity),
    avg_cost: Number(row.avg_cost),
  })) satisfies HoldingRow[];
}

export async function loadSnapshots(userId: string) {
  const { data, error } = await client()
    .from('portfolio_snapshots')
    .select('total_value, cash, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    total_value: Number(row.total_value),
    cash: Number(row.cash),
    recorded_at: row.recorded_at as string,
  })) satisfies SnapshotRow[];
}

export async function loadTransactions(userId: string) {
  const { data, error } = await client()
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as TransactionRow[];
}

export async function loadAchievements(userId: string) {
  const { data, error } = await client().from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', userId);
  if (error) throw error;
  return data ?? [];
}

export async function invokeMarket<T>(body: Record<string, unknown>) {
  return invoke<T>('market-data', body);
}

export async function refreshPortfolio() {
  return invokeMarket<{ quotes: Quote[]; missing: string[] }>({ action: 'portfolio' });
}

export async function fetchQuotes(symbols: string[]) {
  if (symbols.length === 0) return [] as Quote[];
  const data = await invokeMarket<{ quotes: Quote[] }>({ action: 'quotes', symbols });
  return data.quotes ?? [];
}

export async function fetchBars(symbol: string, range: '1D' | '1M' | '3M' | '1Y') {
  return invokeMarket<{ bars: BarPoint[]; rangeLabel: string; sourceLabel: string }>({
    action: 'bars',
    symbol,
    range,
  });
}

export function searchCatalog(query: string): MarketAsset[] {
  const needle = query.trim().toLowerCase();
  const pool = catalogAssets.filter((asset) => {
    if (!needle) return true;
    return asset.symbol.toLowerCase().includes(needle) || asset.name.toLowerCase().includes(needle);
  });
  return pool.map(toMarketAsset);
}

export function toMarketAsset(asset: {
  symbol: string;
  name: string;
  assetType: 'stock' | 'etf';
  sector: string;
  description: string;
}): MarketAsset {
  return {
    symbol: asset.symbol,
    name: asset.name,
    assetType: asset.assetType,
    sector: asset.sector,
    description: asset.description,
    exchange: null,
  };
}

export async function lookupSymbol(symbol: string): Promise<MarketAsset | null> {
  const known = assetBySymbol(symbol);
  if (known) return toMarketAsset(known);
  try {
    const data = await invokeMarket<{ asset: MarketAsset | null }>({ action: 'lookup', symbol });
    return data.asset;
  } catch {
    return null;
  }
}

export async function executeTrade(input: {
  symbol: string;
  side: 'buy' | 'sell';
  mode: 'dollars' | 'shares';
  amount: number;
  idempotencyKey: string;
}) {
  return invoke<{
    transactionId: string;
    quantity: number;
    notional: number;
    price: number;
    asOf: string;
    sourceLabel: string;
    disclosure: string;
    cash: number;
  }>('execute-trade', input);
}

export async function recordExploration(symbol: string) {
  const { data, error } = await client().rpc('record_exploration', {
    p_symbol: symbol.toUpperCase(),
    p_local_date: localDateString(),
  });
  if (error) throw error;
  return data as { xpAwarded: number };
}

export async function completeChallenge(input: {
  challengeId: string;
  answers?: Record<string, string | Record<string, string>>;
}) {
  const { data, error } = await client().rpc('complete_challenge', {
    p_challenge_id: input.challengeId,
    p_answers: input.answers ?? {},
    p_local_date: localDateString(),
  });
  if (error) throw error;
  return data as QuizResult & { metRules?: boolean; detail?: string };
}

export async function loadWatchlists(userId: string) {
  const { data, error } = await client()
    .from('watchlists')
    .select('id, name, watchlist_items(symbol)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as { id: string; name: string; watchlist_items: { symbol: string }[] }[];
}

export async function createWatchlist(userId: string, name: string) {
  const { data, error } = await client().from('watchlists').insert({ user_id: userId, name }).select('id, name').single();
  if (error) throw error;
  return data;
}

export async function toggleWatch(watchlistId: string, symbol: string, present: boolean) {
  if (present) {
    const { error } = await client().from('watchlist_items').delete().eq('watchlist_id', watchlistId).eq('symbol', symbol);
    if (error) throw error;
    return;
  }
  const { error } = await client().from('watchlist_items').insert({ watchlist_id: watchlistId, symbol });
  if (error) throw error;
}

export async function askTutor(message: string) {
  return invoke<{ reply: string; disclaimer: string }>('ai-tutor', { message });
}

export async function loadTutorMessages(userId: string) {
  const { data, error } = await client()
    .from('ai_messages')
    .select('id, role, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

export async function loadPreferences(userId: string) {
  const { data, error } = await client().from('notification_preferences').select('*').eq('user_id', userId).single();
  if (error) throw error;
  return data as {
    streak_reminders: boolean;
    lesson_reminders: boolean;
    challenge_reminders: boolean;
    reminder_hour: number;
  };
}

export async function savePreferences(
  userId: string,
  patch: { streak_reminders?: boolean; lesson_reminders?: boolean; challenge_reminders?: boolean; reminder_hour?: number; push_token?: string | null },
) {
  const { error } = await client().from('notification_preferences').update(patch).eq('user_id', userId);
  if (error) throw error;
}

export async function quizAccuracy(userId: string) {
  const { data, error } = await client().from('quiz_results').select('score, total').eq('user_id', userId);
  if (error) throw error;
  const rows = data ?? [];
  const score = rows.reduce((sum, row) => sum + Number(row.score), 0);
  const total = rows.reduce((sum, row) => sum + Number(row.total), 0);
  return { score, total, ratio: total === 0 ? null : score / total };
}

export async function categoryAccuracy(userId: string) {
  const { data, error } = await client().from('quiz_results').select('lesson_id, score, total').eq('user_id', userId);
  if (error) throw error;
  const buckets = new Map<string, { score: number; total: number }>();
  for (const row of data ?? []) {
    const lesson = lessonById(row.lesson_id as string);
    const key = lesson?.category ?? 'other';
    const bucket = buckets.get(key) ?? { score: 0, total: 0 };
    bucket.score += Number(row.score);
    bucket.total += Number(row.total);
    buckets.set(key, bucket);
  }
  return [...buckets.entries()].map(([category, value]) => ({
    category,
    ratio: value.total === 0 ? 0 : value.score / value.total,
    total: value.total,
  }));
}
