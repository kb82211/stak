import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import { QuestionCard } from '@/components/question';
import { Button, Card, Disclaimer, StackScreen } from '@/components/ui';
import { glossaryEntry } from '@/content/glossary';
import { lessonById } from '@/content';
import { colors } from '@/constants/theme';
import { submitLesson, type QuizResult } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessonById(String(id));
  const { profile } = useAuth();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | Record<string, string>>>({});
  const [scenarioDone, setScenarioDone] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!lesson) return <StackScreen><Text style={styles.body}>That lesson is not in this version.</Text></StackScreen>;
  const current = lesson;
  const locked = current.premium && profile?.plan !== 'premium';
  const scenario = current.scenario;
  const localScenario = scenario.type !== 'match' && answers[scenario.id] === scenario.answer;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const graded = await submitLesson(current.id, answers);
      setResult(graded);
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(graded.passed ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <StackScreen>
      <Stack.Screen options={{ title: current.title }} />
      <Text style={styles.kicker}>{current.minutes} min · {current.premium ? 'Stak Plus' : 'Included'}</Text>
      <Text style={styles.summary}>{current.summary}</Text>
      {locked ? (
        <Card>
          <Text style={styles.body}>The rest of this lesson is part of Stak Plus. The free path still includes a full beginner sequence.</Text>
          <Button label="See Stak Plus" onPress={() => router.push('/plus')} />
        </Card>
      ) : (
        <>
          {current.sections.map((section) => (
            <Card key={section.heading}>
              <Text style={styles.heading}>{section.heading}</Text>
              <Text style={styles.body}>{section.body}</Text>
              {section.example ? <Text style={styles.example}>{section.example}</Text> : null}
            </Card>
          ))}
          <Text style={styles.heading}>Try this situation</Text>
          <QuestionCard
            question={scenario}
            value={answers[scenario.id]}
            locked={scenarioDone}
            result={scenarioDone && scenario.type !== 'match' ? { correct: localScenario, explanation: scenario.explanation } : undefined}
            onChange={(value) => setAnswers((current) => ({ ...current, [scenario.id]: value }))}
          />
          {!scenarioDone ? <Button label="Check" onPress={() => setScenarioDone(true)} disabled={answers[scenario.id] == null} /> : null}
          {scenarioDone ? (
            <>
              <Text style={styles.heading}>Quiz</Text>
              {current.quiz.map((question) => {
                const graded = result?.results.find((item) => item.id === question.id);
                return (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    value={answers[question.id]}
                    locked={Boolean(result)}
                    result={graded}
                    onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                  />
                );
              })}
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {result ? (
                <Card>
                  <Text style={styles.heading}>{result.passed ? 'Passed' : 'Not passed yet'}</Text>
                  <Text style={styles.body}>{result.score} of {result.total}. {result.xpAwarded ? `+${result.xpAwarded} XP.` : 'No XP this time. You can try the quiz again.'}</Text>
                  <Text style={styles.body}>Level {result.level} · {result.totalXp} XP · {result.streak}-day streak</Text>
                  {current.takeaways.map((item) => <Text key={item} style={styles.body}>• {item}</Text>)}
                </Card>
              ) : (
                <Button
                  label="Submit quiz"
                  busy={busy}
                  disabled={current.quiz.some((question) => answers[question.id] == null)}
                  onPress={submit}
                />
              )}
            </>
          ) : null}
          <Card>
            <Text style={styles.heading}>Words in this lesson</Text>
            {current.terms.map((term) => (
              <Text key={term} style={styles.body}>{term}: {glossaryEntry(term)?.definition ?? 'See the glossary.'}</Text>
            ))}
          </Card>
        </>
      )}
      <Disclaimer>Examples that use round numbers are illustrations, not quotes or forecasts.</Disclaimer>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.emerald, fontWeight: '700' },
  summary: { color: colors.text, fontSize: 18, lineHeight: 26 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
  example: { color: colors.emeraldText, lineHeight: 22 },
  error: { color: colors.negative },
});
