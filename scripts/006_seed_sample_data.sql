-- Insert sample community members
insert into public.community_members (name, title, description, category, avatar_url) values
('Alexandria Ocasio-Cortez', 'Congresswoman', 'Progressive leader fighting for climate action and social justice', 'politics', '/placeholder.svg?height=400&width=400'),
('Donald Trump', 'Former President', 'Business mogul and political figure', 'politics', '/placeholder.svg?height=400&width=400'),
('Elon Musk', 'CEO of Tesla & SpaceX', 'Tech entrepreneur revolutionizing transportation and space exploration', 'tech', '/placeholder.svg?height=400&width=400'),
('Changpeng Zhao', 'Former Binance CEO', 'Cryptocurrency exchange pioneer and blockchain advocate', 'crypto', '/placeholder.svg?height=400&width=400'),
('Michael Heinrich', 'Community Leader', 'Grassroots organizer and community advocate', 'community', '/placeholder.svg?height=400&width=400'),
('Vitalik Buterin', 'Ethereum Founder', 'Blockchain innovator and cryptocurrency visionary', 'crypto', '/placeholder.svg?height=400&width=400'),
('Greta Thunberg', 'Climate Activist', 'Environmental advocate inspiring global climate action', 'activism', '/placeholder.svg?height=400&width=400'),
('Satoshi Nakamoto', 'Bitcoin Creator', 'Mysterious founder of Bitcoin and blockchain technology', 'crypto', '/placeholder.svg?height=400&width=400')
on conflict do nothing;

-- Insert sample battles
insert into public.battles (
  member_a_id, 
  member_b_id, 
  title, 
  description, 
  status,
  start_time,
  end_time
) 
select 
  a.id,
  b.id,
  a.name || ' vs ' || b.name,
  'Who has more impact on their community?',
  case when random() > 0.7 then 'completed' else 'active' end,
  now() - interval '1 day' * (random() * 30),
  case when random() > 0.7 then now() - interval '1 hour' * (random() * 24) else null end
from 
  (select id, name from public.community_members order by random() limit 4) a
cross join 
  (select id, name from public.community_members order by random() limit 4) b
where a.id != b.id
limit 6
on conflict do nothing;
