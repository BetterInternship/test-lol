"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Search, Plus } from "lucide-react";
import { useOwnedJobs, useProfile } from "@/hooks/use-employer-api";
import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { MDXEditor } from "@/components/MDXEditor";
import { useFormData } from "@/lib/form-data";
import { useModal } from "@/hooks/use-modal";
import { EmployerJobDetails, EmployerJobCard } from "@/components/shared/jobs";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/ui/dropdown";
import { useAuthContext } from "../authctx";
import "react-datepicker/dist/react-datepicker.css";
import ContentLayout from "@/components/features/hire/content-layout";
import { ShowUnverifiedBanner } from "@/components/ui/banner";
import {
  FormCheckbox,
  FormDatePicker,
  FormDropdown,
  FormInput,
} from "@/components/EditForm";

export default function MyListings() {
  // Get data from employer API hooks
  const { profile, loading: profileLoading } = useProfile();
  const { ownedJobs, create_job, update_job, delete_job } = useOwnedJobs();
  const { redirectIfNotLoggedIn } = useAuthContext();
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

  redirectIfNotLoggedIn();

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
          {/* Unverified Banner */}
          {!profileLoading && !profile?.is_verified && (
            <div className="p-6 pb-0">
              <ShowUnverifiedBanner />
            </div>
          )}
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
                    // @ts-ignore
                    update_job={update_job}
                    on_click={() => setSelectedJob(job)}
                    selected={job.id === selectedJob.id}
                  ></EmployerJobCard>
                ))}
              </div>
            </div>

            {/* Right Panel - Job Details */}
            {selectedJob?.id ? (
              <EmployerJobDetails
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
  const { formData, setField, setFields, fieldSetter } = useFormData<Job>();
  const { job_types, job_modes, job_pay_freq, job_allowances } = useRefs();

  const handleSaveEdit = async () => {
    const job: Partial<Job> = {
      id: formData.id,
      title: formData.title,
      description: formData.description ?? "",
      requirements: formData.requirements ?? "",
      location: formData.location ?? "",
      allowance: formData.allowance,
      mode: formData.mode,
      type: formData.type,
      salary: formData.allowance === 0 ? formData.salary : null,
      salary_freq: formData.allowance === 0 ? formData.salary_freq : null,
      require_github: formData.require_github,
      require_portfolio: formData.require_portfolio,
      require_cover_letter: formData.require_cover_letter,
      is_unlisted: formData.is_unlisted,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_year_round: formData.is_year_round,
    };

    console.log(job);
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

  return (
    <>
      <div className="px-6 py-5 border-b border-gray-200 w-[600px] bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {formData.title || "Untitled Job"}
              </h2>
              <Input
                value={formData.title || ""}
                onChange={(e) => setField("title", e.target.value)}
                className="text-lg font-medium h-12"
                placeholder="Enter job title here..."
              />
              <div className="flex flex-row gap-3 mt-4">
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
                <Button
                  variant="outline"
                  onClick={() => close()}
                  className="px-4 py-2 text-sm font-medium"
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with improved layout */}
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] ">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="">
            <div className="text-2xl tracking-tight font-medium text-gray-700 my-6 mt-3">
              Basic Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <FormInput
                  label="Location"
                  value={formData.location ?? ""}
                  maxLength={100}
                  setter={fieldSetter("location")}
                  required={false}
                />
              </div>

              <DropdownGroup>
                <div className="space-y-2">
                  <FormDropdown
                    label="Work Load"
                    value={formData.type ?? undefined}
                    options={job_types}
                    setter={fieldSetter("type")}
                  />
                </div>

                <div className="space-y-2">
                  <FormDropdown
                    label="Work Mode"
                    value={formData.mode ?? undefined}
                    options={job_modes}
                    setter={fieldSetter("mode")}
                  />
                </div>

                <div className="space-y-2">
                  <FormDropdown
                    label="Compensation"
                    value={formData.allowance ?? undefined}
                    options={job_allowances.reverse()}
                    setter={fieldSetter("allowance")}
                  />
                </div>

                {formData.allowance === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Salary <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.salary ?? ""}
                        onChange={(e) => setField("salary", e.target.value)}
                        placeholder="Enter salary amount"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Pay Frequency{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <GroupableRadioDropdown
                        name="pay_freq"
                        defaultValue={formData.salary_freq}
                        options={job_pay_freq}
                        onChange={fieldSetter("salary_freq")}
                      />
                    </div>
                  </>
                )}
              </DropdownGroup>
            </div>
            <div>
              <div className="space-y-3 w-full mt-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FormCheckbox
                      checked={formData.is_year_round ?? false}
                      setter={(value) =>
                        setFields({
                          is_year_round: !!value,
                        })
                      }
                    />
                    <span className="text-sm font-medium">Year Round</span>
                  </div>
                  {!formData.is_year_round && (
                    <div className="flex flex-row gap-4">
                      <FormDatePicker
                        label={"Start date"}
                        date={
                          formData.start_date
                            ? new Date(formData.start_date).getTime()
                            : new Date().getTime()
                        }
                        setter={fieldSetter("start_date")}
                      />
                      <FormDatePicker
                        label={"End date"}
                        date={
                          formData.end_date
                            ? new Date(formData.end_date).getTime()
                            : new Date().getTime()
                        }
                        setter={fieldSetter("end_date")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="">
              <div className="text-2xl tracking-tight font-medium text-gray-700 my-6">
                Job Description
              </div>
              <div className="relative">
                <MDXEditor
                  className="min-h-[500px] border border-gray-200 rounded-[0.33em] overflow-y-auto"
                  markdown={formData.description ?? ""}
                  onChange={(value) => setField("description", value)}
                />
              </div>
            </div>

            <div className="">
              <div className="text-2xl tracking-tight font-medium text-gray-700 my-6">
                Requirements
              </div>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-[0.33em] hover:border-gray-300 transition-colors">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">
                      GitHub Repository
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Require GitHub link
                    </p>
                  </div>
                  <FormCheckbox
                    checked={formData.require_github ?? false}
                    setter={fieldSetter("require_github")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-[0.33em] hover:border-gray-300 transition-colors">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">
                      Portfolio
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Require portfolio link
                    </p>
                  </div>
                  <FormCheckbox
                    checked={formData.require_portfolio ?? false}
                    setter={fieldSetter("require_portfolio")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-[0.33em] hover:border-gray-300 transition-colors">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">
                      Cover Letter
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Require cover letter
                    </p>
                  </div>
                  <FormCheckbox
                    checked={formData.require_cover_letter ?? false}
                    setter={fieldSetter("require_cover_letter")}
                  />
                </div>
              </div>
              <div className="relative">
                <MDXEditor
                  className="min-h-[500px] w-full border border-gray-200 rounded-[0.33em] overflow-y-auto"
                  markdown={formData.requirements ?? ""}
                  onChange={(value) => setField("requirements", value)}
                />
              </div>
            </div>

            <div className="space-y-3 mt-4 mb-12">
              <div className="text-2xl tracking-tight font-medium text-gray-700 my-6">
                Job Settings
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-[0.33em] hover:border-gray-300 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Unlisted Job
                  </p>
                  <p className="text-xs text-gray-500">
                    Only visible to applicants with the link
                  </p>
                </div>
                <FormCheckbox
                  checked={formData.is_unlisted ?? false}
                  setter={fieldSetter("is_unlisted")}
                />
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};
