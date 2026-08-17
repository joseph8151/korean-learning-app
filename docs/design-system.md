# Design system

All tokens live in `constants/theme.ts`. Nothing in `app/`, `components/` or
`features/` should contain a raw hex value — if a colour is missing, add it to
the theme rather than inlining it.

## Direction

Bright, young, global, refined — modern Seoul rather than traditional Korea.
Deliberately **not** a Duolingo clone: no mascot, no confetti-per-tap, no
saturated blocks of primary colour. Imagery leans on cafes, the Han River,
convenience stores, the subway, K-food, K-pop, travel and everyday
conversation.

Colour is used sparingly. A screen gets **one** coloured surface at most — the
gradient hero — and everything else is white cards on the tinted background.

## Colour

The spec's brand colours are bright, which makes them good fills and poor text.
Each has a derived `*Deep` variant for anything that carries meaning:

| Use | Token | Measured |
| --- | --- | --- |
| Body text | `text` | 15.9:1 on white |
| Secondary copy | `textMuted` | 6.4:1 |
| Meta / captions | `textSubtle` | 4.6:1 |
| Chevrons, placeholder glyphs | `textFaint` | 2.5:1 — decorative only, never information |
| Links, active labels | `primaryDark` / `primaryDeep` | 6.0:1 / 7.4:1 |
| Success text and icons | `successDeep` | 4.8:1 on `successSoft` |
| Warning text and icons | `warningDeep` | 5.3:1 on `secondarySoft` |
| Accent text and icons | `accentDeep` | 4.8:1 on `accentSoft` |
| Fills, progress bars, borders | `primary`, `success`, `accent`, `warning` | fills only |

Rule of thumb: **bright for fills, deep for anything a learner has to read.**

## Gradients

`gradients` in the theme, rendered through `<GradientCard>`. The stops are
chosen so white text stays above 4.5:1 across the whole sweep:

- `brand` — purple, for the primary call to action (today's lesson, Premium).
- `dusk` — purple → magenta → coral. The coral end is too light for white body
  text, so use `direction="horizontal"` and keep copy in the left two thirds;
  the bright end takes a large glyph.
- `sunrise`, `mint` — available, currently unused.

Text on a gradient uses `onGradient.primary` (solid white) or
`onGradient.secondary` (92% white). Do not invent lower opacities: 75% white
lands at 2.6:1 and is unreadable in daylight.

## Shape and rhythm

- `radius.xl` (24) — full-width cards and banners.
- `radius.md` (18) — list rows, tiles, buttons, inputs.
- `radius.sm` (12) — icon tiles.
- `radius.xs` (8) — chart bars.
- `radius.pill` — badges and chips.

Cards carry a hairline `borderSoft` edge plus a low shadow. Android renders
`elevation` as a grey wash that muddies quickly, so the border does the
separating and the shadow only adds lift.

## Touch targets

`layout.minTouchTarget` is 48. Anything smaller needs `hitSlop` to reach it —
badge-sized pressables in particular.

## Accessibility rules that are not negotiable

- Correctness is never colour-only. Quiz options carry an icon and a text
  status alongside the tint.
- Every pressable has an `accessibilityRole` and an `accessibilityLabel` that
  reads on its own, without the surrounding layout.
- Progress bars expose `accessibilityValue`.
- Raw error strings never reach a learner; `ErrorState` owns the copy.
