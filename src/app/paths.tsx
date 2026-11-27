import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button, StackScreen } from '@/components/ui';
import { paths } from '@/content/paths';
import { colors, radius } from '@/constants/theme';
import { updateProfile } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

export default function PathsScreen() {
  const { session, profile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState(profile?.learning_path_id ?? 'beginner');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <StackScreen>
      {paths.map((path) => (
        <Pressable key={path.id} onPress={() => setSelected(path.id)} style={[styles.card, selected === path.id && styles.on]}>
          <Text style={styles.title}>{path.title}</Text>
          <Text style={styles.body}>{path.description}</Text>
          <Text style={styles.muted}>{path.lessonIds.length} lessons</Text>
        </Pressable>
      ))}
      <Button
        label="Use this path"
        onPress={async () => {
          if (!session) return;
          try {
            await updateProfile(session.user.id, { learning_path_id: selected });
            await refreshProfile();
            setMessage('Path updated. Lessons you already passed stay passed.');
          } catch (caught) {
            setMessage(errorMessage(caught));
          }
        }}
      />
      {message ? <Text style={styles.body}>{message}</Text> : null}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: radius.lg, backgroundColor: colors.card, gap: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  on: { borderColor: colors.emerald },
  title: { color: colors.text, fontWeight: '700', fontSize: 18 },
  body: { color: colors.text, lineHeight: 22 },
  muted: { color: colors.muted },
});
