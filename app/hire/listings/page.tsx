"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  User, 
  BarChart3, 
  Search,
  FileText,
  MapPin,
  Clock,
  PhilippinePeso,
  Monitor,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Plus,
  X
} from "lucide-react"
import Link from "next/link"
import ProductTour from "@/components/ProductTour"
import TourButton from "@/components/TourButton"
import { useTourIntegration } from "@/components/useTourIntegration"
import { useOwnedJobs } from "@/hooks/use-employer-api"
import { Job } from "@/lib/db/db.types"
import ProfileButton from "@/components/hire/profile-button"
import { useRefs } from "@/hooks/use-refs"

export default function MyListings() {
  const { ownedJobs } = useOwnedJobs();
  const { ref_loading, get_job_mode, get_job_type, job_types, job_modes } = useRefs();
  const [selectedJob, setSelectedJob] = useState<Job>({} as Job)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()

  // Tour integration
  const { showTour, startTour, closeTour } = useTourIntegration('listings')
  const [editFormData, setEditFormData] = useState({
    title: "",
    location: "",
    salaryAmount: "",
    salaryPeriod: "",
    mode: "",
    projectType: "",
    description: "",
    requirements: [""],
    requireGithub: false,
    requirePortfolio: false
  })
  const [addFormData, setAddFormData] = useState({
    title: "",
    location: "",
    allowanceAmount: "",
    allowancePeriod: "",
    mode: "",
    projectType: "",
    description: "",
    responsibilities: "",
    requirements: [""],
    requireGithub: false,
    requirePortfolio: false
  })

  const handleLogout = () => {
    // Clear any stored authentication data (if you add localStorage/sessionStorage later)
    // localStorage.removeItem('authToken') // Future implementation
    
    // Redirect to login page
    router.push('/login')
  }

  const handleEditJob = (job_id: string) => {
    // Find the job and populate form data
    const job =  true//jobListings.find(j => j.id === jobId)
    if (job) {
      // // Parse salary to extract amount and period
      // const salaryMatch = job.salary?.match(/(\d+)\/(\w+)/) || []
      // const amount = salaryMatch[1] || ""
      // const period = salaryMatch[2] === "Day" ? "day" : salaryMatch[2] === "Hour" ? "hour" : salaryMatch[2] === "Month" ? "month" : ""
      
      // setEditFormData({
      //   title: job.title,
      //   location: job.location,
      //   salaryAmount: amount,
      //   salaryPeriod: period,
      //   mode: job.mode,
      //   projectType: job.projectType,
      //   description: job.description,
      //   requirements: job.requirements,
      //   requireGithub: false, // Default to false since not in current data
      //   requirePortfolio: false // Default to false since not in current data
      // })
      setIsEditModalOpen(true)
    }
  }

  const handleAddJob = () => {
    // Reset form data and open modal
    setAddFormData({
      title: "",
      location: "",
      allowanceAmount: "",
      allowancePeriod: "",
      mode: "",
      projectType: "",
      description: "",
      responsibilities: "",
      requirements: [""],
      requireGithub: false,
      requirePortfolio: false
    })
    setIsAddModalOpen(true)
  }

  const handleSaveEdit = () => {
    // Here you would typically save to database
    console.log('Saving job edit:', editFormData)
    setIsEditModalOpen(false)
    // You could update the jobListings array here or refetch from API
  }

  const handleSaveAdd = () => {
    // Here you would typically save to database
    console.log('Adding new job:', addFormData)
    setIsAddModalOpen(false)
    // You could add to the jobListings array here or refetch from API
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...editFormData.requirements]
    newRequirements[index] = value
    setEditFormData(prev => ({ ...prev, requirements: newRequirements }))
  }

  const handleAddRequirementChange = (index: number, value: string) => {
    const newRequirements = [...addFormData.requirements]
    newRequirements[index] = value
    setAddFormData(prev => ({ ...prev, requirements: newRequirements }))
  }

  const addRequirement = () => {
    setEditFormData(prev => ({ 
      ...prev, 
      requirements: [...prev.requirements, ""] 
    }))
  }

  const addRequirementToAdd = () => {
    setAddFormData(prev => ({ 
      ...prev, 
      requirements: [...prev.requirements, ""] 
    }))
  }

  const removeRequirement = (index: number) => {
    if (editFormData.requirements.length > 1) {
      const newRequirements = editFormData.requirements.filter((_, i) => i !== index)
      setEditFormData(prev => ({ ...prev, requirements: newRequirements }))
    }
  }

  const removeAddRequirement = (index: number) => {
    if (addFormData.requirements.length > 1) {
      const newRequirements = addFormData.requirements.filter((_, i) => i !== index)
      setAddFormData(prev => ({ ...prev, requirements: newRequirements }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium">
              <FileText className="h-5 w-5" />
              My Listings
            </div>
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
          <h1 className="text-2xl font-bold text-gray-800">Your Listings</h1>
          <div className="flex items-center gap-3">
            <TourButton
              onClick={startTour}
              pageName="listings"
            />
            <ProfileButton></ProfileButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Left Panel - Job List */}
          <div className="w-96 flex flex-col h-full">
            {/* Search Bar and Add Button - Fixed */}
            <div className="flex gap-3 mb-4 flex-shrink-0" data-tour="job-filters">
              <div className="relative flex-1 w-5/6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search listings..."
                  className="pl-10"
                />
              </div>
              <Button 
                className="w-1/6 flex-shrink-0"
                onClick={handleAddJob}
                size="icon"
                data-tour="add-job-btn"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Job Cards - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0 scrollbar-custom" data-tour="job-cards">
              {ownedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedJob.id === job.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  <p className="text-sm text-gray-500 mb-3">Listed on {formatDate(job.created_at ?? "")}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    { !ref_loading && !!job.mode && <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {get_job_mode(job.mode)?.name ?? ""}
                    </span> }
                    { !ref_loading && !!job.type && <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {get_job_type(job.type)?.name ?? ""}
                    </span> }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="flex-1 border-2 border-gray-200 rounded-lg p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
              <p className="text-gray-600 mb-1">{selectedJob.employer?.name}</p>
              <p className="text-sm text-gray-500 mb-4">Listed on {formatDate(selectedJob.created_at ?? "")}</p>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleEditJob(selectedJob.id ?? "")}
                  data-tour="bulk-actions"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Location: </span>
                      <span className="opacity-80">{selectedJob.location || "Not specified"}</span>
                    </p>                  
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Mode: </span>
                      <span className="opacity-80">{selectedJob.mode || "Not specified"}</span>
                    </p>                  
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Salary: </span>
                      <span className="opacity-80">{selectedJob.salary || "Not specified"}</span>
                    </p>                  
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Employment Type: </span>
                      <span className="opacity-80">{selectedJob.type || "Not specified"}</span>
                    </p>                  
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2">
                {selectedJob?.requirements?.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-white rounded-xl border-0 shadow-2xl [&>button]:hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Edit Job Listing
              </DialogTitle>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit} 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-job-title" className="text-sm font-medium text-gray-700">Job Title</Label>
                      <Input
                        id="edit-job-title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter job title"
                        className="mt-1 h-10"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-location" className="text-sm font-medium text-gray-700">Location</Label>
                      <Input
                        id="edit-location"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                        className="mt-1 h-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compensation & Work Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Salary</Label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <Input
                          type="number"
                          value={editFormData.salaryAmount || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, salaryAmount: e.target.value }))}
                          placeholder="Amount"
                          className="h-10"
                        />
                        <Select 
                          value={editFormData.salaryPeriod || ""} 
                          onValueChange={(value) => setEditFormData(prev => ({ ...prev, salaryPeriod: value }))}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hour">per Hour</SelectItem>
                            <SelectItem value="day">per Day</SelectItem>
                            <SelectItem value="month">per Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Work Arrangement</Label>
                      <Select 
                        value={editFormData.mode} 
                        onValueChange={(value) => setEditFormData(prev => ({ ...prev, mode: value }))}
                      >
                        <SelectTrigger className="mt-1 h-10">
                          <SelectValue placeholder="Select work arrangement" />
                        </SelectTrigger>
                        <SelectContent>
                          { job_modes.map(job_mode => 
                            <SelectItem value={job_mode.id + ""}>{job_mode.name}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Employment Type</Label>
                      <Select 
                        value={editFormData.projectType} 
                        onValueChange={(value) => setEditFormData(prev => ({ ...prev, projectType: value }))}
                      >
                        <SelectTrigger className="mt-1 h-10">
                          <SelectValue placeholder="Employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          { job_types.map(job_type => <SelectItem value={job_type.id + ""}>{job_type.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Description & Requirements */}
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-medium text-gray-900">Job Description</Label>
                  <Textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Share details about:\n\n• Daily responsibilities and key tasks\n• Learning opportunities and mentorship\n• Team collaboration and work environment\n• Technologies and tools they'll use\n• Skills they will develop during the internship"
                    className="mt-2 min-h-[200px] resize-none text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-lg font-medium text-gray-900">Requirements</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRequirement}
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[135px] overflow-y-auto">
                    {editFormData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-3 items-center group">
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{index + 1}</span>
                        </div>
                        <Input
                          value={req}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          placeholder={`e.g. ${index === 0 ? 'Knowledge of HTML, CSS, JavaScript' : index === 1 ? 'Experience with React or Vue.js' : 'Strong problem-solving abilities'}`}
                          className="h-9 text-sm"
                        />
                        {editFormData.requirements.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                            className="h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Checkbox
                        id="edit-require-github"
                        checked={editFormData.requireGithub || false}
                        onCheckedChange={(checked) => 
                          setEditFormData(prev => ({ ...prev, requireGithub: checked as boolean }))
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label htmlFor="edit-require-github" className="text-sm font-medium text-gray-900 cursor-pointer">
                        GitHub
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Checkbox
                        id="edit-require-portfolio"
                        checked={editFormData.requirePortfolio || false}
                        onCheckedChange={(checked) => 
                          setEditFormData(prev => ({ ...prev, requirePortfolio: checked as boolean }))
                        }
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label htmlFor="edit-require-portfolio" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Portfolio
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Job Modal - Complete Redesign */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-white rounded-xl border-0 shadow-2xl [&>button]:hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Create Job Listing
              </DialogTitle>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveAdd} 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Add Listing
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">Job Title</Label>
                      <Input
                        id="job-title"
                        value={addFormData.title}
                        onChange={(e) => setAddFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter job title"
                        className="mt-1 h-10"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                      <Input
                        id="location"
                        value={addFormData.location}
                        onChange={(e) => setAddFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                        className="mt-1 h-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compensation & Work Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Allowance</Label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <Input
                          type="number"
                          value={addFormData.allowanceAmount || ""}
                          onChange={(e) => setAddFormData(prev => ({ ...prev, allowanceAmount: e.target.value }))}
                          placeholder="Amount"
                          className="h-10"
                        />
                        <Select 
                          value={addFormData.allowancePeriod || ""} 
                          onValueChange={(value) => setAddFormData(prev => ({ ...prev, allowancePeriod: value }))}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hour">per Hour</SelectItem>
                            <SelectItem value="day">per Day</SelectItem>
                            <SelectItem value="month">per Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Work Arrangement</Label>
                      <Select 
                        value={addFormData.mode} 
                        onValueChange={(value) => setAddFormData(prev => ({ ...prev, mode: value }))}
                      >
                        <SelectTrigger className="mt-1 h-10">
                          <SelectValue placeholder="Select work arrangement" />
                        </SelectTrigger>
                        <SelectContent>
                          { job_modes.map(job_mode => 
                            <SelectItem value={job_mode.id + ""}>{job_mode.name}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Employment Type</Label>
                      <Select 
                        value={addFormData.projectType} 
                        onValueChange={(value) => setAddFormData(prev => ({ ...prev, projectType: value }))}
                      >
                        <SelectTrigger className="mt-1 h-10">
                          <SelectValue placeholder="Employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          { job_types.map(job_type => <SelectItem value={job_type.id + ""}>{job_type.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Description & Requirements */}
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-medium text-gray-900">Job Description</Label>
                  <Textarea
                    value={addFormData.description}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Share details about:\n\n• Daily responsibilities and key tasks\n• Learning opportunities and mentorship\n• Team collaboration and work environment\n• Technologies and tools they'll use\n• Skills they will develop during the internship"
                    className="mt-2 min-h-[200px] resize-none text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-lg font-medium text-gray-900">Requirements</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRequirementToAdd}
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[135px] overflow-y-auto">
                    {addFormData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-3 items-center group">
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{index + 1}</span>
                        </div>
                        <Input
                          value={req}
                          onChange={(e) => handleAddRequirementChange(index, e.target.value)}
                          placeholder={`e.g. ${index === 0 ? 'Knowledge of HTML, CSS, JavaScript' : index === 1 ? 'Experience with React or Vue.js' : 'Strong problem-solving abilities'}`}
                          className="h-9 text-sm"
                        />
                        {addFormData.requirements.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAddRequirement(index)}
                            className="h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Checkbox
                        id="require-github"
                        checked={addFormData.requireGithub}
                        onCheckedChange={(checked) => 
                          setAddFormData(prev => ({ ...prev, requireGithub: checked as boolean }))
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label htmlFor="require-github" className="text-sm font-medium text-gray-900 cursor-pointer">
                        GitHub
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Checkbox
                        id="require-portfolio"
                        checked={addFormData.requirePortfolio}
                        onCheckedChange={(checked) => 
                          setAddFormData(prev => ({ ...prev, requirePortfolio: checked as boolean }))
                        }
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label htmlFor="require-portfolio" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Portfolio
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Tour */}
      <ProductTour
        isOpen={showTour}
        onClose={closeTour}
        pageName="listings"
      />
    </div>
  )
}