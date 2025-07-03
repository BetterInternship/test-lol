import { useState, useCallback, useMemo } from "react";
import { FileText } from "lucide-react";
import { EmployerApplication } from "@/lib/db/db.types";
import { useModal } from "@/hooks/use-modal";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { Button } from "@/components/ui/button";
import { PDFPreview } from "@/components/shared/pdf-preview";
import { MDXEditor } from "@/components/MDXEditor";
import { UserService } from "@/lib/api/api";
import { getFullName } from "@/lib/utils/user-utils";

interface ApplicationModalsProps {
  selected_application: EmployerApplication | null;
  selectedUserFullName: string;
  selectedUserId: string;
  resumeUrl: string;
  review_app: (
    id: string,
    review_options: { review?: string; notes?: string; status?: number }
  ) => void;
  syncResumeUrl: () => Promise<void>;
  onScheduleClick: (application: EmployerApplication) => void;
}

export const ApplicationModals = ({
  selected_application,
  selectedUserFullName,
  selectedUserId,
  resumeUrl,
  review_app,
  syncResumeUrl,
  onScheduleClick,
}: ApplicationModalsProps) => {
  const {
    open: openApplicantModal,
    close: closeApplicantModal,
    Modal: ApplicantModal,
  } = useModal("applicant-modal");
  
  const { 
    open: openResumeModal, 
    Modal: ResumeModal 
  } = useModal("resume-modal");
  
  const {
    open: openReviewModal,
    close: closeReviewModal,
    Modal: ReviewModal,
  } = useModal("review-modal");

  return (
    <>
      <ApplicantModal>
        <ApplicantModalContent
          clickable={true}
          pfp_fetcher={() => UserService.getUserPfpURL(selectedUserId)}
          pfp_route={`/users/${selectedUserId}/pic`}
          applicant={selected_application?.user}
          open_calendar={() => {
            closeApplicantModal();
            if (selected_application) {
              onScheduleClick(selected_application);
            }
          }}
          open_resume={async () => {
            closeApplicantModal();
            await syncResumeUrl();
            openResumeModal();
          }}
          job={selected_application?.job}
        />
      </ApplicantModal>

      <ReviewModal>
        {selected_application && (
          <ReviewModalContent
            application={selected_application}
            review_app={review_app}
            close={closeReviewModal}
          />
        )}
      </ReviewModal>

      <ResumeModal>
        {selected_application?.user?.resume ? (
          <div className="h-full flex flex-col">
            <h1 className="font-bold font-heading text-2xl px-6 py-4 text-gray-900">
              {selectedUserFullName} - Resume
            </h1>
            <PDFPreview url={resumeUrl} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 px-8">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="font-heading font-bold text-2xl mb-4 text-gray-700">
                No Resume Available
              </h1>
              <div className="max-w-md text-center border border-red-200 text-red-600 bg-red-50 rounded-lg p-4">
                This applicant has not uploaded a resume yet.
              </div>
            </div>
          </div>
        )}
      </ResumeModal>
    </>
  );
};

const ReviewModalContent = ({
  application,
  review_app,
  close,
}: {
  application: EmployerApplication;
  review_app: (
    id: string,
    review_options: { review?: string; notes?: string; status?: number }
  ) => void;
  close: () => void;
}) => {
  const [review, set_review] = useState(application.review ?? "");
  const [saving, set_saving] = useState(false);

  const handle_save = useCallback(async () => {
    if (!application.id) return;
    set_saving(true);
    await review_app(application.id, {
      review,
      notes: application.notes ?? "",
      status: application.status,
    });
    set_saving(false);
    close();
  }, [
    application.id,
    application.notes,
    application.status,
    review,
    review_app,
    close,
  ]);

  const applicationUserFullName = useMemo(
    () => getFullName(application.user),
    [application.user]
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold font-heading text-4xl px-8 pb-4">
          {applicationUserFullName} - Private Notes
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center">
        <MDXEditor
          className="min-h-[300px] px-8 w-full rounded-lg overflow-y-auto"
          markdown={review}
          onChange={set_review}
        />
      </div>
      <div className="flex flex-row items-center justify-center w-full px-5 py-3 gap-2">
        <Button disabled={saving} onClick={handle_save} className="w-1/4">
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="outline"
          disabled={saving}
          className=" w-1/4"
          onClick={close}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};