"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  FileText,
  User,
  BarChart3,
  ChevronDown,
  Building2,
  FileEdit,
  Search,
  Notebook,
} from "lucide-react";
import Link from "next/link";
import { useEmployerApplications } from "@/hooks/use-employer-api";
import { EmployerApplication } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { GroupableRadioDropdown } from "@/components/ui/dropdown";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { useModal } from "@/hooks/use-modal";
import { useClientDimensions } from "@/hooks/use-dimensions";
import { useFile } from "@/hooks/use-file";
import { application_service, user_service } from "@/lib/api";
import { Pfp } from "@/components/shared/pfp";
import { MDXEditor } from "@/components/MDXEditor";
import { useAuthContext } from "../authctx";

export default function Dashboard() {
  const {
    employer_applications,
    review: review_app,
    loading,
    error,
  } = useEmployerApplications();
  const { redirect_if_not_loggedin } = useAuthContext();
  const { client_width, client_height } = useClientDimensions();
  const {
    app_statuses,
    get_college,
    to_college_name,
    to_level_name,
    to_university_name,
  } = useRefs();
  const [selected_application, set_selected_application] =
    useState<EmployerApplication | null>(null);
  const {
    open: open_applicant_modal,
    close: close_applicant_modal,
    Modal: ApplicantModal,
  } = useModal("applicant-modal");
  const { open: open_calendly_modal, Modal: CalendlyModal } =
    useModal("calendly-modal");
  const { open: open_resume_modal, Modal: ResumeModal } =
    useModal("resume-modal");
  const {
    open: open_review_modal,
    close: close_review_modal,
    Modal: ReviewModal,
  } = useModal("review-modal");

  redirect_if_not_loggedin();

  // Sorting and filtering states
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selected_statuses, set_selected_statuses] = useState<string[]>([]);
  const [jobSearch, setJobSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
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
    fetch: get_user_resume_url,
    route: selected_resume,
  });

  // Get unique values for filters
  const uniqueJobs = useMemo(
    () =>
      [
        ...new Set(
          employer_applications
            .map((a) => a.job?.id)
            .filter((a) => a !== undefined)
        ),
      ].sort(),
    []
  );

  // Filter and sort applications
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleJobToggle = (job: string) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };

  const handleStatusToggle = (status: string) => {
    set_selected_statuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Filter components
  const MultiSelectFilter = ({
    title,
    options,
    selected,
    onToggle,
    searchValue,
    onSearchChange,
    fieldName,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    fieldName: string;
  }) => {
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 font-semibold">
            <div className="flex items-center gap-2">
              {title} <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort(fieldName)}
                className="text-xs"
              >
                A-Z {sortField === fieldName && sortDirection === "asc" && "↑"}
                {sortField === fieldName && sortDirection === "desc" && "↓"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Select all filtered options
                  filteredOptions.forEach((option) => {
                    if (!selected.includes(option)) {
                      onToggle(option);
                    }
                  });
                }}
                className="text-xs"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clear all selections
                  selected.forEach((option) => onToggle(option));
                }}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${title}-${option}`}
                    checked={selected.includes(option)}
                    onCheckedChange={() => onToggle(option)}
                  />
                  <label
                    htmlFor={`${title}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {selected.length > 0 && (
              <div className="text-xs text-gray-500 pt-2 border-t">
                {selected.length} selected
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const SortableFilter = ({
    field,
    title,
  }: {
    field: string;
    title: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 font-semibold">
          <div className="flex items-center gap-2">
            {title} <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="start">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort(field)}
            className="w-full justify-start"
          >
            Sort A-Z {sortField === field && sortDirection === "asc" && "↑"}
            {sortField === field && sortDirection === "desc" && "↓"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className="w-64 border-r bg-gray-50 flex flex-col"
        data-tour="sidebar"
      >
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Pages</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium cursor-default">
              <BarChart3 className="h-5 w-5" />
              My Applications
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <FileText className="h-5 w-5" />
              My Listings
            </Link>
            <Link
              href="/forms-automation"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <FileEdit className="h-5 w-5" />
              Forms Automation
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Dashboard */}
        <div className="p-6 flex flex-col h-0 flex-1 space-y-6">
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
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-[300px]">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <SortableFilter field="name" title="Candidate" />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-[250px]">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <MultiSelectFilter
                          title="Position"
                          options={uniqueJobs}
                          selected={selectedJobs}
                          onToggle={handleJobToggle}
                          searchValue={jobSearch}
                          onSearchChange={setJobSearch}
                          fieldName="job"
                        />
                      </div>
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-700 w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <Notebook className="h-4 w-4 text-gray-400" />
                        <span>Review</span>
                      </div>
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-700 w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Schedule</span>
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-[200px]">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <MultiSelectFilter
                          title="Status"
                          options={app_statuses.map((as) => as.name)}
                          selected={selected_statuses}
                          onToggle={handleStatusToggle}
                          searchValue={statusSearch}
                          onSearchChange={setStatusSearch}
                          fieldName="status"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employer_applications.map((application, index) => (
                    <tr
                      key={application.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 hover:cursor-pointer transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                      onClick={() => {
                        set_application(application);
                        open_applicant_modal();
                      }}
                    >
                      <td className="px-6 py-4 w-[300px]">
                        <div className="flex items-center gap-3">
                          {application.user?.id && (
                            <Pfp user_id={application.user?.id}></Pfp>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {application.user?.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {to_university_name(
                                get_college(application.user?.college)
                                  ?.university_id
                              )}{" "}
                              • {to_college_name(application.user?.college)} •{" "}
                              {to_level_name(application.user?.year_level)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-[250px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            {application.job?.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {application.job?.mode}
                        </p>
                      </td>
                      <td className="px-6 py-4 w-[120px] text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-20 input-box hover:bg-green-50 hover:text-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            set_application(application);
                            open_review_modal();
                          }}
                        >
                          <Notebook className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 w-[120px] text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-20 input-box hover:bg-green-50 hover:text-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            set_application(application);
                            open_calendly_modal();
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 w-[200px]">
                        <GroupableRadioDropdown
                          name="status"
                          options={app_statuses.map((as) => as.name)}
                          on_change={() => alert("Status updated.")}
                        ></GroupableRadioDropdown>
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
          applicant={selected_application?.user}
          open_calendly_modal={async () => {
            close_applicant_modal();
            open_calendly_modal();
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

      <CalendlyModal>
        {selected_application?.user?.calendly_link ? (
          <iframe
            src={`${selected_application?.user?.calendly_link}?embed_domain=www.calendly-embed.com&embed_type=Inline`}
            allowTransparency={true}
            style={{
              width: Math.min(client_width * 0.6, 1000),
              height: client_height * 0.7,
              background: "#FFFFFF",
            }}
          >
            Calendly could not be loaded.
          </iframe>
        ) : (
          <div className="h-48 px-8">
            <h1 className="font-heading font-bold text-4xl my-4">Aww man!</h1>
            <div className="w-prose text-center border border-red-500 border-opacity-50 text-red-500 shadow-sm rounded-md p-4 bg-white">
              This applicant does not have a calendly link.
            </div>
          </div>
        )}
      </CalendlyModal>

      <ResumeModal>
        {selected_application?.user?.resume ? (
          <>
            <h1 className="font-bold font-heading text-4xl px-8 pt-2 pb-6">
              {selected_application?.user?.full_name} - Resume
            </h1>
            <iframe
              allowTransparency={true}
              style={{
                width: client_width * 0.4,
                height: client_height * 0.8,
                background: "#FFFFFF",
              }}
              src={resume_url + "#toolbar=0&navpanes=0&scrollbar=0"}
            >
              Resume could not be loaded.
            </iframe>
          </>
        ) : (
          <div className="h-48 px-8">
            <h1 className="font-heading font-bold text-4xl my-4">Aww man!</h1>
            <div className="w-prose text-center border border-red-500 border-opacity-50 text-red-500 shadow-sm rounded-md p-4 bg-white">
              This applicant has not uploaded a resume.
            </div>
          </div>
        )}
      </ResumeModal>
    </>
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
  const handle_save = async () => {
    if (!application.id) return;
    await review_app(application.id, {
      review,
      notes: application.notes ?? "",
      status: application.status,
    });
    close();
  };

  useEffect(() => {
    set_review(application.review ?? "");
  }, [application]);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="font-bold font-heading text-4xl px-8 pb-4">
          {application?.user?.full_name} - Review
        </h1>
        <div className="flex flex-row">
          <Button className="bg-blue-500 ml-8" onClick={handle_save}>
            Save
          </Button>
          <Button variant="outline" className="ml-2" onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
      <div className="relative h-[500px] w-[600px] mt-4">
        <MDXEditor
          className="min-h-[300px] border border-gray-200 rounded-lg"
          markdown={application.review ?? ""}
          onChange={(value) => set_review(value)}
        />
      </div>
    </>
  );
};
