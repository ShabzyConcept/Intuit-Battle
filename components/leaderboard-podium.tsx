"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { CommunityMember } from "@/types/database"
import { Trophy, Medal, Award } from "lucide-react"
import Image from "next/image"

interface LeaderboardPodiumProps {
  topThree: CommunityMember[]
}

export function LeaderboardPodium({ topThree }: LeaderboardPodiumProps) {
  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-7 h-7 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return null
    }
  }

  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 1:
        return "h-32"
      case 2:
        return "h-24"
      case 3:
        return "h-20"
      default:
        return "h-16"
    }
  }

  const getPodiumOrder = (members: CommunityMember[]) => {
    if (members.length === 0) return []
    if (members.length === 1) return [{ member: members[0], position: 1 }]
    if (members.length === 2)
      return [
        { member: members[1], position: 2 },
        { member: members[0], position: 1 },
      ]

    return [
      { member: members[1], position: 2 }, // Second place on left
      { member: members[0], position: 1 }, // First place in center
      { member: members[2], position: 3 }, // Third place on right
    ]
  }

  const orderedMembers = getPodiumOrder(topThree)

  if (topThree.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No leaderboard data available</p>
      </div>
    )
  }

  return (
    <div className="flex items-end justify-center space-x-4 mb-12">
      {orderedMembers.map(({ member, position }) => (
        <div key={member.id} className="flex flex-col items-center space-y-4">
          {/* Member Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700">
              <Image
                src={member.avatar_url || "/placeholder.svg?height=80&width=80"}
                alt={member.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {/* Position Badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-700">
              {getPodiumIcon(position)}
            </div>
          </div>

          {/* Member Info */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-white">{member.name}</h3>
            <p className="text-xs text-gray-400">{member.total_votes} votes</p>
          </div>

          {/* Podium Base */}
          <Card className="bg-gradient-to-t from-gray-800 to-gray-700 border-gray-600">
            <CardContent className={`p-4 ${getPodiumHeight(position)} flex items-center justify-center min-w-[80px]`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{position}</div>
                <div className="text-xs text-gray-400">{position === 1 ? "1ST" : position === 2 ? "2ND" : "3RD"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
