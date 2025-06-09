"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { file_service } from "@/lib/api"
import { useAuthContext } from "../authctx"
import { PublicUser } from "@/lib/db/db.types"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    portfolioLink: "",
    githubLink: "",
    phoneNumber: "",
    linkedinProfile: "",
  })
  const [email, setEmail] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuthContext()
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Pre-fill email if coming from login redirect
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // If no email, redirect to login
      router.push('/login')
    }
  }, [searchParams, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setResumeFile(file)
  }

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
    
    if (!formData.fullName || !formData.idNumber || !formData.currentProgram || !formData.phoneNumber) {
      setError("Please fill in all required fields")
      return
    }

    if (!validateDLSUEmail(email)) {
      setError("Please use your DLSU email address (@dlsu.edu.ph)")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      // Create user profile
      const newUser: Partial<PublicUser> = {
        email,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        year_level: formData.schoolYear,
        current_program: formData.currentProgram,
        portfolio_link: formData.portfolioLink || '',
        github_link: formData.githubLink || '',
        linkedin_link: formData.linkedinProfile || '',
        resume: resumeFile ? resumeFile.name : null,
      }

      // @ts-ignore
      await register(newUser)
        .then(() => { 
          router.push('/verify')
        })
        .catch((e) => { 
          setError(e.message || "Registration failed. Please try again.")
        })
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Create your Profile</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter Full Name"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
                required
              />
            </div>

            {/* Current Program */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Program
              </label>
              <Input
                type="text"
                value={formData.currentProgram}
                onChange={(e) => handleInputChange('currentProgram', e.target.value)}
                placeholder="Enter Current Program"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
                required
              />
            </div>

            {/* School Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Level
              </label>
              <Input
                type="text"
                value={formData.yearLevel}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                placeholder="Enter Year Level"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter Phone Number"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
                required
              />
            </div>

            {/* Portfolio Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Link <span className="text-gray-500">(Optional)</span>
              </label>
              <Input
                type="url"
                value={formData.portfolioLink}
                onChange={(e) => handleInputChange('portfolioLink', e.target.value)}
                placeholder="Enter Portfolio Link"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile <span className="text-gray-500">(Optional)</span>
              </label>
              <Input
                type="url"
                value={formData.linkedinProfile}
                onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                placeholder="Enter LinkedIn Profile Link"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
              />
            </div>

            {/* Github Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Github Link <span className="text-gray-500">(Optional)</span>
              </label>
              <Input
                type="url"
                value={formData.githubLink}
                onChange={(e) => handleInputChange('githubLink', e.target.value)}
                placeholder="Enter Github Link"
                className="w-full h-12 px-4 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0"
                disabled={loading}
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <input
                type="file"
                ref={resumeInputRef}
                onChange={handleResumeUpload}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              <div
                onClick={() => resumeInputRef.current?.click()}
                className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between"
              >
                <span className={resumeFile ? "text-gray-900" : "text-gray-500"}>
                  {resumeFile ? resumeFile.name : "Upload File Here"}
                </span>
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-80 h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile..." : "Continue"}
            </Button>
          </div>
        </form>

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
