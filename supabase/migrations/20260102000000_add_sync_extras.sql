-- =============================================================================
-- Progress sync support
--
-- Device-agnostic counters that have no table of their own (speaking minutes,
-- conversation count, achievements, per-day activity, saved phrases, mistake
-- list) live in one JSON column on the learner's own profile row.
--
-- No new RLS policy is needed: `profiles` already restricts every operation to
-- `auth.uid() = id`, so this column inherits owner-only access.
-- =============================================================================

alter table public.profiles
  add column if not exists sync_extras jsonb not null default '{}'::jsonb;

comment on column public.profiles.sync_extras is
  'Client progress counters without a dedicated table. Written only by the owning user.';
