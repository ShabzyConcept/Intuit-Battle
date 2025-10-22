"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/countdown-timer";

import { Clock, Users, Trophy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Battle, Vote } from "@/app/battles/page";

interface BattleCardProps {
  battle: Battle;
  onVote?: (battle: Battle, memberId: string) => void | Promise<void>;
  userVote?: Record<string, Vote> | Vote;
  isVoting?: boolean;
  showVoteButtons?: boolean;
}

export function BattleCard({ battle, onVote, userVote, isVoting, showVoteButtons = true }: BattleCardProps) {
  const [isExpired, setIsExpired] = useState(false);

  const battleKey = battle.id.toString();
  const savedAddress = localStorage.getItem("walletAddress");
  const currentVote = userVote?.[battleKey];

  const totalVotes = battle.votes_a + battle.votes_b;
  const percentageA = totalVotes > 0 ? (battle.votes_a / totalVotes) * 100 : 50;
  const percentageB = totalVotes > 0 ? (battle.votes_b / totalVotes) * 100 : 50;

  const isVotingDisabled = isVoting || isExpired || battle.status !== "active" || !battle.end_time || currentVote?.voter_wallet_address == savedAddress;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const now = new Date();

  const getBattleStatusText = (battle: any) => {
    const startTime = battle.start_time ? new Date(battle.start_time) : null;
    const endTime = battle.end_time ? new Date(battle.end_time) : null;

    if (battle.status === "active") {
      if (startTime && startTime > now) {
        return "Upcoming";
      }
      if (endTime && endTime < now) {
        return "Voting Ended";
      }
      return "Active";
    }

    if (endTime) {
      return `Ended ${endTime.toLocaleDateString()}`;
    }

    return "No end date";
  };

  const handleCountdownExpire = () => {
    setIsExpired(true);
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Battle Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{battle.title}</h3>
            <Badge className={`text-xs font-medium ${getStatusColor(battle.status)}`}>{getBattleStatusText(battle).toUpperCase()}</Badge>
          </div>

          {/* Battle Description */}
          {battle.description && <p className="text-sm text-gray-400">{battle.description}</p>}

          {battle.status === "active" && battle.end_time && (
            <div className="flex justify-center">
              <CountdownTimer endTime={battle.end_time} onExpire={handleCountdownExpire} className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700" />
            </div>
          )}

          {/* VS Section */}
          <div className="flex items-center justify-between">
            {/* Member A */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                <Image src={battle.member_a?.avatar_url || "/placeholder.svg?height=64&width=64"} alt={battle.member_a?.name || "Member A"} fill className="object-cover" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">{battle.member_a?.name}</p>
                <p className="text-xs text-gray-400">{battle.member_a?.title}</p>
              </div>
              {showVoteButtons && onVote && !isVotingDisabled && (
                <Button
                  size="sm"
                  variant={battleKey === battle.member_a_id ? "default" : "outline"}
                  onClick={() => onVote(battle, battle.member_a_id)}
                  disabled={isVotingDisabled}
                  className="border-gray-700 hover:border-blue-500 hover:text-blue-400">
                  Vote
                </Button>
              )}
              {showVoteButtons && onVote && isVotingDisabled && battle.status === "active" && (
                <Button size="sm" variant="outline" disabled className="border-gray-700 text-gray-500 cursor-not-allowed bg-transparent">
                  {isExpired ? "Expired" : "Vote"}
                </Button>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center px-4">
              <div className="text-2xl font-bold text-gray-500">VS</div>
              <div className="flex items-center space-x-1 text-xs text-gray-400 mt-2">
                <Users className="w-3 h-3" />
                <span>{totalVotes}</span>
              </div>
            </div>

            {/* Member B */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                <Image src={battle.member_b?.avatar_url || "/placeholder.svg?height=64&width=64"} alt={battle.member_b?.name || "Member B"} fill className="object-cover" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">{battle.member_b?.name}</p>
                <p className="text-xs text-gray-400">{battle.member_b?.title}</p>
              </div>
              {showVoteButtons && onVote && !isVotingDisabled && (
                <Button
                  size="sm"
                  variant={battleKey === battle.member_b_id ? "default" : "outline"}
                  onClick={() => onVote(battle, battle.member_b_id)}
                  disabled={isVotingDisabled}
                  className="border-gray-700 hover:border-blue-500 hover:text-blue-400">
                  Vote
                </Button>
              )}
              {showVoteButtons && onVote && isVotingDisabled && battle.status === "active" && (
                <Button size="sm" variant="outline" disabled className="border-gray-700 text-gray-500 cursor-not-allowed bg-transparent">
                  {isExpired ? "Expired" : "Vote"}
                </Button>
              )}
            </div>
          </div>

          {/* Vote Progress */}
          {totalVotes > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">
                  {battle.votes_a} ({percentageA.toFixed(1)}%)
                </span>
                <span className="text-purple-400">
                  {battle.votes_b} ({percentageB.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" style={{ width: `${percentageA}%` }} />
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500" style={{ width: `${percentageB}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Battle Info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{getBattleStatusText(battle)}</span>
            </div>
            {battle.winner_id && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <Trophy className="w-3 h-3" />
                <span>{battle.winner_id === battle.member_a_id ? battle.member_a?.name : battle.member_b?.name} wins!</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
