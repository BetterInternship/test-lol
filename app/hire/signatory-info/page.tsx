"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  User, 
  BarChart3, 
  FileText,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Settings,
  ArrowLeft,
  Upload
} from "lucide-react"
import Link from "next/link"

export default function SignatoryInfo() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    signatoryName: '',
    position: '',
    governmentId: '',
    eSignature: null
  })

  const handleLogout = () => {
    router.push('/login')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        eSignature: file
      }))
    }
  }

  const handleContinue = () => {
    // Validate required fields
    if (!formData.signatoryName || !formData.position || !formData.governmentId) {
      alert("Please fill in all required fields.")
      return
    }

    // For now, just navigate back to template info page
    alert("Signatory information saved successfully!")
    router.back()
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Intern&apos;s Launchpad</h1>
        </div>
        
        <div className="px-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Pages</h2>
          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/listings" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
              <FileText className="h-5 w-5" />
              My Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Signatory Information
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/company-profile">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Edit Company Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/forms-automation">
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>Forms automation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/add-users">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add Users</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-10 w-10 p-0 border-2 border-gray-300 hover:border-gray-400 bg-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* Main Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Key Signatory Information
              </h2>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-10 shadow-sm max-w-3xl mx-auto">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name of Signatory */}
                  <div>
                    <Label htmlFor="signatory-name" className="text-sm font-medium text-gray-900 mb-2 block">
                      Name of Signatory
                    </Label>
                    <Input
                      id="signatory-name"
                      value={formData.signatoryName}
                      onChange={(e) => handleInputChange('signatoryName', e.target.value)}
                      placeholder="Enter Signatory Name"
                      className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  {/* Government ID Number */}
                  <div>
                    <Label htmlFor="government-id" className="text-sm font-medium text-gray-900 mb-2 block">
                      Government ID Number
                    </Label>
                    <Input
                      id="government-id"
                      value={formData.governmentId}
                      onChange={(e) => handleInputChange('governmentId', e.target.value)}
                      placeholder="Enter ID Number"
                      className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Designation/Position */}
                  <div>
                    <Label htmlFor="position" className="text-sm font-medium text-gray-900 mb-2 block">
                      Designation/Position
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Enter Position of Signatory"
                      className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  {/* E-Signature Upload */}
                  <div>
                    <Label htmlFor="e-signature" className="text-sm font-medium text-gray-900 mb-2 block">
                      E-Signature (Optional)
                    </Label>
                    <div className="relative">
                      <input
                        id="e-signature"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('e-signature')?.click()}
                        className="w-full h-12 border-2 border-gray-300 rounded-xl hover:border-gray-400 bg-white text-gray-700 flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {formData.eSignature ? formData.eSignature.name : 'Upload File >'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center mt-12">
              <Button 
                onClick={handleContinue}
                className="px-24 py-4 text-xl bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium shadow-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
