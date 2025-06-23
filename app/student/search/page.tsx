"use client";

import React from "react";
import type { ChangeEvent } from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  CheckCircle,
  Clipboard,
  AlertTriangle,
  User,
  Filter,
  X,
  Building,
  MapPin,
  Monitor,
  PhilippinePeso,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useJobs,
  useSavedJobs,
  useProfile,
  useApplications,
} from "@/lib/api/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { UserApplication, Job } from "@/lib/db/db.types";
import { Paginator } from "@/components/ui/paginator";
import { useRefs } from "@/lib/db/use-refs";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/ui/dropdown";
import { useFilter } from "@/lib/filter";
import { useAppContext } from "@/lib/ctx-app";
import { useModal } from "@/hooks/use-modal";
import { JobCard, JobDetails, MobileJobCard } from "@/components/shared/jobs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { industriesOptions, allCategories } from "@/lib/utils/job-options";

// Utility function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { is_authenticated } = useAuthContext();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [showCoverLetterInput, setShowCoverLetterInput] = useState(false);

  // Initialize filters with URL synchronization and proper defaults
  const { filters, set_filter, filter_setter, clear_filters } = useFilter<{
    job_type: string;
    location: string;
    industry: string;
    category: string;
  }>(
    {
      job_type: searchParams.get("jobType") || "All types",
      location: searchParams.get("location") || "Any location",
      industry: searchParams.get("industry") || "All industries",
      category: searchParams.get("category") || "All categories",
    },
    true
  ); // Enable URL synchronization

  const {
    open: open_application_modal,
    close: close_application_modal,
    Modal: ApplicationModal,
  } = useModal("application-modal");
  const {
    open: open_success_modal,
    close: close_success_modal,
    Modal: SuccessModal,
  } = useModal("success-modal");
  const {
    open: open_filter_modal,
    close: close_filter_modal,
    Modal: FilterModal,
  } = useModal("filter-modal");
  const {
    open: open_job_modal,
    close: close_job_modal,
    Modal: JobModal,
  } = useModal("job-modal", { showCloseButton: false });
  const {
    open: open_application_confirmation_modal,
    close: close_application_confirmation_modal,
    Modal: ApplicationConfirmationModal,
  } = useModal("application-confirmation-modal");
  const {
    open: open_profile_preview_modal,
    close: close_profile_preview_modal,
    Modal: ProfilePreviewModal,
  } = useModal("profile-preview-modal");

  const { is_mobile } = useAppContext();
  const { profile } = useProfile();
  const {
    ref_is_not_null,
    to_job_mode_name,
    to_job_type_name,
    to_job_pay_freq_name,
  } = useRefs();

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!profile) return false;
    return !!(
      profile.full_name &&
      profile.phone_number &&
      ref_is_not_null(profile.college) &&
      ref_is_not_null(profile.year_level)
    );
  };

  // Check if job-specific requirements are met
  const areJobRequirementsMet = () => {
    if (!selectedJob || !profile) return false;
    return true;
  };

  const getMissingJobRequirements = () => {
    if (!selectedJob || !profile) return [];
    return [];
  };

  // API hooks with dynamic filtering based on current filter state
  const jobs_page_size = 10;
  const [jobs_page, setJobsPage] = useState(1);
  const {
    getJobsPage,
    jobs: filteredJobs,
    allJobs,
    loading: jobs_loading,
    error: jobs_error,
    refetch,
  } = useJobs({
    search: searchTerm.trim() || undefined,
    category: filters.category,
    type: filters.job_type,
    mode: filters.location,
    industry: filters.industry,
  });

  // Get paginated jobs directly from getJobsPage
  const jobs = getJobsPage({ page: jobs_page, limit: jobs_page_size });

  const { is_saved, saving, save_job } = useSavedJobs();
  const { appliedJob, apply } = useApplications();

  // Initialize search term from URL
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchTerm(query);
  }, [searchParams]);

  // Reset to page 1 when filters or search term change
  useEffect(() => {
    setJobsPage(1);
  }, [
    searchTerm,
    filters.job_type,
    filters.location,
    filters.industry,
    filters.category,
  ]);

  // Set first job as selected when jobs load
  useEffect(() => {
    const jobId = searchParams.get("jobId");

    if (jobId && jobs.length > 0) {
      const targetJob = jobs.find((job) => job.id === jobId);
      if (targetJob && targetJob.id !== selectedJob?.id) {
        setSelectedJob(targetJob);
      }
    } else if (jobs.length > 0 && !selectedJob?.id) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs.length, searchParams]);

  const handleSave = async (job: Job) => {
    if (!is_authenticated()) {
      window.location.href = "/login";
      return;
    }

    try {
      await save_job(job.id ?? "");
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleApply = () => {
    console.log("handleApply called");

    if (!is_authenticated()) {
      console.log("Not authenticated, redirecting to login");
      window.location.href = "/login";
      return;
    }

    // Check if already applied
    const applicationStatus = appliedJob(selectedJob?.id ?? "");
    if (applicationStatus) {
      console.log("Already applied to this job");
      alert("You have already applied to this job!");
      return;
    }

    // Check if profile is complete
    const profileComplete = isProfileComplete();
    console.log("Profile complete:", profileComplete);
    console.log("Profile:", profile);

    if (!profileComplete) {
      console.log("Profile not complete, redirecting to profile page");
      alert("Please complete your profile before applying.");
      router.push("/profile");
      return;
    }

    // If profile is complete, show confirmation modal
    console.log("Opening application confirmation modal");
    open_application_confirmation_modal();
  };

  const handleDirectApplication = async () => {
    if (!selectedJob) return;

    try {
      const { success } = await apply(selectedJob.id ?? "");
      if (success) open_success_modal();
      else alert("Could not apply to job.");
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Reset to page 1 and trigger re-filter with current search term
      setJobsPage(1);
      // The useJobs hook will automatically re-filter based on the searchTerm
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setJobsPage(1); // Reset to first page when search changes
  };

  const handleJobCardClick = (job: Job) => {
    setSelectedJob(job);
    if (is_mobile) open_job_modal();
  };

  if (jobs_error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load jobs: {jobs_error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop and Mobile Layout */}
      <div className="flex-1 flex overflow-hidden max-h-full">
        {jobs_loading ? (
          <div className="w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : is_mobile ? (
          <div className="w-full flex flex-col h-full">
            {/* Fixed Mobile Search Bar */}
            <div className="bg-white border-b border-gray-100 p-6 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 p-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search Job Listings"
                      className="w-full h-12 pl-12 pr-4 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 text-base"
                    />
                  </div>
                  <Button
                    onClick={() => open_filter_modal()}
                    className="h-12 w-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                    size="icon"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable Job Cards Area */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              {jobs.length ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <MobileJobCard
                      key={job.id}
                      job={job}
                      on_click={() => handleJobCardClick(job)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="p-4">No jobs found.</p>
                </div>
              )}

              {/* Mobile Paginator */}
              <div className="mt-6">
                <Paginator
                  totalItems={filteredJobs.length}
                  itemsPerPage={jobs_page_size}
                  onPageChange={(page) => setJobsPage(page)}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout - Split View */
          <>
            {/* Job List */}
            <div className="w-1/3 border-r overflow-x-hidden overflow-y-auto p-6">
              {/* Desktop Search Bar */}
              <div className="w-full max-w-4xl mx-auto mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-2">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search Job Listings"
                        className="w-full h-12 pl-12 pr-4 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 text-base"
                      />
                    </div>
                    <Button
                      onClick={() => open_filter_modal()}
                      className="h-12 w-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                      size="icon"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {jobs.length ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      selected={selectedJob?.id === job.id}
                      on_click={() => handleJobCardClick(job)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="p-4">No jobs found.</p>
                </div>
              )}

              {/* Desktop Paginator */}
              <Paginator
                totalItems={filteredJobs.length}
                itemsPerPage={jobs_page_size}
                onPageChange={(page) => setJobsPage(page)}
              />
            </div>

            {/* Job Details */}
            <div className="w-2/3 flex flex-col overflow-hidden">
              {selectedJob?.id ? (
                <JobDetails
                  job={selectedJob}
                  actions={[
                    <Button
                      key="1"
                      disabled={appliedJob(selectedJob.id ?? "")}
                      onClick={handleApply}
                      className={cn(
                        appliedJob(selectedJob.id ?? "")
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {appliedJob(selectedJob.id ?? "") && (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {appliedJob(selectedJob.id ?? "") ? "Applied" : "Apply"}
                    </Button>,
                    <Button
                      key="2"
                      variant="outline"
                      onClick={() => handleSave(selectedJob)}
                      className={cn(
                        is_saved(selectedJob.id ?? "")
                          ? "bg-red-50 border-red-200 text-red-600"
                          : ""
                      )}
                    >
                      {is_saved(selectedJob.id ?? "") && <Heart />}
                      {is_saved(selectedJob.id ?? "")
                        ? "Saved"
                        : saving
                        ? "Saving..."
                        : "Save"}
                    </Button>,
                  ]}
                />
              ) : (
                <div className="h-full m-auto">
                  <div className="flex flex-col items-center pt-[25vh] h-screen">
                    <div className="opacity-35 mb-10">
                      <div className="flex flex-row justify-center w-full">
                        <h1 className="block text-6xl font-heading font-bold ">
                          BetterInternship
                        </h1>
                      </div>
                      <br />
                      <div className="flex flex-row justify-center w-full">
                        <p className="block text-2xl">
                          Better Internships Start Here
                        </p>
                      </div>
                    </div>
                    <div className="w-prose text-center border border-blue-500 border-opacity-50 text-blue-500 shadow-sm rounded-md p-4 bg-white">
                      Click on a job listing to view more details!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Job Details Modal */}
      <JobModal>
        <div className="h-full flex flex-col bg-white overflow-hidden">
          {/* Fixed Header with Close Button */}
          <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => close_job_modal()}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Fixed Job Header - Non-scrollable */}
          {selectedJob && (
            <div className="p-4 bg-white flex-shrink-0 border-b">
              <h1 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {selectedJob.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-sm">
                  {selectedJob.employer?.name}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Listed on {formatDate(selectedJob.created_at ?? "")}
              </p>
            </div>
          )}

          {/* Scrollable Content Area - Takes remaining space with improved mobile scrolling */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 scroll-smooth webkit-overflow-scrolling-touch">
            {selectedJob && (
              <div className="p-4 pb-8">
                {/* Mobile Job Details Grid */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Location: </span>
                          <span className="opacity-80">
                            {selectedJob.location || "Not specified"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Monitor className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Mode: </span>
                          <span className="opacity-80">
                            {to_job_mode_name(selectedJob.mode)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Salary: </span>
                          <span className="opacity-80">
                            {!selectedJob.allowance && selectedJob.salary
                              ? `${selectedJob.salary}/${to_job_pay_freq_name(
                                  selectedJob.salary_freq
                                )}`
                              : "None"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Work Schedule: </span>
                          <span className="opacity-80">
                            {to_job_type_name(selectedJob.type)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Description</h2>
                  <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed">
                    <ReactMarkdown>{selectedJob.description}</ReactMarkdown>
                  </div>
                </div>

                {/* Job Requirements */}
                {selectedJob.requirements && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                    <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed">
                      <ReactMarkdown>{selectedJob.requirements}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Bottom padding for scroll area - Enhanced for mobile */}
                <div className="pb-8"></div>
              </div>
            )}
          </div>

          {/* Fixed Action Buttons at Bottom - Always Visible */}
          <div className="bg-white border-t p-4 flex-shrink-0 safe-area-bottom mb-4">
            <div className="flex gap-3">
              <Button
                disabled={appliedJob(selectedJob?.id ?? "")}
                onClick={handleApply}
                className={cn(
                  "flex-1 h-12 font-semibold rounded-xl transition-all duration-200",
                  appliedJob(selectedJob?.id ?? "")
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                {appliedJob(selectedJob?.id ?? "") && (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {appliedJob(selectedJob?.id ?? "") ? "Applied" : "Apply Now"}
              </Button>

              <Button
                variant="outline"
                onClick={() => selectedJob && handleSave(selectedJob)}
                className={cn(
                  "h-12 w-12 rounded-xl border-2 transition-all duration-200",
                  is_saved(selectedJob?.id ?? "")
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    is_saved(selectedJob?.id ?? "") ? "fill-current" : ""
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </JobModal>

      {/* Application Modal - Only for Missing Job Requirements */}
      <ApplicationModal>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Apply to {selectedJob?.title}</h2>
        </div>

        {/* Missing Job Requirements Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-800 mb-2">
                Missing Job Requirements
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                This job requires additional profile information:
              </p>
              <ul className="text-sm text-orange-700 list-disc list-inside mb-4">
                {getMissingJobRequirements().map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Update Profile Button */}
        <Button
          onClick={() => {
            close_application_modal();
            router.push("/profile");
          }}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
        >
          <User className="w-4 h-4 mr-2" />
          Update Profile
        </Button>
      </ApplicationModal>

      {/* Success Modal */}
      <SuccessModal>
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 pb-0"></div>

        {/* Content */}
        <div className="px-6 pb-8 text-center">
          {/* Success Animation */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                type: "spring",
                bounce: 0.5,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Application Sent!
            </motion.h2>

            <motion.p
              className="text-gray-600 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Your application for{" "}
              <span className="font-semibold max-w-prose text-gray-800">
                {selectedJob?.title}
              </span>{" "}
              has been successfully submitted.
            </motion.p>

            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <p className="text-sm text-blue-800 max-w-prose">
                💼 Check <span className="font-semibold">My Applications</span>{" "}
                to keep track of all your submissions and updates.
              </p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              onClick={() => {
                close_success_modal();
                router.push("/applications");
              }}
            >
              <Clipboard className="w-4 h-4 mr-2" />
              View My Applications
            </Button>
          </motion.div>
        </div>
      </SuccessModal>

      {/* Filter Modal */}
      <FilterModal>
        <div className="space-y-6 py-4 px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Filter Jobs</h2>
          </div>
          <DropdownGroup>
            <GroupableRadioDropdown
              name="jobType"
              options={["All types", "Internships", "Full-time", "Part-time"]}
              on_change={filter_setter("job_type")}
              default_value={filters.job_type}
            />
            <GroupableRadioDropdown
              name="location"
              options={["Any location", "In-Person", "Remote", "Hybrid"]}
              on_change={filter_setter("location")}
              default_value={filters.location}
            />
            <GroupableRadioDropdown
              name="industry"
              options={industriesOptions.map((industry) =>
                industry === "All Industries" ? "All industries" : industry
              )}
              on_change={filter_setter("industry")}
              default_value={filters.industry}
            />
            <GroupableRadioDropdown
              name="category"
              options={allCategories}
              on_change={filter_setter("category")}
              default_value={filters.category}
            />
          </DropdownGroup>

          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                clear_filters({
                  job_type: "All types",
                  location: "Any location",
                  industry: "All industries",
                  category: "All categories",
                });
              }}
              className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200"
            >
              Clear Filters
            </Button>
            <Button
              onClick={() => close_filter_modal()}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </FilterModal>

      {/* Application Confirmation Modal - Redesigned */}
      <ApplicationConfirmationModal>
        <div className="max-w-lg mx-auto p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Clipboard className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Apply?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You're applying for{" "}
              <span className="font-semibold text-gray-900">
                {selectedJob?.title}
              </span>
              {selectedJob?.employer?.name && (
                <>
                  {" "}
                  at{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedJob.employer.name}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Job Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 text-lg truncate">
                  {selectedJob?.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {selectedJob?.employer?.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob?.location && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/70 rounded-lg text-xs font-medium text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {selectedJob.location}
                    </span>
                  )}
                  {selectedJob?.mode !== undefined && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/70 rounded-lg text-xs font-medium text-gray-600">
                      <Monitor className="w-3 h-3" />
                      {to_job_mode_name(selectedJob.mode)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Preview Section */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                close_application_confirmation_modal();
                open_profile_preview_modal();
              }}
              className="w-full h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium group transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span>Preview Your Profile</span>
              </div>
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              See how employers will view your application
            </p>
          </div>

          {/* Cover Letter Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clipboard className="w-4 h-4 text-amber-600" />
                </div>
                <label
                  htmlFor="add-cover-letter"
                  className="font-medium text-gray-900"
                >
                  Cover Letter
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-cover-letter"
                  checked={showCoverLetterInput}
                  onChange={(e) => {
                    setShowCoverLetterInput(e.target.checked);
                    if (!e.target.checked) {
                      setCoverLetter("");
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-500">Optional</span>
              </div>
            </div>

            {showCoverLetterInput && (
              <div className="space-y-3">
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Dear Hiring Manager,

I am excited to apply for this position because...

Best regards,
[Your name]"
                  className="w-full h-20 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm overflow-y-auto"
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    💡 <span>Mention specific skills and enthusiasm</span>
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      coverLetter.length > 450
                        ? "text-red-500"
                        : "text-gray-500"
                    )}
                  >
                    {coverLetter.length}/500
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                close_application_confirmation_modal();
                setCoverLetter("");
                setShowCoverLetterInput(false);
              }}
              className="flex-1 h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                close_application_confirmation_modal();
                handleDirectApplication();
                setCoverLetter("");
                setShowCoverLetterInput(false);
              }}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Submit Application
              </div>
            </Button>
          </div>
        </div>
      </ApplicationConfirmationModal>

      {/* Profile Preview Modal */}
      <ProfilePreviewModal>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Profile Preview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                close_profile_preview_modal();
                open_application_confirmation_modal();
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          {profile && (
            <ApplicantModalContent
              applicant={profile as any}
              open_resume_modal={() => {}} // Optional: Add resume preview functionality
            />
          )}

          <div className="mt-6">
            <Button
              onClick={() => {
                close_profile_preview_modal();
                open_application_confirmation_modal();
              }}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Back to Application
            </Button>
          </div>
        </div>
      </ProfilePreviewModal>
    </>
  );
}
