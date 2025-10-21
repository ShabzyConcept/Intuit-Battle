-- Create battles table with proper structure and RLS policies
CREATE TABLE IF NOT EXISTS battles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  member1_id INTEGER NOT NULL,
  member2_id INTEGER NOT NULL,
  member1_votes INTEGER DEFAULT 0,
  member2_votes INTEGER DEFAULT 0,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create battle_votes table for tracking votes
CREATE TABLE IF NOT EXISTS battle_votes (
  id SERIAL PRIMARY KEY,
  battle_id INTEGER NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  voted_for_member INTEGER NOT NULL,
  voter_wallet TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(battle_id, voter_wallet)
);

-- Enable RLS on both tables
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_votes ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no authentication required for community voting)
CREATE POLICY "Allow public read access to battles" ON battles
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to battle_votes" ON battle_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to battle_votes" ON battle_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to battle_votes" ON battle_votes
  FOR UPDATE USING (true);

-- Create function to update battle vote counts
CREATE OR REPLACE FUNCTION update_battle_votes()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vote counts for the battle
  UPDATE battles 
  SET 
    member1_votes = (
      SELECT COUNT(*) FROM battle_votes 
      WHERE battle_id = COALESCE(NEW.battle_id, OLD.battle_id) 
      AND voted_for_member = (SELECT member1_id FROM battles WHERE id = COALESCE(NEW.battle_id, OLD.battle_id))
    ),
    member2_votes = (
      SELECT COUNT(*) FROM battle_votes 
      WHERE battle_id = COALESCE(NEW.battle_id, OLD.battle_id) 
      AND voted_for_member = (SELECT member2_id FROM battles WHERE id = COALESCE(NEW.battle_id, OLD.battle_id))
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.battle_id, OLD.battle_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update vote counts
DROP TRIGGER IF EXISTS update_battle_votes_trigger ON battle_votes;
CREATE TRIGGER update_battle_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON battle_votes
  FOR EACH ROW EXECUTE FUNCTION update_battle_votes();

-- Insert the epic battle between billE.Eth and H0rus
INSERT INTO battles (
  title,
  description,
  member1_id,
  member2_id,
  ends_at,
  is_active
) VALUES (
  'Who inspired you more',
  'Epic 5-day battle between two legendary community leaders. Cast your vote and help decide the ultimate inspiration champion!',
  6, -- billE.Eth
  7, -- H0rus 👁️
  NOW() + INTERVAL '5 days',
  true
) ON CONFLICT DO NOTHING;

-- Add some sample votes to make it interesting
INSERT INTO battle_votes (battle_id, voted_for_member, voter_wallet) VALUES
  (1, 6, '0x1234567890123456789012345678901234567890'),
  (1, 7, '0x2345678901234567890123456789012345678901'),
  (1, 6, '0x3456789012345678901234567890123456789012'),
  (1, 7, '0x4567890123456789012345678901234567890123'),
  (1, 6, '0x5678901234567890123456789012345678901234')
ON CONFLICT (battle_id, voter_wallet) DO NOTHING;
