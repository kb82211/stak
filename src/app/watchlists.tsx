import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button, Card, Field, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { createWatchlist, fetchQuotes, loadWatchlists } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatPercent } from '@/lib/format';
import type { Quote } from '@/lib/types';

export default function WatchlistsScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState<{ id: string; name: string; watchlist_items: { symbol: string }[] }[]>([]);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    if (!session) return;
    const next = await loadWatchlists(session.user.id);
    setLists(next);
    const symbols = [...new Set(next.flatMap((list) => list.watchlist_items.map((item) => item.symbol)))];
    if (symbols.length === 0) return;
    try {
      const rows = await fetchQuotes(symbols);
      setQuotes(Object.fromEntries(rows.map((row) => [row.symbol, row])));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  useEffect(() => {
    reload().catch((caught) => setError(errorMessage(caught)));
  }, [session]);

  return (
    <StackScreen>
      {lists.map((list) => (
        <Card key={list.id}>
          <Text style={styles.title}>{list.name}</Text>
          {list.watchlist_items.length === 0 ? <Text style={styles.muted}>Nothing saved yet.</Text> : null}
          {list.watchlist_items.map((item) => {
            const quote = quotes[item.symbol];
            return (
              <Pressable key={item.symbol} onPress={() => router.push(`/asset/${item.symbol}`)} style={styles.row}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.muted}>{quote ? `${formatMoney(quote.price)} ${quote.changePercent != null ? formatPercent(quote.changePercent) : ''}` : 'No price'}</Text>
              </Pressable>
            );
          })}
        </Card>
      ))}
      <Field label="New watchlist" value={name} onChangeText={setName} autoCapitalize="words" />
      <Button
        label="Create watchlist"
        onPress={async () => {
          if (!session || !name.trim()) return;
          await createWatchlist(session.user.id, name.trim());
          setName('');
          await reload();
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '700', fontSize: 18 },
  muted: { color: colors.muted },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  symbol: { color: colors.text, fontWeight: '700' },
  error: { color: colors.negative },
});
