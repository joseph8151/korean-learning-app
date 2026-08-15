import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from './env';
import type { Database } from '@/types/database';

let client: SupabaseClient<Database> | null = null;

/**
 * Returns null when Supabase credentials are absent. Callers must handle that
 * and fall back to bundled content, which keeps the app usable offline and
 * before the developer has connected a project.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;

  if (!client) {
    client = createClient<Database>(env.supabaseUrl as string, env.supabaseAnonKey as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
}
