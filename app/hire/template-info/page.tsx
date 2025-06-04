"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  Check,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (<Suspense>
    <TemplateInfo></TemplateInfo>
  </Suspense>)
}

function TemplateInfo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formType = searchParams.get('form')

  const handleLogout = () => {
    router.push('/login')
  }

  const [templateData] = useState({
    "Company Info": true,
    "Job Info": true,
    "Signatory Info": false,
    "Random Info": false
  })

  const handleReadyToGenerate = () => {
    // Check if all required template data is complete
    const allComplete = Object.values(templateData).every(status => status)
    
    if (!allComplete) {
      alert("Please complete all template information before generating.")
      return
    }
    
    // For now, just alert - in real implementation, this would proceed to generation
    alert("Proceeding to generate forms...")
    // Could navigate to actual form generation or download page
  }

  // Check if all template data is complete
  const allTemplateDataComplete = Object.values(templateData).every(status => status)

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
            Template Information
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

            {/* Main Message */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                In order to do generate, we need to
              </h2>
              <h2 className="text-3xl font-bold text-gray-900">
                gather some templated info:
              </h2>
            </div>

            {/* Template Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-16">
              {/* Row 1 */}
              <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-900 text-center">Company Info</h3>
                {templateData["Company Info"] && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-900 text-center">Job Info</h3>
                {templateData["Job Info"] && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2 */}
              <div 
                className="bg-white border-2 border-gray-300 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push('/signatory-info')}
              >
                <h3 className="text-lg font-medium text-gray-900 text-center">Signatory Info</h3>
                {templateData["Signatory Info"] && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="bg-white border-2 border-gray-300 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push('/random-info')}
              >
                <h3 className="text-lg font-medium text-gray-900 text-center">Random Info</h3>
                {templateData["Random Info"] && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleReadyToGenerate}
                disabled={!allTemplateDataComplete}
                className={`px-24 py-4 text-xl rounded-xl font-medium transition-all ${
                  allTemplateDataComplete 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
