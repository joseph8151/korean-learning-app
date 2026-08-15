import { Platform } from 'react-native';

import { env } from '@/lib/env';
import { FREE_SUBSCRIPTION } from '@/lib/entitlement';
import { getSupabase } from '@/lib/supabase';
import type { Subscription, SubscriptionPlan, SubscriptionStatus } from '@/types/user';

export interface VerificationRequest {
  productId: string;
  purchaseToken: string;
  /** Google's order id, used for support lookups. */
  orderId?: string | null;
}

export interface VerificationResult {
  ok: boolean;
  subscription: Subscription;
  message: string;
}

const UNVERIFIED: VerificationResult = {
  ok: false,
  subscription: FREE_SUBSCRIPTION,
  message: 'We could not confirm that purchase. If you were charged, tap Restore Purchases.',
};

function verifyUrl(): string | null {
  if (!env.supabaseUrl) return null;
  return `${env.supabaseUrl.replace(/\/$/, '')}/functions/v1/verify-purchase`;
}

/**
 * Purchases are always confirmed server-side.
 *
 * The device is not trusted to decide who is Premium: it forwards the Play
 * purchase token to an Edge Function, which checks it against the Google Play
 * Developer API and writes `subscriptions` with the service role. That is why
 * `subscriptions` has no client write policy.
 */
export async function verifyPurchase(request: VerificationRequest): Promise<VerificationResult> {
  const url = verifyUrl();
  const supabase = getSupabase();
  if (!url || !supabase) return UNVERIFIED;

  try {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    // An anonymous purchase cannot be attached to an account, so require sign-in.
    if (!accessToken) {
      return {
        ok: false,
        subscription: FREE_SUBSCRIPTION,
        message: 'Please sign in before purchasing so we can attach Premium to your account.',
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        platform: Platform.OS,
        productId: request.productId,
        purchaseToken: request.purchaseToken,
        orderId: request.orderId ?? null,
      }),
    });

    if (response.status === 409) {
      return {
        ok: false,
        subscription: FREE_SUBSCRIPTION,
        message: 'That purchase is already linked to a different account.',
      };
    }

    if (!response.ok) return UNVERIFIED;

    const body = (await response.json()) as {
      plan?: string;
      status?: string;
      startedAt?: string | null;
      expiresAt?: string | null;
    };

    if (!body.plan || body.plan === 'free') return UNVERIFIED;

    return {
      ok: true,
      subscription: {
        plan: body.plan as SubscriptionPlan,
        status: (body.status ?? 'active') as SubscriptionStatus,
        startedAt: body.startedAt ?? null,
        expiresAt: body.expiresAt ?? null,
      },
      message: 'Welcome to Premium!',
    };
  } catch {
    return UNVERIFIED;
  }
}
