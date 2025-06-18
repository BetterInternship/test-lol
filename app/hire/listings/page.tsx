"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BarChart3, Search, FileText, FileEdit, Filter } from "lucide-react";
import Link from "next/link";
import { useOwnedJobs } from "@/hooks/use-employer-api";
import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { MDXEditor } from "@/components/MDXEditor";
import { useFormData } from "@/lib/form-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useModal } from "@/hooks/use-modal";
import { JobCard } from "@/components/shared/jobs";
import { JobDetails } from "@/components/shared/jobs";
import {
  DropdownGroup,
  GroupableRadioDropdown,
} from "@/components/ui/dropdown";

export default function MyListings() {
  const { ownedJobs, update_job } = useOwnedJobs();
  const [selectedJob, setSelectedJob] = useState<Job>({} as Job);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    open: open_edit_modal,
    close: close_edit_modal,
    Modal: EditModal,
  } = useModal("edit-modal");

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Pages</h2>
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              My Applications
            </Link>
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium">
              <FileText className="h-5 w-5" />
              My Listings
            </div>
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
        {/* Content Area */}
        <div className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Left Panel - Job List */}
          <div className="w-96 flex flex-col h-full">
            {/* Search Bar and Filter Button - Fixed */}
            <div
              className="flex gap-3 mb-4 flex-shrink-0"
              data-tour="job-filters"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search listings..."
                  className="pl-12 pr-4 h-12 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-900 placeholder:text-gray-400 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <Button
                className="h-12 w-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                size="icon"
                data-tour="filter-btn"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Job Cards - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0 border-r">
              {ownedJobs
                .sort((a, b) => {
                  return (
                    new Date(b.updated_at ?? "").getTime() -
                    new Date(a.updated_at ?? "").getTime()
                  );
                })
                .map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    on_click={() => setSelectedJob(job)}
                    selected={job.id === selectedJob.id}
                  ></JobCard>
                ))}
            </div>
          </div>

          {/* Right Panel - Job Details */}
          {selectedJob?.id ? (
            <JobDetails
              job={selectedJob}
              actions={[
                <Button variant="outline" onClick={() => open_edit_modal()}>
                  Edit
                </Button>,
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

      {/* Edit Job Modal */}
      <EditModal>
        <EditModalForm
          job={selectedJob}
          set_selected_job={setSelectedJob}
          update_job={update_job}
          close={() => close_edit_modal()}
        ></EditModalForm>
      </EditModal>
    </>
  );
}

const EditModalForm = ({
  job,
  set_selected_job,
  update_job,
  close,
}: {
  job: Job;
  set_selected_job: (job: Job) => void;
  update_job: (id: string, job: Job) => Promise<any>;
  close: () => void;
}) => {
  const defaultDropdownValue = "Not specified";
  const [updating, setUpdating] = useState(false);
  const { form_data, set_field, set_fields, field_setter } = useFormData<
    Job & { salary_freq_name: string; mode_name: string; type_name: string }
  >();
  const {
    to_job_mode_name,
    to_job_type_name,
    to_job_pay_freq_name,
    get_job_mode_by_name,
    get_job_type_by_name,
    get_job_pay_freq_by_name,
    job_types,
    job_modes,
    job_pay_freq,
  } = useRefs();

  useEffect(() => {
    if (job) {
      set_fields({
        ...job,
        location: job.location ?? "",
        salary: job.salary,
        salary_freq_name: to_job_pay_freq_name(job.salary_freq) ?? undefined,
        mode_name: to_job_mode_name(job.mode) ?? undefined,
        type_name: to_job_type_name(job.type) ?? undefined,
        requirements: job.requirements ?? "",
        require_github: job.require_github ?? false,
        require_portfolio: job.require_portfolio ?? false,
      });
    }
  }, [job]);

  const clean_int = (s: string | undefined): number | undefined =>
    s && s.trim().length ? parseInt(s.trim()) : undefined;
  const handleSaveEdit = async () => {
    const job: Partial<Job> = {
      id: form_data.id,
      title: form_data.title,
      description: form_data.description,
      requirements: form_data.requirements,
      location: form_data.location,
      mode: clean_int(`${get_job_mode_by_name(form_data.mode_name)?.id}`),
      type: clean_int(`${get_job_type_by_name(form_data.type_name)?.id}`),
      salary: form_data.salary,
      salary_freq: clean_int(
        `${get_job_pay_freq_by_name(form_data.salary_freq_name)?.id}`
      ),
      require_github: form_data.require_github,
      require_portfolio: form_data.require_portfolio,
    };

    setUpdating(true);
    const { job: updated_job, success } = await update_job(job.id ?? "", job);
    if (updated_job) set_selected_job(updated_job);
    setUpdating(false);
    close();
  };

  return (
    <>
      {/* Header with improved styling */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Edit Job Listing
            </h2>
            <p className="text-sm text-gray-600">
              {form_data.title || "Untitled Job"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => close()}
              className="px-5 py-2.5 text-sm font-medium border-gray-300 hover:bg-gray-50"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              disabled={updating}
              onClick={handleSaveEdit}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with improved layout */}
      <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] min-h-[60vh] bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Job Title
                </Label>
                <Input
                  value={form_data.title || ""}
                  onChange={(e) => set_field("title", e.target.value)}
                  placeholder="Enter job title"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  value={form_data.location ?? ""}
                  onChange={(e) => set_field("location", e.target.value)}
                  placeholder="Enter location"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <DropdownGroup>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Employment Type
                  </Label>
                  <GroupableRadioDropdown
                    name="type"
                    default_value={form_data.type_name}
                    options={[
                      defaultDropdownValue,
                      ...job_types.map((jt) => jt.name),
                    ]}
                    on_change={field_setter("type_name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Work Mode
                  </Label>
                  <GroupableRadioDropdown
                    name="mode"
                    default_value={form_data.mode_name}
                    options={[
                      defaultDropdownValue,
                      ...job_modes.map((jm) => jm.name),
                    ]}
                    on_change={field_setter("mode_name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Salary
                  </Label>
                  <Input
                    value={form_data.salary ?? ""}
                    onChange={(e) => set_field("salary", e.target.value)}
                    placeholder="Enter salary amount"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Pay Frequency
                  </Label>
                  <GroupableRadioDropdown
                    name="pay_freq"
                    default_value={form_data.salary_freq_name}
                    options={[
                      defaultDropdownValue,
                      ...job_pay_freq.map((jpf) => jpf.name),
                    ]}
                    on_change={field_setter("salary_freq_name")}
                  />
                </div>
              </DropdownGroup>
            </div>
          </div>

          {/* Requirements Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Checkbox className="w-4 h-4 text-green-600" />
              </div>
              Application Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    GitHub Repository Required
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Applicants must provide a GitHub link
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_github ?? false}
                  onCheckedChange={(value) =>
                    set_field("require_github", value)
                  }
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Portfolio Required
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Applicants must provide a portfolio link
                  </p>
                </div>
                <Checkbox
                  checked={form_data.require_portfolio ?? false}
                  onCheckedChange={(value) =>
                    set_field("require_portfolio", value)
                  }
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Content Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileEdit className="w-4 h-4 text-purple-600" />
                </div>
                Job Description
              </h3>
              <div className="relative">
                <MDXEditor
                  className="min-h-[300px] border border-gray-200 rounded-lg"
                  markdown={form_data.description ?? ""}
                  onChange={(value) => set_field("description", value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                Requirements
              </h3>
              <div className="relative">
                <MDXEditor
                  className="min-h-[300px] border border-gray-200 rounded-lg"
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
