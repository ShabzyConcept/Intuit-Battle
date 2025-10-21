-- Complete database setup for community voting system
-- This script creates all necessary tables and data

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- Create community_members table
CREATE TABLE IF NOT EXISTS public.community_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'Members',
    avatar_url VARCHAR(500),
    total_votes INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create battles table
CREATE TABLE IF NOT EXISTS public.battles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    member1_id INTEGER REFERENCES public.community_members(id),
    member2_id INTEGER REFERENCES public.community_members(id),
    member1_votes INTEGER DEFAULT 0,
    member2_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create battle_votes table for tracking individual votes
CREATE TABLE IF NOT EXISTS public.battle_votes (
    id SERIAL PRIMARY KEY,
    battle_id INTEGER REFERENCES public.battles(id),
    member_id INTEGER REFERENCES public.community_members(id),
    voter_ip VARCHAR(45), -- For anonymous voting tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access on community_members" ON public.community_members
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on battles" ON public.battles
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on battle_votes" ON public.battle_votes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on battle_votes" ON public.battle_votes
    FOR INSERT WITH CHECK (true);

-- Insert community members data
INSERT INTO public.community_members (name, description, category, avatar_url, total_votes, upvotes, downvotes) VALUES
('billE.Eth', 'Intuition Core Team - Visionary Leader & Protocol Pioneer', 'Core', '/bille-card.jpeg', 1500, 1200, 300),
('H0rus 👁️', 'Intuition Core Team - Visionary Builder & Trust Network Pioneer', 'Core', '/horus-card.jpeg', 1400, 1150, 250),
('Fvngbill 👁️', 'Core Team, Intuition - Builder & $TRUST Believer', 'Core', '/fvngbill-card.jpeg', 1350, 1100, 250),
('Alex Chen', 'Blockchain developer and DeFi enthusiast', 'Core', '/blockchain-developer.png', 1250, 1000, 250),
('Shedrack (Shabzy202)', 'Intuition OG member and community pioneer', 'Intuition OG', '/shedrack-avatar.png', 1100, 900, 200),
('Sarah Johnson', 'Community organizer and crypto advocate', 'Members', '/community-organizer-meeting.png', 980, 800, 180),
('Valeria', 'Intuition member and community contributor', 'Intuition OG', '/valeria-card.jpeg', 950, 780, 170),
('alienbrain', 'Web3 enthusiast | Writer | MOD | Reply Guy | Always on the grind', 'Intuition OG', '/alienbrain-card.jpeg', 920, 750, 170),
('RChris', 'Ambassador @0xintuition and community leader', 'Intuition OG', '/rchris-card.jpeg', 890, 720, 170),
('Marcus Rodriguez', 'Political activist and governance expert', 'Members', '/political-activist.jpg', 875, 700, 175),
('AdEwal', 'Building @thehopiumers || @tevaera Adewale guild leader|| @0xintuition', 'Intuition OG', '/adewal-card.jpeg', 860, 690, 170),
('Caleb', 'Mysterious enabler of Protocols. Mod @0xintuition', 'Intuition OG', '/caleb-card.jpeg', 830, 660, 170),
('Jenny2day', 'Moderator @0xintuition Teva Star @Tevaera Crypto Enthusiast', 'Intuition OG', '/jenny2day-card.jpeg', 800, 630, 170),
('Kachi', 'Diplomat | Hairstylist | Model | Crypto enthusiast | Content Writer | Virtual Assistant', 'Intuition OG', '/kachi-card.jpeg', 770, 600, 170),
('Emma Thompson', 'Crypto trader and market analyst', 'Core', '/crypto-trader.jpg', 750, 600, 150),
('Samoris.eth', 'Intuition member and community supporter', 'Intuition OG', '/samoris-card.jpeg', 740, 570, 170),
('Maskid', 'Intuition member with mysterious presence', 'Intuition OG', '/maskid-card.jpeg', 710, 540, 170),
('Tjbolt', 'Intuition member and community participant', 'Intuition OG', '/tjbolt-card.jpeg', 680, 510, 170);

-- Insert the epic battle between billE.Eth and H0rus
INSERT INTO public.battles (title, description, member1_id, member2_id, member1_votes, member2_votes, total_votes, end_date) VALUES
('Who inspired you more', 'The ultimate showdown between two Intuition Core Team visionaries - billE.Eth vs H0rus 👁️. Cast your vote for who has inspired you more in the Web3 space!', 1, 2, 847, 623, 1470, NOW() + INTERVAL '5 days');

-- Insert some sample votes to make the battle interesting
INSERT INTO public.battle_votes (battle_id, member_id, voter_ip) VALUES
(1, 1, '192.168.1.1'),
(1, 1, '192.168.1.2'),
(1, 2, '192.168.1.3'),
(1, 1, '192.168.1.4'),
(1, 2, '192.168.1.5');

-- Create function to update battle vote counts
CREATE OR REPLACE FUNCTION update_battle_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the battle vote counts
    UPDATE public.battles 
    SET 
        member1_votes = (SELECT COUNT(*) FROM public.battle_votes WHERE battle_id = NEW.battle_id AND member_id = (SELECT member1_id FROM public.battles WHERE id = NEW.battle_id)),
        member2_votes = (SELECT COUNT(*) FROM public.battle_votes WHERE battle_id = NEW.battle_id AND member_id = (SELECT member2_id FROM public.battles WHERE id = NEW.battle_id)),
        total_votes = (SELECT COUNT(*) FROM public.battle_votes WHERE battle_id = NEW.battle_id),
        updated_at = NOW()
    WHERE id = NEW.battle_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote counts
CREATE TRIGGER update_battle_votes_trigger
    AFTER INSERT ON public.battle_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_battle_votes();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
