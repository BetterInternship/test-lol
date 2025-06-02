"use client"

import { useState } from "react"
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
import JobScroller from "@/components/job-scroller"
import ProfileButton from "@/components/profile-button"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("Internships")
  const [locationFilter, setLocationFilter] = useState("Face to Face")
  const router = useRouter()

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
        {/* Left Sidebar - Full height */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <Link href="/" className="block">
              <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">Intern&apos;s Launchpad</h1>
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar with Profile button */}
          <div className="flex justify-end p-4">
            <ProfileButton />
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center px-12">
            {/* Hero Text - Centered vertically */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-4">
                The Best College Careers Website for Students.
              </h1>
              <p className="text-xl text-gray-600">An independent project for students, by students.</p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-4xl mb-8">
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
                    value={jobTypeFilter}
                    onChange={setJobTypeFilter}
                  />
                  <span className="text-gray-300">|</span>
                  <FilterDropdown
                    options={["Face to Face", "Remote", "Hybrid", "Any location"]}
                    value={locationFilter}
                    onChange={setLocationFilter}
                  />
                  <Button onClick={handleSearch} className="h-12 px-6">
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
            <a href="mailto:dru@betterinternship.com" className="text-blue-600 hover:underline">
              dru@betterinternship.com
            </a>{" "}
            <a href="mailto:mo@betterinternship.com" className="text-blue-600 hover:underline">
              mo@betterinternship.com
            </a>{" "}
            or{" "}
            <a href="mailto:hello@betterinternship.com" className="text-blue-600 hover:underline">
              hello@betterinternship.com
            </a>
          </div>
        </div>
      </div>
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
