"use client";

import { useState, useEffect } from "react";
import type { CommunityMember } from "@/types/database";
import { MemberCard } from "./member-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TopAgentsGridProps {
  initialMembers: CommunityMember[];
  walletAddress?: string;
}

export function TopAgentsGrid({ initialMembers, walletAddress }: TopAgentsGridProps) {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>({});
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const categories = ["all", "Core", "Intuition OG", "Members"];

  useEffect(() => {
    if (!walletAddress) return;

    const loadUserVotes = () => {
      const storedVotes = localStorage.getItem(`votes_${walletAddress}`);
      if (storedVotes) {
        setUserVotes(JSON.parse(storedVotes));
      }
    };

    setMembers(initialMembers);

    loadUserVotes();
  }, [walletAddress, initialMembers]);

  const handleVote = async (memberId: string, voteType: "up" | "down") => {
    if (!walletAddress) {
      toast({
        title: "Wallet required",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    setVotingStates((prev) => ({ ...prev, [memberId]: true }));

    try {
      const existingVote = userVotes[memberId];

      if (existingVote === voteType) {
        // Remove vote if clicking same button
        const newVotes = { ...userVotes };
        delete newVotes[memberId];
        setUserVotes(newVotes);
        localStorage.setItem(`votes_${walletAddress}`, JSON.stringify(newVotes));

        // Update member vote count
        setMembers((prev) =>
          prev.map((m) => {
            if (m.id === memberId) {
              const updatedMember = { ...m };
              if (voteType === "up") {
                updatedMember.upvotes -= 1;
              } else {
                updatedMember.downvotes -= 1;
              }
              updatedMember.total_votes = updatedMember.upvotes - updatedMember.downvotes;
              return updatedMember;
            }
            return m;
          })
        );

        toast({
          title: "Vote removed",
          description: "Your vote has been removed",
        });
      } else {
        // Add or update vote
        const newVotes = { ...userVotes, [memberId]: voteType };
        setUserVotes(newVotes);
        localStorage.setItem(`votes_${walletAddress}`, JSON.stringify(newVotes));

        // Update member vote count
        setMembers((prev) =>
          prev.map((m) => {
            if (m.id === memberId) {
              const updatedMember = { ...m };

              // Remove previous vote if exists
              if (existingVote === "up") {
                updatedMember.upvotes -= 1;
              } else if (existingVote === "down") {
                updatedMember.downvotes -= 1;
              }

              // Add new vote
              if (voteType === "up") {
                updatedMember.upvotes += 1;
              } else {
                updatedMember.downvotes += 1;
              }

              updatedMember.total_votes = updatedMember.upvotes - updatedMember.downvotes;
              return updatedMember;
            }
            return m;
          })
        );

        toast({
          title: "Vote recorded",
          description: `You voted ${voteType} for this member`,
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingStates((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const filteredMembers = selectedCategory === "all" ? members : members.filter((member) => member.category === selectedCategory);

  const sortedMembers = [...filteredMembers].sort((a, b) => b.total_votes - a.total_votes);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700 hover:border-blue-500"}>
            {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedMembers.map((member) => (
          <MemberCard key={member.id} member={member} onVote={handleVote} userVote={userVotes[member.id]} isVoting={votingStates[member.id]} showVoteButtons={!!walletAddress} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No members found in this category.</p>
        </div>
      )}
    </div>
  );
}
