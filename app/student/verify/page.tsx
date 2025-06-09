"use client"

import { useState, useEffect, } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthContext } from "../authctx";
import { USE_MOCK_API } from "@/lib/mock/config"

export default function VerifyPage() {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verify } = useAuthContext()

  useEffect(() => {
    const user = searchParams.get('user_id')
    const key = searchParams.get('key')

    if (USE_MOCK_API) {
      // In mock mode, auto-verify quickly
      setTimeout(() => {
        setVerified(true)
        setTimeout(() => router.push('/'), 1500)
      }, 1000)
      setLoading(false)
    } else if (user && key) {
      // Production mode with real verification
      verify(user, key)
        .then(() => {
          setVerified(true)
          setTimeout(() => router.push('/'), 2000)
        })
        .catch((error) => {
          alert('Verification failed: ' + error.message)
          router.push('/login')
        })
        .finally(() => setLoading(false))
    } else {
      // Production mode without parameters - wait for email verification
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 5000) // Redirect after 5 seconds
    }
  }, [searchParams, router, verify])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {loading ? 'Verifying your account...' : 
             verified ? 'Your account has been verified!' : 
             'Check Your Email'}
          </h2>
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!loading && !verified && !USE_MOCK_API && (
            <p className="text-gray-600 text-xl">Please check your inbox for a verification email and click the link to verify your account.</p>
          )}
          {!loading && !verified && USE_MOCK_API && (
            <p className="text-red-600 text-xl">Verification failed. Please try again.</p>
          )}
          {!loading && verified && (
            <p className="text-green-600 text-xl">Redirecting you to the dashboard...</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:hello@betterinternship.com" className="text-blue-600 hover:underline">
              hello@betterinternship.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
