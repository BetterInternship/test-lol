"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  FileEdit
} from "lucide-react"
import Link from "next/link"

export default function FormsAutomation() {
  const router = useRouter()

  const handleTemplateDownload = (templateName: string) => {
    // Create a link element and trigger download
    const link = document.createElement('a')
    link.href = '/Company_Information_Project_Details_Form.pdf'
    link.download = 'Company_Information_Project_Details_Form.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const dlsuForms = [
    {
      name: "Company Project Details template",
      tags: ["CCS", "Pre-hire"]
    },
    {
      name: "Student Agreement Template",
      tags: ["CCS", "Pre-hire"]
    },
    {
      name: "External Relations Template",
      tags: ["CCS", "Pre-hire"]
    },
    {
      name: "Training plan for Students",
      tags: ["CCS", "Pre-hire"]
    },
    {
      name: "Student Evaluation template",
      tags: ["CCS", "Post-hire"]
    },
    {
      name: "Initial and Final review template",
      tags: ["CCS", "Post-hire"]
    },
    {
      name: "CCS Template 1",
      tags: ["CCS", "Progress"]
    }
  ]

  const ateneoForms = [
    {
      name: "Ateneo Template 1",
      tags: ["CCS", "Pre-hire"]
    }
  ]

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
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
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium cursor-default">
              <FileEdit className="h-5 w-5" />
              Forms Automation
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">School Forms Automation</h1>
          <div className="flex items-center gap-3">
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
                <Link href="/add-users">
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
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-12 justify-center">
              {/* Left Section - School Forms */}
              <div className="flex-1 max-w-2xl">
                {/* DLSU School Forms */}
                <div className="mb-8" data-tour="school-forms">
                  <h2 className="text-lg font-semibold text-blue-500 mb-4">DLSU School Forms</h2>
                  <div className="space-y-3" data-tour="form-categories">
                    {dlsuForms.map((form, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleTemplateDownload(form.name)}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-800 font-medium">{form.name}</span>
                        <div className="flex gap-2">
                          {form.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                tag === 'CCS' ? 'bg-blue-100 text-blue-700' :
                                tag === 'Pre-hire' ? 'bg-green-100 text-green-700' :
                                tag === 'Progress' ? 'bg-yellow-100 text-yellow-700' :
                                tag === 'Post-hire' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ateneo School Forms */}
                <div className="mb-8" data-tour="compliance-tracking">
                  <h2 className="text-lg font-semibold text-blue-500 mb-4">Ateneo School Forms</h2>
                  <div className="space-y-3">
                    {ateneoForms.map((form, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleTemplateDownload(form.name)}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-800 font-medium">{form.name}</span>
                        <div className="flex gap-2">
                          {form.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                tag === 'CCS' ? 'bg-blue-100 text-blue-700' :
                                tag === 'Pre-hire' ? 'bg-green-100 text-green-700' :
                                tag === 'Progress' ? 'bg-yellow-100 text-yellow-700' :
                                tag === 'Post-hire' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section - Edit Default Form Data Values and Generate Pre-filled Forms */}
              <div className="w-80">
                {/* Edit Default Form Data Values Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Default Form Data Values</h2>
                  
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-left justify-start border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      asChild
                    >
                      <Link href="/form-data-editor?section=contact">
                        Contact Details
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-left justify-start border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      asChild
                    >
                      <Link href="/form-data-editor?section=requirements">
                        Standard Requirements
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Generate Pre-filled Forms Section */}
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Generate Pre-filled Forms</h2>
                
                <div className="space-y-4" data-tour="form-generator">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-left justify-start border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    asChild
                  >
                    <Link href="/form-generator?form=Pre-Hire Forms">
                      Pre-Hire Forms
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-left justify-start border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    asChild
                  >
                    <Link href="/form-generator?form=Progress Forms">
                      Progress Forms
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-left justify-start border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    asChild
                  >
                    <Link href="/form-generator?form=Post-Hire Evaluation">
                      Post-Hire Evaluation
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
