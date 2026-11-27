import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { loadTransactions } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';
import { formatMoney, formatShares, formatTimestamp } from '@/lib/format';
import type { TransactionRow } from '@/lib/types';

export default function HistoryScreen() {
  const { session } = useAuth();
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    loadTransactions(session.user.id).then(setRows).catch((caught) => setError(errorMessage(caught)));
  }, [session]);

  return (
    <StackScreen>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {rows.length === 0 ? <Text style={styles.muted}>No simulated trades yet.</Text> : null}
      {rows.map((row) => (
        <Card key={row.id}>
          <Text style={styles.title}>{row.side === 'buy' ? 'Bought' : 'Sold'} {row.symbol}</Text>
          <Text style={styles.body}>{formatShares(Number(row.quantity))} shares at {formatMoney(Number(row.price))} · {formatMoney(Number(row.notional))}</Text>
          <Text style={styles.muted}>Recorded {formatTimestamp(row.created_at)}. Market time {formatTimestamp(row.market_as_of)}.</Text>
          <Text style={styles.muted}>{row.source_label}</Text>
          <Text style={styles.muted}>{row.disclosure}</Text>
        </Card>
      ))}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '700', fontSize: 16 },
  body: { color: colors.text, lineHeight: 22 },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  error: { color: colors.negative },
});
