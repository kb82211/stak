import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LineChart } from '@/components/charts';
import { Button, Card, Disclaimer, Eyebrow, LoadingBlock, Pill, Screen } from '@/components/ui';
import { challengeForDate } from '@/content/challenges';
import { assetBySymbol } from '@/content/assets';
import { lessonById, lessonsForPath } from '@/content';
import { colors } from '@/constants/theme';
import { availablePeriods, buildInsights, dailyChange, filterSnapshots, summarizePortfolio, type HoldingValuation } from '@/domain/portfolio';
import { levelForXp, nextLevel, STARTING_CASH } from '@/domain/progress';
import { loadAccount, loadActivity, loadHoldings, loadProgress, loadSnapshots, refreshPortfolio } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatPercent, formatSignedMoney, localDateString } from '@/lib/format';

export default function HomeScreen() {
  const { session, profile } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<HomeState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session || !profile) return;
    try {
      const [cash, holdings, progress, activity, snapshots] = await Promise.all([
        loadAccount(session.user.id),
        loadHoldings(session.user.id),
        loadProgress(session.user.id),
        loadActivity(session.user.id),
        loadSnapshots(session.user.id),
      ]);
      let quotes: { symbol: string; price: number; asOf: string }[] = [];
      let quoteError: string | null = null;
      if (holdings.length > 0) {
        try {
          const priced = await refreshPortfolio();
          quotes = priced.quotes;
          if (priced.missing.length) {
            quoteError = `No provider price for ${priced.missing.join(', ')}. Totals that need those prices are hidden.`;
          }
        } catch (caught) {
          quoteError = errorMessage(caught);
        }
      } else {
        try {
          await refreshPortfolio();
        } catch {
          // Cash does not need a market price. A missing function only skips the snapshot.
        }
      }
      const freshSnapshots = await loadSnapshots(session.user.id);
      setState({
        cash,
        holdings,
        progress,
        activity,
        snapshots: freshSnapshots.length ? freshSnapshots : snapshots,
        quotes,
        quoteError,
      });
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, [session, profile]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!profile) return <Screen><LoadingBlock label="Opening your account" /></Screen>;
  if (error) return <Screen><Card><Text style={styles.body}>{error}</Text></Card></Screen>;
  if (!state) return <Screen><LoadingBlock /></Screen>;

  const level = levelForXp(profile.xp);
  const upcoming = nextLevel(profile.xp);
  const pathLessons = lessonsForPath(profile.learning_path_id);
  const passed = new Set(state.progress.filter((item) => item.passed).map((item) => item.lesson_id));
  const nextLesson = pathLessons.find((lesson) => !passed.has(lesson.id)) ?? pathLessons[0];
  const valued: HoldingValuation[] = state.holdings.map((holding) => {
    const asset = assetBySymbol(holding.symbol);
    const quote = state.quotes.find((item) => item.symbol === holding.symbol);
    return {
      symbol: holding.symbol,
      name: asset?.name ?? holding.symbol,
      assetType: asset?.assetType ?? 'unknown',
      sector: asset?.sector ?? null,
      quantity: holding.quantity,
      avgCost: holding.avg_cost,
      price: quote?.price ?? null,
      priceAsOf: quote?.asOf ?? null,
    };
  });
  const summary = summarizePortfolio({ cash: state.cash, holdings: valued, startingCash: STARTING_CASH });
  const points = state.snapshots.map((snapshot) => ({ total: snapshot.total_value, at: snapshot.recorded_at }));
  const today = localDateString();
  const change = dailyChange(points, today);
  const period = availablePeriods(points, Date.now()).includes('1W') ? '1W' : 'ALL';
  const chartPoints = filterSnapshots(points, period, Date.now());
  const challenge = challengeForDate(new Date());
  const objectives = [
    { label: 'Complete one lesson', done: state.activity.lessons > 0 },
    { label: 'Answer five questions', done: state.activity.questions >= 5 },
    { label: 'Explore a company or fund', done: state.activity.explorations > 0 },
    { label: 'Finish today’s challenge', done: state.activity.challenges > 0 },
  ];

  return (
    <Screen>
      <Eyebrow>{level.name}</Eyebrow>
      <Text style={styles.greeting}>{profile.username}</Text>
      <Card>
        <Text style={styles.label}>Daily progress</Text>
        <View style={styles.metrics}>
          <Metric label="Streak" value={`${profile.streak_current}d`} />
          <Metric label="XP" value={String(profile.xp)} />
          <Metric label="Lessons" value={String(passed.size)} />
        </View>
        <View style={styles.track}>
          <View style={{ width: `${upcoming ? Math.min(1, (profile.xp - level.minXp) / (upcoming.minXp - level.minXp)) * 100 : 100}%`, backgroundColor: colors.emerald, height: 8, borderRadius: 99 }} />
        </View>
        <Text style={styles.muted}>
          {upcoming ? `${upcoming.minXp - profile.xp} XP to ${upcoming.name}` : 'You have reached Financial Strategist.'} Daily goal: {profile.daily_goal_lessons} lesson{profile.daily_goal_lessons > 1 ? 's' : ''}.
        </Text>
      </Card>
      <Card>
        <Text style={styles.label}>Virtual portfolio</Text>
        <Text style={styles.money}>{summary.total == null ? 'Price incomplete' : formatMoney(summary.total)}</Text>
        {change ? <Pill label={`${formatSignedMoney(change.amount)} ${formatPercent(change.percent * 100)} today`} tone={change.amount >= 0 ? 'up' : 'down'} /> : <Text style={styles.muted}>Daily change appears after a valuation on two different days.</Text>}
        <Text style={styles.muted}>Cash {formatMoney(summary.cash)} · Cost of holdings {formatMoney(summary.investedCost)}</Text>
        {summary.total != null && summary.profit != null ? (
          <Text style={styles.muted}>Simulated gain on holdings {formatSignedMoney(summary.profit)}. Overall return {formatPercent((summary.overallReturn ?? 0) * 100)} from the {formatMoney(STARTING_CASH)} virtual start.</Text>
        ) : null}
        <LineChart values={chartPoints.map((point) => point.total)} positive={(change?.amount ?? 0) >= 0} />
        {state.quoteError ? <Text style={styles.warn}>{state.quoteError}</Text> : null}
      </Card>
      <Card>
        <Text style={styles.label}>Today</Text>
        {objectives.map((item) => (
          <Text key={item.label} style={styles.body}>{item.done ? '●' : '○'}  {item.label}</Text>
        ))}
        <Button label={challenge.title} tone="secondary" onPress={() => router.push(`/challenge/${challenge.id}`)} />
      </Card>
      {nextLesson ? (
        <Card>
          <Text style={styles.label}>Continue</Text>
          <Text style={styles.body}>{nextLesson.title}</Text>
          <Text style={styles.muted}>{nextLesson.minutes} min · {nextLesson.premium ? 'Stak Plus' : 'Included'}</Text>
          <Button label="Open lesson" onPress={() => router.push(`/lesson/${nextLesson.id}`)} />
        </Card>
      ) : null}
      <Card>
        <Text style={styles.label}>A note, not a recommendation</Text>
        {buildInsights({ holdings: valued, snapshots: points }).slice(0, 2).map((insight) => (
          <Text key={insight.id} style={styles.body}>{insight.title}. {insight.body}</Text>
        ))}
      </Card>
      <Button label="Ask the tutor" tone="secondary" onPress={() => router.push('/assistant')} />
      <Disclaimer>Virtual money has no cash value. Prices, when shown, come from the connected provider and carry that provider’s timestamp.</Disclaimer>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

type HomeState = {
  cash: number;
  holdings: { symbol: string; quantity: number; avg_cost: number }[];
  progress: { lesson_id: string; passed: boolean }[];
  activity: { lessons: number; questions: number; explorations: number; challenges: number };
  snapshots: { total_value: number; recorded_at: string }[];
  quotes: { symbol: string; price: number; asOf: string }[];
  quoteError: string | null;
};

const styles = StyleSheet.create({
  greeting: { color: colors.text, fontSize: 34, fontWeight: '700' },
  label: { color: colors.muted, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  money: { color: colors.text, fontSize: 36, fontWeight: '700', fontVariant: ['tabular-nums'] },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  body: { color: colors.text, fontSize: 15, lineHeight: 22 },
  warn: { color: colors.gold, fontSize: 13, lineHeight: 18 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  track: { height: 8, borderRadius: 99, backgroundColor: '#10161B', overflow: 'hidden' },
});
