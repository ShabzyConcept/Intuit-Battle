-- Create battles table for head-to-head voting competitions
create table if not exists public.battles (
  id uuid primary key default gen_random_uuid(),
  member_a_id uuid references public.community_members(id) on delete cascade not null,
  member_b_id uuid references public.community_members(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('active', 'completed', 'cancelled')) default 'active',
  votes_a integer default 0,
  votes_b integer default 0,
  winner_id uuid references public.community_members(id) on delete set null,
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure different members in battle
  check (member_a_id != member_b_id)
);

-- Enable RLS
alter table public.battles enable row level security;

-- RLS policies for battles
create policy "battles_select_all"
  on public.battles for select
  using (true); -- Allow everyone to view battles

create policy "battles_insert_authenticated"
  on public.battles for insert
  with check (auth.uid() is not null);

create policy "battles_update_creator"
  on public.battles for update
  using (auth.uid() = created_by);

-- Create battle_votes table for tracking votes in battles
create table if not exists public.battle_votes (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid references public.battles(id) on delete cascade not null,
  voter_id uuid references auth.users(id) on delete cascade not null,
  voted_for_id uuid references public.community_members(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one vote per user per battle
  unique(battle_id, voter_id)
);

-- Enable RLS
alter table public.battle_votes enable row level security;

-- RLS policies for battle_votes
create policy "battle_votes_select_all"
  on public.battle_votes for select
  using (true);

create policy "battle_votes_insert_own"
  on public.battle_votes for insert
  with check (auth.uid() = voter_id);

create policy "battle_votes_update_own"
  on public.battle_votes for update
  using (auth.uid() = voter_id);

-- Create indexes
create index if not exists idx_battles_status on public.battles(status);
create index if not exists idx_battles_start_time on public.battles(start_time desc);
create index if not exists idx_battle_votes_battle on public.battle_votes(battle_id);
