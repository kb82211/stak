import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/config';

const CHUNK = 1800;

const SecureStoreAdapter = {
  async getItem(key: string) {
    const countRaw = await SecureStore.getItemAsync(`${key}.n`);
    if (!countRaw) return SecureStore.getItemAsync(key);
    const count = Number(countRaw);
    let value = '';
    for (let index = 0; index < count; index += 1) {
      value += (await SecureStore.getItemAsync(`${key}.${index}`)) ?? '';
    }
    return value || null;
  },
  async setItem(key: string, value: string) {
    if (value.length <= CHUNK) {
      await this.removeItem(key);
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks: string[] = [];
    for (let index = 0; index < value.length; index += CHUNK) {
      chunks.push(value.slice(index, index + CHUNK));
    }
    await SecureStore.setItemAsync(`${key}.n`, String(chunks.length));
    for (let index = 0; index < chunks.length; index += 1) {
      await SecureStore.setItemAsync(`${key}.${index}`, chunks[index]);
    }
  },
  async removeItem(key: string) {
    const countRaw = await SecureStore.getItemAsync(`${key}.n`);
    if (countRaw) {
      const count = Number(countRaw);
      for (let index = 0; index < count; index += 1) {
        await SecureStore.deleteItemAsync(`${key}.${index}`);
      }
      await SecureStore.deleteItemAsync(`${key}.n`);
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: SecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export { AsyncStorage };
