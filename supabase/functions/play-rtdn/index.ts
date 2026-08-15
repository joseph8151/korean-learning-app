// =============================================================================
// play-rtdn — Google Play Real-time Developer Notifications
//
// Without this, an entitlement only updates when the learner opens the app and
// happens to trigger a verification: a renewal, cancellation, refund or expiry
// would go unnoticed for days.
//
// Google Cloud Pub/Sub pushes here. The body is a base64 Pub/Sub envelope; the
// notification itself carries only a purchase token, which we look up.
//
// Deploy:
//   supabase secrets set PLAY_RTDN_SECRET=<a long random string>
//   supabase functions deploy play-rtdn --no-verify-jwt
//
// Then set the Pub/Sub push endpoint to:
//   https://<project>.functions.supabase.co/play-rtdn?token=<PLAY_RTDN_SECRET>
//
// `--no-verify-jwt` is required because Google, not a user, calls this. The
// shared secret in the query string is what authenticates the caller.
// =============================================================================

// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { getAccessToken, getSubscription } from '../_shared/googlePlay.ts';

/** https://developer.android.com/google/play/billing/rtdn-reference */
const SUBSCRIPTION_NOTIFICATION = {
  RECOVERED: 1,
  RENEWED: 2,
  CANCELED: 3,
  PURCHASED: 4,
  ON_HOLD: 5,
  IN_GRACE_PERIOD: 6,
  RESTARTED: 7,
  REVOKED: 12,
  EXPIRED: 13,
} as const;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Constant-time comparison so the shared secret cannot be probed by timing. */
function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided || provided.length !== expected.length) return false;

  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= provided.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const expectedSecret = Deno.env.get('PLAY_RTDN_SECRET');
  const serviceAccountJson = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT');
  const packageName = Deno.env.get('ANDROID_PACKAGE_NAME');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!expectedSecret || !serviceAccountJson || !packageName || !serviceRoleKey) {
    console.error('play-rtdn is not configured');
    return json({ error: 'Service unavailable' }, 503);
  }

  const provided = new URL(request.url).searchParams.get('token');
  if (!secretMatches(provided, expectedSecret)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let envelope: { message?: { data?: string } };
  try {
    envelope = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const encoded = envelope?.message?.data;
  // Acknowledge malformed pushes with 200 so Pub/Sub stops retrying them.
  if (!encoded) return json({ ok: true, skipped: 'no data' });

  let notification: any;
  try {
    notification = JSON.parse(atob(encoded));
  } catch {
    return json({ ok: true, skipped: 'undecodable' });
  }

  // Google sends a test notification when you wire up the topic.
  if (notification.testNotification) return json({ ok: true, test: true });

  const subscriptionNotification = notification.subscriptionNotification;
  const voidedPurchase = notification.voidedPurchaseNotification;

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', serviceRoleKey);

  try {
    if (voidedPurchase?.purchaseToken) {
      // A refund or chargeback — revoke immediately.
      await admin.rpc('apply_purchase_state', {
        p_purchase_token: voidedPurchase.purchaseToken,
        p_status: 'refunded',
        p_expires_at: new Date().toISOString(),
        p_auto_renewing: false,
        p_raw: notification,
      });
      return json({ ok: true, handled: 'voided' });
    }

    if (!subscriptionNotification?.purchaseToken) {
      return json({ ok: true, skipped: 'unhandled type' });
    }

    const { purchaseToken, notificationType } = subscriptionNotification;

    // Re-read the authoritative state from Google rather than inferring it
    // from the notification type alone — notifications can arrive out of order.
    const accessToken = await getAccessToken(serviceAccountJson);
    const verified = await getSubscription(accessToken, packageName, purchaseToken);

    const status =
      verified?.status ??
      (notificationType === SUBSCRIPTION_NOTIFICATION.EXPIRED ||
      notificationType === SUBSCRIPTION_NOTIFICATION.REVOKED
        ? 'expired'
        : 'active');

    await admin.rpc('apply_purchase_state', {
      p_purchase_token: purchaseToken,
      p_status: status,
      p_expires_at: verified?.expiresAt ?? null,
      p_auto_renewing: verified?.autoRenewing ?? false,
      p_raw: { notification, verified: verified?.raw ?? null },
    });

    return json({ ok: true, handled: notificationType });
  } catch (caught) {
    console.error('play-rtdn failure', caught);
    // A 500 makes Pub/Sub retry, which is what we want for a transient failure.
    return json({ error: 'processing failed' }, 500);
  }
});
