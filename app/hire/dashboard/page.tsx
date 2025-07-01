"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, User, BarChart3, Building2 } from "lucide-react";
import {
  useEmployerApplications,
  useOwnedJobs,
} from "@/hooks/use-employer-api";
import { EmployerApplication } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { GroupableRadioDropdown } from "@/components/ui/dropdown";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { useModal } from "@/hooks/use-modal";
import { useFile } from "@/hooks/use-file";
import { UserService } from "@/lib/api/api";
import { Pfp } from "@/components/shared/pfp";
import { MDXEditor } from "@/components/MDXEditor";
import { useAuthContext } from "../authctx";
import ContentLayout from "@/components/features/hire/content-layout";
import { getFullName } from "@/lib/utils/user-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFPreview } from "@/components/shared/pdf-preview";

export default function Dashboard() {
  const {
    employer_applications,
    review: review_app,
    loading,
  } = useEmployerApplications();
  const { redirect_if_not_logged_in } = useAuthContext();
  const { ownedJobs } = useOwnedJobs();
  const {
    app_statuses,
    get_college,
    get_app_status_by_name,
    to_level_name,
    to_university_name,
    to_app_status_name,
  } = useRefs();
  const [selected_application, set_selected_application] =
    useState<EmployerApplication | null>(null);
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

  redirect_if_not_logged_in();

  // Sorting and filtering states
  const [selected_resume, set_selected_resume] = useState("");

  // Syncs everything
  const set_application = (application: EmployerApplication) => {
    set_selected_application(application);
    set_selected_resume("/users/" + application?.user_id + "/resume");
  };

  useEffect(() => {
    const id = selected_application?.id;
    if (!id) return;
    set_application(employer_applications.filter((a) => a.id === id)[0]);
  }, [employer_applications]);

  const get_user_resume_url = useCallback(
    async () =>
      UserService.getUserResumeURL(selected_application?.user?.id ?? ""),
    [selected_application]
  );

  const { url: resumeUrl, sync: syncResumeUrl } = useFile({
    fetcher: get_user_resume_url,
    route: selected_resume,
  });

  return (
    <ContentLayout>
      {!loading ? (
        <>
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Enhanced Dashboard */}
            <div className="p-6 flex flex-col h-0 flex-1 space-y-6">
              {/* Enhanced Table */}
              <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
                {/* Table Header with Filters */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-500">
                        Showing {employer_applications.length} of{" "}
                        {employer_applications.length} applications
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto">
                  <table className="relative w-full">
                    <tbody className="absolute w-[100%]">
                      {employer_applications
                        .toSorted(
                          (a, b) =>
                            new Date(b.applied_at ?? "").getTime() -
                            new Date(a.applied_at ?? "").getTime()
                        )
                        .map((application, index) => (
                          <tr
                            key={application.id}
                            className={`w-full flex flex-row items-center justify-between border-b border-gray-50 hover:bg-gray-100 hover:cursor-pointer transition-colors`}
                            onClick={() => {
                              set_application(application);
                              openApplicantModal();
                            }}
                          >
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-3">
                                {application.user?.id && (
                                  <Pfp user_id={application.user?.id}></Pfp>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {getFullName(application.user)}{" "}
                                    <span className="opacity-70">
                                      —{" "}
                                      {to_university_name(
                                        application.user?.university
                                      )}{" "}
                                      •{" "}
                                      {to_level_name(
                                        application.user?.year_level
                                      )}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <Badge strength="medium">
                                      {application.job?.title}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 text-center">
                              <div className="flex flex-row items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    set_application(application);
                                    openReviewModal();
                                  }}
                                >
                                  Notes
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    set_application(application);
                                    window
                                      ?.open(
                                        application.user?.calendar_link ?? "",
                                        "_blank"
                                      )
                                      ?.focus();
                                  }}
                                >
                                  Schedule
                                </Button>
                                <GroupableRadioDropdown
                                  name="status"
                                  className="w-36"
                                  options={app_statuses.map((as) => as.name)}
                                  defaultValue={
                                    to_app_status_name(application.status) ?? ""
                                  }
                                  onChange={async (status) => {
                                    if (!application?.id) {
                                      console.error(
                                        "Not an application you can edit."
                                      );
                                      return;
                                    }

                                    const {
                                      // @ts-ignore
                                      application: updated_app,
                                      success,
                                    } = await review_app(application.id, {
                                      status:
                                        get_app_status_by_name(status)?.id,
                                    });

                                    console.log(success, updated_app);
                                  }}
                                ></GroupableRadioDropdown>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <ApplicantModal>
            <ApplicantModalContent
              clickable={true}
              pfp_fetcher={async () =>
                UserService.getUserPfpURL(selected_application?.user?.id ?? "")
              }
              pfp_route={`/users/${selected_application?.user?.id}/pic`}
              applicant={selected_application?.user}
              open_calendar={async () => {
                closeApplicantModal();
                window
                  ?.open(
                    selected_application?.user?.calendar_link ?? "",
                    "_blank"
                  )
                  ?.focus();
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
                  {getFullName(selected_application?.user)} - Resume
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
      ) : (
        <div className="w-full h-[100%] flex flex-col items-center justify-center">
          <div className="w-max-prose text-center h-8">Loading...</div>
        </div>
      )}
    </ContentLayout>
  );
}

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
  const [review, set_review] = useState("");
  const [saving, set_saving] = useState(false);
  const handle_save = async () => {
    if (!application.id) return;
    set_saving(true);
    await review_app(application.id, {
      review,
      notes: application.notes ?? "",
      status: application.status,
    });
    set_saving(false);
    close();
  };

  useEffect(() => {
    set_review(application.review ?? "");
  }, [application]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold font-heading text-4xl px-8 pb-4">
          {getFullName(application.user)} - Private Notes
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center">
        <MDXEditor
          className="min-h-[300px] px-8 w-full rounded-lg overflow-y-auto"
          markdown={application.review ?? ""}
          onChange={(value) => set_review(value)}
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
