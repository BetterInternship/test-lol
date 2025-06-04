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
  User, 
  BarChart3, 
  Search,
  FileText,
  MapPin,
  Clock,
  DollarSign,
  Monitor,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Settings
} from "lucide-react"
import Link from "next/link"

// Sample job listings data for Google
const jobListings = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Google",
    location: "Legazpi Village, Makati",
    listedDate: "May 16, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 300/Day",
    mode: "Remote",
    allowance: "Non-paid",
    projectType: "Project-Based/Flexible",
    description: "Our brand seeks a creative and enthusiastic Social Media Intern to join our team. The Social Media Intern will assist with the management and creation of TikTok content to increase our brand's online presence and engagement. You will work closely with our marketing team to develop engaging content, monitor social media trends, and help grow our online community.",
    requirements: ["Knowledge of HTML, CSS, JavaScript", "Experience with React or Angular", "Understanding of responsive design principles"]
  },
  {
    id: 2,
    title: "Backend Developer Intern", 
    company: "Google",
    location: "Legazpi Village, Makati",
    listedDate: "May 16, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 350/Day",
    mode: "Remote",
    allowance: "Paid",
    projectType: "Full-time",
    description: "Join our backend development team to work on scalable server-side applications. You'll be involved in API development, database optimization, and cloud infrastructure management.",
    requirements: ["Python or Java proficiency", "Database knowledge (SQL/NoSQL)", "RESTful API experience"]
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Google", 
    location: "Legazpi Village, Makati",
    listedDate: "May 16, 2025",
    shift: "8 Hour Shift",
    type: "Internship", 
    salary: "PHP 280/Day",
    mode: "Hybrid",
    allowance: "Non-paid",
    projectType: "Project-Based/Flexible",
    description: "Create intuitive and engaging user experiences for our digital products. Work with design systems, conduct user research, and collaborate with development teams.",
    requirements: ["Figma/Sketch proficiency", "Design thinking methodology", "Portfolio of design work"]
  },
  {
    id: 4,
    title: "Software Engineering Intern",
    company: "Google",
    location: "Legazpi Village, Makati", 
    listedDate: "May 16, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 400/Day",
    mode: "Hybrid",
    allowance: "Paid",
    projectType: "Full-time",
    description: "Work on cutting-edge software solutions and contribute to products used by millions. Gain experience in large-scale system design and modern development practices.",
    requirements: ["Computer Science fundamentals", "Programming in multiple languages", "Problem-solving skills"]
  },
  {
    id: 5,
    title: "Data Science Intern",
    company: "Google",
    location: "BGC, Taguig",
    listedDate: "May 15, 2025",
    shift: "Flexible Hours",
    type: "Internship",
    salary: "PHP 450/Day",
    mode: "Hybrid",
    allowance: "Paid",
    projectType: "Project-Based/Flexible",
    description: "Analyze large datasets to extract meaningful insights. Work with machine learning models and statistical analysis to drive business decisions.",
    requirements: ["Python/R proficiency", "Statistics knowledge", "SQL experience", "Machine learning basics"]
  },
  {
    id: 6,
    title: "Mobile App Developer Intern",
    company: "Google",
    location: "Ortigas, Pasig",
    listedDate: "May 14, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 320/Day",
    mode: "Remote",
    allowance: "Non-paid",
    projectType: "Part-time",
    description: "Develop mobile applications for Android and iOS platforms. Learn modern mobile development frameworks and best practices.",
    requirements: ["Flutter or React Native", "Mobile UI/UX principles", "API integration experience"]
  },
  {
    id: 7,
    title: "DevOps Engineer Intern",
    company: "Google",
    location: "Alabang, Muntinlupa",
    listedDate: "May 13, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 380/Day",
    mode: "Hybrid",
    allowance: "Paid",
    projectType: "Full-time",
    description: "Learn cloud infrastructure management, CI/CD pipelines, and automation tools. Gain hands-on experience with AWS, Docker, and Kubernetes.",
    requirements: ["Linux command line", "Docker basics", "Cloud platforms (AWS/GCP)", "Scripting languages"]
  },
  {
    id: 8,
    title: "Product Manager Intern",
    company: "Google",
    location: "Makati CBD",
    listedDate: "May 12, 2025",
    shift: "Flexible Hours",
    type: "Internship",
    salary: "PHP 360/Day",
    mode: "Hybrid",
    allowance: "Paid",
    projectType: "Project-Based/Flexible",
    description: "Support product development lifecycle from ideation to launch. Conduct market research, analyze user feedback, and assist in roadmap planning.",
    requirements: ["Analytical thinking", "Communication skills", "Basic knowledge of Agile", "Data analysis tools"]
  },
  {
    id: 9,
    title: "Cybersecurity Intern",
    company: "Google",
    location: "Bonifacio Global City",
    listedDate: "May 11, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 420/Day",
    mode: "On-site",
    allowance: "Paid",
    projectType: "Full-time",
    description: "Learn security protocols, vulnerability assessment, and incident response. Assist in monitoring security systems and threat analysis.",
    requirements: ["Network security basics", "Ethical hacking interest", "Security frameworks knowledge", "Problem-solving skills"]
  },
  {
    id: 10,
    title: "QA Tester Intern",
    company: "Google",
    location: "Mandaluyong City",
    listedDate: "May 10, 2025",
    shift: "8 Hour Shift",
    type: "Internship",
    salary: "PHP 290/Day",
    mode: "Remote",
    allowance: "Non-paid",
    projectType: "Part-time",
    description: "Test software applications for bugs and usability issues. Learn automated testing tools and quality assurance methodologies.",
    requirements: ["Attention to detail", "Testing methodologies", "Bug tracking tools", "Basic scripting knowledge"]
  }
]

export default function MyListings() {
  const [selectedJob, setSelectedJob] = useState(jobListings[0])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredJobs = jobListings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium">
              <FileText className="h-5 w-5" />
              My Listings
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Your Listings</h1>
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
        <div className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Left Panel - Job List */}
          <div className="w-96 flex flex-col h-full">
            {/* Search Bar - Fixed */}
            <div className="relative mb-4 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings..."
                className="pl-10"
              />
            </div>

            {/* Job Cards - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0 scrollbar-custom">
              {filteredJobs.map((job) => (
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
                  <p className="text-sm text-gray-500 mb-3">Listed on {job.listedDate}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {job.shift}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="flex-1 border-2 border-gray-200 rounded-lg p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
              <p className="text-gray-600 mb-1">{selectedJob.company}</p>
              <p className="text-sm text-gray-500 mb-4">Listed on {selectedJob.listedDate}</p>
              
              <div className="flex gap-3">
                <Button variant="outline">Visit</Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location:</p>
                    <p className="text-sm text-gray-600">{selectedJob.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mode:</p>
                    <p className="text-sm text-gray-600">{selectedJob.mode}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Allowance:</p>
                    <p className="text-sm text-gray-600">{selectedJob.allowance}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Project-Based/</p>
                    <p className="text-sm text-gray-600">{selectedJob.projectType}</p>
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
                {selectedJob.requirements.map((req, index) => (
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
    </div>
  )
}