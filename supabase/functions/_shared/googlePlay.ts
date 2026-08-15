// =============================================================================
// Google Play Developer API helpers (Deno / Edge Function runtime)
//
// Signs a JWT with the service-account private key and exchanges it for an
// access token, then reads subscription and one-time purchase state.
//
// The service account key lives in Supabase secrets, never in the app.
// =============================================================================

// @ts-nocheck

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function base64Url(input: ArrayBuffer | string): string {
  const bytes =
    typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);

  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');

  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

/** Access tokens last an hour; re-signing on every request is pure latency. */
export async function getAccessToken(serviceAccountJson: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const account = JSON.parse(serviceAccountJson) as ServiceAccount;
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiry = issuedAt + 3600;

  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: expiry,
    }),
  );

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToPkcs8(account.private_key.replace(/\\n/g, '\n')),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(`${header}.${claims}`),
  );

  const assertion = `${header}.${claims}.${base64Url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) throw new Error(`Google token exchange failed: ${response.status}`);

  const body = await response.json();
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };

  return cachedToken.value;
}

export interface VerifiedPurchase {
  status: 'active' | 'trialing' | 'expired' | 'cancelled' | 'refunded';
  startedAt: string | null;
  expiresAt: string | null;
  autoRenewing: boolean;
  raw: unknown;
}

/**
 * subscriptionsv2 is the current endpoint; it reports the whole subscription
 * rather than a single purchase, which is what we need for renewals.
 */
export async function getSubscription(
  accessToken: string,
  packageName: string,
  purchaseToken: string,
): Promise<VerifiedPurchase | null> {
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
    `${encodeURIComponent(packageName)}/purchases/subscriptionsv2/tokens/` +
    `${encodeURIComponent(purchaseToken)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 404 || response.status === 410) return null;
  if (!response.ok) throw new Error(`Play subscription lookup failed: ${response.status}`);

  const body = await response.json();
  return mapSubscriptionState(body);
}

export function mapSubscriptionState(body: any): VerifiedPurchase {
  const line = body?.lineItems?.[0] ?? null;
  const expiresAt: string | null = line?.expiryTime ?? null;
  const startedAt: string | null = body?.startTime ?? null;

  const state: string = body?.subscriptionState ?? '';
  const isTrial = Boolean(line?.offerDetails?.offerId) && state === 'SUBSCRIPTION_STATE_ACTIVE';

  let status: VerifiedPurchase['status'];
  switch (state) {
    case 'SUBSCRIPTION_STATE_ACTIVE':
    case 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD':
      status = isTrial ? 'trialing' : 'active';
      break;
    case 'SUBSCRIPTION_STATE_CANCELED':
      // Still paid up until expiryTime — access continues to the end.
      status = 'cancelled';
      break;
    case 'SUBSCRIPTION_STATE_ON_HOLD':
    case 'SUBSCRIPTION_STATE_PAUSED':
    case 'SUBSCRIPTION_STATE_EXPIRED':
      status = 'expired';
      break;
    default:
      status = 'expired';
  }

  return {
    status,
    startedAt,
    expiresAt,
    autoRenewing: Boolean(line?.autoRenewingPlan?.autoRenewEnabled),
    raw: body,
  };
}

/** One-time products (the lifetime plan) use a different endpoint. */
export async function getProductPurchase(
  accessToken: string,
  packageName: string,
  productId: string,
  purchaseToken: string,
): Promise<VerifiedPurchase | null> {
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
    `${encodeURIComponent(packageName)}/purchases/products/` +
    `${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 404 || response.status === 410) return null;
  if (!response.ok) throw new Error(`Play product lookup failed: ${response.status}`);

  const body = await response.json();

  // purchaseState: 0 purchased, 1 cancelled, 2 pending
  const purchased = body?.purchaseState === 0;
  const refunded = body?.purchaseState === 1;

  return {
    status: purchased ? 'active' : refunded ? 'refunded' : 'expired',
    startedAt: body?.purchaseTimeMillis
      ? new Date(Number(body.purchaseTimeMillis)).toISOString()
      : null,
    expiresAt: null,
    autoRenewing: false,
    raw: body,
  };
}
