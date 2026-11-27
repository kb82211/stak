import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AllocationChart, LineChart } from '@/components/charts';
import { Card, Disclaimer, Pill, Screen, Title } from '@/components/ui';
import { assetBySymbol } from '@/content/assets';
import { colors } from '@/constants/theme';
import { allocationByPrice, availablePeriods, buildInsights, dailyChange, filterSnapshots, summarizePortfolio, type HoldingValuation, type Period } from '@/domain/portfolio';
import { STARTING_CASH } from '@/domain/progress';
import { loadAccount, loadHoldings, loadSnapshots, refreshPortfolio } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatPercent, formatShares, formatSignedMoney, localDateString } from '@/lib/format';
import type { Quote } from '@/lib/types';

export default function InvestScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [cash, setCash] = useState<number | null>(null);
  const [holdings, setHoldings] = useState<HoldingValuation[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [points, setPoints] = useState<{ total: number; at: string }[]>([]);
  const [period, setPeriod] = useState<Period>('ALL');
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      void (async () => {
        try {
          const [accountCash, rows] = await Promise.all([loadAccount(session.user.id), loadHoldings(session.user.id)]);
          let nextQuotes: Quote[] = [];
          try {
            const priced = await refreshPortfolio();
            nextQuotes = priced.quotes;
            if (priced.missing.length) setError(`Missing prices: ${priced.missing.join(', ')}.`);
            else setError(null);
          } catch (caught) {
            setError(errorMessage(caught));
          }
          const snapshots = await loadSnapshots(session.user.id);
          setCash(accountCash);
          setQuotes(nextQuotes);
          setHoldings(
            rows.map((row) => {
              const asset = assetBySymbol(row.symbol);
              const quote = nextQuotes.find((item) => item.symbol === row.symbol);
              return {
                symbol: row.symbol,
                name: asset?.name ?? row.symbol,
                assetType: asset?.assetType ?? 'unknown',
                sector: asset?.sector ?? null,
                quantity: row.quantity,
                avgCost: row.avg_cost,
                price: quote?.price ?? null,
                priceAsOf: quote?.asOf ?? null,
              };
            }),
          );
          setPoints(snapshots.map((snapshot) => ({ total: snapshot.total_value, at: snapshot.recorded_at })));
        } catch (caught) {
          setError(errorMessage(caught));
        }
      })();
    }, [session]),
  );

  const summary = summarizePortfolio({ cash: cash ?? 0, holdings, startingCash: STARTING_CASH });
  const periods = availablePeriods(points, Date.now());
  const selected = periods.includes(period) ? period : periods[0] ?? 'ALL';
  const series = filterSnapshots(points, selected, Date.now());
  const change = dailyChange(points, localDateString());
  const slices = allocationByPrice(holdings);

  return (
    <Screen>
      <Title>Portfolio</Title>
      <Card>
        <Text style={styles.money}>{summary.complete && summary.total != null ? formatMoney(summary.total) : 'Waiting on prices'}</Text>
        <Text style={styles.muted}>Virtual cash {formatMoney(summary.cash)}</Text>
        <Text style={styles.muted}>Cost of open holdings {formatMoney(summary.investedCost)}</Text>
        {summary.profit != null ? <Text style={styles.muted}>Simulated profit {formatSignedMoney(summary.profit)} · Return {formatPercent((summary.overallReturn ?? 0) * 100)}</Text> : <Text style={styles.muted}>Return stays hidden until every holding has a provider price.</Text>}
        {change ? <Pill label={`${formatSignedMoney(change.amount)} today`} tone={change.amount >= 0 ? 'up' : 'down'} /> : null}
        <View style={styles.periods}>
          {periods.map((item) => (
            <Pressable key={item} onPress={() => setPeriod(item)} style={[styles.period, item === selected && styles.periodOn]}>
              <Text style={styles.periodText}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <LineChart values={series.map((point) => point.total)} positive={(change?.amount ?? 1) >= 0} />
        {periods.length === 0 ? <Text style={styles.muted}>Chart ranges appear after two saved valuations fall inside them.</Text> : null}
      </Card>
      {error ? <Text style={styles.warn}>{error}</Text> : null}
      <Card>
        <Text style={styles.heading}>Holdings</Text>
        {holdings.length === 0 ? <Text style={styles.muted}>You still have the full {formatMoney(STARTING_CASH)} virtual balance. Explore a symbol to practice a trade.</Text> : null}
        {holdings.map((holding) => {
          const value = holding.price == null ? null : holding.quantity * holding.price;
          const pnl = value == null ? null : value - holding.quantity * holding.avgCost;
          const weight = slices.find((slice) => slice.symbol === holding.symbol)?.weight;
          return (
            <Pressable key={holding.symbol} onPress={() => router.push(`/asset/${holding.symbol}`)} style={styles.holding}>
              <View style={{ flex: 1 }}>
                <Text style={styles.symbol}>{holding.symbol}</Text>
                <Text style={styles.muted}>{formatShares(holding.quantity)} shares · avg {formatMoney(holding.avgCost)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.symbol}>{value == null ? '—' : formatMoney(value)}</Text>
                <Text style={styles.muted}>{pnl == null ? 'No price' : formatSignedMoney(pnl)}{weight != null ? ` · ${Math.round(weight * 100)}%` : ''}</Text>
              </View>
            </Pressable>
          );
        })}
      </Card>
      {slices.length > 0 ? (
        <Card>
          <Text style={styles.heading}>Allocation by latest price</Text>
          <AllocationChart slices={slices.map((slice) => ({ label: slice.symbol, weight: slice.weight }))} />
        </Card>
      ) : null}
      <Card>
        {buildInsights({ holdings, snapshots: points }).map((insight) => (
          <Text key={insight.id} style={styles.body}>{insight.title}. {insight.body}</Text>
        ))}
      </Card>
      <Pressable onPress={() => router.push('/history')}><Text style={styles.link}>Transaction history</Text></Pressable>
      <Disclaimer>Simulated holdings are educational records. A fill uses the provider price shown at the time and is not an exchange execution.</Disclaimer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  money: { color: colors.text, fontSize: 36, fontWeight: '700', fontVariant: ['tabular-nums'] },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  body: { color: colors.text, lineHeight: 22 },
  warn: { color: colors.gold, lineHeight: 18 },
  periods: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  period: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, backgroundColor: colors.bg },
  periodOn: { backgroundColor: colors.emeraldDim },
  periodText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  holding: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  symbol: { color: colors.text, fontWeight: '700', fontVariant: ['tabular-nums'] },
  link: { color: colors.emeraldText, fontWeight: '700' },
});
