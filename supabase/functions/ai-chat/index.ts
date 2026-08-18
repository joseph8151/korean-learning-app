// =============================================================================
// AI Korean Partner — Supabase Edge Function (Deno)
//
// This is where the LLM API key lives. The mobile app never sees it: it sends
// the conversation here with the learner's own Supabase access token, and this
// function calls the model server-side.
//
// Deploy:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase functions deploy ai-chat
//
// Then set EXPO_PUBLIC_AI_PROXY_URL in .env to this function's URL and the app
// switches from the bundled mock partner to live responses automatically.
//
// NOTE: this file targets the Deno runtime, not React Native. It is excluded
// from the app's tsconfig and is not bundled into the mobile app.
// =============================================================================

// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';

const MODEL = 'claude-sonnet-5';
const MAX_HISTORY = 20;

/**
 * Daily cap per learner. The counter is incremented atomically in Postgres by
 * `consume_ai_message`, which only the service role may call, so a user cannot
 * reset their own quota.
 */
const FREE_DAILY_MESSAGE_LIMIT = Number(Deno.env.get('AI_DAILY_MESSAGE_LIMIT_FREE') ?? '10');
const PREMIUM_DAILY_MESSAGE_LIMIT = Number(
  Deno.env.get('AI_DAILY_MESSAGE_LIMIT_PREMIUM') ?? '100',
);

/** Statuses that still carry access. `cancelled` means auto-renew is off, not
 *  that the period has ended — mirrors `isEntitled` in the app. */
const ENTITLED_STATUSES = ['active', 'trialing', 'cancelled'];

/**
 * Whether this user is on a paid plan, read server-side with the service role.
 *
 * The client is never asked: a device that could name its own limit could give
 * itself unlimited conversation, and every message here costs real money at
 * the model provider.
 */
async function isPremium(
  admin: ReturnType<typeof createClient>,
  userId: string,
): Promise<boolean> {
  const { data, error } = await admin
    .from('subscriptions')
    .select('plan, status, expires_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return false;
  if (data.plan === 'free') return false;
  if (!ENTITLED_STATUSES.includes(data.status)) return false;
  if (data.plan === 'lifetime') return true;
  if (!data.expires_at) return false;

  return new Date(data.expires_at).getTime() > Date.now();
}

const SITUATION_BRIEFS: Record<string, string> = {
  cafe: 'You are a barista in a Seoul cafe taking a drink order.',
  restaurant: 'You are a server at a casual Korean restaurant.',
  convenience: 'You are a convenience store clerk at the register.',
  taxi: 'You are a Seoul taxi driver picking up a passenger.',
  airport: 'You are an immigration officer, then an information desk agent at Incheon.',
  friends: 'You are a friendly Korean peer chatting casually.',
  dating: 'You are on a relaxed first date with the learner.',
  work: 'You are a Korean coworker discussing schedules politely.',
  shopping: 'You are a shop assistant in a Seoul clothing store.',
};

function systemPrompt(situationId: string): string {
  const brief = SITUATION_BRIEFS[situationId] ?? 'You are a friendly Korean conversation partner.';

  return [
    brief,
    'Reply in natural, beginner-friendly Korean using 해요체 (polite ~요) unless the situation is casual.',
    'Keep every reply to one or two short sentences.',
    'Stay in character and keep the conversation moving with a simple question.',
    'Return ONLY minified JSON matching this shape, with no markdown fence:',
    '{"korean":string,"english":string,"romanization":string,' +
      '"suggestion":{"korean":string,"english":string}|null,' +
      '"hint":{"korean":string,"english":string}}',
    '"suggestion" is a more natural phrasing of the learner\'s last message, or null if it was already natural.',
    '"hint" is a short Korean sentence the learner could say next, with its English meaning.',
  ].join('\n');
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return json({ error: 'Service unavailable' }, 503);

  // Require a signed-in learner so this endpoint cannot be used as an open
  // proxy to your paid model quota.
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Unauthorized' }, 401);

  // Rate limit before doing any paid work.
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (serviceRoleKey) {
    const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', serviceRoleKey);
    const premium = await isPremium(admin, userData.user.id);
    const limit = premium ? PREMIUM_DAILY_MESSAGE_LIMIT : FREE_DAILY_MESSAGE_LIMIT;

    const { data: quota, error: quotaError } = await admin.rpc('consume_ai_message', {
      p_user_id: userData.user.id,
      p_limit: limit,
    });

    if (quotaError) {
      console.error('quota check failed', quotaError);
      return json({ error: 'Something went wrong. Please try again.' }, 500);
    }

    const row = Array.isArray(quota) ? quota[0] : quota;
    if (row && row.allowed === false) {
      return json(
        {
          error: premium
            ? "You've reached today's practice limit. Come back tomorrow!"
            : "That's today's free practice. Premium raises the limit, or come back tomorrow.",
          remaining: 0,
          premium,
        },
        429,
      );
    }
  } else {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set — AI requests are unmetered');
  }

  let payload: { situationId?: string; history?: unknown[]; userText?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const situationId = typeof payload.situationId === 'string' ? payload.situationId : 'cafe';
  const userText = typeof payload.userText === 'string' ? payload.userText.slice(0, 500) : '';
  if (!userText.trim()) return json({ error: 'Invalid request' }, 400);

  const history = Array.isArray(payload.history) ? payload.history.slice(-MAX_HISTORY) : [];
  const messages = history
    .filter((message: any) => message?.role === 'user' || message?.role === 'assistant')
    .map((message: any) => ({
      role: message.role,
      content: String(message.korean ?? '').slice(0, 500),
    }))
    .filter((message) => message.content.length > 0);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: systemPrompt(situationId),
        messages: messages.length > 0 ? messages : [{ role: 'user', content: userText }],
      }),
    });

    if (!response.ok) {
      console.error('Model request failed', response.status);
      return json({ error: 'Something went wrong. Please try again.' }, 502);
    }

    const body = await response.json();
    const text: string = body?.content?.[0]?.text ?? '';
    const parsed = JSON.parse(text);

    return json({
      reply: {
        id: `ai-${crypto.randomUUID()}`,
        role: 'assistant',
        korean: String(parsed.korean ?? ''),
        english: String(parsed.english ?? ''),
        romanization: String(parsed.romanization ?? ''),
        suggestion: parsed.suggestion ?? null,
      },
      hint: parsed.hint ?? null,
    });
  } catch (error) {
    // Log server-side only — never leak internals to the app.
    console.error('ai-chat failure', error);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});
