"use client";

import { BattleCard } from "@/components/battle-card";
import { WalletConnect } from "@/components/wallet-connect";
import { Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PaymentService } from "@/lib/payment-service";
import { te } from "date-fns/locale";

export interface Battle {
  id: string;
  title: string;
  description?: string;
  member_a_id: string;
  member_b_id: string;
  votes_a: number;
  votes_b: number;
  status: "active" | "completed";
  start_time: string;
  end_time: string;
  winner_id: string | null;
  is_active: boolean;
  created_at: string;
  member_a?: {
    id: string;
    name: string;
    title: string;
    description?: string;
    avatar_url?: string;
  };
  member_b?: {
    id: string;
    name: string;
    title: string;
    description?: string;
    avatar_url?: string;
  };
}

export interface Vote {
  id: number;
  created_at: string;
  voter_wallet_address: string;
  battle_id: number;
  vote_member_id: number;
}

export default function BattlesPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, Vote>>({});
  const [isVoting, setIsVoting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const now = new Date();

  useEffect(() => {
    fetchBattles();
    const savedAddress = localStorage.getItem("walletAddress");

    if (savedAddress) {
      setWalletAddress(savedAddress);
      fetchUserVotes();
    }
  }, []);

  const getMemberPosition = (battle: any, memberId: string): "member1" | "member2" | null => {
    if (battle.member_a_id === memberId) return "member1";
    if (battle.member_b_id === memberId) return "member2";
    return null;
  };

  const fetchBattles = async () => {
    try {
      console.log("[v0] Fetching battles from database...");

      const { data: battlesData, error: battlesError } = await supabase.from("battles").select("*").order("created_at", { ascending: false });

      console.log("[v0] Battles query result:", { battles: battlesData, error: battlesError });

      if (battlesError) {
        console.error("[v0] Database error:", battlesError.message);

        if (battlesError.message?.includes("Could not find the table") || battlesError.message?.includes("relation") || battlesError.message?.includes("does not exist")) {
          console.log("[v0] Battles table doesn't exist yet. Database setup required.");
          setBattles([]);
          setLoading(false);
          return;
        }

        setBattles([]);
        setLoading(false);
        return;
      }

      if (!battlesData || battlesData.length === 0) {
        console.log("[v0] No battles found in database");
        setBattles([]);
        return;
      }

      const { data: membersData, error: membersError } = await supabase.from("community_members").select("*");

      if (membersError) {
        console.error("[v0] Error fetching members:", membersError);
        setBattles([]);
        return;
      }

      const battlesWithMembers = battlesData.map((battle) => {
        const member1 = membersData?.find((m) => m.id === battle.member1_id);
        const member2 = membersData?.find((m) => m.id === battle.member2_id);

        return {
          id: battle.id.toString(),
          title: battle.title,
          description: battle.description,
          member_a_id: battle.member1_id.toString(), // Map member1_id to member_a_id
          member_b_id: battle.member2_id.toString(), // Map member2_id to member_b_id
          votes_a: battle.member1_votes || 0, // Map member1_votes to votes_a
          votes_b: battle.member2_votes || 0, // Map member2_votes to votes_b
          status: battle.is_active ? "active" : "completed",
          start_time: battle.start_date || battle.created_at,
          end_time: battle.end_date, // Map end_date to end_time
          winner_id: null, // Will be determined by vote counts
          is_active: battle.is_active,
          created_at: battle.created_at,
          member_a: member1
            ? {
                id: member1.id.toString(),
                name: member1.name,
                title: member1.title,
                description: member1.description,
                avatar_url: member1.avatar_url,
              }
            : undefined,
          member_b: member2
            ? {
                id: member2.id.toString(),
                name: member2.name,
                title: member2.title,
                description: member2.description,
                avatar_url: member2.avatar_url,
              }
            : undefined,
        };
      });

      console.log("[v0] Transformed battles:", battlesWithMembers);
      setBattles(battlesWithMembers);
    } catch (error) {
      console.error("[v0] Database error:", error);
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.log("[v0] Network error - database might not be accessible");
      }
      setBattles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const { data: votes, error } = await supabase.from("battle_votes").select("*");

      if (error) {
        console.error("[v0] Error fetching user votes:", error);
        return;
      }

      if (votes) {
        const votesMap = votes.reduce((acc, vote) => {
          acc[vote.battle_id.toString()] = vote;
          return acc;
        }, {} as Record<string, Vote>);

        setUserVotes(votesMap);
      }
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const handleVote = async (battle: Battle, memberId: string) => {
    if (!walletAddress) {
      alert("Please connect your wallet to vote");
      return;
    }

    setIsVoting(true);

    try {
      const recipientAddress = "0x8eC0697AbaccBf7b4049392EAa40d57d8aB5a9f6"; // Mock address

      const txHash = await PaymentService.sendPayment(walletAddress, recipientAddress);

      console.log("Payment successful. Transaction hash:", txHash);

      // if (false) {
      //   try {
      //     const { data, error } = await supabase.from("battle_votes").upsert({
      //       battle_id: Number.parseInt(battle.id),
      //       vote_member_id: Number.parseInt(memberId),
      //       voter_wallet_address: walletAddress,
      //     });

      //     console.log("Vote upsert result:", { data, error });
      //     if (error) throw error;
      //     await supabase.rpc("increment_vote_count_v2", {
      //       battle_id: battle.id,
      //     });

      //     await supabase.rpc("rpc_increment_vote", {
      //       p_battle_id: battle.id,
      //       p_member_position: getMemberPosition(battle, memberId),
      //     });

      //     await fetchBattles();
      //     await fetchUserVotes();
      //   } catch (error) {
      //     console.error("Error voting:", error);
      //     alert("Failed to submit vote. Please try again.");
      //   } finally {
      //     setIsVoting(false);
      //   }
      // }
    } catch (error: any) {
      setIsVoting(false);
      console.log("Payment failed. Please try again.");
    }
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    localStorage.setItem("walletAddress", address);
    fetchUserVotes();
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
    setUserVotes({});
  };

  const activeBattles = battles.filter((battle) => battle.status === "active" && battle.end_time && new Date(battle.end_time) > new Date());
  const completedBattles = battles.filter((battle) => battle.status !== "active" || !battle.end_time || new Date(battle.end_time) <= new Date());

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading battles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Intuit 👁️ Battle</h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Epic</span> <span className="text-white">1v1 Battles</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Watch community leaders go head-to-head in epic battles. Connect your wallet and vote for your favorite.</p>
        </div>

        {/* Active Battles */}
        {activeBattles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Active Battles</h2>
              <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium">{activeBattles.length} Live</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {}
              {activeBattles.map((battle) => (
                <BattleCard key={battle.id} battle={battle} userVote={userVotes} onVote={handleVote} isVoting={isVoting} showVoteButtons={!!walletAddress && new Date(battle.start_time) < now} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Battles */}
        {completedBattles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Battle History</h2>
              <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">{completedBattles.length} Completed</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedBattles.map((battle) => (
                <BattleCard key={battle.id} battle={battle} onVote={handleVote} userVote={userVotes[battle.id]} showVoteButtons={isVoting} />
              ))}
            </div>
          </section>
        )}

        {/* No Battles */}
        {battles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Database Setup Required</h3>
            <p className="text-gray-400 mb-6">The battles table doesn't exist yet. Run the database setup script to create the epic battle between billE.Eth and H0rus 👁️!</p>
            <div className="bg-gray-800/50 rounded-lg p-6 max-w-lg mx-auto">
              <p className="text-sm text-gray-300 mb-3 font-medium">To set up the database:</p>
              <div className="bg-gray-900 rounded-md p-3 mb-4">
                <code className="text-sm text-green-400">Run script: 014_complete_database_setup.sql</code>
              </div>
              <p className="text-xs text-gray-400">This will create the battles table and insert the epic showdown between the two Intuition Core Team visionaries.</p>
            </div>
          </div>
        )}

        {/* Connect Wallet Prompt
        {!walletAddress && battles.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <p className="text-sm mb-2">Connect your wallet to vote in battles!</p>
            <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
          </div>
        )} */}
      </div>
    </div>
  );
}
