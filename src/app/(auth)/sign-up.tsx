import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button, Field, Screen, Title } from '@/components/ui';
import { colors } from '@/constants/theme';
import { usernameAvailable } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorMessage } from '@/lib/errors';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const name = username.trim().toLowerCase();
      if (!/^[a-z0-9_]{3,20}$/.test(name)) {
        throw new Error('Usernames are 3–20 characters: letters, numbers, and underscores.');
      }
      if (password.length < 8) throw new Error('Use at least 8 characters for the password.');
      const open = await usernameAvailable(name);
      if (!open) throw new Error('That username is taken.');
      const signedIn = await signUp(email.trim(), password, name);
      if (!signedIn) {
        setNotice('Confirm the email Supabase sends, then sign in. If confirmation is off, you are already signed in.');
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Title>Create your account</Title>
      <Field label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <Button label="Create account" busy={busy} onPress={submit} />
      <Link href="/sign-in" style={styles.link}>
        Already registered? Sign in
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.negative, lineHeight: 20 },
  notice: { color: colors.muted, lineHeight: 20 },
  link: { color: colors.emeraldText, fontSize: 15 },
});
