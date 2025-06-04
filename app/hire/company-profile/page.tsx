"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  MapPin,
  Mail,
  Phone,
  Plus,
  X,
  UserPlus,
  LogOut,
  FileEdit,
  Upload
} from "lucide-react"
import Link from "next/link"

interface SignatoryData {
  signatoryName: string
  position: string
  governmentId: string
  eSignature: File | null
}

export default function CompanyProfile() {
  const router = useRouter()
  const [companyData, setCompanyData] = useState({
    name: "Google",
    description: "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.",
    locations: ["Legazpi Village, Makati", "BGC, Taguig", "Ortigas, Pasig"],
    hrEmail: "hr@google.com",
    phone: "+63 2 8888 9999"
  })

  // Signatory Information
  const [signatoryData, setSignatoryData] = useState({
    signatoryName: '',
    position: '',
    governmentId: '',
    eSignature: null
  })

  // Project Information
  const [projectData, setProjectData] = useState({
    projectTitle: '',
    projectDescription: '',
    numberOfStudents: '',
    projectDuration: '',
    projectActivities: '',
    expectedOutputs: '',
    mainTasks: '',
    learningObjectives: '',
    trainingSchedule: ''
  })

  const [newLocation, setNewLocation] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSignatoryChange = (field: string, value: string) => {
    setSignatoryData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProjectChange = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSignatoryData(prev => ({
        ...prev,
        eSignature: file
      }))
    }
  }

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setCompanyData(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()]
      }))
      setNewLocation("")
    }
  }

  const handleRemoveLocation = (index: number) => {
    setCompanyData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    // Here you would typically save all data to a backend
    console.log("Saving company data:", companyData)
    console.log("Saving signatory data:", signatoryData)
    console.log("Saving project data:", projectData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data or fetch from backend
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Clear any stored authentication data (if you add localStorage/sessionStorage later)
    // localStorage.removeItem('authToken') // Future implementation
    
    // Redirect to login page
    router.push('/login')
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
            <Link href="/forms-automation" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
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
          <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Edit Company Profile</span>
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

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Company Profile Section */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Company Information</h2>
              
              {/* Company Name */}
              <div className="mb-6">
                <Label htmlFor="company-name" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Name
                </Label>
                {isEditing ? (
                  <Input
                    id="company-name"
                    value={companyData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-2"
                    placeholder="Enter company name"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium mt-2">{companyData.name}</p>
                )}
              </div>

              {/* Company Description */}
              <div className="mb-6">
                <Label htmlFor="company-description" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Company Description
                </Label>
                {isEditing ? (
                  <Textarea
                    id="company-description"
                    value={companyData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-2 min-h-[120px]"
                    placeholder="Enter company description"
                  />
                ) : (
                  <p className="text-gray-700 mt-2 leading-relaxed">{companyData.description}</p>
                )}
              </div>

              {/* Company Locations */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Company Location(s)
                </Label>
                <div className="mt-2 space-y-2">
                  {companyData.locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={location}
                            onChange={(e) => {
                              const newLocations = [...companyData.locations]
                              newLocations[index] = e.target.value
                              setCompanyData(prev => ({ ...prev, locations: newLocations }))
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveLocation(index)}
                            className="h-9 w-9"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <p className="text-gray-700">{location}</p>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Add new location"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleAddLocation}
                        className="h-9 w-9"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* HR Email */}
              <div className="mb-6">
                <Label htmlFor="hr-email" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  HR Email
                </Label>
                {isEditing ? (
                  <Input
                    id="hr-email"
                    type="email"
                    value={companyData.hrEmail}
                    onChange={(e) => handleInputChange("hrEmail", e.target.value)}
                    className="mt-2"
                    placeholder="hr@company.com"
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{companyData.hrEmail}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-8">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-2"
                    placeholder="+63 2 1234 5678"
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{companyData.phone}</p>
                )}
              </div>
            </div>

            {/* Signatory Information Section */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Signatory Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="signatory-name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Name of Signatory
                  </Label>
                  <Input
                    id="signatory-name"
                    value={signatoryData.signatoryName}
                    onChange={(e) => handleSignatoryChange('signatoryName', e.target.value)}
                    placeholder="Enter Signatory Name"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700 mb-2 block">
                    Designation/Position
                  </Label>
                  <Input
                    id="position"
                    value={signatoryData.position}
                    onChange={(e) => handleSignatoryChange('position', e.target.value)}
                    placeholder="Enter Position of Signatory"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="government-id" className="text-sm font-medium text-gray-700 mb-2 block">
                    Government ID Number
                  </Label>
                  <Input
                    id="government-id"
                    value={signatoryData.governmentId}
                    onChange={(e) => handleSignatoryChange('governmentId', e.target.value)}
                    placeholder="Enter ID Number"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="e-signature" className="text-sm font-medium text-gray-700 mb-2 block">
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
                      className="w-full h-10 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {signatoryData.eSignature ? signatoryData.eSignature.name : 'Upload File'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Information Section */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Project Information</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="project-title" className="text-sm font-medium text-gray-700 mb-2 block">
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    value={projectData.projectTitle}
                    onChange={(e) => handleProjectChange('projectTitle', e.target.value)}
                    placeholder="e.g., Mobile App Development, Data Analysis Project"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="number-students" className="text-sm font-medium text-gray-700 mb-2 block">
                    Number of Students Needed
                  </Label>
                  <Input
                    id="number-students"
                    type="number"
                    value={projectData.numberOfStudents}
                    onChange={(e) => handleProjectChange('numberOfStudents', e.target.value)}
                    placeholder="e.g., 2"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="project-duration" className="text-sm font-medium text-gray-700 mb-2 block">
                    Project Duration
                  </Label>
                  <Input
                    id="project-duration"
                    value={projectData.projectDuration}
                    onChange={(e) => handleProjectChange('projectDuration', e.target.value)}
                    placeholder="e.g., 8 weeks, 3 months"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="expected-outputs" className="text-sm font-medium text-gray-700 mb-2 block">
                    Expected Results
                  </Label>
                  <Input
                    id="expected-outputs"
                    value={projectData.expectedOutputs}
                    onChange={(e) => handleProjectChange('expectedOutputs', e.target.value)}
                    placeholder="e.g., Working prototype, Research report"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <Label htmlFor="project-description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Project Description
                  </Label>
                  <Textarea
                    id="project-description"
                    value={projectData.projectDescription}
                    onChange={(e) => handleProjectChange('projectDescription', e.target.value)}
                    placeholder="Describe what the project involves and what students will be working on"
                    className="w-full h-24 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="project-activities" className="text-sm font-medium text-gray-700 mb-2 block">
                    Main Activities
                  </Label>
                  <Textarea
                    id="project-activities"
                    value={projectData.projectActivities}
                    onChange={(e) => handleProjectChange('projectActivities', e.target.value)}
                    placeholder="List the key tasks students will be doing (e.g., research, coding, testing)"
                    className="w-full h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Training & Learning Plan Section */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Training & Learning Plan</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="main-tasks" className="text-sm font-medium text-gray-700 mb-2 block">
                    Daily/Weekly Tasks
                  </Label>
                  <Textarea
                    id="main-tasks"
                    value={projectData.mainTasks}
                    onChange={(e) => handleProjectChange('mainTasks', e.target.value)}
                    placeholder="What will students be doing on a typical day or week?"
                    className="w-full h-24 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="training-schedule" className="text-sm font-medium text-gray-700 mb-2 block">
                    Training Schedule
                  </Label>
                  <Textarea
                    id="training-schedule"
                    value={projectData.trainingSchedule}
                    onChange={(e) => handleProjectChange('trainingSchedule', e.target.value)}
                    placeholder="How will you onboard and train students? (e.g., first week orientation)"
                    className="w-full h-24 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="learning-objectives" className="text-sm font-medium text-gray-700 mb-2 block">
                    Learning Goals
                  </Label>
                  <Textarea
                    id="learning-objectives"
                    value={projectData.learningObjectives}
                    onChange={(e) => handleProjectChange('learningObjectives', e.target.value)}
                    placeholder="What skills or knowledge should students gain from this experience?"
                    className="w-full h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save All Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}