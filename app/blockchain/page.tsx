import { createClient } from "@/lib/supabase/server"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Blocks, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"

export default async function BlockchainPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get some stats for the blockchain page
  const { data: members } = await supabase.from("community_members").select("*").eq("is_active", true)

  const totalVotes = members?.reduce((sum, member) => sum + member.total_votes, 0) || 0
  const totalMembers = members?.length || 0

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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Blocks className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Blockchain Integration</h1>
              </div>
            </div>

            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Intuition Testnet</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Blockchain
            </span>{" "}
            <span className="text-white">Voting</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect your wallet and cast immutable votes on the Intuition Testnet blockchain. Your voice matters in
            shaping the community.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white text-center">Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <WalletConnect />
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalVotes.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Votes</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalMembers}</div>
              <div className="text-sm text-gray-400">Active Members</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Blocks className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">1,247</div>
              <div className="text-sm text-gray-400">Blocks Mined</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">0.001</div>
              <div className="text-sm text-gray-400">ETH Gas Fee</div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center space-x-2">
                <Blocks className="w-5 h-5 text-purple-400" />
                <span>Immutable Voting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                All votes are recorded permanently on the Intuition Testnet blockchain, ensuring transparency and
                preventing manipulation.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Cryptographically secured transactions</li>
                <li>• Public verification of all votes</li>
                <li>• Tamper-proof voting records</li>
                <li>• Decentralized consensus mechanism</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Low Gas Fees</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Vote on the Intuition Testnet with minimal transaction costs, making participation accessible to
                everyone.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Average gas fee: 0.001 ETH</li>
                <li>• Fast transaction confirmation</li>
                <li>• Optimized smart contracts</li>
                <li>• Batch voting capabilities</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Vote On-Chain?</h3>
              <p className="text-gray-300 mb-6">
                Connect your wallet and start participating in blockchain-powered Intuit 👁️ Battle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    View Members
                  </Button>
                </Link>
                <Link href="/battles">
                  <Button variant="outline" className="border-gray-700 hover:border-purple-500 bg-transparent">
                    <Zap className="w-4 h-4 mr-2" />
                    Join Battles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
