# Architecture

## The one rule

**Screens never talk to the network.** Every screen goes through a service in
`services/`, and every service hides whether the data came from Supabase, from
the bundle, or from a mock.

```
app/ (screens)
   │  useAsyncData(loader)
   ▼
services/  content · ai · auth · payments · audio · notifications · search
   │
   ├── bundled implementation   (constants/content — always available, offline)
   └── remote implementation    (Supabase / Edge Function — used when configured)

lib/    pure functions, no imports from app/ or services/  ← this is what tests cover
store/  Zustand + AsyncStorage, the only mutable app state
```

This is what makes three things cheap:

- **Offline and first-run.** No credentials? `contentService` resolves to the bundled
  source and every screen still fills with real content.
- **Testing.** All the logic worth testing (scoring, XP, streaks, spaced review) is in
  `lib/` as pure functions with no React and no I/O.
- **Swapping backends.** Replacing the mock AI partner or the mock payment service is
  a one-line change in `services/*/index.ts`.

## Content flow

`ContentSource` (`services/content/types.ts`) is the interface. Two implementations:

| Implementation | When it is used | Failure behaviour |
| --- | --- | --- |
| `localContentSource` | No Supabase credentials | Cannot fail — it is bundled JS |
| `supabaseContentSource` | Credentials present | Falls back to `localContentSource` on any error or empty result |

That fallback is deliberate: a subway with no signal should not produce an error screen
in a language-learning app.

## State

Two Zustand stores, both persisted to AsyncStorage:

- **`useUserStore`** — identity, onboarding state, level, goals, daily goal,
  subscription, notification settings.
- **`useProgressStore`** — lesson progress, vocabulary mastery, saved words, mistakes,
  streak, XP, per-day activity, achievements.

`useProgressStore.completeLesson()` is the one place that writes a lesson result. It
computes XP, advances the streak, records the day's study time, and returns the
achievements it unlocked, so the completion screen renders from a single return value.

## Sync

Guest progress lives on the device until the learner signs in. `syncOnSignIn` then
pulls whatever the account has, merges the two snapshots and writes the result back.

The merge (`lib/mergeProgress.ts`) is a pure function with two properties that make
retries safe:

- **Idempotent.** XP, study time and counters take the maximum rather than summing,
  so merging the same snapshots twice changes nothing.
- **Commutative.** Which side is "local" does not affect the outcome.

Vocabulary mastery follows the most recent review rather than the higher value, so a
word forgotten on a second device correctly drops back down.

After that, progress uploads fire-and-forget when a lesson completes, and `Sync Now`
in Profile re-runs the full merge. Every failure path keeps local progress and shows
friendly copy — a failed sync is never destructive.

Profile settings take a simpler path: `useProfileSync` watches the user store at the
app root and pushes a debounced patch, so no settings screen knows a backend exists.

## Async UI contract

`useAsyncData(loader)` returns `{ data, loading, error, reload }`. `loader` must be
memoised with `useCallback`; its identity is the refetch trigger. Every data-backed
screen renders exactly three states:

```tsx
if (loading) return <LoadingState />;
if (error || !data) return <ErrorState onRetry={reload} />;
if (data.length === 0) return <EmptyState … />;
```

`ErrorState` never receives an exception object — learners see fixed friendly copy.

## Spaced review

`lib/spacedReview.ts` implements a deliberately simple SM-2-style schedule: mastery
0–5, intervals `[0, 1, 3, 7, 16, 35]` days, one level up per correct answer and one
level down per wrong answer. It is one pure function (`reviewVocabulary`) so a better
algorithm can be dropped in without touching a screen or the database shape.

## Extending the app

| Goal | Where to change |
| --- | --- |
| Real AI conversations | Deploy `supabase/functions/ai-chat`, set `EXPO_PUBLIC_AI_PROXY_URL` |
| Real billing | Implement `PaymentService` in `services/payments/` |
| Pronunciation scoring | Add a `services/speaking/` provider; `app/practice/speaking.tsx` already has the phases |
| Recorded audio instead of TTS | Populate `audio_url` and branch inside `services/audio.ts` |
| Leaderboards | `totalXp` already exists on `profiles`; add a view and a screen |
