# Google Play Billing — setup guide

Everything on the code side is done. This page is the list of things only you
can do, because they need your Play Console and Google Cloud accounts.

**Read this first:** in-app purchases do **not** work in Expo Go. Billing needs the
native module, so you must build a development client or install a real APK/AAB.
In Expo Go the app falls back to an inert mock and the paywall says so.

---

## How a purchase actually flows

```
1. Learner taps a plan
2. App → Google Play Billing            requestPurchase()
3. Play returns a purchaseToken
4. App → verify-purchase Edge Function  { productId, purchaseToken }
5. Function → Google Play Developer API verify the token server-side
6. Function → Postgres (service role)   apply_verified_purchase()
7. App reads the entitlement back and unlocks Premium
8. App → Play                           finishTransaction()  ← only after step 6
```

Two deliberate properties:

- **The device never grants itself Premium.** `subscriptions` has no client write
  policy, so the only path to an entitlement is a token Google confirmed.
- **The purchase is acknowledged last.** If verification fails, the transaction stays
  open and Google re-delivers it, so a server outage cannot swallow a paid purchase.
  (Google auto-refunds anything unacknowledged after 3 days, so this must not be
  skipped once verification succeeds.)

Renewals, cancellations and refunds arrive later through the `play-rtdn` webhook,
so entitlements stay correct without the learner reopening the app.

---

## Step 1 — Play Console: create the app

0. Run `eas init` locally first, then paste the printed id into `EAS_PROJECT_ID`
   at the top of `app.config.ts`. It is a public identifier, and a production
   build fails without it.
1. [Play Console](https://play.google.com/console) → **Create app**
2. Package name must be exactly `com.koreango.app` (or change it in `app.config.ts`
   **before** your first upload — it can never be changed after publishing).
3. Upload at least one build to a track (internal testing is fine). **In-app products
   do not appear until a build with the `com.android.vending.BILLING` permission has
   been uploaded** — that permission is already in `app.config.ts`.

## Step 2 — Play Console: create the products

**Monetise → Products → Subscriptions**, create two:

| Product ID | Base plan | Notes |
| --- | --- | --- |
| `koreango_premium_monthly` | monthly, auto-renewing | add a 7-day free trial offer |
| `koreango_premium_yearly` | yearly, auto-renewing | add a 7-day free trial offer |

**Monetise → Products → In-app products**, create one:

| Product ID | Type |
| --- | --- |
| `koreango_premium_lifetime` | one-time |

The IDs must match `constants/pricing.ts` and `PLAN_BY_PRODUCT` in
`supabase/functions/verify-purchase/index.ts` exactly. Activate every product —
an inactive product returns no price and cannot be bought.

Set real prices per country in the console. The app shows the store's own localised
price, so the `$` figures in `constants/pricing.ts` are only a fallback for when the
store is unreachable.

## Step 3 — Google Cloud: service account for verification

1. Play Console → **Setup → API access** → link a Google Cloud project.
2. In Google Cloud → **IAM & Admin → Service Accounts** → create one.
3. Create a **JSON key** and download it. Treat it like a password.
4. Back in Play Console → **Users and permissions** → invite the service account
   email → grant **View financial data** and **Manage orders and subscriptions**.
5. Permissions take a few minutes to propagate.

> Never commit this file. `.gitignore` already blocks `*service-account*.json`.

## Step 4 — Deploy the Edge Functions

```bash
supabase secrets set GOOGLE_PLAY_SERVICE_ACCOUNT="$(cat play-service-account.json)"
supabase secrets set ANDROID_PACKAGE_NAME=com.koreango.app
supabase secrets set PLAY_RTDN_SECRET="$(openssl rand -hex 32)"

supabase functions deploy verify-purchase
supabase functions deploy play-rtdn --no-verify-jwt
```

`--no-verify-jwt` on `play-rtdn` is required because Google calls it, not a signed-in
user. The shared secret in the query string is what authenticates it.

Also apply the migration:

```bash
supabase db push      # includes 20260104000000_play_billing.sql
```

## Step 5 — Real-time Developer Notifications

Without this, a cancellation or refund is invisible until the learner reopens the app.

1. Google Cloud → **Pub/Sub** → create a topic, e.g. `play-rtdn`.
2. Grant `google-play-developer-notifications@system.gserviceaccount.com` the
   **Pub/Sub Publisher** role on that topic.
3. Create a **push subscription** on the topic with the endpoint:
   ```
   https://<project-ref>.functions.supabase.co/play-rtdn?token=<PLAY_RTDN_SECRET>
   ```
4. Play Console → **Monetise → Monetisation setup** → paste the topic name into
   **Real-time developer notifications** → **Send test notification** to confirm.

## Step 6 — Test the purchase flow

1. Play Console → **Setup → License testing** → add your Gmail account. Licence
   testers buy with a real flow but are never charged, and renewals are compressed
   (a monthly subscription renews every ~5 minutes).
2. Build and install:
   ```bash
   npm run build:android:preview
   ```
3. Install from the EAS link on a device signed in with the tester account.
4. Buy the monthly plan. Expected: Premium unlocks, and a row appears in both
   `public.purchases` and `public.subscriptions` in Supabase.
5. Cancel from Play Store → Subscriptions. Expected: `status` becomes `cancelled`
   but Premium **stays on** until `expires_at` — the learner paid for that period.
6. Wait for the test subscription to expire. Expected: `status` becomes `expired`,
   `plan` drops to `free`, and Premium locks on the next app foreground.

### Things that commonly go wrong

| Symptom | Cause |
| --- | --- |
| No prices shown, purchase button does nothing | Products inactive, or no build uploaded to a track yet |
| `Purchase not found` from verification | Service account permissions not propagated, or wrong `ANDROID_PACKAGE_NAME` |
| `Purchase already claimed` (409) | That receipt is bound to another account — this is the anti-sharing control working |
| Purchase succeeds, Premium never unlocks | Check `verify-purchase` logs; the transaction is left unacknowledged on purpose so Google retries |
| Works in preview, not in Expo Go | Expected — billing needs the native module |

---

## Security notes

- The service account key and the RTDN secret live in Supabase secrets, never in the app.
- `purchases.purchase_token` is `unique`, so one receipt can only ever unlock one
  account. A shared receipt gets a 409, not Premium.
- `apply_verified_purchase()` and `apply_purchase_state()` are `security definer` with
  execute revoked from `public`, `anon` and `authenticated`.
- Both write the receipt and the entitlement in a single transaction, so a
  half-applied purchase cannot leave a learner paid-but-locked-out.
- `isEntitled()` re-checks the expiry date on every read, so a stale row cannot keep
  Premium alive past its period.

## iOS later

`verify-purchase` currently rejects `platform: 'ios'` rather than trusting the client.
Adding App Store support means implementing App Store Server API verification in that
function; the app side already sends the platform and needs no change.
