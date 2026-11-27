import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import { Button, Field, Screen, Title } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

export default function SignInScreen() {
  const { signIn, signInWithApple, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Title>Welcome back</Title>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Sign in" busy={busy} onPress={() => run(() => signIn(email.trim(), password))} />
      <Button label="Continue with Google" tone="secondary" onPress={() => run(signInWithGoogle)} />
      {Platform.OS === 'ios' ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={14}
          style={styles.apple}
          onPress={() => run(signInWithApple)}
        />
      ) : null}
      <Link href="/sign-up" style={styles.link}>
        Need an account? Create one
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.negative, lineHeight: 20 },
  apple: { width: '100%', height: 52 },
  link: { color: colors.emeraldText, fontSize: 15 },
});
