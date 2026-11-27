import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Screen, Title } from '@/components/ui';
import { paths, recommendPath } from '@/content/paths';
import { colors, radius } from '@/constants/theme';
import { updateProfile } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

const familiarity = [
  { id: 'new', label: 'New to this' },
  { id: 'curious', label: 'I have heard the words' },
  { id: 'practiced', label: 'I have invested a little' },
  { id: 'experienced', label: 'I already follow markets' },
];
const topics = ['Budgeting', 'Saving', 'Stocks', 'ETFs', 'Company research', 'Risk'];
const goals = ['Understand the basics', 'Practice a portfolio', 'Build a saving habit', 'Read market news'];

export default function AssessmentScreen() {
  const { session, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [knowledge, setKnowledge] = useState('new');
  const [invested, setInvested] = useState(false);
  const [interests, setInterests] = useState<string[]>(['Stocks']);
  const [selectedGoals, setGoals] = useState<string[]>(['Understand the basics']);
  const [minutes, setMinutes] = useState(10);
  const [pathId, setPathId] = useState('beginner');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function finish() {
    if (!session) return;
    setBusy(true);
    setError(null);
    try {
      await updateProfile(session.user.id, {
        knowledge_level: knowledge,
        invested_before: invested,
        interests,
        goals: selectedGoals,
        daily_goal_lessons: minutes >= 15 ? 2 : 1,
        learning_path_id: pathId,
        onboarding_completed: true,
      });
      await refreshProfile();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.step}>Step {step + 1} of 6</Text>
      {step === 0 ? (
        <>
          <Title>How familiar are you with investing?</Title>
          {familiarity.map((item) => (
            <Choice key={item.id} label={item.label} selected={knowledge === item.id} onPress={() => setKnowledge(item.id)} />
          ))}
        </>
      ) : null}
      {step === 1 ? (
        <>
          <Title>Have you invested before?</Title>
          <Choice label="Yes" selected={invested} onPress={() => setInvested(true)} />
          <Choice label="No" selected={!invested} onPress={() => setInvested(false)} />
        </>
      ) : null}
      {step === 2 ? (
        <>
          <Title>Which topics interest you?</Title>
          {topics.map((topic) => (
            <Choice key={topic} label={topic} selected={interests.includes(topic)} onPress={() => toggle(interests, topic, setInterests)} />
          ))}
        </>
      ) : null}
      {step === 3 ? (
        <>
          <Title>What do you want to learn first?</Title>
          {goals.map((goal) => (
            <Choice key={goal} label={goal} selected={selectedGoals.includes(goal)} onPress={() => toggle(selectedGoals, goal, setGoals)} />
          ))}
        </>
      ) : null}
      {step === 4 ? (
        <>
          <Title>How much time can you spend a day?</Title>
          {[5, 10, 15, 20].map((value) => (
            <Choice key={value} label={`${value} minutes`} selected={minutes === value} onPress={() => setMinutes(value)} />
          ))}
        </>
      ) : null}
      {step === 5 ? (
        <>
          <Title>Choose a learning path</Title>
          <Text style={styles.note}>
            Suggested from your answers: {paths.find((path) => path.id === recommendPath({ knowledge, invested, interests }))?.title}
          </Text>
          {paths.map((path) => (
            <Choice key={path.id} label={path.title} detail={path.description} selected={pathId === path.id} onPress={() => setPathId(path.id)} />
          ))}
        </>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.row}>
        {step > 0 ? <Button label="Back" tone="secondary" onPress={() => setStep((value) => value - 1)} /> : null}
        {step < 5 ? (
          <Button
            label="Continue"
            onPress={() => {
              if (step === 4) setPathId(recommendPath({ knowledge, invested, interests }));
              setStep((value) => value + 1);
            }}
          />
        ) : (
          <Button label="Start learning" busy={busy} onPress={finish} />
        )}
      </View>
    </Screen>
  );
}

function Choice({
  label,
  detail,
  selected,
  onPress,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceOn]}>
      <Text style={styles.choiceLabel}>{label}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  step: { color: colors.emerald, fontWeight: '700', letterSpacing: 0.6 },
  note: { color: colors.muted, lineHeight: 20 },
  error: { color: colors.negative },
  row: { gap: 10 },
  choice: {
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    gap: 4,
  },
  choiceOn: { borderColor: colors.emerald, backgroundColor: colors.emeraldDim },
  choiceLabel: { color: colors.text, fontSize: 16, fontWeight: '600' },
  detail: { color: colors.muted, lineHeight: 18 },
});
