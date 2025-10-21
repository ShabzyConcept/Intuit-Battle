-- Create battles table with proper structure for public access
CREATE TABLE IF NOT EXISTS public.battles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  member1_id INTEGER NOT NULL,
  member2_id INTEGER NOT NULL,
  member1_votes INTEGER DEFAULT 0,
  member2_votes INTEGER DEFAULT 0,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create battle_votes table for tracking votes
CREATE TABLE IF NOT EXISTS public.battle_votes (
  id SERIAL PRIMARY KEY,
  battle_id INTEGER NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  voted_for_member INTEGER NOT NULL,
  voter_wallet TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(battle_id, voter_wallet)
);

-- Enable RLS but allow public access for community voting
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_votes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to battles
CREATE POLICY "Allow public read access to battles" ON public.battles
  FOR SELECT USING (true);

-- Allow public read access to battle votes
CREATE POLICY "Allow public read access to battle_votes" ON public.battle_votes
  FOR SELECT USING (true);

-- Allow public insert/update for voting (wallet-based)
CREATE POLICY "Allow public voting" ON public.battle_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public vote updates" ON public.battle_votes
  FOR UPDATE USING (true);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_battle_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vote counts for the battle
  UPDATE battles SET
    member1_votes = (
      SELECT COUNT(*) FROM battle_votes 
      WHERE battle_id = COALESCE(NEW.battle_id, OLD.battle_id) 
      AND voted_for_member = (SELECT member1_id FROM battles WHERE id = COALESCE(NEW.battle_id, OLD.battle_id))
    ),
    member2_votes = (
      SELECT COUNT(*) FROM battle_votes 
      WHERE battle_id = COALESCE(NEW.battle_id, OLD.battle_id) 
      AND voted_for_member = (SELECT member2_id FROM battles WHERE id = COALESCE(NEW.battle_id, OLD.battle_id))
    )
  WHERE id = COALESCE(NEW.battle_id, OLD.battle_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote counts
DROP TRIGGER IF EXISTS update_vote_counts_trigger ON battle_votes;
CREATE TRIGGER update_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON battle_votes
  FOR EACH ROW EXECUTE FUNCTION update_battle_vote_counts();

-- Insert the epic battle between billE.Eth and H0rus
INSERT INTO public.battles (
  title,
  description,
  member1_id,
  member2_id,
  ends_at,
  is_active
) VALUES (
  'Epic Core Team Battle',
  'Who inspired you more?',
  6, -- billE.Eth
  7, -- H0rus
  NOW() + INTERVAL '5 days',
  true
) ON CONFLICT DO NOTHING;

-- Add some initial votes to make it interesting
INSERT INTO public.battle_votes (battle_id, voted_for_member, voter_wallet) VALUES
  (1, 6, '0x1234567890123456789012345678901234567890'),
  (1, 7, '0x2345678901234567890123456789012345678901'),
  (1, 6, '0x3456789012345678901234567890123456789012'),
  (1, 7, '0x4567890123456789012345678901234567890123'),
  (1, 6, '0x5678901234567890123456789012345678901234')
ON CONFLICT (battle_id, voter_wallet) DO NOTHING;
