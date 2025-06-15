"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  User,
  BarChart3,
  Search,
  FileText,
  MapPin,
  Clock,
  PhilippinePeso,
  Monitor,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Filter,
  X,
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

export default function MyListings() {
  const defaultDropdownValue = "Not specified";
  const { ownedJobs, update_job } = useOwnedJobs();
  const [updating, setUpdating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const {
    ref_loading,
    get_job_mode,
    get_job_type,
    get_job_pay_freq,
    get_job_mode_by_name,
    get_job_type_by_name,
    get_job_pay_freq_by_name,
    job_types,
    job_modes,
    job_pay_freq,
  } = useRefs();
  const [selectedJob, setSelectedJob] = useState<Job>({} as Job);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { form_data, set_field, set_fields, field_setter } = useFormData<{
    id: string;
    title: string;
    location: string;
    salary: string;
    salary_freq_name: string;
    mode_name: string;
    type_name: string;
    description: string;
    requirements: string;
    require_github: boolean;
    require_portfolio: boolean;
  }>();

  const handleEditJob = (job_id: string) => {
    // Find the job and populate form data
    const job = ownedJobs.find((j) => j.id === job_id);
    if (job) {
      set_fields({
        ...job,
        location: job.location ?? "",
        salary:
          ((job.salary || job.salary === 0) && job.salary + "") || undefined,
        salary_freq_name:
          get_job_pay_freq(job.salary_freq ?? -1)?.name ?? undefined,
        mode_name: get_job_mode(job.mode ?? -1)?.name ?? undefined,
        type_name: get_job_type(job.type ?? -1)?.name ?? undefined,
        requirements: job.requirements ?? "",
        require_github: job.require_github ?? false,
        require_portfolio: job.require_portfolio ?? false,
      });
      setIsEditModalOpen(true);
    }
  };

  const clean_int = (s: string | undefined): number | undefined =>
    s && s.trim().length ? parseInt(s.trim()) : undefined;
  const clean_num = (s: string | undefined): number | undefined =>
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
      salary: clean_num(form_data.salary),
      salary_freq: clean_int(
        `${get_job_pay_freq_by_name(form_data.salary_freq_name)?.id}`
      ),
      require_github: form_data.require_github,
      require_portfolio: form_data.require_portfolio,
    };

    setUpdating(true);
    // @ts-ignore
    const { job: updated_job, success } = await update_job(job.id ?? "", job);
    if (success) setSelectedJob(updated_job as Job);
    setUpdating(false);
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      ", " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0")
    );
  };

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
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedJob.id === job.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.location}</p>
                    <p className="text-sm text-gray-600">
                      {job.employer?.name ?? "Not known"}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Last updated on {formatDate(job.updated_at ?? "")}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {!ref_loading && !!job.mode && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {get_job_mode(job.mode)?.name ?? ""}
                        </span>
                      )}
                      {!ref_loading && !!job.type && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {get_job_type(job.type)?.name ?? ""}
                        </span>
                      )}
                    </div>
                  </div>
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
                  onClick={() => handleEditJob(selectedJob.id ?? "")}
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
                        {get_job_mode(selectedJob.mode ?? -1)?.name ??
                          "Not specified"}
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
                        {get_job_pay_freq(selectedJob.salary_freq ?? -1)?.name}
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
                        {get_job_type(selectedJob.type ?? -1)?.name ??
                          "Not specified"}
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
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-white rounded-xl border-0 shadow-2xl [&>button]:hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-normal text-gray-600">
                Editing Job Listing -{" "}
                <span className="font-bold text-gray-900">
                  {form_data.title}
                </span>
              </DialogTitle>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
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
              {/* Left Column - Basic Information */}
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
                        value={form_data.location}
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
                      value={form_data.salary}
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
                      checked={form_data.require_github}
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
                      checked={form_data.require_portfolio}
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
                      markdown={form_data.description}
                      onChange={(value) => set_field("description", value)}
                    ></MDXEditor>
                  </div>

                  <div className="relative z-50 w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 w-full">
                      Listing Requirements Editor
                    </h3>
                    <MDXEditor
                      className="[&_span]:relative mb-10"
                      markdown={form_data.requirements}
                      onChange={(value) => set_field("requirements", value)}
                    ></MDXEditor>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
