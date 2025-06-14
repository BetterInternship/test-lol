"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import {
  Search,
  ChevronDown,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import JobScroller from "@/components/student/job-scroller"
import ProfileButton from "@/components/student/profile-button"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("All types")
  const [locationFilter, setLocationFilter] = useState("Any location")
  const [categoryFilter, setCategoryFilter] = useState("All categories")
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState("");
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const justBetterRef = useRef<HTMLSpanElement>(null);

  // Check if screen width is <= 1024px
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveFilter("");
    };

    if (activeFilter) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeFilter]);

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) {
      params.set('q', searchTerm)
    }
    if (jobTypeFilter !== "All types") {
      params.set('jobType', jobTypeFilter)
    }
    if (locationFilter !== "Any location") {
      params.set('location', locationFilter)
    }
    if (categoryFilter !== "All categories") {
      params.set('category', categoryFilter)
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="flex flex-col min-h-screen">
        {/* Top bar with logo and Profile button */}
        <div className={`flex justify-between items-center ${isMobile ? 'px-6 py-4' : 'p-4'} bg-white/80 backdrop-blur-md border-b border-gray-100`}>
          <Link href="/" className="block">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>BetterInternship</h1>
          </Link>
          <ProfileButton />
        </div>
          
        <div className={`flex-1 flex flex-col justify-center items-center ${isMobile ? 'px-6 py-8 pb-32' : 'px-6 lg:px-12 py-8'}`}>
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className={`font-bold text-gray-900 leading-tight mb-3 ${isMobile ? 'text-4xl tracking-tight' : 'text-3xl sm:text-4xl lg:text-6xl'}`}>
              Better Internships Start Here.
            </h1>
            {!isMobile && (
              <div onMouseOver={() => {
                console.log(justBetterRef.current?.style.scale)
                if (justBetterRef.current) {
                  justBetterRef.current.style.transform = 'scale(1, 1)';
                  justBetterRef.current.style.width = '100px';
                }
              }} onMouseLeave={() => {
                if (justBetterRef.current) {
                  justBetterRef.current.style.transform = 'scale(0, 1)';
                  justBetterRef.current.style.width = '0px';
                }
              }}>
                <div className="group flex flex-row justify-center">
                  <div className="inline-block relative text-base sm:text-lg lg:text-xl text-gray-600 m-0 translate-x-[10%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                    By DLSU students, for DLSU students. Not official. 
                  </div>
                  <div className="inline-block relative text-base sm:text-lg lg:text-xl text-gray-600 overflow-hidden ">
                    <span className="invisible m-0">Just Better...</span>
                    <div className="absolute top-0 left-0 text-base sm:text-lg lg:text-xl h-full w-full flex items-center justify-center opacity-0
                                    transform -translate-x-full transition-all duration-300 ease-in-out
                                    group-hover:translate-x-0 group-hover:opacity-100">
                      Just Better.
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isMobile && (
              <p className="text-lg text-gray-500 font-medium">
                By DLSU students, for DLSU students. Not official. Just Better.
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-md">
            {isMobile ? (
              /* Mobile Search Layout - Clean Apple Style */
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Job Title, keywords, Company"
                    className="pl-12 pr-4 w-full h-14 bg-white border-0 rounded-2xl shadow-sm text-gray-900 placeholder:text-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500 focus:shadow-lg transition-all duration-200"
                  />
                </div>
                
                {/* Filter Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <FilterDropdown
                      name="jobType"
                      options={["Internships", "Full-time", "Part-time", "All types"]}
                      value={jobTypeFilter}
                      activeFilter={activeFilter}
                      onChange={setJobTypeFilter}
                      onClick={() => { setActiveFilter("jobType") }}
                    />
                  </div>
                  <div className="relative">
                    <FilterDropdown
                      name="location"
                      options={["Face to Face", "Remote", "Hybrid", "Any location"]}
                      value={locationFilter}
                      activeFilter={activeFilter}
                      onChange={setLocationFilter}
                      onClick={() => { setActiveFilter("location") }}
                    />
                  </div>
                </div>
                
                {/* Category Filter Row */}
                <div className="relative">
                  {isMobile ? (
                    <Button
                      onClick={() => setShowCategoryModal(true)}
                      className="h-12 px-4 flex items-center gap-2 w-full justify-between text-left bg-white border-0 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-gray-700"
                    >
                      <span className="truncate">{categoryFilter}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  ) : (
                    <FilterDropdown
                      name="category"
                      options={["Tech", "Non-Tech", "Engineering", "Research", "Education", "Others", "All categories"]}
                      value={categoryFilter}
                      activeFilter={activeFilter}
                      onChange={setCategoryFilter}
                      onClick={() => { setActiveFilter("category") }}
                    />
                  )}
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={handleSearch} 
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Find Jobs
                </Button>
              </div>
            ) : (
              /* Desktop Search Layout - Clean and Properly Spaced */
              <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                  <div className="flex items-center gap-2">
                    {/* Search Input Field */}
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Job Title, keywords, Company..."
                        className="w-full h-12 pl-12 pr-4 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 text-base"
                      />
                    </div>
                    
                    {/* Filter Dropdowns */}
                    <div className="flex items-center gap-2 border-l border-gray-200 pl-2">
                      <FilterDropdown
                        name="jobType"
                        options={["Internships", "Full-time", "Part-time", "All types"]}
                        value={jobTypeFilter}
                        activeFilter={activeFilter}
                        onChange={setJobTypeFilter}
                        onClick={() => { setActiveFilter("jobType") }}
                      />
                      <FilterDropdown
                        name="location"
                        options={["Face to Face", "Remote", "Hybrid", "Any location"]}
                        value={locationFilter}
                        activeFilter={activeFilter}
                        onChange={setLocationFilter}
                        onClick={() => { setActiveFilter("location") }}
                      />
                      <FilterDropdown
                        name="category"
                        options={["Tech", "Non-Tech", "Engineering", "Research", "Education", "Others", "All categories"]}
                        value={categoryFilter}
                        activeFilter={activeFilter}
                        onChange={setCategoryFilter}
                        onClick={() => { setActiveFilter("category") }}
                      />
                    </div>
                    
                    {/* Search Button */}
                    <Button 
                      onClick={handleSearch} 
                      className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
                    >
                      Find Jobs
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job Suggestions - Only show on desktop */}
          {!isMobile && (
            <div className="w-full max-w-4xl mt-8">
              <JobScroller />
            </div>
          )}
        </div>

        {/* Footer - Hide on mobile */}
        {!isMobile && (
          <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-100 bg-white">
            Are you an Employer? Send us an Email:{" "}
            <a href="mailto:hello@betterinternship.com" className="text-blue-600 hover:underline">
              hello@betterinternship.com
            </a>
          </div>
        )}
      </div>

      {/* Category Modal - Mobile Only */}
      {isMobile && showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-auto p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-gray-900">Job Categories</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              {["All categories", "Tech", "Non-Tech", "Engineering", "Research", "Education", "Others"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setCategoryFilter(option)
                    setShowCategoryModal(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 text-sm font-medium ${
                    categoryFilter === option 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterDropdown({ name, options, value, onChange, activeFilter, onClick }: { name: string; options: string[]; value: string; onChange: (value: string) => void, activeFilter: string, onClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (name != activeFilter)
      setIsOpen(false);
  }, [name, activeFilter])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <div className="relative">
      <Button
        variant="outline" 
        onClick={() => (setIsOpen(!isOpen), onClick())}
        className={`${isMobile 
          ? 'h-12 px-4 flex items-center gap-2 w-full justify-between text-left bg-white border-0 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-gray-700' 
          : 'h-10 px-3 flex items-center gap-1 min-w-[120px] justify-between bg-transparent border-0 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-700 text-sm'
        }`}
      >
        <span className={`truncate ${isMobile ? 'text-sm' : 'text-sm'}`}>{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl z-50 min-w-full w-max overflow-hidden border border-gray-100 ${isMobile ? '' : 'shadow-2xl'}`}>
          {options.map((option, index) => (
            <button
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 ${isMobile ? 'py-3 text-sm font-medium' : 'py-3 text-sm font-medium'} hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 ${
                index === 0 ? `rounded-t-xl` : ''
              } ${
                index === options.length - 1 ? `rounded-b-xl` : ''
              } text-gray-700 whitespace-nowrap ${value === option ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


