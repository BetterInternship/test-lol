"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [step, setStep] = useState<"email" | "otp">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Demo authentication - only allow hr@google.com
    if (email.toLowerCase() !== "hr@google.com") {
      setTimeout(() => {
        setIsLoading(false)
        setError("You are not in our company database, please contact sherwin_yaun@dlsu.edu.ph")
      }, 1000)
      return
    }

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }, 1000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
    
    const newOtp = [...otp]
    newOtp[index] = value.replace(/\D/g, '') // Only numbers
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 4) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const otpString = otp.join("")
    
    // Demo OTP verification - only allow 12345
    if (otpString !== "12345") {
      setTimeout(() => {
        setIsLoading(false)
        setError("Incorrect OTP. Please try again.")
        // Clear the OTP inputs so user can try again
        setOtp(["", "", "", "", ""])
        // Focus back to first input
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      }, 1000)
      return
    }

    // Simulate successful login
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOtp(["", "", "", "", ""])
    setError("")
  }

  // Auto-submit when all 5 digits are entered
  useEffect(() => {
    const otpString = otp.join("")
    if (otpString.length === 5 && !isLoading && !error) {
      handleOtpSubmit({ preventDefault: () => {} } as React.FormEvent)
    }
  }, [otp, isLoading, error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Intern's Launchpad</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Arrow for OTP step */}
          {step === "otp" && (
            <div className="mb-6">
              <button
                onClick={handleBackToEmail}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Welcome Message */}
          <div className="text-center mb-8">
            {step === "email" ? (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600">We've sent a verification code to {email}</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.join("").length !== 5}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            {step === "email" ? (
              <p className="text-sm text-gray-500 leading-relaxed">
                <span className="font-medium">Disclaimer:</span> Enter your company email, we should be sending you an OTP to verify it's really you.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 leading-relaxed">
                  <span className="font-medium">Demo:</span> Use OTP <span className="font-mono font-bold">12345</span> to continue
                </p>
                <p className="text-xs text-gray-400">
                  Didn't receive the code? Check your email or try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-6 py-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Encountering Problems? Email us at{" "}
            <a href="mailto:hello@betterinternship.com" className="text-blue-600 hover:underline">
              hello@betterinternship.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
