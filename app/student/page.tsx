"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import {
  Search,
  ChevronDown,
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
  const [activeFilter, setActiveFilter] = useState("");
  const router = useRouter()
  const justBetterRef = useRef<HTMLSpanElement>(null);

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
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Top bar with logo and Profile button */}
        <div className="flex justify-between items-center p-4">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">BetterInternship</h1>
          </Link>
          <ProfileButton />
        </div>
          
          <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-12 py-8">
            {/* Hero Text */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
                Better Internships Start Here.
              </h1>
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
                      Just better.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-4xl mb-6">
              <div className="flex items-stretch gap-3 p-3 border rounded-lg bg-white shadow-sm">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Job Title, keywords, Company"
                    className="pl-10 w-full h-10 bg-white border-0 focus:ring-0"
                  />
                </div>
                <div className="flex items-center gap-3">
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
                  <Button onClick={handleSearch} className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white">
                    Find Jobs
                  </Button>
                </div>
              </div>
            </div>

            {/* Job Suggestions */}
            <div className="w-full max-w-4xl">
              <JobScroller />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center text-sm text-gray-500 border-t">
            Are you an Employer? Send us an Email:{" "}
            <a href="mailto:hello@betterinternship.com" className="text-blue-600 hover:underline">
              hello@betterinternship.com
            </a>
          </div>
        </div>
    </div>
  )
}

function FilterDropdown({ name, options, value, onChange, activeFilter, onClick }: { name: string; options: string[]; value: string; onChange: (value: string) => void, activeFilter: string, onClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (name != activeFilter)
      setIsOpen(false);
  }, [name, activeFilter])
  
  return (
    <div className="relative">
      <Button
        variant="outline" 
        onClick={() => (setIsOpen(!isOpen), onClick())}
        className="h-10 px-4 flex items-center gap-2 min-w-[120px] justify-between"
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


