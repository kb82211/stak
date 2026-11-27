import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, RowLink, Screen, Title } from '@/components/ui';
import { achievements } from '@/content/achievements';
import { colors, radius } from '@/constants/theme';
import { levelForXp } from '@/domain/progress';
import { loadAchievements, loadProgress, loadTransactions, quizAccuracy } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { initials } from '@/lib/format';

export default function ProfileScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ lessons: 0, accuracy: '—', trades: 0, badges: 0 });

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      void Promise.all([
        loadProgress(profile.id),
        quizAccuracy(profile.id),
        loadTransactions(profile.id),
        loadAchievements(profile.id),
      ]).then(([progress, accuracy, trades, badges]) => {
        setStats({
          lessons: progress.filter((row) => row.passed).length,
          accuracy: accuracy.ratio == null ? '—' : `${Math.round(accuracy.ratio * 100)}%`,
          trades: trades.length,
          badges: badges.length,
        });
      });
    }, [profile]),
  );

  if (!profile) return null;
  const level = levelForXp(profile.xp);

  return (
    <Screen>
      <View style={styles.header}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}><Text style={styles.initials}>{initials(profile.username)}</Text></View>
        )}
        <View style={{ flex: 1 }}>
          <Title>{profile.username}</Title>
          <Text style={styles.muted}>{level.name} · {profile.plan === 'premium' ? 'Stak Plus' : 'Free'}</Text>
        </View>
      </View>
      <Card>
        <Stat label="XP" value={String(profile.xp)} />
        <Stat label="Streak" value={`${profile.streak_current} days`} />
        <Stat label="Longest streak" value={`${profile.streak_longest} days`} />
        <Stat label="Lessons passed" value={String(stats.lessons)} />
        <Stat label="Quiz accuracy" value={stats.accuracy} />
        <Stat label="Simulated trades" value={String(stats.trades)} />
        <Stat label="Achievements" value={`${stats.badges}/${achievements.length}`} />
      </Card>
      <Card>
        <Text style={styles.streakTitle}>Streak</Text>
        <View style={styles.week}>
          {Array.from({ length: 7 }, (_, index) => {
            const filled = profile.streak_current > 0 && index >= 7 - Math.min(profile.streak_current, 7);
            return <View key={index} style={[styles.day, filled && styles.dayOn]} />;
          })}
        </View>
        <Text style={styles.muted}>The row shows the current streak, up to seven days. Older days are kept as your longest streak of {profile.streak_longest}.</Text>
      </Card>
      <RowLink title="Achievements" onPress={() => router.push('/achievements')} />
      <RowLink title="Learning analytics" subtitle={profile.plan === 'premium' ? 'Accuracy by topic' : 'Included with Stak Plus'} onPress={() => router.push(profile.plan === 'premium' ? '/analytics' : '/plus')} />
      <RowLink title="Stak Plus" onPress={() => router.push('/plus')} />
      <RowLink title="Settings" onPress={() => router.push('/settings')} />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.emeraldDim, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.emeraldText, fontSize: 24, fontWeight: '700' },
  muted: { color: colors.muted, lineHeight: 18 },
  stat: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  value: { color: colors.text, fontWeight: '700', fontVariant: ['tabular-nums'] },
  streakTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  week: { flexDirection: 'row', gap: 8 },
  day: { flex: 1, height: 18, borderRadius: radius.pill, backgroundColor: colors.bg },
  dayOn: { backgroundColor: colors.emerald },
});
