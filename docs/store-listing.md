# Play Store listing — copy sheet

Paste-ready text for Play Console → Grow → Store presence → Main store listing.
Character counts are Google's limits.

---

## App name (30)

```
KoreanGo: Learn Korean
```

## Short description (80)

Shown under the title in search results. This is the line that decides whether
someone taps.

```
Learn the Korean people really use — in cafes, on the subway, at work.
```

## Full description (4000)

Keywords matter here — Play indexes this text. "Learn Korean", "Korean
language", "Hangul", "TOPIK" and "speak Korean" all appear naturally rather
than being stuffed.

```
Learn the Korean that people actually speak.

KoreanGo teaches you the language you need to order an iced americano, ask
which subway exit to meet at, and reply in a group chat — not textbook
sentences nobody says out loud.

Five to fifteen minutes a day is enough. It fits in a coffee break.


START FROM ZERO

Can't read 한글 yet? Learn the whole alphabet in one sitting. Every consonant,
vowel and batchim has audio, so you hear each sound as you learn its shape.


REAL SITUATIONS, NOT ROLE-PLAY

Every lesson comes from somewhere you will actually stand:

• Cafes — ordering, sizes, hot or iced, takeaway
• Convenience stores and delivery apps
• The subway, taxis and asking for directions
• Restaurants — ordering for the table, asking for the bill
• The office — meetings, deadlines, 존댓말 that sounds professional
• Friends and dating — how people really text


PRACTISE UNTIL IT STICKS

• Flip cards that show you a word again right before you forget it
• Quick quizzes — ten questions, two minutes
• Listening drills on natural speed Korean
• Speaking practice you can do anywhere
• An AI conversation partner for cafes, clinics, job interviews and more


UNDERSTAND WHY, NOT JUST WHAT

Korean makes sense once someone explains the culture underneath it. Why
Koreans say 우리 instead of 내. What 눈치 is and why people notice you not
having it. Why your age comes up in the first two minutes. When 존댓말 matters
and when it makes you sound cold.


BUILT TO KEEP YOU GOING

• A daily goal you choose — 5, 10, 15, 20 or 30 minutes
• Streaks, XP and achievements
• A new Korean phrase every day
• Progress you can actually see, week by week


WORKS OFFLINE

Lessons are on your phone, not streamed. Study on a plane, on the subway, or
anywhere the signal drops.


TRY IT WITHOUT AN ACCOUNT

Finish your first lesson before signing up for anything. Nothing leaves your
phone until you choose to create an account — and when you do, the progress
you already made comes with you.


KOREANGO PREMIUM

Free forever: Hangul, the first two courses, daily phrases, quizzes and
progress tracking.

Premium adds every course — Korean Conversation, Living in Korea, Korean
Travel and Korean for Work — plus Speaking practice, Grammar, unlimited AI
conversations and smart vocabulary review.

Subscriptions renew automatically unless cancelled at least 24 hours before
the period ends. Manage or cancel any time in Google Play.

Privacy policy: https://joseph8151.github.io/korean-learning-app/privacy.html
Terms: https://joseph8151.github.io/korean-learning-app/terms.html
Support: support@koreango.app
```

---

## Graphics

Regenerate any of these with `npm run assets:brand`. They are produced from
`scripts/generate-brand-assets.py` rather than exported by hand, so the icon,
the splash and the store page cannot drift apart.

| Asset | Size | File |
| --- | --- | --- |
| App icon | 512 × 512 | `store/play-icon-512.png` |
| Feature graphic | 1024 × 500 | `store/play-feature-graphic-1024x500.png` |
| Phone screenshots | min 2, up to 8 · 16:9 or 9:16, 320–3840 px | **still needed — take from a device** |

Screenshots have to come off a real phone. They must show the actual app, so
there is nothing to generate here, and they are the highest-leverage part of
the page anyway — most people decide from those, not the text.

Screenshots are the highest-leverage thing on the whole page — most people
decide from those, not the text. Take them from a real device once the build
is installed:

1. Home — the gradient hero with the Seoul skyline and the streak
2. A lesson mid-quiz, with an answer marked correct
3. The lesson-complete screen with confetti
4. Hangul trainer
5. The vocabulary card mid-flip
6. Progress — the weekly chart and achievements

Play lets you add a caption band above each screenshot. Short claims work
better than feature names: "Read Hangul in one sitting", "Order coffee like a
local", "Five minutes a day".

The feature graphic is what shows at the top of the listing. Brand gradient,
the wordmark, the tagline, and the skyline motif from the home screen would
match the app rather than looking bought from a template.
