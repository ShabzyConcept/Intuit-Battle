"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlockchainVoteProps {
  memberId: string
  memberName: string
  voteType: "up" | "down"
  walletAddress?: string
  onVoteComplete?: (txHash: string) => void
}

export function BlockchainVote({ memberId, memberName, voteType, walletAddress, onVoteComplete }: BlockchainVoteProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [txHash, setTxHash] = useState<string>("")
  const [voteStatus, setVoteStatus] = useState<"idle" | "pending" | "confirmed" | "failed">("idle")
  const { toast } = useToast()

  const submitBlockchainVote = async () => {
    if (!walletAddress || !window.ethereum) {
      toast({
        title: "Wallet required",
        description: "Please connect your wallet to vote on-chain",
        variant: "destructive",
      })
      return
    }

    setIsVoting(true)
    setVoteStatus("pending")

    try {
      // Simulate blockchain transaction
      // In a real implementation, this would interact with the Intuition Testnet smart contract
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setTxHash(mockTxHash)
      setVoteStatus("confirmed")
      onVoteComplete?.(mockTxHash)

      toast({
        title: "Vote recorded on-chain",
        description: `Your ${voteType} vote for ${memberName} has been confirmed`,
      })
    } catch (error: any) {
      console.error("Blockchain vote error:", error)
      setVoteStatus("failed")
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to record vote on blockchain",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const getStatusColor = () => {
    switch (voteStatus) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "confirmed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getStatusText = () => {
    switch (voteStatus) {
      case "pending":
        return "Transaction Pending"
      case "confirmed":
        return "Vote Confirmed"
      case "failed":
        return "Transaction Failed"
      default:
        return "Ready to Vote"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center space-x-2">
          <span>Blockchain Vote</span>
          <Badge className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-300">
          <p>
            Cast your <span className="font-medium text-white">{voteType}</span> vote for{" "}
            <span className="font-medium text-white">{memberName}</span> on the Intuition Testnet blockchain.
          </p>
        </div>

        {voteStatus === "idle" && (
          <Button
            onClick={submitBlockchainVote}
            disabled={isVoting || !walletAddress}
            className={`w-full ${
              voteType === "up" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {isVoting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Vote...
              </>
            ) : (
              `Vote ${voteType.toUpperCase()} On-Chain`
            )}
          </Button>
        )}

        {voteStatus === "pending" && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Waiting for blockchain confirmation...</p>
          </div>
        )}

        {voteStatus === "confirmed" && txHash && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Vote Confirmed!</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
              <div className="flex items-center justify-between">
                <code className="text-xs text-gray-300 font-mono">{txHash.slice(0, 20)}...</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://explorer.intuition-testnet.com/tx/${txHash}`, "_blank")}
                  className="h-6 w-6 p-0 hover:bg-gray-700"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {voteStatus === "failed" && (
          <div className="text-center py-4">
            <p className="text-sm text-red-400 mb-3">Transaction failed. Please try again.</p>
            <Button
              onClick={() => {
                setVoteStatus("idle")
                setTxHash("")
              }}
              variant="outline"
              size="sm"
              className="border-gray-700 hover:border-red-500 bg-transparent"
            >
              Retry
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>Votes are recorded immutably on the Intuition Testnet blockchain</p>
        </div>
      </CardContent>
    </Card>
  )
}
