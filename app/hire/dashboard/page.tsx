"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  Calendar, 
  FileText, 
  User, 
  BarChart3, 
  ChevronDown,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Settings
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

  const updateStatus = (id: number, newStatus: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === id ? { ...applicant, status: newStatus } : applicant
    ))
  }

  const openApplicantModal = (applicant: typeof applicantsData[0]) => {
    setSelectedApplicant(applicant)
    setIsModalOpen(true)
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
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium cursor-default">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </div>
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

        {/* Table */}
        <div className="p-6 flex flex-col h-0 flex-1">
          <div className="bg-white border rounded-lg overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[180px]">
                      <div className="flex items-center gap-2">
                        Name <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <div className="flex items-center gap-2">
                        School <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <div className="flex items-center gap-2">
                        Program <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[120px]">
                      <div className="flex items-center gap-2">
                        Job <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[100px]">
                      <div className="flex items-center gap-2">
                        Mode <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <div className="flex items-center gap-2">
                        Resume <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[80px]">
                      <div className="flex items-center gap-2">
                        Calendar <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-800 w-[140px]">
                      <div className="flex items-center gap-2">
                        Status <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((applicant) => (
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
