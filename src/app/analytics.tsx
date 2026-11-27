import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { categoryAccuracy, quizAccuracy } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

const labels: Record<string, string> = {
  fundamentals: 'Investing fundamentals',
  portfolio: 'Portfolio',
  markets: 'Markets',
  personal: 'Personal finance',
};

export default function AnalyticsScreen() {
  const { session, profile } = useAuth();
  const [rows, setRows] = useState<{ category: string; ratio: number; total: number }[]>([]);
  const [overall, setOverall] = useState<string>('No quizzes yet');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || profile?.plan !== 'premium') return;
    Promise.all([categoryAccuracy(session.user.id), quizAccuracy(session.user.id)])
      .then(([categories, accuracy]) => {
        setRows(categories);
        setOverall(accuracy.ratio == null ? 'No quizzes yet' : `${Math.round(accuracy.ratio * 100)}% across ${accuracy.total} questions`);
      })
      .catch((caught) => setError(errorMessage(caught)));
  }, [session, profile?.plan]);

  if (profile?.plan !== 'premium') {
    return <StackScreen><Text style={styles.body}>Learning analytics unlock with Stak Plus. Billing is not connected in this build.</Text></StackScreen>;
  }

  return (
    <StackScreen>
      <Card>
        <Text style={styles.title}>Quiz accuracy</Text>
        <Text style={styles.body}>{overall}</Text>
      </Card>
      {rows.map((row) => (
        <Card key={row.category}>
          <Text style={styles.title}>{labels[row.category] ?? row.category}</Text>
          <Text style={styles.body}>{Math.round(row.ratio * 100)}% of {row.total} answers</Text>
        </Card>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '700', fontSize: 18 },
  body: { color: colors.text, lineHeight: 22 },
  error: { color: colors.negative },
});
