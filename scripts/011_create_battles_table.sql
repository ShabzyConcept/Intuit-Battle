-- Create battles table for epic battles between community members
CREATE TABLE IF NOT EXISTS public.battles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  member1_id INTEGER REFERENCES public.community_members(id) ON DELETE CASCADE,
  member2_id INTEGER REFERENCES public.community_members(id) ON DELETE CASCADE,
  member1_votes INTEGER DEFAULT 0,
  member2_votes INTEGER DEFAULT 0,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for battles table
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to battles
CREATE POLICY "Allow public read access to battles" ON public.battles
  FOR SELECT USING (true);

-- Create policy to allow public insert for voting (we'll handle this via battle_votes table later)
CREATE POLICY "Allow public read battles" ON public.battles
  FOR SELECT TO public USING (true);

-- Create battle_votes table for tracking individual votes
CREATE TABLE IF NOT EXISTS public.battle_votes (
  id SERIAL PRIMARY KEY,
  battle_id INTEGER REFERENCES public.battles(id) ON DELETE CASCADE,
  voter_wallet TEXT NOT NULL,
  voted_for_member INTEGER NOT NULL, -- 1 for member1, 2 for member2
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(battle_id, voter_wallet)
);

-- Enable RLS for battle_votes table
ALTER TABLE public.battle_votes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read and insert for battle votes
CREATE POLICY "Allow public read battle votes" ON public.battle_votes
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert battle votes" ON public.battle_votes
  FOR INSERT TO public USING (true);

-- Insert the epic battle between billE.Eth and H0rus
INSERT INTO public.battles (
  title,
  description,
  member1_id,
  member2_id,
  ends_at,
  is_active
) VALUES (
  'Who inspired you more',
  'Epic battle between two visionary leaders of the Intuition ecosystem. billE.Eth, the philosophical Ethereum pioneer and early contributor, faces off against H0rus, the visionary trust network architect. Both have shaped the future of decentralized communities in their own unique ways.',
  (SELECT id FROM public.community_members WHERE name = 'billE.Eth' LIMIT 1),
  (SELECT id FROM public.community_members WHERE name LIKE 'H0rus%' LIMIT 1),
  NOW() + INTERVAL '5 days',
  true
);
