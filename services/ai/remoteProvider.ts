import { env } from '@/lib/env';
import { getSupabase } from '@/lib/supabase';
import { AIUserFacingError, type AIProvider, type ChatTurnRequest, type ChatTurnResponse } from './types';

/**
 * Talks to a trusted backend (Supabase Edge Function by default) that owns the
 * LLM API key. No model secret ever reaches the device — the only credential
 * sent is the user's own Supabase access token.
 */
export const remoteAIProvider: AIProvider = {
  id: 'remote',
  isMock: false,

  async sendTurn(request: ChatTurnRequest): Promise<ChatTurnResponse> {
    if (!env.aiProxyUrl) {
      throw new Error('AI proxy is not configured');
    }

    const supabase = getSupabase();
    const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
    const accessToken = data.session?.access_token;

    const response = await fetch(env.aiProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(request),
    });

    if (response.status === 429) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      throw new AIUserFacingError(
        body.error ?? "You've reached today's practice limit. Come back tomorrow!",
      );
    }

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    return (await response.json()) as ChatTurnResponse;
  },
};
