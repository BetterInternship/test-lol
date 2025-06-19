import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { cn, formatDate } from "@/lib/utils";
import { Building, PhilippinePeso, MapPin, Monitor, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobModeIcon } from "@/components/ui/icons";
import ReactMarkdown from "react-markdown";
import { useFormData } from "@/lib/form-data";
import {
  EditableCheckbox,
  EditableGroupableRadioDropdown,
  EditableInput,
} from "@/components/ui/editable";
import { useEffect } from "react";
import { JobPropertyLabel, JobTitleLabel } from "../ui/labels";
import { MDXEditor } from "../MDXEditor";
import { useOwnedJobs } from "@/hooks/use-employer-api";
import { DropdownGroup } from "../ui/dropdown";

/**
 * The scrollable job card component.
 * Used in both hire and student UI.
 *
 * @component
 */
export const JobCard = ({
  job,
  selected,
  disabled,
  on_click,
}: {
  job: Job;
  selected?: boolean;
  disabled?: boolean;
  on_click?: (job: Job) => void;
}) => {
  const { ref_is_not_null, to_job_mode_name, to_job_type_name } = useRefs();

  return (
    <div
      key={job.id}
      onClick={() => on_click && on_click(job)}
      className={cn(
        "p-4 border-2 rounded-lg cursor-pointer transition-colors",
        selected && !disabled
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300",
        disabled ? "opacity-65 pointer-events-none hover:cursor-default" : ""
      )}
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
        {ref_is_not_null(job.mode) && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {to_job_mode_name(job.mode)}
          </span>
        )}
        {ref_is_not_null(job.type) && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {to_job_type_name(job.type)}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * The mobile version of the job card.
 *
 * @component
 */
export const MobileJobCard = ({
  job,
  on_click,
}: {
  job: Job;
  on_click: () => void;
}) => {
  const { ref_is_not_null, to_job_mode_name, to_job_type_name } = useRefs();
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 active:scale-[0.98]"
      onClick={on_click}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 text-base leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>{job.employer?.name}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 ml-2">
          {formatDate(job.created_at ?? "")}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {ref_is_not_null(job.type) && (
          <Badge variant="outline" className="text-xs">
            {to_job_type_name(job.type)}
          </Badge>
        )}
        {job.salary && (
          <Badge variant="outline" className="text-xs">
            <PhilippinePeso className="w-3 h-3 mr-1" />
            {job.salary}
          </Badge>
        )}
        {ref_is_not_null(job.mode) && (
          <Badge variant="outline" className="text-xs">
            <JobModeIcon mode={job.mode} />
            {to_job_mode_name(job.mode)}
          </Badge>
        )}
      </div>

      {/* Description Preview */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MapPin className="w-3 h-3" />
        <span>{job.location}</span>
      </div>
    </div>
  );
};

/**
 * The right panel that describes job details.
 *
 * @component
 */
export const EditableJobDetails = ({
  job,
  is_editing = false,
  set_is_editing = () => {},
  saving = false,
  actions = [],
}: {
  job: Job;
  is_editing: boolean;
  set_is_editing: (is_editing: boolean) => void;
  saving?: boolean;
  actions?: React.ReactNode[];
}) => {
  const { update_job } = useOwnedJobs();
  const {
    job_modes,
    job_types,
    job_pay_freq,
    to_job_mode_name,
    to_job_type_name,
    to_job_pay_freq_name,
    get_job_mode_by_name,
    get_job_type_by_name,
    get_job_pay_freq_by_name,
  } = useRefs();
  const { form_data, set_field, set_fields, field_setter } = useFormData<
    Job & {
      job_type_name: string | null;
      job_mode_name: string | null;
      job_pay_freq_name: string | null;
    }
  >();

  useEffect(() => {
    if (job) {
      set_fields({
        ...job,
        job_type_name: to_job_type_name(job.type),
        job_mode_name: to_job_mode_name(job.mode),
        job_pay_freq_name: to_job_pay_freq_name(job.salary_freq),
      });
    }
  }, [job, is_editing]);

  const clean_int = (s: string | undefined): number | undefined =>
    s && s.trim().length ? parseInt(s.trim()) : undefined;

  useEffect(() => {
    if (job) {
      const edited_job: Partial<Job> = {
        id: form_data.id,
        title: form_data.title ?? "",
        description: form_data.description ?? "",
        requirements: form_data.requirements ?? "",
        location: form_data.location ?? "",
        mode: clean_int(`${get_job_mode_by_name(form_data.job_mode_name)?.id}`),
        type: clean_int(`${get_job_type_by_name(form_data.job_type_name)?.id}`),
        salary: form_data.salary ?? null,
        salary_freq: clean_int(
          `${get_job_pay_freq_by_name(form_data.job_pay_freq_name)?.id}`
        ),
        require_github: form_data.require_github ?? false,
        require_portfolio: form_data.require_portfolio ?? false,
      };

      update_job(edited_job.id ?? "", edited_job).then(
        // @ts-ignore
        ({ job: updated_job }) => {
          if (updated_job) {
            set_is_editing(false);
            alert("Successfully updated job!");
          }
        }
      );
    }
  }, [saving]);

  return (
    <div className="flex-1 border-gray-200 rounded-lg ml-4 p-6 pt-10 overflow-y-auto">
      <div className="mb-6">
        <div className="max-w-prose">
          <EditableInput
            is_editing={is_editing}
            value={form_data.title ?? "Not specified"}
            setter={field_setter("title")}
          >
            <JobTitleLabel />
          </EditableInput>
        </div>
        <p className="text-gray-600 mb-1 mt-4">{job.employer?.name}</p>
        <p className="text-sm text-gray-500 mb-4">
          Listed on {formatDate(job.created_at ?? "")}
        </p>
        <div className="flex gap-3">{actions}</div>
      </div>

      {/* Job Details Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-start gap-3 max-w-prose">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              Location:
            </label>
            <EditableInput
              is_editing={is_editing}
              value={form_data.location ?? "Not specified"}
              setter={field_setter("location")}
            >
              <JobPropertyLabel />
            </EditableInput>
          </div>

          <DropdownGroup>
            <div className="flex flex-col items-start gap-3">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
                Mode:
              </label>
              <EditableGroupableRadioDropdown
                is_editing={is_editing}
                name={"job_mode"}
                value={form_data.job_mode_name}
                setter={field_setter("job_mode_name")}
                options={["Not specified", ...job_modes.map((jm) => jm.name)]}
              >
                <JobPropertyLabel />
              </EditableGroupableRadioDropdown>
            </div>

            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5" />
                Salary:
              </label>
              <EditableInput
                is_editing={is_editing}
                value={form_data.salary?.toString() ?? "Not specified"}
                setter={field_setter("salary")}
              >
                <JobPropertyLabel />
              </EditableInput>
              <EditableGroupableRadioDropdown
                name="pay_freq"
                is_editing={is_editing}
                value={form_data.job_pay_freq_name}
                options={[
                  "Not specified",
                  ...job_pay_freq.map((jpf) => jpf.name),
                ]}
                setter={field_setter("job_pay_freq_name")}
              >
                <JobPropertyLabel />
              </EditableGroupableRadioDropdown>
            </div>

            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                Employment Type:
              </label>
              <EditableGroupableRadioDropdown
                is_editing={is_editing}
                value={form_data.job_type_name}
                setter={field_setter("job_type_name")}
                name={"job_type"}
                options={["Not specified", ...job_types.map((jt) => jt.name)]}
              >
                <JobPropertyLabel />
              </EditableGroupableRadioDropdown>
            </div>
          </DropdownGroup>

          <EditableCheckbox
            is_editing={is_editing}
            name={"require_github"}
            value={form_data.require_github}
            setter={field_setter("require_github")}
            options={[]}
          ></EditableCheckbox>
        </div>
      </div>

      {/* Job Description */}
      <hr />
      <div className="mb-6 mt-8">
        <h1 className="text-3xl font-heading font-bold text-gray-700 mb-4">
          Description
        </h1>
        {!is_editing ? (
          <div className="markdown">
            <ReactMarkdown>{job.description?.replace("/", ";")}</ReactMarkdown>
          </div>
        ) : (
          <MDXEditor
            className="min-h-[300px] border border-gray-200 rounded-lg"
            markdown={form_data.description ?? ""}
            onChange={(value) => set_field("description", value)}
          />
        )}
      </div>

      {/* Job Requirements */}
      <hr />
      <div className="mb-6 mt-8">
        <h1 className="text-3xl font-heading font-bold text-gray-700 mb-4">
          Requirements
        </h1>
        {!is_editing ? (
          <div className="markdown">
            <ReactMarkdown>{job.requirements?.replace("/", ";")}</ReactMarkdown>
          </div>
        ) : (
          <MDXEditor
            className="min-h-[300px] border border-gray-200 rounded-lg"
            markdown={form_data.requirements ?? ""}
            onChange={(value) => set_field("requirements", value)}
          />
        )}
      </div>
    </div>
  );
};

/**
 * The right panel that describes job details.
 *
 * @component
 */
export const JobDetails = ({
  job,
  actions = [],
}: {
  job: Job;
  actions?: React.ReactNode[];
}) => {
  const { to_job_mode_name, to_job_type_name, to_job_pay_freq_name } =
    useRefs();

  // Returns a non-editable version of it
  return (
    <div className="flex-1 border-gray-200 rounded-lg ml-4 p-6 pt-10 overflow-y-auto">
      <div className="mb-6">
        <div className="max-w-prose">
          <JobTitleLabel value={job.title} />
        </div>
        <p className="text-gray-600 mb-1 mt-4">{job.employer?.name}</p>
        <p className="text-sm text-gray-500 mb-4">
          Listed on {formatDate(job.created_at ?? "")}
        </p>
        <div className="flex gap-3">{actions}</div>
      </div>

      {/* Job Details Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-start gap-3 max-w-prose">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              Location:
            </label>
            <JobPropertyLabel value={job.location} />
          </div>

          <DropdownGroup>
            <div className="flex flex-col items-start gap-3">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
                Mode:
              </label>
              <JobPropertyLabel value={to_job_mode_name(job.mode)} />
            </div>

            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5" />
                Salary:
              </label>
              <JobPropertyLabel value={job.salary?.toString()} />{" "}
              <JobPropertyLabel
                value={
                  job.salary_freq !== null && job.salary_freq !== undefined
                    ? to_job_pay_freq_name(job.salary_freq)
                    : null
                }
                fallback=""
              />
            </div>

            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                Employment Type:
              </label>
              <JobPropertyLabel value={to_job_type_name(job.type)} />
            </div>
          </DropdownGroup>

          {/* // ! checkbox labels */}
        </div>
      </div>

      {/* Job Description */}
      <hr />
      <div className="mb-6 mt-8">
        <h1 className="text-3xl font-heading font-bold text-gray-700 mb-4">
          Description
        </h1>
        <div className="markdown">
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>
      </div>

      {/* Job Requirements */}
      <hr />
      <div className="mb-6 mt-8">
        <h1 className="text-3xl font-heading font-bold text-gray-700 mb-4">
          Requirements
        </h1>
        <div className="markdown">
          <ReactMarkdown>{job.requirements}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
