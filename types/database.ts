export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  category: string;
  total_votes: number;
  win_percentage: number;
  battles_count: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  voter_id: string;
  community_member_id: string;
  vote_type: "up" | "down";
  created_at: string;
}

export interface Battle {
  id: string;
  member_a_id: string;
  member_b_id: string;
  title: string;
  description: string | null;
  status: "active" | "completed" | "cancelled";
  votes_a: number;
  votes_b: number;
  winner_id: string | null;
  start_time: string;
  end_time: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  member_a?: CommunityMember;
  member_b?: CommunityMember;
}

export interface BattleVote {
  id: string;
  battle_id: string;
  voter_id: string;
  voted_for_id: string;
  created_at: string;
}
