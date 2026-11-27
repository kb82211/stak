-- Stak schema. Educational records and simulated balances only.
-- Market prices and simulated fills are written by Edge Functions with the service role.

create table public.levels (
  id integer primary key,
  name text not null,
  min_xp integer not null unique
);

insert into public.levels (id, name, min_xp) values
  (1, 'Financial Beginner', 0),
  (2, 'Money Explorer', 150),
  (3, 'Market Student', 400),
  (4, 'Portfolio Builder', 800),
  (5, 'Investment Analyst', 1400),
  (6, 'Financial Strategist', 2200);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  email text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  knowledge_level text,
  invested_before boolean,
  interests text[] not null default '{}',
  goals text[] not null default '{}',
  daily_goal_lessons integer not null default 1,
  learning_path_id text not null default 'beginner',
  xp integer not null default 0,
  level integer not null default 1 references public.levels (id),
  streak_current integer not null default 0,
  streak_longest integer not null default 0,
  last_activity_date date,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  created_at timestamptz not null default now()
);

create table public.learning_paths (
  id text primary key,
  title text not null,
  description text not null,
  lesson_ids text[] not null,
  sort_order integer not null
);

create table public.lessons (
  id text primary key,
  title text not null,
  category text not null,
  premium boolean not null default false,
  sort_order integer not null,
  xp integer not null
);

create table public.quiz_questions (
  id text primary key,
  lesson_id text not null references public.lessons (id) on delete cascade,
  prompt text not null,
  kind text not null check (kind in ('mcq', 'boolean', 'match')),
  choices jsonb not null default '[]',
  answer jsonb not null,
  explanation text not null,
  sort_order integer not null
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id),
  passed boolean not null default false,
  best_score integer not null default 0,
  best_total integer not null default 0,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id),
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  xp integer not null
);

create table public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null references public.achievements (id),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table public.challenges (
  id text primary key,
  type text not null,
  title text not null,
  premium boolean not null default false,
  rules jsonb
);

create table public.challenge_questions (
  id text primary key,
  challenge_id text not null references public.challenges (id) on delete cascade,
  prompt text not null,
  kind text not null,
  choices jsonb not null default '[]',
  answer jsonb not null,
  explanation text not null,
  sort_order integer not null
);

create table public.challenge_completions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  challenge_id text not null references public.challenges (id),
  completed_on date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, challenge_id, completed_on)
);

create table public.daily_activity (
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  lessons integer not null default 0,
  questions integer not null default 0,
  explorations integer not null default 0,
  challenges integer not null default 0,
  primary key (user_id, activity_date)
);

create table public.exploration_events (
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null,
  explored_on date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, symbol, explored_on)
);

create table public.assets (
  symbol text primary key,
  name text not null,
  asset_type text not null check (asset_type in ('stock', 'etf')),
  sector text,
  description text,
  exchange text
);

create table public.virtual_accounts (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  cash numeric(18, 2) not null default 10000 check (cash >= 0),
  created_at timestamptz not null default now()
);

create table public.holdings (
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null,
  quantity numeric(18, 6) not null check (quantity > 0),
  avg_cost numeric(18, 4) not null check (avg_cost > 0),
  primary key (user_id, symbol)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  quantity numeric(18, 6) not null check (quantity > 0),
  price numeric(18, 4) not null check (price > 0),
  notional numeric(18, 2) not null check (notional > 0),
  market_as_of timestamptz not null,
  feed text not null,
  exchange text,
  source_label text not null,
  disclosure text not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create table public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  total_value numeric(18, 2) not null,
  cash numeric(18, 2) not null,
  recorded_at timestamptz not null default now()
);

create table public.holding_marks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null,
  price numeric(18, 4) not null,
  marked_at timestamptz not null,
  primary key (user_id, symbol)
);

create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.watchlist_items (
  watchlist_id uuid not null references public.watchlists (id) on delete cascade,
  symbol text not null,
  added_at timestamptz not null default now(),
  primary key (watchlist_id, symbol)
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table public.notification_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  streak_reminders boolean not null default true,
  lesson_reminders boolean not null default true,
  challenge_reminders boolean not null default true,
  reminder_hour integer not null default 19 check (reminder_hour between 0 and 23),
  push_token text
);

create index lesson_progress_user_idx on public.lesson_progress (user_id);
create index transactions_user_idx on public.transactions (user_id, created_at desc);
create index snapshots_user_idx on public.portfolio_snapshots (user_id, recorded_at);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_results enable row level security;
alter table public.user_achievements enable row level security;
alter table public.challenge_completions enable row level security;
alter table public.daily_activity enable row level security;
alter table public.exploration_events enable row level security;
alter table public.virtual_accounts enable row level security;
alter table public.holdings enable row level security;
alter table public.transactions enable row level security;
alter table public.portfolio_snapshots enable row level security;
alter table public.holding_marks enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.ai_messages enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.lessons enable row level security;
alter table public.learning_paths enable row level security;
alter table public.levels enable row level security;
alter table public.achievements enable row level security;
alter table public.assets enable row level security;
alter table public.challenges enable row level security;

-- Answer keys stay unreadable. Only security-definer functions owned by postgres can read them.
alter table public.quiz_questions enable row level security;
alter table public.challenge_questions enable row level security;

create policy "read lessons" on public.lessons for select to authenticated using (true);
create policy "read paths" on public.learning_paths for select to authenticated using (true);
create policy "read levels" on public.levels for select to authenticated using (true);
create policy "read achievements" on public.achievements for select to authenticated using (true);
create policy "read assets" on public.assets for select to authenticated using (true);
create policy "read challenges" on public.challenges for select to authenticated using (true);

create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "read own progress" on public.lesson_progress for select to authenticated using (user_id = auth.uid());
create policy "read own quizzes" on public.quiz_results for select to authenticated using (user_id = auth.uid());
create policy "read own achievement unlocks" on public.user_achievements for select to authenticated using (user_id = auth.uid());
create policy "read own challenge completions" on public.challenge_completions for select to authenticated using (user_id = auth.uid());
create policy "read own activity" on public.daily_activity for select to authenticated using (user_id = auth.uid());
create policy "read own account" on public.virtual_accounts for select to authenticated using (user_id = auth.uid());
create policy "read own holdings" on public.holdings for select to authenticated using (user_id = auth.uid());
create policy "read own transactions" on public.transactions for select to authenticated using (user_id = auth.uid());
create policy "read own snapshots" on public.portfolio_snapshots for select to authenticated using (user_id = auth.uid());
create policy "read own marks" on public.holding_marks for select to authenticated using (user_id = auth.uid());
create policy "own watchlists" on public.watchlists for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own watchlist items" on public.watchlist_items for all to authenticated
  using (exists (select 1 from public.watchlists w where w.id = watchlist_id and w.user_id = auth.uid()))
  with check (exists (select 1 from public.watchlists w where w.id = watchlist_id and w.user_id = auth.uid()));
create policy "own messages" on public.ai_messages for select to authenticated using (user_id = auth.uid());
create policy "own notification prefs" on public.notification_preferences for select to authenticated using (user_id = auth.uid());
create policy "update own notification prefs" on public.notification_preferences for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke update on public.profiles from authenticated;
grant update (
  username,
  avatar_url,
  onboarding_completed,
  knowledge_level,
  invested_before,
  interests,
  goals,
  daily_goal_lessons,
  learning_path_id
) on public.profiles to authenticated;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "users upload their avatar" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users replace their avatar" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.refresh_level(p_user uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set level = (
    select id from public.levels where min_xp <= profiles.xp order by min_xp desc limit 1
  )
  where id = p_user;
$$;

create or replace function public.grant_achievement(p_user uuid, p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  reward integer;
begin
  insert into public.user_achievements (user_id, achievement_id)
  values (p_user, p_id)
  on conflict do nothing;
  if not found then
    return false;
  end if;
  select xp into reward from public.achievements where id = p_id;
  update public.profiles set xp = xp + coalesce(reward, 0) where id = p_user;
  return true;
end;
$$;

create or replace function public.sync_achievements(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  unlocked jsonb := '[]'::jsonb;
  passed_count integer;
  current_xp integer;
  streak integer;
  path_row record;
begin
  select count(*) into passed_count from public.lesson_progress where user_id = p_user and passed;
  select xp, streak_current into current_xp, streak from public.profiles where id = p_user;

  if passed_count >= 1 and public.grant_achievement(p_user, 'first-lesson') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'first-lesson', 'title', 'First lesson'));
  end if;
  if exists (select 1 from public.quiz_results where user_id = p_user and total > 0 and score = total)
     and public.grant_achievement(p_user, 'perfect-quiz') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'perfect-quiz', 'title', 'Perfect quiz'));
  end if;
  if streak >= 7 and public.grant_achievement(p_user, 'streak-7') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'streak-7', 'title', '7-day streak'));
  end if;
  if streak >= 30 and public.grant_achievement(p_user, 'streak-30') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'streak-30', 'title', '30-day streak'));
  end if;
  if exists (select 1 from public.transactions where user_id = p_user)
     and public.grant_achievement(p_user, 'first-trade') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'first-trade', 'title', 'First simulated trade'));
  end if;
  if (select count(distinct symbol) from public.exploration_events where user_id = p_user) >= 5
     and public.grant_achievement(p_user, 'portfolio-explorer') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'portfolio-explorer', 'title', 'Portfolio explorer'));
  end if;
  if exists (
    select 1 from public.challenge_completions cc
    join public.challenges c on c.id = cc.challenge_id
    where cc.user_id = p_user and c.type = 'portfolio'
  ) and public.grant_achievement(p_user, 'diversification') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'diversification', 'title', 'Diversification practice'));
  end if;
  if passed_count >= 30 and public.grant_achievement(p_user, 'lessons-30') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'lessons-30', 'title', '30 lessons'));
  end if;
  select xp into current_xp from public.profiles where id = p_user;
  if current_xp >= 500 and public.grant_achievement(p_user, 'knowledge-milestone') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'knowledge-milestone', 'title', 'Knowledge milestone'));
  end if;
  if exists (select 1 from public.challenge_completions where user_id = p_user)
     and public.grant_achievement(p_user, 'first-challenge') then
    unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'first-challenge', 'title', 'First challenge'));
  end if;

  for path_row in select lesson_ids from public.learning_paths loop
    if not exists (
      select 1 from unnest(path_row.lesson_ids) as lesson_id
      where not exists (
        select 1 from public.lesson_progress lp
        where lp.user_id = p_user and lp.lesson_id = lesson_id and lp.passed
      )
    ) and public.grant_achievement(p_user, 'path-complete') then
      unlocked := unlocked || jsonb_build_array(jsonb_build_object('id', 'path-complete', 'title', 'Path complete'));
    end if;
  end loop;

  perform public.refresh_level(p_user);
  return unlocked;
end;
$$;

create or replace function public.touch_streak(p_user uuid, p_local_date date)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  previous date;
  next_streak integer;
begin
  if p_local_date > (timezone('utc', now()))::date + 1
     or p_local_date < (timezone('utc', now()))::date - 1 then
    raise exception 'Activity date is outside the allowed window';
  end if;
  select last_activity_date into previous from public.profiles where id = p_user for update;
  if previous = p_local_date then
    select streak_current into next_streak from public.profiles where id = p_user;
    return next_streak;
  end if;
  if previous = p_local_date - 1 then
    next_streak := (select streak_current + 1 from public.profiles where id = p_user);
  else
    next_streak := 1;
  end if;
  update public.profiles
  set streak_current = next_streak,
      streak_longest = greatest(streak_longest, next_streak),
      last_activity_date = p_local_date
  where id = p_user;
  return next_streak;
end;
$$;

create or replace function public.ensure_activity(p_user uuid, p_local_date date)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.daily_activity (user_id, activity_date)
  values (p_user, p_local_date)
  on conflict do nothing;
$$;

create or replace function public.username_available(p_name text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(trim(p_name)));
$$;

create or replace function public.submit_quiz(p_lesson_id text, p_answers jsonb, p_local_date date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  question record;
  score integer := 0;
  total integer := 0;
  results jsonb := '[]'::jsonb;
  is_correct boolean;
  passed boolean;
  already boolean;
  awarded integer := 0;
  premium_lesson boolean;
  user_plan text;
  unlocked jsonb;
  profile_row public.profiles%rowtype;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if p_local_date > (timezone('utc', now()))::date + 1
     or p_local_date < (timezone('utc', now()))::date - 1 then
    raise exception 'Activity date is outside the allowed window';
  end if;

  select premium into premium_lesson from public.lessons where id = p_lesson_id;
  if premium_lesson is null then raise exception 'Unknown lesson'; end if;
  select plan into user_plan from public.profiles where id = uid;
  if premium_lesson and user_plan <> 'premium' then
    raise exception 'This lesson is part of Stak Plus';
  end if;

  for question in
    select * from public.quiz_questions where lesson_id = p_lesson_id order by sort_order
  loop
    total := total + 1;
    is_correct := (p_answers -> question.id) = question.answer;
    if is_correct then score := score + 1; end if;
    results := results || jsonb_build_array(jsonb_build_object(
      'id', question.id,
      'correct', is_correct,
      'explanation', question.explanation
    ));
  end loop;

  if total = 0 then raise exception 'Lesson has no questions'; end if;
  passed := score::numeric / total >= 0.7;
  select passed into already from public.lesson_progress where user_id = uid and lesson_id = p_lesson_id;
  already := coalesce(already, false);

  insert into public.quiz_results (user_id, lesson_id, score, total)
  values (uid, p_lesson_id, score, total);

  insert into public.lesson_progress (user_id, lesson_id, passed, best_score, best_total, completed_at)
  values (uid, p_lesson_id, passed, score, total, case when passed then now() else null end)
  on conflict (user_id, lesson_id) do update
    set best_score = greatest(public.lesson_progress.best_score, excluded.best_score),
        best_total = excluded.best_total,
        passed = public.lesson_progress.passed or excluded.passed,
        completed_at = coalesce(public.lesson_progress.completed_at, excluded.completed_at);

  perform public.ensure_activity(uid, p_local_date);
  update public.daily_activity
  set questions = questions + total,
      lessons = lessons + case when passed and not already then 1 else 0 end
  where user_id = uid and activity_date = p_local_date;

  if passed and not already then
    awarded := case when score = total then 75 else 50 end;
    update public.profiles set xp = xp + awarded where id = uid;
    perform public.touch_streak(uid, p_local_date);
  end if;

  unlocked := public.sync_achievements(uid);
  select * into profile_row from public.profiles where id = uid;

  return jsonb_build_object(
    'score', score,
    'total', total,
    'passed', passed,
    'perfect', score = total,
    'xpAwarded', awarded,
    'alreadyCompleted', already,
    'level', profile_row.level,
    'totalXp', profile_row.xp,
    'streak', profile_row.streak_current,
    'results', results,
    'unlocked', unlocked
  );
end;
$$;

create or replace function public.record_exploration(p_symbol text, p_local_date date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  inserted boolean := false;
  explore_count integer;
  awarded integer := 0;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if p_symbol !~ '^[A-Z.]{1,10}$' then raise exception 'Invalid symbol'; end if;
  if p_local_date > (timezone('utc', now()))::date + 1
     or p_local_date < (timezone('utc', now()))::date - 1 then
    raise exception 'Activity date is outside the allowed window';
  end if;

  insert into public.exploration_events (user_id, symbol, explored_on)
  values (uid, p_symbol, p_local_date)
  on conflict do nothing;
  inserted := found;
  perform public.ensure_activity(uid, p_local_date);
  if inserted then
    update public.daily_activity
    set explorations = explorations + 1
    where user_id = uid and activity_date = p_local_date
    returning explorations into explore_count;
    if explore_count <= 3 then
      awarded := 10;
      update public.profiles set xp = xp + awarded where id = uid;
    end if;
  end if;
  perform public.sync_achievements(uid);
  return jsonb_build_object('xpAwarded', awarded);
end;
$$;

create or replace function public.complete_challenge(p_challenge_id text, p_answers jsonb, p_local_date date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  challenge public.challenges%rowtype;
  question record;
  score integer := 0;
  total integer := 0;
  results jsonb := '[]'::jsonb;
  is_correct boolean;
  passed boolean := false;
  already boolean;
  awarded integer := 0;
  user_plan text;
  holding_count integer;
  sector_count integer;
  max_weight numeric;
  priced numeric;
  missing integer;
  has_stock boolean;
  has_etf boolean;
  unlocked jsonb;
  profile_row public.profiles%rowtype;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  select * into challenge from public.challenges where id = p_challenge_id;
  if challenge.id is null then raise exception 'Unknown challenge'; end if;
  select plan into user_plan from public.profiles where id = uid;
  if challenge.premium and user_plan <> 'premium' then
    raise exception 'This challenge is part of Stak Plus';
  end if;
  select exists (
    select 1 from public.challenge_completions
    where user_id = uid and challenge_id = p_challenge_id and completed_on = p_local_date
  ) into already;
  if already then
    raise exception 'You already completed this challenge today';
  end if;

  if challenge.type = 'portfolio' then
    select count(*) into missing
    from public.holdings h
    left join public.holding_marks m
      on m.user_id = h.user_id and m.symbol = h.symbol and m.marked_at > now() - interval '15 minutes'
    where h.user_id = uid and m.symbol is null;
    if missing > 0 then
      raise exception 'Every holding needs a provider price from the last 15 minutes before this check can run';
    end if;
    select coalesce(sum(h.quantity * m.price), 0) into priced
    from public.holdings h
    join public.holding_marks m on m.user_id = h.user_id and m.symbol = h.symbol
    where h.user_id = uid;
    select count(*) into holding_count from public.holdings where user_id = uid;
    select count(distinct a.sector) into sector_count
    from public.holdings h
    join public.assets a on a.symbol = h.symbol
    where h.user_id = uid and a.sector is not null;
    select coalesce(max((h.quantity * m.price) / nullif(priced, 0)), 1) into max_weight
    from public.holdings h
    join public.holding_marks m on m.user_id = h.user_id and m.symbol = h.symbol
    where h.user_id = uid;
    select exists (
      select 1 from public.holdings h join public.assets a on a.symbol = h.symbol
      where h.user_id = uid and a.asset_type = 'stock'
    ) into has_stock;
    select exists (
      select 1 from public.holdings h join public.assets a on a.symbol = h.symbol
      where h.user_id = uid and a.asset_type = 'etf'
    ) into has_etf;
    passed := holding_count >= (challenge.rules ->> 'minHoldings')::int
      and sector_count >= (challenge.rules ->> 'minSectors')::int
      and max_weight <= (challenge.rules ->> 'maxWeight')::numeric
      and (
        coalesce((challenge.rules ->> 'requireStockAndEtf')::boolean, false) = false
        or (has_stock and has_etf)
      );
  else
    for question in
      select * from public.challenge_questions where challenge_id = p_challenge_id order by sort_order
    loop
      total := total + 1;
      is_correct := (p_answers -> question.id) = question.answer;
      if is_correct then score := score + 1; end if;
      results := results || jsonb_build_array(jsonb_build_object(
        'id', question.id,
        'correct', is_correct,
        'explanation', question.explanation
      ));
    end loop;
    passed := total > 0 and score::numeric / total >= 0.7;
  end if;

  if not passed then
    return jsonb_build_object(
      'score', score,
      'total', total,
      'passed', false,
      'perfect', false,
      'xpAwarded', 0,
      'alreadyCompleted', false,
      'results', results,
      'unlocked', '[]'::jsonb,
      'detail', 'The challenge requirements are not met yet.'
    );
  end if;

  insert into public.challenge_completions (user_id, challenge_id, completed_on)
  values (uid, p_challenge_id, p_local_date);
  awarded := 60;
  update public.profiles set xp = xp + awarded where id = uid;
  perform public.ensure_activity(uid, p_local_date);
  update public.daily_activity set challenges = challenges + 1
  where user_id = uid and activity_date = p_local_date;
  perform public.touch_streak(uid, p_local_date);
  unlocked := public.sync_achievements(uid);
  select * into profile_row from public.profiles where id = uid;
  return jsonb_build_object(
    'score', case when challenge.type = 'portfolio' then 1 else score end,
    'total', case when challenge.type = 'portfolio' then 1 else total end,
    'passed', true,
    'perfect', challenge.type = 'portfolio' or score = total,
    'xpAwarded', awarded,
    'alreadyCompleted', false,
    'level', profile_row.level,
    'totalXp', profile_row.xp,
    'streak', profile_row.streak_current,
    'results', results,
    'unlocked', unlocked
  );
end;
$$;

create or replace function public.execute_trade(
  p_user_id uuid,
  p_symbol text,
  p_side text,
  p_quantity numeric,
  p_price numeric,
  p_as_of timestamptz,
  p_feed text,
  p_exchange text,
  p_source_label text,
  p_disclosure text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cash numeric(18, 2);
  v_owned numeric(18, 6);
  v_avg numeric(18, 4);
  v_notional numeric(18, 2);
  v_id uuid;
  v_existing uuid;
begin
  if p_side not in ('buy', 'sell') then raise exception 'Invalid side'; end if;
  if p_price is null or p_price <= 0 then raise exception 'Invalid price'; end if;
  if p_quantity is null or p_quantity <= 0 then raise exception 'Invalid quantity'; end if;
  if p_as_of is null then raise exception 'Missing market timestamp'; end if;

  select id into v_existing from public.transactions where idempotency_key = p_idempotency_key;
  if v_existing is not null then
    raise exception 'Duplicate simulated trade';
  end if;

  v_notional := round(p_quantity * p_price, 2);
  if v_notional < 1 then raise exception 'The minimum simulated order is $1.00'; end if;

  select cash into v_cash from public.virtual_accounts where user_id = p_user_id for update;
  if v_cash is null then raise exception 'No virtual account'; end if;

  if p_side = 'buy' then
    if v_cash < v_notional then raise exception 'Insufficient virtual cash'; end if;
    select quantity, avg_cost into v_owned, v_avg
    from public.holdings where user_id = p_user_id and symbol = p_symbol for update;
    if v_owned is null then
      insert into public.holdings (user_id, symbol, quantity, avg_cost)
      values (p_user_id, p_symbol, p_quantity, p_price);
    else
      update public.holdings
      set avg_cost = ((v_avg * v_owned) + (p_price * p_quantity)) / (v_owned + p_quantity),
          quantity = v_owned + p_quantity
      where user_id = p_user_id and symbol = p_symbol;
    end if;
    update public.virtual_accounts set cash = cash - v_notional where user_id = p_user_id;
  else
    select quantity, avg_cost into v_owned, v_avg
    from public.holdings where user_id = p_user_id and symbol = p_symbol for update;
    if v_owned is null or v_owned + 0.0000001 < p_quantity then
      raise exception 'Insufficient shares';
    end if;
    if v_owned - p_quantity <= 0.0000001 then
      delete from public.holdings where user_id = p_user_id and symbol = p_symbol;
    else
      update public.holdings set quantity = v_owned - p_quantity
      where user_id = p_user_id and symbol = p_symbol;
    end if;
    update public.virtual_accounts set cash = cash + v_notional where user_id = p_user_id;
  end if;

  insert into public.transactions (
    user_id, symbol, side, quantity, price, notional, market_as_of, feed, exchange, source_label, disclosure, idempotency_key
  ) values (
    p_user_id, p_symbol, p_side, p_quantity, p_price, v_notional, p_as_of, p_feed, p_exchange, p_source_label, p_disclosure, p_idempotency_key
  ) returning id into v_id;

  perform public.sync_achievements(p_user_id);
  select cash into v_cash from public.virtual_accounts where user_id = p_user_id;
  return jsonb_build_object(
    'transactionId', v_id,
    'quantity', p_quantity,
    'notional', v_notional,
    'price', p_price,
    'asOf', p_as_of,
    'sourceLabel', p_source_label,
    'disclosure', p_disclosure,
    'cash', v_cash
  );
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  suffix integer := 0;
begin
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', split_part(coalesce(new.email, 'learner'), '@', 1)), '[^a-z0-9_]', '', 'g'));
  if length(base) < 3 then base := 'learner'; end if;
  base := left(base, 20);
  candidate := base;
  while exists (select 1 from public.profiles where lower(username) = candidate) loop
    suffix := suffix + 1;
    candidate := left(base, 16) || suffix::text;
  end loop;
  insert into public.profiles (id, email, username) values (new.id, new.email, candidate);
  insert into public.virtual_accounts (user_id, cash) values (new.id, 10000);
  insert into public.notification_preferences (user_id) values (new.id);
  insert into public.watchlists (user_id, name) values (new.id, 'Main');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on function public.execute_trade(uuid, text, text, numeric, numeric, timestamptz, text, text, text, text, text) from public;
grant execute on function public.execute_trade(uuid, text, text, numeric, numeric, timestamptz, text, text, text, text, text) to service_role;
revoke all on function public.grant_achievement(uuid, text) from public;
revoke all on function public.sync_achievements(uuid) from public;
revoke all on function public.refresh_level(uuid) from public;
revoke all on function public.touch_streak(uuid, date) from public;
revoke all on function public.ensure_activity(uuid, date) from public;
grant execute on function public.submit_quiz(text, jsonb, date) to authenticated;
grant execute on function public.record_exploration(text, date) to authenticated;
grant execute on function public.complete_challenge(text, jsonb, date) to authenticated;
grant execute on function public.username_available(text) to anon, authenticated;
