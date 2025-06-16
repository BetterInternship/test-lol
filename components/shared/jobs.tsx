import { Job } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Building, PhilippinePeso, MapPin, Monitor, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobModeIcon } from "@/components/ui/icons";
import ReactMarkdown from "react-markdown";

/**
 * The scrollable job card component.
 * Used in both hire and student UI.
 *
 * @component
 */
export const JobCard = ({
  job,
  selected,
  on_click,
}: {
  job: Job;
  selected?: boolean;
  on_click?: (job: Job) => void;
}) => {
  const { ref_is_not_null, to_job_mode_name, to_job_type_name } = useRefs();

  return (
    <div
      key={job.id}
      onClick={() => on_click && on_click(job)}
      className={cn(
        "p-4 border-2 rounded-lg cursor-pointer transition-colors",
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
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
export const JobDetails = ({
  job,
  actions = [],
}: {
  job: Job;
  actions?: React.ReactNode[];
}) => {
  const { to_job_mode_name, to_job_type_name, to_job_pay_freq_name } =
    useRefs();

  return (
    <div className="flex-1 border-gray-200 rounded-lg ml-4 p-6 pt-10 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
        <p className="text-gray-600 mb-1">{job.employer?.name}</p>
        <p className="text-sm text-gray-500 mb-4">
          Listed on {formatDate(job.created_at ?? "")}
        </p>
        <div className="flex gap-3">{actions}</div>
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
                  {job.location || "Not specified"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Mode: </span>
                <span className="opacity-80">{to_job_mode_name(job.mode)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <PhilippinePeso className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Salary: </span>
                <span className="opacity-80">
                  {job.salary || "Not specified"}{" "}
                  {to_job_pay_freq_name(job.salary_freq)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Employment Type: </span>
                <span className="opacity-80">{to_job_type_name(job.type)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <hr />
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <div className="markdown">
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>
      </div>

      {/* Job Requirements */}
      <hr />
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Requirements</h3>
        <div className="markdown">
          <ReactMarkdown>{job.requirements}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
