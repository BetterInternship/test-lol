"use client";

import { useAuthContext } from "../authctx";
import { useDashboardState } from "@/hooks/use-dashboard-state";
import ContentLayout from "@/components/features/hire/content-layout";
import { ApplicationsTable } from "@/components/features/hire/dashboard/ApplicationsTable";
import { DashboardModals } from "@/components/features/hire/dashboard/DashboardModals";
import { ShowUnverifiedBanner } from "@/components/ui/banner";

export default function Dashboard() {
  const { redirect_if_not_logged_in } = useAuthContext();
  const {
    // Data
    employer_applications,
    profile,
    loading,
    profileLoading,
    selectedApplication,
    resumeURL,
    
    // Functions
    app_statuses,
    to_level_name,
    to_university_name,
    to_app_status_name,
    review_app,
    syncResumeURL,
    
    // Handlers
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
  } = useDashboardState();

  redirect_if_not_logged_in();

  if (loading) {
    return (
      <ContentLayout>
        <div className="w-full h-[100%] flex flex-col items-center justify-center">
          <div className="w-max-prose text-center h-8">Loading...</div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex flex-col h-0 flex-1 space-y-6">
          {!profileLoading && !profile?.is_verified ? (
            <ShowUnverifiedBanner />
          ) : (
            <ApplicationsTable
              applications={employer_applications}
              appStatuses={app_statuses}
              onApplicationClick={handleApplicationClick}
              onNotesClick={handleNotesClick}
              onScheduleClick={handleScheduleClick}
              onStatusChange={handleStatusChange}
              toUniversityName={(university) => to_university_name(university) ?? ''}
              toLevelName={(level) => to_level_name(level) ?? ''}
              toAppStatusName={(status) => to_app_status_name(status) ?? ''}
            />
          )}
        </div>
      </div>

      <DashboardModals
        selectedApplication={selectedApplication}
        resumeURL={resumeURL}
        ApplicantModal={ApplicantModal}
        ResumeModal={ResumeModal}
        ReviewModal={ReviewModal}
        closeApplicantModal={closeApplicantModal}
        reviewApp={review_app}
        closeReviewModal={closeReviewModal}
        syncResumeURL={syncResumeURL}
        openResumeModal={openResumeModal}
      />
    </ContentLayout>
  );
}
