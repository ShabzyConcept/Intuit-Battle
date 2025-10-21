"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              This app uses wallet authentication. Redirecting to connect your wallet...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
