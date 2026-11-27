import { StyleSheet, Text } from 'react-native';

import { Card, Disclaimer, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function PlusScreen() {
  const { profile } = useAuth();
  return (
    <StackScreen>
      <Text style={styles.title}>Stak Plus</Text>
      <Text style={styles.body}>
        {profile?.plan === 'premium'
          ? 'This account already has the Plus entitlement.'
          : 'Plus adds the remaining lessons, the research and portfolio challenges, learning analytics, and a higher tutor limit.'}
      </Text>
      <Card>
        <Text style={styles.body}>App Store billing is not connected. There is no purchase button because a tap would not charge anyone or unlock the plan.</Text>
        <Text style={styles.body}>To connect it, add a RevenueCat iOS SDK key, a product whose entitlement id is stak_plus, and the REVENUECAT_WEBHOOK_SECRET on the billing-webhook function. The webhook is the only path that changes profiles.plan.</Text>
      </Card>
      <Disclaimer>Stak Plus is a subscription for education features. It does not add real brokerage, deposits, or trade execution.</Disclaimer>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '700' },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
});
