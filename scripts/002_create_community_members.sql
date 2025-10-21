-- Create community_members table for people who can be voted on
create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  description text,
  avatar_url text,
  category text default 'general',
  total_votes integer default 0,
  win_percentage decimal(5,2) default 0.00,
  battles_count integer default 0,
  is_active boolean default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.community_members enable row level security;

-- RLS policies for community_members
create policy "community_members_select_all"
  on public.community_members for select
  using (true); -- Allow everyone to view community members

create policy "community_members_insert_authenticated"
  on public.community_members for insert
  with check (auth.uid() is not null);

create policy "community_members_update_creator"
  on public.community_members for update
  using (auth.uid() = created_by);

create policy "community_members_delete_creator"
  on public.community_members for delete
  using (auth.uid() = created_by);

-- Create indexes for better performance
create index if not exists idx_community_members_total_votes on public.community_members(total_votes desc);
create index if not exists idx_community_members_category on public.community_members(category);
create index if not exists idx_community_members_active on public.community_members(is_active);
