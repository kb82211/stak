import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, space } from '@/constants/theme';

export function Screen({
  children,
  scroll = true,
  footer,
}: {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const bottom = insets.bottom + 88;
  if (!scroll) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: bottom }]}>
        {children}
        {footer}
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: footer ? 24 : bottom,
          paddingHorizontal: space.xl,
          gap: space.lg,
        }}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer ? <View style={{ paddingBottom: insets.bottom + 12, paddingHorizontal: space.xl }}>{footer}</View> : null}
    </View>
  );
}

export function StackScreen({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.stackContent}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <Text style={[styles.body, muted && styles.muted]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  tone = 'primary',
  disabled,
  busy,
}: {
  label: string;
  onPress?: () => void;
  tone?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      onPress={() => {
        if (Platform.OS !== 'web') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        tone === 'primary' && styles.buttonPrimary,
        tone === 'secondary' && styles.buttonSecondary,
        tone === 'danger' && styles.buttonDanger,
        tone === 'ghost' && styles.buttonGhost,
        (disabled || busy) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {busy ? (
        <ActivityIndicator color={tone === 'primary' ? '#06281A' : colors.text} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            tone === 'primary' && styles.buttonTextPrimary,
            tone === 'ghost' && styles.buttonTextGhost,
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'words' | 'sentences';
  keyboardType?: 'default' | 'email-address' | 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%` as `${number}%`;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

export function Pill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'up' | 'down' | 'gold';
}) {
  return (
    <View
      style={[
        styles.pill,
        tone === 'up' && styles.pillUp,
        tone === 'down' && styles.pillDown,
        tone === 'gold' && styles.pillGold,
      ]}>
      <Text
        style={[
          styles.pillText,
          tone === 'up' && { color: colors.emeraldText },
          tone === 'down' && { color: '#F3C7C7' },
          tone === 'gold' && { color: '#F3E2B6' },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export function RowLink({
  title,
  subtitle,
  onPress,
  trailing,
}: {
  title: string;
  subtitle?: string;
  onPress?: PressableProps['onPress'];
  trailing?: string;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.chevron}>{trailing ?? '›'}</Text>
    </Pressable>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Card>
  );
}

export function LoadingBlock({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.emerald} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <Text style={styles.disclaimer}>{children}</Text>;
}

export function SymbolLabel({ name }: { name: string }) {
  return <SymbolView name={name as never} size={18} tintColor={colors.emerald} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  stackContent: { padding: space.xl, gap: space.lg, paddingBottom: 48 },
  eyebrow: {
    color: colors.emerald,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: { color: colors.text, fontSize: 32, fontWeight: '700', letterSpacing: -0.6 },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
  muted: { color: colors.muted },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  buttonPrimary: { backgroundColor: colors.emerald },
  buttonSecondary: { backgroundColor: colors.cardAlt, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  buttonDanger: { backgroundColor: colors.negativeDim },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  buttonTextPrimary: { color: '#06281A' },
  buttonTextGhost: { color: colors.emeraldText },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.75 },
  field: { gap: 6 },
  fieldLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: '#10161B', overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.emerald, borderRadius: radius.pill },
  pill: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.cardAlt },
  pillUp: { backgroundColor: colors.emeraldDim },
  pillDown: { backgroundColor: colors.negativeDim },
  pillGold: { backgroundColor: colors.goldDim },
  pillText: { color: colors.muted, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  chevron: { color: colors.faint, fontSize: 22 },
  loading: { alignItems: 'center', gap: space.sm, padding: space.xl },
  disclaimer: { color: colors.faint, fontSize: 12, lineHeight: 18 },
});
