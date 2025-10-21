-- Complete database setup script
-- This script ensures all necessary tables exist for the battles system

-- First, create the community_members table if it doesn't exist
create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  avatar_url text,
  category text check (category in ('Core', 'Intuition OG', 'Members')) default 'Members',
  total_votes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for community_members
alter table public.community_members enable row level security;

-- RLS policies for community_members
create policy "community_members_select_all"
  on public.community_members for select
  using (true);

-- Insert the Core team members (billE.Eth and H0rus) if they don't exist
insert into public.community_members (name, title, bio, avatar_url, category, total_votes)
values 
  ('billE.Eth', 'Core Team, Intuition', 'Early Ethereum Contributor, Builder / Philosopher', '/bille-eth-card.jpeg', 'Core', 1500),
  ('H0rus 👁️', 'Intuition team 👁️', 'Visionary architect of trust networks', '/horus-card.jpeg', 'Core', 1400)
on conflict (name) do nothing;

-- Now create the battles table (this should already exist from script 004)
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
  
  check (member_a_id != member_b_id)
);

-- Enable RLS for battles
alter table public.battles enable row level security;

-- RLS policies for battles
create policy "battles_select_all"
  on public.battles for select
  using (true);

-- Create battle_votes table with wallet support
create table if not exists public.battle_votes (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid references public.battles(id) on delete cascade not null,
  voter_id uuid references auth.users(id) on delete cascade,
  voter_wallet text,
  voted_for_id uuid references public.community_members(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure either voter_id or voter_wallet is provided
  check ((voter_id is not null) or (voter_wallet is not null))
);

-- Enable RLS for battle_votes
alter table public.battle_votes enable row level security;

-- RLS policies for battle_votes
create policy "battle_votes_select_all"
  on public.battle_votes for select
  using (true);

create policy "battle_votes_insert_wallet_or_auth"
  on public.battle_votes for insert
  with check (
    (auth.uid() = voter_id) OR 
    (voter_wallet is not null and voter_id is null)
  );

-- Create unique constraint for one vote per battle per voter
create unique index if not exists idx_battle_votes_unique_voter 
on public.battle_votes(battle_id, coalesce(voter_id::text, voter_wallet));

-- Create the epic battle between billE.Eth and H0rus
insert into public.battles (
  member_a_id,
  member_b_id,
  title,
  description,
  status,
  end_time
)
select 
  a.id as member_a_id,
  b.id as member_b_id,
  'Who inspired you more' as title,
  'An epic 5-day battle between two legendary figures of the Intuition ecosystem. billE.Eth, the philosophical Ethereum pioneer and early contributor, faces off against H0rus 👁️, the visionary architect of trust networks. Both have shaped the foundation of decentralized communities in their own unique ways. Cast your vote and help decide who has inspired the community more!' as description,
  'active' as status,
  (now() + interval '5 days') as end_time
from 
  (select id from public.community_members where name = 'billE.Eth' limit 1) a,
  (select id from public.community_members where name = 'H0rus 👁️' limit 1) b
where not exists (
  select 1 from public.battles 
  where title = 'Who inspired you more'
);
