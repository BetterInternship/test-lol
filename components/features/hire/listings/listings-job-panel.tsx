import { EmployerJobCard } from "@/components/shared/jobs";
import { Job } from "@/lib/db/db.types";

interface ListingsJobPanelProps {
  jobs: Job[];
  selectedJobId?: string;
  isEditing: boolean;
  jobsPage: number;
  jobsPageSize: number;
  onJobSelect: (job: Job) => void;
  onPageChange: (page: number) => void;
  updateJob: (jobId: string, job: Partial<Job>) => Promise<any>;
}

export function ListingsJobPanel({
  jobs,
  selectedJobId,
  onJobSelect,
  updateJob,
}: ListingsJobPanelProps) {
  return (
    <div className="w-96 flex flex-col h-full max-w-[1024px] mx-auto">
      {/* Job Cards - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-4 border-r pt-4 pl-2">
        {jobs.map((job) => (
          <EmployerJobCard
            key={job.id}
            job={job}
            // @ts-ignore
            update_job={updateJob}
            on_click={() => onJobSelect(job)}
            selected={job.id === selectedJobId}
          />
        ))}
      </div>
    </div>
  );
}
