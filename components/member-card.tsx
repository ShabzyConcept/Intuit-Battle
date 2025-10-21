"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CommunityMember } from "@/types/database"
import { ChevronUp, ChevronDown, Trophy, Target } from "lucide-react"
import Image from "next/image"

interface MemberCardProps {
  member: CommunityMember
  onVote?: (memberId: string, voteType: "up" | "down") => void
  userVote?: "up" | "down" | null
  isVoting?: boolean
  showVoteButtons?: boolean
}

export function MemberCard({ member, onVote, userVote, isVoting = false, showVoteButtons = true }: MemberCardProps) {
  console.log("[v0] MemberCard received member:", member)

  // Early return if member is undefined or null
  if (!member) {
    console.error("[v0] MemberCard: member is undefined or null")
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Member data not available</div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "politics":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "tech":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "crypto":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "activism":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "community":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const memberName = member.name || "Unknown Member"
  const memberCategory = member.category || "general"
  const totalVotes = member.total_votes ?? 0
  const winPercentage = member.win_percentage ?? 0

  console.log("[v0] MemberCard processed values:", { memberName, memberCategory, totalVotes, winPercentage })

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-800">
            <Image
              src={member.avatar_url || "/placeholder.svg?height=96&width=96"}
              alt={memberName}
              fill
              className="object-cover"
            />
          </div>

          {/* Member Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{memberName}</h3>
            {member.title && <p className="text-sm text-gray-400 font-medium">{member.title}</p>}
            {member.description && <p className="text-xs text-gray-500 line-clamp-2 max-w-48">{member.description}</p>}
          </div>

          {/* Category Badge */}
          <Badge className={`text-xs font-medium ${getCategoryColor(memberCategory)}`}>
            {memberCategory.toUpperCase()}
          </Badge>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-300">{totalVotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-green-400 font-medium">{winPercentage.toFixed(1)}%</span>
            </div>
          </div>

          {/* Vote Buttons */}
          {showVoteButtons && onVote && member.id && (
            <div className="flex items-center space-x-2 pt-2">
              <Button
                size="sm"
                variant={userVote === "up" ? "default" : "outline"}
                onClick={() => onVote(member.id, "up")}
                disabled={isVoting}
                className={`${
                  userVote === "up"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-gray-700 hover:border-green-500 hover:text-green-400"
                }`}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={userVote === "down" ? "default" : "outline"}
                onClick={() => onVote(member.id, "down")}
                disabled={isVoting}
                className={`${
                  userVote === "down"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-gray-700 hover:border-red-500 hover:text-red-400"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
