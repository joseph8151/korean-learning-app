import { z } from 'zod';

const envSchema = z.object({
  supabaseUrl: z.url().optional(),
  supabaseAnonKey: z.string().min(20).optional(),
  aiProxyUrl: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
  const parsed = envSchema.safeParse({
    supabaseUrl: emptyToUndefined(process.env.EXPO_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: emptyToUndefined(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
    aiProxyUrl: emptyToUndefined(process.env.EXPO_PUBLIC_AI_PROXY_URL),
  });

  return parsed.success ? parsed.data : {};
}

function emptyToUndefined(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = readEnv();

/**
 * When Supabase is not configured the app runs fully on bundled content and
 * local storage, so a first-run learner never sees an empty screen.
 */
export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isAiProxyConfigured = Boolean(env.aiProxyUrl);
