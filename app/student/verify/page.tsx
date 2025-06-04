"use client"

import { useState, useEffect, } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthContext } from "../authctx";

export default function RegisterPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verify } = useAuthContext()

  useEffect(() => {
    const user = searchParams.get('user_id')
    const key = searchParams.get('key')

    if (user && key) 
      verify(user, key).then(() => (alert('You are now verified!'), router.push('/')))
    else router.push('/')
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verifying your account...</h2>
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
