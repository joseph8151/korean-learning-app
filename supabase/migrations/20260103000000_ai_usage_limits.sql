-- =============================================================================
-- AI Korean Partner — per-user daily usage counter
--
-- The ai-chat Edge Function already requires a signed-in caller, but an
-- authenticated user could still burn the whole model budget. This table caps
-- each learner per day.
--
-- Security note: learners may READ their own counter (so the app can show
-- "messages left today") but there is no insert/update/delete policy, so only
-- the service role — i.e. the Edge Function — can change it. A user cannot
-- reset their own limit.
-- =============================================================================

create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  message_count integer not null default 0 check (message_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

create index ai_usage_date_idx on public.ai_usage (usage_date);

alter table public.ai_usage enable row level security;

create policy "Users read own AI usage" on public.ai_usage
  for select to authenticated using ((select auth.uid()) = user_id);

-- Atomically increments today's counter and reports whether the caller is
-- still under the limit. Doing this in one statement avoids the race where
-- two concurrent requests both read the same count.
create or replace function public.consume_ai_message(p_user_id uuid, p_limit integer)
returns table (allowed boolean, used integer, remaining integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  insert into public.ai_usage (user_id, usage_date, message_count)
  values (p_user_id, current_date, 1)
  on conflict (user_id, usage_date) do update
    set message_count = public.ai_usage.message_count + 1,
        updated_at = now()
  returning public.ai_usage.message_count into v_count;

  return query
    select v_count <= p_limit, v_count, greatest(p_limit - v_count, 0);
end;
$$;

revoke all on function public.consume_ai_message(uuid, integer) from public, anon, authenticated;

comment on function public.consume_ai_message is
  'Service-role only. Increments the caller''s daily AI message count and reports whether they are still within the limit.';
