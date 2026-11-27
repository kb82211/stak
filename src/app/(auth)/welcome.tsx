import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Disclaimer, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { isSupabaseConfigured, requiredCredentials } from '@/lib/config';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.mark}>Stak</Text>
        <Text style={styles.tag}>Learn how money and markets work. Practice with virtual cash.</Text>
      </View>
      <Button label="Create an account" onPress={() => router.push('/sign-up')} />
      <Button label="I already have an account" tone="secondary" onPress={() => router.push('/sign-in')} />
      {!isSupabaseConfigured ? (
        <Disclaimer>
          {`Sign-in needs ${requiredCredentials.app.join(' and ')} in a local .env file. Market prices also need Alpaca keys stored as Supabase function secrets, not in the app.`}
        </Disclaimer>
      ) : null}
      <Disclaimer>
        Stak is an education app. It is not a broker, exchange, or adviser. Virtual balances cannot be deposited, withdrawn, or spent. Nothing in the app is a recommendation to buy or sell a security.
      </Disclaimer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexGrow: 1, justifyContent: 'flex-end', gap: 12, minHeight: 280 },
  mark: { color: colors.text, fontSize: 64, fontWeight: '700', letterSpacing: -1.5 },
  tag: { color: colors.muted, fontSize: 18, lineHeight: 26 },
});
