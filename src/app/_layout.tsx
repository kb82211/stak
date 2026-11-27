import { DarkTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { colors } from '@/constants/theme';
import { Button } from '@/components/ui';
import { AuthProvider, useAuth } from '@/lib/auth';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.line,
    primary: colors.emerald,
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="light" />
          <Gate />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTintColor: colors.text,
              headerTitleStyle: { color: colors.text },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.bg },
              headerShown: false,
            }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="lesson/[id]" options={{ headerShown: true, title: 'Lesson' }} />
            <Stack.Screen name="asset/[symbol]" options={{ headerShown: true, title: 'Asset' }} />
            <Stack.Screen name="trade/[symbol]" options={{ headerShown: true, title: 'Simulated order', presentation: 'modal' }} />
            <Stack.Screen name="history" options={{ headerShown: true, title: 'Transactions' }} />
            <Stack.Screen name="challenge/[id]" options={{ headerShown: true, title: 'Challenge' }} />
            <Stack.Screen name="assistant" options={{ headerShown: true, title: 'Tutor', presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
            <Stack.Screen name="achievements" options={{ headerShown: true, title: 'Achievements' }} />
            <Stack.Screen name="analytics" options={{ headerShown: true, title: 'Learning analytics' }} />
            <Stack.Screen name="plus" options={{ headerShown: true, title: 'Stak Plus' }} />
            <Stack.Screen name="glossary" options={{ headerShown: true, title: 'Glossary' }} />
            <Stack.Screen name="watchlists" options={{ headerShown: true, title: 'Watchlists' }} />
            <Stack.Screen name="paths" options={{ headerShown: true, title: 'Learning paths' }} />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function Gate() {
  const { ready, session, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!ready) return;
    void SplashScreen.hideAsync();
    const root = segments[0];
    const inAuth = root === '(auth)';
    const inOnboarding = root === '(onboarding)';
    if (!session) {
      if (!inAuth) router.replace('/welcome');
      return;
    }
    if (!profile?.onboarding_completed) {
      if (!inOnboarding) router.replace('/assessment');
      return;
    }
    if (inAuth || inOnboarding) router.replace('/');
  }, [ready, session, profile, segments, router]);

  useEffect(() => {
    if (!session) return;
    void SecureStore.getItemAsync('stak.biometric').then((value) => {
      if (value === '1') setLocked(true);
    });
  }, [session]);

  if (!locked) return null;
  return (
    <View style={styles.lock}>
      <Text style={styles.brand}>Stak</Text>
      <Text style={styles.lockText}>Unlock this device to open your learning account.</Text>
      <Button
        label="Unlock"
        onPress={async () => {
          const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock Stak' });
          if (result.success) setLocked(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  lock: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.bg,
    zIndex: 20,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  brand: { color: colors.text, fontSize: 42, fontWeight: '700' },
  lockText: { color: colors.muted, fontSize: 16, lineHeight: 22 },
});
