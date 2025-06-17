"use client";

import Link from "next/link";
import { useJobs } from "@/hooks/use-api";
import { BasicRectangularTag } from "../../../components/ui/tags";

/**
 * Mobile-optimized job scroller with grid layout instead of horizontal scroll
 * Reuses existing job data and tag components following established patterns
 * 
 * @component
 */
export default function MobileJobScroller() {
  const { jobs, loading } = useJobs();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <BasicRectangularTag key={index} className="animate-pulse">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </BasicRectangularTag>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No jobs available at the moment
        </p>
      </div>
    );
  }

  // Take first 8 jobs for mobile grid layout
  const mobile_jobs = jobs.slice(0, 8);

  return (
    <div className="grid grid-cols-2 gap-3">
      {mobile_jobs.map((job, index) => (
        <Link
          key={index}
          href={`/search?q=${encodeURIComponent(job.title ?? "")}`}
          title={`${job.title} - ${job.employer?.name} (${job.location})`}
          className="block"
        >
          <BasicRectangularTag className="hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 w-full text-center border-gray-200 hover:border-gray-300">
            <span className="truncate block text-sm font-medium">
              {job.title}
            </span>
          </BasicRectangularTag>
        </Link>
      ))}
    </div>
  );
}
