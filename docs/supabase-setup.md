# Supabase setup

Nothing here needs code changes — the schema, the policies and the Edge
Functions are all in this repo already. This is the click-through.

Do it in order. Steps 1–4 get sign-in and cross-device sync working. Steps
5–7 are what make a purchase actually grant Premium.

---

## What breaks without it

The app runs fine offline on bundled content, which is why everything has
worked so far. What does not work:

- Sign-in and cross-device sync
- **Payment verification** — a learner can pay and never get Premium, because
  the entitlement is only ever written server-side
- The reviewer account Google needs to see Premium content

---

## Step 1 — Create the project

https://supabase.com → New project (the free tier is enough).

| Field | Value |
| --- | --- |
| Name | `koreango` |
| Region | **Northeast Asia (Seoul)** |
| Database password | Generate one and put it in a password manager |

Region matters: it decides how far every request travels. Seoul is right for a
Korean-first audience even though the learners are worldwide.

**Save the database password.** It cannot be shown again, only reset.

---

## Step 2 — Run the migrations

SQL Editor → New query. Paste **`supabase/schema.sql`** — all four migrations
concatenated in order, so there is one copy-paste instead of four chances to
run them out of sequence. Regenerate it with `npm run schema:build` after
changing any migration.

15 tables, Row Level Security on every one.

Run it **once**, on a fresh project. It is not re-runnable: these are
migrations, so everything is a plain `create` and a second run fails on the
first object that already exists. If a run half-succeeds, reset the database
(Project Settings → General → Reset database) and run it again from clean
rather than picking through the errors.

Check it worked: Table Editor should list `profiles`, `progress`,
`subscriptions`, `purchases` among others, and Authentication → Policies
should show policies on all of them. **A table with RLS on and no policy is
invisible to the app**, so an empty policy list means something did not run.

---

## Step 3 — Copy the keys

Project Settings → API.

| What | Where it goes |
| --- | --- |
| Project URL | `EXPO_PUBLIC_SUPABASE_URL` |
| `anon` / public key | `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | **Never leaves the Supabase dashboard** |

The anon key is safe in a mobile app *only* because RLS is on — it grants
nothing by itself. The service_role key bypasses RLS entirely: it must never
be in the app, in this repo, in a chat message, or in a screenshot.

---

## Step 4 — Give the keys to EAS, not just `.env`

This is the step that gets missed. `.env` is git-ignored, so it never reaches
the EAS build servers — the last build log said as much:

```
No environment variables with visibility "Plain text" and "Sensitive"
found for the "production" environment on EAS.
```

Set them on EAS:

```
eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxxx.supabase.co"
eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
```

Repeat with `--environment preview` for test builds. Or set them in the EAS
dashboard under the project's Environment variables.

For local development, copy `.env.example` to `.env` and fill the same two
values there.

**A build made before this step has no backend baked in.** The keys are read
at build time, so connecting Supabase means building again.

---

## Step 5 — Google service account (for verifying purchases)

The server has to ask Google whether a purchase token is real. That needs a
service account with Play access.

1. Google Cloud Console → the project linked to Play Console
2. Enable **Google Play Android Developer API**
3. IAM & Admin → Service Accounts → Create
4. Create a **JSON key** and download it
5. Play Console → Users and permissions → Invite the service account email
   → grant **View financial data** and **Manage orders and subscriptions**

Permissions can take up to 24 hours to propagate. If verification fails with a
permission error on the first day, that is usually why.

**Keep the JSON file out of git.** It is already covered by `.gitignore`.

---

## Step 6 — Deploy the Edge Functions

```
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>

supabase functions deploy verify-purchase
supabase functions deploy play-rtdn
supabase functions deploy ai-chat
```

Then the secrets they read. These are server-side only and never appear in the
app bundle:

```
supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON="$(cat google-play-service-account.json)"
supabase secrets set ANDROID_PACKAGE_NAME="com.koreango.app"
```

For the AI partner, one of:

```
supabase secrets set ANTHROPIC_API_KEY="sk-ant-..."
supabase secrets set OPENAI_API_KEY="sk-..."
```

Then point the app at it by setting `EXPO_PUBLIC_AI_PROXY_URL` on EAS to
`https://<project-ref>.functions.supabase.co/ai-chat`. Without it the app uses
a scripted mock partner, which works but does not improvise.

---

## Step 7 — Real-time Developer Notifications

Cancellations, refunds and renewals happen when the app is closed. Without
this, a cancelled subscription keeps working until the app next checks.

1. Google Cloud → Pub/Sub → create topic `play-billing`
2. Create a **push** subscription pointing at
   `https://<project-ref>.functions.supabase.co/play-rtdn`
3. Play Console → Monetize → Monetization setup → paste the topic name

---

## Step 8 — The reviewer account

Google's reviewers cannot buy anything and cannot use a free trial, so they
need an account that already has Premium.

1. In the app, sign up as `review@koreango.app` (any address you control)
2. Supabase → Table Editor → `subscriptions` → insert a row for that user with
   `plan = lifetime`, `status = active`
3. Play Console → App content → App access → enter the credentials

No code change and no backdoor: this is the same server-side entitlement path
a paying customer takes.

---

## Checking it worked

| Check | Where |
| --- | --- |
| Sign-up creates a row | Table Editor → `profiles` |
| Progress syncs | Profile → Sync Now, then check `progress` |
| A test purchase grants Premium | `subscriptions` gets a row with your user id |
| Verification ran | Edge Function logs for `verify-purchase` |

Add yourself under Play Console → Setup → License testing **before** testing a
purchase. Licence testers go through the whole real flow without being charged.
