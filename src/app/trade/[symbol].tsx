import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Crypto from 'expo-crypto';

import { Button, Card, Disclaimer, Field, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { planBuy, planSell } from '@/domain/trade';
import { SIMULATED_FILL_DISCLOSURE } from '@/domain/market';
import { executeTrade, fetchQuotes, loadAccount, loadHoldings } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatShares, formatTimestamp } from '@/lib/format';
import type { Quote } from '@/lib/types';

export default function TradeScreen() {
  const params = useLocalSearchParams<{ symbol: string; side?: string }>();
  const ticker = String(params.symbol ?? '').toUpperCase();
  const router = useRouter();
  const { session } = useAuth();
  const [side, setSide] = useState<'buy' | 'sell'>(params.side === 'sell' ? 'sell' : 'buy');
  const [mode, setMode] = useState<'dollars' | 'shares'>('dollars');
  const [amount, setAmount] = useState('100');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [cash, setCash] = useState(0);
  const [owned, setOwned] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    void Promise.all([fetchQuotes([ticker]), loadAccount(session.user.id), loadHoldings(session.user.id)])
      .then(([quotes, accountCash, holdings]) => {
        setQuote(quotes[0] ?? null);
        setCash(accountCash);
        setOwned(holdings.find((holding) => holding.symbol === ticker)?.quantity ?? 0);
        if (!quotes[0]) setError('There is no provider price, so a simulated order cannot be prepared.');
      })
      .catch((caught) => setError(errorMessage(caught)));
  }, [session, ticker]);

  let estimate: { quantity: number; notional: number } | null = null;
  let estimateError: string | null = null;
  if (quote) {
    try {
      const value = Number(amount);
      estimate = side === 'buy'
        ? planBuy({ mode, amount: value, price: quote.price, cash })
        : planSell({ mode, amount: value, price: quote.price, owned });
    } catch (caught) {
      estimateError = errorMessage(caught);
    }
  }

  async function submit() {
    if (!quote || !estimate) return;
    setBusy(true);
    setError(null);
    try {
      const result = await executeTrade({
        symbol: ticker,
        side,
        mode,
        amount: Number(amount),
        idempotencyKey: Crypto.randomUUID(),
      });
      setDone(`Recorded ${formatShares(result.quantity)} virtual shares at ${formatMoney(result.price)}. Cash is now ${formatMoney(result.cash)}.`);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <StackScreen>
      <Stack.Screen options={{ title: `${side === 'buy' ? 'Buy' : 'Sell'} ${ticker}` }} />
      <View style={styles.switcher}>
        {(['buy', 'sell'] as const).map((item) => (
          <Pressable key={item} onPress={() => { setSide(item); setConfirming(false); }} style={[styles.chip, side === item && styles.chipOn]}>
            <Text style={styles.chipText}>{item === 'buy' ? 'Buy' : 'Sell'}</Text>
          </Pressable>
        ))}
        {(['dollars', 'shares'] as const).map((item) => (
          <Pressable key={item} onPress={() => { setMode(item); setConfirming(false); }} style={[styles.chip, mode === item && styles.chipOn]}>
            <Text style={styles.chipText}>{item === 'dollars' ? 'Dollars' : 'Shares'}</Text>
          </Pressable>
        ))}
      </View>
      <Card>
        <Text style={styles.muted}>Virtual cash {formatMoney(cash)}</Text>
        <Text style={styles.muted}>Shares held {formatShares(owned)}</Text>
        {quote ? (
          <>
            <Text style={styles.price}>{formatMoney(quote.price)}</Text>
            <Text style={styles.muted}>{quote.sourceLabel}</Text>
            <Text style={styles.muted}>Price time {formatTimestamp(quote.asOf)}</Text>
          </>
        ) : null}
      </Card>
      <Field label={mode === 'dollars' ? 'Virtual dollars' : 'Shares'} value={amount} onChangeText={(value) => { setAmount(value); setConfirming(false); }} keyboardType="decimal-pad" />
      {estimate ? <Text style={styles.body}>About {formatShares(estimate.quantity)} shares · {formatMoney(estimate.notional)}</Text> : null}
      {estimateError ? <Text style={styles.error}>{estimateError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {done ? <Text style={styles.body}>{done}</Text> : null}
      {confirming && !done ? (
        <Card>
          <Text style={styles.body}>Confirm a simulated {side} of {ticker}. {SIMULATED_FILL_DISCLOSURE}</Text>
          <Button label="Confirm simulated order" busy={busy} onPress={submit} />
        </Card>
      ) : null}
      {!done ? <Button label="Review order" disabled={!estimate} onPress={() => setConfirming(true)} /> : <Button label="Done" onPress={() => router.back()} />}
      <Disclaimer>The server fetches the price again when you confirm. If that price is missing or older than 15 minutes, the order is rejected.</Disclaimer>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  switcher: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.emeraldDim },
  chipText: { color: colors.text, fontWeight: '700' },
  muted: { color: colors.muted, lineHeight: 18 },
  price: { color: colors.text, fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'] },
  body: { color: colors.text, lineHeight: 22 },
  error: { color: colors.negative, lineHeight: 20 },
});
