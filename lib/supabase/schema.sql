-- Inflection v1 schema. Run this in the Supabase SQL editor.
-- Minimal by design: no auth tables, email capture stands in for login.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  tier text not null check (tier in ('position', 'compete', 'elevate')),
  created_at timestamptz not null default now()
);

create table if not exists flow_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  tier text not null check (tier in ('position', 'compete', 'elevate')),
  email text,
  name text,
  step_data jsonb not null default '{}'::jsonb,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'skipped', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists positioning_reports (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references flow_sessions(session_id),
  tier text not null,
  report jsonb not null,
  created_at timestamptz not null default now()
);

-- Every "Pay" / "Skip Payment (Beta Access)" click, so it's easy to see what
-- v1 usage would have converted to real revenue once payment is enforced.
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  tier text not null,
  email text,
  event_type text not null check (event_type in ('skipped', 'paid')),
  amount_kes integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_flow_sessions_session_id on flow_sessions(session_id);
create index if not exists idx_payment_events_session_id on payment_events(session_id);
