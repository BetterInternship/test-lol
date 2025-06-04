"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "../authctx"

export default function LoginPage() {
  const { email_status: emailStatus } = useAuthContext();
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validateDLSUEmail = (email: string): boolean => {
    const dlsuDomains = [
      '@dlsu.edu.ph',
      '@students.dlsu.edu.ph',
      '@staff.dlsu.edu.ph',
      '@faculty.dlsu.edu.ph'
    ]
    return dlsuDomains.some(domain => email.toLowerCase().endsWith(domain))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateDLSUEmail(email)) {
      setError("Please use your DLSU email address (@dlsu.edu.ph, @students.dlsu.edu.ph, etc.)")
      return
    }

    try {
      setLoading(true)
      setError("")
      

      emailStatus(email).then(response => {

        if (!response?.existing_user || !response?.verified_user) {
          router.push(`/register?email=${encodeURIComponent(email)}`)
        } else {
          router.push(`/login/otp?email=${encodeURIComponent(email)}`) 
        }
      });
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Better Internship</h1>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="School Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  // Clear any existing errors when user types
                  if (error) setError("")
                }}
                onKeyPress={handleKeyPress}
                required
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {loading ? "Checking..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
