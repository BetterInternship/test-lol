"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type React from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobScroller from "@/app/student/landing/job-scroller";
import MobileJobScroller from "@/app/student/landing/mobile-job-scroller";
import { DropdownGroup } from "@/components/ui/dropdown";
import { useFilter } from "@/lib/filter";
import { useAppContext } from "@/lib/ctx-app";
import { useModal } from "@/hooks/use-modal";
import { useRefs } from "@/lib/db/use-refs";
import { Industry } from "@/lib/db/db.types";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { industries, job_categories } = useRefs();
  const { filters, set_filter, filter_setter, applyFiltersAndNavigate } =
    useFilter<{
      industry: string;
      category: string;
    }>({
      industry: "All industries",
      category: "All categories",
    });

  // Use standardized modal hooks
  const {
    open: openCategoryModal,
    close: closeCategoryModal,
    Modal: CategoryModal,
  } = useModal("category-modal");

  const {
    open: openIndustryModal,
    close: closeIndustryModal,
    Modal: IndustryModal,
  } = useModal("industry-modal");
  const { isMobile: is_mobile } = useAppContext();
  const router = useRouter();
  const justBetterRef = useRef<HTMLSpanElement>(null);

  const handleSearch = () => {
    applyFiltersAndNavigate(searchTerm);
  };

  // Helper to apply filter and go to job listings
  // ! this needs to be changed lol
  const applyFilterAndGo = (type: "industry" | "category", value: string) => {
    // Create updated filters
    const updatedFilters = { ...filters, [type]: value };

    // Build URL parameters
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("q", searchTerm);
    }

    // Add non-default filters to URL
    Object.entries(updatedFilters).forEach(([key, filterValue]) => {
      const isDefaultValue =
        filterValue.toLowerCase().includes("all") ||
        filterValue.toLowerCase().includes("any");
      if (!isDefaultValue) {
        params.set(key, filterValue);
      }
    });

    // Navigate immediately
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div
        className={`flex-1 flex flex-col justify-center items-center ${
          is_mobile ? "px-6 py-8 pb-32" : "px-6 lg:px-12 py-8"
        }`}
      >
        {/* Hero Text */}
        <div className="text-center mb-8">
          <h1
            className={`font-display font-bold text-gray-900 leading-tight mb-3 ${
              is_mobile
                ? "text-4xl tracking-tight"
                : "text-3xl sm:text-4xl lg:text-6xl"
            }`}
          >
            Better Internships Start Here.
          </h1>
          {!is_mobile && (
            <div
              onMouseOver={() => {
                console.log(justBetterRef.current?.style.scale);
                if (justBetterRef.current) {
                  justBetterRef.current.style.transform = "scale(1, 1)";
                  justBetterRef.current.style.width = "100px";
                }
              }}
              onMouseLeave={() => {
                if (justBetterRef.current) {
                  justBetterRef.current.style.transform = "scale(0, 1)";
                  justBetterRef.current.style.width = "0px";
                }
              }}
            >
              <div className="group flex flex-row justify-center">
                <div className="inline-block relative text-base sm:text-lg lg:text-xl text-gray-600 m-0 translate-x-[10%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                  By DLSU students, for DLSU students. Not official.
                </div>
                <div className="inline-block relative text-base sm:text-lg lg:text-xl text-gray-600 overflow-hidden ">
                  <span className="invisible m-0">Just Better...</span>
                  <div
                    className="absolute top-0 left-0 text-base sm:text-lg lg:text-xl h-full w-full flex items-center justify-center opacity-0
                                    transform -translate-x-full transition-all duration-300 ease-in-out
                                    group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    Just Better.
                  </div>
                </div>
              </div>
            </div>
          )}
          {is_mobile && (
            <p className="text-lg text-gray-500 font-medium">
              By DLSU students, for DLSU students. Not official. Just Better.
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-5xl">
          {is_mobile ? (
            /* Mobile Search Layout - Clean Apple Style */
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyDown}
                  placeholder="Job Title, Keywords, Company..."
                  className="pl-12 pr-4 w-full h-14 bg-white border-0 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 text-base font-medium focus:shadow-md focus:outline-none focus:ring-opacity-50 transition-all duration-200"
                />
              </div>

              {/* Filter Row */}
              <DropdownGroup>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Button
                      onClick={() => openIndustryModal()}
                      className={`h-12 px-4 flex items-center gap-2 w-full justify-between text-left border-none shadow-none rounded-none font-medium text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        is_mobile ? "bg-white" : "bg-transparent"
                      }`}
                    >
                      <span className="truncate">
                        {filters.industry || "All industries"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Button
                      onClick={() => openCategoryModal()}
                      className={`h-12 px-4 flex items-center gap-2 w-full justify-between text-left border-none shadow-none rounded-none font-medium text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        is_mobile ? "bg-white" : "bg-transparent"
                      }`}
                    >
                      <span className="truncate">
                        {filters.category || "All categories"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </DropdownGroup>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full h-14 rounded-md text-base transition-all duration-200 transform"
              >
                Find Jobs
              </Button>
            </div>
          ) : (
            /* Desktop Search Layout - Clean Single Line */
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-2 py-2">
                <div className="flex items-center h-14">
                  {/* Search Input */}
                  <div className="flex items-center flex-1 pl-4 pr-2">
                    <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Job Title, Keywords, Company..."
                      className="w-full py-3 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-transparent text-base"
                    />
                  </div>

                  {/* Filter Dropdowns with Dividers */}
                  <div className="flex items-center">
                    <div className="h-8 w-px bg-gray-300 mx-1" />
                    <DropdownGroup>
                      <div className="w-36">
                        <Button
                          onClick={() => openIndustryModal()}
                          className={`h-14 px-4 flex items-center gap-2 w-full justify-between text-left border-none shadow-none rounded-none font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 ${
                            is_mobile ? "bg-white" : "bg-transparent"
                          }`}
                        >
                          <span className="truncate text-sm">
                            {filters.industry || "All industries"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                      <div className="h-8 w-px bg-gray-300 mx-1" />
                      <div className="w-44">
                        <Button
                          onClick={() => openCategoryModal()}
                          className={`h-14 px-4 flex items-center gap-2 w-full justify-between text-left border-none shadow-none rounded-none font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 ${
                            is_mobile ? "bg-white" : "bg-transparent"
                          }`}
                        >
                          <span className="text-sm whitespace-nowrap">
                            {filters.category || "All categories"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </Button>
                      </div>
                    </DropdownGroup>
                  </div>

                  {/* Search Button */}
                  <div className="pl-2 pr-2">
                    <Button onClick={handleSearch} size="md">
                      Find Jobs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Job Suggestions - Mobile specific layout */}
        {is_mobile && (
          <div className="w-full mt-8 px-2">
            <MobileJobScroller />
          </div>
        )}

        {/* Desktop Job Suggestions - Only show on desktop */}
        {!is_mobile && (
          <div className="w-full max-w-4xl mt-12">
            <div className="text-center">
              <h2 className="text-base font-semibold text-gray-700 tracking-wide">
                Trusted by the Biggest Philippine Companies.
              </h2>
            </div>
            <JobScroller />
          </div>
        )}
      </div>

      {/* Category Modal - Standardized Implementation */}
      <CategoryModal>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Category
            </h3>
          </div>

          <div className="overflow-y-auto overflow-x-hidden flex-1 space-y-4 max-h-[60vh]">
            {/* All Categories Option */}
            <button
              onClick={() => {
                closeCategoryModal();
                applyFilterAndGo("category", "All categories");
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 text-sm font-medium ${
                filters.category === "All categories"
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              All categories
            </button>

            {/* Tech Category Group */}
            <div className="space-y-2">
              <div className="px-2 py-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tech
                </h4>
              </div>
              {job_categories
                .filter((c) => c.class === "Tech")
                .map((option) => (
                  <button
                    key={option.class + option.name}
                    onClick={() => {
                      closeCategoryModal();
                      applyFilterAndGo("category", option.name);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ml-2 break-words ${
                      filters.category === option.name
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="block truncate">{option.name}</span>
                  </button>
                ))}
            </div>

            {/* Non-Tech Category Group */}
            <div className="space-y-2">
              <div className="px-2 py-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Non-Tech
                </h4>
              </div>
              {job_categories
                .filter((c) => c.class === "Non-Tech")
                .map((option) => (
                  <button
                    key={option.class + option.name}
                    onClick={() => {
                      closeCategoryModal();
                      applyFilterAndGo("category", option.name);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ml-2 break-words ${
                      filters.category === option.name
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="block truncate">{option.name}</span>
                  </button>
                ))}
            </div>

            {/* Specialized Category Group */}
            <div className="space-y-2">
              <div className="px-2 py-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Specialized
                </h4>
              </div>
              {job_categories
                .filter((c) => c.class === "Specialized")
                .map((option) => (
                  <button
                    key={option.class + option.name}
                    onClick={() => {
                      closeCategoryModal();
                      applyFilterAndGo("category", option.name);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ml-2 break-words ${
                      filters.category === option.name
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="block truncate">{option.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </CategoryModal>

      {/* Industry Modal - Standardized Implementation */}
      <IndustryModal>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              Select Industry
            </h3>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 max-h-[60vh]">
            {["All industries", ...industries.map((i: Industry) => i.name)].map(
              (industry_name) => {
                return (
                  <button
                    key={industry_name}
                    onClick={() => {
                      closeIndustryModal();
                      applyFilterAndGo("industry", industry_name);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 text-sm font-medium ${
                      filters.industry === industry_name
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {industry_name}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </IndustryModal>
    </>
  );
}
