import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { getProfile } from '@/lib/api';
import { isSupabaseConfigured } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

WebBrowser.maybeCompleteAuthSession();

type AuthValue = {
  ready: boolean;
  configured: boolean;
  session: Session | null;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function refreshProfile(nextSession = session) {
    if (!nextSession) {
      setProfile(null);
      return;
    }
    const next = await getProfile(nextSession.user.id);
    setProfile(next);
  }

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        try {
          setProfile(await getProfile(data.session.user.id));
        } catch {
          setProfile(null);
        }
      }
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) {
        setProfile(null);
        return;
      }
      void getProfile(next.user.id).then(setProfile).catch(() => setProfile(null));
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      ready,
      configured: isSupabaseConfigured,
      session,
      profile,
      refreshProfile: () => refreshProfile(session),
      async signIn(email, password) {
        const { error } = await requireClient().auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signUp(email, password, username) {
        const { data, error } = await requireClient().auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;
        return Boolean(data.session);
      },
      async signInWithGoogle() {
        const redirectTo = makeRedirectUri({ scheme: 'stak' });
        const { data, error } = await requireClient().auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo, skipBrowserRedirect: true },
        });
        if (error) throw error;
        if (!data.url) throw new Error('Google sign-in did not return a URL. Enable the Google provider in Supabase.');
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type !== 'success') return;
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        if (!code) throw new Error('Google sign-in did not return an authorization code.');
        const exchanged = await requireClient().auth.exchangeCodeForSession(code);
        if (exchanged.error) throw exchanged.error;
      },
      async signInWithApple() {
        if (Platform.OS !== 'ios') throw new Error('Apple sign-in is available on iPhone.');
        const rawNonce = Crypto.randomUUID();
        const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
          nonce: hashed,
        });
        if (!credential.identityToken) throw new Error('Apple did not return an identity token.');
        const { error } = await requireClient().auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
          nonce: rawNonce,
        });
        if (error) throw error;
      },
      async signOut() {
        const { error } = await requireClient().auth.signOut();
        if (error) throw error;
      },
    }),
    [ready, session, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function requireClient() {
  if (!supabase) throw new Error('Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY before signing in.');
  return supabase;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
