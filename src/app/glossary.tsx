import { StyleSheet, Text } from 'react-native';

import { Card, StackScreen } from '@/components/ui';
import { glossary } from '@/content/glossary';
import { colors } from '@/constants/theme';

export default function GlossaryScreen() {
  return (
    <StackScreen>
      {glossary.map((entry) => (
        <Card key={entry.term}>
          <Text style={styles.term}>{entry.term}</Text>
          <Text style={styles.body}>{entry.definition}</Text>
        </Card>
      ))}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  term: { color: colors.text, fontWeight: '700', fontSize: 16 },
  body: { color: colors.muted, lineHeight: 20 },
});
