-- ============================================================
-- RL Mechanic Tracker — Initial Schema
-- ============================================================

-- ----------------------------------------------------------------
-- ranks
-- ----------------------------------------------------------------
create table public.ranks (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null unique
);

-- ----------------------------------------------------------------
-- mechanics
-- ----------------------------------------------------------------
create table public.mechanics (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  description         text,
  category            text,
  difficulty          int  not null check (difficulty between 1 and 5),
  viability           int  check (viability between 0 and 100),
  recommended_rank_id uuid references public.ranks(id)
);

-- ----------------------------------------------------------------
-- mechanic_prerequisites  (DAG edges)
-- ----------------------------------------------------------------
create table public.mechanic_prerequisites (
  mechanic_id     uuid not null references public.mechanics(id) on delete cascade,
  prerequisite_id uuid not null references public.mechanics(id) on delete cascade,
  primary key (mechanic_id, prerequisite_id),
  check (mechanic_id <> prerequisite_id)
);

-- Index so "what does this mechanic unlock?" is fast
create index mechanic_prerequisites_prereq_id_idx
  on public.mechanic_prerequisites (prerequisite_id);

-- ----------------------------------------------------------------
-- mechanic_resources
-- ----------------------------------------------------------------
create table public.mechanic_resources (
  id          uuid primary key default gen_random_uuid(),
  mechanic_id uuid not null references public.mechanics(id) on delete cascade,
  type        text not null check (type in ('video', 'map_code')),
  title       text,
  video_url   text,
  map_code    text,
  -- Enforce that the right column is populated for each type
  check (
    (type = 'video'    and video_url is not null) or
    (type = 'map_code' and map_code  is not null)
  )
);

create index mechanic_resources_mechanic_id_idx
  on public.mechanic_resources (mechanic_id);

-- ----------------------------------------------------------------
-- profiles  (1-to-1 with auth.users)
-- ----------------------------------------------------------------
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique,
  current_rank_id uuid references public.ranks(id)
);

-- ----------------------------------------------------------------
-- user_mechanics
-- ----------------------------------------------------------------
create table public.user_mechanics (
  user_id     uuid not null references auth.users(id) on delete cascade,
  mechanic_id uuid not null references public.mechanics(id) on delete cascade,
  status      text not null check (status in ('learning', 'mastered')),
  primary key (user_id, mechanic_id)
);

-- ============================================================
-- Row-Level Security
-- ============================================================

-- Public tables: SELECT only, no client writes
alter table public.ranks               enable row level security;
alter table public.mechanics           enable row level security;
alter table public.mechanic_prerequisites enable row level security;
alter table public.mechanic_resources  enable row level security;

create policy "public read" on public.ranks
  for select using (true);

create policy "public read" on public.mechanics
  for select using (true);

create policy "public read" on public.mechanic_prerequisites
  for select using (true);

create policy "public read" on public.mechanic_resources
  for select using (true);

-- profiles: owner only
alter table public.profiles enable row level security;

create policy "owner select" on public.profiles
  for select using (auth.uid() = id);

create policy "owner insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "owner update" on public.profiles
  for update using (auth.uid() = id);

-- user_mechanics: owner only
alter table public.user_mechanics enable row level security;

create policy "owner select" on public.user_mechanics
  for select using (auth.uid() = user_id);

create policy "owner insert" on public.user_mechanics
  for insert with check (auth.uid() = user_id);

create policy "owner update" on public.user_mechanics
  for update using (auth.uid() = user_id);

create policy "owner delete" on public.user_mechanics
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    -- Use email prefix as default username, trimmed to 30 chars
    left(split_part(new.email, '@', 1), 30)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
