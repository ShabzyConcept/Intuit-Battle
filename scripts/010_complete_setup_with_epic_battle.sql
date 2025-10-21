-- Complete database setup with epic battle
-- This script creates all necessary tables and the epic battle between billE.Eth and H0rus

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Members',
  avatar_url TEXT,
  total_votes INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create battles table
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  member_a_id UUID NOT NULL REFERENCES community_members(id),
  member_b_id UUID NOT NULL REFERENCES community_members(id),
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  end_time TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES community_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create battle_votes table with wallet support
CREATE TABLE IF NOT EXISTS battle_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  battle_id UUID NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  voted_for_id UUID NOT NULL REFERENCES community_members(id),
  voter_wallet TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(battle_id, voter_wallet)
);

-- Enable RLS on all tables
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (no auth required)
CREATE POLICY "Allow public read access to community_members" ON community_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access to battles" ON battles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to battle_votes" ON battle_votes FOR SELECT USING (true);

-- Allow public insert for battle votes (wallet-based voting)
CREATE POLICY "Allow public insert battle_votes" ON battle_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update battle_votes" ON battle_votes FOR UPDATE USING (true);

-- Insert Core team members (billE.Eth and H0rus)
INSERT INTO community_members (id, name, description, category, avatar_url, total_votes, upvotes, downvotes, is_active) VALUES
  ('6b8f4e2a-1234-4567-8901-234567890123', 'billE.Eth', 'Core Team, Intuition - Early Ethereum Contributor, Builder & Philosopher', 'Core', '/bille-eth-card.jpeg', 1500, 1200, 300, true),
  ('7c9f5e3b-2345-5678-9012-345678901234', 'H0rus 👁️', 'Intuition Core Team - Visionary Builder & Trust Network Pioneer', 'Core', '/horus-card.jpeg', 1400, 1150, 250, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  avatar_url = EXCLUDED.avatar_url,
  total_votes = EXCLUDED.total_votes,
  upvotes = EXCLUDED.upvotes,
  downvotes = EXCLUDED.downvotes,
  updated_at = NOW();

-- Create the epic battle between billE.Eth and H0rus
INSERT INTO battles (
  id,
  title,
  description,
  status,
  member_a_id,
  member_b_id,
  votes_a,
  votes_b,
  end_time,
  created_at
) VALUES (
  uuid_generate_v4(),
  'Who inspired you more',
  'Epic 5-day battle between two visionary leaders of the Intuition ecosystem. billE.Eth, the philosophical Ethereum pioneer who helped shape the decentralized future, faces off against H0rus, the trust network architect building the infrastructure for human connection. Both have contributed immensely to the community - now it''s time to decide who has inspired you more on your crypto journey.',
  'active',
  '6b8f4e2a-1234-4567-8901-234567890123', -- billE.Eth
  '7c9f5e3b-2345-5678-9012-345678901234', -- H0rus
  0,
  0,
  NOW() + INTERVAL '5 days',
  NOW()
) ON CONFLICT DO NOTHING;

-- Create function to update vote counts
CREATE OR REPLACE FUNCTION update_battle_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vote counts for the battle
  UPDATE battles SET
    votes_a = (
      SELECT COUNT(*) FROM battle_votes 
      WHERE battle_id = COALESCE(NEW.battle_id, OLD.battle_id) 
      AND voted_for_id = battles.member_a_id
    ),
    votes_b = (
      SELECT COUNT(*) FROM battle_votes 
      WHERE battle_id = COALESCE(NEW.battle_id, OLD.battle_id) 
      AND voted_for_id = battles.member_b_id
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.battle_id, OLD.battle_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update vote counts
DROP TRIGGER IF EXISTS battle_vote_count_trigger ON battle_votes;
CREATE TRIGGER battle_vote_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON battle_votes
  FOR EACH ROW EXECUTE FUNCTION update_battle_vote_counts();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);
CREATE INDEX IF NOT EXISTS idx_battles_end_time ON battles(end_time);
CREATE INDEX IF NOT EXISTS idx_battle_votes_battle_id ON battle_votes(battle_id);
CREATE INDEX IF NOT EXISTS idx_battle_votes_voter_wallet ON battle_votes(voter_wallet);
CREATE INDEX IF NOT EXISTS idx_community_members_category ON community_members(category);
