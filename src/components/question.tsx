import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Question } from '@/content/types';
import { colors, radius } from '@/constants/theme';

export function QuestionCard({
  question,
  value,
  onChange,
  locked,
  result,
}: {
  question: Question;
  value?: string | Record<string, string>;
  onChange: (value: string | Record<string, string>) => void;
  locked?: boolean;
  result?: { correct: boolean; explanation: string };
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      {question.type === 'match' ? (
        <MatchRows question={question} value={value} onChange={onChange} locked={locked} />
      ) : (
        question.choices.map((choice) => {
          const selected = value === choice.id;
          return (
            <Pressable
              key={choice.id}
              disabled={locked}
              onPress={() => onChange(choice.id)}
              style={[styles.choice, selected && styles.choiceOn]}>
              <Text style={styles.choiceText}>{choice.text}</Text>
            </Pressable>
          );
        })
      )}
      {result ? (
        <Text style={[styles.explain, { color: result.correct ? colors.emeraldText : '#F3C7C7' }]}>
          {result.correct ? 'Correct. ' : 'Not quite. '}
          {result.explanation}
        </Text>
      ) : null}
    </View>
  );
}

function MatchRows({
  question,
  value,
  onChange,
  locked,
}: {
  question: Extract<Question, { type: 'match' }>;
  value?: string | Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  locked?: boolean;
}) {
  const pairs = typeof value === 'object' && value ? value : {};
  const [term, setTerm] = useState<string | null>(null);
  const definitions = useMemo(() => {
    const copy = [...question.pairs.map((pair) => pair.definition)];
    copy.sort((a, b) => (a > b ? 1 : -1));
    return copy;
  }, [question]);

  return (
    <View style={{ gap: 8 }}>
      {question.pairs.map((pair) => (
        <Pressable
          key={pair.term}
          disabled={locked}
          onPress={() => setTerm(pair.term)}
          style={[styles.choice, term === pair.term && styles.choiceOn]}>
          <Text style={styles.choiceText}>
            {pair.term}
            {pairs[pair.term] ? ` → ${pairs[pair.term]}` : ''}
          </Text>
        </Pressable>
      ))}
      <Text style={styles.hint}>{term ? `Choose the meaning of ${term}` : 'Select a term, then its meaning.'}</Text>
      {definitions.map((definition) => (
        <Pressable
          key={definition}
          disabled={locked || !term}
          onPress={() => {
            if (!term) return;
            onChange({ ...pairs, [term]: definition });
            setTerm(null);
          }}
          style={styles.choice}>
          <Text style={styles.choiceText}>{definition}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  prompt: { color: colors.text, fontSize: 16, lineHeight: 23, fontWeight: '600' },
  choice: {
    borderRadius: radius.md,
    padding: 12,
    backgroundColor: colors.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  choiceOn: { borderColor: colors.emerald, backgroundColor: colors.emeraldDim },
  choiceText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  explain: { fontSize: 14, lineHeight: 20 },
  hint: { color: colors.muted, fontSize: 13 },
});
