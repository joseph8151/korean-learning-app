// =============================================================================
// verify-purchase — turns a Play purchase token into a real entitlement
//
// The app cannot grant itself Premium: `subscriptions` has no client write
// policy. It sends the purchase token here, this function checks it against
// the Google Play Developer API, and only then does the service role record
// the entitlement.
//
// Deploy:
//   supabase secrets set GOOGLE_PLAY_SERVICE_ACCOUNT="$(cat play-service-account.json)"
//   supabase secrets set ANDROID_PACKAGE_NAME=com.koreango.app
//   supabase functions deploy verify-purchase
// =============================================================================

// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { getAccessToken, getProductPurchase, getSubscription } from '../_shared/googlePlay.ts';

/**
 * Product id → plan. Must match constants/pricing.ts in the app; a token for
 * an unknown product is rejected rather than guessed at.
 */
const PLAN_BY_PRODUCT: Record<string, 'monthly' | 'yearly' | 'lifetime'> = {
  koreango_premium_monthly: 'monthly',
  koreango_premium_yearly: 'yearly',
  koreango_premium_lifetime: 'lifetime',
};

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

  const serviceAccountJson = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT');
  const packageName = Deno.env.get('ANDROID_PACKAGE_NAME');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';

  if (!serviceAccountJson || !packageName || !serviceRoleKey) {
    console.error('verify-purchase is not configured');
    return json({ error: 'Service unavailable' }, 503);
  }

  // The purchase has to belong to a signed-in learner, otherwise there is no
  // account to attach it to.
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Unauthorized' }, 401);

  let payload: { platform?: string; productId?: string; purchaseToken?: string; orderId?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const platform = payload.platform === 'ios' ? 'ios' : 'android';
  const productId = typeof payload.productId === 'string' ? payload.productId : '';
  const purchaseToken = typeof payload.purchaseToken === 'string' ? payload.purchaseToken : '';
  const orderId = typeof payload.orderId === 'string' ? payload.orderId : null;

  const plan = PLAN_BY_PRODUCT[productId];
  if (!plan || !purchaseToken) return json({ error: 'Invalid request' }, 400);

  // iOS receipts need App Store Server API verification, which is a separate
  // integration. Refuse rather than trusting the client.
  if (platform !== 'android') {
    return json({ error: 'This platform is not supported yet' }, 400);
  }

  try {
    const accessToken = await getAccessToken(serviceAccountJson);

    const verified =
      plan === 'lifetime'
        ? await getProductPurchase(accessToken, packageName, productId, purchaseToken)
        : await getSubscription(accessToken, packageName, purchaseToken);

    if (!verified) return json({ error: 'Purchase not found' }, 404);

    if (verified.status === 'expired' || verified.status === 'refunded') {
      return json({ plan: 'free', status: verified.status, startedAt: null, expiresAt: null });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await admin.rpc('apply_verified_purchase', {
      p_user_id: userData.user.id,
      p_platform: platform,
      p_product_id: productId,
      p_purchase_token: purchaseToken,
      p_order_id: orderId,
      p_plan: plan,
      p_status: verified.status,
      p_started_at: verified.startedAt,
      p_expires_at: verified.expiresAt,
      p_auto_renewing: verified.autoRenewing,
      p_raw: verified.raw,
    });

    if (error) {
      // The unique constraint on purchase_token means this receipt is already
      // attached to a different account.
      if (error.code === '23505' || /already_claimed/.test(error.message ?? '')) {
        return json({ error: 'Purchase already claimed' }, 409);
      }
      console.error('apply_verified_purchase failed', error);
      return json({ error: 'Something went wrong. Please try again.' }, 500);
    }

    const row = Array.isArray(data) ? data[0] : data;
    return json({
      plan: row?.plan ?? plan,
      status: row?.status ?? verified.status,
      startedAt: row?.started_at ?? verified.startedAt,
      expiresAt: row?.expires_at ?? verified.expiresAt,
    });
  } catch (caught) {
    console.error('verify-purchase failure', caught);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});
