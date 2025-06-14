"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  PhilippinePeso,
  Briefcase,
  ChevronDown,
  X,
  Building,
  Calendar,
  Users,
  Heart,
  CheckCircle,
  Clipboard,
  Wifi,
  Globe,
  Users2,
  AlertTriangle,
  User,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileButton from "@/components/student/profile-button";
import {
  useJobs,
  useSavedJobs,
  useProfile,
  useApplications,
} from "@/hooks/use-api";
import { useAuthContext } from "../authctx";
import { Application, Job } from "@/lib/db/db.types";
import Markdown from "react-markdown";
import { Paginator } from "@/components/ui/paginator";
import { useRefs, RefsAPI } from "@/lib/db/use-refs";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/student/dropdown";
import { useFilter } from "@/lib/filter";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refs = useRefs();
  const { is_authenticated } = useAuthContext();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { filters, set_filter, filter_setter } = useFilter<{
    job_type: string;
    location: string;
    industry: string;
    category: string;
  }>();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastApplication, setLastApplication] = useState<Partial<Application>>(
    {}
  );
  const [autoCloseProgress, setAutoCloseProgress] = useState(100);
  const { profile } = useProfile();
  const { get_college, get_level } = useRefs();

  // Check if screen width is <= 1024px
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!profile) return false;
    return !!(
      profile.full_name &&
      profile.phone_number &&
      get_college(profile.college)?.name &&
      get_level(profile.year_level)?.name
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

  const isFullyReadyToApply = () => {
    return isProfileComplete() && areJobRequirementsMet();
  };

  // API hooks
  const jobs_page_size = 10;
  const [jobs_page, setJobsPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const {
    getJobsPage,
    jobs: allJobs,
    loading: jobs_loading,
    error: jobs_error,
    refetch,
  } = useJobs({
    search: searchTerm.trim() || undefined,
    category: filters.category || undefined,
    type: filters.job_type !== "All types" ? filters.job_type : undefined,
    mode: filters.location !== "Any location" ? filters.location : undefined,
    industry:
      filters.industry !== "All industries" ? filters.industry : undefined,
  });

  useEffect(() => {
    setJobs(getJobsPage({ page: jobs_page, limit: jobs_page_size }));
  }, [jobs_page, jobs_loading]);

  const { is_saved, saving, save_job } = useSavedJobs();
  const { applications, appliedJob, apply } = useApplications();
  const getApplicationStatus = (jobId: string) => appliedJob(jobId);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (jobId && jobs.length > 0) {
      const targetJob = jobs.find((job) => job.id === jobId);
      if (targetJob) {
        setSelectedJob(targetJob);
      }
    } else if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, []);

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const category = searchParams.get("category");
    const jobType = searchParams.get("jobType");
    const location = searchParams.get("location");
    set_filter("category", category ?? "");
    set_filter("job_type", jobType ?? "");
    set_filter("location", location ?? "");
  }, [searchParams, jobs]);

  // Set first job as selected when jobs load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  // Reset progress when modal closes
  useEffect(() => {
    if (!showSuccessModal) {
      setAutoCloseProgress(100);
    }
  }, [showSuccessModal]);

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
    if (!is_authenticated()) {
      window.location.href = "/login";
      return;
    }

    console.log(applications.map((a) => a.job_id));
    console.log("id", selectedJob?.id);
    console.log(appliedJob(selectedJob?.id ?? ""));

    // Check if already applied
    const applicationStatus = appliedJob(selectedJob?.id ?? "");
    if (applicationStatus) {
      alert("You have already applied to this job!");
      return;
    }

    // Check if profile is complete
    if (!isProfileComplete()) {
      alert("Please complete your profile before applying.");
      router.push("/profile");
      return;
    }

    // Check if job requirements are met
    if (!areJobRequirementsMet()) {
      setShowApplicationModal(true);
      return;
    }

    // If everything is complete, apply directly
    handleDirectApplication();
  };

  const handleDirectApplication = async () => {
    if (!selectedJob) return;

    try {
      const application = await apply(selectedJob.id ?? "", {
        github_link: profile?.github_link || undefined,
        portfolio_link: profile?.portfolio_link || undefined,
      });

      // Store application details and show success modal
      setLastApplication(application.application || {});
      setShowSuccessModal(true);
      setAutoCloseProgress(100);

      // Progress countdown animation
      const interval = setInterval(() => {
        setAutoCloseProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setShowSuccessModal(false);
            return 0;
          }
          return prev - 2; // Decrease by 2% every 100ms (5 seconds total)
        });
      }, 100);
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Apply current search term along with active filters
      // The useJobs hook will automatically filter based on both search and filters
      // @ts-ignore
      e.currentTarget.blur();
      setJobsPage(1);
      setJobs(getJobsPage({ page: 1, limit: jobs_page_size }));
    }
  };

  const handleJobCardClick = (job: Job) => {
    setSelectedJob(job);
    if (isMobile) {
      setShowJobModal(true);
    }
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
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Top bar with logo and Profile button */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
              BetterInternship
            </h1>
          </Link>
          <ProfileButton />
        </div>

        {/* Desktop and Mobile Layout */}
        <div className="flex-1 flex overflow-hidden">
          {jobs_loading ? (
            /* Loading State */
            <div className="w-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            </div>
          ) : isMobile ? (
            /* Mobile Layout - Only Job Cards */
            <div className="w-full overflow-y-auto p-6">
              {/* Mobile Search Bar */}
              <div className="w-full mb-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search Job Listings"
                        className="w-full h-12 pl-12 pr-4 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 text-base"
                      />
                    </div>
                    <Button
                      onClick={() => setShowFilterModal(true)}
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
                    <MobileJobCard
                      key={job.id}
                      job={job}
                      onClick={() => handleJobCardClick(job)}
                      refs={refs}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="p-4">No jobs found.</p>
                </div>
              )}

              {/* Mobile Paginator */}
              <Paginator
                totalItems={allJobs.length}
                itemsPerPage={jobs_page_size}
                onPageChange={(page) => setJobsPage(page)}
              />
            </div>
          ) : (
            /* Desktop Layout - Split View */
            <>
              {/* Job List */}
              <div className="w-1/3 border-r overflow-y-auto p-6">
                {/* Desktop Search Bar */}
                <div className="w-full max-w-4xl mx-auto mb-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Search Job Listings"
                          className="w-full h-12 pl-12 pr-4 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 text-base"
                        />
                      </div>
                      <Button
                        onClick={() => setShowFilterModal(true)}
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
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => handleJobCardClick(job)}
                        refs={refs}
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
                  totalItems={allJobs.length}
                  itemsPerPage={jobs_page_size}
                  onPageChange={(page) => setJobsPage(page)}
                />
              </div>

              {/* Job Details */}
              <div className="w-2/3 flex flex-col overflow-hidden">
                {selectedJob && (
                  <JobDetails
                    job={selectedJob}
                    saving={saving}
                    onApply={handleApply}
                    onSave={handleSave}
                    isSaved={is_saved(selectedJob.id ?? "")}
                    applicationStatus={getApplicationStatus(
                      selectedJob.id ?? ""
                    )}
                    refs={refs}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Job Details Modal */}
      <AnimatePresence>
        {showJobModal && selectedJob && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-t-2xl w-full h-[90vh] shadow-2xl overflow-hidden flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowJobModal(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              {/* Modal Content - Job Details */}
              <div className="flex-1 overflow-y-auto">
                <JobDetails
                  job={selectedJob}
                  saving={saving}
                  onApply={handleApply}
                  onSave={handleSave}
                  isSaved={is_saved(selectedJob.id ?? "")}
                  applicationStatus={getApplicationStatus(selectedJob.id ?? "")}
                  refs={refs}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Modal - Only for Missing Job Requirements */}
      <AnimatePresence>
        {showApplicationModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg w-11/12 max-w-md p-6"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Apply to {selectedJob?.title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApplicationModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
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
                  setShowApplicationModal(false);
                  router.push("/profile");
                }}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-11/12 max-w-md mx-4 shadow-2xl overflow-hidden"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
              <div className="flex justify-between items-center p-6 pb-0">
                <div></div>
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowSuccessModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </motion.button>
              </div>

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
                    <span className="font-semibold text-gray-800">
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
                    <p className="text-sm text-blue-800">
                      💼 Check{" "}
                      <span className="font-semibold">My Applications</span> to
                      keep track of all your submissions and updates.
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
                      setShowSuccessModal(false);
                      router.push("/applications");
                    }}
                  >
                    <Clipboard className="w-4 h-4 mr-2" />
                    View My Applications
                  </Button>
                </motion.div>

                {/* Auto-dismiss indicator with progress bar */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <div className="text-xs text-gray-400 mb-2">
                    Auto-closing in {Math.ceil(autoCloseProgress / 20)} seconds
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <motion.div
                      className="bg-blue-600 h-1 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${autoCloseProgress}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Filter Jobs
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterModal(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              <div className="space-y-6">
                <DropdownGroup>
                  <div className="relative border-2 p-2 rounded-md hover:bg-slate-100 duration-100">
                    <GroupableRadioDropdown
                      name="jobType"
                      options={[
                        "All types",
                        "Internships",
                        "Full-time",
                        "Part-time",
                      ]}
                      on_change={filter_setter("job_type")}
                      default_value={filters.job_type}
                    />
                  </div>

                  <div className="relative border-2 p-2 rounded-md hover:bg-slate-100 duration-100">
                    <GroupableRadioDropdown
                      name="location"
                      options={[
                        "Any location",
                        "In-Person",
                        "Remote",
                        "Hybrid",
                      ]}
                      on_change={filter_setter("location")}
                      default_value={filters.location}
                    />
                  </div>

                  <div className="relative border-2 p-2 rounded-md hover:bg-slate-100 duration-100">
                    <GroupableRadioDropdown
                      name="category"
                      options={[
                        "All industries",
                        "Technology",
                        "Creative Services",
                        "Consumer Goods",
                      ]}
                      on_change={filter_setter("industry")}
                      default_value={filters.industry}
                    />
                  </div>
                </DropdownGroup>

                <div className="flex gap-3 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Clear temp filters but keep search term
                      set_filter("job_type", "All types");
                      set_filter("job_type", "Any location");
                      set_filter("job_type", "All industries");
                    }}
                    className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => {
                      setShowFilterModal(false);
                      // Search term is already active in the useJobs hook
                    }}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getModeIcon(mode: number | null | undefined) {
  if (!mode && mode !== 0) return <Briefcase className="w-3 h-3 mr-1" />;

  switch (mode) {
    case 0:
      return <Users2 className="w-3 h-3 mr-1" />;
    case 1:
      return <Globe className="w-3 h-3 mr-1" />;
    case 2:
      return <Wifi className="w-3 h-3 mr-1" />;
  }

  return <Briefcase className="w-3 h-3 mr-1" />;
}

function MobileJobCard({
  job,
  onClick,
  refs,
}: {
  job: Job;
  onClick: () => void;
  refs: RefsAPI;
}) {
  const { ref_loading, get_job_mode, get_job_type } = refs;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 text-base leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>{job.employer?.name}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 ml-2">
          {formatDate(job.created_at ?? "")}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {!ref_loading && job.type !== null && job.type !== undefined && (
          <Badge variant="outline" className="text-xs">
            {get_job_type(job.type)?.name}
          </Badge>
        )}
        {!ref_loading && job.salary && (
          <Badge variant="outline" className="text-xs">
            <PhilippinePeso className="w-3 h-3 mr-1" />
            {job.salary}
          </Badge>
        )}
        {!ref_loading && job.mode !== null && job.mode !== undefined && (
          <Badge variant="outline" className="text-xs">
            {getModeIcon(job.mode)}
            {get_job_mode(job.mode)?.name}
          </Badge>
        )}
      </div>

      {/* Description Preview */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MapPin className="w-3 h-3" />
        <span>{job.location}</span>
      </div>
    </div>
  );
}

function JobCard({
  job,
  isSelected,
  onClick,
  refs,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
  refs: RefsAPI;
}) {
  const { ref_loading, get_job_mode, get_job_type } = refs;
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{job.employer?.name}</p>

      <div className="flex flex-wrap gap-2 mb-2">
        {!ref_loading ? (
          job.type && (
            <Badge variant="outline" className="text-xs">
              {get_job_type(job.type)?.name}
            </Badge>
          )
        ) : (
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs" />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!ref_loading && job.salary && (
          <Badge variant="outline" className="text-xs">
            <PhilippinePeso className="w-3 h-3 mr-1" />
            {job.salary}
          </Badge>
        )}
        {!ref_loading && job.mode !== null && job.mode !== undefined && (
          <Badge variant="outline" className="text-xs">
            {getModeIcon(job.mode)}
            {get_job_mode(job.mode)?.name}
          </Badge>
        )}
      </div>
    </div>
  );
}

function getModeIconForDetails(mode: number | null | undefined) {
  if (!mode && mode !== 0)
    return <Briefcase className="w-4 h-4 text-gray-500" />;

  switch (mode) {
    case 0:
      return <Users2 className="w-3 h-3 mr-1" />;
    case 1:
      return <Globe className="w-3 h-3 mr-1" />;
    case 2:
      return <Wifi className="w-3 h-3 mr-1" />;
  }

  return <Briefcase className="w-4 h-4 text-gray-500" />;
}

function JobDetails({
  job,
  onApply,
  onSave,
  isSaved,
  saving,
  applicationStatus,
  refs,
}: {
  job: Job;
  onApply: () => void;
  onSave: (job: Job) => void;
  saving: boolean;
  isSaved: boolean;
  applicationStatus?: any;
  refs: RefsAPI;
}) {
  const { get_job_type } = refs;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h1>
        <div className="flex items-center gap-2 mb-2">
          <Building className="w-4 h-4 text-gray-500" />
          <p className="text-gray-600">{job.employer?.name}</p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-500">
            Listed on {formatDate(job.created_at ?? "")}
          </p>
        </div>

        <div className="flex gap-3">
          {applicationStatus ? (
            <Button disabled className="bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Applied ({applicationStatus.status})
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onApply}>
              Apply
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => onSave(job)}
            className={isSaved ? "bg-red-50 border-red-200 text-red-600" : ""}
          >
            {isSaved ? (
              <>
                <Heart></Heart>
                <span>Saved</span>
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Job Details</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="font-medium text-sm">Location: {job.location}</p>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getModeIconForDetails(job.mode)}
            <div>
              <p className="text-sm">
                <span className="font-medium">Mode: </span>
                <span className="opacity-80">
                  {job.mode || "Not specified"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PhilippinePeso className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Salary: </span>
                <span className="opacity-80">
                  {job.salary || "Not specified"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Employment Type: </span>
                <span className="opacity-80">
                  {job.type || job.type === 0
                    ? get_job_type(job.type)?.name
                    : "Not specified"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
        <Markdown>{job.description}</Markdown>

        {(job.requirements?.length ?? 0) > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              {job.requirements?.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </>
        )}

        {(job.responsibilities?.length ?? 0) > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.responsibilities?.map((resp: string, index: number) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </>
        )}

        {job.employer?.description && (
          <>
            <h3 className="text-lg font-semibold mb-3 mt-6">
              About the Company
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {job.employer.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
