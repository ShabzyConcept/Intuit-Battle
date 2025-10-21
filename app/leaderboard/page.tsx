import { createClient } from "@/lib/supabase/server"
import { LeaderboardPodium } from "@/components/leaderboard-podium"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Get all community members sorted by votes
  const { data: members } = await supabase
    .from("community_members")
    .select("*")
    .eq("is_active", true)
    .order("total_votes", { ascending: false })

  const topThree = members?.slice(0, 3) || []
  const allMembers = members || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Leaderboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                {allMembers.length} Members
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Intuit 👁️
            </span>{" "}
            <span className="text-white">Champions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See who&apos;s leading the Intuit 👁️ Battle rankings and climbing to the top of the leaderboard.
          </p>
        </div>

        {/* Podium */}
        <LeaderboardPodium topThree={topThree} />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {allMembers.reduce((sum, member) => sum + member.total_votes, 0).toLocaleString()}
            </div>
            <div className="text-gray-400">Total Votes Cast</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{allMembers.length}</div>
            <div className="text-gray-400">Active Members</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {allMembers.reduce((sum, member) => sum + member.battles_count, 0)}
            </div>
            <div className="text-gray-400">Total Battles</div>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <LeaderboardTable members={allMembers} />
      </div>
    </div>
  )
}
