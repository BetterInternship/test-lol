"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Calendar, 
  FileText, 
  User, 
  BarChart3, 
  ChevronDown,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Search
} from "lucide-react"
import Link from "next/link"
import ApplicantModal from "@/components/hire/applicant-modal"
import CalendarModal from "@/components/hire/calendar-modal"

// Placeholder data for applicants
const applicantsData = [
  { id: 1, name: "John Doe", school: "DLSU", program: "IT", job: "DevOps", mode: "Full-Time", status: "New" },
  { id: 2, name: "Jane Smith", school: "DLSU", program: "CS", job: "Frontend Dev", mode: "Part-Time", status: "Rejected" },
  { id: 3, name: "Mike Johnson", school: "DLSU", program: "IT", job: "Backend Dev", mode: "Full-Time", status: "To Interview" },
  { id: 4, name: "Sarah Wilson", school: "DLSU", program: "CS", job: "Full Stack", mode: "Full-Time", status: "Offer Sent" },
  { id: 5, name: "Chris Brown", school: "DLSU", program: "IT", job: "Mobile Dev", mode: "Part-Time", status: "Shortlisted" },
  { id: 6, name: "Emily Davis", school: "DLSU", program: "CS", job: "UI/UX", mode: "OJT", status: "Hired" },
  { id: 7, name: "Alex Garcia", school: "DLSU", program: "IT", job: "DevOps", mode: "Full-Time", status: "Interviewing" },
  { id: 8, name: "Lisa Martinez", school: "DLSU", program: "CS", job: "Data Science", mode: "Part-Time", status: "Offer Declined" },
  { id: 9, name: "Tom Anderson", school: "DLSU", program: "IT", job: "QA Engineer", mode: "Full-Time", status: "Shortlisted" },
  { id: 10, name: "Maria Rodriguez", school: "DLSU", program: "CS", job: "DevOps", mode: "OJT", status: "Hired" },
  { id: 11, name: "Kevin Lee", school: "DLSU", program: "IT", job: "Frontend Dev", mode: "Part-Time", status: "Interviewing" },
  { id: 12, name: "Anna Taylor", school: "DLSU", program: "CS", job: "Backend Dev", mode: "Full-Time", status: "Offer Declined" },
]

const statusOptions = [
  "New",
  "Interviewing", 
  "Shortlisted",
  "Offer Sent",
  "Offer Accepted",
  "Offer Declined",
  "Hired",
  "Rejected"
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "New": return "bg-blue-100 text-blue-800"
    case "Interviewing": return "bg-yellow-100 text-yellow-800" 
    case "Shortlisted": return "bg-purple-100 text-purple-800"
    case "Offer Sent": return "bg-orange-100 text-orange-800"
    case "Offer Accepted": return "bg-green-100 text-green-800"
    case "Offer Declined": return "bg-red-100 text-red-800"
    case "Hired": return "bg-emerald-100 text-emerald-800"
    case "Rejected": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function Dashboard() {
  const [applicants, setApplicants] = useState(applicantsData)
  const [selectedApplicant, setSelectedApplicant] = useState<typeof applicantsData[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const router = useRouter()

  // Sorting and filtering states
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [programSearch, setProgramSearch] = useState("")
  const [jobSearch, setJobSearch] = useState("")
  const [statusSearch, setStatusSearch] = useState("")

  // Get unique values for filters
  const uniquePrograms = useMemo(() => [...new Set(applicantsData.map(a => a.program))].sort(), [])
  const uniqueJobs = useMemo(() => [...new Set(applicantsData.map(a => a.job))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(applicantsData.map(a => a.status))].sort(), [])

  // Filter and sort applicants
  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applicantsData.filter(applicant => {
      const programMatch = selectedPrograms.length === 0 || selectedPrograms.includes(applicant.program)
      const jobMatch = selectedJobs.length === 0 || selectedJobs.includes(applicant.job)
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(applicant.status)
      return programMatch && jobMatch && statusMatch
    })

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof typeof a]
        let bValue = b[sortField as keyof typeof b]
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase()
        if (typeof bValue === 'string') bValue = bValue.toLowerCase()
        
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [selectedPrograms, selectedJobs, selectedStatuses, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleProgramToggle = (program: string) => {
    setSelectedPrograms(prev => 
      prev.includes(program) 
        ? prev.filter(p => p !== program)
        : [...prev, program]
    )
  }

  const handleJobToggle = (job: string) => {
    setSelectedJobs(prev => 
      prev.includes(job) 
        ? prev.filter(j => j !== job)
        : [...prev, job]
    )
  }

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const updateStatus = (id: number, newStatus: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === id ? { ...applicant, status: newStatus } : applicant
    ))
    // Also update the main data source if needed
    const applicantIndex = applicantsData.findIndex(a => a.id === id)
    if (applicantIndex !== -1) {
      applicantsData[applicantIndex].status = newStatus
    }
  }

  const openApplicantModal = (applicant: typeof applicantsData[0]) => {
    setSelectedApplicant(applicant)
    setIsModalOpen(true)
  }

  // Filter components
  const MultiSelectFilter = ({ 
    title, 
    options, 
    selected, 
    onToggle, 
    searchValue, 
    onSearchChange,
    fieldName 
  }: {
    title: string
    options: string[]
    selected: string[]
    onToggle: (value: string) => void
    searchValue: string
    onSearchChange: (value: string) => void
    fieldName: string
  }) => {
    const filteredOptions = options.filter(option => 
      option.toLowerCase().includes(searchValue.toLowerCase())
    )

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 font-semibold">
            <div className="flex items-center gap-2">
              {title} <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort(fieldName)}
                className="text-xs"
              >
                A-Z {sortField === fieldName && sortDirection === "asc" && "↑"}
                {sortField === fieldName && sortDirection === "desc" && "↓"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Select all filtered options
                  filteredOptions.forEach(option => {
                    if (!selected.includes(option)) {
                      onToggle(option)
                    }
                  })
                }}
                className="text-xs"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clear all selections
                  selected.forEach(option => onToggle(option))
                }}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${title}-${option}`}
                    checked={selected.includes(option)}
                    onCheckedChange={() => onToggle(option)}
                  />
                  <label
                    htmlFor={`${title}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            
            {selected.length > 0 && (
              <div className="text-xs text-gray-500 pt-2 border-t">
                {selected.length} selected
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const SortableFilter = ({ field, title }: { field: string; title: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 font-semibold">
          <div className="flex items-center gap-2">
            {title} <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="start">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort(field)}
            className="w-full justify-start"
          >
            Sort A-Z {sortField === field && sortDirection === "asc" && "↑"}
            {sortField === field && sortDirection === "desc" && "↓"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )

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
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium cursor-default">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </div>
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
          <h1 className="text-2xl font-bold text-gray-800">Application Dashboard</h1>
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

        {/* Table */}
        <div className="p-6 flex flex-col h-0 flex-1">
          <div className="bg-white border rounded-lg overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[180px]">
                      <SortableFilter field="name" title="Name" />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <SortableFilter field="school" title="School" />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <MultiSelectFilter
                        title="Program"
                        options={uniquePrograms}
                        selected={selectedPrograms}
                        onToggle={handleProgramToggle}
                        searchValue={programSearch}
                        onSearchChange={setProgramSearch}
                        fieldName="program"
                      />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[120px]">
                      <MultiSelectFilter
                        title="Job"
                        options={uniqueJobs}
                        selected={selectedJobs}
                        onToggle={handleJobToggle}
                        searchValue={jobSearch}
                        onSearchChange={setJobSearch}
                        fieldName="job"
                      />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[100px]">
                      <SortableFilter field="mode" title="Mode" />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <span className="font-semibold">Resume</span>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <span className="font-semibold">Calendar</span>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[140px]">
                      <MultiSelectFilter
                        title="Status"
                        options={uniqueStatuses}
                        selected={selectedStatuses}
                        onToggle={handleStatusToggle}
                        searchValue={statusSearch}
                        onSearchChange={setStatusSearch}
                        fieldName="status"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedApplicants.map((applicant) => (
                    <tr key={applicant.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-800 w-[180px] truncate">{applicant.name}</td>
                      <td className="p-4 text-gray-800 w-[80px] truncate">{applicant.school}</td>
                      <td className="p-4 text-gray-800 w-[80px] truncate">{applicant.program}</td>
                      <td className="p-4 text-gray-800 w-[120px] truncate">{applicant.job}</td>
                      <td className="p-4 text-gray-800 w-[100px] truncate">{applicant.mode}</td>
                      <td className="p-4 w-[80px]">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-10 h-10 p-0"
                          onClick={() => openApplicantModal(applicant)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="p-4 w-[80px]">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-10 h-10 p-0"
                          onClick={() => setIsCalendarOpen(true)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="p-4 w-[140px]">
                        <Select 
                          value={applicant.status} 
                          onValueChange={(value) => updateStatus(applicant.id, value)}
                        >
                          <SelectTrigger className={`w-full ${getStatusColor(applicant.status)} border-0`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Modal */}
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        applicantName={selectedApplicant?.name}
      />
    </div>
  )
}
