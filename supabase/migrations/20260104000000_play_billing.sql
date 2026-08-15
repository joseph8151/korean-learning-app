-- =============================================================================
-- Google Play Billing — verified purchases
--
-- The device is never trusted to decide who is Premium. The app forwards the
-- Play purchase token to the verify-purchase Edge Function, which checks it
-- against the Google Play Developer API and writes these tables with the
-- service role.
--
-- `subscriptions` already has no client write policy, and `purchases` follows
-- the same rule: owners may read, only the service role may write.
-- =============================================================================

alter table public.subscriptions
  add column if not exists platform text
    check (platform is null or platform in ('android', 'ios')),
  add column if not exists product_id text,
  add column if not exists purchase_token text,
  add column if not exists auto_renewing boolean not null default false,
  add column if not exists last_verified_at timestamptz;

-- A refund is a distinct outcome from a cancellation: a cancelled subscription
-- runs to the end of its paid period, a refunded one ends immediately.
alter table public.subscriptions
  drop constraint if exists subscriptions_status_check;

alter table public.subscriptions
  add constraint subscriptions_status_check
  check (status in ('active', 'trialing', 'expired', 'cancelled', 'refunded'));

-- Ledger of every verified purchase token.
--
-- The unique constraint on purchase_token is the anti-sharing control: one
-- token can only ever be attached to one account, so a receipt cannot be
-- replayed to unlock Premium on a second account.
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('android', 'ios')),
  product_id text not null,
  purchase_token text not null unique,
  order_id text,
  plan text not null check (plan in ('monthly', 'yearly', 'lifetime')),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'expired', 'cancelled', 'refunded')),
  started_at timestamptz,
  expires_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index purchases_user_id_idx on public.purchases (user_id, created_at desc);
create index purchases_expires_at_idx on public.purchases (expires_at);

create trigger purchases_set_updated_at before update on public.purchases
  for each row execute function public.set_updated_at();

alter table public.purchases enable row level security;

-- Owners can see their receipt history for support. Nobody but the service
-- role can create or change one.
create policy "Users read own purchases" on public.purchases
  for select to authenticated using ((select auth.uid()) = user_id);

-- --------------------------------------------------------------------------
-- Applying a verified purchase
--
-- Service-role only. Records the receipt and recomputes the profile's
-- entitlement in one transaction, so a half-applied purchase is impossible.
--
-- Returns the entitlement the caller should hand back to the app.
-- --------------------------------------------------------------------------
create or replace function public.apply_verified_purchase(
  p_user_id uuid,
  p_platform text,
  p_product_id text,
  p_purchase_token text,
  p_order_id text,
  p_plan text,
  p_status text,
  p_started_at timestamptz,
  p_expires_at timestamptz,
  p_auto_renewing boolean,
  p_raw jsonb
)
returns table (plan text, status text, started_at timestamptz, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
begin
  -- A token already bound to someone else is a replay attempt.
  select public.purchases.user_id into v_owner
  from public.purchases
  where public.purchases.purchase_token = p_purchase_token;

  if v_owner is not null and v_owner <> p_user_id then
    raise exception 'purchase_token_already_claimed' using errcode = '23505';
  end if;

  insert into public.purchases (
    user_id, platform, product_id, purchase_token, order_id,
    plan, status, started_at, expires_at, raw_response
  )
  values (
    p_user_id, p_platform, p_product_id, p_purchase_token, p_order_id,
    p_plan, p_status, p_started_at, p_expires_at, p_raw
  )
  on conflict (purchase_token) do update
    set status = excluded.status,
        expires_at = excluded.expires_at,
        order_id = coalesce(excluded.order_id, public.purchases.order_id),
        raw_response = excluded.raw_response,
        updated_at = now();

  insert into public.subscriptions (
    user_id, plan, status, started_at, expires_at,
    platform, product_id, purchase_token, auto_renewing, last_verified_at
  )
  values (
    p_user_id, p_plan, p_status, p_started_at, p_expires_at,
    p_platform, p_product_id, p_purchase_token, coalesce(p_auto_renewing, false), now()
  )
  on conflict (user_id) do update
    set plan = excluded.plan,
        status = excluded.status,
        started_at = coalesce(public.subscriptions.started_at, excluded.started_at),
        expires_at = excluded.expires_at,
        platform = excluded.platform,
        product_id = excluded.product_id,
        purchase_token = excluded.purchase_token,
        auto_renewing = excluded.auto_renewing,
        last_verified_at = now();

  return query
    select public.subscriptions.plan,
           public.subscriptions.status,
           public.subscriptions.started_at,
           public.subscriptions.expires_at
    from public.subscriptions
    where public.subscriptions.user_id = p_user_id;
end;
$$;

revoke all on function public.apply_verified_purchase(
  uuid, text, text, text, text, text, text, timestamptz, timestamptz, boolean, jsonb
) from public, anon, authenticated;

-- --------------------------------------------------------------------------
-- Applying a store lifecycle event (renewal, cancellation, refund, expiry)
--
-- Driven by Google's Real-time Developer Notifications. Looks the user up by
-- purchase token, so the notification never has to carry an app user id.
-- --------------------------------------------------------------------------
create or replace function public.apply_purchase_state(
  p_purchase_token text,
  p_status text,
  p_expires_at timestamptz,
  p_auto_renewing boolean,
  p_raw jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
begin
  select public.purchases.user_id into v_user_id
  from public.purchases
  where public.purchases.purchase_token = p_purchase_token;

  if v_user_id is null then
    return false;
  end if;

  update public.purchases
  set status = p_status,
      expires_at = coalesce(p_expires_at, public.purchases.expires_at),
      raw_response = p_raw,
      updated_at = now()
  where public.purchases.purchase_token = p_purchase_token;

  update public.subscriptions
  set status = p_status,
      expires_at = coalesce(p_expires_at, public.subscriptions.expires_at),
      auto_renewing = coalesce(p_auto_renewing, public.subscriptions.auto_renewing),
      last_verified_at = now(),
      -- A refunded or expired subscription drops back to free immediately.
      plan = case when p_status in ('expired', 'refunded') then 'free' else public.subscriptions.plan end
  where public.subscriptions.user_id = v_user_id
    and public.subscriptions.purchase_token = p_purchase_token;

  return true;
end;
$$;

revoke all on function public.apply_purchase_state(text, text, timestamptz, boolean, jsonb)
  from public, anon, authenticated;

comment on table public.purchases is
  'Verified store receipts. Written only by the service role via apply_verified_purchase().';
