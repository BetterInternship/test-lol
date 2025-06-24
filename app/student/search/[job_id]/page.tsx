"use client";

import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  CheckCircle,
  Clipboard,
  AlertTriangle,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useSavedJobs,
  useProfile,
  useApplications,
  useJob,
} from "@/lib/api/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { useMoa } from "@/lib/db/use-moa";
import {
  user_can_apply,
  get_missing_profile_fields,
} from "@/lib/utils/user-utils";
import {
  areApplicationsEnabled,
  getMaintenanceTitle,
  getMaintenanceMessage,
  getMaintenanceSubMessage,
  getAvailableActions,
} from "@/lib/config/application-config";

/**
 * The individual job page.
 * Allows viewing unlisted jobs.
 */
export default function JobPage() {
  const router = useRouter();
  const params = useParams();
  const { job_id } = params;
  const { job, loading, error, refetch } = useJob(job_id as string);
  const { is_authenticated, user } = useAuthContext();
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
    open: open_incomplete_profile_modal,
    close: close_incomplete_profile_modal,
    Modal: IncompleteProfileModal,
  } = useModal("incomplete-profile-modal");
  const {
    open: open_maintenance_modal,
    close: close_maintenance_modal,
    Modal: MaintenanceModal,
  } = useModal("maintenance-modal");
  const { check } = useMoa();
  const { profile } = useProfile();
  const { universities, to_job_pay_freq_name } = useRefs();
  const { is_saved, saving, save_job } = useSavedJobs();
  const { appliedJob, apply } = useApplications();

  // Check if job-specific requirements are met
  const areJobRequirementsMet = () => {
    if (!job || !profile) return false;
    return true;
  };

  const getMissingJobRequirements = () => {
    if (!job || !profile) return [];
    return [];
  };

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
    // Check maintenance mode first, passing user email for bypass check
    if (!areApplicationsEnabled(user?.email)) {
      open_maintenance_modal();
      return;
    }

    if (!is_authenticated()) {
      window.location.href = "/login";
      return;
    }

    // Check if already applied
    const applicationStatus = appliedJob(job?.id ?? "");
    if (applicationStatus) {
      alert("You have already applied to this job!");
      return;
    }

    // Check if profile is complete
    if (!user_can_apply(profile)) {
      open_incomplete_profile_modal();
      return;
    }

    // Check if job requirements are met
    if (!areJobRequirementsMet()) {
      open_application_modal();
      return;
    }

    // If everything is complete, apply directly
    handleDirectApplication();
  };

  const handleDirectApplication = async () => {
    if (!job) return;

    try {
      const { success } = await apply(job.id ?? "");
      if (success) open_success_modal();
      else alert("Could not apply to job.");
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
    }
  };

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load job: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop and Mobile Layout */}
      <div className="flex-1 flex overflow-hidden max-h-full">
        {loading ? (
          /* Loading State */
          <div className="w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job details...</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col h-full bg-gray-50">
            {/* Enhanced Header with Back Navigation */}
            <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Applications
                  </Button>

                  {job && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleSave(job)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
                          is_saved(job.id ?? "")
                            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4",
                            is_saved(job.id ?? "") ? "fill-current" : ""
                          )}
                        />
                        {is_saved(job.id ?? "")
                          ? "Saved"
                          : saving
                          ? "Saving..."
                          : "Save"}
                      </Button>

                      <Button
                        disabled={appliedJob(job.id ?? "")}
                        onClick={() =>
                          !appliedJob(job.id ?? "") && handleApply()
                        }
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all",
                          appliedJob(job.id ?? "")
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                        )}
                      >
                        {appliedJob(job.id ?? "") && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {appliedJob(job.id ?? "") ? "Applied" : "Apply Now"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {job?.id ? (
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-8">
                  {/* Job Header Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                          {job.title}
                        </h1>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-lg text-gray-700 font-medium">
                            {job.employer?.name}
                          </p>
                        </div>
                        <p className="text-gray-500 text-sm">
                          Listed on{" "}
                          {job.created_at
                            ? new Date(job.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Location</span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {job.location || "Not specified"}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Mode</span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {job.mode !== null && job.mode !== undefined
                            ? job.mode === 0
                              ? "Face to Face"
                              : job.mode === 1
                              ? "Remote"
                              : "Hybrid"
                            : "Not specified"}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Salary</span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {job.salary
                            ? `₱${job.salary}/${to_job_pay_freq_name(
                                job.salary_freq
                              )}`
                            : "None"}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Type</span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {job.type !== null && job.type !== undefined
                            ? job.type === 0
                              ? "Internship"
                              : job.type === 1
                              ? "Full-time"
                              : "Part-time"
                            : "Not specified"}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">
                            Partnership
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {check(
                            job.employer?.id ?? "",
                            universities[0]?.id
                          ) ? (
                            <span className="inline-flex items-center text-green-700 font-medium">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              DLSU MOA
                            </span>
                          ) : (
                            "No MOA"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-8">
                    {/* Job Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        Description
                      </h2>
                      <div className="prose max-w-none text-gray-700 leading-relaxed">
                        <div className="whitespace-pre-wrap text-base leading-7">
                          {job.description || "No description provided."}
                        </div>
                      </div>
                    </div>

                    {/* Job Requirements */}
                    {job.requirements && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                          Requirements
                        </h2>
                        <div className="prose max-w-none text-gray-700 leading-relaxed">
                          <div className="whitespace-pre-wrap text-base leading-7">
                            {job.requirements}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Spacing */}
                  <div className="h-16"></div>
                </div>
              </div>
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
                  <div className="w-prose text-center  text-red-500  rounded-md p-4 my-4">
                    This job does not exist.
                  </div>
                  <Button
                    variant="outline"
                    className="input-box"
                    onClick={() => router.push("/search")}
                  >
                    Look for Other Jobs
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application Modal - Only for Missing Job Requirements */}
      <ApplicationModal>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Apply to {job?.title}</h2>
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
                {job?.title}
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

      {/* Incomplete Profile Modal */}
      <IncompleteProfileModal>
        <div className="p-6">
          {(() => {
            const { missing, labels } = get_missing_profile_fields(profile);
            const missingCount = missing.length;

            return (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Complete Your Profile
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    You need to complete your profile before applying to jobs.
                    {missingCount === 1
                      ? "There is 1 required field missing."
                      : `There are ${missingCount} required fields missing.`}
                  </p>
                </div>

                {/* Missing Fields List */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Missing Information
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {missing.map((field) => (
                      <div
                        key={field}
                        className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                        <span className="text-sm font-medium text-orange-800">
                          {labels[field]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => close_incomplete_profile_modal()}
                    className="flex-1 h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      close_incomplete_profile_modal();
                      router.push("/profile");
                    }}
                    className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Complete Profile
                    </div>
                  </Button>
                </div>
              </>
            );
          })()}
        </div>
      </IncompleteProfileModal>

      {/* Maintenance Mode Modal */}
      <MaintenanceModal>
        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 text-blue-600">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {getMaintenanceTitle()}
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                {getMaintenanceMessage()}
              </p>
            </div>

            {/* Actions List */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {getMaintenanceSubMessage()}
              </h3>

              <div className="space-y-3">
                {getAvailableActions().map((action, index) => {
                  const getIcon = (iconName: string) => {
                    switch (iconName) {
                      case "heart":
                        return <Heart className="w-5 h-5" />;
                      case "user":
                        return <User className="w-5 h-5" />;
                      case "search":
                        return (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        );
                      case "calendar":
                        return (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        );
                      default:
                        return (
                          <div className="w-5 h-5 bg-blue-500 rounded-full" />
                        );
                    }
                  };

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        {getIcon(action.icon)}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {action.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Action Button - Always Visible */}
          <div className="flex-shrink-0 p-6 pt-0 border-t border-gray-100 bg-white">
            <div className="flex justify-center">
              <Button
                onClick={() => close_maintenance_modal()}
                className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Got it, thanks!
              </Button>
            </div>
          </div>
        </div>
      </MaintenanceModal>
    </>
  );
}
