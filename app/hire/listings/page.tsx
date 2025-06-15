"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  BarChart3,
  Search,
  FileText,
  MapPin,
  Clock,
  PhilippinePeso,
  Monitor,
  FileEdit,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useOwnedJobs } from "@/hooks/use-employer-api";
import { Job } from "@/lib/db/db.types";
import ProfileButton from "@/components/hire/profile-button";
import { useRefs } from "@/lib/db/use-refs";
import { MDXEditor } from "@/components/MDXEditor";
import ReactMarkdown from "react-markdown";
import { RefDropdown } from "@/components/ui/ref-dropdown";
import { useFormData } from "@/lib/form-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useModal } from "@/hooks/use-modal";
import { JobCard } from "@/components/shared/jobs";
import { formatDate } from "@/lib/utils";

export default function MyListings() {
  const { ownedJobs, update_job } = useOwnedJobs();
  const { to_job_mode_name, to_job_type_name, to_job_pay_freq_name } =
    useRefs();
  const [selectedJob, setSelectedJob] = useState<Job>({} as Job);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    open: open_edit_modal,
    close: close_edit_modal,
    Modal: EditModal,
  } = useModal("edit-modal");

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
        </div>

        <div className="px-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Pages</h2>
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard
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
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Your Listings</h1>
          <div className="flex items-center gap-3">
            <ProfileButton></ProfileButton>
          </div>
        </div>

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
            <div
              className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0"
              data-tour="job-cards"
            >
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
          <div className="flex-1 border-2 border-gray-200 rounded-lg p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedJob.title}
              </h2>
              <p className="text-gray-600 mb-1">{selectedJob.employer?.name}</p>
              <p className="text-sm text-gray-500 mb-4">
                Listed on {formatDate(selectedJob.created_at ?? "")}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => open_edit_modal()}
                  data-tour="bulk-actions"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Location: </span>
                      <span className="opacity-80">
                        {selectedJob.location || "Not specified"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Mode: </span>
                      <span className="opacity-80">
                        {to_job_mode_name(selectedJob.mode)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Salary: </span>
                      <span className="opacity-80">
                        {selectedJob.salary || "Not specified"}{" "}
                        {to_job_pay_freq_name(selectedJob.salary_freq)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Employment Type: </span>
                      <span className="opacity-80">
                        {to_job_type_name(selectedJob.type)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <hr />
            <div className="mb-6">
              <div className="markdown">
                <ReactMarkdown>{selectedJob.description}</ReactMarkdown>
              </div>
            </div>

            {/* Job Requirements */}
            <hr />
            <div className="mb-6">
              <div className="markdown">
                <ReactMarkdown>{selectedJob.requirements}</ReactMarkdown>
              </div>
            </div>
          </div>
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
    </div>
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
  const { form_data, set_field, set_fields } = useFormData<
    Job & { salary_freq_name: string; mode_name: string; type_name: string }
  >();
  const [activeDropdown, setActiveDropdown] = useState("");
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
  }, []);

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
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-normal text-gray-600">
            Editing Job Listing -{" "}
            <span className="font-bold text-gray-900">{form_data.title}</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => close()}
              className="px-4 py-2 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              disabled={updating}
              onClick={handleSaveEdit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] min-h-[60vh]">
        <div className="grid grid-cols-1">
          <div className="">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              General Listing Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <Label
                    htmlFor="edit-job-title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Listing Title
                  </Label>
                  <Input
                    id="edit-job-title"
                    value={form_data.title}
                    onChange={(e) => set_field("title", e.target.value)}
                    placeholder="Enter job title"
                    className="mt-1 h-10"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="edit-location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={form_data.location ?? ""}
                    onChange={(e) => set_field("location", e.target.value)}
                    placeholder="Enter location"
                    className="mt-1 h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <Label
                    htmlFor="edit-job-title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Type
                  </Label>
                  <RefDropdown
                    name="type"
                    defaultValue={defaultDropdownValue}
                    value={form_data.type_name}
                    options={[
                      "Not specified",
                      ...job_types.map((jt) => jt.name),
                    ]}
                    activeDropdown={activeDropdown}
                    validFieldClassName={""}
                    onChange={(value) => set_field("type_name", value)}
                    onClick={() => setActiveDropdown("type")}
                  ></RefDropdown>
                </div>

                <div className="z-[90]">
                  <Label
                    htmlFor="edit-location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mode
                  </Label>
                  <RefDropdown
                    name="mode"
                    defaultValue={defaultDropdownValue}
                    value={form_data.mode_name}
                    options={[
                      "Not specified",
                      ...job_modes.map((jm) => jm.name),
                    ]}
                    activeDropdown={activeDropdown}
                    validFieldClassName={""}
                    onChange={(value) => set_field("mode_name", value)}
                    onClick={() => setActiveDropdown("mode")}
                  ></RefDropdown>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 mt-2">
              <div>
                <Label
                  htmlFor="edit-job-title"
                  className="text-sm font-medium text-gray-700"
                >
                  Salary
                </Label>
                <Input
                  id="edit-salary"
                  value={form_data.salary ?? ""}
                  onChange={(e) => set_field("salary", e.target.value)}
                  placeholder="Enter salary"
                  className="mt-1 h-10"
                />
              </div>

              <div>
                <Label
                  htmlFor="edit-location"
                  className="text-sm font-medium text-gray-700"
                >
                  Frequency
                </Label>
                <RefDropdown
                  name="pay_freq"
                  defaultValue={defaultDropdownValue}
                  value={form_data.salary_freq_name}
                  options={[
                    "Not specified",
                    ...job_pay_freq.map((jpf) => jpf.name),
                  ]}
                  activeDropdown={activeDropdown}
                  validFieldClassName={""}
                  onChange={(value) => set_field("salary_freq_name", value)}
                  onClick={() => setActiveDropdown("pay_freq")}
                ></RefDropdown>
              </div>
            </div>
            <br />

            <div className="grid grid-rows-2 gap-y-4 mt-2 w-1/2 pr-2">
              <div className="flex flex-row justify-between border-2 rounded-md">
                <Label
                  htmlFor="edit-job-title"
                  className="text-sm font-medium text-gray-700 p-2"
                >
                  Require Github?
                </Label>
                <Checkbox
                  checked={form_data.require_github ?? false}
                  className="inline-block p-3 m-1"
                  onCheckedChange={(value) =>
                    set_field("require_github", value)
                  }
                ></Checkbox>
              </div>

              <div className="flex flex-row justify-between border-2 rounded-md">
                <Label
                  htmlFor="edit-location"
                  className="text-sm font-medium text-gray-700 p-2"
                >
                  Require Portfolio?
                </Label>
                <Checkbox
                  checked={form_data.require_portfolio ?? false}
                  className="inline-block p-3 m-1"
                  onCheckedChange={(value) =>
                    set_field("require_portfolio", value)
                  }
                ></Checkbox>
              </div>
            </div>
            <br />

            <div className="grid grid-cols-2 space-x-4">
              <div className="relative z-50 w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 w-full">
                  Listing Description Editor
                </h3>
                <MDXEditor
                  className="[&_span]:relative mb-10"
                  markdown={form_data.description ?? ""}
                  onChange={(value) => set_field("description", value)}
                ></MDXEditor>
              </div>

              <div className="relative z-50 w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 w-full">
                  Listing Requirements Editor
                </h3>
                <MDXEditor
                  className="[&_span]:relative mb-10"
                  markdown={form_data.requirements ?? ""}
                  onChange={(value) => set_field("requirements", value)}
                ></MDXEditor>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
