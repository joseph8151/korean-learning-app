# Security review

Checklist run against this codebase, with the answer for each item.

## 1. Are any secrets committed to git?

**No.** `git ls-files` contains no `.env`, keystore, or service-account file. CI
re-checks this on every push (`.github/workflows/ci.yml`).

`.gitignore` blocks: `.env` (except `.env.example`), `*.jks`, `*.keystore`, `*.p8`,
`*.p12`, `credentials.json`, `google-play-service-account.json`, `google-services.json`,
`*service-account*.json`.

`.env.example` contains only empty keys and TODO comments.

## 2. Is the service_role key in the client?

**No.** The app reads exactly three variables, all `EXPO_PUBLIC_` and all safe:
`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_AI_PROXY_URL`.

Anything with the `EXPO_PUBLIC_` prefix is compiled into the APK and can be read by
anyone who downloads it. The `anon` key is designed for that; the `service_role` key
bypasses RLS and must never appear here. `lib/env.ts` is the only place env vars are
read, so this is auditable in one file.

## 3. Is user data protected by RLS?

**Yes.** Row Level Security is enabled on all 14 tables.

- Content tables (`courses`, `units`, `lessons`, `lesson_content`, `vocabulary`,
  `quizzes`, `daily_phrases`) have a `select` policy for `anon` and `authenticated`
  and **no** insert/update/delete policy. RLS denies anything not explicitly allowed,
  so the anon key cannot modify lessons.
- User tables (`profiles`, `progress`, `vocabulary_progress`, `saved_words`,
  `user_streaks`) restrict every operation to `auth.uid() = user_id`.
- `subscriptions` is **read-only even for its owner**. Only the service role can write
  it, so a user cannot grant themselves Premium by calling the API directly.
- `ai_usage` is read-only to its owner for the same reason: a learner can see how many
  AI messages they have left but cannot reset the counter. `consume_ai_message()` is
  `security definer` with execute revoked from `public`, `anon` and `authenticated`,
  and increments in a single statement so two concurrent requests cannot both pass the
  check on the same count.

Policies use `(select auth.uid())` rather than `auth.uid()` so Postgres evaluates the
call once per query instead of once per row.

`handle_new_user()` is `security definer` with `set search_path = ''` and fully
qualified table names, which closes the standard search-path hijack on definer
functions.

## 4. Are API calls safe?

**Yes.**

- No LLM key is on the device. `remoteAIProvider` posts to a Supabase Edge Function
  that holds the key server-side and attaches only the learner's own Supabase access
  token.
- The `ai-chat` function rejects unauthenticated callers, so it cannot be used as an
  open proxy to a paid model quota.
- Input to the function is bounded: message text is truncated to 500 characters and
  history to the last 20 turns.
- Each learner has a daily message cap (`AI_DAILY_MESSAGE_LIMIT`, default 50), so an
  authenticated user cannot drain the model budget either.
- Progress and profile sync send only the caller's own rows; RLS enforces that
  independently of what the client asks for.
- Auth uses Supabase's PKCE OAuth flow through the system browser
  (`expo-web-browser`), not an in-app webview.

## 5. Are technical errors shown to users?

**No.** `services/auth.ts` maps provider errors onto a fixed set of friendly strings
and returns a generic message for anything unrecognised. `ErrorState` takes no
exception argument at all — its props are `title` and `message` with safe defaults.
The Edge Function logs failures server-side and returns a generic message.

## 6. Is .env git-ignored?

**Yes** — `.env` and `.env.*` are ignored, with `!.env.example` re-included.

---

## Before the Play Store release

- [ ] Turn email confirmation **on** in the Supabase dashboard (it is off for local dev).
- [ ] Restrict Supabase Auth redirect URLs to your production scheme only.
- [ ] Publish a real privacy policy and set `PRIVACY_URL` in `constants/app.ts`.
- [ ] Complete the Play Console Data Safety form (email + learning progress are
      collected for signed-in users; guests send nothing).
- [ ] Store the Play service-account JSON outside the repo and reference it by path.
- [ ] Confirm `npx expo config` shows no unexpected values in `extra`.

## Permissions requested

| Permission | Why |
| --- | --- |
| `RECORD_AUDIO` | Speaking practice |
| `VIBRATE` | Haptic feedback on quiz answers |
| `POST_NOTIFICATIONS` | Daily study reminder |

Location permissions are explicitly blocked in `app.config.ts` so no dependency can
pull them in silently.
