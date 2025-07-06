// Main dashboard page - uses clean architecture with focused hooks and context
// Wraps everything in DashboardProvider for shared state management
"use client";

import { useAuthContext } from "../authctx";
import { useDashboard } from "@/hooks/hire/dashboard/use-dashboard";
import { DashboardProvider } from "@/lib/context/hire/dashboard/DashboardContext";
import ContentLayout from "@/components/features/hire/content-layout";
import { ApplicationsTable } from "@/components/features/hire/dashboard/ApplicationsTable";
import { DashboardModals } from "@/components/features/hire/dashboard/DashboardModals";
import { ShowUnverifiedBanner } from "@/components/ui/banner";

function DashboardContent() {
  const { redirect_if_not_logged_in } = useAuthContext();
  const {
    // Data
    applications,
    profile,
    loading,
    profileLoading,
    selectedApplication,
    resumeURL,

    // Actions
    updateNotes,
    updateStatus,
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
  } = useDashboard();

  // Wrapper for review function to match expected signature
  const reviewApp = (
    id: string,
    reviewOptions: { review?: string; notes?: string; status?: number }
  ) => {
    if (reviewOptions.notes) {
      updateNotes(id, reviewOptions.notes);
    }
    if (reviewOptions.status !== undefined) {
      updateStatus(id, reviewOptions.status);
    }
  };

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
      <div className="flex-1 flex flex-col w-full">
        <div className="p-6 flex flex-col h-0 flex-1 space-y-6">
          {!profileLoading && !profile?.is_verified ? (
            <ShowUnverifiedBanner />
          ) : (
            <ApplicationsTable
              applications={applications}
              onApplicationClick={handleApplicationClick}
              onNotesClick={handleNotesClick}
              onScheduleClick={handleScheduleClick}
              onStatusChange={handleStatusChange}
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
        reviewApp={reviewApp}
        closeReviewModal={closeReviewModal}
        syncResumeURL={syncResumeURL}
        openResumeModal={openResumeModal}
      />
    </ContentLayout>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
