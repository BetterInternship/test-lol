"use client"

import { useState, useEffect, Suspense } from "react"
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
  Check,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (<Suspense>
    <FormGenerator></FormGenerator>
  </Suspense>)
}

function FormGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formType = searchParams.get('form')
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState({
    "All Students": false,
    "Bowei Gai": true,
    "Sherwin Yaun": false,
    "Andrew Pagulayan": false,
    "Malks david": false,
    "Sarah Johnson": false,
    "Michael Chen": false,
    "Emily Davis": false,
    "John Smith": false,
    "Lisa Martinez": false,
    "Tom Anderson": false,
    "Maria Rodriguez": false,
    "Kevin Lee": false,
    "Anna Taylor": false,
    "Chris Brown": false
  })

  const handleLogout = () => {
    router.push('/hire/login')
  }

  const handleStudentToggle = (student: string) => {
    if (student === "All Students") {
      const newValue = !selectedStudents["All Students"]
      const newSelected = Object.keys(selectedStudents).reduce((acc, key) => {
        acc[key] = newValue
        return acc
      }, {} as typeof selectedStudents)
      setSelectedStudents(newSelected)
    } else {
      const newSelected = {
        ...selectedStudents,
        [student]: !selectedStudents[student]
      }
      const individualStudents = Object.keys(newSelected).filter(key => key !== "All Students")
      const allIndividualSelected = individualStudents.every(key => newSelected[key])
      newSelected["All Students"] = allIndividualSelected
      setSelectedStudents(newSelected)
    }
  }

  const handleGenerate = () => {
    console.log('Generate button clicked!')
    
    const selectedStudentsList = Object.entries(selectedStudents)
      .filter(([student, isSelected]) => isSelected && student !== "All Students")
      .map(([student]) => student)
    
    console.log('Selected students:', selectedStudentsList)
    
    // Check if any students are selected
    if (selectedStudentsList.length === 0) {
      alert("Please select at least one student before generating.")
      return
    }

    console.log('Starting generation process...')
    // Start generating process
    setIsGenerating(true)
    
    // Wait 2 seconds then navigate to download page
    setTimeout(() => {
      console.log('Navigating to download page...')
      window.location.href = '/download'
    }, 2000)
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
            <Link href="/hire/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/hire/listings" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
              <FileText className="h-5 w-5" />
              My Listings
            </Link>
            <Link href="/hire/forms-automation" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
              <FileEdit className="h-5 w-5" />
              Forms Automation
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Generate {formType || 'Form'}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/hire/company-profile">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Edit Company Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/hire/add-users">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add Users</span>
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
          <div className="max-w-3xl mx-auto">
            {/* Form Name Section */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="h-10 w-10 p-0 border-2 border-gray-300 hover:border-gray-400 bg-white mr-8"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="text-xl text-gray-900 font-medium">{formType || 'Form'}</span>
                <span className="text-base text-gray-600 ml-6">Select a student</span>
              </div>
            </div>
              
            {/* Student Selection Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-10 mb-12 shadow-sm max-w-2xl mx-auto">
              {/* All Students (fixed at top, not scrollable) */}
              <div 
                className="flex items-center gap-6 cursor-pointer mb-8 pb-6 border-b border-gray-200"
                onClick={() => handleStudentToggle("All Students")}
              >
                <div className={`w-6 h-6 border-2 rounded ${selectedStudents["All Students"] ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-400'} flex items-center justify-center transition-colors`}>
                  {selectedStudents["All Students"] && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className="text-base text-gray-900 font-medium">All Students</span>
              </div>
              
              {/* Individual Students (scrollable area) */}
              <div className="max-h-72 overflow-y-auto pr-2">
                <div className="space-y-6">
                  {Object.entries(selectedStudents)
                    .filter(([student]) => student !== "All Students")
                    .map(([student, isSelected]) => (
                    <div 
                      key={student}
                      className="flex items-center gap-6 cursor-pointer ml-10 hover:bg-gray-50 rounded-lg p-3 -ml-8 pl-10 transition-colors"
                      onClick={() => handleStudentToggle(student)}
                    >
                      <div className={`w-6 h-6 border-2 rounded ${isSelected ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-400'} flex items-center justify-center transition-colors`}>
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <span className="text-base text-gray-900">{student}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Generate Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`px-24 py-4 text-xl rounded-xl font-medium shadow-sm transition-all duration-300 ${
                  isGenerating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
