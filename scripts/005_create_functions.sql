-- Function to update community member stats after voting
create or replace function public.update_member_stats()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Update total votes for the community member
  update public.community_members
  set 
    total_votes = (
      select count(*) 
      from public.votes 
      where community_member_id = coalesce(new.community_member_id, old.community_member_id)
      and vote_type = 'up'
    ),
    updated_at = now()
  where id = coalesce(new.community_member_id, old.community_member_id);
  
  return coalesce(new, old);
end;
$$;

-- Create triggers for vote changes
drop trigger if exists update_member_stats_on_vote_insert on public.votes;
create trigger update_member_stats_on_vote_insert
  after insert on public.votes
  for each row
  execute function public.update_member_stats();

drop trigger if exists update_member_stats_on_vote_update on public.votes;
create trigger update_member_stats_on_vote_update
  after update on public.votes
  for each row
  execute function public.update_member_stats();

drop trigger if exists update_member_stats_on_vote_delete on public.votes;
create trigger update_member_stats_on_vote_delete
  after delete on public.votes
  for each row
  execute function public.update_member_stats();

-- Function to update battle vote counts
create or replace function public.update_battle_stats()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Update vote counts for the battle
  update public.battles
  set 
    votes_a = (
      select count(*) 
      from public.battle_votes 
      where battle_id = coalesce(new.battle_id, old.battle_id)
      and voted_for_id = member_a_id
    ),
    votes_b = (
      select count(*) 
      from public.battle_votes 
      where battle_id = coalesce(new.battle_id, old.battle_id)
      and voted_for_id = member_b_id
    ),
    updated_at = now()
  where id = coalesce(new.battle_id, old.battle_id);
  
  return coalesce(new, old);
end;
$$;

-- Create triggers for battle vote changes
drop trigger if exists update_battle_stats_on_vote_insert on public.battle_votes;
create trigger update_battle_stats_on_vote_insert
  after insert on public.battle_votes
  for each row
  execute function public.update_battle_stats();

drop trigger if exists update_battle_stats_on_vote_update on public.battle_votes;
create trigger update_battle_stats_on_vote_update
  after update on public.battle_votes
  for each row
  execute function public.update_battle_stats();

drop trigger if exists update_battle_stats_on_vote_delete on public.battle_votes;
create trigger update_battle_stats_on_vote_delete
  after delete on public.battle_votes
  for each row
  execute function public.update_battle_stats();
