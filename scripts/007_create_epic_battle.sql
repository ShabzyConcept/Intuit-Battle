-- Create epic battle between billE.Eth and H0rus
-- Caption: "Who inspired you more"
-- Duration: 5 days from now

INSERT INTO public.battles (
  member_a_id,
  member_b_id,
  title,
  description,
  status,
  start_time,
  end_time
) VALUES (
  -- billE.Eth (Core team member)
  (SELECT id FROM public.community_members WHERE name = 'billE.Eth' LIMIT 1),
  -- H0rus 👁️ (Core team member)  
  (SELECT id FROM public.community_members WHERE name = 'H0rus 👁️' LIMIT 1),
  'Who inspired you more',
  'Epic battle between two Core team legends: billE.Eth, the philosophical Ethereum pioneer, versus H0rus 👁️, the visionary trust network architect. Cast your vote for who has inspired you more in the crypto space.',
  'active',
  NOW(),
  NOW() + INTERVAL '5 days'
);
