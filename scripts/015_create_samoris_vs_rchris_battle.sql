-- Create a new battle between Samoris.eth and RChris
-- Battle: Who is the best and most valuable community member?
-- Duration: 2 weeks from now

INSERT INTO battles (
    title,
    description,
    member1_id,
    member2_id,
    member1_votes,
    member2_votes,
    total_votes,
    start_date,
    end_date,
    is_active,
    created_at,
    updated_at
) VALUES (
    'Best & Most Valuable Community Member',
    'The ultimate showdown between two Intuition OG legends - Samoris.eth vs RChris. Who has contributed more value to the community? Who deserves the title of most valuable community member? Cast your vote and decide the fate of this epic battle!',
    16, -- Samoris.eth
    11, -- RChris
    0,  -- Starting votes for Samoris.eth
    0,  -- Starting votes for RChris
    0,  -- Total votes
    NOW(), -- Start immediately
    NOW() + INTERVAL '14 days', -- End in 2 weeks
    true, -- Active battle
    NOW(),
    NOW()
);

-- Add some initial votes to make it interesting
INSERT INTO battle_votes (battle_id, member_id, voter_ip, created_at)
SELECT 
    (SELECT id FROM battles WHERE title = 'Best & Most Valuable Community Member'),
    16, -- Vote for Samoris.eth
    '192.168.1.' || generate_series(1, 45),
    NOW() - INTERVAL '1 hour' + (random() * INTERVAL '1 hour')
FROM generate_series(1, 45);

INSERT INTO battle_votes (battle_id, member_id, voter_ip, created_at)
SELECT 
    (SELECT id FROM battles WHERE title = 'Best & Most Valuable Community Member'),
    11, -- Vote for RChris
    '10.0.0.' || generate_series(1, 38),
    NOW() - INTERVAL '1 hour' + (random() * INTERVAL '1 hour')
FROM generate_series(1, 38);

-- Update the battle vote counts
UPDATE battles 
SET 
    member1_votes = 45,
    member2_votes = 38,
    total_votes = 83,
    updated_at = NOW()
WHERE title = 'Best & Most Valuable Community Member';
