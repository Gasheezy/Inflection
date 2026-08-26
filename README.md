# Inflection — Career Positioning PWA

A companion app to the Inflection marketing site. Where a visitor goes from
"I've picked a package" to "I'm actively getting value" — an automated,
AI-powered career positioning flow, tier by tier.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4, brand tokens defined in `app/globals.css`
- Anthropic API (Claude) for the AI coach — see `lib/ai/`
- Supabase (Postgres) for leads/sessions/reports — see `lib/supabase/`
- Hand-rolled service worker + manifest for PWA installability (no build
  plugin dependency, since those tend to lag behind bleeding-edge Next)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY at minimum
npm run dev
```

Without `ANTHROPIC_API_KEY` set, the landing page, tiers, and checkout all
work; AI-driven flow steps will show an error when they call the coach.
Without `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`, leads/sessions/payment
events are logged to the server console instead of persisted — the flow
itself is unaffected, since session state lives in the browser's
`localStorage` (see `lib/session-store.ts`).

If you have Supabase configured, run `lib/supabase/schema.sql` in the SQL
editor once to create the `leads`, `flow_sessions`, `positioning_reports`,
and `payment_events` tables.

## Where things live

- `lib/tiers.ts` — Position / Compete / Elevate pricing & copy (seed content
  from the brief, edit here)
- `lib/flow/steps.ts` — which steps belong to which tier (additive: Compete
  = Position's steps + its own, Elevate = Compete's + its own)
- `lib/ai/coach-persona.ts` — the AI coach's system prompt (voice, the
  four-stage framework, the never-fabricate rule). Edit this to retune tone
  without touching flow logic.
- `lib/ai/prompts.ts` — per-step prompt builders
- `app/flow/[tier]/` — the tier-aware multi-step wizard
- `app/checkout/` — the payment step, gated by `NEXT_PUBLIC_ENFORCE_PAYMENT`
- `app/report/[sessionId]/` — the printable positioning report

## Payment flag

`NEXT_PUBLIC_ENFORCE_PAYMENT=false` (default): checkout shows a real-looking
M-Pesa / card payment UI to every user, but both "Pay" and "Skip Payment
(Beta Access)" proceed straight into the flow — no charge, no processor
call. Every skip/pay is logged as a `payment_events` row so it's easy to see
what v1 usage would have converted to revenue.

Flip it to `true` to enforce real payment. The UI doesn't change — only
`app/checkout/checkout-client.tsx`'s `handlePay` needs a real processor call
where the `// TODO: wire real payment processor (Paystack/IntaSend/M-Pesa
recommended for Kenya)` comment is.

## What's stubbed

- Real payment processing (flag-gated, see above)
- PDF export of the report (the report page is print-optimized — "Print /
  Save as PDF" uses the browser's native print-to-PDF)
- Auth/login (email capture only, matching the brief's v1 scope)
- Admin dashboard (query the Supabase tables directly for now)
