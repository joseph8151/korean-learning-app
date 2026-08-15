-- =============================================================================
-- KoreanGo — initial schema
--
-- Two kinds of table live here:
--   * Content tables (courses, units, lessons, vocabulary, quizzes,
--     daily_phrases) — world-readable, writable only by the service role.
--   * User tables (profiles, progress, vocabulary_progress, saved_words,
--     user_streaks, subscriptions) — each row is owned by one auth user and is
--     readable/writable only by that user.
--
-- Row Level Security is enabled on every table. The mobile app only ever uses
-- the anon key, so these policies are the real access control.
-- =============================================================================

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------------
-- Shared helpers
-- --------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------------
-- Content
-- --------------------------------------------------------------------------

create table public.courses (
  id text primary key,
  title text not null,
  description text not null default '',
  level smallint not null default 1 check (level between 1 and 5),
  order_index integer not null default 0,
  is_premium boolean not null default false,
  emoji text not null default '📘',
  accent text not null default '#6C63FF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  title text not null,
  description text not null default '',
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id text primary key,
  unit_id text not null references public.units (id) on delete cascade,
  title text not null,
  description text not null default '',
  lesson_type text not null default 'vocabulary'
    check (lesson_type in ('hangul', 'vocabulary', 'conversation', 'grammar', 'culture', 'review')),
  estimated_minutes smallint not null default 5,
  order_index integer not null default 0,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_content (
  id text primary key,
  lesson_id text not null references public.lessons (id) on delete cascade,
  content_type text not null
    check (content_type in ('introduction', 'vocabulary', 'expression', 'listening', 'speaking', 'summary')),
  korean_text text,
  english_text text,
  romanization text,
  audio_url text,
  metadata jsonb,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.vocabulary (
  id text primary key,
  korean text not null,
  english text not null,
  romanization text not null default '',
  example_korean text,
  example_english text,
  audio_url text,
  category text not null default 'basics',
  level smallint not null default 1 check (level between 1 and 5),
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id text primary key,
  lesson_id text references public.lessons (id) on delete cascade,
  question_type text not null
    check (question_type in (
      'multiple_choice_ko_en', 'multiple_choice_en_ko', 'word_matching',
      'sentence_ordering', 'fill_in_the_blank', 'listening', 'true_false'
    )),
  question text not null,
  prompt text,
  correct_answer text not null,
  options text[] not null default '{}',
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.daily_phrases (
  id text primary key,
  korean text not null,
  english text not null,
  romanization text not null default '',
  category text not null default 'friends'
    check (category in ('dating', 'friends', 'travel', 'food', 'work', 'slang', 'culture')),
  audio_url text,
  publish_date date not null,
  created_at timestamptz not null default now()
);

create index units_course_id_idx on public.units (course_id, order_index);
create index lessons_unit_id_idx on public.lessons (unit_id, order_index);
create index lesson_content_lesson_id_idx on public.lesson_content (lesson_id, order_index);
create index quizzes_lesson_id_idx on public.quizzes (lesson_id);
create index vocabulary_category_idx on public.vocabulary (category, level);
create index daily_phrases_publish_date_idx on public.daily_phrases (publish_date desc);

-- --------------------------------------------------------------------------
-- User data
-- --------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default 'Friend',
  country text,
  native_language text not null default 'English',
  korean_level smallint not null default 1 check (korean_level between 1 and 5),
  level_key text,
  learning_goals text[] not null default '{}',
  daily_goal_minutes smallint not null default 10 check (daily_goal_minutes between 1 and 240),
  total_xp integer not null default 0 check (total_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  score smallint,
  total_questions smallint,
  study_seconds integer not null default 0 check (study_seconds >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  vocabulary_id text not null references public.vocabulary (id) on delete cascade,
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  mastery_level smallint not null default 0 check (mastery_level between 0 and 5),
  last_reviewed_at timestamptz,
  next_review_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create table public.saved_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  vocabulary_id text not null references public.vocabulary (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create table public.user_streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'monthly', 'yearly', 'lifetime')),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'expired', 'cancelled')),
  started_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create index progress_user_id_idx on public.progress (user_id, status);
create index vocabulary_progress_due_idx on public.vocabulary_progress (user_id, next_review_at);
create index saved_words_user_id_idx on public.saved_words (user_id, created_at desc);

-- --------------------------------------------------------------------------
-- updated_at triggers
-- --------------------------------------------------------------------------

create trigger courses_set_updated_at before update on public.courses
  for each row execute function public.set_updated_at();
create trigger units_set_updated_at before update on public.units
  for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger progress_set_updated_at before update on public.progress
  for each row execute function public.set_updated_at();
create trigger vocabulary_progress_set_updated_at before update on public.vocabulary_progress
  for each row execute function public.set_updated_at();
create trigger user_streaks_set_updated_at before update on public.user_streaks
  for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------------------
-- Create a profile row automatically for every new auth user
-- --------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      'Friend'
    )
  )
  on conflict (id) do nothing;

  insert into public.user_streaks (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.subscriptions (user_id) values (new.id) on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_content enable row level security;
alter table public.vocabulary enable row level security;
alter table public.quizzes enable row level security;
alter table public.daily_phrases enable row level security;

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.vocabulary_progress enable row level security;
alter table public.saved_words enable row level security;
alter table public.user_streaks enable row level security;
alter table public.subscriptions enable row level security;

-- Published content: readable by everyone (including guests using the anon
-- key). No insert/update/delete policy exists, so only the service role can
-- write — RLS denies anything a policy does not explicitly allow.

create policy "Content is publicly readable" on public.courses
  for select to anon, authenticated using (true);
create policy "Content is publicly readable" on public.units
  for select to anon, authenticated using (true);
create policy "Content is publicly readable" on public.lessons
  for select to anon, authenticated using (true);
create policy "Content is publicly readable" on public.lesson_content
  for select to anon, authenticated using (true);
create policy "Content is publicly readable" on public.vocabulary
  for select to anon, authenticated using (true);
create policy "Content is publicly readable" on public.quizzes
  for select to anon, authenticated using (true);
create policy "Content is publicly readable" on public.daily_phrases
  for select to anon, authenticated using (true);

-- User-owned rows: a learner can only ever see and change their own data.

create policy "Users read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
create policy "Users delete own profile" on public.profiles
  for delete to authenticated using ((select auth.uid()) = id);

create policy "Users read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete own progress" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own vocabulary progress" on public.vocabulary_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own vocabulary progress" on public.vocabulary_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own vocabulary progress" on public.vocabulary_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete own vocabulary progress" on public.vocabulary_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own saved words" on public.saved_words
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own saved words" on public.saved_words
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users delete own saved words" on public.saved_words
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own streak" on public.user_streaks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own streak" on public.user_streaks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own streak" on public.user_streaks
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Subscriptions are readable by the owner but only writable by the service
-- role (a purchase webhook), so a user cannot grant themselves Premium.
create policy "Users read own subscription" on public.subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);
