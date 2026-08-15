import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

import { getSupabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/env';

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthOutcome {
  ok: boolean;
  /** Safe, user-facing copy. Raw provider errors never reach the UI. */
  message: string;
  user: AuthUser | null;
  needsEmailConfirmation?: boolean;
}

const GENERIC_ERROR = 'Something went wrong. Please try again.';

function friendlyMessage(rawMessage: string | undefined): string {
  if (!rawMessage) return GENERIC_ERROR;
  const message = rawMessage.toLowerCase();

  if (message.includes('invalid login credentials')) return 'That email or password is not right.';
  if (message.includes('already registered')) return 'That email already has an account. Try signing in.';
  if (message.includes('password')) return 'Please use a password with at least 8 characters.';
  if (message.includes('email')) return 'Please check that email address.';
  if (message.includes('network') || message.includes('fetch')) {
    return 'No connection. Check your internet and try again.';
  }
  return GENERIC_ERROR;
}

const NOT_CONFIGURED: AuthOutcome = {
  ok: false,
  message: 'Accounts are not connected in this build yet. Keep learning as a guest.',
  user: null,
};

export const authService = {
  isConfigured: isSupabaseConfigured,

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email ?? null,
      displayName: (data.user.user_metadata?.display_name as string | undefined) ?? null,
    };
  },

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthOutcome> {
    const supabase = getSupabase();
    if (!supabase) return NOT_CONFIGURED;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) return { ok: false, message: friendlyMessage(error.message), user: null };

    return {
      ok: true,
      message: data.session ? 'Welcome to KoreanGo!' : 'Check your inbox to confirm your email.',
      needsEmailConfirmation: !data.session,
      user: data.user
        ? { id: data.user.id, email: data.user.email ?? null, displayName }
        : null,
    };
  },

  async signInWithEmail(email: string, password: string): Promise<AuthOutcome> {
    const supabase = getSupabase();
    if (!supabase) return NOT_CONFIGURED;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, message: friendlyMessage(error.message), user: null };

    return {
      ok: true,
      message: 'Welcome back!',
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email ?? null,
            displayName: (data.user.user_metadata?.display_name as string | undefined) ?? null,
          }
        : null,
    };
  },

  /** Google OAuth via the system browser. Apple sign-in slots in the same way. */
  async signInWithGoogle(): Promise<AuthOutcome> {
    const supabase = getSupabase();
    if (!supabase) return NOT_CONFIGURED;

    try {
      const redirectTo = makeRedirectUri({ scheme: 'koreango', path: 'auth/callback' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error || !data.url) {
        return { ok: false, message: friendlyMessage(error?.message), user: null };
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') {
        return { ok: false, message: 'Sign-in was cancelled.', user: null };
      }

      const code = new URL(result.url).searchParams.get('code');
      if (!code) return { ok: false, message: GENERIC_ERROR, user: null };

      const exchanged = await supabase.auth.exchangeCodeForSession(code);
      if (exchanged.error || !exchanged.data.user) {
        return { ok: false, message: friendlyMessage(exchanged.error?.message), user: null };
      }

      return {
        ok: true,
        message: 'Welcome to KoreanGo!',
        user: {
          id: exchanged.data.user.id,
          email: exchanged.data.user.email ?? null,
          displayName:
            (exchanged.data.user.user_metadata?.full_name as string | undefined) ?? null,
        },
      };
    } catch {
      return { ok: false, message: GENERIC_ERROR, user: null };
    }
  },

  async signOut(): Promise<void> {
    const supabase = getSupabase();
    await supabase?.auth.signOut();
  },
};
