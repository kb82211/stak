import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { QuestionCard } from '@/components/question';
import { Button, Card, StackScreen } from '@/components/ui';
import { challenges } from '@/content/challenges';
import { colors } from '@/constants/theme';
import { completeChallenge, refreshPortfolio, type QuizResult } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const challenge = challenges.find((item) => item.id === String(id));
  const { profile } = useAuth();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | Record<string, string>>>({});
  const [result, setResult] = useState<(QuizResult & { detail?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (challenge?.type === 'portfolio') {
      refreshPortfolio().catch((caught) => setError(errorMessage(caught)));
    }
  }, [challenge?.type]);

  if (!challenge) return <StackScreen><Text style={styles.body}>That challenge is not in today’s catalog.</Text></StackScreen>;
  if (challenge.premium && profile?.plan !== 'premium') {
    return (
      <StackScreen>
        <Text style={styles.body}>This challenge is part of Stak Plus. Knowledge and literacy challenges stay in the free rotation.</Text>
        <Button label="See Stak Plus" onPress={() => router.push('/plus')} />
      </StackScreen>
    );
  }

  async function submit() {
    if (!challenge) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await completeChallenge({ challengeId: challenge.id, answers }));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <StackScreen>
      <Stack.Screen options={{ title: challenge.title }} />
      <Text style={styles.kicker}>{challenge.difficulty} · {challenge.minutes} min · {challenge.premium ? 'Stak Plus' : 'Included'}</Text>
      <Text style={styles.body}>{challenge.instructions}</Text>
      {challenge.rules ? (
        <Card>
          <Text style={styles.body}>At least {challenge.rules.minHoldings} holdings, {challenge.rules.minSectors} sectors, and no priced holding above {Math.round(challenge.rules.maxWeight * 100)}%.</Text>
          {challenge.rules.requireStockAndEtf ? <Text style={styles.body}>Include at least one stock and one ETF from the directory.</Text> : null}
        </Card>
      ) : null}
      {challenge.questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id]}
          locked={Boolean(result?.passed)}
          result={result?.results.find((item) => item.id === question.id)}
          onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
        />
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result ? <Text style={styles.body}>{result.passed ? `Complete. +${result.xpAwarded} XP.` : result.detail ?? 'Not complete yet.'} {challenge.explanation}</Text> : null}
      {!result?.passed ? <Button label={challenge.type === 'portfolio' ? 'Check portfolio' : 'Submit'} busy={busy} onPress={submit} /> : null}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.emerald, fontWeight: '700' },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
  error: { color: colors.negative, lineHeight: 20 },
});
