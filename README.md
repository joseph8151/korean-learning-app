# KoreanGo

> **Speak Korean. Live Korea.**

A mobile app that teaches foreigners the Korean people actually use — in Seoul cafes,
on the subway, at work and with friends. Built for 5–15 minute daily sessions.

Android first (Google Play), with the codebase structured so an iOS App Store
release needs no rewrite.

---

## Table of contents

- [Project overview](#project-overview)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Supabase setup](#supabase-setup)
- [Development](#development)
- [Testing on a real Android phone](#testing-on-a-real-android-phone)
- [Production build](#production-build)
- [Google Play preparation](#google-play-preparation)
- [Replacing the placeholder branding](#replacing-the-placeholder-branding)
- [Renaming the app](#renaming-the-app)
- [Git workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

---

## Project overview

**Target learners:** complete beginners, K-POP / K-drama fans, travellers, foreign
residents in Korea, TOPIK starters. English-speaking users first.

**What is in the app today**

| Area | What works |
| --- | --- |
| Onboarding | 4 intro slides → learning goals → level → optional 15-question placement test → daily goal |
| Home | Greeting, daily goal ring, today's lesson, Daily Korean phrase, streak, continue-learning |
| Learn | 6 courses → 18 units → 30 lessons, progress per course, Hangul trainer, search |
| Lesson | Introduction → vocabulary → expressions → listening → speaking → quiz → summary → completion screen with XP |
| Quiz | Multiple choice (both directions), word matching, sentence ordering, fill in the blank, listening, true/false |
| Practice | Vocabulary flashcards, quick quiz, listening, speaking, grammar, review mistakes, saved words, AI Korean Partner |
| Progress | Weekly chart, XP level, streak, lessons, words, speaking minutes, 8 achievements |
| Profile | Level, daily goal, learning goals, notifications, account, legal links |
| Premium | Full paywall with three plans behind a swappable payment service |
| Sync | Guest progress merges into the account on sign-in, then uploads after each lesson |

**Guests can learn immediately.** No account is required to finish the first lesson —
sign-up is offered later, once there is progress worth saving. When a guest does sign
up, their local progress is merged into the account rather than discarded.

**The app is never empty and works offline.** All learning content is bundled with
the app and served through a `ContentSource` interface. When Supabase credentials
are present the same interface reads from Postgres instead, falling back to bundled
content on any error.

---

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | React Native 0.86 + Expo SDK 57 |
| Language | TypeScript (strict) |
| Navigation | Expo Router (file-based) |
| State | Zustand + AsyncStorage persistence |
| Validation | Zod |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Audio | expo-speech (on-device TTS) |
| Testing | Jest + jest-expo |
| Builds | EAS Build |

---

## Project structure

```
app/                    Expo Router routes (each file is a screen)
  (onboarding)/         Welcome, goals, level, placement test, daily goal
  (tabs)/               Home, Learn, Practice, Progress, Profile
  auth/                 Sign in / sign up
  course/               Course detail
  lesson/               Lesson player + completion
  practice/             Vocabulary, quizzes, listening, speaking, grammar,
                        review, saved words, AI chat
  culture/  daily/  hangul/  settings/  paywall.tsx  search.tsx

components/             Shared presentational components
  ui/                   Design-system primitives (AppText, AppButton, Screen, …)
features/               Feature-scoped components (lesson, quiz, auth, home)
hooks/                  useAsyncData, usePremium, useStudyTimer, useSignInFlow,
                        useProfileSync, useDailyReminder
lib/                    Pure logic — scoring, XP, streaks, progress, spaced review,
                        progress merge
services/               Boundaries to the outside world
  content/              ContentSource: bundled + Supabase implementations
  ai/                   AIProvider: mock + remote (Edge Function) implementations
  payments/             PaymentService interface (mock today)
  auth.ts  sync.ts  profile.ts  audio.ts  notifications.ts  search.ts
store/                  Zustand stores (user, progress)
types/                  Shared TypeScript types incl. the Supabase Database type
constants/              Theme tokens, app config, pricing, and all seed content
supabase/               SQL migrations, generated seed, Edge Functions, config
scripts/                Developer tooling (seed generation)
docs/                   Architecture, security and release notes
__tests__/              Unit tests for the logic in lib/ and the seed content
```

**Rules the structure enforces**

- Screens never call Supabase directly — they go through `services/`.
- All business logic lives in `lib/` as pure functions, which is why it is testable.
- No file holds more than one screen or component's worth of code.

---

## Installation

Requires **Node.js 20+** and npm.

```bash
git clone <your-repo-url> koreango
cd koreango
npm install
cp .env.example .env      # optional — the app runs without it
npm run dev
```

Then press `a` for Android, or scan the QR code with the **Expo Go** app.

---

## Environment variables

Copy `.env.example` to `.env`. Every value is optional for local development —
without them the app uses bundled content and the mock AI partner.

| Variable | Needed for | Where to get it |
| --- | --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Cloud sync, accounts | Supabase → Project Settings → Data API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Cloud sync, accounts | Supabase → Project Settings → API Keys → `anon` |
| `EXPO_PUBLIC_AI_PROXY_URL` | Live AI conversations | URL of your deployed `ai-chat` Edge Function |

### Security rules for env vars

- Only `EXPO_PUBLIC_*` variables reach the app bundle. **Anything with that prefix is
  readable by anyone who downloads the APK** — treat it as public.
- The Supabase `anon` key is safe to ship *only because* Row Level Security is enabled
  on every table (see `supabase/migrations`).
- **Never** put the `service_role` key, an LLM API key, or Google Play credentials in
  this app. They belong in Supabase secrets or EAS secrets.
- `.env` is git-ignored. `.env.example` holds no real values.

---

## Supabase setup

The app works without Supabase. Connect it when you want accounts and cross-device sync.

**1. Create a project** at [supabase.com](https://supabase.com).

**2. Apply the schema.** Run the migrations in `supabase/migrations/` in filename
order — paste them into the SQL Editor, or use the CLI:

```bash
npm install -g supabase
supabase link --project-ref <your-project-ref>
supabase db push
```

**3. Load the seed content:**

```bash
npm run seed:generate            # regenerates supabase/seed/seed.sql from constants/content
# then paste supabase/seed/seed.sql into the SQL Editor, or:
supabase db reset                # local development only — destroys local data
```

**4. Copy your keys** into `.env` (Project Settings → Data API and API Keys).

**5. Enable Google sign-in** (optional): Authentication → Providers → Google. Add
`koreango://auth/callback` to the allowed redirect URLs.

**6. Deploy the AI Edge Function** (optional):

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set AI_DAILY_MESSAGE_LIMIT=50
supabase functions deploy ai-chat
```

Then set `EXPO_PUBLIC_AI_PROXY_URL` to the function URL. The app switches from the
mock partner to live responses automatically — no code change.

### What Row Level Security gives you

| Table group | anon | authenticated |
| --- | --- | --- |
| Content (courses, lessons, vocabulary, quizzes, daily phrases) | read | read |
| `profiles`, `progress`, `vocabulary_progress`, `saved_words`, `user_streaks` | none | own rows only |
| `subscriptions` | none | read own row only (writes are service-role only) |
| `ai_usage` | none | read own row only (writes are service-role only) |

Content tables have no write policy at all, so the anon key cannot modify lessons.

### AI usage limits

`ai-chat` requires a signed-in caller and consumes one message from a per-day
counter, incremented atomically by `consume_ai_message()` — a service-role-only
function, so a learner cannot reset their own quota. Set `AI_DAILY_MESSAGE_LIMIT`
(default 50) with `supabase secrets set`.

---

## Development

```bash
npm run dev          # start the Expo dev server
npm run android      # start and open on a connected Android device/emulator
npm run ios          # start and open on iOS (macOS only)
npm run web          # run in a browser
npm run lint         # ESLint
npm run typecheck    # TypeScript, no emit
npm run test         # Jest
npm run check        # typecheck + lint + test — run this before pushing
npm run seed:generate  # regenerate supabase/seed/seed.sql from constants/content
```

### Adding learning content

1. Edit the files in `constants/content/` (`courses.ts`, `vocabulary.ts`,
   `lessonContent.ts`, `quizzes.ts`, `dailyPhrases.ts`).
2. Run `npm run test` — the content tests catch orphaned IDs, duplicate IDs and
   quizzes whose correct answer is missing from the options.
3. Run `npm run seed:generate` and apply the new `seed.sql` to Supabase.

The bundled content and the database stay in sync because the SQL is generated
from the TypeScript, never written by hand.

---

## Testing on a real Android phone

**Fastest — Expo Go (no build):**

1. Install **Expo Go** from the Play Store.
2. Run `npm run dev` with the phone and computer on the same Wi-Fi.
3. Scan the QR code.

Expo Go is enough for everything except custom native modules.

**Realistic — an installable APK:**

```bash
npm install -g eas-cli
eas login
eas build:configure
npm run build:android:preview
```

EAS returns a download link. Open it on the phone, allow installs from unknown
sources, and install. This is the build to share with testers.

**Local debugging over USB:** enable Developer Options and USB debugging on the
phone, connect it, then run `npm run android`.

---

## Production build

```bash
eas login
eas init                          # writes your EAS project id
npm run build:android:production  # builds a signed .aab for the Play Store
```

`eas.json` defines three profiles:

| Profile | Output | Use |
| --- | --- | --- |
| `development` | debug APK + dev client | Native debugging |
| `preview` | release APK | Internal testers |
| `production` | AAB | Play Store upload |

EAS generates and stores the upload keystore for you. **Never commit a keystore** —
`.gitignore` already blocks `*.jks`, `*.keystore` and `*service-account*.json`.

---

## Google Play preparation

Before the first release you still need to:

1. **Create the app** in the [Play Console](https://play.google.com/console) with package
   name `com.koreango.app`.
2. **Complete the store listing** — title, short and full description, at least 2
   phone screenshots, a 512×512 icon and a 1024×500 feature graphic.
3. **Fill the Data Safety form.** The app collects an email address and learning
   progress when a user creates an account; a guest sends nothing. Declare accordingly.
4. **Publish a privacy policy** at a public URL and set `PRIVACY_URL` in
   `constants/app.ts`. Google rejects apps without one.
5. **Set the content rating** via the questionnaire (this app rates as Everyone).
6. **Create a service account** for automated submission, download the JSON key, and
   point `eas.json` → `submit.production.android.serviceAccountKeyPath` at it. Keep the
   file out of git.
7. **Upload to internal testing first**: `npm run submit:android`.
8. Replace the placeholder icon, splash and feature graphic (see below).

`app.config.ts` already declares `versionCode: 1`; EAS auto-increments it on
production builds via `autoIncrement: true`.

---

## Replacing the placeholder branding

The assets in `assets/` are Expo template placeholders. Swap them before release:

| File | Size | Used for |
| --- | --- | --- |
| `assets/icon.png` | 1024×1024 | App icon (iOS + fallback) |
| `assets/android-icon-foreground.png` | 1024×1024 | Android adaptive icon foreground |
| `assets/android-icon-background.png` | 1024×1024 | Android adaptive icon background |
| `assets/android-icon-monochrome.png` | 1024×1024 | Android themed icon + notification icon |
| `assets/splash-icon.png` | 1024×1024 | Splash screen mark |
| `assets/favicon.png` | 48×48 | Web |

Keep the filenames — `app.config.ts` points at them. The splash background colour is
`#6C63FF` (brand primary) and is set in `app.config.ts`.

The in-app splash/brand mark is a React component at `components/BrandMark.tsx`, so
the launch screen and the first frame of the app match without an image round-trip.

---

## Renaming the app

`KoreanGo` is a placeholder. To rename:

1. `app.config.ts` — the five constants at the top (`APP_NAME`, `SLUG`,
   `ANDROID_PACKAGE`, `IOS_BUNDLE_ID`, `SCHEME`).
2. `constants/app.ts` — `APP_NAME`, `APP_TAGLINE`, support email and legal URLs.
3. `services/auth.ts` — the OAuth redirect scheme.
4. `supabase/config.toml` — `site_url` and redirect URLs.
5. `package.json` — `name`.

Do this **before** the first Play Store upload: the Android package name can never
be changed once published.

---

## Git workflow

```bash
git checkout -b feature/your-change
npm run check                     # typecheck + lint + test must pass
git commit -m "add lesson bookmarks"
git push -u origin feature/your-change
```

CI (`.github/workflows/ci.yml`) runs install → lint → typecheck → test on every push
and pull request. Deployments are deliberately **not** automated, so no workflow ever
needs production secrets.

### Before every commit

- No `.env`, keystore, or service-account file staged.
- No API key or token in source.
- `npm run check` passes.

---

## Troubleshooting

**Metro cache is stale / weird red screen**
```bash
npx expo start --clear
```

**`Unable to resolve module @/…`** — the `@/` alias is defined in `tsconfig.json`
and `jest.config.js`. Restart Metro after changing either.

**Dependency version warnings**
```bash
npx expo install --check      # aligns packages with the installed SDK
```

**Tests fail with `clearMocksOnScope is not a function`** — Jest and `jest-expo` are
out of step. This project pins Jest 29, which is what `jest-expo@57` expects.

**The app shows content even though Supabase is empty** — working as intended. The
content service falls back to bundled data whenever a Supabase query fails or returns
nothing, so a learner never hits a blank screen.

**Audio does nothing** — `expo-speech` uses the device's Korean TTS voice. On Android,
install Korean under *Settings → System → Languages → Text-to-speech output*. Simulators
often have no Korean voice installed.

**Google sign-in returns "Sign-in was cancelled"** — check that
`koreango://auth/callback` is in the Supabase redirect allow-list and that the Google
provider is enabled.

**EAS build fails on `eas.json` submit config** — that section references a Google Play
service-account file you have not created yet. It only matters for
`npm run submit:android`; normal builds ignore it.

---

## License

Private and unpublished. All learning content in `constants/content/` is original.
