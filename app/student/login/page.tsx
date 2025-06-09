"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "../authctx"
import { USE_MOCK_API } from "@/lib/mock/config"

export default function LoginPage() {
  const { email_status: emailStatus, login } = useAuthContext();
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user just registered
  useEffect(() => {
    const verified = searchParams.get('verified')
    if (verified === 'pending') {
      setShowVerificationMessage(true)
    }
  }, [searchParams])

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
      
      if (USE_MOCK_API) {
        // Simplified mock flow - direct login
        const status = await emailStatus(email);
        
        if (status.existing_user) {
          // User exists, log them in directly
          await login({ email });
          router.push('/');
        } else {
          // User doesn't exist, go to registration
          router.push(`/register?email=${encodeURIComponent(email)}`);
        }
      } else {
        // Production flow with OTP
        await emailStatus(email).then(response => {
          if (!response?.existing_user || !response?.verified_user) {
            router.push(`/register?email=${encodeURIComponent(email)}`)
          } else {
            router.push(`/login/otp?email=${encodeURIComponent(email)}`) 
          }
        });
      }
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || "An error occurred. Please try again.")
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
        <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          </div>

          {/* Verification Message - Only show if coming from registration */}
          {showVerificationMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 text-center font-medium">
                📧 Please check your Inbox for a Verification Email!
              </p>
              {!USE_MOCK_API && (
                <p className="text-xs text-blue-600 text-center mt-1">
                  Once verified, you can log in using your email below.
                </p>
              )}
            </div>
          )}

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

          {/* Mock System Instructions */}
          {showVerificationMessage && USE_MOCK_API && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Mock System Instructions:</h4>
              <ol className="text-xs text-gray-600 space-y-1">
                <li>1. In mock mode, registered emails are automatically logged in</li>
                <li>2. Simply enter your email above and click "Continue"</li>
                <li>3. If registered: Direct login to dashboard</li>
                <li>4. If not registered: Redirected to create profile</li>
              </ol>
            </div>
          )}

          {/* Debug Section for Development */}
          {USE_MOCK_API && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-xs font-semibold text-yellow-700 mb-2">🔧 Debug Info:</h4>
              <button 
                onClick={() => {
                  const emails = JSON.parse(localStorage.getItem('mockRegisteredEmails') || '[]');
                  console.log('Registered emails:', emails);
                  alert(`Found ${emails.length} registered emails: ${emails.join(', ')}`);
                }}
                className="text-xs bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded text-yellow-800"
              >
                Show Registered Emails
              </button>
              <button 
                onClick={() => {
                  if (confirm('Clear all registered emails? This will remove all test accounts.')) {
                    localStorage.removeItem('mockRegisteredEmails');
                    alert('Mock data cleared!');
                  }
                }}
                className="ml-2 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-red-800"
              >
                Clear Mock Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
