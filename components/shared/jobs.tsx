import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { cn, formatDate } from "@/lib/utils";
import {
  Building,
  PhilippinePeso,
  MapPin,
  Monitor,
  Clock,
  Globe,
  Lock,
  EyeOff,
  CheckCircle,
} from "lucide-react";
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
import { JobBooleanLabel, JobPropertyLabel, JobTitleLabel } from "../ui/labels";
import { MDXEditor } from "../MDXEditor";
import { DropdownGroup } from "../ui/dropdown";
import { Button } from "../ui/button";

// Utility function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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
          ? "selected ring-2 ring-primary ring-offset-2"
          : "hover:shadow-lg hover:border-gray-300",
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600 font-medium">
                {job.employer?.name ?? "Company Name"}
              </p>

            </div>
          </div>
          {selected && (
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          )}
        </div>

        {job.location && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{job.location || "Location not specified"}</span>
          </div>
        )}


        <div className="flex flex-wrap gap-2">
          {true && (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              DLSU MOA
            </span>
          )}
          {ref_is_not_null(job.type) && (
            <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium border border-purple-200">
              {to_job_type_name(job.type)}
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
              ₱{job.salary}
            </span>
          )}
          {ref_is_not_null(job.mode) && (
            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
              {to_job_mode_name(job.mode)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * The scrollable job card component.
 * Used in both hire and student UI.
 *
 * @component
 */
export const EmployerJobCard = ({
  job,
  selected,
  disabled,
  on_click,
  update_job,
}: {
  job: Job;
  selected?: boolean;
  disabled?: boolean;
  on_click?: (job: Job) => void;
  update_job: (
    job_id: string,
    job: Partial<Job>
  ) => Promise<{ success: boolean }>;
}) => {
  const { ref_is_not_null, to_job_mode_name, to_job_type_name } = useRefs();

  return (
    <div
      key={job.id}
      onClick={() => on_click && on_click(job)}
      className={cn(
        "job-card group relative",
        selected && !disabled
          ? "selected ring-2 ring-primary ring-offset-2"
          : "hover:shadow-lg hover:border-gray-300",
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600 font-medium">
                {job.employer?.name ?? "Company Name"}
              </p>
              {true && (
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  DLSU MOA
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selected && (
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              onClick={async (e) => {
                e.stopPropagation();
                if (!job.id) return;
                await update_job(job.id, {
                  is_active: !job.is_active,
                });
              }}
            >
              {job.is_active ? (
                <Globe className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{job.location || "Location not specified"}</span>
        </div>



        <div className="flex flex-wrap gap-2">
          {true && (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              DLSU MOA
            </span>
          )}
          {job.is_unlisted && (
            <span className="inline-flex items-center px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium border border-orange-200">
              <EyeOff className="w-3 h-3 mr-1" />
              Unlisted
            </span>
          )}
          {ref_is_not_null(job.type) && (
            <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium border border-purple-200">
              {to_job_type_name(job.type)}
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
              ₱{job.salary}
            </span>
          )}
          {ref_is_not_null(job.mode) && (
            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
              {to_job_mode_name(job.mode)}
            </span>
          )}
          {!job.is_active && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
              <Lock className="w-3 h-3 mr-1" />
              Inactive
            </span>
          )}
        </div>
      </div>

      {!job.is_active && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-60 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <EyeOff className="w-8 h-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 font-medium">Inactive</p>
          </div>
        </div>
      )}
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
      className="card hover-lift p-6 animate-fade-in"
      onClick={on_click}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium truncate">{job.employer?.name}</span>
            {true && (
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                DLSU MOA
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 ml-3 flex-shrink-0">
          {formatDate(job.created_at ?? "")}
        </div>
      </div>

      {/* Location */}
      {job.location && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{job.location || "Location not specified"}</span>
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {true && (
          <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            DLSU MOA
          </Badge>
        )}
        {ref_is_not_null(job.type) && (
          <Badge variant="outline" className="text-xs border-purple-200 bg-purple-50 text-purple-700">
            {to_job_type_name(job.type)}
          </Badge>
        )}
        {job.salary && (
          <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700">
            ₱{job.salary}
          </Badge>
        )}
        {ref_is_not_null(job.mode) && (
          <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 text-blue-700">
            <JobModeIcon mode={job.mode} />
            {to_job_mode_name(job.mode)}
          </Badge>
        )}
      </div>

      {/* Description Preview */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
        {job.description || "No description available."}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {job.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{job.location}</span>
          </div>
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
export const EditableJobDetails = ({
  job,
  is_editing = false,
  set_is_editing = () => {},
  saving = false,
  update_job,
  actions = [],
}: {
  job: Job;
  is_editing: boolean;
  set_is_editing: (is_editing: boolean) => void;
  saving?: boolean;
  update_job: (
    job_id: string,
    job: Partial<Job>
  ) => Promise<{ success: boolean }>;
  actions?: React.ReactNode[];
}) => {
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
    if (job && saving) {
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
        require_github: form_data.require_github,
        require_portfolio: form_data.require_portfolio,
      };

      update_job(edited_job.id ?? "", edited_job).then(
        // @ts-ignore
        ({ job: updated_job }) => {
          if (updated_job) set_is_editing(false);
        }
      );
    }
  }, [saving]);

  return (
    <div className="flex-1 border-gray-200 rounded-lg ml-4 p-6 pt-10 overflow-y-auto overflow-x-hidden">
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
        <div className="flex items-center gap-2">
          <p className="text-gray-600 mb-1 mt-4">{job.employer?.name}</p>
        </div>
        <div className="flex gap-3">{actions}</div>
      </div>

      {/* Job Details Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="grid grid-cols-2 gap-6">
          {job.location && (
            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
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
          )}

          <DropdownGroup>
            <div className="flex flex-col items-start gap-3">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Monitor className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
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
                <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                Salary:
              </label>
              <EditableInput
                is_editing={is_editing}
                value={form_data.salary?.toString() ?? "Not specified"}
                setter={field_setter("salary")}
              >
                <JobPropertyLabel />
              </EditableInput>
              {form_data.salary_freq ||
                (form_data.salary_freq === 0 && (
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
                    <JobPropertyLabel fallback="" />
                  </EditableGroupableRadioDropdown>
                ))}
            </div>

            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
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

          <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-start gap-3 max-w-prose">
              <EditableCheckbox
                is_editing={is_editing}
                value={form_data.require_github}
                setter={field_setter("require_github")}
              >
                <JobBooleanLabel />
              </EditableCheckbox>
              <label className="text-sm font-semibold text-gray-700">
                Require Github
              </label>
            </div>

            <div className="flex flex-row items-start gap-3 max-w-prose">
              <EditableCheckbox
                is_editing={is_editing}
                value={form_data.require_portfolio}
                setter={field_setter("require_portfolio")}
              >
                <JobBooleanLabel />
              </EditableCheckbox>
              <label className="text-sm font-semibold text-gray-700">
                Require Portfolio
              </label>
            </div>

            <div className="flex flex-row items-start gap-3 max-w-prose">
              <EditableCheckbox
                is_editing={is_editing}
                value={form_data.is_unlisted}
                setter={field_setter("is_unlisted")}
              >
                <JobBooleanLabel />
              </EditableCheckbox>
              <label className="text-sm font-semibold text-gray-700">
                Unlisted
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description and Requirements - Side by Side */}
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
        
        {/* Application Requirements - Checkboxes */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Application Requirements:</h4>
          <div className="flex flex-wrap gap-4">
            {/* Resume - Always required */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Resume</span>
            </div>

            {/* GitHub Requirement */}
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                job.require_github ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {job.require_github && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm font-medium ${
                job.require_github ? 'text-gray-700' : 'text-gray-400'
              }`}>GitHub Profile</span>
            </div>

            {/* Portfolio Requirement */}
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                job.require_portfolio ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {job.require_portfolio && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm font-medium ${
                job.require_portfolio ? 'text-gray-700' : 'text-gray-400'
              }`}>Portfolio</span>
            </div>
          </div>
        </div>

        {/* Requirements Content */}
        {!is_editing ? (
          <div className="markdown">
            <ReactMarkdown>{job.requirements?.replace("/", ";") || "None"}</ReactMarkdown>
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
        <div className="flex items-center gap-2">
          <p className="text-gray-600 mb-1 mt-4">{job.employer?.name}</p>
        </div>

        <div className="flex gap-3">{actions}</div>
      </div>

      {/* Job Details Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="grid grid-cols-2 gap-6">
          {job.location && (
            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                Location:
              </label>
              <JobPropertyLabel value={job.location} />
            </div>
          )}

          <DropdownGroup>
            <div className="flex flex-col items-start gap-3">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Monitor className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                Mode:
              </label>
              <JobPropertyLabel value={to_job_mode_name(job.mode)} />
            </div>

            <div className="flex flex-col items-start gap-3 max-w-prose">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
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
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Description
        </h2>
        <div className="markdown prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed">
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>
      </div>

      {/* Job Requirements */}
      <hr />
      <div className="mb-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Requirements
        </h2>
        
        {/* Application Requirements - Checkboxes */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Application Requirements:</h4>
          <div className="flex flex-wrap gap-4">
            {/* Resume - Always required */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Resume</span>
            </div>

            {/* GitHub Requirement */}
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                job.require_github ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {job.require_github && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm font-medium ${
                job.require_github ? 'text-gray-700' : 'text-gray-400'
              }`}>GitHub Profile</span>
            </div>

            {/* Portfolio Requirement */}
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                job.require_portfolio ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {job.require_portfolio && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm font-medium ${
                job.require_portfolio ? 'text-gray-700' : 'text-gray-400'
              }`}>Portfolio</span>
            </div>
          </div>
        </div>

        {/* Requirements Content */}
        <div className="markdown prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed">
          <ReactMarkdown>{job.requirements || "None"}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
