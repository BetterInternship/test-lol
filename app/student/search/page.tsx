"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Home,
  Monitor,
  HardHat,
  GraduationCap,
  Palette,
  Stethoscope,
  Scale,
  ChefHat,
  Building2,
  MapPin,
  Clock,
  PhilippinePeso,
  Briefcase,
  ChevronDown,
  X,
  Building,
  Calendar,
  Users,
  Heart,
  Send,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ProfileButton from "@/components/student/profile-button"
import { useJobs, useJobActions } from "@/hooks/useApi"
import { useAuthContext } from "../authctx"
import { Application, Job } from "@/lib/api-client"
import Markdown from 'react-markdown'

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthContext()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [jobTypeFilter, setJobTypeFilter] = useState("All types")
  const [locationFilter, setLocationFilter] = useState("Any location")
  const [tempJobTypeFilter, setTempJobTypeFilter] = useState("All types")
  const [tempLocationFilter, setTempLocationFilter] = useState("Any location")
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastApplication, setLastApplication] = useState<Partial<Application>>({})
  const [applicationData, setApplicationData] = useState({
    githubLink: "",
    portfolioLink: "",
    coverLetter: ""
  })
  const [applying, setApplying] = useState(false)

  // API hooks
  const { jobs, loading: jobs_loading, error: jobs_error, refetch } = useJobs({
    search: searchTerm.trim() || undefined,
    category: selectedCategory || undefined,
    type: jobTypeFilter !== "All types" ? jobTypeFilter : undefined,
    mode: locationFilter !== "Any location" ? locationFilter : undefined,
    limit: 50
  })

  const { 
    checkSaved, 
    checkApplied, 
    saveJob, 
    applyToJob, 
    isSaved, 
    getApplicationStatus 
  } = useJobActions()

  useEffect(() => {
    const query = searchParams.get('q') || ""
    setSearchTerm(query)
  }, [searchParams])

  useEffect(() => {
    const category = searchParams.get('category')
    const jobType = searchParams.get('jobType')
    const location = searchParams.get('location')
    const jobId = searchParams.get('jobId')    
    setSelectedCategory(category)
    
    // Set filters from URL params
    if (jobType) {
      setJobTypeFilter(jobType)
      setTempJobTypeFilter(jobType)
    }
    if (location) {
      setLocationFilter(location)
      setTempLocationFilter(location)
    }

    // If jobId is specified, we'll select it once jobs are loaded
    if (jobId && jobs.length > 0) {
      const targetJob = jobs.find(job => job.id === jobId)
      if (targetJob) {
        setSelectedJob(targetJob)
      }
    } else if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [searchParams, jobs])

  // Set first job as selected when jobs load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [jobs, selectedJob])

  // Check saved and applied status for selected job
  useEffect(() => {
    if (selectedJob && isAuthenticated) {
      checkSaved(selectedJob.id)
      checkApplied(selectedJob.id)
    }
  }, [selectedJob, isAuthenticated])

  const handleSearch = () => {
    // Apply temp filters to actual filters
    setJobTypeFilter(tempJobTypeFilter)
    setLocationFilter(tempLocationFilter)
    
    // The useJobs hook will automatically refetch with new params
    refetch()
  }

  const handleSave = async (job: Job) => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    try {
      await saveJob(job.id)
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

  const handleApply = () => {

    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    // Check if already applied
    const applicationStatus = getApplicationStatus(selectedJob?.id || '')
    if (applicationStatus) {
      alert('You have already applied to this job!')
      return
    }

    setShowApplicationModal(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob) return

    try {
      setApplying(true)
      applyToJob(selectedJob.id, {
        coverLetter: applicationData.coverLetter || undefined,
        githubLink: applicationData.githubLink || undefined,
        portfolioLink: applicationData.portfolioLink || undefined,
      }).then(response => {
        setLastApplication(response.application);
        setShowApplicationModal(false)
        setShowSuccessModal(true)
      })
      
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (jobs_error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load jobs: {jobs_error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <Link href="/" className="block">
              <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">Better Internship</h1>
            </Link>

            <Link
              href="/search?category=all&jobType=All types&location=Any location"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Browse All</span>
            </Link>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="font-semibold mb-4 text-gray-800">All Categories</h2>
              <div className="space-y-2">
                <CategoryLink icon={<Monitor className="h-5 w-5" />} label="Technology & Dev." category="Technology & Development" />
                <CategoryLink icon={<HardHat className="h-5 w-5" />} label="Engineering" category="Engineering" />
                <CategoryLink icon={<GraduationCap className="h-5 w-5" />} label="Education & Psychology" category="Education & Psychology" />
                <CategoryLink icon={<Palette className="h-5 w-5" />} label="Design & Arts" category="Design & Arts" />
                <CategoryLink icon={<Stethoscope className="h-5 w-5" />} label="Medical" category="Medical" />
                <CategoryLink icon={<Scale className="h-5 w-5" />} label="Law" category="Law" />
                <CategoryLink icon={<ChefHat className="h-5 w-5" />} label="Culinary Arts" category="Culinary Arts" />
                <CategoryLink icon={<Building2 className="h-5 w-5" />} label="Banking & Finance" category="Banking & Finance" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar with Profile button */}
          <div className="flex justify-end p-4">
            <ProfileButton />
          </div>
          
          {/* Search Bar */}
          <div className="px-6 pb-6 border-b bg-white">
            <div className="flex items-stretch gap-3 p-3 border rounded-lg bg-white shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Job Title, keywords, Company"
                  className="pl-10 w-full h-12 bg-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <FilterDropdown
                  options={["Internships", "Full-time", "Part-time", "All types"]}
                  value={tempJobTypeFilter}
                  onChange={setTempJobTypeFilter}
                />
                <span className="text-gray-300">|</span>
                <FilterDropdown
                  options={["Face to Face", "Remote", "Hybrid", "Any location"]}
                  value={tempLocationFilter}
                  onChange={setTempLocationFilter}
                />
                <Button onClick={handleSearch} className="h-12 px-6">
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 flex overflow-hidden">
            {jobs_loading ? (
              /* Loading State */
              <div className="w-full flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading jobs...</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              /* No Results */
              <div className="w-full flex items-center justify-center p-6">
                <div className="text-center text-gray-500">
                  <p>No jobs found</p>
                  <p className="text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              </div>
            ) : (
              <>
                {/* Job List */}
                <div className="w-1/3 border-r overflow-y-auto p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => setSelectedJob(job)}
                      />
                    ))}
                  </div>
                </div>

                {/* Job Details */}
                <div className="w-2/3 flex flex-col overflow-hidden">
                  {selectedJob && (
                    <JobDetails 
                      job={selectedJob} 
                      onApply={handleApply} 
                      onSave={handleSave}
                      isSaved={isSaved(selectedJob.id)}
                      applicationStatus={getApplicationStatus(selectedJob.id)}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-11/12 max-w-md p-6"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Apply to {selectedJob?.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApplicationModal(false)}
                  disabled={applying}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2">Resume</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Resume from profile will be attached</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2">GitHub Link</label>
                  <Input
                    value={applicationData.githubLink}
                    onChange={(e) => setApplicationData({...applicationData, githubLink: e.target.value})}
                    placeholder="https://github.com/yourusername"
                    className="w-full"
                    disabled={applying}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2">Portfolio Link</label>
                  <Input
                    value={applicationData.portfolioLink}
                    onChange={(e) => setApplicationData({...applicationData, portfolioLink: e.target.value})}
                    placeholder="https://yourportfolio.com"
                    className="w-full"
                    disabled={applying}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2">Cover Letter</label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    placeholder="Tell the company why you're interested in this position..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
                    disabled={applying}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Button 
                    onClick={handleSubmitApplication}
                    className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-lg font-medium"
                    disabled={applying}
                  >
                    {applying ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Applying...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Application
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-11/12 max-w-md p-8 text-center"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-4">
                <motion.button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowSuccessModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.5 }}
                >
                  ✈️
                </motion.div>
                <motion.h2 
                  className="text-xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Your Application has been sent!
                </motion.h2>
                <br />
                <motion.h2 
                  className="text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  Would you want to practice interviewing for this job?
                  <Button className="bg-blue-600 hover:bg-blue-700 w-1/2 mt-4" onClick={() => router.push(`/mock-interview?application=${lastApplication?.id ?? ''}`)}>
                    Practice
                  </Button>
                </motion.h2>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterDropdown({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <Button
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-4 flex items-center gap-2"
      >
        {value}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryLink({ icon, label, category }: { icon: React.ReactNode; label: string; category: string }) {
  return (
    <Link
      href={`/search?category=${encodeURIComponent(category)}`}
      className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <div className="border rounded-full p-2 bg-white flex-shrink-0">{icon}</div>
      <span className="truncate">{label}</span>
    </Link>
  )
}

function JobCard({ job, isSelected, onClick }: { job: Job; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{job.company.name}</p>

      <div className="flex flex-wrap gap-2 mb-2">
        {job.shift && (
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {job.shift}
          </Badge>
        )}
        <Badge variant="outline" className="text-xs">
          {job.type}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.salary && (
          <Badge variant="outline" className="text-xs">
            {job.salary}
          </Badge>
        )}
        <Badge variant="outline" className="text-xs">
          {job.workType}
        </Badge>
      </div>
    </div>
  )
}

function JobDetails({ 
  job, 
  onApply, 
  onSave, 
  isSaved, 
  applicationStatus 
}: { 
  job: Job
  onApply: () => void
  onSave: (job: Job) => void
  isSaved: boolean
  applicationStatus?: any
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h1>
        <div className="flex items-center gap-2 mb-2">
          <Building className="w-4 h-4 text-gray-500" />
          <p className="text-gray-600">{job.company.name}</p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-500">Listed on {formatDate(job.createdAt)}</p>
        </div>

        <div className="flex gap-3">
          {applicationStatus ? (
            <Button disabled className="bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Applied ({applicationStatus.status})
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onApply}>
              Apply
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => onSave(job)}
            className={isSaved ? "bg-red-50 border-red-200 text-red-600" : ""}
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4">Job Details</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="font-medium text-sm">Location: {job.location}</p>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Mode: </span>
                <span className="opacity-80">{job.mode || "Not specified"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PhilippinePeso className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Salary: </span>
                <span className="opacity-80">{job.salary || "Not specified"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Applicants: </span>
                <span className="opacity-80">{job.applicationCount || "0"} applicants</span>
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
        <Markdown>{job.description}</Markdown>

        {job.requirements.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              {job.requirements.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </>
        )}

        {job.responsibilities.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.responsibilities.map((resp: string, index: number) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </>
        )}

        {job.company.description && (
          <>
            <h3 className="text-lg font-semibold mb-3 mt-6">About the Company</h3>
            <p className="text-gray-700 leading-relaxed">{job.company.description}</p>
          </>
        )}
      </div>
    </div>
  )
}
