"use client";

import HeroSection from "@/components/features/hire/landing/HeroSection";
import JobScroller from "@/components/features/student/landing/job-scroller";
import MobileJobScroller from "@/components/features/student/landing/mobile-job-scroller";
import { useAppContext } from "@/lib/ctx-app";

export default function HomePage() {
  const { isMobile } = useAppContext();

  return (
    <div className="flex flex-col min-h-full w-full">
      <div className="p-6">
      <HeroSection />
      </div>

      
      {/* Featured Companies Section */}
      <div className="w-full bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
              Featured Companies
            </h2>
          </div>
          <div className="flex justify-center">
            <JobScroller />
          </div>
        </div>
      </div>
    </div>
  );
}
