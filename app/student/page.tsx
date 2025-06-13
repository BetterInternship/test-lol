"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
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
  const [isMobile, setIsMobile] = useState(false);
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
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar - Hide on mobile */}
        {!isMobile && (
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <Link href="/" className="block">
                <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">BetterInternship</h1>
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
                  <CategoryLink icon={<GraduationCap className="h-5 w-5" />} label="Education and Psychology" category="Education & Psychology" />
                  <CategoryLink icon={<Palette className="h-5 w-5" />} label="Design and Arts" category="Design & Arts" />
                  <CategoryLink icon={<Stethoscope className="h-5 w-5" />} label="Medical" category="Medical" />
                  <CategoryLink icon={<Scale className="h-5 w-5" />} label="Law" category="Law" />
                  <CategoryLink icon={<ChefHat className="h-5 w-5" />} label="Culinary Arts" category="Culinary Arts" />
                  <CategoryLink icon={<Building2 className="h-5 w-5" />} label="Banking and Finance" category="Banking & Finance" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header with Logo and Profile */}
          {isMobile && (
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <Link href="/" className="block">
                <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
              </Link>
              <ProfileButton />
            </div>
          )}

          {/* Desktop Profile button */}
          {!isMobile && (
            <div className="flex justify-end p-4">
              <ProfileButton />
            </div>
          )}
          
          <div className={`flex-1 flex flex-col ${isMobile ? 'justify-center items-center px-6' : 'justify-center'} items-center px-4 sm:px-6 lg:px-12`}>
            {/* Hero Text */}
            <div className={`text-center ${isMobile ? 'mb-16' : 'mb-8 lg:mb-12'}`}>
              <h1 className={`${isMobile ? 'text-5xl mb-8' : 'text-2xl sm:text-3xl lg:text-4xl mb-4'} font-bold text-gray-800 leading-tight`}>
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
                        Just better.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isMobile && (
                <p className="text-xl text-gray-500">
                  By students, for students. Not official. Just better.
                </p>
              )}
            </div>

            {/* Search Bar - Responsive design */}
            {isMobile ? (
              <div className="w-full max-w-sm mb-12">
                {/* Mobile Search Input with integrated button */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-white rounded-3xl border border-gray-200 shadow-sm"></div>
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="What's your dream internship?"
                      className="w-full h-14 pl-5 pr-16 bg-transparent border-0 text-base placeholder:text-gray-400 focus:ring-0 focus:outline-none rounded-3xl font-normal"
                    />
                    <Button 
                      onClick={handleSearch}
                      className="absolute right-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center p-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Mobile Filter Dropdowns */}
                <div className="flex gap-3 justify-center">
                  <div className="relative flex-1 max-w-[180px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(activeFilter === "jobType" ? "" : "jobType");
                      }}
                      className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 transition-all duration-200 flex items-center justify-between shadow-sm"
                    >
                      <span>{jobTypeFilter === "All types" ? "All Job Types" : jobTypeFilter}</span>
                      <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${activeFilter === "jobType" ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeFilter === "jobType" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                        {["Internships", "Full-time", "Part-time", "All types"].map((option) => (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              setJobTypeFilter(option);
                              setActiveFilter("");
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1 max-w-[180px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(activeFilter === "location" ? "" : "location");
                      }}
                      className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 transition-all duration-200 flex items-center justify-between shadow-sm"
                    >
                      <span>{locationFilter === "Any location" ? "Any location" : locationFilter}</span>
                      <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${activeFilter === "location" ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeFilter === "location" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                        {["Face to Face", "Remote", "Hybrid", "Any location"].map((option) => (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocationFilter(option);
                              setActiveFilter("");
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl mb-8">
                {/* Desktop Search Bar - Horizontal Layout */}
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
                  <Button onClick={handleSearch} className="h-12 px-6">
                    Find Jobs
                  </Button>
                </div>
              </div>
            )}

            {/* Job Suggestions - Hide on mobile */}
            {!isMobile && (
              <div className="w-full max-w-4xl">
                <JobScroller />
              </div>
            )}
          </div>

          {/* Footer - Hide on mobile */}
          {!isMobile && (
            <div className="p-6 text-center text-sm text-gray-500 border-t">
              Are you an Employer? Send us an Email:{" "}
              <a href="mailto:hello@betterinternship.com" className="text-blue-600 hover:underline">
                hello@betterinternship.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterPill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-black text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
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
