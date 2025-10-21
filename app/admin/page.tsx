import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminMemberForm } from "@/components/admin-member-form"
import { ArrowLeft, Settings, Users, TrendingUp, Zap, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function AdminPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all community members
  const { data: members } = await supabase
    .from("community_members")
    .select("*")
    .order("created_at", { ascending: false })

  // Get all battles
  const { data: battles } = await supabase
    .from("battles")
    .select(
      "*, member_a:community_members!battles_member_a_id_fkey(name), member_b:community_members!battles_member_b_id_fkey(name)",
    )
    .order("created_at", { ascending: false })
    .limit(10)

  // Get stats
  const totalVotes = members?.reduce((sum, member) => sum + member.total_votes, 0) || 0
  const activeMembers = members?.filter((member) => member.is_active).length || 0
  const activeBattles = battles?.filter((battle) => battle.status === "active").length || 0

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400"
      case "completed":
        return "bg-blue-500/10 text-blue-400"
      case "cancelled":
        return "bg-red-500/10 text-red-400"
      default:
        return "bg-gray-500/10 text-gray-400"
    }
  }

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
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              </div>
            </div>

            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">Admin Access</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{members?.length || 0}</div>
              <div className="text-sm text-gray-400">Total Members</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{activeMembers}</div>
              <div className="text-sm text-gray-400">Active Members</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalVotes.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Votes</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{activeBattles}</div>
              <div className="text-sm text-gray-400">Active Battles</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Members Management */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">Community Members</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
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
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${getCategoryColor(member.category)}`}>{member.category}</Badge>
                            <span className="text-xs text-gray-400">{member.total_votes} votes</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.is_active ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-700">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-700">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Battles Management */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">Recent Battles</CardTitle>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Battle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {battles?.map((battle) => (
                    <div key={battle.id} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white text-sm">{battle.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(battle.status)}`}>{battle.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        {battle.member_a?.name} vs {battle.member_b?.name}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          Votes: {battle.votes_a} - {battle.votes_b}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-700">
                            <Edit className="w-3 h-3 text-gray-400" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-700">
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Member Form */}
        <div className="mt-8">
          <AdminMemberForm />
        </div>
      </div>
    </div>
  )
}
