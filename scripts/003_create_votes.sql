-- Create votes table for tracking individual votes
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid references auth.users(id) on delete cascade not null,
  community_member_id uuid references public.community_members(id) on delete cascade not null,
  vote_type text check (vote_type in ('up', 'down')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one vote per user per community member
  unique(voter_id, community_member_id)
);

-- Enable RLS
alter table public.votes enable row level security;

-- RLS policies for votes
create policy "votes_select_all"
  on public.votes for select
  using (true); -- Allow everyone to view votes for transparency

create policy "votes_insert_own"
  on public.votes for insert
  with check (auth.uid() = voter_id);

create policy "votes_update_own"
  on public.votes for update
  using (auth.uid() = voter_id);

create policy "votes_delete_own"
  on public.votes for delete
  using (auth.uid() = voter_id);

-- Create indexes for better performance
create index if not exists idx_votes_community_member on public.votes(community_member_id);
create index if not exists idx_votes_voter on public.votes(voter_id);
create index if not exists idx_votes_created_at on public.votes(created_at desc);
