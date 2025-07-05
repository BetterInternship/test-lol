"use client";

import { useCallback } from "react";
import { useAuthContext } from "../authctx";
import ContentLayout from "@/components/features/hire/content-layout";
import { ApplicationTable } from "@/components/features/hire/dashboard/ApplicationTable";
import { ApplicationModals } from "@/components/features/hire/dashboard/ApplicationModals";
import { useApplicationData } from "@/hooks/hire/use-application-data";

export default function Dashboard() {
  const { redirect_if_not_logged_in } = useAuthContext();
  const {
    employer_applications,
    selected_application,
    selectedUserFullName,
    selectedUserId,
    resumeUrl,
    loading,
    app_statuses,
    to_level_name,
    to_university_name,
    to_app_status_name,
    set_application,
    review_app,
    syncResumeUrl,
    handleStatusChange,
    handleScheduleClick,
  } = useApplicationData();

  redirect_if_not_logged_in();

  // Modal handlers from grabbiegrabbiecomponent
  const handleApplicantClick = useCallback(
    (application: any) => {
      set_application(application);
      // Modal opening is handled within ApplicationModals
    },
    [set_application]
  );

  const handleNotesClick = useCallback(
    (application: any) => {
      set_application(application);
      // Modal opening is handled within ApplicationModals
    },
    [set_application]
  );

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
          <ApplicationTable
            applications={employer_applications}
            app_statuses={app_statuses}
            to_level_name={(level: any) => to_level_name(level) || ""}
            to_university_name={(university: any) =>
              to_university_name(university) || ""
            }
            to_app_status_name={(status: any) =>
              to_app_status_name(status) ?? ""
            }
            onRowClick={handleApplicantClick}
            onNotesClick={handleNotesClick}
            onScheduleClick={handleScheduleClick}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <ApplicationModals
        selected_application={selected_application}
        selectedUserFullName={selectedUserFullName}
        selectedUserId={selectedUserId}
        resumeUrl={resumeUrl}
        review_app={review_app}
        syncResumeUrl={syncResumeUrl}
        onScheduleClick={handleScheduleClick}
      />
    </ContentLayout>
  );
}
