import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Button, Field, StackScreen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { loadPreferences, savePreferences, updateProfile } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { errorMessage } from '@/lib/errors';

export default function SettingsScreen() {
  const { session, profile, refreshProfile, signOut } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? '');
  const [reminders, setReminders] = useState(true);
  const [hour, setHour] = useState('19');
  const [biometric, setBiometric] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    loadPreferences(session.user.id).then((prefs) => {
      setReminders(prefs.lesson_reminders);
      setHour(String(prefs.reminder_hour));
    }).catch((caught) => setMessage(errorMessage(caught)));
    SecureStore.getItemAsync('stak.biometric').then((value) => setBiometric(value === '1'));
  }, [session]);

  async function saveName() {
    if (!session) return;
    try {
      await updateProfile(session.user.id, { username: username.trim().toLowerCase() });
      await refreshProfile();
      setMessage('Username saved.');
    } catch (caught) {
      setMessage(errorMessage(caught));
    }
  }

  async function pickPhoto() {
    if (!session || !supabase) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage('Photo library access is off.');
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (picked.canceled) return;
    const response = await fetch(picked.assets[0].uri);
    const bytes = await response.arrayBuffer();
    const path = `${session.user.id}/avatar.jpg`;
    const uploaded = await supabase.storage.from('avatars').upload(path, bytes, { upsert: true, contentType: 'image/jpeg' });
    if (uploaded.error) {
      setMessage(uploaded.error.message);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await updateProfile(session.user.id, { avatar_url: `${data.publicUrl}?v=${Date.now()}` });
    await refreshProfile();
    setMessage('Profile photo updated.');
  }

  async function saveReminders(next: boolean) {
    if (!session) return;
    setReminders(next);
    const reminderHour = Math.min(23, Math.max(0, Number(hour) || 19));
    await savePreferences(session.user.id, { lesson_reminders: next, streak_reminders: next, challenge_reminders: next, reminder_hour: reminderHour });
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!next) return;
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      setMessage('Notifications are off in iOS Settings.');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Stak', body: 'A short lesson is waiting.' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: reminderHour, minute: 0 },
    });
    setMessage(`A local reminder is set for ${reminderHour}:00.`);
  }

  return (
    <StackScreen>
      <Field label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Button label="Save username" onPress={saveName} />
      <Button label="Choose profile photo" tone="secondary" onPress={pickPhoto} />
      <View style={styles.row}>
        <Text style={styles.body}>Daily learning reminder</Text>
        <Switch value={reminders} onValueChange={(value) => void saveReminders(value)} />
      </View>
      <Field label="Reminder hour (0–23)" value={hour} onChangeText={setHour} keyboardType="decimal-pad" />
      <View style={styles.row}>
        <Text style={styles.body}>Require Face ID to open Stak</Text>
        <Switch
          value={biometric}
          onValueChange={async (value) => {
            if (value) {
              const available = await LocalAuthentication.hasHardwareAsync();
              if (!available) {
                setMessage('This device has no biometric hardware.');
                return;
              }
            }
            setBiometric(value);
            if (value) await SecureStore.setItemAsync('stak.biometric', '1');
            else await SecureStore.deleteItemAsync('stak.biometric');
          }}
        />
      </View>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
      <Button label="Sign out" tone="danger" onPress={() => void signOut()} />
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  body: { color: colors.text, flex: 1, fontSize: 16 },
  muted: { color: colors.muted, lineHeight: 20 },
});
