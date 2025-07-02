"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useJobs } from "@/lib/api/use-api";
import { BasicRectangularTag } from "../../../components/ui/tags";

export default function JobScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { jobs, loading } = useJobs();

  useEffect(() => {
    if (!scrollerRef.current || !contentRef.current || jobs.length === 0)
      return;

    // Clone the content to create a seamless loop
    const content = contentRef.current;
    const clone = content.cloneNode(true) as HTMLDivElement;
    scrollerRef.current.appendChild(clone);

    // Calculate animation duration based on content width
    const calculateDuration = () => {
      if (!contentRef.current || !scrollerRef.current) return;
      const contentWidth = contentRef.current.offsetWidth;
      const duration = Math.max(contentWidth / 200, 5); // Faster speed and minimum 5s duration
      scrollerRef.current.style.animationDuration = `${duration}s`;
    };

    // Set initial duration
    setTimeout(calculateDuration, 100);
    window.addEventListener("resize", calculateDuration);

    // Pause animation on hover
    const handleMouseEnter = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = "paused";
      }
    };

    const handleMouseLeave = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = "running";
      }
    };

    scrollerRef.current.addEventListener("mouseenter", handleMouseEnter);
    scrollerRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", calculateDuration);
      if (scrollerRef.current) {
        scrollerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        scrollerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [jobs]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex gap-3 py-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <BasicRectangularTag key={index}>
              <div className="h-4 w-32 bg-gray-200"></div>
            </BasicRectangularTag>
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex justify-center">
          <div className="flex-shrink-0 rounded-md text-gray-500 text-sm">
            No jobs available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg">
      <div
        ref={scrollerRef}
        className="flex animate-scroll"
        style={{
          animationName: "scroll",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDuration: "10s", // Faster default duration
          animationPlayState: "running",
        }}
      >
        <div ref={contentRef} className="flex gap-3 py-3">
          {jobs.map((job, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(job.title ?? "")}`}
              title={`${job.title} - ${job.employer?.name} (${job.location})`}
            >
              <BasicRectangularTag className="hover:bg-gray-100">
                {job.title}
              </BasicRectangularTag>
            </Link>
          ))}
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
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: running;
        }
      `}</style>
    </div>
  );
}
