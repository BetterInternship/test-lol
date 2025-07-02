"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Search, FileText, FileEdit, Plus } from "lucide-react";
import { useOwnedJobs } from "@/hooks/use-employer-api";
import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { MDXEditor } from "@/components/MDXEditor";
import { useFormData } from "@/lib/form-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useModal } from "@/hooks/use-modal";
import { Paginator } from "@/components/ui/paginator";
import { EditableJobDetails, EmployerJobCard } from "@/components/shared/jobs";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/ui/dropdown";
import { useAuthContext } from "../authctx";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ContentLayout from "@/components/features/hire/content-layout";
import { Card } from "@/components/ui/our-card";

export default function MyListings() {
  const { redirect_if_not_logged_in } = useAuthContext();
  const { ownedJobs, create_job, update_job, delete_job } = useOwnedJobs();
  const [selectedJob, setSelectedJob] = useState<Job>({} as Job);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, set_saving] = useState(false);
  const [is_editing, setIsEditing] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const jobs_page_size = 10;
  const {
    open: openCreateModal,
    close: closeCreateModal,
    Modal: CreateModal,
  } = useModal("create-modal");
  const {
    open: openDeleteModal,
    close: closeDeleteModal,
    Modal: DeleteModal,
  } = useModal("delete-modal");

  redirect_if_not_logged_in();

  const getJobLink = (job: Job) => {
    return `${process.env.NEXT_PUBLIC_CLIENT_URL}/search/${job.id}`;
  };

  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return ownedJobs;
    return ownedJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ownedJobs, searchTerm]);

  // Handle search input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Could add additional search functionality here
    }
  };

  useEffect(() => {
    const id = selectedJob.id;
    if (!id) return;
    setSelectedJob(ownedJobs.filter((j) => j.id === id)[0]);
  }, [ownedJobs]);

  useEffect(() => {
    if (!is_editing) set_saving(false);
  }, [is_editing]);

  return (
    <ContentLayout>
      <>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 p-6 flex gap-6 overflow-hidden">
            {/* Left Panel - Job List */}
            <div className="w-96 flex flex-col h-full">
              {/* Search Bar and Filter Button - Fixed */}
              <div
                className="flex items-center gap-3 pl-1 pr-4 mb-4 flex-shrink-0"
                data-tour="job-filters"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search listings..."
                    className="pl-12 pr-4 h-12 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-900 placeholder:text-gray-400 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <Button
                  size="icon"
                  onClick={() => openCreateModal()}
                  data-tour="add-job-btn"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Job Cards - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-4 border-r pt-4 pl-2">
                {filteredJobs.map((job) => (
                  <EmployerJobCard
                    key={job.id}
                    job={job}
                    disabled={is_editing}
                    // @ts-ignore
                    update_job={update_job}
                    on_click={() => setSelectedJob(job)}
                    selected={job.id === selectedJob.id}
                  ></EmployerJobCard>
                ))}
              </div>
              {/* Paginator - following student portal pattern */}
              <div className="mt-4 flex-shrink-0">
                <Paginator
                  totalItems={filteredJobs.length}
                  itemsPerPage={jobs_page_size}
                  onPageChange={(page) => setJobsPage(page)}
                />
              </div>
            </div>

            {/* Right Panel - Job Details */}
            {selectedJob?.id ? (
              <EditableJobDetails
                is_editing={is_editing}
                set_is_editing={setIsEditing}
                job={selectedJob}
                saving={saving}
                // @ts-ignore
                update_job={update_job}
                actions={[
                  !is_editing ? (
                    [
                      <Button
                        key="1"
                        variant="outline"
                        disabled={saving}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>,
                      <Button
                        key="2"
                        variant="outline"
                        disabled={saving}
                        onClick={() => {
                          alert("Copied link to clipboard!");
                          navigator.clipboard.writeText(
                            getJobLink(selectedJob)
                          );
                        }}
                      >
                        Share
                      </Button>,
                      <Button
                        key="3"
                        variant="outline"
                        disabled={saving}
                        className="text-red-500 border border-red-300 hover:bg-red-50 hover:text-red-500"
                        onClick={() => openDeleteModal()}
                      >
                        Delete
                      </Button>,
                    ]
                  ) : (
                    <></>
                  ),
                  is_editing ? (
                    <Button
                      key="3"
                      variant="default"
                      disabled={saving}
                      onClick={() => set_saving(true)}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  ) : (
                    <></>
                  ),
                  is_editing ? (
                    <Button
                      key="4"
                      variant="outline"
                      scheme="destructive"
                      disabled={saving}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <></>
                  ),
                ]}
              />
            ) : (
              <div className="h-full m-auto">
                <div className="flex flex-col items-center pt-[25vh] h-screen">
                  <div className="opacity-35 mb-10">
                    <div className="flex flex-row justify-center w-full mb-4">
                      <h1 className="block text-6xl font-heading font-bold ">
                        BetterInternship
                      </h1>
                    </div>
                    <div className="flex flex-row justify-center w-full">
                      <p className="block text-2xl">
                        Better Internships Start Here
                      </p>
                    </div>
                  </div>
                  <div className="w-prose text-center border border-blue-500 border-opacity-50 text-blue-500 shadow-sm rounded-md p-4 bg-white">
                    Click on a job listing to view more details!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Job Modal */}
        <CreateModal>
          <CreateModalForm
            create_job={create_job}
            close={() => closeCreateModal()}
          ></CreateModalForm>
        </CreateModal>

        {/* Delete Job Modal */}
        <DeleteModal>
          <DeleteModalForm
            job={selectedJob}
            delete_job={delete_job}
            clear_job={() => setSelectedJob({} as Partial<Job>)}
            close={() => closeDeleteModal()}
          ></DeleteModalForm>
        </DeleteModal>
      </>
    </ContentLayout>
  );
}

const DeleteModalForm = ({
  job,
  delete_job,
  clear_job,
  close,
}: {
  job: Job;
  delete_job: (job_id: string) => Promise<void>;
  clear_job: () => void;
  close: () => void;
}) => {
  const [deleting, set_deleting] = useState(false);

  const handleDelete = async () => {
    if (!job.id) return close();
    set_deleting(true);
    await delete_job(job.id);
    clear_job();
    set_deleting(false);
    close();
  };

  return (
    <div className="p-8 pt-0 h-full">
      <div className="text-lg mb-4">
        Are you sure you want to delete <br />
        <span className="font-bold">"{job.title}"</span>?
      </div>
      <div className="w-full flex flex-row items-end justify-end space-x-2">
        <Button
          variant="outline"
          scheme="destructive"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
        <Button variant="outline" disabled={deleting} onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const CreateModalForm = ({
  create_job,
  close,
}: {
  create_job: (job: Partial<Job>) => Promise<any>;
  close: () => void;
}) => {
  const [creating, set_creating] = useState(false);
  const { form_data, set_field, set_fields, field_setter } = useFormData<
    Job & {
      salary_freq_name: string;
      mode_name: string;
      type_name: string;
      job_allowance_name: string;
      industry_name: string;
    }
  >();
  const {
    get_job_mode_by_name,
    get_job_type_by_name,
    get_job_pay_freq_by_name,
    job_types,
    job_modes,
    job_pay_freq,
    job_allowances,
  } = useRefs();

  const clean_int = (s: string | undefined): number | undefined =>
    s && s.trim().length ? parseInt(s.trim()) : undefined;
  const handleSaveEdit = async () => {
    const job: Partial<Job> = {
      id: form_data.id,
      title: form_data.title,
      description: form_data.description ?? "",
      requirements: form_data.requirements ?? "",
      location: form_data.location ?? "",
      allowance: clean_int(
        `${get_job_mode_by_name(form_data.job_allowance_name)?.id}`
      ),
      mode: clean_int(`${get_job_mode_by_name(form_data.mode_name)?.id}`),
      type: clean_int(`${get_job_type_by_name(form_data.type_name)?.id}`),
      salary:
        form_data.job_allowance_name === job_allowances[1].name
          ? form_data.salary
          : null,
      salary_freq:
        form_data.job_allowance_name === job_allowances[1].name
          ? clean_int(
              `${get_job_pay_freq_by_name(form_data.salary_freq_name)?.id}`
            )
          : null,
      require_github: form_data.require_github,
      require_portfolio: form_data.require_portfolio,
      require_cover_letter: form_data.require_cover_letter,
      is_unlisted: form_data.is_unlisted,
      start_date: form_data.start_date,
      end_date: form_data.end_date,
      is_year_round: form_data.is_year_round,
    };

    set_creating(true);
    try {
      const response = await create_job(job);
      if (!response?.success) {
        alert("Could not create job");
        set_creating(false);
        return;
      }
      set_creating(false);
      close(); // Ensure modal closes after successful creation
    } catch (error) {
      set_creating(false);
      alert("Error creating job");
    }
  };

  useEffect(() => {
    set_fields({
      mode_name: job_modes[0].name,
      type_name: job_types[0].name,
      salary_freq_name: job_pay_freq[0].name,
      job_allowance_name: job_allowances[0].name,
    });
  }, []);

  return (
    <>
      {/* Header with improved styling */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {form_data.title || "Untitled Job"}
              </h2>
              <p className="text-sm text-gray-500">Create a new job listing</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => close()}
                className="px-4 py-2 text-sm font-medium"
                disabled={creating}
              >
                Cancel
              </Button>
              <Button disabled={creating} onClick={handleSaveEdit}>
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </Button>
            </div>
          </div>
          <div>
            <Input
              value={form_data.title || ""}
              onChange={(e) => set_field("title", e.target.value)}
              className="text-lg font-medium h-12"
              placeholder="Enter job title here..."
            />
          </div>
        </div>
      </div>

      {/* Main Content with improved layout */}
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  value={form_data.location ?? ""}
                  onChange={(e) => set_field("location", e.target.value)}
                  placeholder="Enter location"
                  className="text-sm"
                />
              </div>

              <DropdownGroup>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Work Load
                  </Label>
                  <GroupableRadioDropdown
                    name="type"
                    defaultValue={form_data.type_name}
                    options={job_types.map((jt) => jt.name)}
                    onChange={field_setter("type_name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Work Mode
                  </Label>
                  <GroupableRadioDropdown
                    name="mode"
                    defaultValue={form_data.mode_name}
                    options={job_modes.map((jm) => jm.name)}
                    onChange={field_setter("mode_name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Compensations
                  </Label>
                  <GroupableRadioDropdown
                    name="allowance"
                    defaultValue={form_data.job_allowance_name}
                    options={job_allowances.map((ja) => ja.name).reverse()}
                    onChange={field_setter("job_allowance_name")}
                  />
                </div>

                {form_data.job_allowance_name === "Paid" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Salary
                      </Label>
                      <Input
                        value={form_data.salary ?? ""}
                        onChange={(e) => set_field("salary", e.target.value)}
                        placeholder="Enter salary amount"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Pay Frequency
                      </Label>
                      <GroupableRadioDropdown
                        name="pay_freq"
                        defaultValue={form_data.salary_freq_name}
                        options={job_pay_freq.map((jpf) => jpf.name)}
                        onChange={field_setter("salary_freq_name")}
                      />
                    </div>
                  </>
                )}
              </DropdownGroup>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Mark as Unlisted
                </Label>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Unlisted Job
                    </p>
                    <p className="text-xs text-gray-500">
                      Only visible to applicants with the link
                    </p>
                  </div>
                  <Checkbox
                    checked={form_data.is_unlisted ?? false}
                    onCheckedChange={(value) => set_field("is_unlisted", value)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Duration
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={form_data.is_year_round ?? false}
                      onCheckedChange={(value) => {
                        set_fields({
                          is_year_round: !!value,
                        });
                      }}
                    />
                    <span className="text-sm font-medium">Year Round</span>
                  </div>
                  {!form_data.is_year_round && (
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          Start Date
                        </label>
                        <DatePicker
                          id="start-date"
                          selected={
                            form_data.start_date
                              ? new Date(form_data.start_date)
                              : new Date()
                          }
                          className="input-box text-sm"
                          onChange={(date) =>
                            set_field("start_date", date?.getTime())
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          End Date
                        </label>
                        <DatePicker
                          id="end-date"
                          selected={
                            form_data.end_date
                              ? new Date(form_data.end_date)
                              : new Date()
                          }
                          className="input-box text-sm"
                          onChange={(date) =>
                            set_field("end_date", date?.getTime())
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Checkbox className="w-4 h-4 text-green-600" />
              </div>
              Application Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    GitHub Repository
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Require GitHub link
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_github ?? false}
                  onCheckedChange={(value) => {
                    set_field("require_github", value);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Portfolio
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Require portfolio link
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_portfolio ?? false}
                  onCheckedChange={(value) => {
                    set_field("require_portfolio", value);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Cover Letter
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Require cover letter
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_cover_letter ?? false}
                  onCheckedChange={(value) => {
                    set_field("require_cover_letter", value);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Content Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileEdit className="w-4 h-4 text-purple-600" />
                </div>
                Job Description
              </h3>
              <div className="relative">
                <MDXEditor
                  className="min-h-[250px] border border-gray-200 rounded-lg overflow-y-auto"
                  markdown={form_data.description ?? ""}
                  onChange={(value) => set_field("description", value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 pb-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                Requirements
              </h3>
              <div className="relative">
                <MDXEditor
                  className="min-h-[250px] w-full border border-gray-200 rounded-lg overflow-y-auto"
                  markdown={form_data.requirements ?? ""}
                  onChange={(value) => set_field("requirements", value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
