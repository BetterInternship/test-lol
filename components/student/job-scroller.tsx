"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { job_service } from "@/lib/api"
import { Job } from "@/lib/db/db.types"
import { useCache } from "@/hooks/use-cache"
import { useJobs } from "@/hooks/use-api"

export default function JobScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { jobs, loading } = useJobs();

  useEffect(() => {
    if (!scrollerRef.current || !contentRef.current || jobs.length === 0) return

    // Clone the content to create a seamless loop
    const content = contentRef.current
    const clone = content.cloneNode(true) as HTMLDivElement
    scrollerRef.current.appendChild(clone)

    // Calculate animation duration based on content width
    const calculateDuration = () => {
      if (!contentRef.current || !scrollerRef.current) return
      const contentWidth = contentRef.current.offsetWidth
      const duration = contentWidth / 50 // Adjust speed here
      scrollerRef.current.style.animationDuration = `${duration}s`
    }

    calculateDuration()
    window.addEventListener("resize", calculateDuration)

    // Pause animation on hover
    const handleMouseEnter = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = "paused"
      }
    }

    const handleMouseLeave = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = "running"
      }
    }

    scrollerRef.current.addEventListener("mouseenter", handleMouseEnter)
    scrollerRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("resize", calculateDuration)
      if (scrollerRef.current) {
        scrollerRef.current.removeEventListener("mouseenter", handleMouseEnter)
        scrollerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [jobs])

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex gap-3 py-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 border rounded-md px-3 py-2 bg-gray-100 animate-pulse whitespace-nowrap shadow-sm text-sm"
            >
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex gap-3 py-3">
          <div className="flex-shrink-0 border rounded-md px-3 py-2 bg-white text-gray-500 text-sm">
            No jobs available at the moment
          </div>
        </div>
      </div>
    )
  }

  // Generate job listing titles for the scroller
  const jobListings = jobs.map(job => 
    `${job.title} at ${job.employer?.name}${job.type === 'Internship' ? ' Intern' : job.type === 'Full-time' ? ' Full-time' : job.type === 'Part-time' ? ' Part-time' : ''}`
  )

  return (
    <div className="overflow-hidden rounded-lg">
      <div
        ref={scrollerRef}
        className="flex animate-scroll"
        style={{
          animationName: "scroll",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <div ref={contentRef} className="flex gap-3 py-3">
          {jobListings.map((jobListing, index) => {
            const job = jobs[index]
            return (
              <Link
                key={index}
                href={`/search?q=${encodeURIComponent(jobListing)}`}
                className="flex-shrink-0 border rounded-md px-3 py-2 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm text-sm"
                title={`${job.title} - ${job.employer?.name} (${job.location})`}
              >
                {jobListing}
              </Link>
            )
          })}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation-name: scroll;
        }
      `}</style>
    </div>
  )
}
