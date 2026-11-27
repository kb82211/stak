import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, Title } from '@/components/ui';
import { lessonsForPath } from '@/content';
import { challengeForDate } from '@/content/challenges';
import { pathById } from '@/content/paths';
import { colors, radius } from '@/constants/theme';
import { loadProgress } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

export default function LearnScreen() {
  const { session, profile } = useAuth();
  const router = useRouter();
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const path = pathById(profile?.learning_path_id);
  const pathLessons = lessonsForPath(path.id);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      loadProgress(session.user.id)
        .then((rows) => setPassed(new Set(rows.filter((row) => row.passed).map((row) => row.lesson_id))))
        .catch((caught) => setError(errorMessage(caught)));
    }, [session]),
  );

  const done = pathLessons.filter((lesson) => passed.has(lesson.id)).length;

  return (
    <Screen>
      <Title>Learn</Title>
      <Card>
        <Text style={styles.path}>{path.title}</Text>
        <Text style={styles.muted}>{path.description}</Text>
        <Text style={styles.muted}>{done} of {pathLessons.length} passed</Text>
        <Button label="Switch path" tone="secondary" onPress={() => router.push('/paths')} />
      </Card>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {pathLessons.map((lesson, index) => {
        const locked = lesson.premium && profile?.plan !== 'premium';
        return (
          <Pressable key={lesson.id} onPress={() => router.push(locked ? '/plus' : `/lesson/${lesson.id}`)} style={styles.lesson}>
            <View style={styles.index}><Text style={styles.indexText}>{passed.has(lesson.id) ? '✓' : index + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.muted}>{lesson.minutes} min · {locked ? 'Stak Plus' : 'Included'} · {lesson.summary}</Text>
            </View>
          </Pressable>
        );
      })}
      <Button label="Glossary" tone="ghost" onPress={() => router.push('/glossary')} />
      <Button label="Today’s challenge" tone="secondary" onPress={() => router.push(`/challenge/${challengeForDate(new Date()).id}`)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  path: { color: colors.text, fontSize: 20, fontWeight: '700' },
  muted: { color: colors.muted, lineHeight: 18, fontSize: 13 },
  error: { color: colors.negative },
  lesson: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  index: { width: 32, height: 32, borderRadius: radius.pill, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  indexText: { color: colors.emeraldText, fontWeight: '700' },
  lessonTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
