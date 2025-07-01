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
import { useClientDimensions } from "@/hooks/use-dimensions";
import { useFile } from "@/hooks/use-file";
import { user_service } from "@/lib/api/api";
import { Pfp } from "@/components/shared/pfp";
import { MDXEditor } from "@/components/MDXEditor";
import { useAuthContext } from "../authctx";
import ContentLayout from "@/components/features/hire/content-layout";
import { get_full_name } from "@/lib/utils/user-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const {
    employer_applications,
    review: review_app,
    loading,
  } = useEmployerApplications();
  const { redirect_if_not_logged_in } = useAuthContext();
  const { client_width, client_height } = useClientDimensions();
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
    open: open_applicant_modal,
    close: close_applicant_modal,
    Modal: ApplicantModal,
  } = useModal("applicant-modal");
  const { open: open_calendar_modal, Modal: CalendarModal } =
    useModal("calendar-modal");
  const { open: open_resume_modal, Modal: ResumeModal } =
    useModal("resume-modal");
  const {
    open: open_review_modal,
    close: close_review_modal,
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
      user_service.get_user_resume_url(selected_application?.user?.id ?? ""),
    [selected_application]
  );

  const { url: resume_url, sync: sync_resume_url } = useFile({
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
              {/* Dashboard Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Total Applications
                      </h4>
                      <p className="text-3xl font-bold text-gray-900">
                        {employer_applications.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Last 30 days</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Active Jobs
                      </h4>
                      <p className="text-3xl font-bold text-gray-900">
                        {ownedJobs.filter((job) => job.is_active).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Currently posted</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        Recent Activity
                      </h4>
                      <p className="text-3xl font-bold text-gray-900">
                        {
                          employer_applications.filter(
                            (app) =>
                              new Date(app.applied_at ?? "").getTime() >
                              Date.now() - 7 * 24 * 60 * 60 * 1000
                          ).length
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Applications this week
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
                {/* Table Header with Filters */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-500">
                        Showing {employer_applications.length} of{" "}
                        {employer_applications.length} applicants
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
                              open_applicant_modal();
                            }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {application.user?.id && (
                                  <Pfp user_id={application.user?.id}></Pfp>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {get_full_name(application.user)} •{" "}
                                    <Badge strength="medium">
                                      {application.job?.title}
                                    </Badge>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {to_university_name(
                                      get_college(application.user?.college)
                                        ?.university_id
                                    )}{" "}
                                    •{" "}
                                    {to_level_name(
                                      application.user?.year_level
                                    )}
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
                                    open_review_modal();
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
                                  options={app_statuses.map((as) => as.name)}
                                  default_value={
                                    to_app_status_name(application.status) ?? ""
                                  }
                                  on_change={async (status) => {
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
              resume_fetcher={async () =>
                user_service.get_user_resume_url(
                  selected_application?.user?.id ?? ""
                )
              }
              pfp_fetcher={async () =>
                user_service.get_user_pfp_url(
                  selected_application?.user?.id ?? ""
                )
              }
              resume_route={`/users/${selected_application?.user?.id}/resume`}
              pfp_route={`/users/${selected_application?.user?.id}/pic`}
              applicant={selected_application?.user}
              open_calendar_modal={async () => {
                close_applicant_modal();
                window
                  ?.open(
                    selected_application?.user?.calendar_link ?? "",
                    "_blank"
                  )
                  ?.focus();
                //open_calendar_modal();
              }}
              open_resume_modal={async () => {
                close_applicant_modal();
                await sync_resume_url();
                open_resume_modal();
              }}
              job={selected_application?.job}
            />
          </ApplicantModal>

          <ReviewModal>
            {selected_application && (
              <ReviewModalContent
                application={selected_application}
                review_app={review_app}
                close={close_review_modal}
              />
            )}
          </ReviewModal>

          <CalendarModal>
            {selected_application?.user?.calendar_link ? (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Schedule Interview
                </h2>
                <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <iframe
                    src={`${selected_application?.user?.calendar_link}?embed_domain=www.calendly-embed.com&embed_type=Inline`}
                    allowTransparency={true}
                    className="w-full border-0 rounded-lg"
                    style={{
                      width: Math.min(client_width * 0.6, 600),
                      height: client_height * 0.7,
                      background: "#FFFFFF",
                    }}
                  >
                    Calendar could not be loaded.
                  </iframe>
                </div>
              </div>
            ) : (
              <div className="h-48 px-8">
                <h1 className="font-heading font-bold text-4xl my-4">
                  Aww man!
                </h1>
                <div className="w-prose text-center border border-red-500 border-opacity-50 text-red-500 shadow-sm rounded-md p-4 bg-white">
                  This applicant does not have a calendar link.
                </div>
              </div>
            )}
          </CalendarModal>

          <ResumeModal>
            {selected_application?.user?.resume ? (
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h1 className="font-bold font-heading text-2xl text-gray-900">
                    {get_full_name(selected_application?.user)} - Resume
                  </h1>
                </div>
                <div className="flex-1 p-4">
                  <iframe
                    allowTransparency={true}
                    className="w-full h-full border border-gray-200 rounded-lg"
                    style={{
                      width: Math.min(client_width * 0.6, 600),
                      minHeight: "70vh",
                      background: "#FFFFFF",
                    }}
                    src={resume_url + "#toolbar=0&navpanes=0&scrollbar=0"}
                  >
                    Resume could not be loaded.
                  </iframe>
                </div>
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
          {get_full_name(application.user)} - Private Notes
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
