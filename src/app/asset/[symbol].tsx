import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LineChart } from '@/components/charts';
import { Button, Card, Disclaimer, Pill, StackScreen } from '@/components/ui';
import { assetBySymbol } from '@/content/assets';
import { colors } from '@/constants/theme';
import { fetchBars, fetchQuotes, loadWatchlists, lookupSymbol, recordExploration, toggleWatch } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatPercent, formatTimestamp } from '@/lib/format';
import type { BarPoint, MarketAsset, Quote } from '@/lib/types';

const ranges = ['1D', '1M', '3M', '1Y'] as const;

export default function AssetScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const ticker = String(symbol ?? '').toUpperCase();
  const router = useRouter();
  const { session } = useAuth();
  const known = assetBySymbol(ticker);
  const [asset, setAsset] = useState<MarketAsset | null>(known ? {
    symbol: known.symbol,
    name: known.name,
    assetType: known.assetType,
    sector: known.sector,
    description: known.description,
    exchange: null,
  } : null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [bars, setBars] = useState<BarPoint[]>([]);
  const [range, setRange] = useState<(typeof ranges)[number]>('1M');
  const [chartLabel, setChartLabel] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const [watchlistId, setWatchlistId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const found = asset ?? (await lookupSymbol(ticker));
        if (!cancelled) setAsset(found);
        if (!found) {
          if (!cancelled) setError('The provider did not return this symbol, so there is no price to show.');
          return;
        }
        const [quotes] = await Promise.all([fetchQuotes([ticker]), recordExploration(ticker).catch(() => null)]);
        if (!cancelled) setQuote(quotes[0] ?? null);
        if (!quotes[0] && !cancelled) setError('The provider did not return a price for this symbol.');
      } catch (caught) {
        if (!cancelled) setError(errorMessage(caught));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ticker]);

  useEffect(() => {
    let cancelled = false;
    fetchBars(ticker, range)
      .then((result) => {
        if (cancelled) return;
        setBars(result.bars);
        setChartLabel(`${result.rangeLabel}. ${result.sourceLabel}`);
      })
      .catch((caught) => {
        if (!cancelled) setChartLabel(errorMessage(caught));
      });
    return () => {
      cancelled = true;
    };
  }, [ticker, range]);

  useEffect(() => {
    if (!session) return;
    loadWatchlists(session.user.id).then((lists) => {
      const main = lists[0];
      if (!main) return;
      setWatchlistId(main.id);
      setWatching(main.watchlist_items.some((item) => item.symbol === ticker));
    }).catch(() => undefined);
  }, [session, ticker]);

  return (
    <StackScreen>
      <Stack.Screen options={{ title: ticker }} />
      <Text style={styles.name}>{asset?.name ?? 'Looking up symbol'}</Text>
      <Text style={styles.muted}>{asset ? `${asset.assetType.toUpperCase()}${asset.sector ? ` · ${asset.sector}` : ''}` : ticker}</Text>
      {quote ? (
        <Card>
          <Text style={styles.price}>{formatMoney(quote.price)}</Text>
          {quote.change != null && quote.changePercent != null ? (
            <Pill label={`${quote.change >= 0 ? '+' : ''}${formatMoney(quote.change)} ${formatPercent(quote.changePercent)}`} tone={quote.change >= 0 ? 'up' : 'down'} />
          ) : null}
          <Text style={styles.muted}>{quote.sourceLabel}</Text>
          <Text style={styles.muted}>As of {formatTimestamp(quote.asOf)}{quote.exchange ? ` · print venue ${quote.exchange}` : ''}</Text>
          {quote.volume != null ? <Text style={styles.muted}>Session volume on the daily bar: {quote.volume.toLocaleString()}</Text> : null}
        </Card>
      ) : (
        <Card><Text style={styles.body}>{error ?? 'Requesting a price…'}</Text></Card>
      )}
      <View style={styles.ranges}>
        {ranges.map((item) => (
          <Pressable key={item} onPress={() => setRange(item)} style={[styles.range, item === range && styles.rangeOn]}>
            <Text style={styles.rangeText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Card>
        <LineChart values={bars.map((bar) => bar.c)} positive={(quote?.change ?? 0) >= 0} />
        {chartLabel ? <Text style={styles.muted}>{chartLabel}</Text> : null}
        {bars.length === 0 ? <Text style={styles.muted}>No bars were returned for this range.</Text> : null}
      </Card>
      <Card>
        <Text style={styles.heading}>What this is</Text>
        <Text style={styles.body}>{asset?.description ?? 'No educational description is stored for this symbol. Stak will not invent a business summary or a financial ratio.'}</Text>
        <Text style={styles.muted}>Fundamental ratios such as P/E are not part of the connected Alpaca market-data feed, so they are not shown.</Text>
      </Card>
      <Button label="Buy with virtual cash" onPress={() => router.push(`/trade/${ticker}?side=buy`)} disabled={!quote} />
      <Button label="Sell virtual shares" tone="secondary" onPress={() => router.push(`/trade/${ticker}?side=sell`)} disabled={!quote} />
      <Button
        label={watching ? 'Remove from watchlist' : 'Add to watchlist'}
        tone="ghost"
        onPress={async () => {
          if (!watchlistId) return;
          await toggleWatch(watchlistId, ticker, watching);
          setWatching((value) => !value);
        }}
      />
      <Disclaimer>Buy and sell here record a simulated fill only. Stak does not send an order.</Disclaimer>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  name: { color: colors.text, fontSize: 28, fontWeight: '700' },
  price: { color: colors.text, fontSize: 36, fontWeight: '700', fontVariant: ['tabular-nums'] },
  muted: { color: colors.muted, lineHeight: 18, fontSize: 13 },
  body: { color: colors.text, lineHeight: 22 },
  heading: { color: colors.text, fontWeight: '700', fontSize: 18 },
  ranges: { flexDirection: 'row', gap: 8 },
  range: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: colors.card },
  rangeOn: { backgroundColor: colors.emeraldDim },
  rangeText: { color: colors.text, fontWeight: '700' },
});
