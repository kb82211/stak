import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, Disclaimer, Pill, Screen, Title } from '@/components/ui';
import { popularEtfSymbols, popularStockSymbols, sectorSymbols } from '@/content/assets';
import { colors, radius } from '@/constants/theme';
import { fetchQuotes, searchCatalog } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatPercent } from '@/lib/format';
import type { Quote } from '@/lib/types';

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const results = searchCatalog(query).slice(0, query ? 30 : 12);

  useEffect(() => {
    const symbols = [...new Set([...popularStockSymbols, ...popularEtfSymbols, ...sectorSymbols])];
    fetchQuotes(symbols)
      .then((rows) => setQuotes(Object.fromEntries(rows.map((row) => [row.symbol, row]))))
      .catch((caught) => setNotice(errorMessage(caught)));
  }, []);

  return (
    <Screen>
      <Title>Explore</Title>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search name or ticker"
        placeholderTextColor={colors.faint}
        autoCapitalize="characters"
        style={styles.search}
      />
      {notice ? <Text style={styles.warn}>{notice}</Text> : null}
      <Section title="Popular stocks" symbols={popularStockSymbols} quotes={quotes} onPress={(symbol) => router.push(`/asset/${symbol}`)} />
      <Section title="Popular ETFs" symbols={popularEtfSymbols} quotes={quotes} onPress={(symbol) => router.push(`/asset/${symbol}`)} />
      <Section title="Sector funds" symbols={sectorSymbols} quotes={quotes} onPress={(symbol) => router.push(`/asset/${symbol}`)} />
      <Card>
        <Text style={styles.heading}>Indexes</Text>
        <Text style={styles.body}>
          Stak lists traded funds that track indexes, such as SPY for the S&P 500 and DIA for the Dow. The number on the fund is the fund’s market price, not the index level itself.
        </Text>
      </Card>
      {query ? (
        <Card>
          <Text style={styles.heading}>Directory</Text>
          {results.map((asset) => (
            <Pressable key={asset.symbol} onPress={() => router.push(`/asset/${asset.symbol}`)} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.symbol}>{asset.symbol}</Text>
                <Text style={styles.muted}>{asset.name}</Text>
              </View>
              <QuoteLabel quote={quotes[asset.symbol]} />
            </Pressable>
          ))}
          {results.length === 0 ? (
            <Pressable onPress={() => router.push(`/asset/${query.trim().toUpperCase()}`)}>
              <Text style={styles.link}>Look up {query.trim().toUpperCase()} with the data provider</Text>
            </Pressable>
          ) : null}
        </Card>
      ) : null}
      <Pressable onPress={() => router.push('/watchlists')}><Text style={styles.link}>Watchlists</Text></Pressable>
      <Disclaimer>Prices appear only when Alpaca returns them. IEX data is exchange-specific and is not labeled as consolidated US market data.</Disclaimer>
    </Screen>
  );
}

function Section({
  title,
  symbols,
  quotes,
  onPress,
}: {
  title: string;
  symbols: string[];
  quotes: Record<string, Quote>;
  onPress: (symbol: string) => void;
}) {
  return (
    <Card>
      <Text style={styles.heading}>{title}</Text>
      {symbols.map((symbol) => (
        <Pressable key={symbol} onPress={() => onPress(symbol)} style={styles.row}>
          <Text style={styles.symbol}>{symbol}</Text>
          <QuoteLabel quote={quotes[symbol]} />
        </Pressable>
      ))}
    </Card>
  );
}

function QuoteLabel({ quote }: { quote?: Quote }) {
  if (!quote) return <Text style={styles.muted}>No price</Text>;
  const tone = (quote.change ?? 0) < 0 ? 'down' : 'up';
  return (
    <View style={{ alignItems: 'flex-end', gap: 4 }}>
      <Text style={styles.symbol}>{formatMoney(quote.price)}</Text>
      {quote.changePercent != null ? <Pill label={formatPercent(quote.changePercent)} tone={tone} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 16,
  },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  body: { color: colors.muted, lineHeight: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, gap: 12 },
  symbol: { color: colors.text, fontWeight: '700' },
  muted: { color: colors.muted, fontSize: 12 },
  warn: { color: colors.gold, lineHeight: 18 },
  link: { color: colors.emeraldText, fontWeight: '700' },
});
