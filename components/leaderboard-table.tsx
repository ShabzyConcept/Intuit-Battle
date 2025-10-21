"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CommunityMember } from "@/types/database"
import { Trophy, TrendingUp, Users, Target } from "lucide-react"
import Image from "next/image"

interface LeaderboardTableProps {
  members: CommunityMember[]
}

export function LeaderboardTable({ members }: LeaderboardTableProps) {
  const [sortBy, setSortBy] = useState<"votes" | "percentage" | "battles">("votes")
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all")

  const sortedMembers = [...members].sort((a, b) => {
    switch (sortBy) {
      case "votes":
        return b.total_votes - a.total_votes
      case "percentage":
        return b.win_percentage - a.win_percentage
      case "battles":
        return b.battles_count - a.battles_count
      default:
        return b.total_votes - a.total_votes
    }
  })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />
    if (rank === 2) return <Trophy className="w-4 h-4 text-gray-400" />
    if (rank === 3) return <Trophy className="w-4 h-4 text-amber-600" />
    return null
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "politics":
        return "bg-red-500/10 text-red-400"
      case "tech":
        return "bg-blue-500/10 text-blue-400"
      case "crypto":
        return "bg-yellow-500/10 text-yellow-400"
      case "activism":
        return "bg-green-500/10 text-green-400"
      case "community":
        return "bg-purple-500/10 text-purple-400"
      default:
        return "bg-gray-500/10 text-gray-400"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white">Leaderboard</CardTitle>
          <div className="flex items-center space-x-2">
            {/* Time Filter */}
            <div className="flex items-center space-x-1">
              {["all", "week", "month"].map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={timeFilter === filter ? "default" : "outline"}
                  onClick={() => setTimeFilter(filter as "all" | "week" | "month")}
                  className={
                    timeFilter === filter
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-700 hover:border-blue-500 bg-transparent"
                  }
                >
                  {filter === "all" ? "All Time" : filter === "week" ? "This Week" : "This Month"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          {[
            { key: "votes", label: "Votes", icon: TrendingUp },
            { key: "percentage", label: "Win %", icon: Target },
            { key: "battles", label: "Battles", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              size="sm"
              variant={sortBy === key ? "default" : "ghost"}
              onClick={() => setSortBy(key as "votes" | "percentage" | "battles")}
              className={
                sortBy === key
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }
            >
              <Icon className="w-4 h-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Votes</div>
            <div className="col-span-2">Win Rate</div>
            <div className="col-span-1">Battles</div>
          </div>

          {/* Table Rows */}
          {sortedMembers.map((member, index) => {
            const rank = index + 1
            return (
              <div
                key={member.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-800/50 transition-colors rounded-lg"
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center space-x-2">
                  <span className="text-lg font-bold text-white">{rank}</span>
                  {getRankIcon(rank)}
                </div>

                {/* Player */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                    <Image
                      src={member.avatar_url || "/placeholder.svg?height=40&width=40"}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.title}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2 flex items-center">
                  <Badge className={`text-xs font-medium ${getCategoryColor(member.category)}`}>
                    {member.category.toUpperCase()}
                  </Badge>
                </div>

                {/* Votes */}
                <div className="col-span-2 flex items-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{member.total_votes}</p>
                    <p className="text-xs text-gray-400">votes</p>
                  </div>
                </div>

                {/* Win Rate */}
                <div className="col-span-2 flex items-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{member.win_percentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">win rate</p>
                  </div>
                </div>

                {/* Battles */}
                <div className="col-span-1 flex items-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{member.battles_count}</p>
                    <p className="text-xs text-gray-400">battles</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No members found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
