import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Thank you for signing up!</CardTitle>
              <CardDescription className="text-gray-400">Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">
                You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
