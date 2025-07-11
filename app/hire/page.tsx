"use client";

import HeroSection from "@/components/features/hire/landing/HeroSection";
import JobScroller from "@/components/features/student/landing/job-scroller";
import MobileJobScroller from "@/components/features/student/landing/mobile-job-scroller";
import { useAppContext } from "@/lib/ctx-app";

export default function HomePage() {
  return (
    <div className="flex flex-col  w-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        <HeroSection />
        <div className="w-full bg-gray-50 py-3 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <h2 className="text-base font-medium text-gray-600 tracking-wide whitespace-nowrap">
                Featured companies:
              </h2>
              <div className="flex justify-center">
                <JobScroller />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
