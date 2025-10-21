-- Add wallet-based voting support to battle_votes table
-- This allows voting without requiring Supabase authentication

-- First, add a new column for wallet addresses
alter table public.battle_votes 
add column if not exists voter_wallet text;

-- Create a new unique constraint that allows either voter_id OR voter_wallet
-- Remove the old unique constraint first
alter table public.battle_votes 
drop constraint if exists battle_votes_battle_id_voter_id_key;

-- Add new constraint to ensure one vote per battle per voter (either by ID or wallet)
create unique index if not exists idx_battle_votes_unique_voter 
on public.battle_votes(battle_id, coalesce(voter_id::text, voter_wallet));

-- Update RLS policies to allow wallet-based voting
drop policy if exists "battle_votes_insert_own" on public.battle_votes;
drop policy if exists "battle_votes_update_own" on public.battle_votes;

-- New policies that support both authenticated users and wallet addresses
create policy "battle_votes_insert_wallet_or_auth"
  on public.battle_votes for insert
  with check (
    (auth.uid() = voter_id) OR 
    (voter_wallet is not null and voter_id is null)
  );

create policy "battle_votes_update_wallet_or_auth"
  on public.battle_votes for update
  using (
    (auth.uid() = voter_id) OR 
    (voter_wallet is not null and voter_id is null)
  );

-- Allow upsert operations for wallet voting
create policy "battle_votes_upsert_wallet"
  on public.battle_votes for all
  using (
    (auth.uid() = voter_id) OR 
    (voter_wallet is not null)
  )
  with check (
    (auth.uid() = voter_id) OR 
    (voter_wallet is not null and voter_id is null)
  );
