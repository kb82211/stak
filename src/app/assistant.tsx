import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, Disclaimer, Field, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { askTutor, loadTutorMessages } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

const prompts = [
  'What exactly is an ETF?',
  'Why do stock prices change?',
  'How does compound interest work?',
  'What does a P/E ratio mean?',
  'Why is diversification important?',
  'What is the difference between an index fund and an ETF?',
];

export default function AssistantScreen() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState('Educational only. Not a recommendation to buy or sell any security.');

  useEffect(() => {
    if (!session) return;
    loadTutorMessages(session.user.id).then(setMessages).catch((caught) => setError(errorMessage(caught)));
  }, [session]);

  async function send(text: string) {
    const message = text.trim();
    if (!message) return;
    setBusy(true);
    setError(null);
    setDraft('');
    try {
      const result = await askTutor(message);
      setDisclaimer(result.disclaimer);
      setMessages((current) => [
        ...current,
        { id: `u-${Date.now()}`, role: 'user', content: message },
        { id: `a-${Date.now()}`, role: 'assistant', content: result.reply },
      ]);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <StackScreen>
      <Text style={styles.intro}>Ask for a plain-language explanation. The tutor will not tell you what to buy.</Text>
      <View style={styles.prompts}>
        {prompts.map((prompt) => (
          <Button key={prompt} label={prompt} tone="secondary" onPress={() => send(prompt)} />
        ))}
      </View>
      {messages.map((message) => (
        <Card key={message.id}>
          <Text style={styles.role}>{message.role === 'user' ? 'You' : 'Tutor'}</Text>
          <Text style={styles.body}>{message.content}</Text>
        </Card>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Field label="Question" value={draft} onChangeText={setDraft} autoCapitalize="sentences" />
      <Button label="Ask" busy={busy} onPress={() => send(draft)} />
      <Disclaimer>{disclaimer} If you ask about today’s market, the tutor only uses figures that were supplied as verified data. This screen does not attach a live quote automatically.</Disclaimer>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.muted, lineHeight: 20 },
  prompts: { gap: 8 },
  role: { color: colors.emerald, fontWeight: '700', fontSize: 12 },
  body: { color: colors.text, lineHeight: 22 },
  error: { color: colors.negative },
});
