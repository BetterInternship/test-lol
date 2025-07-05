"use client";

import { useState, useEffect, useCallback } from "react";
import { EmployerApplication } from "@/lib/db/db.types";
import { useEmployerApplications, useProfile } from "@/hooks/use-employer-api";
import { useRefs } from "@/lib/db/use-refs";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { UserService } from "@/lib/api/services";

export function useDashboardState() {
  const {
    employer_applications,
    review: review_app,
    loading,
  } = useEmployerApplications();
  
  const { profile, loading: profileLoading } = useProfile();
  const {
    app_statuses,
    to_level_name,
    to_university_name,
    to_app_status_name,
  } = useRefs();

  const [selectedApplication, setSelectedApplication] =
    useState<EmployerApplication | null>(null);
  const [selectedResume, setSelectedResume] = useState("");

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

  const setApplication = (application: EmployerApplication) => {
    setSelectedApplication(application);
    setSelectedResume("/users/" + application?.user_id + "/resume");
  };

  const getUserResumeUrl = useCallback(
    async () =>
      UserService.getUserResumeURL(selectedApplication?.user?.id ?? ""),
    [selectedApplication]
  );

  const { url: resumeURL, sync: syncResumeURL } = useFile({
    fetcher: getUserResumeUrl,
    route: selectedResume,
  });

  const handleApplicationClick = (application: EmployerApplication) => {
    setApplication(application);
    openApplicantModal();
  };

  const handleNotesClick = (application: EmployerApplication) => {
    setApplication(application);
    openReviewModal();
  };

  const handleScheduleClick = (application: EmployerApplication) => {
    setApplication(application);
    window
      ?.open(application.user?.calendar_link ?? "", "_blank")
      ?.focus();
  };

  const handleStatusChange = async (
    application: EmployerApplication,
    status: number
  ) => {
    if (!application?.id) {
      console.error("Not an application you can edit.");
      return;
    }

    await review_app(application.id, { status });
  };

  useEffect(() => {
    const id = selectedApplication?.id;
    if (!id) return;
    setApplication(employer_applications.filter((a) => a.id === id)[0]);
  }, [employer_applications]);

  return {
    // Only return values that actually change between renders
    employer_applications,
    profile,
    loading,
    profileLoading,
    selectedApplication,
    resumeURL,
    
    // These are static references - could be memoized or moved outside if needed
    app_statuses,
    to_level_name,
    to_university_name,
    to_app_status_name,
    review_app,
    syncResumeURL,
    handleApplicationClick,
    handleNotesClick,
    handleScheduleClick,
    handleStatusChange,
    ApplicantModal,
    ResumeModal,
    ReviewModal,
    closeApplicantModal,
    closeReviewModal,
    openResumeModal,
  };
}
