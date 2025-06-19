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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useSavedJobs,
  useProfile,
  useApplications,
  useJob,
} from "@/hooks/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { useModal } from "@/hooks/use-modal";
import { JobDetails } from "@/components/shared/jobs";
import { cn } from "@/lib/utils";

/**
 * The individual job page.
 * Allows viewing unlisted jobs.
 */
export default function JobPage() {
  const router = useRouter();
  const params = useParams();
  const { job_id } = params;
  const { job, loading, error, refetch } = useJob(job_id as string);
  const { is_authenticated } = useAuthContext();
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
  const { profile } = useProfile();
  const { ref_is_not_null } = useRefs();
  const { is_saved, saving, save_job } = useSavedJobs();
  const { appliedJob, apply } = useApplications();

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
    if (!isProfileComplete()) {
      alert("Please complete your profile before applying.");
      router.push("/profile");
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
          <div className="w-full flex flex-col overflow-hidden">
            {job?.id ? (
              <div className="w-1/2 min-w-[600px] max-w-[800px] m-auto h-full border-x border-opacity-50">
                <JobDetails
                  job={job}
                  actions={[
                    <Button
                      disabled={appliedJob(job.id ?? "")}
                      onClick={() => !appliedJob(job.id ?? "") && handleApply()}
                      className={cn(
                        appliedJob(job.id ?? "")
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {appliedJob(job.id ?? "") && (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {appliedJob(job.id ?? "") ? "Applied" : "Apply"}
                    </Button>,
                    <Button
                      variant="outline"
                      onClick={() => handleSave(job)}
                      className={cn(
                        is_saved(job.id ?? "")
                          ? "bg-red-50 border-red-200 text-red-600"
                          : ""
                      )}
                    >
                      {is_saved(job.id ?? "") && <Heart />}
                      {is_saved(job.id ?? "")
                        ? "Saved"
                        : saving
                        ? "Saving..."
                        : "Save"}
                    </Button>,
                  ]}
                />
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
    </>
  );
}
