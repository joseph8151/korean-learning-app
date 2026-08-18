# Play Console — exact values to enter

Copy-paste sheet for the Play Console screens, in the order Google forces you
through them. The technical detail is in `billing.md`; this page is just the
values.

---

## Order is enforced — you cannot skip ahead

```
1. Verify the account          ← phone, identity, address
2. Create the app              ← blocked until 1 is done
3. Upload an .aab to a track   ← blocked until 2 is done
4. Create the products         ← blocked until 3 is done
```

Step 4 is the one that matters for billing, and it is genuinely gated on
step 3: the Monetize screens stay inert until Google has seen a build that
declares `com.android.vending.BILLING`. Our build does declare it, so a single
upload to Internal testing unlocks the product screens.

---

## Step 2 — Create app

| Field | Value |
| --- | --- |
| App name | `KoreanGo` |
| Default language | English (United States) — the app's UI language |
| App or game | App |
| Free or paid | **Free** |

**"Free" is correct even though the app sells a subscription.** Paid means
users pay to download. An app with in-app purchases is Free. This choice
cannot be changed after publishing, so getting it wrong is expensive.

---

## Step 3 — Upload the build

Internal testing → Create new release → upload the `.aab` from EAS.

Package name (must match, and cannot ever be changed): `com.koreango.app`

---

## Step 4 — Products

### Subscriptions (Monetize → Subscriptions)

Two subscriptions. The product IDs must match the app source **exactly** —
a typo here means the plan silently fails to load at runtime.

| Product ID | Name | Billing period | Free trial |
| --- | --- | --- | --- |
| `koreango_premium_monthly` | KoreanGo Premium — Monthly | 1 month | 7 days |
| `koreango_premium_yearly` | KoreanGo Premium — Yearly | 1 year | 7 days |

### In-app product (Monetize → In-app products)

Not a subscription — a one-time purchase, on a different screen.

| Product ID | Name | Type |
| --- | --- | --- |
| `koreango_premium_lifetime` | KoreanGo Premium — Lifetime | One-time |

### Product descriptions

Monthly and Yearly:
> Unlock every course, unlimited AI Korean conversations, speaking practice
> and smart vocabulary review.

Lifetime:
> One payment for permanent access to every KoreanGo course and feature.

---

## Prices

Play prices are set per country. You enter one base price and Google converts
the rest, which you can then override per market.

The app **does not use the numbers in `constants/pricing.ts`** once the store
is connected — it reads the real localised price from Google, so a learner in
Seoul sees ₩ and one in Chicago sees $. Those constants only fill the screen
before billing is live.

### Recommended

| Plan | USD base | KRW | Reasoning |
| --- | --- | --- | --- |
| Monthly | $7.99 | ₩10,900 | Under the $9.99 psychological line |
| Yearly | $49.99 | ₩65,000 | ~6.3 months of monthly — the standard discount |
| Lifetime | $109.99 | ₩139,000 | ~2.2 years of yearly |

The source currently ships $9.99 / $59.99 / $149.99 as placeholders. For the
Korean market specifically that monthly price is on the high side for a
language app — ₩13,000/month is a hard sell against Duolingo Super.

**Google keeps 15%** of the first $1M of annual revenue, 30% above that. At
$7.99/month you net about $6.79.

Whatever you pick, set it in Play Console. Tell me the numbers and I will match
the placeholder constants so the pre-store screens agree.

---

## After the products exist

Three things remain before a purchase completes end to end. All are in
`billing.md` with the commands:

1. **Google Cloud service account** — lets the server ask Google whether a
   purchase token is genuine.
2. **Supabase project + deploy `verify-purchase`** — the server that asks.
3. **License testers** — Play Console → Setup → License testing. Add your own
   Gmail address so you can run real purchases **without being charged**.
   Do this before testing; a real card charge is annoying to unwind.

---

## Personal accounts: the 14-day testing rule

This account is a **personal** (개인) account, not an organisation, so Google
requires a closed test running continuously for **14 days with a minimum number
of testers** before you can apply for production access. The requirement has
been 20 and then 12 testers at different points — check the current number on
the Play Console dashboard rather than trusting this page.

This is worth planning around now: it means the earliest possible public launch
is roughly two weeks after the closed test starts, no matter how finished the
app is. Starting the closed test early, even with a rough build, buys back that
fortnight.
