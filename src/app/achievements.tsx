import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card, StackScreen } from '@/components/ui';
import { achievements } from '@/content/achievements';
import { colors } from '@/constants/theme';
import { loadAchievements } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AchievementsScreen() {
  const { session } = useAuth();
  const [owned, setOwned] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) return;
    loadAchievements(session.user.id).then((rows) => setOwned(new Set(rows.map((row) => row.achievement_id as string))));
  }, [session]);

  return (
    <StackScreen>
      {achievements.map((item) => {
        const unlocked = owned.has(item.id);
        return (
          <Card key={item.id}>
            <Text style={styles.title}>{unlocked ? item.title : 'Locked'}</Text>
            <Text style={styles.body}>{item.description}</Text>
            <Text style={styles.muted}>{unlocked ? `Unlocked · ${item.xp} XP` : `${item.xp} XP when you earn it`}</Text>
          </Card>
        );
      })}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '700', fontSize: 18 },
  body: { color: colors.text, lineHeight: 22 },
  muted: { color: colors.muted },
});
