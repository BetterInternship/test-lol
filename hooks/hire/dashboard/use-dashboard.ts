// Main dashboard orchestration hook - composes all the focused hooks
// This is what the dashboard component uses to get everything it needs
// Think of it as the "conductor" that brings together data, actions, and UI state
"use client";

import { useCallback } from "react";
import { useApplicationsData } from "./use-applications-data";
import { useApplicationActions } from "./use-application-actions";
import { useDashboardContext } from "@/lib/context/hire/dashboard/DashboardContext";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { UserService } from "@/lib/api/services";
import { EmployerApplication } from "@/lib/db/db.types";

export function useDashboard() {
  // Focused hooks for specific concerns
  const { applications, loading, profile, profileLoading } =
    useApplicationsData();
  const { updateStatus, updateNotes } = useApplicationActions();
  const { selectedApplication, setSelectedApplication } = useDashboardContext();

  // Modal system (keeping existing for now)
  const {
    open: openApplicantModal,
    close: closeApplicantModal,
    Modal: ApplicantModal,
  } = useModal("applicant-modal");

  const { open: openResumeModal, Modal: ResumeModal } =
    useModal("resume-modal");
  const {
    open: openReviewModal,
    close: closeReviewModal,
    Modal: ReviewModal,
  } = useModal("review-modal");

  // File handling for resumes
  const getUserResumeUrl = useCallback(
    async () =>
      UserService.getUserResumeURL(selectedApplication?.user?.id ?? ""),
    [selectedApplication]
  );

  const { url: resumeURL, sync: syncResumeURL } = useFile({
    fetcher: getUserResumeUrl,
    route: selectedApplication
      ? `/users/${selectedApplication.user_id}/resume`
      : "",
  });

  // Event handlers
  const handleApplicationClick = (application: EmployerApplication) => {
    setSelectedApplication(application);
    openApplicantModal();
  };

  const handleNotesClick = (application: EmployerApplication) => {
    setSelectedApplication(application);
    openReviewModal();
  };

  const handleScheduleClick = (application: EmployerApplication) => {
    setSelectedApplication(application);
    window?.open(application.user?.calendar_link ?? "", "_blank")?.focus();
  };

  const handleStatusChange = async (
    application: EmployerApplication,
    status: number
  ) => {
    if (!application?.id) {
      console.error("Not an application you can edit.");
      return;
    }
    await updateStatus(application.id, status);
  };

  return {
    // Data
    applications,
    loading,
    profile,
    profileLoading,
    selectedApplication,
    resumeURL,

    // Actions
    updateStatus,
    updateNotes,
    syncResumeURL,

    // Event handlers
    handleApplicationClick,
    handleNotesClick,
    handleScheduleClick,
    handleStatusChange,

    // Modals
    ApplicantModal,
    ResumeModal,
    ReviewModal,
    closeApplicantModal,
    closeReviewModal,
    openResumeModal,
    setSelectedApplication,
  };
}
