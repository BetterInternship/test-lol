"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [hasRead, setHasRead] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (!emailParam) {
      router.push('/login')
      return
    }
    setEmail(emailParam)
  }, [searchParams, router])

  const handleContinue = () => {
    if (!hasRead) return
    setLoading(true)
    
    // Store that user has accepted terms in sessionStorage
    sessionStorage.setItem('termsAccepted', 'true')
    
    // Navigate to privacy policy page
    router.push(`/register/privacy?email=${encodeURIComponent(email)}`)
  }

  const handleBack = () => {
    router.push('/login')
  }

  if (!email) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-blue-600">Terms & Conditions</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm text-gray-500">Privacy Policy</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-gray-500">Registration</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
          <p className="text-gray-600">Please read and accept our terms before continuing</p>
        </div>

        {/* PDF Viewer Section */}
        <div className="flex-1 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Terms and Conditions Document</h3>
              <a 
                href="/TermsConditions.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </div>
            
            {/* Clean PDF Embed */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <object
                data="/TermsConditions.pdf#toolbar=0&navpanes=0&scrollbar=1"
                type="application/pdf"
                className="w-full h-[600px]"
                aria-label="Terms and Conditions PDF"
              >
                <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 border-2 border-dashed border-gray-300">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center mb-4">
                    Unable to display PDF in browser.
                  </p>
                  <a 
                    href="/TermsConditions.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms-acceptance"
              checked={hasRead}
              onCheckedChange={(checked) => setHasRead(checked as boolean)}
              className="mt-1"
            />
            <label 
              htmlFor="terms-acceptance" 
              className="text-sm text-gray-700 leading-relaxed cursor-pointer"
            >
              I have read and understand the Terms & Conditions, and I agree to be bound by them. 
              I acknowledge that by using BetterInternship, I am accepting these terms and conditions.
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={loading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!hasRead || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {loading ? "Loading..." : "Continue to Privacy Policy"}
          </Button>
        </div>
      </div>
    </div>
  )
}
