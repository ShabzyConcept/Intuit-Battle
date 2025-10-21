"use client"

import { useState } from "react"
import { TopAgentsGrid } from "@/components/top-agents-grid"
import { WalletConnect } from "@/components/wallet-connect"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"

const mockMembers = [
  {
    id: "6",
    name: "billE.Eth",
    description: "Core Team, Intuition - Early Ethereum Contributor, Builder & Philosopher",
    category: "Core",
    avatar_url: "/bille-eth-card.jpeg",
    total_votes: 1500,
    upvotes: 1200,
    downvotes: 300,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "7",
    name: "H0rus 👁️",
    description: "Intuition Core Team - Visionary Builder & Trust Network Pioneer",
    category: "Core",
    avatar_url: "/horus-card.jpeg",
    total_votes: 1400,
    upvotes: 1150,
    downvotes: 250,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    name: "Fvngbill 👁️",
    description: "Core Team, Intuition - Builder & $TRUST Believer",
    category: "Core",
    avatar_url: "/fvngbill-card.jpeg",
    total_votes: 1350,
    upvotes: 1100,
    downvotes: 250,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "1",
    name: "Alex Chen",
    description: "Blockchain developer and DeFi enthusiast",
    category: "Core",
    avatar_url: "/blockchain-developer.png",
    total_votes: 1250,
    upvotes: 1000,
    downvotes: 250,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "9",
    name: "Valeria",
    description: "Intuition member and community contributor",
    category: "Intuition OG",
    avatar_url: "/valeria-card.jpeg",
    total_votes: 950,
    upvotes: 780,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "10",
    name: "alienbrain",
    description: "Web3 enthusiast | Writer | MOD | Reply Guy | Always on the grind",
    category: "Intuition OG",
    avatar_url: "/alienbrain-card.jpeg",
    total_votes: 920,
    upvotes: 750,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "11",
    name: "RChris",
    description: "Ambassador @0xintuition and community leader",
    category: "Intuition OG",
    avatar_url: "/rchris-card.jpeg",
    total_votes: 890,
    upvotes: 720,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "12",
    name: "AdEwal",
    description: "Building @thehopiumers || @tevaera Adewale guild leader|| @0xintuition",
    category: "Intuition OG",
    avatar_url: "/adewal-card.jpeg",
    total_votes: 860,
    upvotes: 690,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "13",
    name: "Caleb",
    description: "Mysterious enabler of Protocols. Mod @0xintuition",
    category: "Intuition OG",
    avatar_url: "/caleb-card.jpeg",
    total_votes: 830,
    upvotes: 660,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "14",
    name: "Jenny2day",
    description: "Moderator @0xintuition Teva Star @Tevaera Crypto Enthusiast",
    category: "Intuition OG",
    avatar_url: "/jenny2day-card.jpeg",
    total_votes: 800,
    upvotes: 630,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "15",
    name: "Kachi",
    description: "Diplomat | Hairstylist | Model | Crypto enthusiast | Content Writer | Virtual Assistant",
    category: "Intuition OG",
    avatar_url: "/kachi-card.jpeg",
    total_votes: 770,
    upvotes: 600,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "16",
    name: "Samoris.eth",
    description: "Intuition member and community supporter",
    category: "Intuition OG",
    avatar_url: "/samoris-card.jpeg",
    total_votes: 740,
    upvotes: 570,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "17",
    name: "Maskid",
    description: "Intuition member with mysterious presence",
    category: "Intuition OG",
    avatar_url: "/maskid-card.jpeg",
    total_votes: 710,
    upvotes: 540,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "18",
    name: "Tjbolt",
    description: "Intuition member and community participant",
    category: "Intuition OG",
    avatar_url: "/tjbolt-card.jpeg",
    total_votes: 680,
    upvotes: 510,
    downvotes: 170,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    description: "Community organizer and crypto advocate",
    category: "Members",
    avatar_url: "/community-organizer-meeting.png",
    total_votes: 980,
    upvotes: 800,
    downvotes: 180,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    description: "Political activist and governance expert",
    category: "Members",
    avatar_url: "/political-activist.jpg",
    total_votes: 875,
    upvotes: 700,
    downvotes: 175,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Emma Thompson",
    description: "Crypto trader and market analyst",
    category: "Core",
    avatar_url: "/crypto-trader.jpg",
    total_votes: 750,
    upvotes: 600,
    downvotes: 150,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Shedrack (Shabzy202)",
    description: "Intuition OG member and community pioneer",
    category: "Intuition OG",
    avatar_url: "/shedrack-avatar.png",
    total_votes: 1100,
    upvotes: 900,
    downvotes: 200,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [members, setMembers] = useState(mockMembers)

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Intuit 👁️ Battle</h1>
            </div>

            <div className="flex items-center space-x-4">
              <WalletConnect onWalletConnect={handleWalletConnect} onWalletDisconnect={handleWalletDisconnect} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Intuit 👁️
              </span>{" "}
              <span className="text-white">Battle</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Vote for your favorite community leaders and watch them compete in epic battles. Shape the future of our
              community through democratic participation on the Intuition Network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="#top-agents">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  <Users className="w-5 h-5 mr-2" />
                  View Top Agents
                </Button>
              </Link>
              <Link href="/battles">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 hover:border-blue-500 px-8 bg-transparent"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Watch Battles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Agents Section */}
      <section id="top-agents" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Top Agents</h2>
              <p className="text-gray-400">Vote for the most influential community members</p>
            </div>
            <Link href="/leaderboard">
              <Button variant="outline" className="border-gray-700 hover:border-blue-500 bg-transparent">
                View All
              </Button>
            </Link>
          </div>

          <TopAgentsGrid initialMembers={members} walletAddress={walletAddress} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Intuit 👁️ Battle System. Built on Intuition Network.</p>
        </div>
      </footer>
    </div>
  )
}
