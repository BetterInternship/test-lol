"use client";

import HeroSection from "@/components/features/hire/landing/HeroSection";
import JobScroller from "@/components/features/student/landing/job-scroller";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        <HeroSection />
        <div className="w-full bg-gray-50 py-3 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center">
                <JobScroller />
              </div>
              <h2 className="text-sm font-normal text-gray-600 tracking-wide whitespace-nowrap opacity-70">
                Featured Companies
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
